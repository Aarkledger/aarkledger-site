"use client";

const base = {
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
  focusable: "false",
};

export const Check = ({ size = 14, ...p }) => (
  <svg {...base} width={size} height={size} strokeWidth={2.4} {...p}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export const ArrowRight = ({ size = 16, ...p }) => (
  <svg {...base} width={size} height={size} {...p} className={"ak-arrow " + (p.className || "")}>
    <path d="M5 12h14" />
    <path d="M13 6l6 6-6 6" />
  </svg>
);

export const ArrowDown = ({ size = 16, ...p }) => (
  <svg {...base} width={size} height={size} {...p}>
    <path d="M12 5v14" />
    <path d="M6 13l6 6 6-6" />
  </svg>
);

export const Plus = ({ size = 18, ...p }) => (
  <svg {...base} width={size} height={size} {...p}>
    <path d="M12 5v14" className="ak-plus-v" />
    <path d="M5 12h14" />
  </svg>
);

export const External = ({ size = 14, ...p }) => (
  <svg {...base} width={size} height={size} {...p}>
    <path d="M14 4h6v6" />
    <path d="M20 4l-9 9" />
    <path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
  </svg>
);

/* Function icons (AL-01 ... AL-07) */
export const FN_ICONS = {
  acc: (
    <svg {...base}>
      <path d="M4 4h16v16H4z" />
      <path d="M4 9h16M9 4v16" />
    </svg>
  ),
  tax: (
    <svg {...base}>
      <path d="M6 2h9l5 5v15H6z" />
      <path d="M15 2v5h5" />
      <path d="M9 13h6M9 17h6" />
    </svg>
  ),
  fpa: (
    <svg {...base}>
      <path d="M3 3v18h18" />
      <path d="M7 14l4-4 3 3 5-6" />
    </svg>
  ),
  pay: (
    <svg {...base}>
      <rect x="3" y="6" width="18" height="12" rx="1.5" />
      <circle cx="12" cy="12" r="2.5" />
      <path d="M6 9v.01M18 15v.01" />
    </svg>
  ),
  legal: (
    <svg {...base}>
      <path d="M12 3v18" />
      <path d="M5 7h14" />
      <path d="M5 7l-3 7a3 3 0 0 0 6 0z" />
      <path d="M19 7l-3 7a3 3 0 0 0 6 0z" />
      <path d="M8 21h8" />
    </svg>
  ),
  erp: (
    <svg {...base}>
      <rect x="7" y="7" width="10" height="10" rx="1.5" />
      <path d="M10 3v4M14 3v4M10 17v4M14 17v4M3 10h4M3 14h4M17 10h4M17 14h4" />
    </svg>
  ),
  data: (
    <svg {...base}>
      <ellipse cx="12" cy="5.5" rx="7" ry="2.5" />
      <path d="M5 5.5v6c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5v-6" />
      <path d="M5 11.5v6c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5v-6" />
    </svg>
  ),
};
