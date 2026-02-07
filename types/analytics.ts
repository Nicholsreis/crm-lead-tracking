// Analytics types
import { LeadStatus } from './lead'

export interface DashboardMetrics {
  total_leads: number
  active_leads: number
  conversion_rate: number
  average_response_time: number
  response_rate: number
  leads_by_status: Record<LeadStatus, number>
}

export interface SalesFunnelData {
  stage: string
  count: number
  conversion_rate: number
}

export interface LeadsBySource {
  source: string
  count: number
  percentage: number
}

export interface AgentPerformance {
  agent_id: string
  agent_name: string
  total_leads: number
  converted_leads: number
  conversion_rate: number
  average_response_time: number
  response_rate: number
}
