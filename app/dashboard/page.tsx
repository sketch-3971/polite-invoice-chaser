import { redirect } from 'next/navigation'
import { Manrope } from 'next/font/google'
import { createClient } from '@/lib/supabase/server'
import AddInvoiceButton from './add-invoice-button'
import DraftChaseButton from './draft-chase-button'
import { markInvoicePaid } from './actions'
import UpgradeButton from './upgrade-button'
import { CsvUpload } from './csv-upload'

const manrope = Manrope({ subsets: ['latin'] })

// Change these two to match your market.
const LOCALE = 'en-US'
const CURRENCY = 'USD'

type Status = 'Unpaid' | 'Paid' | 'Overdue'

type InvoiceRow = {
  id: string
  client_name: string
  client_email: string
  amount: number | string
  due_date: string // YYYY-MM-DD
  status: string | null
}

const money = new Intl.NumberFormat(LOCALE, { style: 'currency', currency: CURRENCY })
const dateFmt = new Intl.DateTimeFormat(LOCALE, {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
})

const DAY_MS = 86_400_000

const STATUS_STYLES: Record<Status, { pill: string; dot: string }> = {
  Paid: {
    pill: 'bg-emerald-50/80 text-emerald-800 ring-emerald-600/20',
    dot: 'bg-emerald-500',
  },
  Unpaid: {
    pill: 'bg-amber-50/80 text-amber-900 ring-amber-600/25',
    dot: 'bg-amber-500',
  },
  Overdue: {
    pill: 'bg-rose-50/80 text-rose-800 ring-rose-600/25',
    dot: 'bg-rose-500',
  },
}

const STATUS_RANK: Record<Status, number> = { Overdue: 0, Unpaid: 1, Paid: 2 }

// A stored "unpaid" invoice past its due date is shown as Overdue,
// so you don't need a cron job to flip the status.
function resolveStatus(row: InvoiceRow, today: string): Status {
  const stored = row.status?.toLowerCase()
  if (stored === 'paid') return 'Paid'
  if (stored === 'overdue' || row.due_date < today) return 'Overdue'
  return 'Unpaid'
}

function formatDate(iso: string) {
  return dateFmt.format(new Date(iso))
}

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data, error } = await supabase
    .from('invoices')
    .select('id, client_name, client_email, amount, due_date, status')
    .eq('user_id', user.id)
    .order('due_date', { ascending: true })

  if (error) console.error('Failed to load invoices:', error.message)

  const today = new Date().toISOString().slice(0, 10)

  const invoices = ((data ?? []) as InvoiceRow[])
    .map((row) => ({
      ...row,
      amount: Number(row.amount),
      state: resolveStatus(row, today),
    }))
    .sort(
      (a, b) =>
        STATUS_RANK[a.state] - STATUS_RANK[b.state] ||
        a.due_date.localeCompare(b.due_date),
    )

  const totals = invoices.reduce(
    (acc, inv) => {
      acc[inv.state].sum += inv.amount
      acc[inv.state].count += 1
      return acc
    },
    {
      Overdue: { sum: 0, count: 0 },
      Unpaid: { sum: 0, count: 0 },
      Paid: { sum: 0, count: 0 },
    } as Record<Status, { sum: number; count: number }>,
  )

  const summary: Status[] = ['Overdue', 'Unpaid', 'Paid']

  return (
    <main
      className={`${manrope.className} relative min-h-screen overflow-hidden bg-slate-100 text-slate-900`}
    >
      {/* Soft colour fields give the glass something to blur */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 -top-32 h-96 w-96 rounded-full bg-indigo-300/50 blur-3xl" />
        <div className="absolute right-0 top-1/3 h-[28rem] w-[28rem] rounded-full bg-teal-200/60 blur-3xl" />
        <div className="absolute -bottom-32 left-1/3 h-80 w-80 rounded-full bg-rose-200/40 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Invoices</h1>
            <p className="mt-1 text-sm text-slate-600">
              Track what you&rsquo;re owed and nudge what&rsquo;s late.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <UpgradeButton />
            <CsvUpload />
            <AddInvoiceButton />
          </div>
        </header>

        {/* Summary: one glass panel, three segments */}
        <section
          aria-label="Invoice totals"
          className="mt-8 grid divide-y divide-white/60 rounded-2xl border border-white/70 bg-white/55 shadow-[0_8px_32px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:grid-cols-3 sm:divide-x sm:divide-y-0"
        >
          {summary.map((status) => (
            <div key={status} className="px-6 py-5">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                <span className={`h-2 w-2 rounded-full ${STATUS_STYLES[status].dot}`} />
                {status}
              </div>
              <p className="mt-1 text-2xl font-bold tabular-nums">
                {money.format(totals[status].sum)}
              </p>
              <p className="text-xs text-slate-500">
                {totals[status].count} {totals[status].count === 1 ? 'invoice' : 'invoices'}
              </p>
            </div>
          ))}
        </section>

        {error && (
          <p
            role="alert"
            className="mt-6 rounded-xl border border-rose-200 bg-rose-50/80 px-4 py-3 text-sm text-rose-800"
          >
            We couldn&rsquo;t load your invoices. Refresh the page to try again.
          </p>
        )}

        {/* Table */}
        <section className="mt-6 overflow-hidden rounded-2xl border border-white/70 bg-white/55 shadow-[0_8px_32px_rgba(15,23,42,0.08)] backdrop-blur-xl">
          {invoices.length === 0 && !error ? (
            <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
              <p className="text-lg font-semibold">No invoices yet</p>
              <p className="max-w-sm text-sm text-slate-600">
                Add your first invoice and we&rsquo;ll help you follow up when it&rsquo;s late.
              </p>
              <div className="flex items-center gap-3 mt-2">
                <CsvUpload />
                <AddInvoiceButton />
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[46rem] text-left text-sm">
                <thead>
                  <tr className="text-xs font-semibold text-slate-500">
                    <th scope="col" className="px-6 py-3.5">Client Name</th>
                    <th scope="col" className="px-6 py-3.5">Email</th>
                    <th scope="col" className="px-6 py-3.5 text-right">Amount</th>
                    <th scope="col" className="px-6 py-3.5">Due Date</th>
                    <th scope="col" className="px-6 py-3.5">Status</th>
                    <th scope="col" className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((inv) => {
                    const styles = STATUS_STYLES[inv.state]
                    const isOverdue = inv.state === 'Overdue'
                    const daysLate = Math.max(
                      0,
                      Math.round((Date.parse(today) - Date.parse(inv.due_date)) / DAY_MS),
                    )

                    return (
                      <tr
                        key={inv.id}
                        className="border-t border-white/60 transition-colors hover:bg-white/40 motion-reduce:transition-none"
                      >
                        <td
                          className={`px-6 py-4 font-semibold ${
                            isOverdue ? 'shadow-[inset_3px_0_0_0_#f43f5e]' : ''
                          }`}
                        >
                          {inv.client_name}
                        </td>
                        <td className="px-6 py-4 text-slate-600">{inv.client_email}</td>
                        <td className="px-6 py-4 text-right font-semibold tabular-nums">
                          {money.format(inv.amount)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="tabular-nums">{formatDate(inv.due_date)}</div>
                          {isOverdue && daysLate > 0 && (
                            <div className="text-xs font-medium text-rose-600">
                              {daysLate} {daysLate === 1 ? 'day' : 'days'} late
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${styles.pill}`}
                          >
                            <span className={`h-1.5 w-1.5 rounded-full ${styles.dot}`} />
                            {inv.state}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          {inv.state === 'Paid' ? (
                            <span className="text-sm font-medium text-emerald-600 pr-4">
                              Payment Received 🎉
                            </span>
                          ) : (
                            <div className="flex flex-col items-end gap-1.5">
                              <div className="flex items-center justify-end gap-2">
                                <form action={async () => {
                                  'use server'
                                  await markInvoicePaid(inv.id)
                                }}>
                                  <button 
                                    type="submit"
                                    className="rounded-lg border border-teal-500/30 bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-700 transition-colors hover:bg-teal-100 focus-visible:outline-2 focus-visible:outline-teal-600"
                                  >
                                    Mark Paid
                                  </button>
                                </form>

                                <DraftChaseButton
                                  invoiceId={inv.id}
                                  clientName={inv.client_name}
                                  clientEmail={inv.client_email}
                                  urgent={isOverdue}
                                />
                              </div>
                              <span className="text-[10px] text-slate-500">
                                🔒 You review before sending
                              </span>
                            </div>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}