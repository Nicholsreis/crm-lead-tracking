// Lead types
export type LeadStatus = 'novo' | 'em_atendimento' | 'qualificado' | 'perdido' | 'convertido'

export interface Lead {
  id: string
  phone: string
  name: string | null
  status: LeadStatus
  created_at: string
  updated_at: string
  assigned_to: string | null
  tags: string[]
  metadata: Record<string, any>
  source: string
  interest: string | null
  last_contact_at: string | null
}

export interface Message {
  id: string
  lead_id: string
  content: string
  sender_type: 'lead' | 'agent' | 'system'
  timestamp: string
  media_url: string | null
  media_type: 'image' | 'audio' | 'document' | null
  metadata: Record<string, any>
}

export interface Note {
  id: string
  lead_id: string
  content: string
  author_id: string
  created_at: string
}

export interface LeadActivity {
  id: string
  lead_id: string
  activity_type: 'status_change' | 'assignment' | 'note_added' | 'tag_added'
  description: string
  user_id: string | null
  timestamp: string
  metadata: Record<string, any>
}

export interface Tag {
  id: string
  name: string
  color: string
  created_at: string
}
