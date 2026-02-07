import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { LeadService } from '@/lib/services/leadService'
import { MessageService } from '@/lib/services/messageService'
import { NotificationService } from '@/lib/services/notificationService'
import { webhookPayloadSchema, formatZodErrors } from '@/lib/utils/validators'

export async function POST(request: NextRequest) {
  try {
    // Validate authentication token
    const authHeader = request.headers.get('authorization')
    const expectedToken = `Bearer U5tQR4j9wOGYAyCD7nviuZ1BLkTNb8dc`

    console.log('Auth Header:', authHeader)
    console.log('Expected Token:', expectedToken)

    if (!authHeader || authHeader !== expectedToken) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    // Parse payload
    const body = await request.json()
    console.log('Received payload:', JSON.stringify(body, null, 2))

    // Basic validation
    if (!body.phone || !body.message || !body.timestamp) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid payload',
          details: ['phone, message, and timestamp are required'],
        },
        { status: 400 }
      )
    }

    const payload = body
    const supabase = await createClient()

    // Initialize services
    const leadService = new LeadService(supabase)
    const messageService = new MessageService(supabase)
    const notificationService = new NotificationService(supabase)

    // Create or update lead
    const lead = await leadService.createLead({
      phone: payload.phone,
      name: payload.name,
      source: 'whatsapp',
      interest: payload.metadata?.interest,
      metadata: {
        ...payload.metadata,
        tool_used: payload.tool_used,
        last_message: payload.message,
      },
    })

    // Create message from lead
    await messageService.createMessage(
      lead.id,
      payload.message,
      'lead',
      payload.media?.url,
      payload.media?.type
    )

    // Create agent response message if exists
    if (payload.agent_response) {
      await messageService.createMessage(lead.id, payload.agent_response, 'agent')
    }

    // Create notification for new lead (only if it's a new lead)
    if (lead.status === 'novo') {
      // Get all users to notify (in a real app, you'd filter by role/permissions)
      const { data: users } = await supabase.auth.admin.listUsers()

      if (users?.users) {
        for (const user of users.users) {
          await notificationService.createNotification({
            user_id: user.id,
            type: 'new_lead',
            title: 'Novo Lead',
            message: `Lead ${lead.name || lead.phone} iniciou contato`,
            lead_id: lead.id,
          })
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        lead_id: lead.id,
        status: lead.status,
      },
    })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
