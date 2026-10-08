"use client";

const LABELS = ["ACC", "TAX", "FP&A", "PAY", "CORP", "ERP", "DATA"];
const NAMES = ["accounting", "tax", "FP&A", "payroll", "corporate & legal compliance", "ERP systems", "data management"];

const list = (arr) => (arr.length <= 1 ? arr.join("") : `${arr.slice(0, -1).join(", ")} and ${arr[arr.length - 1]}`);

/** Seven-segment scope meter. levels: array of 'on' | 'flex' | 'off'. */
export default function ScopeMeter({ levels, bracket }) {
  const on = NAMES.filter((_, i) => levels[i] === "on");
  const flex = NAMES.filter((_, i) => levels[i] === "flex");
  let sentence = `In scope: ${list(on)}.`;
  if (flex.length) sentence += ` Can flex to include ${list(flex)}.`;
  let n = 0;
  return (
    <div className="ak-meter" data-reveal="meter">
      <div className="ak-meter-vis" aria-hidden="true">
        {bracket && (
          <div className="ak-meter-bracket" style={{ "--from": bracket.from, "--to": bracket.to }}>
            <span>{bracket.label}</span>
          </div>
        )}
        <div className="ak-meter-segs">
          {levels.map((lv, i) => (
            <span key={LABELS[i]} className={`ak-seg ak-seg--${lv}`} style={lv === "on" ? { "--i": n++ } : undefined} />
          ))}
        </div>
        <div className="ak-meter-labels">
          {LABELS.map((l) => (
            <span key={l}>{l}</span>
          ))}
        </div>
        <span className="ak-meter-cap">Functions in scope</span>
      </div>
      <p className="ak-sr">{sentence}</p>
    </div>
  );
}
