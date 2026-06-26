"use client";

import { useEffect, useState } from "react";

const EMAIL = "louie@aarkledger.com";
const LOGO_SRC = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAARQAAABQCAYAAADYzoq3AAAChklEQVR42u3dW27jMAwFUNHI/rfMbqBoHT9J6ZzPATJwHPqKklx7DAAAAAAAAAAWFic/nzf9v0/IBsedD/2OT57PzjXDPzan4NAFXPG4c6w7sCFQBMeC3yuFiUA5UrzpokSYCBR6TA+iWSAKaYFyukCqFlEuEizWTdChCB1THQRK2CrG+Wa7efTOxu136qTgO59hgXO26Vg433Se8kSTkT4FpGOjVqDkYhdjChOBzru7PGFxUJgIlWEN5WAx7L0nJRQ36FCGrU9Ts0WnkQgUBew3oXqg5OJFpEu5fn1HqOhQwJYx537oMzskb++u5Avf+cnjr7R7tedY3IqvQxG0WnTrKQiUFUbDbsGnG1k8UM5elOEPBo36uj+BYmGw5ggbJ/6t0vnWqQBwbsTVigK7c8MuDzCsoQDtAsXiGQAAAAAAAAAAAAAAAAAAADA8noDxyoOx1ZZAaVkw2SRIc7Kgz6aDV4d6ya51snkZU9mLNSd7TYcaWqBOPALS+3WeLODqQalOBIpi8Z2ock4/w/rQ28eYO4slChdsfPmZUCu31otAWTRMfjvWLBgqR4Mhfvm83Z9r6iW9RoOOo/cVoR3CZHiNBuXe/fvGqJQXhZ4wWcBn0QWqMF+mcb2kQAGm3xkz5cHUxe+iQ2GKkVQ4TRbyOhTclNY39KLa8bkPBdSLDgWEXr1u0RpKr6lFpUcAROfCn6xOrKHw50WWDaYDaZphaiZQ6rewnUbzHBZxLZQfSLyc4OlWnZ7YVnF0yi+OsfKdp12f2BYdpsObbUWt7oXH4AFKi3cppjzC5OljsXYy8TkUKG5aeqqYQ5jMv4283fjsCyvfxy+6mCzsQjegiwMAAAAAAABgej8Cgol7BhBInQAAAABJRU5ErkJggg==";

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
    body: "Personal and corporate income-tax preparation and indirect-tax filing (VAT, GST, or sales tax) — organized accurately and filed on time.",
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
    body: "End-to-end payroll with statutory contributions and remittances fully handled — scaling cleanly from your first hire to fifty employees.",
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

const packages = {
  note: "For sole proprietors, SMEs, and corporations. Scope is set by your monthly transaction volume.",
  plans: [
    {
      name: "Starter",
      who: "Sole Proprietor / Freelancer",
      features: [
        "Bookkeeping up to 80 txns/mo",
        "Monthly bank reconciliation",
        "Statutory tax filings (non-VAT)",
        "Basic income statement & balance sheet",
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
        "Indirect tax (VAT / GST / sales tax) filing",
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
        "Full statutory compliance suite",
        "Consolidated statements",
        "Payroll up to 50 employees",
        "FP&A (budget vs. actual)",
        "Dedicated point-of-contact",
      ],
    },
  ],
};

const engagements = [
  { name: "Financial Statements", desc: "Monthly or annual statements + supporting schedules" },
  { name: "Personal Tax Returns", desc: "Income-tax return preparation + supporting schedules" },
  { name: "Corporate Tax Returns", desc: "Corporate income-tax return preparation" },
  { name: "Indirect Tax Filing", desc: "VAT, GST, or sales-tax returns + reconciliation" },
  { name: "Audit Prep Support", desc: "Schedules & working papers for your external auditor" },
  { name: "FP&A — Budget & Forecast", desc: "Annual budget + cash flow + variance analysis" },
  { name: "ERP Setup & Migration", desc: "Cloud and mid-market implementation + training" },
  { name: "Entity Formation", desc: "Incorporation and business registration support" },
];

export default function Home() {
  const data = packages;
  const [form, setForm] = useState({ name: "", company: "", message: "" });
  const onField = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  const handleSubmit = (e) => {
    e.preventDefault();
    const subject = `New enquiry — ${form.company || form.name || "Website"}`;
    const body = `Name: ${form.name}\nCompany: ${form.company}\n\n${form.message}`;
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  useEffect(() => {
    const root = document.documentElement;
    let raf = 0;
    const onMove = (e) => {
      const x = e.clientX / window.innerWidth - 0.5;
      const y = e.clientY / window.innerHeight - 0.5;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        root.style.setProperty("--mx", x.toFixed(3));
        root.style.setProperty("--my", y.toFixed(3));
      });
    };
    const onScroll = () => {
      root.style.setProperty("--sy", String(window.scrollY));
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <header className="site-header">
        <div className="container nav">
          <a href="#top" className="brand" aria-label="Aarkledger">
            <img className="brand-logo" src={LOGO_SRC} alt="Aarkledger" />
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
              <span className="eyebrow">Financial Consultancy Firm · Asia Pacific</span>
              <h1>Finance built for start-ups and enterprises with complex data ecosystems.</h1>
              <p>
                Aarkledger is a boutique financial consultancy firm for start-ups
                and enterprises with complex business models and data ecosystems —
                bringing structure to bookkeeping, reporting, payroll, and FP&amp;A
                for clients across the Asia Pacific region.
              </p>
              <div className="hero-actions">
                <a href="#pricing" className="btn btn-ghost" style={{ color: "#fff", borderColor: "rgba(255,255,255,0.3)" }}>View packages</a>
              </div>
              <div className="hero-meta">
                <div><strong>Asia Pacific</strong><span>Serving clients across the region</span></div>
                <div><strong>End-to-end</strong><span>Books to board reporting</span></div>
              </div>
            </div>
          </div>
        </section>

        {/* Services */}
        <section id="services" className="float-section">
          <span className="ghost ghost-a" aria-hidden="true">finance</span>
          <div className="container">
            <div className="section-head left">
              <span className="eyebrow">What we do</span>
              <h2>Full-service finance, one accountable partner</h2>
              <p>From day-to-day bookkeeping to forward planning, every engagement is delivered with accuracy, clear documentation, and a defined scope.</p>
            </div>
            <ul className="float-list">
              {services.map((s, i) => (
                <li className="float-row float" style={{ "--d": (i % 3) + 1 }} key={s.title}>
                  <span className="float-idx">{String(i + 1).padStart(2, "0")}</span>
                  <span className="float-ico">{s.icon}</span>
                  <div className="float-body">
                    <h3>{s.title}</h3>
                    <p>{s.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Packages */}
        <section id="pricing" className="section-soft float-section">
          <span className="ghost ghost-b" aria-hidden="true">packages</span>
          <div className="container">
            <div className="section-head left">
              <span className="eyebrow">Monthly retainers</span>
              <h2>Monthly packages built around your needs</h2>
              <p>See exactly what each package includes. Reach out by email for a quote tailored to your monthly transaction volume.</p>
            </div>

            <p className="region-note">{data.note}</p>

            <div className="plan-float">
              {data.plans.map((p, i) => (
                <div className={`plan float${p.featured ? " featured" : ""}`} style={{ "--d": i + 1 }} key={p.name}>
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
        <section id="engagements" className="float-section">
          <span className="ghost ghost-a" aria-hidden="true">engage</span>
          <div className="container">
            <div className="section-head left">
              <span className="eyebrow">Project & à la carte</span>
              <h2>Engagement services, billed per project</h2>
              <p>Need something specific rather than a monthly retainer? These are scoped as standalone projects, with 50% upfront and 50% on completion.</p>
            </div>
            <ul className="float-list compact">
              {engagements.map((e, i) => (
                <li className="float-row float" style={{ "--d": (i % 3) + 1 }} key={e.name}>
                  <span className="float-idx">{String(i + 1).padStart(2, "0")}</span>
                  <div className="float-body">
                    <h3>{e.name}</h3>
                    <p>{e.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* About */}
        <section id="about" className="section-soft float-section">
          <span className="ghost ghost-c" aria-hidden="true">since 2015</span>
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
              <div className="stat float" style={{ "--d": 1 }}><strong>Established in 2015</strong><span>A decade of accounting and finance expertise</span></div>
              <div className="stat float" style={{ "--d": 2 }}><strong>Built for start-ups</strong><span>Systems architecture and data integrations for complex business models</span></div>
              <div className="stat float" style={{ "--d": 3 }}><strong>IB + PE expertise</strong><span>Led by finance professionals with investment banking and private equity experience</span></div>
              <div className="stat float" style={{ "--d": 2 }}><strong>Asia Pacific reach</strong><span>Serving start-ups and enterprises across the Asia Pacific region</span></div>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section id="contact">
          <div className="container">
            <div className="cta">
              <h2>Let&apos;s get your books in order</h2>
              <p>Tell us about your business and we&apos;ll recommend the right package or engagement — no obligation.</p>
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="field-row">
                  <input type="text" name="name" placeholder="Your name" value={form.name} onChange={onField} required />
                  <input type="text" name="company" placeholder="Company / business" value={form.company} onChange={onField} />
                </div>
                <textarea name="message" placeholder="What do you need help with?" rows={4} value={form.message} onChange={onField} required />
                <button type="submit" className="btn btn-accent">Compose email</button>
              </form>
              <div className="cta-email">
                Or reach one of our Finance Business Partners directly: <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container">
          <div className="footer-top">
            <div>
              <div className="brand"><img className="footer-logo" src={LOGO_SRC} alt="Aarkledger" /></div>
              <p style={{ marginTop: 12, fontSize: "0.9rem", maxWidth: 320 }}>
                Bookkeeping, tax, reporting, payroll, and FP&amp;A for clients
                across the Asia Pacific region.
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
