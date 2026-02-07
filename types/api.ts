// API types
import { Lead, LeadStatus } from './lead'

// Webhook payload do n8n
export interface WebhookPayload {
  phone: string
  name?: string
  message: string
  timestamp: string
  agent_response?: string
  tool_used?: 'recado' | 'cadastro'
  media?: {
    type: 'image' | 'audio' | 'document'
    url: string
  }
  metadata?: Record<string, any>
}

// Request/Response types
export interface CreateLeadRequest {
  phone: string
  name?: string
  source: string
  interest?: string
  metadata?: Record<string, any>
}

export interface UpdateLeadRequest {
  name?: string
  status?: LeadStatus
  assigned_to?: string | null
  tags?: string[]
  interest?: string
}

export interface LeadFilters {
  status?: LeadStatus[]
  assigned_to?: string
  tags?: string[]
  date_from?: string
  date_to?: string
  search?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  has_more: boolean
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface ExportOptions {
  format: 'csv' | 'excel'
  filters?: LeadFilters
}
