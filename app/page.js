"use client";

import { useEffect, useState } from "react";

const EMAIL = "louie@aarkledger.com";
const CORP_EMAIL = "corporate@aarkledger.com";
const PHONE = "+63 928 285 7646";
const PHONE_TEL = "+639282857646";
const LINKEDIN = "https://www.linkedin.com/company/aarkledger-accounting/";
const LOGO_SRC = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAARQAAABQCAYAAADYzoq3AAAChklEQVR42u3dW27jMAwFUNHI/rfMbqBoHT9J6ZzPATJwHPqKklx7DAAAAAAAAAAWFic/nzf9v0/IBsedD/2OT57PzjXDPzan4NAFXPG4c6w7sCFQBMeC3yuFiUA5UrzpokSYCBR6TA+iWSAKaYFyukCqFlEuEizWTdChCB1THQRK2CrG+Wa7efTOxu136qTgO59hgXO26Vg433Se8kSTkT4FpGOjVqDkYhdjChOBzru7PGFxUJgIlWEN5WAx7L0nJRQ36FCGrU9Ts0WnkQgUBew3oXqg5OJFpEu5fn1HqOhQwJYx537oMzskb++u5Avf+cnjr7R7tedY3IqvQxG0WnTrKQiUFUbDbsGnG1k8UM5elOEPBo36uj+BYmGw5ggbJ/6t0vnWqQBwbsTVigK7c8MuDzCsoQDtAsXiGQAAAAAAAAAAAAAAAAAAADA8noDxyoOx1ZZAaVkw2SRIc7Kgz6aDV4d6ya51snkZU9mLNSd7TYcaWqBOPALS+3WeLODqQalOBIpi8Z2ock4/w/rQ28eYO4slChdsfPmZUCu31otAWTRMfjvWLBgqR4Mhfvm83Z9r6iW9RoOOo/cVoR3CZHiNBuXe/fvGqJQXhZ4wWcBn0QWqMF+mcb2kQAGm3xkz5cHUxe+iQ2GKkVQ4TRbyOhTclNY39KLa8bkPBdSLDgWEXr1u0RpKr6lFpUcAROfCn6xOrKHw50WWDaYDaZphaiZQ6rewnUbzHBZxLZQfSLyc4OlWnZ7YVnF0yi+OsfKdp12f2BYdpsObbUWt7oXH4AFKi3cppjzC5OljsXYy8TkUKG5aeqqYQ5jMv4283fjsCyvfxy+6mCzsQjegiwMAAAAAAABgej8Cgol7BhBInQAAAABJRU5ErkJggg==";
import { useCallback, useRef } from "react";
import SiteHeader from "./components/SiteHeader";
import SiteFooter from "./components/SiteFooter";
import EntropyField from "./components/EntropyField";
import IssueRegister from "./components/IssueRegister";
import LifecycleChart from "./components/LifecycleChart";
import OperatorDiff from "./components/OperatorDiff";
import BoardSchematic from "./components/BoardSchematic";
import GraticuleGlobe from "./components/GraticuleGlobe";
import ErpConsole from "./components/ErpConsole";
import RhythmDial from "./components/RhythmDial";
import ScopeMeter from "./components/ScopeMeter";
import { ArrowDown, ArrowRight, Check, FN_ICONS, Plus } from "./components/icons";
import { onProgress, prefersReducedMotion, useStoryEngine } from "./components/useStoryEngine";

/* ------------------------------------------------------------------ */
/* Copy                                                                 */
/* ------------------------------------------------------------------ */

const ISSUES = [
  "Month-end close: day 19 and counting",
  "Bank reconciliation: unexplained variance",
  "ERP go-live: live, barely used",
  "Compliance notice: received, unresolved",
  "Board reporting: figures disputed",
  "Payroll remittances: run on spreadsheets",
];

const FUNCTIONS = [
  { code: "AL-01", label: "Accounting", name: "Accounting", icon: "acc", desc: "Bookkeeping, bank and multi-account reconciliation, and a month-end close that actually ends." },
  { code: "AL-02", label: "Compliance & tax", name: "Compliance & tax", icon: "tax", desc: "Personal and corporate income tax, plus VAT, GST and sales tax, prepared and filed on schedule." },
  { code: "AL-03", label: "Finance & FP&A", name: "Finance & FP&A", icon: "fpa", desc: "Budgets, 12-month cash-flow forecasts and budget-vs-actual reporting that leadership can act on." },
  { code: "AL-04", label: "Payroll", name: "Payroll", icon: "pay", desc: "Payroll runs, statutory contributions and remittances, handled end to end." },
  { code: "AL-05", label: "Corporate & legal", name: "Corporate & legal compliance", icon: "legal", desc: "Entity formation, business registration and the statutory filings that keep your company in good standing, coordinated with your legal counsel wherever a lawyer is required." },
  { code: "AL-06", label: "ERP engineering", name: "ERP systems engineering", icon: "erp", desc: "Implementation, configuration, migration, training, health checks and ongoing maintenance on the platforms you run." },
  { code: "AL-07", label: "Data management", name: "Data management", icon: "data", desc: "Clean master data, a consistent chart of accounts and one reconciled version of the numbers across every system." },
];

const PROOF = [
  ["2015", "Established. A decade-plus in accounting and finance."],
  ["IB + PE", "Led by finance professionals with investment banking and private equity experience."],
  ["3 leading ERPs", "SAP S/4HANA, Oracle NetSuite and Microsoft Dynamics 365 Business Central."],
  ["Asia-Pacific", "Start-ups, SMEs and enterprises across the region."],
];

const ERPS = [
  {
    code: "ERP-01",
    name: "SAP S/4HANA",
    body: "For enterprises and groups with complex structures and high transaction volumes, where one system has to carry many entities and a demanding close.",
    work: ["Multi-entity structures", "Group consolidation", "Post-go-live health checks"],
  },
  {
    code: "ERP-02",
    name: "Oracle NetSuite",
    body: "For high-growth companies adding entities, subsidiaries and revenue streams, often moving up from entry-level accounting software.",
    work: ["Subsidiary set-up and roll-ups", "Migration from entry-level software", "Configuration as you scale"],
  },
  {
    code: "ERP-03",
    name: "Microsoft Dynamics 365 Business Central",
    body: "For SMEs and mid-market businesses outgrowing their accounting software and wanting an ERP their own people can run.",
    work: ["Migration from QuickBooks Online or Xero", "User training", "Regular health checks"],
  },
];
/* One service vocabulary, used by the ERP cards, the console pipeline and its status line. */
const ERP_SERVICES = ["Implement", "Configure", "Migrate", "Train", "Health check", "Maintain"];
const ALSO = ["QuickBooks Online", "Xero", "Zoho Books", "Sage", "Odoo"];

const SPECIALISMS = [
  ["Complex business models", "Multi-entity groups and multiple revenue streams, consolidated into statements that tie out."],
  ["Fragmented data", "Numbers spread across banks, platforms and spreadsheets, reconciled into one set you can defend."],
  ["Stalled ERP projects", "Implementations that went live but never settled, and migrations that left the data worse than before. We diagnose, repair and stay to maintain."],
  ["Investor-grade reporting", "Reporting shaped by investment banking and private equity experience, built the way boards, investors and lenders read it."],
  ["Indirect tax across jurisdictions", "VAT, GST and sales tax, prepared and reconciled for businesses operating across Asia-Pacific."],
  ["Audit readiness", "Schedules and working papers prepared for your external auditor, so year-end is a review, not a rescue."],
];

const STEPS = [
  ["01", "Diagnose", "We start in your ledgers, not a workshop: reconciliations, systems, filings and reporting. You get a plain account of what's broken, what's at risk and what to fix first."],
  ["02", "Scope and sign", "We agree a defined scope and the package or project that fits, set out in a signed contract before any work starts."],
  ["03", "Embed", "Our team joins your systems, channels and calendar, and takes ownership of the work in scope and the deadlines that come with it."],
  ["04", "Stabilize", "We clear the backlog, close the compliance gaps and bring reconciliations to the point where the numbers can be trusted again."],
  ["05", "Run and improve", "Every month we reconcile, close, report, file and forecast. Then we look at what to automate, simplify or rebuild next, including your ERP."],
];

const PACKAGES = [
  {
    name: "Standard",
    tag: "Core scope",
    tagline: "Standard accounting, done properly every month.",
    who: "For businesses that need clean books, on-time filings and reliable monthly numbers, without building an in-house team.",
    includes: [
      "Monthly bookkeeping",
      "Bank reconciliation",
      "Monthly financial statements",
      "Personal or corporate income-tax preparation and filing",
      "Indirect tax filing: VAT, GST or sales tax, where registered",
      "Compliance deadlines tracked for you",
      "Works in the accounting system you already use",
      "Email support from your finance team",
    ],
    levels: ["on", "on", "off", "off", "off", "off", "off"],
  },
  {
    name: "Growth",
    tag: "Scales with you",
    pill: "Most flexible",
    dark: true,
    tagline: "For companies scaling faster than their finance function.",
    who: "For growing teams that need an operational scope that moves with them, with room to test new ideas before committing.",
    includes: [
      "Everything in Standard",
      "Operational scope that can flex as your priorities change, within the agreed contract",
      "Payroll and statutory remittances",
      "Bank, subsidiary and multi-account reconciliation",
      "Budgets, 12-month cash-flow forecasts and budget-vs-actual reporting",
      "Room to experiment: new entities, markets, pricing or tools modeled with us before you commit",
      "Regular management reporting and review with your Finance Business Partner",
      "Corporate & legal compliance, ERP and data work brought in as needs arise",
    ],
    levels: ["on", "on", "on", "on", "flex", "flex", "flex"],
  },
  {
    name: "Enterprise",
    tag: "Full function",
    tagline: "Your full finance team, integrated, with your ERP maintained.",
    who: "For enterprises and complex groups that want one accountable team across finance and systems.",
    includes: [
      "Everything in Growth",
      "Full finance-team integration across accounting, tax and compliance, FP&A, payroll and corporate & legal compliance",
      "ERP system maintenance and health checks on SAP S/4HANA, Oracle NetSuite or Microsoft Dynamics 365 Business Central",
      "Ongoing ERP configuration changes, user training and support",
      "Consolidated, multi-entity reporting",
      "Data management across systems: master data, chart of accounts and cross-system reconciliation",
      "Audit preparation support",
      "A dedicated Finance Business Partner in your leadership cadence",
    ],
    levels: ["on", "on", "on", "on", "on", "on", "on"],
    bracket: { from: 6, to: 7, label: "ERP & data upkeep" },
  },
];

const FAQ = [
  ["Will you replace our existing finance staff?", "Only if that's what you want. We can run the whole function or work alongside the people you already have, and the split of responsibilities is set out in the contract."],
  ["We already have an ERP. Do we have to switch?", "No. We work in the system you run today, whether that's SAP S/4HANA, Oracle NetSuite, Microsoft Dynamics 365 Business Central, QuickBooks Online, Xero, Zoho Books, Sage or Odoo. We'll only recommend a change if the system itself is what's holding you back."],
  ["Can we start small?", "Yes. Start with Standard, or with a single project billed 50% upfront and 50% on completion, and widen the scope when you're ready."],
  ["How is pricing set?", "Every package is quoted to your transaction volume, number of entities and systems. Tell us what you need and we'll come back with a scoped proposal."],
];

const PROJECTS = [
  "Financial statements",
  "Tax returns",
  "Indirect tax filing",
  "Audit prep support",
  "Budget & forecast",
  "ERP setup & migration",
  "ERP health check",
  "Entity formation",
];

const INTERESTS = ["Standard", "Growth", "Enterprise", "A single project", "Not sure yet"];

const PARTNERS = [
  {
    code: "P-01",
    icon: "fpa",
    role: "Finance Business Partners",
    remit: "Integrate financial management with your day-to-day operations, running the month-end close, management reporting, budgets and cash-flow forecasts alongside your leadership team.",
    covers: ["Accounting", "FP&A", "Reporting"],
  },
  {
    code: "P-02",
    icon: "tax",
    role: "Strategic Tax Partners",
    remit: "Keep compliance in step with your financial strategy: income tax and VAT, GST or sales tax planned, prepared and filed on time.",
    covers: ["Income tax", "Indirect tax", "Filings"],
  },
  {
    code: "P-03",
    icon: "legal",
    role: "Management Advisory Partners",
    remit: "Governance and corporate structure: entity formation and registration, board and shareholder reporting, and the statutory filings that keep your company in good standing, coordinated with your legal counsel where a lawyer is required.",
    covers: ["Governance", "Structure", "Compliance"],
  },
  {
    code: "P-04",
    icon: "erp",
    role: "ERP Advisory Partners",
    remit: "SAP S/4HANA, Oracle NetSuite and Microsoft Dynamics 365 Business Central: implementation, migration, training, health checks and ongoing maintenance.",
    covers: ["Implement", "Migrate", "Maintain"],
  },
  {
    code: "P-05",
    icon: "data",
    role: "Data & Reporting Partners",
    remit: "Data management across your systems: clean master data, a consistent chart of accounts and cross-system reconciliation, so every report ties back to the ledger.",
    covers: ["Master data", "Chart of accounts"],
  },
  {
    code: "P-06",
    icon: "pay",
    role: "Specialist Partners",
    remit: "Brought in as your scope needs them: payroll and statutory remittances, audit preparation, and one-off projects.",
    covers: ["Payroll", "Audit prep", "Projects"],
  },
];

/* ------------------------------------------------------------------ */
/* Small presentational pieces                                          */
/* ------------------------------------------------------------------ */

function Rule({ children }) {
  return (
    <div className="ak-rule" data-reveal="rule">
      <span className="ak-eyebrow">{children}</span>
    </div>
  );
}

function Line({ children }) {
  return (
    <span className="ak-line">
      <span>{children}</span>
    </span>
  );
}

function TextLink({ href, children, onClick, down }) {
  return (
    <a href={href} className="ak-tlink" onClick={onClick}>
      <span className="ak-link">{children}</span>
      {down ? <ArrowDown size={16} /> : <ArrowRight size={16} />}
    </a>
  );
}

function Steps() {
  const ref = useRef(null);
  useEffect(() => {
    const list = ref.current;
    if (!list) return undefined;
    const items = Array.from(list.querySelectorAll("[data-step-item]"));
    const nodes = items.map((i) => i.querySelector(".ak-step-node"));
    let io = null;
    if (typeof IntersectionObserver !== "undefined") {
      io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) e.target.classList.toggle("is-active", e.isIntersecting);
        },
        { rootMargin: "-45% 0px -54% 0px", threshold: 0 }
      );
      items.forEach((i) => io.observe(i));
    }
    const off = onProgress(list, () => {
      const line = window.innerHeight * 0.45;
      const tops = nodes.map((n) => (n ? n.getBoundingClientRect().top : Infinity));
      items.forEach((el, i) => el.classList.toggle("is-passed", tops[i] <= line));
    });
    return () => {
      if (io) io.disconnect();
      off();
    };
  }, []);
  return (
    <div className="ak-steps" ref={ref} data-progress="0.45,0.45">
      <span className="ak-steps-track" aria-hidden="true">
        <span className="ak-steps-fill" />
      </span>
      <ol className="ak-steps-ol">
      {STEPS.map(([n, t, b]) => (
        <li className="ak-step" key={n} data-step-item="">
          <span className="ak-step-node" aria-hidden="true" />
          <h3 className="ak-step-title">
            <span className="ak-mono">{n}</span> {t}
          </h3>
          <p>{b}</p>
        </li>
      ))}
      </ol>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                 */
/* ------------------------------------------------------------------ */

export default function Home() {
  useStoryEngine();

  const [form, setForm] = useState({ name: "", company: "", message: "", interest: "" });
  const [erp, setErp] = useState(0);
  const [faq, setFaq] = useState(-1);
  // Accordions render open on the server (readable without JS) and collapse after mount.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const [announce, setAnnounce] = useState("");
  const announced = useRef(false);
  const nameRef = useRef(null);
  const panelRef = useRef(null);
  const radioRefs = useRef([]);

  const onField = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  const ready = form.name.trim() !== "" && form.message.trim() !== "";

  useEffect(() => {
    if (ready && !announced.current) {
      announced.current = true;
      setAnnounce("Ready to send");
    }
  }, [ready]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const subject = `New enquiry — ${form.company || form.name || "Website"}`;
    const body =
      `Name: ${form.name}\nCompany: ${form.company}` +
      (form.interest ? `\nInterest: ${form.interest}` : "") +
      `\n\n${form.message}`;
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const goContact = useCallback(() => {
    const target = panelRef.current || document.getElementById("contact");
    if (target) target.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
    if (nameRef.current) nameRef.current.focus({ preventScroll: true });
  }, []);

  const selectInterest = useCallback(
    (interest, opts = {}) => {
      setForm((f) => ({
        ...f,
        interest: interest === undefined ? f.interest : interest,
        message: opts.message && f.message.trim() === "" ? opts.message : f.message,
      }));
      goContact();
    },
    [goContact]
  );

  const pickRadio = (i, focus) => {
    setForm((f) => ({ ...f, interest: INTERESTS[i] }));
    if (focus && radioRefs.current[i]) radioRefs.current[i].focus();
  };
  const onRadioKey = (e, i) => {
    const n = INTERESTS.length;
    let next = null;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (i + 1) % n;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = (i - 1 + n) % n;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = n - 1;
    else if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      if (form.interest === INTERESTS[i]) setForm((f) => ({ ...f, interest: "" }));
      else pickRadio(i, false);
      return;
    }
    if (next !== null) {
      e.preventDefault();
      pickRadio(next, true);
    }
  };
  const selIdx = INTERESTS.indexOf(form.interest);

  return (
    <>
      <SiteHeader logoSrc={LOGO_SRC} email={EMAIL} phone={PHONE} phoneTel={PHONE_TEL} />

      <main id="top">
        {/* ============================ 01 PROBLEM ============================ */}
        <section className="ak-chapter ak-dark ak-hero" id="problem" data-surface="dark" data-progress="0,0.07">
          <EntropyField />
          <div className="ak-hero-vignette" aria-hidden="true" />
          <div className="ak-shell ak-hero-in">
            <Rule>01 · For founders and finance leaders across Asia-Pacific</Rule>
            <div className="ak-hero-grid">
              <div className="ak-hero-copy">
                <h1 className="ak-h1" data-reveal="lines">
                  <Line>The consultants left.</Line> <Line>The problems didn&apos;t.</Line>
                </h1>
                <p className="ak-lead" data-reveal="" style={{ "--i": 2 }}>
                  The close still drags into the third week. Reconciliations still need explaining. The ERP that was
                  meant to fix everything went live and quietly stalled. A compliance notice arrived that nobody saw
                  coming, and the board pack is full of numbers nobody quite trusts.
                </p>
                <p className="ak-body ak-body--dark" data-reveal="" style={{ "--i": 3 }}>
                  Each consultant delivered a diagnosis and a deck. Then the engagement ended, and the problem stayed with
                  you.
                </p>
                <div className="ak-ctas" data-reveal="" style={{ "--i": 4 }}>
                  <TextLink href="#shift" down>
                    Why it keeps happening
                  </TextLink>
                </div>
              </div>
              <div className="ak-hero-visual" data-reveal="" style={{ "--i": 3 }}>
                <IssueRegister issues={ISSUES} />
              </div>
            </div>
          </div>
          <a href="#shift" className="ak-scrollcue" data-pause-offscreen="" aria-hidden="true" tabIndex={-1}>
            <span className="ak-scrollcue-line">
              <span />
            </span>
            Why it keeps happening
          </a>
        </section>

        {/* ============================ 02 SHIFT ============================ */}
        <section className="ak-chapter ak-light ak-paper" id="shift" data-surface="light">
          <div className="ak-shell">
            <Rule>02 · Why operators</Rule>
            <div className="ak-head ak-head--8">
              <h2 className="ak-h2" data-reveal="lines">
                <Line>You don&apos;t need another consultant.</Line> <Line>You need an operator who stays.</Line>
              </h2>
              <div className="ak-cols-2" data-reveal="">
                <p className="ak-body">
                  Consultants are engaged to diagnose and recommend. Then the engagement ends, the deck stays behind, and
                  your team is left to implement it on top of their day jobs.
                </p>
                <p className="ak-body">
                  Finance problems rarely survive because nobody knew the answer. They survive because nobody owned the
                  fix. The people who solve them are experienced operators: people who have run ledgers, closes, filings
                  and systems themselves. They build the process, run it every month and answer for the result, as your
                  business partner.
                </p>
              </div>
            </div>

            <p className="ak-strap" data-reveal="">
              The consulting cycle: diagnose <span aria-hidden="true">→</span> recommend{" "}
              <span aria-hidden="true">→</span> leave <span aria-hidden="true">→</span> repeat
            </p>
            <LifecycleChart />

            <OperatorDiff />

            <p className="ak-kicker" data-reveal="lines">
              <Line>
                Not consultants. <strong>Operators.</strong>
              </Line>{" "}
              <Line>
                Not advisors. <strong>Business partners.</strong>
              </Line>
            </p>
            <div className="ak-close">
              <span className="ak-double" data-reveal="draw" aria-hidden="true" />
              <TextLink href="#team">See who stays</TextLink>
            </div>
          </div>
        </section>

        {/* ============================ 03 TEAM ============================ */}
        <section className="ak-chapter ak-dark ak-circuit" id="team" data-surface="dark">
          <div className="ak-shell">
            <Rule>03 · Our team</Rule>
            <div className="ak-head ak-head--7">
              <h2 className="ak-h2" data-reveal="lines">
                <Line>Meet Aarkledger:</Line> <Line>the finance team that</Line> <Line>works from the inside.</Line>
              </h2>
              <p className="ak-lead" data-reveal="">
                On paper, we&apos;re a boutique financial consultancy and ERP solutions advisory. In practice, we work like
                your in-house finance team.
              </p>
              <p className="ak-body ak-body--dark" data-reveal="">
                We work in your systems, to your calendar and against your deadlines, accountable for outcomes alongside
                you. One team covers the whole function, from the ledger to the ERP, so nothing falls between providers.
              </p>
            </div>

            <BoardSchematic functions={FUNCTIONS} />

            <dl className="ak-proof">
              {PROOF.map(([v, l], i) => (
                <div className="ak-proof-cell" key={v} data-reveal="" style={{ "--i": i }}>
                  <dt>{v}</dt>
                  <dd>{l}</dd>
                </div>
              ))}
            </dl>

            <div className="ak-roster">
              <div className="ak-roster-head" data-reveal="">
                <span className="ak-eyebrow ak-eyebrow--plain">Who you&apos;ll work with</span>
                <h3 className="ak-roster-title">Partners for every part of the function.</h3>
                <p className="ak-roster-body">
                  No single person carries your whole finance function. Each engagement is staffed with the partners
                  your work needs, coordinated as one team under one signed contract.
                </p>
              </div>
              <ul className="ak-roster-grid">
                {PARTNERS.map((p) => (
                  <li className="ak-pcard" key={p.code} data-reveal="">
                    <div className="ak-pcard-top">
                      <span className="ak-pcard-code" aria-hidden="true">
                        {p.code}
                      </span>
                      <span className="ak-pcard-ic" aria-hidden="true">
                        {FN_ICONS[p.icon]}
                      </span>
                    </div>
                    <h4 className="ak-pcard-role">{p.role}</h4>
                    <p className="ak-pcard-remit">{p.remit}</p>
                    <p className="ak-pcard-covers">
                      <span className="ak-sr">Covers: {p.covers.join(", ")}</span>
                      {p.covers.map((c) => (
                        <span key={c} aria-hidden="true">
                          {c}
                        </span>
                      ))}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="ak-close">
              <TextLink href="#expertise">See where we&apos;re strongest</TextLink>
            </div>
          </div>
        </section>

        {/* ============================ 04 EXPERTISE ============================ */}
        <section className="ak-chapter ak-light ak-paper" id="expertise" data-surface="light">
          <div className="ak-shell">
            <Rule>04 · Expertise</Rule>
            <div className="ak-exp-head">
              <div className="ak-exp-copy">
                <h2 className="ak-h2" data-reveal="lines">
                  <Line>Hands-on in the systems</Line> <Line>your finance runs on.</Line>
                </h2>
                <p className="ak-body" data-reveal="">
                  We&apos;ve designed, implemented and maintained finance systems on SAP S/4HANA, Oracle NetSuite and
                  Microsoft Dynamics 365 Business Central for clients across Asia-Pacific, from start-ups setting up their
                  first real ERP to enterprises with complex business models and data spread across many systems.
                </p>
                <p className="ak-body" data-reveal="">
                  We&apos;re just as fluent in QuickBooks Online, Xero, Zoho Books, Sage and Odoo, so we can work with what you run
                  today and plan properly for what you&apos;ll need next.
                </p>
              </div>
              <div className="ak-exp-globe" data-reveal="">
                <GraticuleGlobe />
              </div>
            </div>

            <p className="ak-erp-services" data-reveal="">
              <span className="ak-label">On every platform</span>
              <span className="ak-erp-services-list">
                {ERP_SERVICES.map((sv, i) => (
                  <span key={sv}>
                    {sv}
                    {i < ERP_SERVICES.length - 1 ? <span aria-hidden="true"> · </span> : null}
                  </span>
                ))}
              </span>
            </p>

            <div className="ak-erps">
              {ERPS.map((e, i) => (
                <article
                  className={`ak-card ak-erp${erp === i ? " is-linked" : ""}`}
                  key={e.code}
                  data-reveal=""
                  style={{ "--i": i }}
                  onMouseEnter={() => setErp(i)}
                  onFocusCapture={() => setErp(i)}
                >
                  <span className="ak-code">{e.code}</span>
                  <h3 className="ak-erp-name">{e.name}</h3>
                  <p>{e.body}</p>
                  <span className="ak-label ak-erp-work">Typical work</span>
                  <ul className="ak-chips">
                    {e.work.map((c) => (
                      <li key={c} className="ak-chipo">
                        {c}
                      </li>
                    ))}
                  </ul>
                  <a
                    href="#contact"
                    className="ak-tlink ak-erp-ask"
                    onClick={(ev) => {
                      ev.preventDefault();
                      selectInterest(undefined, { message: `I'd like to talk about our ${e.name} system: ` });
                    }}
                  >
                    <span className="ak-link">Ask about {e.name.startsWith("Microsoft") ? "Business Central" : e.name}</span>
                    <ArrowRight size={16} />
                  </a>
                </article>
              ))}
            </div>

            <ErpConsole active={erp} onChange={setErp} steps={ERP_SERVICES} />

            <div className="ak-also" data-reveal="">
              <span className="ak-label">Also hands-on with</span>
              <ul className="ak-chips">
                {ALSO.map((a) => (
                  <li key={a} className="ak-chipo ak-chipo--lg">
                    {a}
                  </li>
                ))}
              </ul>
            </div>

            <div className="ak-spec">
              <h3 className="ak-h3" data-reveal="">
                Where we&apos;re at our best
              </h3>
              <ol className="ak-spec-list">
                {SPECIALISMS.map(([t, l], i) => (
                  <li key={t} className="ak-spec-item" data-reveal="" style={{ "--i": i % 2 }}>
                    <span className="ak-spec-idx" aria-hidden="true">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h4 className="ak-spec-t">
                        {t}
                        <ArrowRight size={16} />
                      </h4>
                      <p>{l}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="ak-close">
              <span className="ak-double" data-reveal="draw" aria-hidden="true" />
              <div className="ak-close-links">
                <TextLink href="#model">See how we run it</TextLink>
                <a href="#contact" className="ak-tlink ak-tlink--quiet">
                  <span className="ak-link">Or tell us which one sounds familiar</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ============================ 05 MODEL ============================ */}
        <section className="ak-chapter ak-dark ak-circuit" id="model" data-surface="dark">
          <div className="ak-shell">
            <Rule>05 · How it works</Rule>
            <div className="ak-head ak-head--8">
              <h2 className="ak-h2" data-reveal="lines">
                <Line>We don&apos;t leave you with a plan.</Line> <Line>We run it with you.</Line>
              </h2>
              <p className="ak-lead" data-reveal="">
                Every engagement starts inside your books and ends up inside your operating rhythm. Scope is agreed upfront
                in a signed contract, so you always know what we own and when it&apos;s due.
              </p>
            </div>
            <div className="ak-model-grid">
              <div className="ak-model-steps">
                <Steps />
                <p className="ak-foot">Project engagements are billed 50% upfront and 50% on completion.</p>
              </div>
              <div className="ak-model-dial">
                <RhythmDial />
              </div>
            </div>
            <div className="ak-close">
              <TextLink href="#packages">See the packages</TextLink>
            </div>
          </div>
        </section>

        {/* ============================ 06 PACKAGES ============================ */}
        <section className="ak-chapter ak-light ak-paper" id="packages" data-surface="light">
          <div className="ak-shell">
            <Rule>06 · Packages</Rule>
            <div className="ak-head ak-head--8">
              <h2 className="ak-h2" data-reveal="lines">
                <Line>Three ways to bring us in.</Line>
              </h2>
              <p className="ak-lead" data-reveal="">
                Start with the scope you need now and widen it as the business grows. Each package is scoped to your
                transaction volume, entities and systems, and quoted on request.
              </p>
            </div>

            <div className="ak-pkgs">
              {PACKAGES.map((p, i) => (
                <article className={`ak-pkg${p.dark ? " ak-pkg--dark" : ""}`} key={p.name} data-reveal="" style={{ "--i": i }}>
                  {p.pill && <span className="ak-pkg-pill">{p.pill}</span>}
                  <ScopeMeter levels={p.levels} bracket={p.bracket} />
                  <div className="ak-pkg-head">
                    <h3 className="ak-pkg-name">{p.name}</h3>
                    <span className="ak-pkg-tag">{p.tag}</span>
                  </div>
                  <p className="ak-pkg-tagline">{p.tagline}</p>
                  <p className="ak-pkg-who">{p.who}</p>
                  <span className="ak-label ak-pkg-inc">Includes</span>
                  <ul className="ak-pkg-list">
                    {p.includes.map((x) => (
                      <li key={x}>
                        <Check size={14} />
                        <span>{x}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    className={p.dark ? "ak-btn ak-btn--signal ak-btn--block" : "ak-btn ak-btn--block"}
                    onClick={() => selectInterest(p.name)}
                  >
                    Discuss {p.name} <ArrowRight size={16} />
                  </button>
                </article>
              ))}
            </div>
            <p className="ak-pkg-note" data-reveal="">
              Not sure which fits? Tell us what&apos;s still broken and we&apos;ll recommend one, or tell you if a single
              project is enough.
            </p>

            <div className="ak-faq-wrap">
              <h3 className="ak-h3 ak-faq-title" data-reveal="">
                Before you ask
              </h3>
              <div className="ak-faq">
                {FAQ.map(([q, a], i) => {
                  const isOpen = mounted ? faq === i : true;
                  return (
                    <div className={`ak-faq-item${isOpen ? " is-open" : ""}`} key={q}>
                      <h4>
                        <button
                          type="button"
                          aria-expanded={isOpen}
                          aria-controls={`ak-faq-${i}`}
                          id={`ak-faq-b-${i}`}
                          onClick={() => setFaq(isOpen ? -1 : i)}
                        >
                          <span>{q}</span>
                          <Plus size={20} className="ak-acc-ico" />
                        </button>
                      </h4>
                      <div id={`ak-faq-${i}`} role="region" aria-labelledby={`ak-faq-b-${i}`} hidden={!isOpen} className="ak-faq-a">
                        <p>{a}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="ak-project" data-reveal="">
              <div className="ak-project-copy">
                <h3 className="ak-h3">Need a single project instead?</h3>
                <p>Scoped as standalone projects and billed 50% upfront, 50% on completion.</p>
              </div>
              <ul className="ak-chips ak-project-chips">
                {PROJECTS.map((c) => (
                  <li key={c}>
                    <button
                      type="button"
                      className="ak-chipo ak-chipo--btn"
                      onClick={() => selectInterest("A single project", { message: `Project: ${c}\n` })}
                    >
                      {c}
                    </button>
                  </li>
                ))}
              </ul>
              <button type="button" className="ak-btn" onClick={() => selectInterest("A single project")}>
                Scope a project <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </section>

        {/* ============================ 07 CONTACT ============================ */}
        <section className="ak-chapter ak-dark ak-circuit" id="contact" data-surface="dark">
          <div className="ak-shell">
            <Rule>07 · Start here</Rule>
            <div className="ak-head ak-head--7">
              <div className="ak-fit">
                <h2 className="ak-h2" data-reveal="lines">
                  <Line>Tell us what&apos;s still broken.</Line>
                </h2>
                <span className="ak-double ak-double--hero" data-reveal="double" aria-hidden="true" />
              </div>
              <p className="ak-lead" data-reveal="">
                Share what you&apos;ve already tried and what still isn&apos;t working. Your message goes straight to our
                partners, and you&apos;ll get an honest view of whether we&apos;re the right fit. No
                obligation, and no pitch deck.
              </p>
            </div>

            <div className="ak-contact-grid">
              <div className="ak-contact-reg">
                <IssueRegister issues={ISSUES} resolved />
                <p className="ak-reg-cap">What changes first isn&apos;t the problem. It&apos;s who owns it.</p>
              </div>

              <div className="ak-contact-form" ref={panelRef}>
                {/* action/method/encType: no-JavaScript fallback only, so a submit before hydration composes an
                    email instead of putting the fields in a GET URL. Once hydrated, handleSubmit takes over. */}
                <form
                  className="ak-form"
                  action={`mailto:${EMAIL}?subject=${encodeURIComponent("Website enquiry")}`}
                  method="post"
                  encType="text/plain"
                  onSubmit={handleSubmit}
                  aria-label="Enquiry"
                >
                  <div className="ak-form-head">
                    <span className="ak-label">Open item · yours</span>
                    <span className={`ak-status${ready ? " is-ready" : ""}`} aria-hidden="true">
                      {ready ? "Ready to send" : "Draft"}
                    </span>
                    <span className="ak-sr" aria-live="polite">
                      {announce}
                    </span>
                  </div>
                  <div className="ak-field-row">
                    <div className="ak-field">
                      <label htmlFor="ak-name">Your name *</label>
                      <input
                        id="ak-name"
                        ref={nameRef}
                        type="text"
                        name="name"
                        autoComplete="name"
                        required
                        aria-required="true"
                        value={form.name}
                        onChange={onField}
                      />
                    </div>
                    <div className="ak-field">
                      <label htmlFor="ak-company">Company</label>
                      <input
                        id="ak-company"
                        type="text"
                        name="company"
                        autoComplete="organization"
                        value={form.company}
                        onChange={onField}
                      />
                    </div>
                  </div>
                  <div className="ak-field">
                    <span className="ak-field-label" id="ak-interest-l">
                      I&apos;m interested in (optional)
                    </span>
                    <div className="ak-radios" role="radiogroup" aria-labelledby="ak-interest-l">
                      {INTERESTS.map((it, i) => {
                        const on = form.interest === it;
                        const tabbable = selIdx === -1 ? i === 0 : on;
                        return (
                          <button
                            type="button"
                            role="radio"
                            aria-checked={on}
                            tabIndex={tabbable ? 0 : -1}
                            key={it}
                            ref={(el) => (radioRefs.current[i] = el)}
                            className={`ak-radio${on ? " is-on" : ""}`}
                            onClick={() => setForm((f) => ({ ...f, interest: f.interest === it ? "" : it }))}
                            onKeyDown={(e) => onRadioKey(e, i)}
                          >
                            {it}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div className="ak-field">
                    <label htmlFor="ak-message">What&apos;s still not working? *</label>
                    <textarea
                      id="ak-message"
                      name="message"
                      rows={5}
                      required
                      aria-required="true"
                      placeholder="The close, the ERP, compliance, reporting, payroll… whatever has outlasted the last consultant."
                      value={form.message}
                      onChange={onField}
                    />
                  </div>
                  <button type="submit" className="ak-btn ak-btn--block">
                    Compose email <ArrowRight size={16} />
                  </button>
                  <p className="ak-micro">
                    Opens your email app with your message addressed to {EMAIL}. Nothing is stored on this website.
                    How we handle what you send: <a href="/privacy">Privacy Notice</a>.
                  </p>
                </form>
              </div>

              <div className="ak-contact-next">
                <div className="ak-next">
                  <span className="ak-label">What happens next</span>
                  <ol className="ak-next-list">
                    <li>You send the email.</li>
                    <li>A partner replies to arrange a first conversation.</li>
                    <li>If we&apos;re a fit, you get a defined scope and a signed contract before any work starts.</li>
                  </ol>
                </div>
                <div className="ak-contacts">
                  <div className="ak-cgroup">
                    <span className="ak-label">Talk to a partner</span>
                    <a href={`mailto:${EMAIL}`} className="ak-crow">
                      {EMAIL}
                    </a>
                    <a href={`tel:${PHONE_TEL}`} className="ak-crow">
                      {PHONE}
                    </a>
                  </div>
                  <div className="ak-cgroup">
                    <span className="ak-label">Company</span>
                    <a href={`mailto:${CORP_EMAIL}`} className="ak-crow">
                      {CORP_EMAIL}
                    </a>
                    <a href={LINKEDIN} target="_blank" rel="noopener noreferrer" className="ak-crow">
                      LinkedIn
                    </a>
                  </div>
                  <a href="/deadlines" className="ak-resource">
                    <span className="ak-minigrid" aria-hidden="true">
                      {Array.from({ length: 35 }, (_, i) => (
                        <i key={i} className={i === 17 ? "on" : undefined} />
                      ))}
                    </span>
                    <span>
                      Free: Philippine tax &amp; compliance calendar <ArrowRight size={15} />
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter
        logoSrc={LOGO_SRC}
        email={EMAIL}
        corpEmail={CORP_EMAIL}
        phone={PHONE}
        phoneTel={PHONE_TEL}
        linkedin={LINKEDIN}
      />
    </>
  );
}
