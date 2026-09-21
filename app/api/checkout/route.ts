import { NextResponse } from 'next/server'
import { lemonSqueezySetup, createCheckout } from '@lemonsqueezy/lemonsqueezy.js'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    lemonSqueezySetup({ apiKey: process.env.LEMON_SQUEEZY_API_KEY! })

    const { data, error } = await createCheckout(
      process.env.LEMON_SQUEEZY_STORE_ID!,
      process.env.LEMON_SQUEEZY_VARIANT_ID!,
      {
        checkoutData: {
          email: user.email,
        },
        productOptions: {
          redirectUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?success=true`,
        }
      }
    )

    if (error) throw error

    return NextResponse.json({ url: data?.data.attributes.url })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json({ error: 'Failed to create checkout' }, { status: 500 })
  }
}