import * as XLSX from 'xlsx'
import type { Lead } from '@/types'

export class ExportService {
  async exportToCSV(leads: Lead[]): Promise<Blob> {
    const data = leads.map((lead) => ({
      ID: lead.id,
      Telefone: lead.phone,
      Nome: lead.name || '',
      Status: lead.status,
      Origem: lead.source,
      Interesse: lead.interest || '',
      'Atribuído a': lead.assigned_to || '',
      Tags: lead.tags.join(', '),
      'Criado em': new Date(lead.created_at).toLocaleString('pt-BR'),
      'Atualizado em': new Date(lead.updated_at).toLocaleString('pt-BR'),
    }))

    const worksheet = XLSX.utils.json_to_sheet(data)
    const csv = XLSX.utils.sheet_to_csv(worksheet)

    return new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
  }

  async exportToExcel(leads: Lead[]): Promise<Blob> {
    const data = leads.map((lead) => ({
      ID: lead.id,
      Telefone: lead.phone,
      Nome: lead.name || '',
      Status: lead.status,
      Origem: lead.source,
      Interesse: lead.interest || '',
      'Atribuído a': lead.assigned_to || '',
      Tags: lead.tags.join(', '),
      'Criado em': new Date(lead.created_at).toLocaleString('pt-BR'),
      'Atualizado em': new Date(lead.updated_at).toLocaleString('pt-BR'),
    }))

    const worksheet = XLSX.utils.json_to_sheet(data)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Leads')

    // Generate Excel file
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })

    return new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })
  }
}
