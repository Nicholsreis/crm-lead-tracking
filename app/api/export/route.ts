import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { LeadService } from '@/lib/services/leadService'
import { ExportService } from '@/lib/services/exportService'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const format = searchParams.get('format') || 'csv'

    // Parse filters
    const filters = {
      status: searchParams.get('status')?.split(','),
      assigned_to: searchParams.get('assigned_to') || undefined,
      tags: searchParams.get('tags')?.split(','),
      date_from: searchParams.get('date_from') || undefined,
      date_to: searchParams.get('date_to') || undefined,
      search: searchParams.get('search') || undefined,
    }

    // Get all leads matching filters (no pagination for export)
    const leadService = new LeadService(supabase)
    const result = await leadService.getLeads(filters, 1, 10000)

    const exportService = new ExportService()
    let blob: Blob
    let filename: string
    let contentType: string

    if (format === 'excel') {
      blob = await exportService.exportToExcel(result.data)
      filename = `leads-${new Date().toISOString().split('T')[0]}.xlsx`
      contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    } else {
      blob = await exportService.exportToCSV(result.data)
      filename = `leads-${new Date().toISOString().split('T')[0]}.csv`
      contentType = 'text/csv;charset=utf-8;'
    }

    const buffer = await blob.arrayBuffer()

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  } catch (error) {
    console.error('GET /api/export error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Export failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
