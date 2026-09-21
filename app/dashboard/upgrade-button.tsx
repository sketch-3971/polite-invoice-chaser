'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'

export default function UpgradeButton() {
  const [loading, setLoading] = useState(false)

  const handleCheckout = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/checkout', { method: 'POST' })
      const data = await res.json()
      
      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error('No checkout URL returned')
      }
    } catch (error) {
      console.error(error)
      alert('Failed to initiate checkout. Please try again.')
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      className="inline-flex h-9 items-center justify-center gap-2 rounded-full bg-indigo-600 px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-70"
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {loading ? 'Redirecting...' : 'Try Pro'}
    </button>
  )
}