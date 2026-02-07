import { SupabaseClient } from '@supabase/supabase-js'
import type { Notification, NotificationType } from '@/types'

export class NotificationService {
  constructor(private supabase: SupabaseClient) {}

  async createNotification(data: {
    user_id: string
    type: NotificationType
    title: string
    message: string
    lead_id?: string
  }): Promise<Notification> {
    const { data: notification, error } = await this.supabase
      .from('notifications')
      .insert({
        user_id: data.user_id,
        type: data.type,
        title: data.title,
        message: data.message,
        lead_id: data.lead_id || null,
        read: false,
      })
      .select()
      .single()

    if (error) throw error
    return notification
  }

  async getNotifications(userId: string, unreadOnly: boolean = false): Promise<Notification[]> {
    let query = this.supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (unreadOnly) {
      query = query.eq('read', false)
    }

    const { data, error } = await query

    if (error) throw error
    return data || []
  }

  async markAsRead(notificationId: string): Promise<void> {
    const { error } = await this.supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId)

    if (error) throw error
  }

  async markAllAsRead(userId: string): Promise<void> {
    const { error } = await this.supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', userId)
      .eq('read', false)

    if (error) throw error
  }

  async getUnreadCount(userId: string): Promise<number> {
    const { count, error } = await this.supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('read', false)

    if (error) throw error
    return count || 0
  }
}
