'use client'

import { useRef, useState, useTransition } from 'react'
import { addInvoice } from './actions'

const inputClass =
  'mt-1.5 w-full rounded-lg border border-slate-300/80 bg-white/80 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:border-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-indigo-500/40'

export default function AddInvoiceButton() {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)

    startTransition(async () => {
      const result = await addInvoice(data)
      if (result?.error) {
        setError(result.error)
        return
      }
      form.reset()
      dialogRef.current?.close()
    })
  }

  return (
    <>
      <button
        type="button"
        onClick={() => dialogRef.current?.showModal()}
        className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 motion-reduce:transition-none"
      >
        <svg aria-hidden viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor">
          <path d="M10 3a1 1 0 0 1 1 1v5h5a1 1 0 1 1 0 2h-5v5a1 1 0 1 1-2 0v-5H4a1 1 0 1 1 0-2h5V4a1 1 0 0 1 1-1Z" />
        </svg>
        Add Invoice
      </button>

      <dialog
        ref={dialogRef}
        onClose={() => setError(null)}
        onClick={(e) => {
          // Clicking the backdrop targets the <dialog> itself
          if (e.target === e.currentTarget) dialogRef.current?.close()
        }}
        aria-labelledby="add-invoice-title"
        className="m-auto w-[calc(100%-2rem)] max-w-md rounded-2xl border border-white/70 bg-white/80 p-0 text-slate-900 shadow-2xl backdrop-blur-xl backdrop:bg-slate-900/30 backdrop:backdrop-blur-sm"
      >
        <form onSubmit={onSubmit} className="p-6">
          <h2 id="add-invoice-title" className="text-lg font-bold">
            Add Invoice
          </h2>

          <div className="mt-5 space-y-4">
            <label className="block text-sm font-medium">
              Client name
              <input name="client_name" required autoComplete="off" className={inputClass} />
            </label>

            <label className="block text-sm font-medium">
              Client email
              <input
                name="client_email"
                type="email"
                required
                autoComplete="off"
                placeholder="accounts@client.com"
                className={inputClass}
              />
            </label>

            <div className="grid grid-cols-2 gap-4">
              <label className="block text-sm font-medium">
                Amount
                <input
                  name="amount"
                  type="number"
                  inputMode="decimal"
                  step="0.01"
                  min="0.01"
                  required
                  className={`${inputClass} tabular-nums`}
                />
              </label>

              <label className="block text-sm font-medium">
                Due date
                <input name="due_date" type="date" required className={inputClass} />
              </label>
            </div>
          </div>

          {error && (
            <p role="alert" className="mt-4 text-sm font-medium text-rose-700">
              {error}
            </p>
          )}

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-900/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={pending}
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-60"
            >
              {pending ? 'Adding\u2026' : 'Add Invoice'}
            </button>
          </div>
        </form>
      </dialog>
    </>
  )
}
