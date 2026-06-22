"use client";

import { useState } from "react";

const EMAIL = "louie@aarkledger.com";

const Check = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const services = [
  {
    title: "Bookkeeping & Reconciliation",
    body: "Accurate monthly bookkeeping and bank, subsidiary, and multi-account reconciliation that keeps your records clean and audit-ready.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16v16H4z"/><path d="M4 9h16M9 4v16"/></svg>
    ),
  },
  {
    title: "Tax Preparation & Filing",
    body: "Personal and corporate return preparation and sales tax (GST/HST, US sales tax, BIR VAT) — organized accurately and filed on time.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12h6M9 16h6M9 8h6"/><path d="M6 2h9l5 5v15H6z"/><path d="M15 2v5h5"/></svg>
    ),
  },
  {
    title: "Financial Reporting",
    body: "Clear monthly and annual financial statements with supporting schedules you can share with owners, lenders, and partners.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="M7 14l4-4 3 3 5-6"/></svg>
    ),
  },
  {
    title: "Payroll & Remittances",
    body: "End-to-end payroll with CRA, IRS/state, and BIR remittances — scaling cleanly from your first hire to fifty employees.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/></svg>
    ),
  },
  {
    title: "FP&A & Forecasting",
    body: "Annual budgets, 12-month cash-flow forecasts, and budget-vs-actual variance analysis so you can plan with confidence.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><rect x="7" y="11" width="3" height="7"/><rect x="13" y="7" width="3" height="11"/></svg>
    ),
  },
  {
    title: "ERP Setup & Support",
    body: "QuickBooks Online, Xero, Sage, NetSuite, and Odoo implementation, migration, training, and ongoing system health checks.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
    ),
  },
];

const regions = {
  CA: {
    label: "Canada",
    note: "For Canadian sole proprietors, SMEs, and corporations. Scope is set by your monthly transaction volume.",
    plans: [
      {
        name: "Starter",
        who: "Sole Proprietor / Freelancer",
        features: [
          "Bookkeeping up to 80 txns/mo",
          "Monthly bank reconciliation",
          "Quarterly GST/HST filing",
          "Basic financial statements",
          "Email support",
        ],
      },
      {
        name: "Growth",
        who: "SME / Incorporated",
        featured: true,
        features: [
          "Bookkeeping up to 300 txns/mo",
          "Bank + subsidiary reconciliation",
          "Monthly + quarterly GST/HST",
          "Monthly financial statements",
          "Payroll up to 20 employees",
          "Annual T2 corporate return",
          "Priority email & chat support",
        ],
      },
      {
        name: "Corporate",
        who: "Corporation / High-Volume",
        features: [
          "Bookkeeping 300+ txns/mo",
          "Multi-account reconciliation",
          "Consolidated statements",
          "Payroll up to 50 employees",
          "FP&A (budget vs. actual)",
          "CRA correspondence support",
          "Dedicated point-of-contact",
        ],
      },
    ],
  },
  US: {
    label: "United States",
    note: "For US sole proprietors, LLCs, S-corps, and corporations. Scope is set by your monthly transaction volume.",
    plans: [
      {
        name: "Starter",
        who: "Sole Proprietor / Freelancer",
        features: [
          "Bookkeeping up to 80 txns/mo",
          "Monthly bank reconciliation",
          "State sales tax filing (1 state)",
          "Basic financial statements",
          "Email support",
        ],
      },
      {
        name: "Growth",
        who: "SME / S-Corp / LLC",
        featured: true,
        features: [
          "Bookkeeping up to 300 txns/mo",
          "Bank + subsidiary reconciliation",
          "State sales tax filing (1 state)",
          "Monthly financial statements",
          "Payroll up to 20 employees",
          "Annual return (1040/1120/1120-S/1065)",
          "Priority email & chat support",
        ],
      },
      {
        name: "Corporate",
        who: "C-Corp / Multi-State",
        features: [
          "Bookkeeping 300+ txns/mo",
          "Multi-state sales tax compliance",
          "Consolidated statements",
          "Payroll up to 50 employees",
          "FP&A (budget vs. actual)",
          "IRS correspondence support",
          "Dedicated point-of-contact",
        ],
      },
    ],
  },
  PH: {
    label: "Philippines",
    note: "For Philippine sole proprietors, SMEs, and corporations. Scope is set by your monthly transaction volume.",
    plans: [
      {
        name: "Starter",
        who: "Sole Proprietor / Freelancer",
        features: [
          "Bookkeeping up to 80 txns/mo",
          "Monthly bank reconciliation",
          "BIR non-VAT (1701Q, 2551Q)",
          "Basic income statement & BS",
          "Email support",
        ],
      },
      {
        name: "Growth",
        who: "SME / VAT-Registered",
        featured: true,
        features: [
          "Bookkeeping up to 300 txns/mo",
          "Bank + subsidiary reconciliation",
          "BIR VAT (2550M, 2550Q, 1601C)",
          "Monthly financial statements",
          "Payroll up to 20 employees",
          "Quarterly management report",
          "Priority email & chat support",
        ],
      },
      {
        name: "Corporate",
        who: "Corporation / High-Volume",
        features: [
          "Bookkeeping 300+ txns/mo",
          "Multi-account reconciliation",
          "Full BIR compliance suite",
          "Consolidated statements",
          "Payroll up to 50 employees",
          "FP&A (budget vs. actual)",
          "Dedicated point-of-contact",
        ],
      },
    ],
  },
};

const engagements = [
  { name: "Financial Statements", desc: "Monthly or annual statements + supporting schedules" },
  { name: "Personal Tax Returns", desc: "T1 / Form 1040 / BIR 1701 + schedules" },
  { name: "Corporate Tax Returns", desc: "T2 / 1120 / 1702 preparation" },
  { name: "Sales Tax / VAT Filing", desc: "GST/HST, US sales tax, BIR VAT returns" },
  { name: "Audit Prep Support", desc: "Schedules & working papers for your external auditor" },
  { name: "FP&A — Budget & Forecast", desc: "Annual budget + cash flow + variance analysis" },
  { name: "ERP Setup & Migration", desc: "Cloud and mid-market implementation + training" },
  { name: "Entity Formation", desc: "Incorporation / LLC / SEC / DTI registration" },
];

export default function Home() {
  const [region, setRegion] = useState("CA");
  const data = regions[region];

  return (
    <>
      <header className="site-header">
        <div className="container nav">
          <a href="#top" className="brand">
            <span className="mark">A</span> Aarkledger
          </a>
          <nav className="nav-links">
            <a href="#services">Services</a>
            <a href="#pricing">Packages</a>
            <a href="#engagements">Engagements</a>
            <a href="#about">About</a>
          </nav>
        </div>
      </header>

      <main id="top">
        {/* Hero */}
        <section className="hero" style={{ padding: 0 }}>
          <div className="container">
            <div className="hero-inner">
              <span className="eyebrow">Financial Consultancy Firm · Metro Cebu</span>
              <h1>Finance built for start-ups and enterprises with complex data ecosystems.</h1>
              <p>
                Aarkledger is a boutique financial consultancy firm for start-ups
                and enterprises with complex business models and data ecosystems —
                bringing structure to bookkeeping, reporting, payroll, and FP&amp;A
                across Canada, the United States, and the Philippines.
              </p>
              <div className="hero-actions">
                <a href="#pricing" className="btn btn-ghost" style={{ color: "#fff", borderColor: "rgba(255,255,255,0.3)" }}>View packages</a>
              </div>
              <div className="hero-meta">
                <div><strong>3 jurisdictions</strong><span>Canada · US · Philippines</span></div>
                <div><strong>End-to-end</strong><span>Books to board reporting</span></div>
                <div><strong>By email</strong><span>Replies within 1 business day</span></div>
              </div>
            </div>
          </div>
        </section>

        {/* Services */}
        <section id="services">
          <div className="container">
            <div className="section-head">
              <span className="eyebrow">What we do</span>
              <h2>Full-service finance, one accountable partner</h2>
              <p>From day-to-day bookkeeping to forward planning, every engagement is delivered with accuracy, clear documentation, and a defined scope.</p>
            </div>
            <div className="grid">
              {services.map((s) => (
                <div className="card" key={s.title}>
                  <span className="icon">{s.icon}</span>
                  <h3>{s.title}</h3>
                  <p>{s.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Packages */}
        <section id="pricing" className="section-soft">
          <div className="container">
            <div className="section-head">
              <span className="eyebrow">Monthly retainers</span>
              <h2>Monthly packages built around your needs</h2>
              <p>Choose your jurisdiction and see exactly what each package includes. Reach out by email for a quote tailored to your volume.</p>
            </div>

            <div className="region-tabs">
              {Object.entries(regions).map(([key, r]) => (
                <button
                  key={key}
                  className={region === key ? "active" : ""}
                  onClick={() => setRegion(key)}
                >
                  {r.label}
                </button>
              ))}
            </div>
            <p className="region-note">{data.note}</p>

            <div className="pricing-grid">
              {data.plans.map((p) => (
                <div className={`plan${p.featured ? " featured" : ""}`} key={p.name}>
                  {p.featured && <span className="badge">Most Popular</span>}
                  <h3>{p.name}</h3>
                  <div className="who">{p.who}</div>
                  <div className="plan-includes">What&apos;s included</div>
                  <ul>
                    {p.features.map((f) => (
                      <li key={f}><Check /> {f}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Engagements */}
        <section id="engagements">
          <div className="container">
            <div className="section-head">
              <span className="eyebrow">Project & à la carte</span>
              <h2>Engagement services, billed per project</h2>
              <p>Need something specific rather than a monthly retainer? These are scoped as standalone projects, with 50% upfront and 50% on completion.</p>
            </div>
            <div className="engage-grid">
              {engagements.map((e) => (
                <div className="engage-item" key={e.name}>
                  <div>
                    <div className="name">{e.name}</div>
                    <div className="desc">{e.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* About */}
        <section id="about" className="section-soft">
          <div className="container about-wrap">
            <div>
              <h2>The consultancy firm built for start-ups and enterprises with complex data ecosystems</h2>
              <p>
                Aarkledger is a boutique financial consultancy firm for start-ups
                and enterprises with complex business models and data ecosystems.
                We bring structure to bookkeeping, reporting, payroll, and FP&amp;A
                — without the overhead of an in-house finance team.
              </p>
              <p>
                We work on a clear, contractual basis: every engagement is defined by a
                signed engagement letter that sets out scope, deliverables, and
                timelines, so you always know exactly what you are getting.
              </p>
            </div>
            <div className="stats">
              <div className="stat"><strong>Established in 2015</strong><span>A decade of accounting and finance expertise</span></div>
              <div className="stat"><strong>Built for start-ups</strong><span>Systems architecture and data integrations for complex business models</span></div>
              <div className="stat"><strong>IB + PE expertise</strong><span>Led by finance professionals with investment banking and private equity experience</span></div>
              <div className="stat"><strong>Asia-Pacific reach</strong><span>Serving clients across North America and the Asia-Pacific region</span></div>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section id="contact">
          <div className="container">
            <div className="cta">
              <h2>Let&apos;s get your books in order</h2>
              <p>Tell us about your business and we&apos;ll recommend the right package or engagement — no obligation.</p>
              <div className="cta-email">
                Reach out to one of our Finance Business Partners: <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container">
          <div className="footer-top">
            <div>
              <div className="brand"><span className="mark">A</span> Aarkledger</div>
              <p style={{ marginTop: 12, fontSize: "0.9rem", maxWidth: 320 }}>
                Bookkeeping, tax, reporting, payroll, and FP&amp;A across Canada, the
                United States, and the Philippines.
              </p>
            </div>
            <div className="footer-links">
              <a href="#services">Services</a>
              <a href="#pricing">Packages</a>
              <a href="#engagements">Engagements</a>
              <a href="#about">About</a>
              <a href={`mailto:${EMAIL}`}>Contact</a>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} Aarkledger. All rights reserved.</span>
            <span>Boutique financial consultancy · Engagements by signed contract</span>
          </div>
        </div>
      </footer>
    </>
  );
}
