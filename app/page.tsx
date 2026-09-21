import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  ChevronRight,
  Check,
  Lock,
  MailCheck,
  Send,
  ShieldCheck,
  SlidersHorizontal,
} from "lucide-react";
import ToneDemo from "./tone-demo";

export const metadata: Metadata = {
  title: "Polite Invoice Chaser: get paid without the awkward emails",
  description:
    "Polite Invoice Chaser drafts and sends payment reminders for freelancers and agency owners, gentle at first and firmer as an invoice gets later.",
};

const fontStack =
  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", Inter, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500";

const glass = "border border-white/70 bg-white/50 backdrop-blur-2xl";

/* ------------------------------------------------------------------ */
/* Glass buttons                                                      */
/* ------------------------------------------------------------------ */

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "lg";

// 1. Standard, buttery smooth Tailwind transitions for scaling and moving
const buttonBase =
  "group relative inline-flex select-none items-center justify-center overflow-hidden whitespace-nowrap rounded-full font-medium transition-all duration-500 ease-out hover:-translate-y-1 hover:scale-[1.02] active:scale-95 active:translate-y-0 " +
  focusRing;

const buttonVariants: Record<ButtonVariant, string> = {
  primary:
    "border border-white/40 bg-gradient-to-b from-indigo-500/90 to-indigo-600/90 text-white shadow-[0_8px_24px_-10px_rgba(79,70,229,0.5)] hover:shadow-[0_16px_32px_-10px_rgba(79,70,229,0.7)] hover:border-white/70",
  secondary:
    "border border-white/80 bg-white/40 text-[#1d1d1f] shadow-sm hover:shadow-md hover:border-white",
  ghost:
    "border border-transparent text-[#1d1d1f]/75 hover:text-[#1d1d1f]",
};

const buttonSizes: Record<ButtonSize, string> = {
  sm: "h-9 gap-1.5 px-4 text-sm",
  lg: "h-14 gap-2 px-8 text-[17px]",
};

function GlassLink({
  href,
  variant = "primary",
  size = "lg",
  withArrow = false,
  className = "",
  children,
}: {
  href: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  withArrow?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`${buttonBase} ${buttonVariants[variant]} ${buttonSizes[size]} ${className}`}
    >
      {/* 2. THE FIX: A smooth white overlay layer that fades in on hover */}
      <span className="absolute inset-0 z-0 bg-white opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-20" />
      
      {/* Content sits safely above the overlay */}
      <span className="relative z-10 flex items-center gap-[inherit]">
        {children}
        {withArrow && (
          <ChevronRight
            aria-hidden
            className={`transition-transform duration-500 ease-out group-hover:translate-x-1 ${
              size === "sm" ? "h-4 w-4" : "h-5 w-5"
            }`}
          />
        )}
      </span>
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/* Content                                                            */
/* ------------------------------------------------------------------ */

const doubts = [
  { text: "Is “just circling back” too passive?", align: "self-start" },
  { text: "It’s been three weeks. Is it rude to ask again?", align: "self-end" },
  { text: "What if they stop hiring me?", align: "self-start" },
] as const;

const scale = [
  {
    label: "A few days late",
    desc: "A friendly nudge that assumes it slipped their mind.",
    dot: "bg-teal-400",
  },
  {
    label: "Two weeks late",
    desc: "A firm follow-up with a clear ask and a clear date.",
    dot: "bg-indigo-400",
  },
  {
    label: "A month late",
    desc: "A final notice that stays direct, professional, and polite.",
    dot: "bg-rose-400",
  },
] as const;

const clients = ["Northwind Studio", "Halden & Co", "Pixel Barn"] as const;

export default function LandingPage() {
  const year = new Date().getFullYear();

  return (
    <div
      className="relative isolate min-h-screen overflow-x-clip bg-[#f5f5f7] text-[#1d1d1f] antialiased"
      style={{ fontFamily: fontStack }}
    >
      {/* Pastel background blurs */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[42rem] w-[42rem] rounded-full bg-indigo-300/60 blur-[120px]" />
        <div className="absolute -right-32 top-1/4 h-[36rem] w-[36rem] rounded-full bg-teal-200/70 blur-[120px]" />
        <div className="absolute -bottom-40 left-1/4 h-[40rem] w-[40rem] rounded-full bg-rose-200/70 blur-[120px]" />
      </div>

      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-white/60 bg-white/50 backdrop-blur-xl">
        <nav
          aria-label="Main"
          className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6"
        >
          <Link href="/" className={`flex items-center gap-2 rounded-md font-semibold ${focusRing}`}>
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#1d1d1f] text-white">
              <MailCheck aria-hidden className="h-4 w-4" />
            </span>
            Polite Invoice Chaser
          </Link>

          <div className="flex items-center gap-1.5">
            <GlassLink href="/login" variant="ghost" size="sm">
              Sign in
            </GlassLink>
            <GlassLink href="/login" variant="primary" size="sm">
              Start free
            </GlassLink>
          </div>
        </nav>
      </header>

      <main>
        {/* Hero */}
        <section className="mx-auto max-w-6xl px-6 pb-24 pt-20 text-center sm:pt-28">
          <h1 className="mx-auto max-w-4xl text-balance text-5xl font-semibold leading-[1.05] tracking-[-0.035em] sm:text-6xl lg:text-7xl">
            Getting paid shouldn’t feel like begging.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-balance text-lg leading-relaxed text-[#6e6e73] sm:text-xl">
            Polite Invoice Chaser writes and sends every payment reminder for you, gentle at first
            and firmer as an invoice ages. You keep the client relationship. It does the asking.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <GlassLink href="/login" variant="primary" size="lg" withArrow>
              Start Chasing for Free
            </GlassLink>
            <GlassLink href="#features" variant="secondary" size="lg">
              See how it works
            </GlassLink>
          </div>

          <div className="mt-16 sm:mt-20">
            <ToneDemo />
          </div>
        </section>

        {/* Pain point */}
        <section aria-labelledby="pain-heading" className="mx-auto max-w-6xl px-6 py-24">
          <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
            <div>
              <h2
                id="pain-heading"
                className="text-balance text-4xl font-semibold leading-[1.08] tracking-[-0.03em] sm:text-5xl"
              >
                You do great work. Then you have to chase the money.
              </h2>
              <div className="mt-6 max-w-xl space-y-5 text-lg leading-relaxed text-[#6e6e73]">
                <p>
                  Nobody warns you that half of running a business is politely asking for what
                  you’re already owed. You write the email, delete it, and write it again. You
                  wonder if “friendly reminder” sounds weak, or if “second notice” sounds rude. So
                  you wait another week, and the invoice keeps aging while the stress piles up.
                </p>
                <p>
                  Most clients aren’t dodging you. They’re busy. A well-timed, well-worded nudge is
                  usually all it takes. You just shouldn’t have to be the one writing it at 11pm.
                </p>
              </div>
            </div>

            <ul className="flex flex-col gap-4">
              {doubts.map((d) => (
                <li
                  key={d.text}
                  className={`max-w-sm rounded-[1.75rem] px-6 py-4 text-lg shadow-[0_12px_40px_-16px_rgba(244,63,94,0.3)] ${glass} ${d.align}`}
                >
                  {d.text}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Features */}
        <section
          id="features"
          aria-labelledby="features-heading"
          className="mx-auto max-w-6xl scroll-mt-16 px-6 py-24"
        >
          <div className="mx-auto max-w-2xl text-center">
            <h2
              id="features-heading"
              className="text-balance text-4xl font-semibold leading-[1.08] tracking-[-0.03em] sm:text-5xl"
            >
              Chasing, handled.
            </h2>
            <p className="mt-5 text-balance text-lg leading-relaxed text-[#6e6e73] sm:text-xl">
              Every overdue invoice gets a message that fits how late it is, written for you and
              sent when you say so.
            </p>
          </div>

          <div className="mt-16 grid gap-5 md:grid-cols-2">
            {/* Tone scaling */}
            <article
              className={`grid items-center gap-10 rounded-[2rem] p-8 shadow-[0_24px_60px_-28px_rgba(79,70,229,0.35)] sm:p-12 md:col-span-2 md:grid-cols-2 ${glass}`}
            >
              <div>
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/80 text-indigo-600 shadow-sm">
                  <SlidersHorizontal aria-hidden className="h-6 w-6" />
                </span>
                <h3 className="mt-6 text-3xl font-semibold tracking-[-0.02em]">
                  AI-powered tone scaling
                </h3>
                <p className="mt-3 max-w-md text-lg leading-relaxed text-[#6e6e73]">
                  Our self-trained AI models read how many days an invoice is overdue and writes to match. They start
                  with a gentle nudge and build to a strict final notice, without ever getting
                  rude.
                </p>
              </div>

              <ol className="relative space-y-7 pl-10 before:absolute before:bottom-2 before:left-[11px] before:top-2 before:w-0.5 before:rounded-full before:bg-gradient-to-b before:from-teal-300 before:via-indigo-300 before:to-rose-300">
                {scale.map((s) => (
                  <li key={s.label} className="relative">
                    <span
                      aria-hidden
                      className={`absolute -left-10 top-0.5 h-6 w-6 rounded-full border-4 border-white ${s.dot}`}
                    />
                    <p className="text-lg font-semibold">{s.label}</p>
                    <p className="text-[#6e6e73]">{s.desc}</p>
                  </li>
                ))}
              </ol>
            </article>

            {/* One-click sending */}
            <article
              className={`flex flex-col rounded-[2rem] p-8 shadow-[0_24px_60px_-28px_rgba(20,184,166,0.4)] sm:p-10 ${glass}`}
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/80 text-teal-600 shadow-sm">
                <Send aria-hidden className="h-6 w-6" />
              </span>
              <h3 className="mt-6 text-2xl font-semibold tracking-[-0.02em]">
                One-click background sending
              </h3>
              <p className="mt-3 text-lg leading-relaxed text-[#6e6e73]">
                Approve the draft and it goes out for you in the background. No copying, no pasting,
                no opening your inbox.
              </p>
              <div className="mt-auto pt-8">
                <div className="flex items-center gap-3 rounded-2xl border border-white/80 bg-white/70 px-4 py-3 shadow-sm">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-100 text-teal-700">
                    <Check aria-hidden className="h-4 w-4" />
                  </span>
                  <div className="text-sm">
                    <p className="font-semibold">Reminder sent</p>
                    <p className="text-[#6e6e73]">Maya Chen, just now</p>
                  </div>
                </div>
              </div>
            </article>

            {/* Secure storage */}
            <article
              className={`flex flex-col rounded-[2rem] p-8 shadow-[0_24px_60px_-28px_rgba(244,63,94,0.35)] sm:p-10 ${glass}`}
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/80 text-rose-500 shadow-sm">
                <ShieldCheck aria-hidden className="h-6 w-6" />
              </span>
              <h3 className="mt-6 text-2xl font-semibold tracking-[-0.02em]">
                Secure client storage
              </h3>
              <p className="mt-3 text-lg leading-relaxed text-[#6e6e73]">
                Client details and invoice history are stored securely behind your login, so every
                follow-up starts with the right name, amount, and date.
              </p>
              <ul className="mt-auto space-y-2 pt-8">
                {clients.map((name) => (
                  <li
                    key={name}
                    className="flex items-center justify-between rounded-2xl border border-white/80 bg-white/70 px-4 py-2.5 text-sm shadow-sm"
                  >
                    <span className="font-medium">{name}</span>
                    <Lock aria-hidden className="h-4 w-4 text-[#6e6e73]" />
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </section>

        {/* Closing CTA */}
        <section aria-labelledby="cta-heading" className="mx-auto max-w-4xl px-6 pb-28 pt-12">
          <div
            className={`rounded-[2.5rem] p-10 text-center shadow-[0_30px_80px_-30px_rgba(79,70,229,0.4)] sm:p-16 ${glass}`}
          >
            <h2
              id="cta-heading"
              className="text-balance text-4xl font-semibold leading-[1.08] tracking-[-0.03em] sm:text-5xl"
            >
              Send the reminder you’ve been putting off.
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-balance text-lg leading-relaxed text-[#6e6e73]">
              Add an invoice, review the draft, and send it in one click. The awkward part is on us.
            </p>
            <GlassLink href="/login" variant="primary" size="lg" withArrow className="mt-8">
              Start Chasing for Free
            </GlassLink>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/60 bg-white/40 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-8 text-sm text-[#6e6e73] sm:flex-row">
          <span className="flex items-center gap-2 font-medium text-[#1d1d1f]">
            <MailCheck aria-hidden className="h-4 w-4" />
            Polite Invoice Chaser
          </span>
          <p>© {year} Polite Invoice Chaser. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}