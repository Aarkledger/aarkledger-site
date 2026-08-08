"use client";

import { useEffect, useRef, useState } from "react";

const CONTACT_LINKS = [
  { href: "mailto:louie@aarkledger.com", label: "Email a Partner" },
  { href: "tel:+639282857646", label: "Call +63 928 285 7646" },
  {
    href: "https://www.linkedin.com/company/aarkledger-accounting/",
    label: "Company LinkedIn",
    ext: true,
  },
];

const KB = [
  {
    keys: ["service", "services", "offer", "what do you do", "bookkeep", "reconcil", "help with"],
    answer:
      "We offer full-service finance under one accountable partner: Bookkeeping & Reconciliation, Tax Preparation & Filing, Financial Reporting, Payroll & Remittances, FP&A & Forecasting, and ERP Setup & Support. Which one would you like to know more about?",
  },
  {
    keys: ["package", "pricing", "price", "cost", "how much", "retainer", "plan", "starter", "growth", "corporate", "monthly"],
    answer:
      "We offer three monthly packages, scoped by your transaction volume:\n• Starter, for sole proprietors and freelancers\n• Growth, for SMEs and VAT-registered businesses (most popular)\n• Corporate, for high-volume corporations\nEmail us for a quote tailored to your needs.",
    links: [{ href: "mailto:louie@aarkledger.com", label: "Request a quote" }],
  },
  {
    keys: ["engagement", "project", "one-off", "one off", "a la carte", "audit", "entity", "incorporat"],
    answer:
      "Prefer project work over a monthly retainer? Engagements are billed per project (50% upfront, 50% on completion): Financial Statements, Personal and Corporate Tax Returns, Indirect Tax Filing, Audit Prep Support, FP&A, ERP Setup & Migration, and Entity Formation.",
  },
  {
    keys: ["erp", "sap", "netsuite", "oracle", "dynamics", "quickbooks", "xero", "sage", "odoo", "system", "migration", "advisory"],
    answer:
      "ERP is a core specialty. We advise on and implement SAP S/4HANA, Oracle NetSuite, and Microsoft Dynamics 365, plus QuickBooks Online, Xero, Sage, and Odoo, covering implementation, migration, training, and ongoing system health checks.",
  },
  {
    keys: ["deadline", "calendar", "bir", "sec", "due date", "filing date", "compliance", "tax calendar"],
    answer:
      "You can view the 2026 and 2027 Philippine SEC and BIR compliance deadlines on our Tax Calendar.",
    links: [{ href: "/deadlines", label: "Open the Tax Calendar →" }],
  },
  {
    keys: ["contact", "email", "phone", "call", "reach", "talk to", "human", "representative", "agent", "linkedin", "get in touch"],
    answer:
      "You can reach one of our Finance Business Partners directly, or use the main company channels below.",
    links: CONTACT_LINKS,
  },
  {
    keys: ["start", "get started", "begin", "onboard", "sign up", "next step", "quote", "enquire", "inquire", "how do i"],
    answer:
      "Getting started is simple: tell us about your business and we will recommend the right package or engagement, with no obligation. Use the contact form on the page or email us directly.",
    links: [{ href: "mailto:louie@aarkledger.com", label: "Email us" }],
  },
  {
    keys: ["about", "who are you", "company", "since", "experience", "background", "expertise"],
    answer:
      "Aarkledger is a boutique financial consultancy firm established in 2015, built for start-ups and enterprises with complex business models and data ecosystems. We are led by finance professionals with investment banking and private equity experience.",
  },
  {
    keys: ["hello", "hi", "hey", "good morning", "good afternoon", "good evening"],
    answer:
      "Hello, I am the Aarkledger assistant. I can help with our services, packages, ERP solutions, tax deadlines, or putting you in touch with a Finance Business Partner.",
  },
  {
    keys: ["thank", "thanks", "appreciate"],
    answer: "You are welcome. Is there anything else I can help you with?",
  },
  {
    keys: ["bye", "goodbye", "see you", "that is all", "that's all"],
    answer:
      "Thanks for visiting Aarkledger. When you are ready, reach us at louie@aarkledger.com. Have a great day.",
  },
];

const FALLBACK =
  "I am not sure I caught that. I can help with services, packages, engagements, ERP systems, tax deadlines, or connecting you with a Finance Business Partner. You can also email louie@aarkledger.com anytime.";

const QUICK = ["Services", "Packages", "ERP systems", "Tax deadlines", "Contact us"];

function matchAnswer(text) {
  const s = " " + text.toLowerCase() + " ";
  let best = null;
  let bestScore = 0;
  for (const item of KB) {
    let score = 0;
    for (const k of item.keys) {
      const key = k.toLowerCase();
      const hit =
        key.length <= 3 ? new RegExp("\\b" + key + "\\b").test(s) : s.includes(key);
      if (hit) score += 1;
    }
    if (score > bestScore) {
      bestScore = score;
      best = item;
    }
  }
  return bestScore > 0 ? best : { answer: FALLBACK };
}

const CSS = `
.alk-fab{position:fixed;right:24px;bottom:24px;z-index:9998;width:60px;height:60px;border:none;border-radius:50%;cursor:pointer;color:#fff;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,var(--accent-2,#4a9c30),var(--accent,#136207));box-shadow:0 10px 26px rgba(19,98,7,.4),inset 0 1px 0 rgba(255,255,255,.35);transition:transform .2s ease,box-shadow .2s ease}
.alk-fab:hover{transform:translateY(-2px) scale(1.03);box-shadow:0 14px 32px rgba(19,98,7,.5),inset 0 1px 0 rgba(255,255,255,.4)}
.alk-fab.open{background:var(--navy,#201e1d)}
.alk-chat-panel{position:fixed;right:24px;bottom:96px;z-index:9999;display:flex;flex-direction:column;width:min(370px,calc(100vw - 32px));height:min(70vh,560px);background:var(--bg-card,#fff);border:1px solid var(--border,#dcd8d8);border-radius:16px;overflow:hidden;box-shadow:0 24px 60px rgba(20,20,19,.28);font-family:inherit;animation:alk-pop .18s ease}
@keyframes alk-pop{from{opacity:0;transform:translateY(12px) scale(.98)}to{opacity:1;transform:none}}
.alk-chat-head{display:flex;align-items:center;justify-content:space-between;padding:16px 18px;color:#fff;background:linear-gradient(135deg,var(--accent,#136207),var(--accent-dark,#0d4a05))}
.alk-chat-title{font-weight:800;font-size:1rem;letter-spacing:-.01em}
.alk-chat-sub{font-size:.78rem;opacity:.85;margin-top:2px}
.alk-chat-x{background:transparent;border:none;color:#fff;font-size:1.5rem;line-height:1;cursor:pointer;opacity:.9;padding:0 4px}
.alk-chat-x:hover{opacity:1}
.alk-chat-body{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:12px;background:var(--bg,#f3f2f2)}
.alk-msg{display:flex;flex-direction:column;max-width:85%}
.alk-msg.bot{align-self:flex-start;align-items:flex-start}
.alk-msg.user{align-self:flex-end;align-items:flex-end}
.alk-bubble{padding:10px 13px;border-radius:14px;font-size:.9rem;line-height:1.5;white-space:pre-wrap;word-wrap:break-word}
.alk-msg.bot .alk-bubble{background:#fff;color:var(--text,#201e1d);border:1px solid var(--border,#dcd8d8);border-bottom-left-radius:4px}
.alk-msg.user .alk-bubble{background:linear-gradient(135deg,var(--accent-2,#4a9c30),var(--accent,#136207));color:#fff;border-bottom-right-radius:4px}
.alk-links{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}
.alk-linkchip{font-size:.8rem;font-weight:600;text-decoration:none;color:var(--accent-dark,#0d4a05);background:rgba(74,156,48,.16);border:1px solid rgba(19,98,7,.28);padding:6px 11px;border-radius:999px;transition:background .15s ease}
.alk-linkchip:hover{background:rgba(74,156,48,.3)}
.alk-typing{display:inline-flex;gap:4px;align-items:center}
.alk-typing span{width:6px;height:6px;border-radius:50%;background:var(--text-soft,#605d5d);opacity:.5;animation:alk-blink 1.2s infinite}
.alk-typing span:nth-child(2){animation-delay:.2s}
.alk-typing span:nth-child(3){animation-delay:.4s}
@keyframes alk-blink{0%,60%,100%{opacity:.25;transform:translateY(0)}30%{opacity:.9;transform:translateY(-3px)}}
.alk-quick{display:flex;flex-wrap:wrap;gap:6px;padding:10px 12px 0;background:var(--bg-card,#fff)}
.alk-chip{font-size:.8rem;font-weight:600;cursor:pointer;color:var(--accent-dark,#0d4a05);background:transparent;border:1px solid var(--border,#dcd8d8);padding:6px 11px;border-radius:999px;transition:all .15s ease}
.alk-chip:hover{background:rgba(74,156,48,.14);border-color:rgba(19,98,7,.3)}
.alk-input{display:flex;align-items:center;gap:8px;padding:12px;background:var(--bg-card,#fff)}
.alk-input input{flex:1;border:1px solid var(--border,#dcd8d8);border-radius:999px;padding:10px 14px;font-size:.9rem;font-family:inherit;color:var(--text,#201e1d);outline:none}
.alk-input input:focus{border-color:var(--accent,#136207);box-shadow:0 0 0 3px rgba(19,98,7,.12)}
.alk-input button{flex:none;width:38px;height:38px;border:none;border-radius:50%;cursor:pointer;color:#fff;display:flex;align-items:center;justify-content:center;background:var(--accent,#136207)}
.alk-input button:disabled{opacity:.4;cursor:not-allowed}
`;

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "Hi, I am the Aarkledger assistant. How can I help you today? You can ask about our services, packages, ERP solutions, or tax deadlines.",
    },
  ]);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing, open]);

  const respond = (text) => {
    const q = text.trim();
    if (!q) return;
    setMessages((prev) => [...prev, { from: "user", text: q }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      const a = matchAnswer(q);
      setTyping(false);
      setMessages((prev) => [...prev, { from: "bot", text: a.answer, links: a.links }]);
    }, 500);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    respond(input);
  };

  return (
    <>
      <style>{CSS}</style>

      {open && (
        <div className="alk-chat-panel" role="dialog" aria-label="Aarkledger assistant">
          <div className="alk-chat-head">
            <div>
              <div className="alk-chat-title">Aarkledger Assistant</div>
              <div className="alk-chat-sub">Here to help with your finance questions</div>
            </div>
            <button className="alk-chat-x" onClick={() => setOpen(false)} aria-label="Close chat">
              &times;
            </button>
          </div>

          <div className="alk-chat-body">
            {messages.map((m, i) => (
              <div key={i} className={"alk-msg " + (m.from === "bot" ? "bot" : "user")}>
                <div className="alk-bubble">{m.text}</div>
                {m.links && (
                  <div className="alk-links">
                    {m.links.map((l, j) => (
                      <a
                        key={j}
                        href={l.href}
                        className="alk-linkchip"
                        target={l.ext ? "_blank" : undefined}
                        rel={l.ext ? "noopener noreferrer" : undefined}
                      >
                        {l.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {typing && (
              <div className="alk-msg bot">
                <div className="alk-bubble alk-typing">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          <div className="alk-quick">
            {QUICK.map((q) => (
              <button key={q} className="alk-chip" onClick={() => respond(q)}>
                {q}
              </button>
            ))}
          </div>

          <form className="alk-input" onSubmit={onSubmit}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about services, pricing, ERP..."
              aria-label="Type your message"
            />
            <button type="submit" aria-label="Send" disabled={!input.trim()}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </form>
        </div>
      )}

      <button
        className={"alk-fab" + (open ? " open" : "")}
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close chat" : "Open chat"}
      >
        {open ? (
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
      </button>
    </>
  );
}
