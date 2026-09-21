'use client'

import { useRef, useState } from 'react'

type Draft = { subject: string; body: string }

type Props = {
  invoiceId: string
  clientName: string
  clientEmail?: string
  urgent?: boolean
}

export default function DraftChaseButton({ 
  invoiceId, 
  clientName, 
  clientEmail = '', 
  urgent = false 
}: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [draft, setDraft] = useState<Draft>({ subject: '', body: '' })
  const [copied, setCopied] = useState(false)

  async function generate() {
    setLoading(true)
    setError(null)
    setCopied(false)

    try {
      const res = await fetch('/api/draft-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invoiceId }),
      })
      if (!res.ok) throw new Error(`Request failed with ${res.status}`)

      const json = await res.json()
      setDraft({ subject: json.subject ?? '', body: json.body ?? '' })
      dialogRef.current?.showModal()
    } catch (err) {
      console.error(err)
      setError('We couldn\u2019t draft the email. Try again.')
    } finally {
      setLoading(false)
    }
  }

  async function copy() {
    await navigator.clipboard.writeText(`Subject: ${draft.subject}\n\n${draft.body}`)
    setCopied(true)
  }

  function sendWithGmail() {
    const to = encodeURIComponent(clientEmail)
    const su = encodeURIComponent(draft.subject)
    const body = encodeURIComponent(draft.body)
    const url = `https://mail.google.com/mail/?view=cm&fs=1&to=${to}&su=${su}&body=${body}`
    window.open(url, '_blank')
  }

  const buttonTone = urgent
    ? 'bg-rose-600 text-white hover:bg-rose-700 focus-visible:outline-rose-600'
    : 'border border-slate-300/80 bg-white/70 text-slate-800 hover:bg-white focus-visible:outline-indigo-600'

  return (
    <div className="inline-flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={generate}
        disabled={loading}
        className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-60 motion-reduce:transition-none ${buttonTone}`}
      >
        {loading ? 'Drafting\u2026' : 'Draft Chase Email'}
      </button>

      <dialog
        ref={dialogRef}
        onClick={(e) => {
          if (e.target === e.currentTarget) dialogRef.current?.close()
        }}
        aria-labelledby={`draft-title-${invoiceId}`}
        className="m-auto w-[calc(100%-2rem)] max-w-xl rounded-2xl border border-white/70 bg-white/80 p-0 text-left text-slate-900 shadow-2xl backdrop-blur-xl backdrop:bg-slate-900/30 backdrop:backdrop-blur-sm"
      >
        <div className="p-6">
          <h2 id={`draft-title-${invoiceId}`} className="text-lg font-bold">
            Chase email for {clientName}
          </h2>

          <label className="mt-5 block text-sm font-medium">
            Subject
            <input
              value={draft.subject}
              onChange={(e) => setDraft({ ...draft, subject: e.target.value })}
              className="mt-1.5 w-full rounded-lg border border-slate-300/80 bg-white/80 px-3 py-2 text-sm font-normal focus-visible:border-indigo-500 focus-visible:outline-2 focus-visible:outline-indigo-500/40"
            />
          </label>

          <label className="mt-4 block text-sm font-medium">
            Message
            <textarea
              value={draft.body}
              onChange={(e) => setDraft({ ...draft, body: e.target.value })}
              rows={10}
              className="mt-1.5 w-full resize-y rounded-lg border border-slate-300/80 bg-white/80 px-3 py-2 text-sm font-normal leading-relaxed focus-visible:border-indigo-500 focus-visible:outline-2 focus-visible:outline-indigo-500/40"
            />
          </label>
          
          {error && (
            <p className="mt-3 text-sm font-medium text-rose-600">{error}</p>
          )}

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-900/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Close
            </button>
            <button
              type="button"
              onClick={copy}
              className="rounded-lg border border-slate-300/80 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              {copied ? 'Copied' : 'Copy email'}
            </button>
            <button
              type="button"
              onClick={sendWithGmail}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Send with Gmail
            </button>
          </div>
        </div>
      </dialog>
    </div>
  )
}