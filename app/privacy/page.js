import SiteFooter from "../components/SiteFooter";
import DataRequestForm from "../components/DataRequestForm";
import { LOGO_SRC } from "../components/brand";

const EMAIL = "louie@aarkledger.com";
const CORP_EMAIL = "corporate@aarkledger.com";
const PHONE = "+63 928 285 7646";
const PHONE_TEL = "+639282857646";
const LINKEDIN = "https://www.linkedin.com/company/aarkledger-accounting/";

export const metadata = {
  title: "Privacy Notice | Aarkledger",
  description:
    "What personal data reaches Aarkledger through this website, what we do with it, and how to request a copy or its deletion under the GDPR and the Philippine Data Privacy Act of 2012.",
  alternates: { canonical: "https://aarkledger.com/privacy" },
  openGraph: {
    title: "Privacy Notice | Aarkledger",
    description:
      "No cookies, no analytics, no tracking. How Aarkledger handles what you send us, and how to have it deleted.",
    url: "https://aarkledger.com/privacy",
    siteName: "Aarkledger",
    type: "website",
  },
};

const TOC = [
  ["who-we-are", "Who we are"],
  ["not-collected", "What this website does not collect"],
  ["what-we-receive", "What we do receive"],
  ["legal-basis", "Why we use it, and on what legal basis"],
  ["recipients", "Who else sees it"],
  ["transfers", "International transfers"],
  ["retention", "How long we keep it"],
  ["rights", "Your rights"],
  ["how-to", "How to use your rights"],
  ["security", "Security"],
  ["children", "Children"],
  ["links", "Links to other sites"],
  ["changes", "Changes to this notice"],
  ["request", "Request your data"],
];

const BASES = [
  [
    "Replying to your enquiry and taking steps you ask for before an engagement, such as a proposal or a call",
    "(b) steps before entering a contract",
    "(b) steps before entering a contract",
  ],
  [
    "Running and securing the website, and keeping a record of business correspondence",
    "(f) our legitimate interests",
    "(f) our legitimate interests",
  ],
  ["Keeping records when the law requires it", "(c) legal obligation", "(c) legal obligation"],
];

function TocList() {
  return (
    <ol className="ak-legal-toc-list">
      {TOC.map(([id, label], i) => (
        <li key={id}>
          <a href={`#${id}`}>
            <span className="ak-mono" aria-hidden="true">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span>{label}</span>
          </a>
        </li>
      ))}
    </ol>
  );
}

function Corp() {
  return (
    <a className="ak-legal-mail" href={`mailto:${CORP_EMAIL}`}>
      <strong>{CORP_EMAIL}</strong>
    </a>
  );
}

export default function PrivacyPage() {
  return (
    <div className="ak-legal">
      <a className="ak-skip" href="#notice">
        Skip to content
      </a>

      <header className="ak-legal-band ak-dark">
        <div className="ak-shell">
          <div className="ak-legal-bar">
            <a href="/" className="ak-legal-logo" aria-label="Aarkledger home">
              <img className="brand-logo" src={LOGO_SRC} alt="Aarkledger" />
            </a>
            <a href="/" className="ak-tlink ak-legal-back">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                focusable="false"
              >
                <path d="M19 12H5" />
                <path d="M11 6l-6 6 6 6" />
              </svg>
              <span className="ak-link">Back to main site</span>
            </a>
          </div>

          <div className="ak-legal-hero">
            <p className="ak-eyebrow">GDPR · Philippine Data Privacy Act of 2012</p>
            <h1 className="ak-legal-h1">Privacy Notice</h1>
            <p className="ak-legal-updated">
              Last updated <time dateTime="2026-10-09">October 9, 2026</time>
            </p>
            <p className="ak-legal-lede">
              This notice explains what personal data reaches Aarkledger through this website, what we do with it, and
              how to have it deleted. The short version: the website uses no cookies, no analytics and no tracking, and
              nothing you type into it is stored on it. Our hosting provider handles basic technical request data, such
              as your IP address, so it can deliver the site. Beyond that, we receive only what you choose to send us by
              email, phone or LinkedIn.
            </p>
            <a href="#request" className="ak-btn ak-btn--signal ak-legal-cta">
              Request your data or its deletion
              <svg
                className="ak-arrow"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                focusable="false"
              >
                <path d="M5 12h14" />
                <path d="M13 6l6 6-6 6" />
              </svg>
            </a>
          </div>
        </div>
      </header>

      <main id="notice" className="ak-legal-main" tabIndex={-1}>
        <div className="ak-shell ak-legal-grid">
          <aside className="ak-legal-aside">
            <details className="ak-legal-toc ak-legal-toc--mobile">
              <summary>On this page</summary>
              <nav aria-label="On this page (menu)">
                <TocList />
              </nav>
            </details>
            <nav className="ak-legal-toc ak-legal-toc--desk" aria-label="On this page">
              <span className="ak-label">On this page</span>
              <TocList />
            </nav>
          </aside>

          <article className="ak-legal-body">
            <section id="who-we-are" aria-labelledby="h-who-we-are">
              <h2 id="h-who-we-are">Who we are</h2>
              <p>
                Aarkledger (&ldquo;we&rdquo;, &ldquo;us&rdquo;) is the controller of the personal data described here.
                Under the EU General Data Protection Regulation (GDPR, Regulation (EU) 2016/679) that makes us the
                &ldquo;controller&rdquo;. Under the Philippine Data Privacy Act of 2012 (Republic Act No. 10173) we are
                the &ldquo;personal information controller&rdquo;.
              </p>
              <p>
                For any privacy question or request, email <Corp />.
              </p>
            </section>

            <section id="not-collected" aria-labelledby="h-not-collected">
              <h2 id="h-not-collected">What this website does not collect</h2>
              <ul className="ak-legal-checks">
                <li>
                  <strong>No cookies.</strong> The website sets none.
                </li>
                <li>
                  <strong>No analytics, advertising or tracking.</strong> There are no tracking pixels, tag managers,
                  session recording or third-party scripts.
                </li>
                <li>
                  <strong>No accounts, sign-ups, uploads or payments.</strong>
                </li>
                <li>
                  <strong>No outside font or image services.</strong> Our fonts and images are served from this
                  website&apos;s own domain, so loading a page doesn&apos;t contact Google or any other outside service.
                </li>
                <li>
                  <strong>Nothing you type is submitted to or stored on the website.</strong> This includes the enquiry form.
                </li>
              </ul>
            </section>

            <section id="what-we-receive" aria-labelledby="h-what-we-receive">
              <h2 id="h-what-we-receive">What we do receive</h2>
              <p>
                You don&apos;t have to give us any personal data. It isn&apos;t a legal or contractual requirement, but
                without your contact details we can&apos;t reply to your enquiry.
              </p>
              <h3>When you use the enquiry form.</h3>
              <p>
                The form doesn&apos;t send anything to us. It opens your own email app with a draft addressed to us, and
                nothing reaches us unless you press send. If you do, we receive the email: your name, your email
                address, your company (if given), the package you&apos;re interested in (if picked), your message, and
                anything else you put in it. Please leave out sensitive personal details or other people&apos;s
                financial information until we&apos;ve agreed how to handle them.
              </p>
              <h3>When you email, call, text or message us on LinkedIn.</h3>
              <p>
                We receive your contact details and whatever you tell us. Emails pass through your email provider and
                ours. Calls and texts leave your number and a call log on our phone. Messages on LinkedIn are covered by
                LinkedIn&apos;s own privacy policy as well as this notice.
              </p>
              <h3>When you load any page.</h3>
              <p>
                Like every website, ours has to receive a request from your browser before it can show you a page. Our
                hosting provider processes basic technical data to deliver and protect the site: your IP address, your
                browser and device type (user agent), the page you asked for, the referring page and the time. We
                don&apos;t use this data to identify you or build a profile.
              </p>
              <h3>One optional preference, kept only on your device.</h3>
              <p>
                The quick view pop-up has a &ldquo;Don&apos;t show this quick view again&rdquo; box. If you tick it,
                your browser stores that one setting in its local storage so the pop-up stays closed on later visits. It
                is never sent to us. If you don&apos;t tick it, nothing is stored. You can clear it at any time by
                clearing this site&apos;s data in your browser settings.
              </p>
            </section>

            <section id="legal-basis" aria-labelledby="h-legal-basis">
              <h2 id="h-legal-basis">Why we use it, and on what legal basis</h2>
              <table className="ak-legal-table">
                <caption className="ak-sr">Purposes of processing and their legal bases</caption>
                <thead>
                  <tr>
                    <th scope="col">Purpose</th>
                    <th scope="col">GDPR (Art. 6(1))</th>
                    <th scope="col">RA 10173 (Sec. 12)</th>
                  </tr>
                </thead>
                <tbody>
                  {BASES.map(([purpose, gdpr, ra]) => (
                    <tr key={purpose}>
                      <th scope="row">{purpose}</th>
                      <td data-label="GDPR (Art. 6(1))">{gdpr}</td>
                      <td data-label="RA 10173 (Sec. 12)">{ra}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p>
                <strong>Your right to object.</strong> Where we rely on our legitimate interests, you can object at any
                time. Email <Corp /> or use the <a href="#request">request form</a>.
              </p>
              <p>
                We don&apos;t use your data for automated decision-making or profiling, and we don&apos;t send marketing
                you haven&apos;t asked for.
              </p>
              <p>
                <strong>Clients.</strong> This notice covers our website and enquiries only. It doesn&apos;t cover
                personal data we handle for clients during an engagement, such as payroll or tax records. If you become
                a client, we&apos;ll agree with you how that data is handled as part of the engagement.
              </p>
            </section>

            <section id="recipients" aria-labelledby="h-recipients">
              <h2 id="h-recipients">Who else sees it</h2>
              <ul>
                <li>
                  <strong>Our hosting provider (Vercel)</strong> processes the technical request data described above.
                </li>
                <li>
                  <strong>Our email service provider</strong> stores and delivers the emails you send us.
                </li>
                <li>
                  <strong>Professional advisers, regulators or authorities</strong>, only where the law requires it or
                  where we need to protect our legal rights.
                </li>
              </ul>
              <p>We never sell or rent personal data, and we don&apos;t share it for advertising.</p>
            </section>

            <section id="transfers" aria-labelledby="h-transfers">
              <h2 id="h-transfers">International transfers</h2>
              <p>
                Our service providers may process data outside the Philippines and the European Economic Area, for
                example in the United States. Where the GDPR requires a safeguard for such a transfer, we rely on the
                transfer terms in our providers&apos; data processing agreements, such as the European Commission&apos;s
                Standard Contractual Clauses, or on an EU adequacy decision where one covers the provider. Under RA 10173
                we remain responsible for personal data our providers process for us, and we use contractual or other
                reasonable means to keep it protected to a comparable standard.
              </p>
              <p>
                To ask which safeguard applies to a transfer, or for a copy of it, email <Corp />.
              </p>
            </section>

            <section id="retention" aria-labelledby="h-retention">
              <h2 id="h-retention">How long we keep it</h2>
              <p>
                We keep enquiry emails, call records and messages only as long as we need them to reply and follow up,
                or for as long as a law or contract requires. After that we delete them. Our hosting provider keeps
                technical request logs for a limited period under its own retention schedule.
              </p>
            </section>

            <section id="rights" aria-labelledby="h-rights">
              <h2 id="h-rights">Your rights</h2>
              <p>Wherever you are, you can ask us to:</p>
              <ul>
                <li>
                  <strong>Tell you</strong> what personal data we hold about you and how we use it
                </li>
                <li>
                  <strong>Send you a copy</strong> of it, in a commonly used electronic format where that applies
                  (portability)
                </li>
                <li>
                  <strong>Correct</strong> anything inaccurate or incomplete
                </li>
                <li>
                  <strong>Delete it, or block it</strong> from further processing
                </li>
                <li>
                  <strong>Restrict</strong> how we use it while a concern is resolved
                </li>
                <li>
                  <strong>Stop</strong> using it or contacting you (objection)
                </li>
              </ul>
              <p>You can also:</p>
              <ul>
                <li>
                  <strong>Withdraw consent</strong> at any time, if we ever rely on it
                </li>
                <li>
                  <strong>Complain to a regulator.</strong> In the Philippines that is the National Privacy Commission (
                  <a href="https://privacy.gov.ph" target="_blank" rel="noopener noreferrer">
                    privacy.gov.ph
                  </a>
                  ). In the EU/EEA it is your local data protection supervisory authority.
                </li>
              </ul>

              <div className="ak-legal-laws">
                <h3>Which law gives which right.</h3>
                <dl>
                  <div>
                    <dt>GDPR</dt>
                    <dd>
                      Access (Art. 15), rectification (Art. 16), erasure (Art. 17), restriction (Art. 18), portability
                      (Art. 20), objection (Art. 21), and the right not to be subject to decisions based solely on
                      automated processing (Art. 22). We make no such decisions.
                    </dd>
                  </div>
                  <div>
                    <dt>RA 10173</dt>
                    <dd>
                      <ul>
                        <li>
                          Sec. 16 (and Sec. 34 of its Implementing Rules): the rights to be informed, to object, to
                          access, to rectification, to erasure or blocking, and to damages
                        </li>
                        <li>
                          Sec. 17: your lawful heirs and assigns may exercise these rights after your death, or if you
                          are incapacitated or unable to exercise them
                        </li>
                        <li>Sec. 18: data portability</li>
                        <li>You can also file a complaint with the National Privacy Commission.</li>
                      </ul>
                    </dd>
                  </div>
                </dl>
              </div>
            </section>

            <section id="how-to" aria-labelledby="h-how-to">
              <h2 id="h-how-to">How to use your rights</h2>
              <p>
                Use the <a href="#request">request form below</a>, or email <Corp />.
              </p>
              <ul>
                <li>
                  <strong>We may need to confirm your identity</strong> before acting, usually by replying to the email
                  address you contacted us from. This keeps your data from going to the wrong person.
                </li>
                <li>
                  <strong>We reply promptly.</strong> We acknowledge requests as soon as we can and respond within the
                  time the law that applies to you allows. Under the GDPR that is within one month of receiving your
                  request. For complex or numerous requests it can be extended by up to two further months, and if so
                  we&apos;ll tell you why within the first month. For requests under the Philippine Data Privacy Act, we
                  follow the timelines set by the National Privacy Commission.
                </li>
                <li>
                  <strong>There is no fee</strong> for reasonable requests.
                </li>
                <li>
                  <strong>What deletion covers.</strong> We delete your emails, messages, call records and contact
                  details from our systems. We can only keep what a law or a signed contract requires, and we&apos;ll
                  tell you if that applies. Technical request logs held by our hosting provider expire on their own
                  schedule.
                </li>
              </ul>
            </section>

            <section id="security" aria-labelledby="h-security">
              <h2 id="h-security">Security</h2>
              <p>
                The website is served over an encrypted HTTPS connection. Because it stores nothing you type into
                it, a breach of the website can&apos;t expose your enquiries. We limit access to enquiry emails to the people who need them
                to respond to you.
              </p>
            </section>

            <section id="children" aria-labelledby="h-children">
              <h2 id="h-children">Children</h2>
              <p>
                This website and our services are for businesses. They aren&apos;t directed at children, and we
                don&apos;t knowingly collect personal data from anyone under 18.
              </p>
            </section>

            <section id="links" aria-labelledby="h-links">
              <h2 id="h-links">Links to other sites</h2>
              <p>
                Our LinkedIn links open LinkedIn in a new tab without passing on which of our pages you came from. Once
                you&apos;re on LinkedIn, its own privacy policy and cookies apply.
              </p>
            </section>

            <section id="changes" aria-labelledby="h-changes">
              <h2 id="h-changes">Changes to this notice</h2>
              <p>
                If how we handle personal data changes, we&apos;ll update this page and the &ldquo;Last updated&rdquo;
                date at the top.
              </p>
            </section>
          </article>
        </div>

        <section id="request" className="ak-req ak-dark" aria-labelledby="h-request">
          <div className="ak-shell ak-req-in">
            <div className="ak-req-intro">
              <p className="ak-eyebrow">Delete · Copy · Correct · Object</p>
              <h2 id="h-request" className="ak-req-h2">
                Request your data
              </h2>
              <p className="ak-req-lede">
                Ask us to delete, send, or correct the personal data we hold about you, or to stop contacting you. Fill
                this in and we&apos;ll take it from there. We usually confirm your identity by replying to the email
                address you contacted us from.
              </p>
            </div>
            <div className="ak-req-card">
              <DataRequestForm to={CORP_EMAIL} />
            </div>
          </div>
        </section>
      </main>

      <div className="ak-legal-foot">
        <SiteFooter
          logoSrc={LOGO_SRC}
          email={EMAIL}
          corpEmail={CORP_EMAIL}
          phone={PHONE}
          phoneTel={PHONE_TEL}
          linkedin={LINKEDIN}
          basePath="/"
        />
      </div>
    </div>
  );
}
