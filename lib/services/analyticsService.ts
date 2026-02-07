import { SupabaseClient } from '@supabase/supabase-js'
import type {
  DashboardMetrics,
  SalesFunnelData,
  LeadsBySource,
  AgentPerformance,
  LeadStatus,
} from '@/types'

export class AnalyticsService {
  constructor(private supabase: SupabaseClient) {}

  async getDashboardMetrics(): Promise<DashboardMetrics> {
    // Get total leads
    const { count: totalLeads } = await this.supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })

    // Get active leads (novo + em_atendimento)
    const { count: activeLeads } = await this.supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .in('status', ['novo', 'em_atendimento'])

    // Get leads by status
    const { data: statusData } = await this.supabase.from('leads').select('status')

    const leadsByStatus: Record<LeadStatus, number> = {
      novo: 0,
      em_atendimento: 0,
      qualificado: 0,
      perdido: 0,
      convertido: 0,
    }

    statusData?.forEach((lead) => {
      leadsByStatus[lead.status as LeadStatus]++
    })

    // Calculate conversion rate
    const conversionRate =
      totalLeads && totalLeads > 0 ? (leadsByStatus.convertido / totalLeads) * 100 : 0

    // Calculate average response time and response rate
    const { averageResponseTime, responseRate } = await this.calculateResponseMetrics()

    return {
      total_leads: totalLeads || 0,
      active_leads: activeLeads || 0,
      conversion_rate: Math.round(conversionRate * 100) / 100,
      average_response_time: averageResponseTime,
      response_rate: responseRate,
      leads_by_status: leadsByStatus,
    }
  }

  async getConversionRate(dateFrom?: Date, dateTo?: Date): Promise<number> {
    let query = this.supabase.from('leads').select('status', { count: 'exact' })

    if (dateFrom) {
      query = query.gte('created_at', dateFrom.toISOString())
    }
    if (dateTo) {
      query = query.lte('created_at', dateTo.toISOString())
    }

    const { count: total } = await query
    const { count: converted } = await query.eq('status', 'convertido')

    return total && total > 0 ? (converted! / total) * 100 : 0
  }

  async getAverageResponseTime(): Promise<number> {
    const { averageResponseTime } = await this.calculateResponseMetrics()
    return averageResponseTime
  }

  private async calculateResponseMetrics(): Promise<{
    averageResponseTime: number
    responseRate: number
  }> {
    // Get all leads with their first message
    const { data: leads } = await this.supabase.from('leads').select('id, created_at')

    if (!leads || leads.length === 0) {
      return { averageResponseTime: 0, responseRate: 0 }
    }

    let totalResponseTime = 0
    let leadsWithResponse = 0

    for (const lead of leads) {
      // Get first agent message
      const { data: firstAgentMessage } = await this.supabase
        .from('messages')
        .select('timestamp')
        .eq('lead_id', lead.id)
        .eq('sender_type', 'agent')
        .order('timestamp', { ascending: true })
        .limit(1)
        .single()

      if (firstAgentMessage) {
        leadsWithResponse++
        const responseTime =
          new Date(firstAgentMessage.timestamp).getTime() - new Date(lead.created_at).getTime()
        totalResponseTime += responseTime
      }
    }

    const averageResponseTime =
      leadsWithResponse > 0 ? totalResponseTime / leadsWithResponse / 1000 / 60 : 0 // in minutes
    const responseRate = (leadsWithResponse / leads.length) * 100

    return {
      averageResponseTime: Math.round(averageResponseTime),
      responseRate: Math.round(responseRate * 100) / 100,
    }
  }

  async getSalesFunnelData(): Promise<SalesFunnelData[]> {
    const { data } = await this.supabase.from('leads').select('status')

    const statusCounts: Record<string, number> = {}
    data?.forEach((lead) => {
      statusCounts[lead.status] = (statusCounts[lead.status] || 0) + 1
    })

    const total = data?.length || 0
    const funnel: SalesFunnelData[] = [
      {
        stage: 'Novo',
        count: statusCounts['novo'] || 0,
        conversion_rate: 100,
      },
      {
        stage: 'Em Atendimento',
        count: statusCounts['em_atendimento'] || 0,
        conversion_rate: total > 0 ? ((statusCounts['em_atendimento'] || 0) / total) * 100 : 0,
      },
      {
        stage: 'Qualificado',
        count: statusCounts['qualificado'] || 0,
        conversion_rate: total > 0 ? ((statusCounts['qualificado'] || 0) / total) * 100 : 0,
      },
      {
        stage: 'Convertido',
        count: statusCounts['convertido'] || 0,
        conversion_rate: total > 0 ? ((statusCounts['convertido'] || 0) / total) * 100 : 0,
      },
    ]

    return funnel
  }

  async getLeadsBySource(): Promise<LeadsBySource[]> {
    const { data } = await this.supabase.from('leads').select('source')

    const sourceCounts: Record<string, number> = {}
    data?.forEach((lead) => {
      sourceCounts[lead.source] = (sourceCounts[lead.source] || 0) + 1
    })

    const total = data?.length || 0

    return Object.entries(sourceCounts).map(([source, count]) => ({
      source,
      count,
      percentage: total > 0 ? Math.round((count / total) * 10000) / 100 : 0,
    }))
  }

  async getPerformanceByAgent(): Promise<AgentPerformance[]> {
    const { data: leads } = await this.supabase
      .from('leads')
      .select('assigned_to, status')
      .not('assigned_to', 'is', null)

    if (!leads) return []

    const agentStats: Record<
      string,
      { total: number; converted: number; name: string }
    > = {}

    leads.forEach((lead) => {
      const agentId = lead.assigned_to!
      if (!agentStats[agentId]) {
        agentStats[agentId] = { total: 0, converted: 0, name: agentId }
      }
      agentStats[agentId].total++
      if (lead.status === 'convertido') {
        agentStats[agentId].converted++
      }
    })

    return Object.entries(agentStats).map(([agentId, stats]) => ({
      agent_id: agentId,
      agent_name: stats.name,
      total_leads: stats.total,
      converted_leads: stats.converted,
      conversion_rate: stats.total > 0 ? (stats.converted / stats.total) * 100 : 0,
      average_response_time: 0, // TODO: Calculate from messages
      response_rate: 0, // TODO: Calculate from messages
    }))
  }
}
