"use client";

import { useEffect, useRef } from "react";
import { LAND_ROWS } from "./landDots";
import { RM_QUERY, prefersReducedMotion, watchActive } from "./useStoryEngine";

const RAD = Math.PI / 180;
// View centre: 10°N, swaying between ~102°E and ~142°E so the whole region,
// from India to New Zealand, stays on the visible face.
const PHI0 = 10 * RAD;
const LAM_MID = 122;
const LAM_SWAY = 20;
const SWAY_MS = 20000;
// A slow scan meridian passes over the Asia-Pacific longitudes.
const SCAN_FROM = 62;
const SCAN_TO = 192;
const SCAN_MS = 7000;
const SCAN_HALF = 3; // degrees either side of the scan line that light up
const DEPTH_BANDS = 4;

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
    const sinP0 = Math.sin(PHI0);
    const cosP0 = Math.cos(PHI0);

    let size = 0;
    let dpr = 1;
    let raf = 0;
    let running = false;
    let lastDraw = 0;
    let reduced = prefersReducedMotion();
    let t0 = 0;
    let elapsed = 0;

    const resize = () => {
      const r = box.getBoundingClientRect();
      size = Math.max(1, Math.round(Math.min(r.width, r.height)));
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(size * dpr);
      canvas.height = Math.round(size * dpr);
      canvas.style.width = `${size}px`;
      canvas.style.height = `${size}px`;
    };

    const draw = (lam0deg, scanDeg) => {
      const R = size / 2 - 4;
      const cx = size / 2;
      const cy = size / 2;
      const dotR = Math.max(1.1, size / 175);

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, size, size);

      // sphere body: soft light from the upper left
      const body = ctx.createRadialGradient(cx - R * 0.35, cy - R * 0.4, R * 0.1, cx, cy, R);
      body.addColorStop(0, "rgba(255,255,255,.75)");
      body.addColorStop(0.7, "rgba(255,255,255,.18)");
      body.addColorStop(1, "rgba(32,30,29,.07)");
      ctx.fillStyle = body;
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fill();

      const lam0 = lam0deg * RAD;
      const proj = (lamDeg, phiDeg) => {
        const l = lamDeg * RAD - lam0;
        const p = phiDeg * RAD;
        const cosp = Math.cos(p);
        const sinp = Math.sin(p);
        const cosl = Math.cos(l);
        return [
          cx + R * cosp * Math.sin(l),
          cy - R * (cosP0 * sinp - sinP0 * cosp * cosl),
          sinP0 * sinp + cosP0 * cosp * cosl,
        ];
      };

      // faint 30° graticule on the visible face
      ctx.strokeStyle = "rgba(32,30,29,.08)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      const traceLine = (samples) => {
        let pen = false;
        for (const [l, p] of samples) {
          const [x, y, v] = proj(l, p);
          if (v > 0) {
            if (pen) ctx.lineTo(x, y);
            else ctx.moveTo(x, y);
            pen = true;
          } else pen = false;
        }
      };
      for (let p = -60; p <= 60; p += 30) {
        const s = [];
        for (let l = -180; l <= 180; l += 4) s.push([l, p]);
        traceLine(s);
      }
      for (let l = -180; l < 180; l += 30) {
        const s = [];
        for (let p = -88; p <= 88; p += 4) s.push([l, p]);
        traceLine(s);
      }
      ctx.stroke();

      // scan meridian
      if (scanDeg !== null) {
        const s = [];
        for (let p = -70; p <= 70; p += 3) s.push([scanDeg, p]);
        ctx.strokeStyle = "rgba(74,156,48,.45)";
        ctx.beginPath();
        traceLine(s);
        ctx.stroke();
      }

      // land dots, batched by colour and depth band
      const paths = [];
      for (let b = 0; b < DEPTH_BANDS * 2 + 1; b++) paths.push([]);
      const { count, lon, sinLat, cosLat, apac } = dots;
      for (let i = 0; i < count; i++) {
        const l = (lon[i] - lam0deg) * RAD;
        const cosl = Math.cos(l);
        const v = sinP0 * sinLat[i] + cosP0 * cosLat[i] * cosl;
        if (v <= 0.02) continue;
        const x = cx + R * cosLat[i] * Math.sin(l);
        const y = cy - R * (cosP0 * sinLat[i] - sinP0 * cosLat[i] * cosl);
        const band = Math.min(DEPTH_BANDS - 1, Math.floor(v * DEPTH_BANDS));
        let slot = apac[i] ? DEPTH_BANDS + band : band;
        if (apac[i] && scanDeg !== null) {
          let d = Math.abs(lon[i] - scanDeg);
          if (d > 180) d = 360 - d;
          if (d < SCAN_HALF) slot = DEPTH_BANDS * 2;
        }
        paths[slot].push(x, y, 0.45 + 0.55 * v);
      }
      for (let slot = 0; slot < paths.length; slot++) {
        const pts = paths[slot];
        if (!pts.length) continue;
        const scan = slot === DEPTH_BANDS * 2;
        const isApac = slot >= DEPTH_BANDS;
        const depth = ((slot % DEPTH_BANDS) + 0.5) / DEPTH_BANDS;
        if (scan) ctx.fillStyle = "rgba(74,156,48,.95)";
        else if (isApac) ctx.fillStyle = `rgba(19,98,7,${(0.45 + 0.5 * depth).toFixed(3)})`;
        else ctx.fillStyle = `rgba(32,30,29,${(0.12 + 0.16 * depth).toFixed(3)})`;
        const grow = scan ? 1.2 : 1;
        ctx.beginPath();
        for (let j = 0; j < pts.length; j += 3) {
          const r = dotR * pts[j + 2] * grow;
          ctx.moveTo(pts[j] + r, pts[j + 1]);
          ctx.arc(pts[j], pts[j + 1], r, 0, Math.PI * 2);
        }
        ctx.fill();
      }

      // limb
      ctx.strokeStyle = "rgba(32,30,29,.28)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.stroke();
    };

    const lamAt = (ms) => LAM_MID + LAM_SWAY * Math.sin((2 * Math.PI * ms) / SWAY_MS);
    const scanAt = (ms) => SCAN_FROM + (SCAN_TO - SCAN_FROM) * ((ms % SCAN_MS) / SCAN_MS);
    const drawStatic = () => draw(LAM_MID, null);

    const frame = (now) => {
      raf = 0;
      if (!running) return;
      if (!t0) t0 = now - elapsed;
      if (now - lastDraw >= 33) {
        lastDraw = now;
        elapsed = now - t0;
        draw(lamAt(elapsed), scanAt(elapsed));
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
    else draw(lamAt(0), scanAt(0));

    let rfr = 0;
    const ro =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => {
            if (rfr) return;
            rfr = requestAnimationFrame(() => {
              rfr = 0;
              resize();
              if (reduced) drawStatic();
              else draw(lamAt(elapsed), scanAt(elapsed));
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
