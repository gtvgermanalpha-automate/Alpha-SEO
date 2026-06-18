"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, Mail, Send, X } from "lucide-react";
import { siteConfig } from "@/lib/content";

type Msg = { from: "bot" | "user"; text: string };

const quickReplies = [
  { label: "Our services", key: "services" },
  { label: "Pricing", key: "pricing" },
  { label: "Switching to MMR", key: "switch" },
  { label: "Book a call", key: "contact" },
];

const greeting =
  "Hello, and welcome to MMR Accountants. I'm here to help with tax, advisory and payroll questions. What can I help you with today?";

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Deterministic, on-page scripted replies — no backend required. */
function reply(input: string): string {
  const t = input.toLowerCase();
  if (/(price|pricing|cost|fee|how much|quote)/.test(t))
    return "We work on transparent fixed monthly fees built around exactly what you need — accounts, tax, payroll and advice. You'll always know the price before you commit. Share a few details on the contact page and we'll send a tailored quote within one business day.";
  if (/(switch|change|move|leave my)/.test(t))
    return "Switching is effortless — we handle the whole move for you. With your permission we contact your current accountant, request your records under professional clearance, and transfer everything across, usually within a few days.";
  if (/(service|do you|offer|help with|accounts|bookkeep)/.test(t))
    return "We cover bookkeeping & annual accounts, tax planning & returns, VAT & Making Tax Digital, payroll & pensions, company formation, and business advisory. Which area would you like to know more about?";
  if (/(vat|making tax)/.test(t))
    return "We handle VAT end to end — choosing the right scheme, preparing accurate quarterly returns and filing under Making Tax Digital, so you never miss a submission.";
  if (/(payroll|pension|paye|rti)/.test(t))
    return "Our fully managed RTI payroll covers payslips, auto-enrolment pensions, and P60s — your team is paid correctly and on time every month.";
  if (/(tax|corporation|self assess|dividend)/.test(t))
    return "We provide proactive corporation and personal tax planning — dividend strategy, allowances and reliefs — so you keep more of your profit and never face a surprise bill.";
  if (/(cloud|xero|quickbook|software)/.test(t))
    return "We're partners with Xero, QuickBooks, FreeAgent and Sage. We'll set up the best fit for you, migrate your data and keep everything reconciled in real time.";
  if (/(contact|call|phone|book|appointment|speak|talk|email)/.test(t))
    return `Of course. You can call us on ${siteConfig.contact.phoneDisplay}, email ${siteConfig.contact.email}, or use the contact page — we'll reply within one business day.`;
  if (/(hi|hello|hey|morning|afternoon)/.test(t))
    return "Hello! How can MMR help your business today? You can ask about our services, pricing, or switching across.";
  if (/(thank|cheers|great|ok|okay)/.test(t))
    return "You're very welcome. Is there anything else I can help you with?";
  return `That's a great question — one of our chartered accountants would be glad to help directly. Call ${siteConfig.contact.phoneDisplay} or drop your details on the contact page and we'll be in touch.`;
}

export function ChatPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [messages, setMessages] = useState<Msg[]>([{ from: "bot", text: greeting }]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [lastTopic, setLastTopic] = useState("General enquiry");
  const [emailVal, setEmailVal] = useState("");
  const [emailStatus, setEmailStatus] = useState<"idle" | "sending" | "done">("idle");
  const [emailErr, setEmailErr] = useState(false);
  const reduce = useReducedMotion();
  const scrollRef = useRef<HTMLDivElement>(null);
  const typingTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (open && scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, typing, emailStatus, open]);

  useEffect(() => () => clearTimeout(typingTimer.current), []);

  function send(text: string) {
    const clean = text.trim();
    if (!clean) return;
    setMessages((m) => [...m, { from: "user", text: clean }]);
    setInput("");
    setLastTopic(clean);
    setTyping(true);
    clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(
      () => {
        setMessages((m) => [...m, { from: "bot", text: reply(clean) }]);
        setTyping(false);
      },
      reduce ? 220 : 780,
    );
  }

  async function submitEmail(e: React.FormEvent) {
    e.preventDefault();
    const email = emailVal.trim();
    if (!emailRe.test(email)) {
      setEmailErr(true);
      return;
    }
    setEmailErr(false);
    setEmailStatus("sending");
    try {
      const body = new URLSearchParams();
      body.set("form-name", "chat-lead");
      body.set("email", email);
      body.set("topic", lastTopic);
      const res = await fetch("/__forms.html", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      });
      if (!res.ok) throw new Error();
      setEmailStatus("done");
      setMessages((m) => [...m, { from: "bot", text: `Thank you — we'll be in touch at ${email} shortly.` }]);
    } catch {
      setEmailStatus("idle");
      setEmailErr(true);
    }
  }

  const lastMsg = messages[messages.length - 1];
  const showCapture = open && !typing && emailStatus !== "done" && lastMsg?.from === "bot";

  const BotAvatar = () => (
    <span className="mr-2 mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-ink text-[0.58rem] font-bold leading-none text-white">
      MMR
    </span>
  );

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-label="MMR Accountants chat assistant"
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-24 right-6 z-50 flex h-[31rem] w-[calc(100vw-3rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-2xl shadow-ink/20"
        >
          {/* Header */}
          <div className="relative overflow-hidden bg-brand-blue-deep px-5 py-4 text-white">
            <div aria-hidden className="pointer-events-none absolute inset-0 bg-brand-dotgrid opacity-40" />
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-white/10 font-display text-sm font-bold ring-1 ring-white/20">
                  MMR
                </span>
                <div className="leading-tight">
                  <p className="text-sm font-semibold">MMR Assistant</p>
                  <p className="flex items-center gap-1.5 text-[0.7rem] text-white/70">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-400" aria-hidden /> Online now
                  </p>
                </div>
              </div>
              <button type="button" onClick={onClose} aria-label="Close chat" className="text-white/70 transition-colors hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-cream/30 px-4 py-4">
            {messages.map((m, i) => (
              <motion.div
                key={i}
                initial={reduce ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.from === "bot" && <BotAvatar />}
                <p
                  className={`max-w-[80%] px-3.5 py-2.5 text-sm leading-relaxed ${
                    m.from === "user"
                      ? "rounded-2xl rounded-br-sm bg-ink text-white"
                      : "rounded-2xl rounded-bl-sm border border-line bg-white text-ink/85"
                  }`}
                >
                  {m.text}
                </p>
              </motion.div>
            ))}

            {typing && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                <BotAvatar />
                <span className="flex items-center gap-1 rounded-2xl rounded-bl-sm border border-line bg-white px-4 py-3.5">
                  {[0, 1, 2].map((d) => (
                    <span
                      key={d}
                      className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink/40"
                      style={{ animationDelay: `${d * 0.15}s` }}
                    />
                  ))}
                </span>
              </motion.div>
            )}

            <AnimatePresence>
              {showCapture && (
                <motion.div
                  initial={reduce ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="ml-9"
                >
                  <form onSubmit={submitEmail} className="rounded-xl border border-accent/30 bg-accent-50/70 p-3">
                    <p className="flex items-center gap-1.5 text-xs font-semibold text-accent-700">
                      <Mail className="h-3.5 w-3.5" aria-hidden /> Want us to follow up? Leave your email
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <label htmlFor="chat-email" className="sr-only">
                        Email address
                      </label>
                      <input
                        id="chat-email"
                        type="email"
                        value={emailVal}
                        onChange={(e) => setEmailVal(e.target.value)}
                        placeholder="you@company.co.uk"
                        className={`w-full rounded-md border ${
                          emailErr ? "border-red-400" : "border-line"
                        } bg-white px-3 py-2 text-sm text-ink placeholder:text-ink/35 focus:border-accent focus-visible:outline-none focus:ring-1 focus:ring-accent`}
                      />
                      <button
                        type="submit"
                        disabled={emailStatus === "sending"}
                        className="shrink-0 rounded-md bg-accent px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-accent-600 disabled:opacity-60"
                      >
                        {emailStatus === "sending" ? "…" : "Send"}
                      </button>
                    </div>
                    {emailErr && <p className="mt-1 text-xs text-red-600">Please enter a valid email address.</p>}
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {emailStatus === "done" && (
              <div className="ml-9 flex items-center gap-1.5 text-xs font-medium text-green-700">
                <Check className="h-3.5 w-3.5" aria-hidden /> Email saved — we&apos;ll be in touch.
              </div>
            )}
          </div>

          {/* Quick replies */}
          <div className="flex flex-wrap gap-2 bg-white px-4 pb-3 pt-3">
            {quickReplies.map((q) => (
              <button
                key={q.key}
                type="button"
                onClick={() => send(q.label)}
                className="rounded-full border border-line px-3 py-1.5 text-[0.7rem] font-semibold text-ink/80 transition-colors hover:border-accent hover:bg-accent-50 hover:text-accent"
              >
                {q.label}
              </button>
            ))}
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-center gap-2 border-t border-line bg-white p-3"
          >
            <label htmlFor="chat-input" className="sr-only">
              Type your message
            </label>
            <input
              id="chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message…"
              className="w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm text-ink placeholder:text-ink/35 focus:border-accent focus-visible:outline-none focus:ring-1 focus:ring-accent"
            />
            <button
              type="submit"
              aria-label="Send message"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-ink text-white transition-colors hover:bg-accent"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
