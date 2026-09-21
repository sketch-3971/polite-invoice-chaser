'use client'

import { useState } from 'react'
import { bulkAddInvoices } from './actions'

export function CsvUpload() {
  const [loading, setLoading] = useState(false)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setLoading(true)
    const reader = new FileReader()
    
    reader.onload = async (event) => {
      const text = event.target?.result as string
      // Split by new line, skip the header row (index 0)
      const rows = text.split('\n').slice(1).filter(row => row.trim() !== '')
      
      const invoices = rows.map(row => {
        // Assuming CSV format: Client Name, Email, Amount, Due Date
        const [client_name, client_email, amount, due_date] = row.split(',')
        return {
          client_name: client_name?.trim(),
          client_email: client_email?.trim(),
          amount: parseFloat(amount?.trim() || '0'),
          due_date: due_date?.trim() // Format must be YYYY-MM-DD
        }
      })

      try {
        await bulkAddInvoices(invoices)
        alert(`Successfully imported ${invoices.length} invoices!`)
      } catch (error) {
        console.error(error)
        alert("Failed to upload invoices.")
      } finally {
        setLoading(false)
        // Reset the file input so you can upload the same file again if needed
        e.target.value = ''
      }
    }
    
    reader.readAsText(file)
  }

  return (
    <div>
      <input
        type="file"
        accept=".csv"
        id="csv-upload"
        className="hidden"
        onChange={handleFileUpload}
        disabled={loading}
      />
      <button
        type="button"
        disabled={loading}
        onClick={() => document.getElementById('csv-upload')?.click()}
        className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-100 disabled:opacity-50"
      >
        {loading ? "Importing..." : "Import CSV"}
      </button>
    </div>
  )
}