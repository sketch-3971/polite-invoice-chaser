'use client'

import { useState } from 'react'

export default function DraftChaseButton({ invoiceId, clientName, clientEmail, urgent }: { 
  invoiceId: string, 
  clientName: string, 
  clientEmail: string, 
  urgent: boolean 
}) {
  const [loading, setLoading] = useState(false)
  // Smart default: If it's overdue, default to Firm. Otherwise, Gentle.
  const [tone, setTone] = useState(urgent ? 'firm' : 'gentle')

  const handleDraft = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/draft-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // We are now sending the selected tone to your backend!
        body: JSON.stringify({ invoiceId, clientName, tone }) 
      })
      
      if (!res.ok) throw new Error('Failed to generate draft')
      
      const { subject, body } = await res.json()

      // Open Gmail Compose with the AI generated subject and body
      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(clientEmail)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
      window.open(gmailUrl, '_blank')

    } catch (error) {
      console.error(error)
      alert("Failed to draft email. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <select
        value={tone}
        onChange={(e) => setTone(e.target.value)}
        className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs font-medium text-slate-700 outline-none transition-all hover:bg-slate-50 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 cursor-pointer"
        disabled={loading}
      >
        <option value="gentle">Gentle Nudge</option>
        <option value="standard">Standard Polite</option>
        <option value="firm">Firm Warning</option>
      </select>

      <button
        onClick={handleDraft}
        disabled={loading}
        className="inline-flex items-center justify-center rounded-lg border border-teal-600 bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white transition-all hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 disabled:opacity-50"
      >
        {loading ? 'Drafting...' : 'Draft Email'}
      </button>
    </div>
  )
}