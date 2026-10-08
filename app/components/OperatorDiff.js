"use client";

import { useEffect, useRef } from "react";
import { onProgress } from "./useStoryEngine";
import { Check } from "./icons";

const ROWS = [
  ["Diagnoses the problem", "Diagnoses it, then fixes it"],
  ["Delivers recommendations", "Delivers a working process"],
  ["Leaves when the project ends", "Stays through every month-end"],
  ["Judged on the report", "Judged on your close, your filings and your numbers"],
  ["Learns your business for a project", "Learns your business to run it"],
  ["Hands the work back to your team", "Becomes part of your team"],
];

/** Chapter 02: consultant → operator.diff (a real, accessible table). */
export default function OperatorDiff() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const rows = Array.from(el.querySelectorAll("[data-diff-row]"));
    return onProgress(el, (p) => {
      rows.forEach((r, i) => r.classList.toggle("is-on", p >= i / 6 + 0.02));
    });
  }, []);

  return (
    <div className="ak-diff" ref={ref} data-progress="0.9,0.8" data-reveal="">
      <div className="ak-diff-bar" aria-hidden="true">
        <span className="ak-dots">
          <i />
          <i />
          <i />
        </span>
        <span className="ak-diff-file">consultant → operator.diff</span>
        <span className="ak-diff-count">6 changes</span>
      </div>
      <div className="ak-diff-hunk" aria-hidden="true">
        @@ your finance function @@
      </div>
      <table className="ak-diff-table">
        <caption className="ak-sr">Consultant compared with an operator business partner</caption>
        <thead>
          <tr>
            <th scope="col" className="ak-diff-th-m">
              Consultant
            </th>
            <th scope="col" className="ak-diff-th-p">
              Operator · Business partner
            </th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map(([m, p], i) => (
            <tr key={m} data-diff-row="" className="ak-diff-row">
              <td className="ak-diff-m">
                <span className="ak-diff-gut" aria-hidden="true">
                  <span>{i + 1}</span>
                  <b>−</b>
                </span>
                <span className="ak-diff-txt">
                  <span className="ak-strike">{m}</span>
                </span>
              </td>
              <td className="ak-diff-p">
                <span className="ak-diff-gut" aria-hidden="true">
                  <span>{i + 1}</span>
                  <b>+</b>
                </span>
                <span className="ak-diff-txt">
                  <Check size={14} className="ak-diff-check" />
                  <span>{p}</span>
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
