// Notification types
export type NotificationType = 'new_lead' | 'lead_assigned' | 'status_change' | 'mention'

export interface Notification {
  id: string
  user_id: string
  type: NotificationType
  title: string
  message: string
  lead_id: string | null
  read: boolean
  created_at: string
}
