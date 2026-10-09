"use client";

export default function SiteFooter({ logoSrc, email, corpEmail, phone, phoneTel, linkedin, basePath = "" }) {
  // basePath lets the in-page story links work from other routes (e.g. "/" on /privacy -> "/#problem").
  const h = (id) => `${basePath}#${id}`;
  return (
    <footer className="ak-footer">
      <div className="ak-shell">
        <div className="ak-double ak-double--full" aria-hidden="true" />
        <div className="ak-footer-grid">
          <div className="ak-footer-brand">
            <img className="brand-logo" src={logoSrc} alt="Aarkledger" />
            <p className="ak-footer-sign">Owned, not advised.</p>
            <p className="ak-footer-blurb">
              An experienced finance team, embedded in your operations. Accounting, tax and compliance, FP&amp;A,
              payroll, corporate &amp; legal compliance, ERP systems and data management for start-ups, SMEs and
              enterprises across Asia-Pacific. Since 2015.
            </p>
          </div>
          <nav className="ak-footer-col" aria-label="The story">
            <span className="ak-footer-h">The story</span>
            <a href={h("problem")}>The problem</a>
            <a href={h("shift")}>Why operators</a>
            <a href={h("team")}>Our team</a>
            <a href={h("expertise")}>Expertise</a>
            <a href={h("model")}>How it works</a>
            <a href={h("packages")}>Packages</a>
          </nav>
          <nav className="ak-footer-col" aria-label="Resources">
            <span className="ak-footer-h">Resources</span>
            <a href="/deadlines">Tax Calendar</a>
            <a href="/privacy">Privacy Notice</a>
            <a href="/privacy#request">Request data deletion</a>
          </nav>
          <div className="ak-footer-col">
            <span className="ak-footer-h">Contact</span>
            <a href={`mailto:${email}`}>{email}</a>
            <a href={`mailto:${corpEmail}`}>{corpEmail}</a>
            <a href={`tel:${phoneTel}`}>{phone}</a>
            <a href={linkedin} target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
          </div>
        </div>
        <div className="ak-footer-bottom">
          <span suppressHydrationWarning>© {new Date().getFullYear()} Aarkledger. All rights reserved.</span>
          <span>Embedded finance &amp; ERP team · Est. 2015 · Engagements by signed contract</span>
          <span className="ak-footer-fine">
            SAP S/4HANA, Oracle NetSuite and Microsoft Dynamics 365 Business Central are trademarks of their respective
            owners.
          </span>
        </div>
      </div>
    </footer>
  );
}
