"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion, watchActive } from "./useStoryEngine";

const CONSULTANTS = ["Consultant 01", "Consultant 02", "Consultant 03"];
const OWNER = "Aarkledger";

/**
 * Illustrative "open issues" register. In the hook (resolved=false) the
 * "last touched by" column keeps cycling through consultants while the owner
 * stays empty. In the closing bookend (resolved) the owner column is filled
 * with "Aarkledger" and the status flips to OWNED. Only owner/status change.
 */
export default function IssueRegister({ issues, resolved = false }) {
  const rootRef = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const rows = Array.from(root.querySelectorAll("[data-reg-row]"));
    const touched = rows.map((r) => r.querySelector("[data-touched]"));
    const owners = rows.map((r) => r.querySelector("[data-owner]"));
    const foot = root.querySelector("[data-foot]");
    let timers = [];
    const later = (fn, ms) => {
      const id = window.setTimeout(fn, ms);
      timers.push(id);
      return id;
    };
    const clearAll = () => {
      timers.forEach((t) => window.clearTimeout(t));
      timers = [];
    };

    const setOwned = (i, on) => {
      const r = rows[i];
      r.classList.toggle("is-owned", on);
      const open = r.querySelector("[data-pill-open]");
      const owned = r.querySelector("[data-pill-owned]");
      if (open) open.setAttribute("aria-hidden", on ? "true" : "false");
      if (owned) owned.setAttribute("aria-hidden", on ? "false" : "true");
    };

    if (!resolved) {
      /* ---------------- Hook: consultants keep cycling ---------------- */
      if (reduced) {
        touched.forEach((t) => t && (t.textContent = CONSULTANTS[2]));
        return undefined;
      }
      const idx = rows.map(() => 0);
      const cycleRow = (i) => {
        const el = touched[i];
        if (!el) return;
        const next = (idx[i] + 1) % CONSULTANTS.length;
        let txt = el.textContent;
        const del = () => {
          if (txt.length) {
            txt = txt.slice(0, -1);
            el.textContent = txt || " ";
            later(del, 30);
          } else {
            type(0);
          }
        };
        const target = CONSULTANTS[next];
        const type = (n) => {
          el.textContent = target.slice(0, n) || " ";
          if (n < target.length) later(() => type(n + 1), 30);
          else {
            idx[i] = next;
            later(() => cycleRow(i), 2600);
          }
        };
        del();
      };
      const start = () => rows.forEach((_, i) => later(() => cycleRow(i), 2600 + i * 400));
      const stop = () => {
        clearAll();
        touched.forEach((t, i) => t && (t.textContent = CONSULTANTS[idx[i]]));
      };
      const off = watchActive(root, (v) => (v ? start() : stop()), "0px");
      return () => {
        off();
        clearAll();
      };
    }

    /* ---------------- Bookend: ownership is assigned ---------------- */
    const finalState = () => {
      owners.forEach((o) => {
        if (!o) return;
        o.textContent = OWNER;
        o.parentElement.classList.add("is-typed");
      });
      rows.forEach((_, i) => setOwned(i, true));
      if (foot) foot.textContent = "Owner assigned: Aarkledger (embedded)";
      root.classList.add("is-resolved");
    };
    const resetState = () => {
      owners.forEach((o) => {
        if (!o) return;
        o.textContent = "—";
        o.parentElement.classList.remove("is-typed", "is-typing");
      });
      rows.forEach((_, i) => setOwned(i, false));
      if (foot) foot.textContent = "Owner assigned: none";
      root.classList.remove("is-resolved");
    };

    if (reduced) {
      finalState();
      return undefined;
    }

    // Server markup shows the final (owned) state so it reads correctly
    // without JS; with motion allowed, rewind it and replay on entry.
    resetState();
    let done = false;
    let finished = 0;
    const run = () => {
      finished = 0;
      rows.forEach((_, i) => {
        later(() => {
          const o = owners[i];
          if (!o) return;
          o.parentElement.classList.add("is-typing");
          const type = (n) => {
            o.textContent = OWNER.slice(0, n) || " ";
            if (n < OWNER.length) later(() => type(n + 1), 90);
            else {
              o.parentElement.classList.remove("is-typing");
              o.parentElement.classList.add("is-typed");
              setOwned(i, true);
              finished += 1;
              if (finished === rows.length) {
                done = true;
                if (foot) foot.textContent = "Owner assigned: Aarkledger (embedded)";
                root.classList.add("is-resolved");
              }
            }
          };
          type(0);
        }, 300 + i * 250);
      });
    };
    const off = watchActive(root, (v) => {
      if (done) return;
      if (v) run();
      else {
        clearAll();
        resetState();
      }
    }, "-15% 0px");
    return () => {
      off();
      clearAll();
    };
  }, [resolved, reduced]);

  return (
    <div
      className={`ak-register ak-spot${resolved ? " ak-register--resolved is-resolved" : " ak-register--hook"}`}
      ref={rootRef}
      data-pause-offscreen=""
    >
      <div className="ak-reg-strip">
        <span className="ak-reg-title">
          <span className="ak-reg-led" aria-hidden="true" />
          Open issues
        </span>
        <span className="ak-tag">Illustrative</span>
      </div>
      <div role="table" aria-label="Illustrative open issues register" className="ak-reg-table">
        <div role="row" className="ak-reg-row ak-reg-row--head">
          <span role="columnheader" className="ak-reg-c-issue">Issue</span>
          <span role="columnheader" className="ak-reg-c-touched">Last touched by</span>
          <span role="columnheader" className="ak-reg-c-owner">Owner</span>
          <span role="columnheader" className="ak-reg-c-status">Status</span>
        </div>
        {issues.map((it, i) => (
          <div
            role="row"
            className={`ak-reg-row${i >= 4 ? " ak-reg-row--extra" : ""}${resolved ? " is-owned" : ""}`}
            data-reg-row=""
            key={it}
            style={{ "--i": i }}
          >
            <span role="cell" className="ak-reg-c-issue">{it}</span>
            <span role="cell" className="ak-reg-c-touched" data-label="Last touched by">
              <span data-touched="">{resolved ? CONSULTANTS[2] : CONSULTANTS[0]}</span>
            </span>
            <span role="cell" className="ak-reg-c-owner" data-label="Owner">
              <span className={`ak-reg-owner${resolved ? " is-typed" : ""}`}>
                <span data-owner="">{resolved ? OWNER : "—"}</span>
                <span className="ak-caret" aria-hidden="true" />
              </span>
            </span>
            <span role="cell" className="ak-reg-c-status">
              <span className="ak-pills">
                <span className="ak-pill-open" data-pill-open="" aria-hidden={resolved ? "true" : "false"}>
                  <span className="ak-breath" aria-hidden="true" />
                  OPEN
                </span>
                {resolved && (
                  <span className="ak-pill-owned" data-pill-owned="" aria-hidden="false">
                    {"✓"} OWNED
                  </span>
                )}
              </span>
            </span>
          </div>
        ))}
      </div>
      <div className="ak-reg-foot">
        <span data-foot="">{resolved ? "Owner assigned: Aarkledger (embedded)" : "Owner assigned: none"}</span>
      </div>
    </div>
  );
}
