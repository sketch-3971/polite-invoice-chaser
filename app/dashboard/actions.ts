'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function addInvoice(formData: FormData): Promise<{ error?: string }> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { error: 'Your session has expired. Sign in again.' }

  const client_name = String(formData.get('client_name') ?? '').trim()
  const client_email = String(formData.get('client_email') ?? '').trim()
  const amount = Number(formData.get('amount'))
  const due_date = String(formData.get('due_date') ?? '')

  if (!client_name) return { error: 'Enter the client\u2019s name.' }
  if (!/^\S+@\S+\.\S+$/.test(client_email)) return { error: 'Enter a valid email address.' }
  if (!Number.isFinite(amount) || amount <= 0) return { error: 'Enter an amount greater than zero.' }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(due_date)) return { error: 'Pick a due date.' }

  const { error } = await supabase.from('invoices').insert({
    user_id: user.id,
    client_name,
    client_email,
    amount,
    due_date,
    status: 'Unpaid',
  })

  if (error) {
    console.error('Failed to add invoice:', error.message)
    return { error: 'We couldn\u2019t save the invoice. Try again.' }
  }

  revalidatePath('/dashboard')
  return {}
}
export async function markInvoicePaid(invoiceId: string): Promise<{ error?: string }> {
  const supabase = await createClient()

  // Make sure the user is still logged in
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Your session has expired. Sign in again.' }

  // Update the status to 'Paid', ensuring they can only update their own invoice
  const { error } = await supabase
    .from('invoices')
    .update({ status: 'Paid' })
    .eq('id', invoiceId)
    .eq('user_id', user.id)

  if (error) {
    console.error('Failed to update status:', error.message)
    return { error: 'We couldn\u2019t update the status. Try again.' }
  }

  revalidatePath('/dashboard')
  return {}
}

export async function bulkAddInvoices(invoices: any[]) {
  const supabase = await createClient()
  
  // Get the current logged-in user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not logged in')

  // Add the user_id to every invoice row
  const invoicesWithUser = invoices.map(inv => ({
    ...inv,
    user_id: user.id,
    status: 'pending' // Default status
  }))

  const { error } = await supabase
    .from('invoices')
    .insert(invoicesWithUser)

  if (error) throw new Error(error.message)
  
  revalidatePath('/dashboard')
}