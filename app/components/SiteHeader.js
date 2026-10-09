"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight } from "./icons";
import { observe } from "./useStoryEngine";

const CHAPTERS = [
  ["problem", "01", "The problem"],
  ["shift", "02", "Why operators"],
  ["team", "03", "Our team"],
  ["expertise", "04", "Expertise"],
  ["model", "05", "How it works"],
  ["packages", "06", "Packages"],
  ["contact", "07", "Start here"],
];

// One name per chapter everywhere: eyebrow, rail, nav, menu and footer.
const SHEET_LINKS = CHAPTERS;

export default function SiteHeader({ logoSrc, email, phone, phoneTel }) {
  const [open, setOpen] = useState(false);
  const [chapter, setChapter] = useState("");
  const [ctaShow, setCtaShow] = useState(false);
  const [contactIn, setContactIn] = useState(false);
  const toggleRef = useRef(null);
  const sheetRef = useRef(null);

  const close = useCallback((returnFocus = true) => {
    setOpen(false);
    if (returnFocus && toggleRef.current) toggleRef.current.focus();
  }, []);

  /* chapter rail */
  useEffect(() => {
    const on = (e) => setChapter(e.detail || "");
    window.addEventListener("ak:chapter", on);
    const cur = document.documentElement.getAttribute("data-chapter");
    if (cur) setChapter(cur);
    return () => window.removeEventListener("ak:chapter", on);
  }, []);

  /* sticky mobile CTA visibility */
  useEffect(() => {
    const problem = document.getElementById("problem");
    const contact = document.getElementById("contact");
    const offs = [];
    if (problem)
      offs.push(
        observe(problem, (v, entry) => {
          const past = !v && entry && entry.boundingClientRect.top < 0;
          setCtaShow(past);
        }, "0px")
      );
    if (contact) offs.push(observe(contact, (v) => setContactIn(v), "0px"));
    return () => offs.forEach((f) => f());
  }, []);

  /* mobile sheet: scroll lock, Escape, focus trap, close on resize */
  useEffect(() => {
    if (!open) return undefined;
    const body = document.body;
    const prev = body.style.overflow;
    body.style.overflow = "hidden";
    const sheet = sheetRef.current;
    const first = sheet && sheet.querySelector("a, button");
    if (first) first.focus();
    const onKey = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close(true);
        return;
      }
      if (e.key !== "Tab" || !sheet) return;
      const items = [toggleRef.current, ...sheet.querySelectorAll("a[href], button")].filter(Boolean);
      const idx = items.indexOf(document.activeElement);
      if (e.shiftKey && (idx <= 0)) {
        e.preventDefault();
        items[items.length - 1].focus();
      } else if (!e.shiftKey && idx === items.length - 1) {
        e.preventDefault();
        items[0].focus();
      } else if (idx === -1) {
        e.preventDefault();
        items[0].focus();
      }
    };
    const mq = window.matchMedia("(min-width: 900px)");
    const onMQ = () => mq.matches && close(false);
    document.addEventListener("keydown", onKey);
    if (mq.addEventListener) mq.addEventListener("change", onMQ);
    return () => {
      body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
      if (mq.removeEventListener) mq.removeEventListener("change", onMQ);
    };
  }, [open, close]);

  const activeIdx = CHAPTERS.findIndex((c) => c[0] === chapter);
  const showCta = ctaShow && !contactIn && !open;

  return (
    <>
      {/* Without JS the menu sheet cannot open, so hide its toggle. */}
      <noscript dangerouslySetInnerHTML={{ __html: "<style>.ak-menu-btn{display:none!important}</style>" }} />
      <a className="ak-skip" href="#problem">
        Skip to content
      </a>
      <header className="ak-header">
        <div className="ak-shell ak-header-in">
          <a href="#top" className="ak-logo" aria-label="Aarkledger home">
            <img className="brand-logo" src={logoSrc} alt="Aarkledger" />
          </a>
          <nav className="ak-nav" aria-label="Primary">
            <a href="#shift" className="ak-link">Why operators</a>
            <a href="#team" className="ak-link">Our team</a>
            <a href="#expertise" className="ak-link">Expertise</a>
            <a href="#packages" className="ak-link">Packages</a>
            <a href="/deadlines" className="ak-link">
              Tax Calendar <span className="ak-ph">PH</span>
            </a>
          </nav>
          <a href="#contact" className="ak-btn ak-btn--sm ak-header-cta">
            Talk to an operator <ArrowRight size={15} />
          </a>
          <button
            type="button"
            className={`ak-menu-btn${open ? " is-open" : ""}`}
            aria-expanded={open}
            aria-controls="ak-menu"
            aria-label={open ? "Close menu" : "Menu"}
            ref={toggleRef}
            onClick={() => setOpen((o) => !o)}
          >
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </button>
        </div>
        <span className="ak-progress" aria-hidden="true" />
      </header>

      <div
        className={`ak-sheet${open ? " is-open" : ""}`}
        id="ak-menu"
        ref={sheetRef}
        aria-hidden={!open}
        inert={open ? undefined : ""}
      >
        <nav aria-label="Menu" className="ak-sheet-in">
          <ul className="ak-sheet-list">
            {SHEET_LINKS.map(([id, n, label]) => (
              <li key={id}>
                <a href={`#${id}`} onClick={() => close(false)}>
                  <span className="ak-mono">{n}</span>
                  {label}
                </a>
              </li>
            ))}
            <li>
              <a href="/deadlines" onClick={() => close(false)}>
                <span className="ak-mono">PH</span>
                Tax Calendar (PH)
              </a>
            </li>
          </ul>
          <a href="#contact" className="ak-btn ak-btn--block" onClick={() => close(false)}>
            Talk to an operator <ArrowRight size={16} />
          </a>
          <div className="ak-sheet-contact">
            <a href={`mailto:${email}`}>{email}</a>
            <a href={`tel:${phoneTel}`}>{phone}</a>
          </div>
        </nav>
      </div>

      <nav className="ak-rail" aria-label="Chapters">
        {CHAPTERS.map(([id, n, label], i) => (
          <a
            key={id}
            href={`#${id}`}
            className={`ak-rail-row${i === activeIdx ? " is-active" : ""}${activeIdx > -1 && i < activeIdx ? " is-passed" : ""}`}
            aria-current={i === activeIdx ? "true" : undefined}
          >
            <span className="ak-rail-tick" aria-hidden="true" />
            <span className="ak-rail-num" aria-hidden="true">{n}</span>
            <span className="ak-rail-label">{label}</span>
          </a>
        ))}
      </nav>

      <nav aria-label="Quick contact">
        <a
          href="#contact"
          className={`ak-sticky-cta${showCta ? " is-shown" : ""}`}
          aria-hidden={!showCta}
          tabIndex={showCta ? 0 : -1}
        >
          Tell us what&apos;s still broken <ArrowRight size={16} />
        </a>
      </nav>
    </>
  );
}
