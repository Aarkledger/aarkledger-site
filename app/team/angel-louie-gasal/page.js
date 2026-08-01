// Finance Business Partner profile page.
export const metadata = {
  title: "Angel Louie Gasal | Finance Business Partner | Aarkledger",
  description:
    "Angel Louie Gasal is a Finance Business Partner who helps founders and leadership teams run a clean finance function and make better decisions with it.",
};

const EMAIL = "louie@aarkledger.com";
const PHONE = "(63) 928 285 7646";
const PHONE_TEL = "+639282857646";
const LINKEDIN = "https://www.linkedin.com/in/angel-louie-gasal/";

const blockStyle = { maxWidth: 760, marginTop: 36 };
const paraStyle = { color: "var(--text-soft)", marginTop: 14 };
const headingStyle = { color: "var(--navy)" };
const contactLabel = { color: "#c9c6c6" };
const contactLink = { color: "#fff", fontWeight: 600 };

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
          <div style={{ marginTop: 34 }}>
            <h1 style={{ margin: 0 }}>Angel Louie Gasal</h1>
            <p style={{ margin: "6px 0 0", color: "#c9c6c6", fontSize: "1.1rem" }}>
              Finance Business Partner
            </p>
            <div style={{ display: "grid", gap: 6, marginTop: 20, fontSize: "0.98rem" }}>
              <div>
                <span style={contactLabel}>Email:</span>{" "}
                <a href={`mailto:${EMAIL}`} style={contactLink}>
                  {EMAIL}
                </a>
              </div>
              <div>
                <span style={contactLabel}>Phone (PH):</span>{" "}
                <a href={`tel:${PHONE_TEL}`} style={contactLink}>
                  {PHONE}
                </a>
              </div>
              <div>
                <span style={contactLabel}>LinkedIn:</span>{" "}
                <a
                  href={LINKEDIN}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={contactLink}
                >
                  linkedin.com/in/angel-louie-gasal
                </a>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container" style={{ paddingBottom: 60 }}>
        <div style={blockStyle}>
          <h2 style={headingStyle}>About the Partner</h2>
          <p style={{ color: "var(--text-soft)", marginTop: 10 }}>
            Angel Louie partners with founders and leadership teams to take full
            ownership of the finance function and turn it into a decision-making
            advantage. He operates as an embedded member of the team rather than a
            distant advisor, working directly alongside the people running the
            business so that the numbers stay close to those who act on them.
          </p>
          <p style={paraStyle}>
            His perspective is built on both sides of the ledger. He began in
            accounting as a general ledger accountant at a local advisory firm,
            maintaining the books for clients across real estate management,
            technical services, and restaurant chain management. He then moved
            into investing and risk, serving as a research associate at a private
            equity firm, a risk analyst at a multinational investment bank, and a
            compliance specialist at a wealth management bank. He went on to work
            as a deals team analyst and, later, as a financial accountant at a
            Fractional CFO firm, where he carried controllership responsibilities
            for a portfolio of FMCG and e-commerce clients.
          </p>
          <p style={paraStyle}>
            That combination of accounting discipline and investing judgment
            defines how he works today. As a Finance Business Partner, he takes
            responsibility for the full finance function: bookkeeping and
            reconciliation, monthly and annual reporting, budgeting and cash-flow
            forecasting, tax and statutory compliance, and the accounting and ERP
            systems that hold it together. He treats every figure as an input to a
            decision, using the numbers not merely to record what has happened but
            to shape what comes next.
          </p>
        </div>
      </main>
    </div>
  );
}
