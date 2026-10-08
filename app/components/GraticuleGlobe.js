"use client";

import { useEffect, useRef } from "react";
import { RM_QUERY, prefersReducedMotion, watchActive } from "./useStoryEngine";

const RAD = Math.PI / 180;
const PHI0 = 10 * RAD;
// Coordinate ticks around the Asia-Pacific band: a precise region cue without
// land, pins or cities.
const MERIDIAN_TICKS = [
  [120, "120°E"],
  [150, "150°E"],
];
const PARALLEL_TICKS = [
  [30, "30°N"],
  [0, "EQ"],
  [-30, "30°S"],
];

/**
 * Chapter 04: an orthographic wireframe globe that sways gently around
 * Asia-Pacific. Graticule only: no land, pins, cities, arcs or offices.
 */
export default function GraticuleGlobe() {
  const boxRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const box = boxRef.current;
    const canvas = canvasRef.current;
    if (!box || !canvas) return undefined;
    const ctx = canvas.getContext("2d");
    if (!ctx) return undefined;

    let size = 0;
    let dpr = 1;
    let raf = 0;
    let running = false;
    let lastDraw = 0;
    let reduced = prefersReducedMotion();
    let t0 = 0;
    let elapsed = 0;

    const sinP0 = Math.sin(PHI0);
    const cosP0 = Math.cos(PHI0);

    const resize = () => {
      const r = box.getBoundingClientRect();
      size = Math.max(1, Math.round(Math.min(r.width, r.height)));
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(size * dpr);
      canvas.height = Math.round(size * dpr);
      canvas.style.width = `${size}px`;
      canvas.style.height = `${size}px`;
    };

    const draw = (lam0deg) => {
      const lam0 = lam0deg * RAD;
      const R = size / 2 - 6;
      const cx = size / 2;
      const cy = size / 2;
      const proj = (lamDeg, phiDeg) => {
        const l = lamDeg * RAD - lam0;
        const p = phiDeg * RAD;
        const cosp = Math.cos(p);
        const sinp = Math.sin(p);
        const cosl = Math.cos(l);
        const vis = sinP0 * sinp + cosP0 * cosp * cosl;
        return [cx + R * cosp * Math.sin(l), cy - R * (cosP0 * sinp - sinP0 * cosp * cosl), vis];
      };
      const inBand = (lam, phi) => lam >= 95 && lam <= 180 && phi >= -50 && phi <= 55;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, size, size);

      // band polygon (hatch fill)
      const poly = [];
      for (let l = 95; l <= 180; l += 3) poly.push([l, 55]);
      for (let p = 55; p >= -50; p -= 3) poly.push([180, p]);
      for (let l = 180; l >= 95; l -= 3) poly.push([l, -50]);
      for (let p = -50; p <= 55; p += 3) poly.push([95, p]);
      ctx.save();
      ctx.beginPath();
      poly.forEach(([l, p], i) => {
        let [x, y, v] = proj(l, p);
        if (v < 0) {
          // pin back-facing vertices to the limb
          const dx = x - cx;
          const dy = y - cy;
          const m = Math.hypot(dx, dy) || 1;
          x = cx + (dx / m) * R;
          y = cy + (dy / m) * R;
        }
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.closePath();
      ctx.clip();
      ctx.strokeStyle = "rgba(19,98,7,.10)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let k = -size; k < size * 2; k += 6) {
        ctx.moveTo(k, 0);
        ctx.lineTo(k + size, size);
      }
      ctx.stroke();
      ctx.restore();

      // graticule
      const seg = (green) => {
        ctx.strokeStyle = green ? "rgba(19,98,7,.62)" : "rgba(32,30,29,.26)";
        ctx.lineWidth = 1;
      };
      const strokeLine = (samples) => {
        // samples: [lam, phi]
        for (const green of [false, true]) {
          seg(green);
          ctx.beginPath();
          let pen = false;
          for (let i = 0; i < samples.length - 1; i++) {
            const [l1, p1] = samples[i];
            const [l2, p2] = samples[i + 1];
            const a = proj(l1, p1);
            const b = proj(l2, p2);
            const g = inBand((l1 + l2) / 2, (p1 + p2) / 2);
            if (a[2] > 0 && b[2] > 0 && g === green) {
              if (!pen) {
                ctx.moveTo(a[0], a[1]);
                pen = true;
              }
              ctx.lineTo(b[0], b[1]);
            } else pen = false;
          }
          ctx.stroke();
        }
      };
      for (let p = -75; p <= 75; p += 15) {
        const s = [];
        for (let l = -180; l <= 180; l += 3) s.push([l, p]);
        strokeLine(s);
      }
      for (let l = -180; l < 180; l += 15) {
        const s = [];
        for (let p = -90; p <= 90; p += 3) s.push([l, p]);
        strokeLine(s);
      }
      // limb
      ctx.strokeStyle = "rgba(32,30,29,.4)";
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.stroke();

      // coordinate ticks on the band edges
      const fs = size < 300 ? 9 : 10;
      ctx.font = `500 ${fs}px ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace`;
      ctx.textBaseline = "middle";
      const label = (lam, phi, text, align, dx, dy) => {
        const [x, y, v] = proj(lam, phi);
        if (v < 0.2) return;
        ctx.globalAlpha = Math.min(1, (v - 0.2) / 0.25);
        ctx.fillStyle = "rgba(19,98,7,.9)";
        ctx.fillRect(x - 1.5, y - 1.5, 3, 3);
        ctx.fillStyle = "#605d5d";
        ctx.textAlign = align;
        ctx.fillText(text, x + dx, y + dy);
        ctx.globalAlpha = 1;
      };
      for (const [phi, t] of PARALLEL_TICKS) label(95, phi, t, "left", 6, 0);
      for (const [lam, t] of MERIDIAN_TICKS) label(lam, -50, t, "center", 0, fs + 2);
    };

    const lamAt = (ms) => 135 + 25 * Math.sin((2 * Math.PI * ms) / 18000);

    const frame = (now) => {
      raf = 0;
      if (!running) return;
      if (!t0) t0 = now - elapsed;
      if (now - lastDraw >= 33) {
        lastDraw = now;
        elapsed = now - t0;
        draw(lamAt(elapsed));
      }
      raf = requestAnimationFrame(frame);
    };
    const start = () => {
      if (running || reduced) return;
      running = true;
      t0 = 0;
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };

    resize();
    draw(reduced ? 135 : lamAt(0));

    let rfr = 0;
    const ro =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => {
            if (rfr) return;
            rfr = requestAnimationFrame(() => {
              rfr = 0;
              resize();
              draw(reduced ? 135 : lamAt(elapsed));
            });
          })
        : null;
    if (ro) ro.observe(box);

    let active = false;
    const off = watchActive(box, (v) => {
      active = v;
      if (v) start();
      else stop();
    }, "0px");

    // Follow reduced-motion changes made while the page is open.
    const mq = window.matchMedia(RM_QUERY);
    const onMQ = () => {
      reduced = mq.matches;
      if (reduced) {
        stop();
        draw(135);
      } else if (active) start();
    };
    if (mq.addEventListener) mq.addEventListener("change", onMQ);

    return () => {
      stop();
      off();
      if (mq.removeEventListener) mq.removeEventListener("change", onMQ);
      if (ro) ro.disconnect();
      if (rfr) cancelAnimationFrame(rfr);
    };
  }, []);

  return (
    <div className="ak-globe" aria-hidden="true">
      <div className="ak-globe-box" ref={boxRef}>
        <canvas ref={canvasRef} />
      </div>
      <span className="ak-globe-label">Asia-Pacific</span>
    </div>
  );
}
