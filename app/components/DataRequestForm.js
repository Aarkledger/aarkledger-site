"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "./icons";

const REQUEST_TYPES = [
  "Delete my data",
  "Send me a copy of my data",
  "Correct my data",
  "Stop contacting me / object to processing",
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DETAILS_MAX = 1200; // keeps the mailto URL well inside the limits some email handlers enforce

export function buildDataRequestMailto(to, f) {
  const name = f.fullName.trim();
  const subject = `Data request: ${f.requestType}, ${name}`;
  const body =
    `Request type: ${f.requestType}\n` +
    `Full name: ${name}\n` +
    `Email address I used to contact Aarkledger: ${f.email.trim()}\n` +
    `Company: ${f.company.trim() || "Not given"}\n` +
    `\n` +
    `Details:\n` +
    `${f.details.trim() || "None provided"}\n` +
    `\n` +
    `I confirm I am the person this data is about, or I'm authorized to act for them.\n` +
    `\n` +
    `Sent from the request form on the Aarkledger Privacy Notice.`;
  // RFC 6068: line breaks in a mailto body are encoded as CRLF (%0D%0A)
  const enc = (v) => encodeURIComponent(v).replace(/%0A/g, "%0D%0A");
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${enc(body)}`;
}

export default function DataRequestForm({ to }) {
  const [f, setF] = useState({
    fullName: "",
    email: "",
    company: "",
    requestType: REQUEST_TYPES[0],
    details: "",
    confirm: false,
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("");
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const refs = { fullName: useRef(null), email: useRef(null), confirm: useRef(null) };

  const set = (k, v) => {
    setF((s) => ({ ...s, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (!f.fullName.trim()) e.fullName = "Please enter your full name.";
    if (!f.email.trim()) e.email = "Please enter the email address you used to contact us.";
    else if (!EMAIL_RE.test(f.email.trim())) e.email = "Please enter a valid email address, like name@company.com.";
    if (!f.confirm) e.confirm = "Please confirm you are the person this data is about, or authorized to act for them.";
    return e;
  };

  const onSubmit = (ev) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    const firstBad = ["fullName", "email", "confirm"].find((k) => e[k]);
    if (firstBad) {
      const n = Object.keys(e).length;
      setStatus(`${n} ${n === 1 ? "field needs" : "fields need"} attention before your request can be composed.`);
      if (refs[firstBad].current) refs[firstBad].current.focus();
      return;
    }
    setStatus("Opening your email app with your request…");
    window.location.href = buildDataRequestMailto(to, f);
  };

  const err = (k) =>
    errors[k] ? (
      <p className="ak-req-err" id={`req-${k}-err`}>
        {errors[k]}
      </p>
    ) : null;
  const described = (k, extra) => [extra, errors[k] ? `req-${k}-err` : null].filter(Boolean).join(" ") || undefined;

  return (
    /*
     * action/method/encType are a no-JavaScript fallback only: if the form is submitted before
     * React has hydrated, the browser composes an email instead of sending the fields to the web
     * server in a GET URL. Once hydrated, onSubmit's preventDefault takes over.
     */
    <form
      className="ak-req-form"
      action={`mailto:${to}?subject=${encodeURIComponent("Data request")}`}
      method="post"
      encType="text/plain"
      onSubmit={onSubmit}
      noValidate={mounted}
      aria-describedby="req-required-note"
    >
      <p className="ak-req-note" id="req-required-note">
        Fields marked * are required.
      </p>
      <div className="ak-field-row">
        <div className="ak-field">
          <label htmlFor="req-fullName">Full name&nbsp;*</label>
          <input
            id="req-fullName"
            name="fullName"
            type="text"
            autoComplete="name"
            required
            aria-required="true"
            aria-invalid={errors.fullName ? "true" : undefined}
            aria-describedby={described("fullName")}
            ref={refs.fullName}
            value={f.fullName}
            onChange={(e) => set("fullName", e.target.value)}
          />
          {err("fullName")}
        </div>
        <div className="ak-field">
          <label htmlFor="req-email">Email you contacted us from&nbsp;*</label>
          <input
            id="req-email"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            required
            aria-required="true"
            aria-invalid={errors.email ? "true" : undefined}
            aria-describedby={described("email")}
            ref={refs.email}
            value={f.email}
            onChange={(e) => set("email", e.target.value)}
          />
          {err("email")}
        </div>
      </div>
      <div className="ak-field">
        <label htmlFor="req-company">Company (optional)</label>
        <input
          id="req-company"
          name="company"
          type="text"
          autoComplete="organization"
          value={f.company}
          onChange={(e) => set("company", e.target.value)}
        />
      </div>

      <fieldset className="ak-field ak-req-types">
        <legend className="ak-field-label">What would you like us to do?&nbsp;*</legend>
        <div className="ak-req-opts">
          {REQUEST_TYPES.map((t, i) => (
            <label className={`ak-req-opt${f.requestType === t ? " is-on" : ""}`} key={t}>
              <input
                type="radio"
                name="requestType"
                value={t}
                checked={f.requestType === t}
                onChange={() => set("requestType", t)}
                required={i === 0}
              />
              <span>{t}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="ak-field">
        <label htmlFor="req-details">Details (optional)</label>
        <textarea
          id="req-details"
          name="details"
          rows={4}
          maxLength={DETAILS_MAX}
          aria-describedby="req-details-hint"
          placeholder="Anything that helps us find your data. For example, roughly when you contacted us, other email addresses or phone numbers you used, or what needs correcting."
          value={f.details}
          onChange={(e) => set("details", e.target.value)}
        />
        <p className="ak-micro ak-req-hint" id="req-details-hint">
          Up to {DETAILS_MAX} characters. You can add more in the email itself before you send it.
        </p>
      </div>

      <div className={`ak-req-confirm${errors.confirm ? " is-invalid" : ""}`}>
        <label className="ak-req-check" htmlFor="req-confirm">
          <input
            id="req-confirm"
            name="confirm"
            type="checkbox"
            required
            aria-required="true"
            aria-invalid={errors.confirm ? "true" : undefined}
            aria-describedby={described("confirm")}
            ref={refs.confirm}
            checked={f.confirm}
            onChange={(e) => set("confirm", e.target.checked)}
          />
          <span>I am the person this data is about, or I&apos;m authorized to act for them.&nbsp;*</span>
        </label>
        {err("confirm")}
      </div>

      <button type="submit" className="ak-btn ak-btn--signal ak-req-submit">
        Open email to send request <ArrowRight size={16} />
      </button>
      <p className="ak-micro ak-req-help">
        Opens your email app with your request addressed to {to}. Nothing is sent until you press send, and nothing is
        stored on this website.
      </p>
      <p className="ak-req-fallback">
        No email app on this device? Email us directly at <a href={`mailto:${to}`}>{to}</a>.
      </p>
      <p className="ak-sr" role="status" aria-live="polite">
        {status}
      </p>
    </form>
  );
}
