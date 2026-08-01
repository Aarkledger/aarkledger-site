export const metadata = {
  title: "Angel Louie Gasal — Finance Business Partner | Aarkledger",
  description:
    "Angel Louie Gasal is a Finance Business Partner bridging finance and strategy to help start-ups and enterprises make confident, data-driven decisions.",
};

const EMAIL = "louie@aarkledger.com";
const PHONE = "(63) 928 285 7646";
const PHONE_TEL = "+639282857646";
const LINKEDIN = "https://www.linkedin.com/in/angel-louie-gasal/";

const involvement = [
  "Owns full-cycle finance — bookkeeping oversight, reconciliation, and accurate monthly and annual financial statements.",
  "Builds and runs FP&A — annual budgets, rolling cash-flow forecasts, and budget-versus-actual variance analysis.",
  "Coordinates tax and statutory compliance so filings stay organized, accurate, and submitted on time.",
  "Designs and optimizes accounting and ERP systems, and the data flows that keep them trustworthy.",
  "Advises leadership on unit economics, margins, runway, and the financial implications of key decisions.",
  "Serves as a single, accountable point of contact for the finance function.",
];

const strengths = [
  "Commercial mindset — he reads past the ledger to the drivers of the business, so the numbers always come with a recommendation.",
  "Analytical rigor — an investor-grade approach to modeling, forecasting, and scenario planning.",
  "Clarity — explains complex financial matters in plain language that leaders can act on quickly.",
  "Ownership — treats every engagement as if the business were his own: defined scope, clean documentation, and on-time delivery.",
  "Systems thinking — builds finance functions that stay accurate and scale cleanly as a company grows.",
  "Regional fluency — comfortable with the finance and compliance realities of businesses operating across the Asia Pacific region.",
];

const listStyle = {
  listStyle: "disc",
  paddingLeft: 22,
  marginTop: 14,
  display: "flex",
  flexDirection: "column",
  gap: 10,
  color: "var(--text-soft)",
};

const sectionStyle = { maxWidth: 760, marginTop: 40 };

export default function Profile() {
  return (
    <div className="cal-page">
      <header className="cal-hero">
        <div className="container">
          <div className="cal-topbar">
            <a
              href="/"
              className="brand"
              aria-label="Aarkledger"
              style={{ color: "#fff", fontWeight: 800, fontSize: "1.25rem" }}
            >
              AARKLEDGER
            </a>
            <a href="/" className="cal-back">← Back to main site</a>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 22,
              marginTop: 34,
              flexWrap: "wrap",
            }}
          >
            <div
              aria-hidden="true"
              style={{
                width: 88,
                height: 88,
                borderRadius: "50%",
                background: "var(--accent)",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
                fontSize: "1.9rem",
                letterSpacing: "0.02em",
                flexShrink: 0,
                fontFamily: "var(--font-heading)",
              }}
            >
              ALG
            </div>
            <div>
              <h1 style={{ margin: 0 }}>Angel Louie Gasal</h1>
              <p style={{ margin: "6px 0 0", color: "#c9c6c6", fontSize: "1.1rem" }}>
                Finance Business Partner
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container" style={{ paddingBottom: 40 }}>
        <section style={sectionStyle}>
          <h2 style={{ color: "var(--navy)" }}>Overview</h2>
          <p style={{ color: "var(--text-soft)", marginTop: 10 }}>
            Angel Louie Gasal is a Finance Business Partner who sits at the
            intersection of finance and strategy. Rather than reporting from the
            sidelines, he embeds directly with founders and leadership teams —
            owning the numbers end to end and translating them into the decisions
            that actually move a business forward.
          </p>
          <p style={{ color: "var(--text-soft)", marginTop: 14 }}>
            He pairs the discipline of a seasoned accountant with an
            investor&rsquo;s strategic lens, giving the businesses he works with
            both a clean, reliable finance function and a partner who can
            pressure-test the plan behind it.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={{ color: "var(--navy)" }}>Role &amp; involvement</h2>
          <ul style={listStyle}>
            {involvement.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section style={sectionStyle}>
          <h2 style={{ color: "var(--navy)" }}>
            What makes him a great Finance Business Partner
          </h2>
          <ul style={listStyle}>
            {strengths.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="cal-note" style={{ maxWidth: 760 }}>
          <h3>Contact</h3>
          <div style={{ display: "grid", gap: 10, marginTop: 6 }}>
            <div>
              <strong style={{ color: "var(--navy)" }}>Email</strong> —{" "}
              <a
                href={`mailto:${EMAIL}`}
                style={{ color: "var(--accent-dark)", fontWeight: 600 }}
              >
                {EMAIL}
              </a>
            </div>
            <div>
              <strong style={{ color: "var(--navy)" }}>Phone (PH)</strong> —{" "}
              <a
                href={`tel:${PHONE_TEL}`}
                style={{ color: "var(--accent-dark)", fontWeight: 600 }}
              >
                {PHONE}
              </a>
            </div>
            <div>
              <strong style={{ color: "var(--navy)" }}>LinkedIn</strong> —{" "}
              <a
                href={LINKEDIN}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "var(--accent-dark)", fontWeight: 600 }}
              >
                linkedin.com/in/angel-louie-gasal
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
