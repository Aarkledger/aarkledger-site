"use client";

import { useEffect, useState } from "react";

/* ------------------------------------------------------------------ */
/* Shared helpers                                                       */
/* ------------------------------------------------------------------ */

export const RM_QUERY = "(prefers-reduced-motion: reduce)";

export const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);

/** Seeded PRNG (mulberry32). Only ever call inside effects. */
export function mulberry32(seed) {
  let a = seed >>> 0;
  return function rand() {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function prefersReducedMotion() {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia(RM_QUERY).matches;
}

function listenMQ(mq, fn) {
  if (mq.addEventListener) mq.addEventListener("change", fn);
  else mq.addListener(fn);
  return () => {
    if (mq.removeEventListener) mq.removeEventListener("change", fn);
    else mq.removeListener(fn);
  };
}

/**
 * Reduced-motion preference. Only use the value inside effects or for
 * behaviour, never to change server-rendered markup.
 */
export function useReducedMotion() {
  const [rm, setRm] = useState(() => prefersReducedMotion());
  useEffect(() => {
    const mq = window.matchMedia(RM_QUERY);
    const on = () => setRm(mq.matches);
    on();
    return listenMQ(mq, on);
  }, []);
  return rm;
}

/* ------------------------------------------------------------------ */
/* Shared observers                                                     */
/* ------------------------------------------------------------------ */

const observers = new Map(); // rootMargin -> { io, subs: Map<el, Set<cb>> }

/** Observe an element's intersection; cb(isIntersecting). Returns unsubscribe. */
export function observe(el, cb, rootMargin = "120px 0px") {
  if (!el || typeof IntersectionObserver === "undefined") {
    cb(true);
    return () => {};
  }
  let rec = observers.get(rootMargin);
  if (!rec) {
    const subs = new Map();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const set = subs.get(e.target);
          if (set) set.forEach((f) => f(e.isIntersecting, e));
        }
      },
      { rootMargin, threshold: 0 }
    );
    rec = { io, subs };
    observers.set(rootMargin, rec);
  }
  let set = rec.subs.get(el);
  if (!set) {
    set = new Set();
    rec.subs.set(el, set);
    rec.io.observe(el);
  }
  set.add(cb);
  return () => {
    const s = rec.subs.get(el);
    if (!s) return;
    s.delete(cb);
    if (!s.size) {
      rec.subs.delete(el);
      rec.io.unobserve(el);
    }
  };
}

let visInit = false;
const visSubs = new Set();
/** Subscribe to page visibility (pause registry). Returns unsubscribe. */
export function onVisibility(cb) {
  if (!visInit && typeof document !== "undefined") {
    visInit = true;
    document.addEventListener("visibilitychange", () => {
      const v = !document.hidden;
      visSubs.forEach((f) => f(v));
    });
  }
  visSubs.add(cb);
  return () => visSubs.delete(cb);
}

/**
 * Calls onChange(true) when the element is in view AND the tab is visible,
 * onChange(false) when either stops being true. Returns dispose.
 */
export function watchActive(el, onChange, rootMargin = "120px 0px") {
  let inView = false;
  let vis = typeof document === "undefined" ? true : !document.hidden;
  let cur = false;
  const upd = () => {
    const n = inView && vis;
    if (n !== cur) {
      cur = n;
      onChange(n);
    }
  };
  const u1 = observe(el, (v) => {
    inView = v;
    upd();
  }, rootMargin);
  const u2 = onVisibility((v) => {
    vis = v;
    upd();
  });
  return () => {
    u1();
    u2();
    if (cur) {
      cur = false;
      onChange(false);
    }
  };
}

/** React wrapper around watchActive. State only changes on enter/leave. */
export function useInView(ref, opts = {}) {
  const { rootMargin = "120px 0px" } = opts;
  const [active, setActive] = useState(false);
  useEffect(() => {
    if (!ref.current) return undefined;
    return watchActive(ref.current, setActive, rootMargin);
  }, [ref, rootMargin]);
  return active;
}

/** Subscribe to the engine's per-element progress events. */
export function onProgress(el, cb) {
  if (!el) return () => {};
  const h = (e) => cb(e.detail);
  el.addEventListener("ak:progress", h);
  return () => el.removeEventListener("ak:progress", h);
}

/* ------------------------------------------------------------------ */
/* The engine (call once, in page.js)                                   */
/* ------------------------------------------------------------------ */

export function useStoryEngine() {
  useEffect(() => {
    const root = document.documentElement;
    const cleanups = [];

    /* 1. Motion gating */
    const mq = window.matchMedia(RM_QUERY);
    const applyMotion = () => root.classList.toggle("ak-motion", !mq.matches);
    applyMotion();
    cleanups.push(listenMQ(mq, applyMotion));

    /* 2. Reveal observer */
    let revealIO = null;
    const revealEls = Array.from(document.querySelectorAll("[data-reveal]"));
    if (typeof IntersectionObserver !== "undefined") {
      revealIO = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) {
              e.target.classList.add("is-in");
              revealIO.unobserve(e.target);
            }
          }
        },
        { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
      );
      revealEls.forEach((el) => revealIO.observe(el));
      cleanups.push(() => revealIO.disconnect());
    } else {
      revealEls.forEach((el) => el.classList.add("is-in"));
    }

    /* 3. Scroll progress */
    const items = Array.from(document.querySelectorAll("[data-progress]")).map((el) => {
      const parts = (el.getAttribute("data-progress") || "").split(",").map(Number);
      const a = Number.isFinite(parts[0]) ? parts[0] : 0.9;
      const b = Number.isFinite(parts[1]) ? parts[1] : 0.1;
      return { el, a, b, p: -1 };
    });
    let raf = 0;
    let lastPage = -1;
    // The page progress bar is the only consumer of page progress. Writing an
    // inherited custom property on <html> every frame would restyle the whole
    // document, so the bar's transform is written directly instead.
    const progressBar = document.querySelector(".ak-progress");
    const frame = () => {
      raf = 0;
      const vh = window.innerHeight || 1;
      // read phase
      const rects = items.map((o) => o.el.getBoundingClientRect());
      const max = root.scrollHeight - vh;
      const pageP = max > 0 ? clamp01(window.scrollY / max) : 0;
      // write phase
      items.forEach((o, i) => {
        const r = rects[i];
        const denom = r.height + vh * (o.a - o.b);
        const p = denom > 0 ? clamp01((vh * o.a - r.top) / denom) : r.top < vh * o.a ? 1 : 0;
        if (Math.abs(p - o.p) > 0.0004) {
          o.p = p;
          o.el.style.setProperty("--p", p.toFixed(4));
          o.el.dispatchEvent(new CustomEvent("ak:progress", { detail: p }));
        }
      });
      if (Math.abs(pageP - lastPage) > 0.0004) {
        lastPage = pageP;
        if (progressBar) progressBar.style.transform = `scaleX(${pageP.toFixed(4)})`;
      }
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    frame();
    cleanups.push(() => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (raf) cancelAnimationFrame(raf);
    });

    /* 4. Surface / chapter observer */
    const chapters = Array.from(document.querySelectorAll("main section[data-surface]"));
    if (typeof IntersectionObserver !== "undefined" && chapters.length) {
      const sio = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (!e.isIntersecting) continue;
            const s = e.target.getAttribute("data-surface");
            const id = e.target.id;
            root.setAttribute("data-surface", s);
            if (root.getAttribute("data-chapter") !== id) {
              root.setAttribute("data-chapter", id);
              window.dispatchEvent(new CustomEvent("ak:chapter", { detail: id }));
            }
          }
        },
        { rootMargin: "-50% 0px -50% 0px", threshold: 0 }
      );
      chapters.forEach((c) => sio.observe(c));
      cleanups.push(() => sio.disconnect());

      // Surface directly under the sticky header (top strip of the viewport).
      const hio = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) root.setAttribute("data-head-surface", e.target.getAttribute("data-surface"));
          }
        },
        { rootMargin: "0px 0px -92% 0px", threshold: 0 }
      );
      chapters.forEach((c) => hio.observe(c));
      cleanups.push(() => hio.disconnect());
    }

    /* 4b. Pause CSS loops (carets, breathing pills, scroll cue) offscreen */
    document.querySelectorAll("[data-pause-offscreen]").forEach((el) => {
      el.setAttribute("data-paused", "");
      cleanups.push(
        watchActive(el, (v) => {
          if (v) el.removeAttribute("data-paused");
          else el.setAttribute("data-paused", "");
        }, "0px")
      );
    });

    /* 5. Scoped pointer spotlight + tilt (fine pointers only) */
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (fine.matches) {
      document.querySelectorAll(".ak-spot").forEach((el) => {
        let fr = 0;
        let ev = null;
        const write = () => {
          fr = 0;
          if (!ev) return;
          const r = el.getBoundingClientRect();
          const x = ev.clientX - r.left;
          const y = ev.clientY - r.top;
          el.style.setProperty("--sx", `${x.toFixed(0)}px`);
          el.style.setProperty("--sy", `${y.toFixed(0)}px`);
          el.style.setProperty("--tx", (x / r.width - 0.5).toFixed(3));
          el.style.setProperty("--ty", (y / r.height - 0.5).toFixed(3));
        };
        const move = (e) => {
          ev = e;
          if (!fr) fr = requestAnimationFrame(write);
        };
        const leave = () => {
          ev = null;
          el.style.setProperty("--tx", "0");
          el.style.setProperty("--ty", "0");
          el.style.setProperty("--sx", "-999px");
          el.style.setProperty("--sy", "-999px");
        };
        el.addEventListener("pointermove", move);
        el.addEventListener("pointerleave", leave);
        cleanups.push(() => {
          el.removeEventListener("pointermove", move);
          el.removeEventListener("pointerleave", leave);
          if (fr) cancelAnimationFrame(fr);
        });
      });
    }

    return () => cleanups.forEach((f) => f());
  }, []);
}
