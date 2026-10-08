"use client";

import { useEffect, useRef } from "react";
import { mulberry32, onProgress, prefersReducedMotion, watchActive } from "./useStoryEngine";

const GLYPHS = "0123456789.,-()";
const CELL_W = 28;
const CELL_H = 22;
const GW = 9; // glyph box in css px
const GH = 14;

const smooth = (x) => {
  const t = x < 0 ? 0 : x > 1 ? 1 : x;
  return t * t * (3 - 2 * t);
};

/**
 * Hero canvas: a grey field of drifting ledger glyphs that settles into an
 * ordered grid as the visitor scrolls through the hook. Decorative only.
 */
export default function EntropyField() {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return undefined;
    const ctx = canvas.getContext("2d");
    if (!ctx) return undefined;
    const section = wrap.closest("[data-progress]") || wrap.parentElement;

    let disposed = false;
    let reduced = prefersReducedMotion();
    let w = 0;
    let h = 0;
    let dpr = 1;
    let parts = [];
    let atlas = null;
    let atlasOwned = null;
    let e = reduced ? 1 : 0;
    let raf = 0;
    let running = false;
    let active = false;
    let last = 0;
    let started = false;
    let rand = mulberry32(2015);

    const buildAtlas = () => {
      atlas = document.createElement("canvas");
      atlas.width = Math.ceil(GW * GLYPHS.length * dpr);
      atlas.height = Math.ceil(GH * dpr);
      const a = atlas.getContext("2d");
      a.scale(dpr, dpr);
      a.font = '11px ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace';
      a.textBaseline = "middle";
      a.textAlign = "center";
      a.fillStyle = "#8f8b8a";
      for (let i = 0; i < GLYPHS.length; i++) a.fillText(GLYPHS[i], i * GW + GW / 2, GH / 2 + 0.5);
      // Second atlas in signal green: only appears as the field settles into
      // order (chaos stays grey; green means owned).
      atlasOwned = document.createElement("canvas");
      atlasOwned.width = atlas.width;
      atlasOwned.height = atlas.height;
      const b = atlasOwned.getContext("2d");
      b.scale(dpr, dpr);
      b.font = a.font;
      b.textBaseline = "middle";
      b.textAlign = "center";
      b.fillStyle = "#6bc145";
      for (let i = 0; i < GLYPHS.length; i++) b.fillText(GLYPHS[i], i * GW + GW / 2, GH / 2 + 0.5);
    };

    const init = () => {
      const r = wrap.getBoundingClientRect();
      w = Math.max(1, Math.round(r.width));
      h = Math.max(1, Math.round(r.height));
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      buildAtlas();
      rand = mulberry32(2015);
      const n = w < 700 ? 220 : Math.round(Math.min(650, Math.max(180, (w * h) / 2600)));
      const cols = Math.max(1, Math.floor((w - 8) / CELL_W));
      const rows = Math.max(1, Math.floor((h - 8) / CELL_H));
      const ox = (w - cols * CELL_W) / 2;
      const oy = (h - rows * CELL_H) / 2;
      const cells = [];
      for (let i = 0; i < cols * rows; i++) cells.push(i);
      for (let i = cells.length - 1; i > 0; i--) {
        const j = Math.floor(rand() * (i + 1));
        const t = cells[i];
        cells[i] = cells[j];
        cells[j] = t;
      }
      const chosen = cells.slice(0, Math.min(n, cells.length)).sort((a, b) => a - b);
      parts = chosen.map((c) => ({
        x: rand() * w,
        y: rand() * h,
        g: Math.floor(rand() * GLYPHS.length),
        a: 0.1 + rand() * 0.24,
        own: rand() < 0.14,
        tx: ox + (c % cols) * CELL_W + (CELL_W - GW) / 2,
        ty: oy + Math.floor(c / cols) * CELL_H + (CELL_H - GH) / 2,
      }));
    };

    const draw = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const sw = GW * dpr;
      const sh = GH * dpr;
      for (let i = 0; i < parts.length; i++) {
        const p = parts[i];
        const x = p.x + (p.tx - p.x) * e;
        const y = p.y + (p.ty - p.y) * e;
        if (p.own && e > 0.6) {
          const k = (e - 0.6) / 0.4;
          ctx.globalAlpha = (p.a + (0.3 - p.a) * e) * (1 - k);
          ctx.drawImage(atlas, p.g * sw, 0, sw, sh, x, y, GW, GH);
          ctx.globalAlpha = 0.6 * k;
          ctx.drawImage(atlasOwned, p.g * sw, 0, sw, sh, x, y, GW, GH);
        } else {
          ctx.globalAlpha = p.a + (0.3 - p.a) * e;
          ctx.drawImage(atlas, p.g * sw, 0, sw, sh, x, y, GW, GH);
        }
      }
      ctx.globalAlpha = 1;
    };

    const frame = (now) => {
      raf = 0;
      if (!running) return;
      const dt = last ? Math.min(64, now - last) : 16.7;
      last = now;
      const k = dt / 16.67;
      const flick = parts.length * 0.02 * (dt / 1000) * (1 - e);
      for (let i = 0; i < parts.length; i++) {
        const p = parts[i];
        p.x += Math.cos(now * 0.0002 + p.y * 0.004) * 0.15 * k;
        p.y += Math.sin(now * 0.00025 + p.x * 0.003) * 0.12 * k;
        if (p.x < -GW) p.x += w + GW;
        else if (p.x > w) p.x -= w + GW;
        if (p.y < -GH) p.y += h + GH;
        else if (p.y > h) p.y -= h + GH;
      }
      let swaps = Math.floor(flick) + (rand() < flick % 1 ? 1 : 0);
      while (swaps-- > 0) {
        const p = parts[Math.floor(rand() * parts.length)];
        if (p) p.g = Math.floor(rand() * GLYPHS.length);
      }
      draw();
      // Fully settled: every frame would be identical, so idle until the
      // visitor scrolls back up (onProgress restarts the loop).
      if (e >= 0.999) {
        running = false;
        return;
      }
      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (running || reduced || !started) return;
      running = true;
      last = 0;
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };

    const boot = () => {
      if (disposed) return;
      started = true;
      init();
      draw();
      canvas.classList.add("is-on");
      if (active) start();
    };

    const idle = window.requestIdleCallback
      ? window.requestIdleCallback(boot, { timeout: 600 })
      : window.setTimeout(boot, 0);

    const offProgress = onProgress(section, (p) => {
      if (reduced) return;
      e = smooth(p * 1.25);
      if (!running && started) {
        draw();
        if (active && e < 0.999) start();
      }
    });

    const offActive = watchActive(section, (v) => {
      active = v;
      if (v) start();
      else stop();
    }, "0px");

    let rfr = 0;
    const ro =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => {
            if (rfr || !started) return;
            rfr = requestAnimationFrame(() => {
              rfr = 0;
              const r = wrap.getBoundingClientRect();
              if (Math.round(r.width) === w && Math.round(r.height) === h) return;
              init();
              draw();
            });
          })
        : null;
    if (ro) ro.observe(wrap);

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMQ = () => {
      reduced = mq.matches;
      if (reduced) {
        stop();
        e = 1;
        if (started) draw();
      } else if (active) start();
    };
    if (mq.addEventListener) mq.addEventListener("change", onMQ);

    return () => {
      disposed = true;
      stop();
      if (window.cancelIdleCallback && window.requestIdleCallback) window.cancelIdleCallback(idle);
      else window.clearTimeout(idle);
      offProgress();
      offActive();
      if (ro) ro.disconnect();
      if (rfr) cancelAnimationFrame(rfr);
      if (mq.removeEventListener) mq.removeEventListener("change", onMQ);
    };
  }, []);

  return (
    <div className="ak-entropy" ref={wrapRef} aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  );
}
