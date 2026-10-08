"use client";

import { useEffect, useRef, useState } from "react";
import { watchActive } from "./useStoryEngine";

const C = 240;
// Finance order: reconcile before the close, file and forecast after reporting.
const LABELS = ["Reconcile", "Close", "Report", "File", "Forecast"];
const LABEL_R = 218;

const pt = (r, deg) => {
  const a = (deg * Math.PI) / 180;
  return [+(C + r * Math.cos(a)).toFixed(2), +(C + r * Math.sin(a)).toFixed(2)];
};
const arc = (r, a1, a2) => {
  const [x1, y1] = pt(r, a1);
  const [x2, y2] = pt(r, a2);
  return `M${x1},${y1} A${r},${r} 0 ${a2 - a1 > 180 ? 1 : 0} 1 ${x2},${y2}`;
};

/** Chapter 05: the monthly operating rhythm, as a dial swept by one light. */
export default function RhythmDial() {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!ref.current) return undefined;
    return watchActive(ref.current, setInView, "0px");
  }, []);

  return (
    <div className="ak-dial" ref={ref} data-paused={inView ? undefined : ""}>
      <p className="ak-sr">Every month: reconcile, close, report, file, forecast.</p>
      <div className="ak-dial-box" aria-hidden="true">
        <span className="ak-dial-glow" />
        <svg viewBox="-40 -40 560 560" className="ak-dial-svg" focusable="false">
          {/* day ticks */}
          {Array.from({ length: 31 }, (_, d) => {
            const deg = -90 + (d * 360) / 31;
            const long = d === 0;
            const [x1, y1] = pt(176, deg);
            const [x2, y2] = pt(long ? 160 : 168, deg);
            return (
              <line
                key={d}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={long ? "#4a9c30" : "rgba(243,242,242,.18)"}
                strokeWidth={long ? 2 : 1}
              />
            );
          })}
          <circle cx={C} cy={C} r="150" fill="none" stroke="rgba(243,242,242,.06)" />
          {LABELS.map((l, k) => {
            const a1 = -90 + k * 72;
            const a2 = a1 + 64;
            const mid = a1 + 32;
            const [tx, ty] = pt(LABEL_R, mid);
            const rad = (mid * Math.PI) / 180;
            const cos = Math.cos(rad);
            // Anchor away from the ring so long labels never sit on the arc.
            const anchor = cos > 0.25 ? "start" : cos < -0.25 ? "end" : "middle";
            const dy = `${(0.36 * (1 + Math.sin(rad))).toFixed(2)}em`;
            return (
              <g key={l} style={{ "--k": k }}>
                <path d={arc(200, a1, a2)} className="ak-dial-arc" />
                <path d={arc(200, a1, a2)} className="ak-dial-arc-hi" />
                <text x={tx} y={ty} dy={dy} textAnchor={anchor} className="ak-dial-label">
                  {l.toUpperCase()}
                </text>
              </g>
            );
          })}
        </svg>
        <span className="ak-dial-sweep" />
        <div className="ak-dial-centre">
          <strong>Every month.</strong>
          <span>Same team, same standards.</span>
        </div>
      </div>
    </div>
  );
}
