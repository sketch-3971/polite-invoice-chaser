import Link from 'next/link'
import { ArrowRight, CheckCircle2, ShieldCheck, Mail, PenLine } from 'lucide-react'

// Shared motion + button styles so every interactive element feels the same.
const ease =
  'transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none'
const focusRing =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#fbfcfc] text-slate-900 antialiased selection:bg-teal-100">
      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/70 backdrop-blur-xl">
        <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6 lg:px-8">
          <Link href="/" className="text-[15px] font-semibold tracking-tight text-slate-900">
            Polite Invoice Chaser
          </Link>
          <div className="flex items-center gap-1.5">
            <Link
              href="/login"
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-900/5 hover:text-slate-900 ${ease} ${focusRing}`}
            >
              Sign in
            </Link>
            <Link
              href="/login"
              className={`rounded-full bg-slate-900 px-3.5 py-1.5 text-sm font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] hover:bg-slate-700 ${ease} ${focusRing}`}
            >
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          {/* Soft background light, kept subtle */}
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute -top-24 right-[-8rem] h-[28rem] w-[28rem] rounded-full bg-teal-200/40 blur-3xl" />
            <div className="absolute top-40 left-[-10rem] h-[24rem] w-[24rem] rounded-full bg-indigo-200/30 blur-3xl" />
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-[#fbfcfc]" />
          </div>

          <div className="mx-auto grid max-w-6xl items-center gap-14 px-6 py-20 sm:py-28 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:px-8 lg:py-32">
            {/* Copy */}
            <div className="max-w-xl">
              <h1 className="text-balance text-4xl font-semibold tracking-[-0.03em] text-slate-900 sm:text-6xl sm:leading-[1.05]">
                Chase unpaid invoices without the awkwardness.
              </h1>
              <p className="mt-6 text-lg leading-8 text-slate-600">
                Stop stressing over late payments. Our smart assistant drafts the perfect follow-up email. You
                review it, click approve, and send it straight from your own Gmail account.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Link
                  href="/login"
                  className={`group inline-flex items-center gap-2 rounded-full bg-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_10px_24px_-8px_rgba(13,148,136,0.6)] hover:-translate-y-0.5 hover:bg-teal-500 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_14px_30px_-8px_rgba(13,148,136,0.65)] active:translate-y-0 ${ease} ${focusRing}`}
                >
                  Start chasing for free
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none" />
                </Link>
                <a
                  href="#pricing"
                  className={`inline-flex items-center rounded-full border border-slate-900/10 bg-white/60 px-6 py-3 text-sm font-semibold text-slate-800 backdrop-blur-md hover:-translate-y-0.5 hover:bg-white/90 hover:shadow-md active:translate-y-0 ${ease} ${focusRing}`}
                >
                  See pricing
                </a>
              </div>
              <p className="mt-4 text-sm text-slate-500">No credit card required • Setup in 60 seconds</p>
            </div>

            {/* Example draft: the one memorable element on the page */}
            <div className="relative mx-auto w-full max-w-md lg:max-w-none">
              <div
                aria-hidden
                className="absolute -inset-4 -z-10 rounded-[2.5rem] bg-gradient-to-br from-teal-200/50 via-white/0 to-indigo-200/40 blur-2xl"
              />
              <div className="rounded-3xl border border-white/70 bg-white/75 p-1.5 shadow-[0_30px_60px_-20px_rgba(15,23,42,0.25)] ring-1 ring-slate-900/5 backdrop-blur-xl">
                <div className="rounded-[1.25rem] bg-white p-6 ring-1 ring-slate-900/5">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                      <PenLine className="h-4 w-4 text-teal-600" />
                      Example draft
                    </div>
                    <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700 ring-1 ring-amber-600/15">
                      14 days overdue
                    </span>
                  </div>

                  <dl className="mt-5 space-y-2 border-b border-slate-100 pb-4 text-sm">
                    <div className="flex gap-3">
                      <dt className="w-14 shrink-0 text-slate-400">To</dt>
                      <dd className="text-slate-700">Maya Chen</dd>
                    </div>
                    <div className="flex gap-3">
                      <dt className="w-14 shrink-0 text-slate-400">Subject</dt>
                      <dd className="font-medium text-slate-900">Following up on invoice #1042</dd>
                    </div>
                  </dl>

                  <div className="mt-4 space-y-3 text-[15px] leading-relaxed text-slate-700">
                    <p>Hi Maya,</p>
                    <p>
                      I hope your week is going well. Invoice #1042 for $1,200 was due on 3 March, and I
                      haven&apos;t seen the payment come through yet.
                    </p>
                    <p>Could you let me know when I can expect it? Happy to help if anything is holding it up.</p>
                    <p>Thanks so much,<br />Alex</p>
                  </div>

                  <div className="mt-6 flex items-center justify-end gap-2">
                    <span
                      className={`rounded-full px-4 py-2 text-sm font-medium text-slate-600 ring-1 ring-slate-200`}
                    >
                      Edit
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]">
                      <Mail className="h-4 w-4" />
                      Approve &amp; open in Gmail
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust & How It Works Section */}
        <section className="border-y border-slate-200/70 bg-slate-50/70 py-24 sm:py-28">
          <div className="mx-auto max-w-6xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-balance text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                You are always in control.
              </h2>
              <p className="mt-4 text-lg leading-8 text-slate-600">
                We designed this to protect your client relationships. No accidental sends, no robotic spam.
              </p>
            </div>

            <div className="mx-auto mt-14 grid max-w-2xl grid-cols-1 gap-5 sm:mt-16 lg:max-w-none lg:grid-cols-3">
              {[
                {
                  icon: ShieldCheck,
                  title: 'We never auto-send',
                  body: 'The AI only drafts the email. Nothing ever leaves your outbox until you explicitly click the send button.',
                },
                {
                  icon: Mail,
                  title: 'Sent from your Gmail',
                  body: "Emails don't come from a weird generic address. They open directly in your own Gmail, coming from you.",
                },
                {
                  icon: CheckCircle2,
                  title: 'Human-sounding tone',
                  body: 'Our system uses custom prompts designed specifically for freelancers to sound firm but perfectly polite.',
                },
              ].map(({ icon: Icon, title, body }) => (
                <div
                  key={title}
                  className="rounded-2xl border border-white bg-white/80 p-7 shadow-[0_1px_2px_rgba(15,23,42,0.05),0_12px_32px_-16px_rgba(15,23,42,0.12)] ring-1 ring-slate-900/5 backdrop-blur-md"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 ring-1 ring-teal-600/15">
                    <Icon className="h-5 w-5 text-teal-700" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold tracking-tight text-slate-900">{title}</h3>
                  <p className="mt-2 text-[15px] leading-7 text-slate-600">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Simple Pricing Section */}
        <section id="pricing" className="scroll-mt-16 py-24 sm:py-28">
          <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
            <h2 className="text-balance text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Simple, transparent pricing.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg leading-8 text-slate-600">
              Pay for itself the very first time it helps you recover a late invoice.
            </p>

            <div className="mx-auto mt-14 grid max-w-2xl grid-cols-1 gap-6 text-left sm:grid-cols-2">
              {/* Free Tier */}
              <div className="flex flex-col rounded-3xl border border-slate-200 bg-white p-8 shadow-[0_1px_2px_rgba(15,23,42,0.05),0_16px_40px_-24px_rgba(15,23,42,0.15)]">
                <h3 className="text-lg font-semibold text-slate-900">Free Tier</h3>
                <p className="mt-1.5 text-sm text-slate-500">Perfect for getting started.</p>
                <div className="mt-6 flex items-baseline gap-1 text-5xl font-semibold tracking-tight text-slate-900">
                  $0
                  <span className="text-base font-medium text-slate-500">/mo</span>
                </div>
                <ul className="mt-8 flex-1 space-y-3.5 text-sm text-slate-600">
                  <li className="flex gap-x-3">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-teal-600" /> Track unlimited invoices
                  </li>
                  <li className="flex gap-x-3">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-teal-600" /> 3 AI email drafts per month
                  </li>
                  <li className="flex gap-x-3">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-teal-600" /> Manual entry only
                  </li>
                </ul>
                <Link
                  href="/login"
                  className={`mt-8 block w-full rounded-full border border-teal-600/70 bg-white px-3 py-2.5 text-center text-sm font-semibold text-teal-700 hover:bg-teal-50 ${ease} ${focusRing}`}
                >
                  Get Started
                </Link>
              </div>

              {/* Pro Tier */}
              <div className="relative flex flex-col overflow-hidden rounded-3xl bg-slate-900 p-8 shadow-[0_30px_60px_-24px_rgba(15,23,42,0.6)] ring-1 ring-teal-500/40">
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-teal-500/25 blur-3xl"
                />
                <h3 className="relative text-lg font-semibold text-white">Pro Freelancer</h3>
                <p className="relative mt-1.5 text-sm text-slate-300">For serious professionals.</p>
                <div className="relative mt-6 flex items-baseline gap-1 text-5xl font-semibold tracking-tight text-white">
                  $9
                  <span className="text-base font-medium text-slate-400">/mo</span>
                </div>
                <ul className="relative mt-8 flex-1 space-y-3.5 text-sm text-slate-300">
                  <li className="flex gap-x-3">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-teal-400" /> Unlimited AI email drafts
                  </li>
                  <li className="flex gap-x-3">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-teal-400" /> CSV Bulk Import
                  </li>
                  <li className="flex gap-x-3">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-teal-400" /> Adjustable email tones
                  </li>
                </ul>
                <Link
                  href="/login"
                  className={`relative mt-8 block w-full rounded-full bg-teal-500 px-3 py-2.5 text-center text-sm font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_10px_24px_-8px_rgba(20,184,166,0.6)] hover:-translate-y-0.5 hover:bg-teal-400 active:translate-y-0 ${ease} ${focusRing}`}
                >
                  Upgrade to Pro
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-50/70 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 text-sm text-slate-500 sm:flex-row lg:px-8">
          <p>&copy; {new Date().getFullYear()} Polite Invoice Chaser. All rights reserved.</p>
          <Link href="/login" className={`hover:text-slate-900 ${ease} ${focusRing} rounded`}>
            Sign in
          </Link>
        </div>
      </footer>
    </div>
  )
}
