"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { mulberry32, useReducedMotion, watchActive } from "./useStoryEngine";

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export const CONSOLE_TABS = [
  { tab: "SAP S/4HANA", short: "S/4HANA", name: "SAP S/4HANA", sub: "Enterprise · multi-entity" },
  { tab: "Oracle NetSuite", short: "NetSuite", name: "Oracle NetSuite", sub: "Cloud · high-growth" },
  { tab: "Dynamics 365 BC", short: "Business Central", name: "Dynamics 365 Business Central", sub: "SME · mid-market" },
];

const SOURCES = ["Bank feeds", "Sales & billing", "Payroll", "Spreadsheets", "Legacy ledger"];
const OUTPUTS = ["Financial statements", "Tax filings", "Management reports", "Cash-flow forecast", "Audit schedules"];
const DEFAULT_STEPS = ["Implement", "Configure", "Migrate", "Train", "Health check", "Maintain"];
const MOBILE_MQ = "(max-width: 1023px)";

/* ---------- desktop geometry (viewBox 0 0 1100 380) ---------- */
const PILL_W = 170;
const PILL_H = 34;
const SRC_X = 40;
const OUT_X = 890;
const CORE = { x: 365, y: 90, w: 370, h: 200 };
const rowY = (k) => 40 + k * 66 + PILL_H / 2;
const portY = (k) => CORE.y + 30 + k * 35;

const cubic = (p0, p1, p2, p3, n = 64) => {
  const out = [];
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    const u = 1 - t;
    out.push([
      u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0],
      u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1],
    ]);
  }
  return out;
};

const IN_ROUTES = SOURCES.map((_, k) => {
  const a = [SRC_X + PILL_W, rowY(k)];
  const b = [CORE.x, portY(k)];
  const mx = (a[0] + b[0]) / 2;
  return { d: `M${a[0]},${a[1]} C${mx},${a[1]} ${mx},${b[1]} ${b[0]},${b[1]}`, pts: cubic(a, [mx, a[1]], [mx, b[1]], b) };
});
const OUT_ROUTES = OUTPUTS.map((_, k) => {
  const a = [CORE.x + CORE.w, portY(k)];
  const b = [OUT_X, rowY(k)];
  const mx = (a[0] + b[0]) / 2;
  return { d: `M${a[0]},${a[1]} C${mx},${a[1]} ${mx},${b[1]} ${b[0]},${b[1]}`, pts: cubic(a, [mx, a[1]], [mx, b[1]], b) };
});

/* ---------- mobile geometry (viewBox 0 0 360 540) ---------- */
const M_CHIP = { w: 165, h: 32 };
const M_SRC = [
  [10, 10],
  [185, 10],
  [10, 52],
  [185, 52],
  [97.5, 94],
];
const M_CORE = { x: 20, y: 170, w: 320, h: 196 };
const M_OUT_Y = 404;
const M_OUT = M_SRC.map(([x, y]) => [x, y + M_OUT_Y - 10]);
const M_LINES_X = [90, 180, 270];
const M_IN = M_LINES_X.map((x) => ({ x, y1: 134, y2: M_CORE.y }));
const M_OUTL = M_LINES_X.map((x) => ({ x, y1: M_CORE.y + M_CORE.h, y2: M_OUT_Y - 4 }));

function Pipeline({ x, y, w, rows, fontSize, steps }) {
  // rows: array of arrays of step indices
  return (
    <g className="ak-pipe">
      {rows.map((row, r) => (
        <text key={r} x={x + w / 2} y={y + r * (fontSize + 10)} textAnchor="middle" fontSize={fontSize} className="ak-pipe-row">
          {row.map((si, j) => (
            <tspan key={si}>
              <tspan className="ak-pipe-step" data-step={si}>
                {steps[si]}
              </tspan>
              {j < row.length - 1 ? <tspan className="ak-pipe-sep">{"\u00a0›\u00a0"}</tspan> : null}
            </tspan>
          ))}
        </text>
      ))}
    </g>
  );
}

function SegBar({ x, y, w, steps }) {
  const gap = 4;
  const n = steps.length;
  const sw = (w - gap * (n - 1)) / n;
  return (
    <g>
      {steps.map((s, i) => (
        <rect key={s} x={x + i * (sw + gap)} y={y} width={sw} height="3" rx="1.5" className="ak-pipe-seg" data-step={i} />
      ))}
    </g>
  );
}

function CoreLabels({ active, cx, nameY, subY, nameSize }) {
  return (
    <g>
      {CONSOLE_TABS.map((t, i) => (
        <g key={t.tab} className={`ak-core-swap${i === active ? " is-active" : ""}`}>
          <text x={cx} y={nameY} textAnchor="middle" className="ak-core-name" fontSize={Array.isArray(nameSize) ? nameSize[i] : nameSize}>
            {t.name}
          </text>
          <text x={cx} y={subY} textAnchor="middle" className="ak-core-sub">
            {t.sub}
          </text>
        </g>
      ))}
    </g>
  );
}

/** Chapter 04 focal piece: an illustrative ERP data-flow console. */
export default function ErpConsole({ active, onChange, steps = DEFAULT_STEPS }) {
  const STEPS = steps;
  const reduced = useReducedMotion();
  const rootRef = useRef(null);
  const tabsRef = useRef([]);
  const indRef = useRef(null);
  const stepRef = useRef({ reset: () => {} });

  /* sliding tab indicator */
  useIsoLayoutEffect(() => {
    const place = () => {
      const t = tabsRef.current[active];
      const ind = indRef.current;
      if (!t || !ind) return;
      ind.style.transform = `translateX(${t.offsetLeft}px) scaleX(${t.offsetWidth / 100})`;
    };
    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [active]);

  /* pipeline step highlight + packets */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const stepEls = Array.from(root.querySelectorAll("[data-step]"));
    let step = 0;
    const stepCount = STEPS.length;
    const paint = () => {
      stepEls.forEach((el) => {
        const s = Number(el.getAttribute("data-step"));
        el.classList.toggle("is-on", s === step);
        el.classList.toggle("is-done", s < step);
      });
    };
    stepRef.current.reset = () => {
      step = 0;
      paint();
    };
    if (reduced) {
      stepEls.forEach((el) => {
        el.classList.add("is-on");
        el.classList.remove("is-done");
      });
      stepRef.current.reset = () => {};
      return undefined;
    }
    paint();

    const mqMobile = window.matchMedia(MOBILE_MQ);
    const rand = mulberry32(42);
    const poolD = Array.from(root.querySelectorAll("[data-pkt-d]"));
    const poolM = Array.from(root.querySelectorAll("[data-pkt-m]"));
    let packets = [];
    let nextSpawn = [];
    let raf = 0;
    let running = false;
    let last = 0;
    let stepTimer = 0;
    let variant = "";

    const setup = () => {
      variant = mqMobile.matches ? "m" : "d";
      packets = [];
      [...poolD, ...poolM].forEach((r) => r.setAttribute("opacity", "0"));
      nextSpawn = (variant === "m" ? M_IN : IN_ROUTES).map((_, k) => k * 260);
    };

    const routePoint = (p) => {
      if (variant === "m") {
        const line = p.leg === 0 ? M_IN[p.route] : M_OUTL[p.route];
        return [line.x, line.y1 + (line.y2 - line.y1) * p.t];
      }
      const pts = (p.leg === 0 ? IN_ROUTES : OUT_ROUTES)[p.route].pts;
      const f = p.t * (pts.length - 1);
      const i = Math.min(pts.length - 2, Math.floor(f));
      const k = f - i;
      return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * k, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * k];
    };

    let clock = 0;
    const frame = (now) => {
      raf = 0;
      if (!running) return;
      const dt = last ? Math.min(64, now - last) : 16;
      last = now;
      clock += dt;
      const pool = variant === "m" ? poolM : poolD;
      const max = variant === "m" ? 8 : 18;
      const routes = variant === "m" ? M_IN : IN_ROUTES;
      const outs = variant === "m" ? M_OUTL : OUT_ROUTES;
      const legDur = variant === "m" ? 900 : 1500;

      // spawn
      for (let k = 0; k < routes.length; k++) {
        if (clock >= nextSpawn[k] && packets.length < max) {
          packets.push({ route: k, leg: 0, t: 0, wait: 0 });
          nextSpawn[k] = clock + 400 + rand() * 1600;
        }
      }
      // advance
      const keep = [];
      for (const p of packets) {
        if (p.wait > 0) {
          p.wait -= dt;
          keep.push(p);
          continue;
        }
        p.t += dt / legDur;
        if (p.t >= 1) {
          if (p.leg === 0) {
            p.leg = 1;
            p.t = 0;
            p.route = Math.floor(rand() * outs.length);
            p.wait = 240;
            keep.push(p);
          }
        } else keep.push(p);
      }
      packets = keep;
      // write
      for (let i = 0; i < pool.length; i++) {
        const r = pool[i];
        const p = packets[i];
        if (!p || p.wait > 0) {
          r.setAttribute("opacity", "0");
          continue;
        }
        const [x, y] = routePoint(p);
        r.setAttribute("x", (x - 2.5).toFixed(1));
        r.setAttribute("y", (y - 2.5).toFixed(1));
        const fade = p.t < 0.08 ? p.t / 0.08 : p.t > 0.92 ? (1 - p.t) / 0.08 : 1;
        r.setAttribute("opacity", fade.toFixed(2));
      }
      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (running) return;
      running = true;
      last = 0;
      raf = requestAnimationFrame(frame);
      stepTimer = window.setInterval(() => {
        step = (step + 1) % stepCount;
        paint();
      }, 1200);
    };
    const stop = () => {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      window.clearInterval(stepTimer);
    };

    setup();
    const onMQ = () => setup();
    if (mqMobile.addEventListener) mqMobile.addEventListener("change", onMQ);
    const off = watchActive(root, (v) => (v ? start() : stop()), "0px");
    return () => {
      stop();
      off();
      if (mqMobile.removeEventListener) mqMobile.removeEventListener("change", onMQ);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  useEffect(() => {
    stepRef.current.reset();
  }, [active]);

  const onKey = (e) => {
    const n = CONSOLE_TABS.length;
    let next = null;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (active + 1) % n;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = (active - 1 + n) % n;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = n - 1;
    if (next !== null) {
      e.preventDefault();
      onChange(next);
      const t = tabsRef.current[next];
      if (t) t.focus();
    }
  };

  const cur = CONSOLE_TABS[active] || CONSOLE_TABS[0];
  const label = `Illustrative schematic for ${cur.name} (${cur.sub.replace(" · ", ", ")}): data from bank feeds, sales and billing, payroll, spreadsheets and legacy ledgers flows into ${cur.name} and out to financial statements, tax filings, management reports, cash-flow forecasts and audit schedules. Services: ${STEPS.join(", ").toLowerCase()}.`;

  return (
    <div className="ak-console ak-spot" ref={rootRef} data-reveal="" data-pause-offscreen="">
      <div className="ak-console-bar">
        <div className="ak-tabs" role="tablist" aria-label="ERP platform">
          {CONSOLE_TABS.map((t, i) => (
            <button
              key={t.tab}
              type="button"
              role="tab"
              id={`ak-erp-tab-${i}`}
              aria-label={t.name}
              aria-selected={i === active}
              aria-controls="ak-erp-panel"
              tabIndex={i === active ? 0 : -1}
              className={`ak-tab${i === active ? " is-active" : ""}`}
              ref={(el) => (tabsRef.current[i] = el)}
              onClick={() => onChange(i)}
              onKeyDown={onKey}
            >
              <span className="ak-tab-full">{t.tab}</span>
              <span className="ak-tab-short" aria-hidden="true">
                {t.short}
              </span>
            </button>
          ))}
          <span className="ak-tab-ind" ref={indRef} aria-hidden="true" />
        </div>
        <span className="ak-console-dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
      </div>

      <div className="ak-console-body" id="ak-erp-panel" role="tabpanel" aria-labelledby={`ak-erp-tab-${active}`}>
        {/* desktop */}
        <svg viewBox="0 0 1100 380" className="ak-console-svg ak-console-svg--d" role="img" aria-label={label}>
          <g className="ak-routes">
            {IN_ROUTES.map((r, k) => (
              <path key={`i${k}`} d={r.d} />
            ))}
            {OUT_ROUTES.map((r, k) => (
              <path key={`o${k}`} d={r.d} />
            ))}
          </g>
          {SOURCES.map((s, k) => (
            <g key={s} className="ak-io">
              <rect x={SRC_X} y={40 + k * 66} width={PILL_W} height={PILL_H} rx="17" />
              <circle cx={SRC_X + 18} cy={rowY(k)} r="3" className="ak-io-dot" />
              <text x={SRC_X + 32} y={rowY(k) + 4}>
                {s}
              </text>
            </g>
          ))}
          {OUTPUTS.map((s, k) => (
            <g key={s} className="ak-io ak-io--out">
              <rect x={OUT_X} y={40 + k * 66} width={PILL_W + 30} height={PILL_H} rx="17" />
              <circle cx={OUT_X + 18} cy={rowY(k)} r="3" className="ak-io-dot" />
              <text x={OUT_X + 32} y={rowY(k) + 4}>
                {s}
              </text>
            </g>
          ))}
          <rect x={CORE.x} y={CORE.y} width={CORE.w} height={CORE.h} rx="8" className="ak-console-core" />
          {SOURCES.map((_, k) => (
            <g key={`p${k}`}>
              <rect x={CORE.x - 3} y={portY(k) - 3} width="6" height="6" className="ak-port" />
              <rect x={CORE.x + CORE.w - 3} y={portY(k) - 3} width="6" height="6" className="ak-port" />
            </g>
          ))}
          <text x={CORE.x + 18} y={CORE.y + 24} className="ak-core-tag">
            ERP · CORE
          </text>
          <CoreLabels active={active} cx={CORE.x + CORE.w / 2} nameY={CORE.y + 70} subY={CORE.y + 94} nameSize={[22, 22, 19]} />
          <line x1={CORE.x + 18} x2={CORE.x + CORE.w - 18} y1={CORE.y + 112} y2={CORE.y + 112} className="ak-core-div" />
          <Pipeline x={CORE.x} y={CORE.y + 138} w={CORE.w} rows={[[0, 1, 2], [3, 4, 5]]} fontSize={12.5} steps={STEPS} />
          <SegBar x={CORE.x + 18} y={CORE.y + 182} w={CORE.w - 36} steps={STEPS} />
          <g className="ak-pkts">
            {Array.from({ length: 18 }, (_, i) => (
              <rect key={i} width="5" height="5" x="-10" y="-10" opacity="0" data-pkt-d="" />
            ))}
          </g>
        </svg>

        {/* mobile */}
        <svg viewBox="0 0 360 540" className="ak-console-svg ak-console-svg--m" role="img" aria-label={label}>
          <g className="ak-routes">
            {[...M_IN, ...M_OUTL].map((l, i) => (
              <line key={i} x1={l.x} x2={l.x} y1={l.y1} y2={l.y2} />
            ))}
          </g>
          {SOURCES.map((s, k) => (
            <g key={s} className="ak-io">
              <rect x={M_SRC[k][0]} y={M_SRC[k][1]} width={M_CHIP.w} height={M_CHIP.h} rx="16" />
              <text x={M_SRC[k][0] + M_CHIP.w / 2} y={M_SRC[k][1] + 21} textAnchor="middle">
                {s}
              </text>
            </g>
          ))}
          <rect x={M_CORE.x} y={M_CORE.y} width={M_CORE.w} height={M_CORE.h} rx="8" className="ak-console-core" />
          <text x={M_CORE.x + 16} y={M_CORE.y + 24} className="ak-core-tag">
            ERP · CORE
          </text>
          <CoreLabels active={active} cx={180} nameY={M_CORE.y + 66} subY={M_CORE.y + 90} nameSize={[19, 19, 15]} />
          <line x1={M_CORE.x + 16} x2={M_CORE.x + M_CORE.w - 16} y1={M_CORE.y + 110} y2={M_CORE.y + 110} className="ak-core-div" />
          <Pipeline x={M_CORE.x} y={M_CORE.y + 136} w={M_CORE.w} rows={[[0, 1, 2], [3, 4, 5]]} fontSize={12} steps={STEPS} />
          <SegBar x={M_CORE.x + 16} y={M_CORE.y + 176} w={M_CORE.w - 32} steps={STEPS} />
          {OUTPUTS.map((s, k) => (
            <g key={s} className="ak-io ak-io--out">
              <rect x={M_OUT[k][0]} y={M_OUT[k][1]} width={M_CHIP.w} height={M_CHIP.h} rx="16" />
              <text x={M_OUT[k][0] + M_CHIP.w / 2} y={M_OUT[k][1] + 21} textAnchor="middle">
                {s}
              </text>
            </g>
          ))}
          <g className="ak-pkts">
            {Array.from({ length: 8 }, (_, i) => (
              <rect key={i} width="5" height="5" x="-10" y="-10" opacity="0" data-pkt-m="" />
            ))}
          </g>
        </svg>
      </div>

      <div className="ak-console-status">
        <span className="ak-console-cmd">
          <span aria-hidden="true">&gt; </span>scope: {STEPS.map((x) => x.toLowerCase()).join(" | ")}
          <span className="ak-caret ak-caret--sm" aria-hidden="true" />
        </span>
        <span className="ak-tag">Illustrative schematic</span>
      </div>
    </div>
  );
}
