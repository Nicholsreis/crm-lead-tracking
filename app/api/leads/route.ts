import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { LeadService } from '@/lib/services/leadService'
import { createLeadSchema, leadFiltersSchema, formatZodErrors } from '@/lib/utils/validators'

// GET /api/leads - List leads with filters
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    // Parse query parameters
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')

    const filters = {
      status: searchParams.get('status')?.split(','),
      assigned_to: searchParams.get('assigned_to') || undefined,
      tags: searchParams.get('tags')?.split(','),
      date_from: searchParams.get('date_from') || undefined,
      date_to: searchParams.get('date_to') || undefined,
      search: searchParams.get('search') || undefined,
    }

    const leadService = new LeadService(supabase)
    const result = await leadService.getLeads(filters, page, limit)

    return NextResponse.json({ success: true, ...result })
  } catch (error) {
    console.error('GET /api/leads error:', error)
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

// POST /api/leads - Create new lead
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validation = createLeadSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid data',
          details: formatZodErrors(validation.error),
        },
        { status: 400 }
      )
    }

    const leadService = new LeadService(supabase)
    const lead = await leadService.createLead(validation.data)

    return NextResponse.json({ success: true, data: lead }, { status: 201 })
  } catch (error) {
    console.error('POST /api/leads error:', error)
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
