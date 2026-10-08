"use client";

import { useEffect, useRef } from "react";
import { onProgress } from "./useStoryEngine";

const D = [0, -3, 2, -4, 1, 3, -2, 4, -1, 2, -3];

const DESKTOP = { W: 1200, H: 300, x0: 60, step: 95, base: 260, op: 120, peak: 90, fs: 14, end: 1170, dScale: 1, yLabelX: 24 };
const MOBILE = { W: 600, H: 400, x0: 44, step: 46, base: 336, op: 170, peak: 128, fs: 18, end: 584, dScale: 1.4, yLabelX: 16 };

function Chart({ g, idp, variant }) {
  const X = (u) => +(g.x0 + u * g.step).toFixed(1);
  const { base, op, peak } = g;
  const cons = `M${X(0)},${base} C${X(0.63)},${base} ${X(0.95)},${peak} ${X(1.47)},${peak} C${X(2)},${peak} ${X(2.21)},${base} ${X(2.53)},${base}`;
  const pts = [];
  for (let i = 1; i <= 11; i++) pts.push([X(i), +(op + D[i - 1] * g.dScale).toFixed(1)]);
  const oper =
    `M${X(0)},${base} C${X(0.526)},${base} ${X(0.737)},${op} ${X(1)},${op} ` +
    pts.slice(1).map(([x, y]) => `L${x},${y}`).join(" ") +
    ` L${g.end},${op - 2}`;
  const fs = g.fs;
  const swatch = variant === "m" ? 30 : 24;
  const legendY = variant === "m" ? 30 : 24;
  const opLegendX = variant === "m" ? 236 : 210;
  return (
    <svg
      className={`ak-lc-svg ak-lc-svg--${variant}`}
      viewBox={`0 0 ${g.W} ${g.H}`}
      role="group"
      aria-labelledby={`${idp}-t`}
      preserveAspectRatio="xMidYMid meet"
    >
      <title id={`${idp}-t`}>
        Illustrative chart: a consultant&apos;s involvement rises to recommendations at month 2 and ends at month 3; an
        Aarkledger operator&apos;s involvement rises by month 2 and continues through month 12 and beyond.
      </title>
      <defs>
        <linearGradient id={`${idp}-fade`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#7d7979" stopOpacity="1" />
          <stop offset="1" stopColor="#7d7979" stopOpacity="0" />
        </linearGradient>
      </defs>

      <g aria-hidden="true">
        {Array.from({ length: 12 }, (_, i) => (
          <g key={i}>
            <line x1={X(i)} x2={X(i)} y1={variant === "m" ? 52 : 44} y2={base} stroke="rgba(32,30,29,.06)" strokeWidth="1" />
            <text x={X(i)} y={base + fs + 8} textAnchor="middle" className="ak-lc-axis" fontSize={fs}>
              {`M${String(i + 1).padStart(2, "0")}`}
            </text>
          </g>
        ))}
        <line x1={X(0) - 10} x2={g.W - 10} y1={base} y2={base} stroke="#dcd8d8" strokeWidth="1" />
        <text
          className="ak-lc-axis"
          fontSize={fs}
          transform={`translate(${g.yLabelX} ${base}) rotate(-90)`}
          textAnchor="start"
        >
          Involvement in your operations
        </text>

        {/* legend */}
        <line x1={X(0)} x2={X(0) + swatch} y1={legendY} y2={legendY} stroke="#7d7979" strokeWidth="2" />
        <text x={X(0) + swatch + 8} y={legendY + fs * 0.35} className="ak-lc-legend" fontSize={fs}>
          Consultant
        </text>
        <line x1={opLegendX} x2={opLegendX + swatch} y1={legendY} y2={legendY} stroke="#136207" strokeWidth="2.5" />
        <text x={opLegendX + swatch + 8} y={legendY + fs * 0.35} className="ak-lc-legend" fontSize={fs}>
          Aarkledger operator
        </text>

        {/* consultant */}
        <path d={cons} pathLength="1" className="ak-lc-cons" fill="none" stroke="#7d7979" strokeWidth="2" />
        <path
          d={`M${X(2.53)},${base} H${X(2.53) + (variant === "m" ? 40 : 60)}`}
          stroke={`url(#${idp}-fade)`}
          strokeWidth="2"
          strokeDasharray="2 6"
          className="ak-lc-stub"
        />
        <g className="ak-lc-end" data-di="3.1">
          <circle cx={X(1.47)} cy={peak} r="4" fill="#fff" stroke="#7d7979" strokeWidth="2" />
          <text x={X(1.47) + 10} y={peak - 10} fontSize={fs} className="ak-lc-ann">
            Recommendations delivered
          </text>
          <circle cx={X(2.53)} cy={base} r="4" fill="#7d7979" />
          <text x={X(2.53) + 8} y={base - 12} fontSize={fs} className="ak-lc-ann">
            Engagement ends
          </text>
        </g>

        {/* operator */}
        <path
          d={oper}
          pathLength="1"
          className="ak-lc-op"
          fill="none"
          stroke="#136207"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <g className="ak-lc-end" data-di="11.35">
          <path d={`M${g.end - 2},${op - 8} L${g.end + 9},${op - 2} L${g.end - 2},${op + 4} z`} fill="#136207" />
          <text x={g.W - 8} y={op - (variant === "m" ? 26 : 22)} textAnchor="end" fontSize={fs} className="ak-lc-ann ak-lc-ann--op">
            And the month after that
          </text>
        </g>
      </g>

      {pts.map(([x, y], k) => (
        <g
          key={k}
          className="ak-lc-dia"
          data-di={k + 1}
          aria-hidden="true"
        >
          <rect
            x={x - (variant === "m" ? 5 : 4)}
            y={y - (variant === "m" ? 5 : 4)}
            width={variant === "m" ? 10 : 8}
            height={variant === "m" ? 10 : 8}
            transform={`rotate(45 ${x} ${y})`}
            fill="#136207"
          />
          <rect x={x - 14} y={y - 14} width="28" height="28" fill="transparent" />
          <text x={x} y={y - (variant === "m" ? 16 : 12)} textAnchor="middle" fontSize={fs} className="ak-lc-close">
            Close
          </text>
        </g>
      ))}
    </svg>
  );
}

/** Chapter 02: consultant involvement vs. operator involvement, drawn on scroll. */
export default function LifecycleChart() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const dias = Array.from(el.querySelectorAll("[data-di]"));
    return onProgress(el, (p) => {
      for (const d of dias) {
        const i = Number(d.getAttribute("data-di"));
        d.classList.toggle("is-on", p >= Math.min(0.99, (i + 0.5) / 12));
      }
    });
  }, []);

  return (
    <figure className="ak-lc" ref={ref} data-progress="0.9,0.55">
      <div className="ak-lc-box ak-lc-box--d">
        <Chart g={DESKTOP} idp="lcd" variant="d" />
      </div>
      <div className="ak-lc-box ak-lc-box--m">
        <Chart g={MOBILE} idp="lcm" variant="m" />
      </div>
      <figcaption className="ak-lc-cap">
        <span className="ak-tag ak-tag--light">Illustrative</span>
      </figcaption>
    </figure>
  );
}
