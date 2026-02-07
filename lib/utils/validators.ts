import { z } from 'zod'

// Phone validation schema
export const phoneSchema = z
  .string()
  .regex(/^\+?[1-9]\d{1,14}$/, 'Telefone inválido. Use formato internacional (+5511999999999)')
  .min(10, 'Telefone muito curto')
  .max(20, 'Telefone muito longo')

// Lead status schema
export const leadStatusSchema = z.enum([
  'novo',
  'em_atendimento',
  'qualificado',
  'perdido',
  'convertido',
])

// Create lead schema
export const createLeadSchema = z.object({
  phone: phoneSchema,
  name: z.string().min(2, 'Nome muito curto').max(255, 'Nome muito longo').optional(),
  source: z.string().min(1, 'Origem é obrigatória').max(100, 'Origem muito longa'),
  interest: z.string().max(500, 'Interesse muito longo').optional(),
  metadata: z.record(z.string(), z.any()).optional(),
})

// Update lead schema
export const updateLeadSchema = z.object({
  name: z.string().min(2, 'Nome muito curto').max(255, 'Nome muito longo').optional(),
  status: leadStatusSchema.optional(),
  assigned_to: z.string().uuid('ID de usuário inválido').nullable().optional(),
  tags: z.array(z.string()).optional(),
  interest: z.string().max(500, 'Interesse muito longo').optional(),
})

// Webhook payload schema
export const webhookPayloadSchema = z.object({
  phone: phoneSchema,
  name: z.string().optional(),
  message: z.string().min(1, 'Mensagem é obrigatória'),
  timestamp: z.string().datetime('Timestamp inválido'),
  agent_response: z.string().optional(),
  tool_used: z.enum(['recado', 'cadastro']).optional(),
  media: z
    .object({
      type: z.enum(['image', 'audio', 'document']),
      url: z.string().url('URL de mídia inválida'),
    })
    .optional(),
  metadata: z.record(z.string(), z.any()).optional(),
})

// Lead filters schema
export const leadFiltersSchema = z.object({
  status: z.array(leadStatusSchema).optional(),
  assigned_to: z.string().uuid().optional(),
  tags: z.array(z.string()).optional(),
  date_from: z.string().datetime().optional(),
  date_to: z.string().datetime().optional(),
  search: z.string().optional(),
})

// Note creation schema
export const createNoteSchema = z.object({
  lead_id: z.string().uuid('ID de lead inválido'),
  content: z.string().min(1, 'Conteúdo é obrigatório').max(5000, 'Nota muito longa'),
})

// Tag creation schema
export const createTagSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(100, 'Nome muito longo'),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Cor inválida. Use formato hexadecimal (#RRGGBB)'),
})

// Pagination schema
export const paginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(50),
})

// Export options schema
export const exportOptionsSchema = z.object({
  format: z.enum(['csv', 'excel']),
  filters: leadFiltersSchema.optional(),
})

// Helper function to validate data
export function validateData<T>(schema: z.ZodSchema<T>, data: unknown): {
  success: boolean
  data?: T
  errors?: z.ZodError
} {
  try {
    const validatedData = schema.parse(data)
    return { success: true, data: validatedData }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error }
    }
    throw error
  }
}

// Helper function to format Zod errors
export function formatZodErrors(errors: z.ZodError): string[] {
  return errors.errors.map((err) => {
    const path = err.path.join('.')
    return path ? `${path}: ${err.message}` : err.message
  })
}
