import { SupabaseClient } from '@supabase/supabase-js'
import type {
  Lead,
  CreateLeadRequest,
  UpdateLeadRequest,
  LeadFilters,
  PaginatedResponse,
  Note,
} from '@/types'

export class LeadService {
  constructor(private supabase: SupabaseClient) {}

  async createLead(data: CreateLeadRequest): Promise<Lead> {
    // Check if lead already exists
    const { data: existing } = await this.supabase
      .from('leads')
      .select('*')
      .eq('phone', data.phone)
      .single()

    if (existing) {
      // Update existing lead
      const { data: updated, error } = await this.supabase
        .from('leads')
        .update({
          name: data.name || existing.name,
          interest: data.interest || existing.interest,
          metadata: { ...existing.metadata, ...data.metadata },
          last_contact_at: new Date().toISOString(),
        })
        .eq('id', existing.id)
        .select()
        .single()

      if (error) throw error
      return updated
    }

    // Create new lead
    const { data: lead, error } = await this.supabase
      .from('leads')
      .insert({
        phone: data.phone,
        name: data.name,
        source: data.source,
        interest: data.interest,
        metadata: data.metadata || {},
        status: 'novo',
        last_contact_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) throw error
    return lead
  }

  async updateLead(id: string, data: UpdateLeadRequest): Promise<Lead> {
    const { data: lead, error } = await this.supabase
      .from('leads')
      .update(data)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return lead
  }

  async getLead(id: string): Promise<Lead | null> {
    const { data, error } = await this.supabase.from('leads').select('*').eq('id', id).single()

    if (error) {
      if (error.code === 'PGRST116') return null
      throw error
    }
    return data
  }

  async getLeads(
    filters: LeadFilters,
    page: number = 1,
    limit: number = 50
  ): Promise<PaginatedResponse<Lead>> {
    let query = this.supabase.from('leads').select('*', { count: 'exact' })

    // Apply filters
    if (filters.status && filters.status.length > 0) {
      query = query.in('status', filters.status)
    }

    if (filters.assigned_to) {
      query = query.eq('assigned_to', filters.assigned_to)
    }

    if (filters.tags && filters.tags.length > 0) {
      query = query.contains('tags', filters.tags)
    }

    if (filters.date_from) {
      query = query.gte('created_at', filters.date_from)
    }

    if (filters.date_to) {
      query = query.lte('created_at', filters.date_to)
    }

    if (filters.search) {
      query = query.or(`name.ilike.%${filters.search}%,phone.ilike.%${filters.search}%`)
    }

    // Apply pagination and ordering
    const from = (page - 1) * limit
    const to = from + limit - 1

    query = query.order('created_at', { ascending: false }).range(from, to)

    const { data, error, count } = await query

    if (error) throw error

    return {
      data: data || [],
      total: count || 0,
      page,
      limit,
      has_more: count ? count > page * limit : false,
    }
  }

  async deleteLead(id: string): Promise<void> {
    const { error } = await this.supabase.from('leads').delete().eq('id', id)
    if (error) throw error
  }

  async assignLead(leadId: string, userId: string): Promise<void> {
    const { error } = await this.supabase
      .from('leads')
      .update({ assigned_to: userId })
      .eq('id', leadId)

    if (error) throw error
  }

  async addNote(leadId: string, content: string, authorId: string): Promise<Note> {
    const { data, error } = await this.supabase
      .from('notes')
      .insert({
        lead_id: leadId,
        content,
        author_id: authorId,
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  async addTag(leadId: string, tag: string): Promise<void> {
    const lead = await this.getLead(leadId)
    if (!lead) throw new Error('Lead not found')

    const tags = [...new Set([...lead.tags, tag])]

    const { error } = await this.supabase.from('leads').update({ tags }).eq('id', leadId)

    if (error) throw error
  }

  async removeTag(leadId: string, tag: string): Promise<void> {
    const lead = await this.getLead(leadId)
    if (!lead) throw new Error('Lead not found')

    const tags = lead.tags.filter((t) => t !== tag)

    const { error } = await this.supabase.from('leads').update({ tags }).eq('id', leadId)

    if (error) throw error
  }
}
