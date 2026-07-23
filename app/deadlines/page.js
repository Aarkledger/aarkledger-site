"use client";

import { useEffect, useState } from "react";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const DOW = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// Statutory "on or before" due dates for calendar-year taxpayers.
const BIR = [
  { m: 1, d: 25, title: "VAT & Percentage Tax — Q4", desc: "BIR Form 2550Q (VAT) and 2551Q (percentage tax) for the 4th quarter of the prior year." },
  { m: 1, d: 30, title: "Annual Inventory List", desc: "Submission of the inventory list for taxpayers with a taxable year ending December 31." },
  { m: 1, d: 31, title: "Expanded Withholding Tax — Q4", desc: "BIR Form 1601-EQ (quarterly EWT) for Q4 of the prior year." },
  { m: 1, d: 31, title: "Annual WHT on Compensation", desc: "BIR Form 1604-C with the alphalist of employees (prior year)." },
  { m: 1, d: 31, title: "Annual Final WHT", desc: "BIR Form 1604-F with the alphalist (prior year)." },
  { m: 1, d: 31, title: "Issue Form 2316 to employees", desc: "Employers give each employee their Certificate of Compensation Payment / Tax Withheld." },
  { m: 2, d: 28, title: "Submit Form 2316 to the BIR", desc: "Duplicate 2316s for employees qualified for substituted filing are filed with the BIR." },
  { m: 3, d: 1, title: "Annual Alphalist of EWT", desc: "BIR Form 1604-E — annual information return of creditable income taxes withheld (expanded)." },
  { m: 4, d: 15, title: "Annual Income Tax Return", desc: "BIR Form 1701/1701A (individuals) and 1702-RT/EX/MX (corporations) for the prior calendar year." },
  { m: 4, d: 25, title: "VAT & Percentage Tax — Q1", desc: "BIR Form 2550Q (VAT) and 2551Q (percentage tax) for Q1." },
  { m: 4, d: 30, title: "Expanded Withholding Tax — Q1", desc: "BIR Form 1601-EQ for Q1." },
  { m: 5, d: 15, title: "Quarterly ITR (individuals) — Q1", desc: "BIR Form 1701Q for the first quarter." },
  { m: 5, d: 30, title: "Quarterly ITR (corporations) — Q1", desc: "BIR Form 1702Q — within 60 days after the close of Q1." },
  { m: 7, d: 25, title: "VAT & Percentage Tax — Q2", desc: "BIR Form 2550Q and 2551Q for Q2." },
  { m: 7, d: 31, title: "Expanded Withholding Tax — Q2", desc: "BIR Form 1601-EQ for Q2." },
  { m: 8, d: 15, title: "Quarterly ITR (individuals) — Q2", desc: "BIR Form 1701Q for the second quarter." },
  { m: 8, d: 29, title: "Quarterly ITR (corporations) — Q2", desc: "BIR Form 1702Q — within 60 days after the close of Q2." },
  { m: 10, d: 15, title: "2nd income-tax installment (individuals)", desc: "For individuals who opted to pay the annual income tax in two installments." },
  { m: 10, d: 25, title: "VAT & Percentage Tax — Q3", desc: "BIR Form 2550Q and 2551Q for Q3." },
  { m: 10, d: 31, title: "Expanded Withholding Tax — Q3", desc: "BIR Form 1601-EQ for Q3." },
  { m: 11, d: 15, title: "Quarterly ITR (individuals) — Q3", desc: "BIR Form 1701Q for the third quarter." },
  { m: 11, d: 29, title: "Quarterly ITR (corporations) — Q3", desc: "BIR Form 1702Q — within 60 days after the close of Q3." },
];

export default function Deadlines() {
  const [year, setYear] = useState(2026);
  const [agency, setAgency] = useState("all");

  useEffect(() => {
    document.title = "Philippine Compliance Calendar — Aarkledger";
  }, []);

  const showBir = agency === "all" || agency === "BIR";
  const showSec = agency === "all" || agency === "SEC";

  const byMonth = MONTHS.map((name, i) => ({
    name,
    items: BIR.filter((x) => x.m === i + 1),
  }));

  return (
    <div className="cal-page">
      <header className="cal-hero">
        <div className="container">
          <div className="cal-topbar">
            <a href="/" className="brand" aria-label="Aarkledger" style={{ color: "#fff", fontWeight: 800, fontSize: "1.25rem" }}>
              AARKLEDGER
            </a>
            <a href="/" className="cal-back">← Back to main site</a>
          </div>
          <h1>Philippine Compliance Calendar</h1>
          <p>
            Key recurring SEC and BIR filing deadlines for calendar-year
            taxpayers. Choose a year to see how each statutory due date falls.
          </p>

          <div className="cal-controls">
            <div className="cal-toggle" role="group" aria-label="Year">
              {[2026, 2027].map((y) => (
                <button
                  key={y}
                  className={year === y ? "active" : ""}
                  onClick={() => setYear(y)}
                >
                  {y}
                </button>
              ))}
            </div>
            <div className="cal-toggle" role="group" aria-label="Agency">
              {[
                ["all", "All"],
                ["BIR", "BIR"],
                ["SEC", "SEC"],
              ].map(([key, label]) => (
                <button
                  key={key}
                  className={agency === key ? "active" : ""}
                  onClick={() => setAgency(key)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="container" style={{ paddingBottom: 20 }}>
        {showSec && (
          <section className="cal-note" style={{ marginTop: 40 }}>
            <h3>
              <span className="cal-tag sec">SEC</span> &nbsp;Securities and
              Exchange Commission filings
            </h3>
            <ul>
              <li>
                <strong>Annual Financial Statements (AFS)</strong> — audited FS
                (stamped &ldquo;received&rdquo; by the BIR) are filed with the SEC on a
                staggered schedule based on the <strong>last digit of your SEC
                registration number</strong>. For calendar-year companies the
                filing window runs in the weeks after the April 15 income-tax
                deadline; the SEC releases the exact coding schedule each year.
              </li>
              <li>
                <strong>General Information Sheet (GIS)</strong> — filed within
                <strong> 30 calendar days</strong> from the annual
                stockholders&rsquo; meeting (stock), the annual members&rsquo;
                meeting (non-stock), or the anniversary of the SEC license
                (foreign corporations). Beneficial-ownership information is filed
                together with the GIS.
              </li>
              <li>
                Filing is done through the SEC&rsquo;s electronic system (eFAST);
                exact dates and requirements are set by SEC advisories issued
                for {year}.
              </li>
            </ul>
          </section>
        )}

        {showBir &&
          byMonth.map((month) =>
            month.items.length === 0 ? null : (
              <section className="cal-month" key={month.name}>
                <h2>{month.name} {year}</h2>
                {month.items.map((item, idx) => {
                  const dt = new Date(year, item.m - 1, item.d);
                  const day = dt.getDay();
                  const weekend = day === 0 || day === 6;
                  return (
                    <div className="cal-row" key={idx}>
                      <div>
                        <span className="cal-date">
                          {MONTHS[item.m - 1].slice(0, 3)} {item.d}
                        </span>
                        <span className="cal-dow">{DOW[day]}</span>
                      </div>
                      <div className="cal-body">
                        <strong>{item.title}</strong>
                        <span>{item.desc}</span>
                        {weekend && (
                          <span className="cal-weekend">
                            Falls on a {DOW[day]} — moves to the next working day.
                          </span>
                        )}
                      </div>
                      <span className="cal-tag bir">BIR</span>
                    </div>
                  );
                })}
              </section>
            )
          )}

        {showBir && (
          <section className="cal-note">
            <h3>Recurring monthly obligations</h3>
            <ul>
              <li>
                <strong>Form 1601-C</strong> — monthly remittance of withholding
                tax on compensation, on or before the 10th of the following
                month.
              </li>
              <li>
                <strong>Form 0619-E</strong> — monthly remittance of expanded
                withholding tax for the first two months of each quarter, on or
                before the 10th of the following month.
              </li>
              <li>
                eFPS filers may follow slightly different dates depending on
                their industry grouping.
              </li>
            </ul>
          </section>
        )}

        <p className="cal-disclaimer">
          <strong>Please note:</strong> these are the standard statutory due
          dates for calendar-year taxpayers, provided for general guidance only.
          When a deadline falls on a weekend or a national or local holiday it
          generally moves to the next working day. Covered forms, filing
          channels, and dates can change through BIR revenue issuances and SEC
          advisories, and fiscal-year taxpayers follow a different schedule.
          Always confirm against the latest official BIR and SEC issuances — and
          reach out to Aarkledger for the obligations specific to your entity.
        </p>
      </main>
    </div>
  );
}
