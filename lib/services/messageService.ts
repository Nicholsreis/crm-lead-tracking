import { SupabaseClient } from '@supabase/supabase-js'
import type { Message } from '@/types'

export class MessageService {
  constructor(private supabase: SupabaseClient) {}

  async createMessage(
    leadId: string,
    content: string,
    senderType: Message['sender_type'],
    mediaUrl?: string,
    mediaType?: Message['media_type']
  ): Promise<Message> {
    const { data, error } = await this.supabase
      .from('messages')
      .insert({
        lead_id: leadId,
        content,
        sender_type: senderType,
        media_url: mediaUrl || null,
        media_type: mediaType || null,
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  async getMessages(leadId: string): Promise<Message[]> {
    const { data, error } = await this.supabase
      .from('messages')
      .select('*')
      .eq('lead_id', leadId)
      .order('timestamp', { ascending: true })

    if (error) throw error
    return data || []
  }

  async getMessagesByDateRange(leadId: string, from: Date, to: Date): Promise<Message[]> {
    const { data, error } = await this.supabase
      .from('messages')
      .select('*')
      .eq('lead_id', leadId)
      .gte('timestamp', from.toISOString())
      .lte('timestamp', to.toISOString())
      .order('timestamp', { ascending: true })

    if (error) throw error
    return data || []
  }
}
