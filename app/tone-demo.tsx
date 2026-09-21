"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { Check, Sparkles } from "lucide-react";

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500";

const stages = [
  {
    id: "day-3",
    tab: "Day 3",
    overdue: "3 days overdue",
    tone: "Gentle nudge",
    dot: "bg-teal-400",
    badge: "bg-teal-100 text-teal-900",
    subject: "Quick reminder about invoice #1042",
    body: [
      "Hi Maya,",
      "Hope your week is going well! I wanted to flag that invoice #1042 for $2,400 was due on the 3rd. If it’s already on its way, thank you. If anything is holding it up, just let me know and I’ll happily help.",
      "Thanks so much,\nJordan",
    ],
  },
  {
    id: "day-14",
    tab: "Day 14",
    overdue: "14 days overdue",
    tone: "Firm follow-up",
    dot: "bg-indigo-400",
    badge: "bg-indigo-100 text-indigo-900",
    subject: "Invoice #1042 is now 14 days overdue",
    body: [
      "Hi Maya,",
      "I’m following up on invoice #1042 for $2,400, which is now two weeks past due. Could you let me know by Friday when I can expect payment?",
      "If there’s an issue with the invoice, reply and I’ll sort it out right away.",
      "Thanks,\nJordan",
    ],
  },
  {
    id: "day-30",
    tab: "Day 30",
    overdue: "30 days overdue",
    tone: "Final notice",
    dot: "bg-rose-400",
    badge: "bg-rose-100 text-rose-900",
    subject: "Final notice: invoice #1042",
    body: [
      "Hi Maya,",
      "Invoice #1042 for $2,400 is now 30 days overdue. Please arrange payment within 5 business days. If something is preventing that, reply today so we can resolve it together.",
      "Without payment or a reply by then, I’ll need to pause further work on your projects.",
      "Regards,\nJordan",
    ],
  },
] as const;

export default function ToneDemo() {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next = index;
    if (e.key === "ArrowRight") next = (index + 1) % stages.length;
    else if (e.key === "ArrowLeft") next = (index - 1 + stages.length) % stages.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = stages.length - 1;
    else return;

    e.preventDefault();
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  const current = stages[active];

  return (
    <div className="mx-auto max-w-2xl">
      {/* Tone selector */}
      <div
        role="tablist"
        aria-label="Email tone by days overdue"
        className="mb-6 inline-flex rounded-full border border-white/70 bg-white/50 p-1 backdrop-blur-xl"
      >
        {stages.map((stage, i) => (
          <button
            key={stage.id}
            ref={(el) => {
              tabRefs.current[i] = el;
            }}
            id={`tone-tab-${stage.id}`}
            role="tab"
            type="button"
            aria-selected={active === i}
            aria-controls={`tone-panel-${stage.id}`}
            tabIndex={active === i ? 0 : -1}
            onClick={() => setActive(i)}
            onKeyDown={(e) => onKeyDown(e, i)}
            className={`flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition-colors ${focusRing} ${
              active === i
                ? "bg-white text-[#1d1d1f] shadow-sm"
                : "text-[#6e6e73] hover:text-[#1d1d1f]"
            }`}
          >
            <span aria-hidden className={`h-2 w-2 rounded-full ${stage.dot}`} />
            {stage.tab}
          </button>
        ))}
      </div>

      {/* Email window */}
      <div className="overflow-hidden rounded-[1.75rem] border border-white/70 bg-white/60 text-left shadow-[0_30px_80px_-24px_rgba(79,70,229,0.28)] backdrop-blur-2xl">
        <div className="flex items-center justify-between border-b border-white/60 px-5 py-3.5">
          <div aria-hidden className="flex gap-2">
            <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
            <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
            <span className="h-3 w-3 rounded-full bg-[#28c840]" />
          </div>
          <span
            aria-live="polite"
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${current.badge}`}
          >
            {current.tone}, {current.overdue}
          </span>
        </div>

        <div className="flex items-center gap-3 border-b border-white/60 px-6 py-3 text-sm">
          <span className="w-14 text-[#6e6e73]">To</span>
          <span className="font-medium">Maya Chen</span>
        </div>

        {/* All panels share one grid cell so the window never changes height */}
        <div className="grid">
          {stages.map((stage, i) => (
            <div
              key={stage.id}
              id={`tone-panel-${stage.id}`}
              role="tabpanel"
              aria-labelledby={`tone-tab-${stage.id}`}
              className={`col-start-1 row-start-1 px-6 py-5 transition-[opacity,visibility] duration-300 ${
                active === i ? "visible opacity-100" : "invisible opacity-0"
              }`}
            >
              <div className="flex items-baseline gap-3 border-b border-white/60 pb-4 text-sm">
                <span className="w-14 shrink-0 text-[#6e6e73]">Subject</span>
                <span className="font-semibold">{stage.subject}</span>
              </div>
              <div className="space-y-3 pt-4 text-[15px] leading-relaxed text-[#1d1d1f]/90">
                {stage.body.map((p) => (
                  <p key={p} className="whitespace-pre-line">
                    {p}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between border-t border-white/60 px-6 py-3.5 text-sm text-[#6e6e73]">
          <span className="flex items-center gap-2">
            <Sparkles aria-hidden className="h-4 w-4 text-indigo-500" />
            Generated by our semantic language engine
          </span>
          <span className="flex items-center gap-1 font-medium text-teal-700">
            <Check aria-hidden className="h-4 w-4" />
            Ready to send
          </span>
        </div>
      </div>

      <p className="mt-4 text-center text-sm text-[#6e6e73]">
        Example emails. Yours are drafted from each invoice’s real details.
      </p>
    </div>
  );
}
