"use client";

import { useEffect, useRef } from "react";
import { LAND_ROWS } from "./landDots";
import { RM_QUERY, prefersReducedMotion, watchActive } from "./useStoryEngine";

const RAD = Math.PI / 180;
// View centre: 3°N (midway between northern China and New Zealand), swaying
// between ~112°E and ~140°E so the whole region stays on the visible face.
const PHI0 = 3 * RAD;
const LAM_MID = 126;
const LAM_SWAY = 14;
const SWAY_MS = 20000;
// A slow scan meridian passes over the Asia-Pacific longitudes, fading in and
// out at either end of each sweep.
const SCAN_FROM = 62;
const SCAN_TO = 182;
const SCAN_MS = 7000;
const SCAN_HALF = 2; // degrees either side of the scan line that light up
const SCAN_FADE = 0.12; // share of each sweep spent fading in / out
const FRAME_MS = 50; // ~20 redraws a second is smooth for this slow motion
const DEPTH_BANDS = 4;
const SCAN_SLOT = DEPTH_BANDS * 2;
const PAPER = "#f3f2f2";

// Decode the run-length rows once: per dot longitude (deg), sin/cos latitude
// and whether it belongs to Asia-Pacific.
function decodeDots() {
  let count = 0;
  for (const row of LAND_ROWS) for (let i = 2; i < row.length; i += 3) count += row[i + 1];
  const lon = new Float32Array(count);
  const sinLat = new Float32Array(count);
  const cosLat = new Float32Array(count);
  const apac = new Uint8Array(count);
  let n = 0;
  for (const row of LAND_ROWS) {
    const lat = (-90 + 0.75 + 1.5 * row[0]) * RAD;
    const perRow = row[1];
    const s = Math.sin(lat);
    const c = Math.cos(lat);
    for (let i = 2; i < row.length; i += 3) {
      const k0 = row[i];
      const len = row[i + 1];
      const f = row[i + 2];
      for (let k = k0; k < k0 + len; k++) {
        lon[n] = -180 + ((k + 0.5) * 360) / perRow;
        sinLat[n] = s;
        cosLat[n] = c;
        apac[n] = f;
        n++;
      }
    }
  }
  return { count, lon, sinLat, cosLat, apac };
}

// Graticule polylines (every 30°) as flat [lon, lat, lon, lat, ...] arrays.
function graticule() {
  const lines = [];
  for (let p = -60; p <= 60; p += 30) {
    const s = [];
    for (let l = -180; l <= 180; l += 4) s.push(l, p);
    lines.push(Float32Array.from(s));
  }
  for (let l = -180; l < 180; l += 30) {
    const s = [];
    for (let p = -88; p <= 88; p += 4) s.push(l, p);
    lines.push(Float32Array.from(s));
  }
  return lines;
}

const SCAN_LINE = (() => {
  const s = [];
  for (let p = -70; p <= 70; p += 3) s.push(0, p);
  return Float32Array.from(s);
})();

/**
 * Chapter 04: an orthographic dot-matrix globe of the Asia-Pacific region.
 * Land is sampled from Natural Earth on an equal-area grid; Asia-Pacific
 * countries are drawn in brand green, the rest of the world in faint grey.
 * No pins, cities or offices.
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

    const dots = decodeDots();
    const lines = graticule();
    const sinP0 = Math.sin(PHI0);
    const cosP0 = Math.cos(PHI0);
    // One reusable [x, y, scale] buffer per colour/depth slot, sized to the
    // number of dots that can land in it.
    let apacCount = 0;
    for (let i = 0; i < dots.count; i++) apacCount += dots.apac[i];
    const bufs = Array.from(
      { length: SCAN_SLOT + 1 },
      (_, s) => new Float32Array((s < DEPTH_BANDS ? dots.count - apacCount : apacCount) * 3)
    );
    const lens = new Int32Array(SCAN_SLOT + 1);
    const base = document.createElement("canvas");
    const bctx = base.getContext("2d");

    let size = 0;
    let dpr = 1;
    let raf = 0;
    let running = false;
    let lastDraw = 0;
    let reduced = prefersReducedMotion();
    let t0 = 0;
    let elapsed = 0;

    // The sphere body and limb never move: render them once per size.
    const paintBase = () => {
      base.width = canvas.width;
      base.height = canvas.height;
      if (!bctx || size < 16) return;
      const R = size / 2 - 4;
      const c = size / 2;
      bctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      bctx.clearRect(0, 0, size, size);
      bctx.fillStyle = PAPER; // opaque, so the ruled page doesn't show through
      bctx.beginPath();
      bctx.arc(c, c, R, 0, Math.PI * 2);
      bctx.fill();
      const body = bctx.createRadialGradient(c - R * 0.35, c - R * 0.4, R * 0.1, c, c, R);
      body.addColorStop(0, "rgba(255,255,255,.85)");
      body.addColorStop(0.7, "rgba(255,255,255,.25)");
      body.addColorStop(1, "rgba(32,30,29,.07)");
      bctx.fillStyle = body;
      bctx.fill();
      bctx.strokeStyle = "rgba(32,30,29,.28)";
      bctx.lineWidth = 1;
      bctx.stroke();
    };

    const resize = () => {
      const r = box.getBoundingClientRect();
      size = Math.max(1, Math.round(Math.min(r.width, r.height)));
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(size * dpr);
      canvas.height = Math.round(size * dpr);
      canvas.style.width = `${size}px`;
      canvas.style.height = `${size}px`;
      paintBase();
    };

    // lam0deg: view centre longitude; scanDeg: scan longitude or null;
    // scanFade: 0..1 strength of the scan.
    const draw = (lam0deg, scanDeg, scanFade) => {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (size < 16) return;
      ctx.drawImage(base, 0, 0);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const R = size / 2 - 4;
      const cx = size / 2;
      const cy = size / 2;
      const dotR = Math.max(1.1, size / 175);
      const lam0 = lam0deg * RAD;

      // polyline on the visible face; lonOverride replaces every longitude
      const trace = (pts, lonOverride) => {
        let pen = false;
        for (let i = 0; i < pts.length; i += 2) {
          const l = (lonOverride === undefined ? pts[i] : lonOverride) * RAD - lam0;
          const p = pts[i + 1] * RAD;
          const cosp = Math.cos(p);
          const sinp = Math.sin(p);
          const cosl = Math.cos(l);
          if (sinP0 * sinp + cosP0 * cosp * cosl > 0) {
            const x = cx + R * cosp * Math.sin(l);
            const y = cy - R * (cosP0 * sinp - sinP0 * cosp * cosl);
            if (pen) ctx.lineTo(x, y);
            else ctx.moveTo(x, y);
            pen = true;
          } else pen = false;
        }
      };

      ctx.strokeStyle = "rgba(32,30,29,.08)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (const line of lines) trace(line);
      ctx.stroke();

      const scanning = scanDeg !== null && scanFade > 0;
      if (scanning) {
        ctx.strokeStyle = `rgba(74,156,48,${(0.45 * scanFade).toFixed(3)})`;
        ctx.beginPath();
        trace(SCAN_LINE, scanDeg);
        ctx.stroke();
      }

      // land dots, batched by colour and depth band
      lens.fill(0);
      const { count, lon, sinLat, cosLat, apac } = dots;
      const lit = scanning && scanFade > 0.3;
      for (let i = 0; i < count; i++) {
        const l = (lon[i] - lam0deg) * RAD;
        const cosl = Math.cos(l);
        const v = sinP0 * sinLat[i] + cosP0 * cosLat[i] * cosl;
        if (v <= 0.02) continue;
        const band = Math.min(DEPTH_BANDS - 1, Math.floor(v * DEPTH_BANDS));
        let slot;
        let scale;
        if (apac[i]) {
          // keep edge markets (New Zealand, Pakistan) legible near the limb
          slot = DEPTH_BANDS + band;
          scale = 0.7 + 0.3 * v;
          if (lit) {
            let d = Math.abs(lon[i] - scanDeg) % 360;
            if (d > 180) d = 360 - d;
            if (d < SCAN_HALF) slot = SCAN_SLOT;
          }
        } else {
          slot = band;
          scale = 0.45 + 0.55 * v;
        }
        const b = bufs[slot];
        const j = lens[slot];
        b[j] = cx + R * cosLat[i] * Math.sin(l);
        b[j + 1] = cy - R * (cosP0 * sinLat[i] - sinP0 * cosLat[i] * cosl);
        b[j + 2] = scale;
        lens[slot] = j + 3;
      }
      for (let slot = 0; slot <= SCAN_SLOT; slot++) {
        const n = lens[slot];
        if (!n) continue;
        const b = bufs[slot];
        const depth = ((slot % DEPTH_BANDS) + 0.5) / DEPTH_BANDS;
        let grow = 1;
        if (slot === SCAN_SLOT) {
          ctx.fillStyle = "rgba(74,156,48,.95)";
          grow = 1.15;
        } else if (slot >= DEPTH_BANDS) {
          ctx.fillStyle = `rgba(19,98,7,${(0.6 + 0.38 * depth).toFixed(3)})`;
        } else {
          ctx.fillStyle = `rgba(32,30,29,${(0.12 + 0.16 * depth).toFixed(3)})`;
        }
        ctx.beginPath();
        for (let j = 0; j < n; j += 3) {
          const r = dotR * b[j + 2] * grow;
          ctx.moveTo(b[j] + r, b[j + 1]);
          ctx.arc(b[j], b[j + 1], r, 0, Math.PI * 2);
        }
        ctx.fill();
      }
    };

    const lamAt = (ms) => LAM_MID + LAM_SWAY * Math.sin((2 * Math.PI * ms) / SWAY_MS);
    const drawAt = (ms) => {
      const p = (ms % SCAN_MS) / SCAN_MS;
      const fade = Math.max(0, Math.min(1, p / SCAN_FADE, (1 - p) / SCAN_FADE));
      draw(lamAt(ms), SCAN_FROM + (SCAN_TO - SCAN_FROM) * p, fade);
    };
    const drawStatic = () => draw(LAM_MID, null, 0);

    const frame = (now) => {
      raf = 0;
      if (!running) return;
      if (!t0) t0 = now - elapsed;
      if (now - lastDraw >= FRAME_MS) {
        lastDraw = now;
        elapsed = now - t0;
        drawAt(elapsed);
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
    if (reduced) drawStatic();
    else drawAt(0);

    let rfr = 0;
    const ro =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => {
            if (rfr) return;
            rfr = requestAnimationFrame(() => {
              rfr = 0;
              resize();
              if (reduced) drawStatic();
              else drawAt(elapsed);
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
        drawStatic();
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
