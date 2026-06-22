"use client";

import { useState } from "react";

const EMAIL = "louie@aarkledger.com";
const MAILTO_DISCOVERY =
  "mailto:louie@aarkledger.com?subject=Discovery%20Call%20Request%20%E2%80%94%20Aarkledger&body=Hi%20Louie%2C%0A%0AI%27d%20like%20to%20book%20a%20free%2030-minute%20discovery%20call.%0A%0ABusiness%20name%3A%0AJurisdiction%20(Canada%20%2F%20US%20%2F%20Philippines)%3A%0AEntity%20type%20(sole%20prop%20%2F%20incorporated%20%2F%20corporation)%3A%0AWhat%20you%20need%20help%20with%3A%0A%0AThanks!";

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
    title: "Tax Preparation & Compliance",
    body: "Personal and corporate returns, sales tax (GST/HST, US sales tax, BIR VAT), and optimization — filed correctly and on time.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12h6M9 16h6M9 8h6"/><path d="M6 2h9l5 5v15H6z"/><path d="M15 2v5h5"/></svg>
    ),
  },
  {
    title: "Financial Reporting",
    body: "ASPE, US GAAP, IFRS, and PFRS-compliant statements with notes and a management letter you can hand to lenders and investors.",
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
    note: "Prices in CAD per month, exclusive of GST/HST. Benchmarked to CPA Canada market rates.",
    plans: [
      {
        name: "Starter",
        who: "Sole Proprietor / Freelancer",
        price: "CAD 550",
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
        price: "CAD 1,400",
        featured: true,
        features: [
          "Bookkeeping up to 300 txns/mo",
          "Bank + subsidiary reconciliation",
          "Monthly + quarterly GST/HST",
          "ASPE-compliant statements",
          "Payroll up to 20 employees",
          "Annual T2 corporate return",
          "Priority email & chat support",
        ],
      },
      {
        name: "Corporate",
        who: "Corporation / High-Volume",
        price: "CAD 2,800+",
        features: [
          "Bookkeeping 300+ txns/mo",
          "Multi-account reconciliation",
          "Consolidated statements",
          "Payroll up to 50 employees",
          "FP&A (budget vs. actual)",
          "CRA audit support",
          "Dedicated point-of-contact",
        ],
      },
    ],
  },
  US: {
    label: "United States",
    note: "Prices in USD per month, exclusive of state/local taxes. Benchmarked to AICPA survey data.",
    plans: [
      {
        name: "Starter",
        who: "Sole Proprietor / Freelancer",
        price: "USD 500",
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
        price: "USD 1,200",
        featured: true,
        features: [
          "Bookkeeping up to 300 txns/mo",
          "Bank + subsidiary reconciliation",
          "State sales tax filing (1 state)",
          "US GAAP-compliant statements",
          "Payroll up to 20 employees",
          "Annual return (1040/1120/1120-S/1065)",
          "Priority email & chat support",
        ],
      },
      {
        name: "Corporate",
        who: "C-Corp / Multi-State",
        price: "USD 2,500+",
        features: [
          "Bookkeeping 300+ txns/mo",
          "Multi-state sales tax compliance",
          "Consolidated statements",
          "Payroll up to 50 employees",
          "FP&A (budget vs. actual)",
          "IRS audit support",
          "Dedicated point-of-contact",
        ],
      },
    ],
  },
  PH: {
    label: "Philippines",
    note: "Prices in ₱ per month, exclusive of 12% VAT. Benchmarked to local PFRS / BIR market rates.",
    plans: [
      {
        name: "Starter",
        who: "Sole Proprietor / Freelancer",
        price: "₱4,500",
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
        price: "₱12,000",
        featured: true,
        features: [
          "Bookkeeping up to 300 txns/mo",
          "Bank + subsidiary reconciliation",
          "BIR VAT (2550M, 2550Q, 1601C)",
          "PFRS-compliant statements",
          "Payroll up to 20 employees",
          "Quarterly management report",
          "Priority email & chat support",
        ],
      },
      {
        name: "Corporate",
        who: "Corporation / High-Volume",
        price: "₱25,000+",
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
  { name: "Financial Reporting", desc: "Compliant statements + notes + management letter", rate: "Per engagement" },
  { name: "Personal Tax Returns", desc: "T1 / Form 1040 / BIR 1701 + schedules", rate: "Per filing" },
  { name: "Corporate Tax Returns", desc: "T2 / 1120 / 1702 + optimization", rate: "Per filing" },
  { name: "Sales Tax / VAT Filing", desc: "GST/HST, US sales tax, BIR VAT returns", rate: "Per filing" },
  { name: "Audit Preparation", desc: "PBC schedules, working papers, audit liaison", rate: "Per engagement" },
  { name: "FP&A — Budget & Forecast", desc: "Annual budget + cash flow + variance analysis", rate: "Per engagement" },
  { name: "ERP Setup & Migration", desc: "Cloud and mid-market implementation + training", rate: "One-time" },
  { name: "Entity Formation", desc: "Incorporation / LLC / SEC / DTI registration", rate: "One-time" },
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
            <a href="#pricing">Pricing</a>
            <a href="#engagements">Engagements</a>
            <a href="#about">About</a>
            <a href="#contact" className="btn btn-accent">Book a discovery call</a>
          </nav>
        </div>
      </header>

      <main id="top">
        {/* Hero */}
        <section className="hero" style={{ padding: 0 }}>
          <div className="container">
            <div className="hero-inner">
              <span className="eyebrow">Financial consultancy · CA · US · PH</span>
              <h1>Clear books, clean compliance, confident decisions.</h1>
              <p>
                Aarkledger handles bookkeeping, tax, reporting, payroll, and FP&amp;A
                for sole proprietors, SMEs, and corporations across Canada, the United
                States, and the Philippines — to the standards regulators and lenders
                expect.
              </p>
              <div className="hero-actions">
                <a href="#contact" className="btn btn-accent">Book a free discovery call</a>
                <a href="#pricing" className="btn btn-ghost" style={{ color: "#fff", borderColor: "rgba(255,255,255,0.3)" }}>View pricing</a>
              </div>
              <div className="hero-meta">
                <div><strong>3 jurisdictions</strong><span>CPA Canada · AICPA · PICPA</span></div>
                <div><strong>End-to-end</strong><span>Books to board reporting</span></div>
                <div><strong>Free 30-min call</strong><span>No obligation</span></div>
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
              <p>From day-to-day bookkeeping to strategic planning, every engagement is delivered to the relevant professional standard in your jurisdiction.</p>
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

        {/* Pricing */}
        <section id="pricing" className="section-soft">
          <div className="container">
            <div className="section-head">
              <span className="eyebrow">Monthly retainers</span>
              <h2>Simple, transparent package pricing</h2>
              <p>Choose your jurisdiction. Every retainer assumes a stated transaction band; high-volume clients get a custom quote.</p>
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
                  <div className="price">
                    {p.price} <span>/ month</span>
                  </div>
                  <ul>
                    {p.features.map((f) => (
                      <li key={f}><Check /> {f}</li>
                    ))}
                  </ul>
                  <a
                    href={MAILTO_DISCOVERY}
                    className={`btn${p.featured ? " btn-accent" : " btn-ghost"}`}
                  >
                    Get started
                  </a>
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
              <p>Need something specific rather than a monthly retainer? These are scoped and quoted per engagement, with 50% upfront and 50% on completion.</p>
            </div>
            <div className="engage-grid">
              {engagements.map((e) => (
                <div className="engage-item" key={e.name}>
                  <div>
                    <div className="name">{e.name}</div>
                    <div className="desc">{e.desc}</div>
                  </div>
                  <div className="rate">{e.rate}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* About */}
        <section id="about" className="section-soft">
          <div className="container about-wrap">
            <div>
              <h2>An accounting partner built for cross-border businesses</h2>
              <p>
                Aarkledger is a financial consultancy serving clients across Canada,
                the United States, and the Philippines. We pair rigorous local
                compliance — ASPE, US GAAP, IFRS, and PFRS — with practical, modern
                bookkeeping and reporting.
              </p>
              <p>
                Pricing reflects local industry standards in each market, not
                nationality-based differentiation, so you always pay a fair,
                benchmarked rate. Every engagement is governed by a signed engagement
                letter and delivered to recognized professional standards.
              </p>
            </div>
            <div className="stats">
              <div className="stat"><strong>CA · US · PH</strong><span>Multi-jurisdiction coverage</span></div>
              <div className="stat"><strong>4 standards</strong><span>ASPE · GAAP · IFRS · PFRS</span></div>
              <div className="stat"><strong>Up to 50</strong><span>Employees on payroll</span></div>
              <div className="stat"><strong>48 hr</strong><span>Rush turnaround available</span></div>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section id="contact">
          <div className="container">
            <div className="cta">
              <h2>Let&apos;s get your books in order</h2>
              <p>Book a free 30-minute discovery call. Tell us about your business and we&apos;ll recommend the right package or engagement — no obligation.</p>
              <div className="cta-actions">
                <a href={MAILTO_DISCOVERY} className="btn btn-accent">Book your free discovery call</a>
                <a href={`mailto:${EMAIL}`} className="btn btn-ghost" style={{ color: "#fff", borderColor: "rgba(255,255,255,0.3)" }}>Email us</a>
              </div>
              <div className="cta-email">
                Or reach us directly at <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
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
              <a href="#pricing">Pricing</a>
              <a href="#engagements">Engagements</a>
              <a href="#about">About</a>
              <a href={`mailto:${EMAIL}`}>Contact</a>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} Aarkledger. All rights reserved.</span>
            <span>CPA Canada · AICPA · PICPA aligned · Engagements by signed letter</span>
          </div>
        </div>
      </footer>
    </>
  );
}
