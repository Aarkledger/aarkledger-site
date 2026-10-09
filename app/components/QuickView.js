"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, Close } from "./icons";

/*
 * Quick view: a one-screen summary of the home page, shown as a modal dialog.
 *
 * Storage: the ONLY thing this component ever stores is the optional opt-out
 * below, and only while the visitor has "Don't show this quick view again"
 * ticked. It is written the moment the box is ticked (so it survives leaving via
 * a link, Back or closing the tab); unticking it removes the key. Nothing is ever
 * sent anywhere. (The Privacy Notice describes exactly this behaviour.)
 *
 * "Once per visit" is tracked without storage: a module-level flag covers
 * client-side re-renders, and reloads, back/forward navigations and arrivals
 * from another page of this site do not auto-open.
 */
const HIDE_KEY = "ak-quickview-hide"; // localStorage "1" = never auto-open
const AUTO_OPEN_DELAY = 1200;
const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';
const INERT_TARGETS = "main#top, .ak-header, .ak-footer, .ak-rail, .ak-skip, .ak-sticky-cta-nav, .ak-sticky-cta";
const QV_FUNCTIONS = [
  "Accounting",
  "Compliance & tax",
  "FP&A",
  "Payroll",
  "Corporate & legal compliance",
  "ERP systems",
  "Data management",
];

let autoOpenedThisLoad = false;

function readHide() {
  try {
    return window.localStorage.getItem(HIDE_KEY) === "1";
  } catch (e) {
    return false;
  }
}
function writeHide(on) {
  try {
    if (on) window.localStorage.setItem(HIDE_KEY, "1");
    else window.localStorage.removeItem(HIDE_KEY);
  } catch (e) {
    /* storage blocked: the dialog still works, only "remember" degrades */
  }
}
const hasDeepLink = () => {
  const h = window.location.hash;
  return !!h && h !== "#";
};
const isPrinting = () => !!window.matchMedia && window.matchMedia("print").matches;
const canFocus = (el) =>
  !!el && el.isConnected && !el.closest("[inert],[hidden],[aria-hidden='true']") && el.getClientRects().length > 0;

/* A reload, back/forward, or arrival from another page of this site is the same visit. */
function isRepeatView() {
  try {
    const nav = performance.getEntriesByType && performance.getEntriesByType("navigation")[0];
    if (nav && (nav.type === "reload" || nav.type === "back_forward")) return true;
  } catch (e) {
    /* ignore */
  }
  try {
    if (document.referrer && new URL(document.referrer).origin === window.location.origin) return true;
  } catch (e) {
    /* ignore */
  }
  return false;
}

export default function QuickView({
  open,
  onOpen,
  onClose,
  returnFocusRef,
  onEnquire,
  logoSrc,
  email,
  phone,
  phoneTel,
  packages = [],
  erps = [],
  also = [],
  autoOpen = true,
  privacyHref,
}) {
  const [mounted, setMounted] = useState(false);
  const [dontShow, setDontShow] = useState(false);
  const dontShowRef = useRef(false);
  const restoreRef = useRef(true);
  const openRef = useRef(open);
  const closeRef = useRef(() => {});
  const titleRef = useRef(null);
  const panelRef = useRef(null);

  openRef.current = open;

  useEffect(() => setMounted(true), []);

  const requestClose = useCallback(
    (restoreFocus = true) => {
      writeHide(dontShowRef.current);
      restoreRef.current = restoreFocus;
      onClose();
    },
    [onClose]
  );
  closeRef.current = requestClose;

  /* auto-open, once per visit */
  useEffect(() => {
    if (!autoOpen || autoOpenedThisLoad || readHide() || hasDeepLink() || isPrinting() || isRepeatView()) {
      return undefined;
    }
    let timer = window.setTimeout(() => {
      timer = 0;
      if (autoOpenedThisLoad || openRef.current || hasDeepLink() || isPrinting()) return;
      if (document.querySelector(".ak-sheet.is-open")) return;
      if (window.scrollY > window.innerHeight * 0.5) return;
      // Only auto-open for a visitor who hasn't moved focus yet (covers form fields, links, the skip link...)
      const a = document.activeElement;
      if (a && a !== document.body && a !== document.documentElement) return;
      autoOpenedThisLoad = true;
      onOpen(null);
    }, AUTO_OPEN_DELAY);
    const cancel = () => {
      if (timer) window.clearTimeout(timer);
      timer = 0;
    };
    window.addEventListener("hashchange", cancel);
    window.addEventListener("beforeprint", cancel);
    // A deliberate key press or click/tap means the visitor has started using the page.
    window.addEventListener("keydown", cancel, true);
    window.addEventListener("pointerdown", cancel, true);
    return () => {
      cancel();
      window.removeEventListener("hashchange", cancel);
      window.removeEventListener("beforeprint", cancel);
      window.removeEventListener("keydown", cancel, true);
      window.removeEventListener("pointerdown", cancel, true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* while open: scroll lock, inert background, focus, Escape, focus trap */
  useEffect(() => {
    if (!open || !mounted) return undefined;
    const html = document.documentElement;
    const body = document.body;
    const sbw = window.innerWidth - html.clientWidth;
    const prevPad = body.style.paddingRight;
    html.classList.add("ak-qv-lock");
    if (sbw > 0) body.style.paddingRight = `${sbw}px`;

    const inerted = [];
    document.querySelectorAll(INERT_TARGETS).forEach((el) => {
      if (!el.hasAttribute("inert")) {
        el.setAttribute("inert", "");
        inerted.push(el);
      }
    });

    const init = readHide();
    dontShowRef.current = init;
    setDontShow(init);

    restoreRef.current = true;
    if (titleRef.current) titleRef.current.focus({ preventScroll: true });

    const onKey = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeRef.current();
        return;
      }
      if (e.key !== "Tab") return;
      const panel = panelRef.current;
      if (!panel) return;
      const items = Array.from(panel.querySelectorAll(FOCUSABLE)).filter((el) => el.getClientRects().length > 0);
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (!panel.contains(active)) {
        e.preventDefault();
        (e.shiftKey ? last : first).focus();
      } else if (e.shiftKey && (active === first || active === titleRef.current)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("keydown", onKey);
      html.classList.remove("ak-qv-lock");
      body.style.paddingRight = prevPad;
      inerted.forEach((el) => el.removeAttribute("inert"));
      if (restoreRef.current) {
        const target = [returnFocusRef && returnFocusRef.current, document.querySelector(".ak-logo")].find(canFocus);
        if (target) target.focus({ preventScroll: true });
      }
    };
  }, [open, mounted, returnFocusRef]);

  if (!mounted || !open) return null;

  const onCheck = (e) => {
    const on = e.target.checked;
    dontShowRef.current = on;
    setDontShow(on);
    writeHide(on); // store immediately, so every way out of the dialog keeps the choice
  };

  const enquire = () => {
    requestClose(false);
    window.requestAnimationFrame(() => onEnquire && onEnquire());
  };

  return (
    <div className="ak-qv">
      <div className="ak-qv-backdrop" aria-hidden="true" onClick={() => requestClose()} />
      <div
        className="ak-qv-panel ak-dark"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ak-qv-title"
        aria-describedby="ak-qv-desc"
        ref={panelRef}
      >
        <div className="ak-qv-top">
          <img className="brand-logo ak-qv-logo" src={logoSrc} alt="Aarkledger" />
          <span className="ak-qv-tag">Quick view</span>
          <button type="button" className="ak-qv-close" aria-label="Close quick view" onClick={() => requestClose()}>
            <Close size={20} />
          </button>
        </div>

        <div className="ak-qv-body">
          {/* "·&nbsp;" keeps each separator with the item after it when the line wraps */}
          <p className="ak-eyebrow ak-qv-eyebrow">
            Embedded finance &amp; ERP team ·&nbsp;Est.&nbsp;2015 ·&nbsp;Asia-Pacific
          </p>
          <h2 id="ak-qv-title" className="ak-qv-title" tabIndex={-1} ref={titleRef}>
            The consultants left. The problems didn&apos;t.
          </h2>
          <p id="ak-qv-desc" className="ak-qv-answer">
            <strong>Not consultants. Operators.</strong> An experienced finance team that embeds in your operations,
            runs the work every month and answers for the result, as your business partner.
          </p>

          <div className="ak-qv-grid">
            <section className="ak-qv-block" aria-labelledby="ak-qv-h-fn">
              <h3 className="ak-label" id="ak-qv-h-fn">
                What we run
              </h3>
              <ul className="ak-qv-chips">
                {QV_FUNCTIONS.map((f) => (
                  <li className="ak-qv-chip" key={f}>
                    {f}
                  </li>
                ))}
              </ul>
            </section>
            <section className="ak-qv-block" aria-labelledby="ak-qv-h-sys">
              <h3 className="ak-label" id="ak-qv-h-sys">
                Systems we work in
              </h3>
              <p className="ak-qv-erps">
                {erps.map((e, i) => (
                  <span key={e.name}>
                    {i > 0 && (
                      <>
                        {" "}
                        <span aria-hidden="true">·</span>
                        {"\u00a0"}
                      </>
                    )}
                    {e.name}
                  </span>
                ))}
              </p>
              <p className="ak-qv-small">
                Also hands-on with {also.slice(0, -1).join(", ")} and {also[also.length - 1]}. Start-ups, SMEs and
                enterprises across Asia-Pacific.
              </p>
            </section>
          </div>

          <section className="ak-qv-block ak-qv-pkgs-wrap" aria-labelledby="ak-qv-h-pkg">
            <h3 className="ak-label" id="ak-qv-h-pkg">
              Three ways to bring us in
            </h3>
            <ul className="ak-qv-pkgs">
              {packages.map((p) => (
                <li className="ak-qv-pkg" key={p.name}>
                  <span className="ak-qv-pkg-id">
                    <span className="ak-qv-pkg-name">{p.name}</span>
                    <span className="ak-qv-pkg-tag">{p.tag}</span>
                  </span>
                  <span className="ak-qv-pkg-line">{p.tagline}</span>
                </li>
              ))}
            </ul>
            <p className="ak-qv-small">
              Every package is quoted to your transaction volume, entities and systems. Single projects are billed 50%
              upfront, 50% on completion.
            </p>
          </section>

          <div className="ak-qv-meta">
            <span className="ak-label">Talk to a partner</span>
            <a className="ak-qv-mlink" href={`mailto:${email}`}>
              {email}
            </a>
            <a className="ak-qv-mlink" href={`tel:${phoneTel}`}>
              {phone}
            </a>
            <a className="ak-qv-mlink ak-qv-cal" href="/deadlines">
              Tax Calendar <span className="ak-ph">PH</span>
            </a>
          </div>
        </div>

        <div className="ak-qv-foot">
          <div className="ak-qv-actions">
            <button type="button" className="ak-btn ak-btn--signal ak-qv-primary" onClick={enquire}>
              Send an enquiry <ArrowRight size={16} />
            </button>
            <button type="button" className="ak-tlink ak-qv-secondary" onClick={() => requestClose()}>
              <span className="ak-link">Explore the full story</span>
              <ArrowRight size={16} />
            </button>
          </div>
          <div className="ak-qv-opt">
            <label className="ak-qv-check" htmlFor="ak-qv-hide">
              <input
                type="checkbox"
                id="ak-qv-hide"
                aria-describedby="ak-qv-hint"
                checked={dontShow}
                onChange={onCheck}
              />
              <span>Don&apos;t show this quick view again</span>
            </label>
            <span id="ak-qv-hint" className="ak-qv-hint">
              Reopen anytime from “Quick view”.
            </span>
            {privacyHref && (
              <a className="ak-qv-privacy" href={privacyHref}>
                <span className="ak-link">Privacy Notice</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
