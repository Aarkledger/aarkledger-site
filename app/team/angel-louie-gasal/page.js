export const metadata = {
  title: "Angel Louie Gasal — Finance Business Partner | Aarkledger",
  description:
    "Angel Louie Gasal is a Finance Business Partner bridging finance and strategy to help start-ups and enterprises make confident, data-driven decisions.",
};

const EMAIL = "louie@aarkledger.com";
const PHONE = "(63) 928 285 7646";
const PHONE_TEL = "+639282857646";
const LINKEDIN = "https://www.linkedin.com/in/angel-louie-gasal/";

const blockStyle = { maxWidth: 760, marginTop: 36 };
const paraStyle = { color: "var(--text-soft)", marginTop: 14 };
const headingStyle = { color: "var(--navy)" };

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

      <main className="container" style={{ paddingBottom: 60 }}>
        <div style={blockStyle}>
          <h2 style={headingStyle}>Overview</h2>
          <p style={{ color: "var(--text-soft)", marginTop: 10 }}>
            Angel Louie Gasal is a Finance Business Partner who sits at the
            intersection of finance and strategy. Rather than reporting from the
            sidelines, he embeds directly with founders and leadership teams —
            owning the numbers end to end and translating them into the decisions
            that actually move a business forward.
          </p>
          <p style={paraStyle}>
            He pairs the discipline of a seasoned accountant with an
            investor&rsquo;s strategic lens, giving the businesses he works with
            both a clean, reliable finance function and a partner who can
            pressure-test the plan behind it.
          </p>
        </div>

        <div style={blockStyle}>
          <h2 style={headingStyle}>Role &amp; involvement</h2>
          <p style={{ color: "var(--text-soft)", marginTop: 10 }}>
            His grounding in finance was built across some of its most demanding
            seats. He started as an analyst in an investment bank, where he lived
            in financial models, valuations, and transaction analysis under real
            deadlines and real scrutiny. From there he moved into private equity
            as a research associate — pressure-testing investment theses, running
            diligence on prospective targets, and distilling dense financials into
            clear, decision-ready views. He later served as a compliance
            specialist at a Zurich-based wealth management bank, where a
            regulation-first environment sharpened his discipline for how
            financial information is handled, documented, and reported.
          </p>
          <p style={paraStyle}>
            He brings that same rigor to his work as a Finance Business Partner.
            He owns the full-cycle finance function — bookkeeping and
            reconciliation, monthly and annual reporting, budgets and cash-flow
            forecasts, tax and statutory compliance, and the accounting and ERP
            systems that keep it all trustworthy. Rather than working at a
            distance, he embeds beside founders and leadership as an accountable
            partner, turning the numbers into the operational and strategic
            decisions that move a business forward.
          </p>
        </div>

        <section className="cal-note" style={{ maxWidth: 760 }}>
          <h3>Contact</h3>
          <div style={{ display: "grid", gap: 10, marginTop: 6 }}>
            <div>
              <strong style={headingStyle}>Email</strong> —{" "}
              <a
                href={`mailto:${EMAIL}`}
                style={{ color: "var(--accent-dark)", fontWeight: 600 }}
              >
                {EMAIL}
              </a>
            </div>
            <div>
              <strong style={headingStyle}>Phone (PH)</strong> —{" "}
              <a
                href={`tel:${PHONE_TEL}`}
                style={{ color: "var(--accent-dark)", fontWeight: 600 }}
              >
                {PHONE}
              </a>
            </div>
            <div>
              <strong style={headingStyle}>LinkedIn</strong> —{" "}
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
