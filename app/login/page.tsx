'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { MailCheck, Loader2 } from 'lucide-react'

const fontStack =
  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", Inter, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'

export default function LoginPage() {
  const [name, setName] = useState('') // New state for the user's name
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSignUp, setIsSignUp] = useState(false)
  
  const router = useRouter()
  const supabase = createClient()

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (isSignUp) {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name, // Saves the name to Supabase user_metadata
            },
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        })
        if (signUpError) throw signUpError
        alert('Check your email for the confirmation link!')
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (signInError) throw signInError
        
        router.push('/dashboard')
        router.refresh()
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f5f5f7] px-4 text-[#1d1d1f] antialiased sm:px-6 lg:px-8"
      style={{ fontFamily: fontStack }}
    >
      {/* Pastel background blurs */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[42rem] w-[42rem] rounded-full bg-indigo-300/60 blur-[120px]" />
        <div className="absolute -right-32 top-1/4 h-[36rem] w-[36rem] rounded-full bg-teal-200/70 blur-[120px]" />
        <div className="absolute -bottom-40 left-1/4 h-[40rem] w-[40rem] rounded-full bg-rose-200/70 blur-[120px]" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center justify-center text-center">
          <Link
            href="/"
            className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1d1d1f] text-white shadow-lg transition-transform hover:scale-105"
          >
            <MailCheck aria-hidden className="h-6 w-6" />
          </Link>
          <h2 className="mt-6 text-3xl font-bold tracking-tight">
            {isSignUp ? 'Create your account' : 'Welcome back'}
          </h2>
          <p className="mt-2 text-sm text-[#6e6e73]">
            {isSignUp
              ? 'Start chasing invoices politely and automatically.'
              : 'Sign in to access your dashboard and invoices.'}
          </p>
        </div>

        {/* Glass Card */}
        <div className="rounded-[2rem] border border-white/70 bg-white/50 p-8 shadow-[0_24px_60px_-28px_rgba(79,70,229,0.35)] backdrop-blur-2xl sm:p-10">
          <form onSubmit={handleAuth} className="space-y-5">
            
            {/* Name field only shows up if they are signing up */}
            {isSignUp && (
              <div>
                <label className="block text-sm font-medium text-[#1d1d1f]/80">
                  Full Name
                </label>
                <input
                  type="text"
                  required={isSignUp}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-2 block w-full rounded-xl border border-white/60 bg-white/50 px-4 py-3 text-[#1d1d1f] shadow-sm backdrop-blur-md transition-all focus-visible:border-indigo-500 focus-visible:bg-white/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/20"
                  placeholder="Alex Smith"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-[#1d1d1f]/80">
                Email address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 block w-full rounded-xl border border-white/60 bg-white/50 px-4 py-3 text-[#1d1d1f] shadow-sm backdrop-blur-md transition-all focus-visible:border-indigo-500 focus-visible:bg-white/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/20"
                placeholder="you@company.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1d1d1f]/80">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 block w-full rounded-xl border border-white/60 bg-white/50 px-4 py-3 text-[#1d1d1f] shadow-sm backdrop-blur-md transition-all focus-visible:border-indigo-500 focus-visible:bg-white/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/20"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="rounded-xl border border-rose-200 bg-rose-50/50 p-3 text-sm text-rose-600 backdrop-blur-md">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="group relative inline-flex w-full select-none items-center justify-center overflow-hidden rounded-full border border-white/40 bg-gradient-to-b from-indigo-500/90 to-indigo-600/90 px-8 py-3.5 font-medium text-white shadow-[0_8px_24px_-10px_rgba(79,70,229,0.5)] transition-all duration-500 ease-out hover:-translate-y-1 hover:border-white/70 hover:shadow-[0_16px_32px_-10px_rgba(79,70,229,0.7)] active:translate-y-0 active:scale-95 disabled:opacity-70 disabled:hover:-translate-y-0 disabled:hover:shadow-[0_8px_24px_-10px_rgba(79,70,229,0.5)]"
            >
              <span className="absolute inset-0 z-0 bg-white opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-20" />
              <span className="relative z-10 flex items-center gap-2">
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {loading
                  ? 'Processing...'
                  : isSignUp
                  ? 'Create account'
                  : 'Sign in'}
              </span>
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-[#6e6e73]">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp)
                setError(null)
              }}
              className="font-semibold text-indigo-600 hover:text-indigo-500 focus-visible:outline-none focus-visible:underline"
            >
              {isSignUp ? 'Sign in instead' : 'Sign up for free'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}