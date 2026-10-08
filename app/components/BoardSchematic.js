"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion, watchActive } from "./useStoryEngine";
import { FN_ICONS, Plus } from "./icons";

const LEFT_Y = [80, 210, 340, 470];
const RIGHT_Y = [130, 290, 450];

/** Orthogonal polyline with rounded (quadratic) corners. */
function orthoPath(points, r = 8) {
  let d = `M${points[0][0]},${points[0][1]}`;
  for (let i = 1; i < points.length - 1; i++) {
    const [px, py] = points[i - 1];
    const [x, y] = points[i];
    const [nx, ny] = points[i + 1];
    const l1 = Math.hypot(x - px, y - py);
    const l2 = Math.hypot(nx - x, ny - y);
    const rr = Math.min(r, l1 / 2, l2 / 2);
    const ax = x - ((x - px) / l1) * rr;
    const ay = y - ((y - py) / l1) * rr;
    const bx = x + ((nx - x) / l2) * rr;
    const by = y + ((ny - y) / l2) * rr;
    d += ` L${ax},${ay} Q${x},${y} ${bx},${by}`;
  }
  const last = points[points.length - 1];
  d += ` L${last[0]},${last[1]}`;
  return d;
}

function buildTraces() {
  const out = [];
  LEFT_Y.forEach((y, i) => {
    const pts = [
      [290, y + 32],
      [330 + i * 30, y + 32],
      [330 + i * 30, 265 + i * 30],
      [480, 265 + i * 30],
    ];
    out.push({ d: orthoPath(pts), vias: [pts[1], pts[2]], chip: { x: 70, y } });
  });
  RIGHT_Y.forEach((y, j) => {
    const pts = [
      [910, y + 32],
      [870 - j * 30, y + 32],
      [870 - j * 30, 275 + j * 45],
      [720, 275 + j * 45],
    ];
    out.push({ d: orthoPath(pts), vias: [pts[1], pts[2]], chip: { x: 910, y } });
  });
  return out;
}

const TRACES = buildTraces();
const DURS = [2.4, 2.8, 3.2, 3.6];

/** Chapter 03: the business as a circuit board with seven built-in functions. */
export default function BoardSchematic({ functions }) {
  const ref = useRef(null);
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(0);
  const [inView, setInView] = useState(false);
  // Auto-cycling stops for good at the first hover, focus or click.
  const [touched, setTouched] = useState(false);
  // Accordion rows render open on the server (readable without JS).
  const [mounted, setMounted] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    return watchActive(el, setInView, "0px");
  }, []);

  useEffect(() => {
    if (!inView || touched || reduced) return undefined;
    const id = window.setInterval(() => {
      setActive((a) => (a + 1) % functions.length);
    }, 3500);
    return () => window.clearInterval(id);
  }, [inView, touched, reduced, functions.length]);

  useEffect(() => {
    if (reduced && !touched) setActive(0);
  }, [reduced, touched]);

  const pick = useCallback((i) => {
    setTouched(true);
    setActive(i);
  }, []);

  const f = functions[active];

  return (
    <div className="ak-board-wrap" ref={ref} data-paused={inView ? undefined : ""}>
      {/* ---------- Desktop board ---------- */}
      <div className="ak-board">
        <div className="ak-board-box">
          <span className="ak-board-glow" aria-hidden="true" />
          <svg viewBox="0 0 1200 640" className="ak-board-svg" aria-hidden="true" focusable="false">
            <rect x="20" y="20" width="1160" height="600" rx="14" fill="none" stroke="rgba(243,242,242,.12)" />
            {[
              [64, 64],
              [1136, 64],
              [64, 576],
              [1136, 576],
            ].map(([x, y]) => (
              <g key={`${x}-${y}`}>
                <circle cx={x} cy={y} r="6" fill="none" stroke="rgba(243,242,242,.18)" strokeWidth="1.5" />
                <circle cx={x} cy={y} r="2" fill="rgba(243,242,242,.12)" />
              </g>
            ))}
            <text x="88" y="56" className="ak-silk">
              YOUR BUSINESS · REV A
            </text>
            <text x="1112" y="600" className="ak-silk" textAnchor="end">
              AL-BUS · 07 FUNCTIONS
            </text>

            {/* traces */}
            <g className="ak-traces">
              {TRACES.map((t, i) => (
                <path key={i} d={t.d} className={`ak-trace${i === active ? " is-active" : ""}`} fill="none" />
              ))}
            </g>
            <g className="ak-vias">
              {TRACES.map((t, i) =>
                t.vias.map(([x, y], k) => (
                  <circle key={`${i}-${k}`} cx={x} cy={y} r="3.5" className={`ak-via${i === active ? " is-active" : ""}`} />
                ))
              )}
            </g>
            <g className="ak-pulses">
              {TRACES.map((t, i) => (
                <path
                  key={i}
                  d={t.d}
                  pathLength="1"
                  className="ak-pulse"
                  fill="none"
                  style={{ animationDuration: `${DURS[i % 4]}s`, animationDelay: `${i * 0.4}s` }}
                />
              ))}
            </g>

            {/* chip slots */}
            {TRACES.map((t, i) => {
              const { x, y } = t.chip;
              const right = x > 600;
              const edge = right ? x : x + 220;
              return (
                <g key={i}>
                  <rect x={x} y={y} width="220" height="64" rx="6" fill="#1a1918" stroke="rgba(243,242,242,.14)" />
                  {[0, 1, 2, 3, 4].map((k) => (
                    <line
                      key={k}
                      x1={edge}
                      x2={right ? edge - 6 : edge + 6}
                      y1={y + 12 + k * 10}
                      y2={y + 12 + k * 10}
                      stroke="rgba(243,242,242,.22)"
                      strokeWidth="2"
                    />
                  ))}
                </g>
              );
            })}

            {/* core */}
            <rect x="480" y="245" width="240" height="150" rx="8" fill="#201e1d" stroke="#4a9c30" strokeWidth="1.5" />
            {Array.from({ length: 12 }, (_, k) => (
              <g key={k}>
                <rect x={492 + k * 18.5} y="237" width="4" height="8" fill="rgba(243,242,242,.2)" />
                <rect x={492 + k * 18.5} y="395" width="4" height="8" fill="rgba(243,242,242,.2)" />
              </g>
            ))}
            <text x="600" y="316" textAnchor="middle" className="ak-core-label">
              YOUR OPERATIONS
            </text>
            <text x="600" y="340" textAnchor="middle" className="ak-silk">
              {`ACTIVE · ${f.code}`}
            </text>
          </svg>

          {TRACES.map((t, i) => {
            const fn = functions[i];
            return (
              <button
                type="button"
                key={fn.code}
                className={`ak-chip${i === active ? " is-active" : ""}`}
                style={{
                  left: `${(t.chip.x / 1200) * 100}%`,
                  top: `${(t.chip.y / 640) * 100}%`,
                }}
                aria-pressed={i === active}
                aria-describedby="ak-board-detail"
                onMouseEnter={() => pick(i)}
                onFocus={() => pick(i)}
                onClick={() => pick(i)}
              >
                <span className="ak-chip-ico" aria-hidden="true">
                  {FN_ICONS[fn.icon]}
                </span>
                <span className="ak-chip-txt">
                  <span className="ak-chip-code">{fn.code}</span>
                  <span className="ak-chip-label">{fn.label}</span>
                </span>
              </button>
            );
          })}
        </div>

        <div className="ak-board-detail" id="ak-board-detail" aria-live={touched ? "polite" : "off"}>
          <span className="ak-board-detail-code">{f.code}</span>
          <div>
            <h3 className="ak-board-detail-name">{f.name}</h3>
            <p>{f.desc}</p>
          </div>
        </div>
        <p className="ak-board-cap">Not plugged in from outside. Built into the board.</p>
      </div>

      {/* ---------- Mobile vertical bus ---------- */}
      <div className="ak-bus">
        <div className="ak-bus-core">
          <span className="ak-silk-html">Core</span>
          Your operations
        </div>
        <div className="ak-bus-trunk">
          <span className="ak-bus-pulse" aria-hidden="true" />
          {functions.map((fn, i) => {
            const isOpen = mounted ? open === i : true;
            return (
              <div className={`ak-bus-row${isOpen ? " is-open" : ""}`} key={fn.code}>
                <span className="ak-bus-via" aria-hidden="true" />
                <h3 className="ak-bus-h">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`ak-bus-r-${i}`}
                    id={`ak-bus-b-${i}`}
                    onClick={() => setOpen(isOpen ? -1 : i)}
                  >
                    <span className="ak-chip-code">{fn.code}</span>
                    <span className="ak-bus-name">{fn.name}</span>
                    <Plus size={18} className="ak-acc-ico" />
                  </button>
                </h3>
                <div
                  className="ak-bus-region"
                  id={`ak-bus-r-${i}`}
                  role="region"
                  aria-labelledby={`ak-bus-b-${i}`}
                  hidden={!isOpen}
                >
                  <p>{fn.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
