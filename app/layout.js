import "./globals.css";

export const metadata = {
  metadataBase: new URL("https://aarkledger.com"),
  icons: { icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAIAAADYYG7QAAADKUlEQVR42u2Vv0sjQRTHd97suiuru8koEZUQECQqaCViBCGNpFFERUhhoWApFhZaaOOf4B+hjYhgYy8WIogWC4o/uoSsYlxITMyGnZkr5swF77zzjjvuDubTzfDe2/fjO28VRSKRSCQSiUTyT4HrDwghjDHnvP4SAN76YAwA9WYAgBD6Uzn+wdAf75BIghCSTCZvbm7EUbRhdHRU0zTP8xBC4n5iYqK3t/f29rYWpb+/PxaLNTU15fP531OPqqqKoszMzJyfn1uWhRACAIwxxvjw8HB9fV3YAAAA7O7unp6e9vT0IIRUVUUI7e/v7+zsRCIRMU30Ad7L5LM+GGMIocnJyfv7++npac45Y4xSmkgkVFVNJBKmaQZBwBhjjDU0NLiue3V1xTkPgoBzDgC+7z88PFBKGWP8A3xvZADAGIvH4319fXt7e0NDQ5eXl4QQy7KmpqaOjo7K5TIhpFAoEEJs225raysWi77vM8bC4bBt24SQUqkUi8Wenp4IIc3NzaFQyLZty7LsV+pvQqEQ59z3/W8oWAiIc97a2ppMJoMg0DRN13VRN2OsXC5zzk3TFO8LIVSpVCilhmGIQgGAUlqtVnVdF6FqGgiCoP79igaLyBcXF47j1Oz/hz2kadrg4KDrukLOCKHu7u5UKuV5XqlUEuIdGRkZGxvLZDKVSkXolzE2MDCQTqcBIJfLCUcAGB8fj8fjd3d34h00NjbOzs4CwOPjo7D5gagVRTEMY3FxkVJKKZUUhVKaSqUWFhbC4TBjTNyk0+nOzs6NjQ3Rf0ppV1fX8vJyNpttb2+nrwDA2tra8PCw0DilNBKJrKysrK6uYoyFzXuT+pKQEP+bvew3jthAwt/3/e3tbcuydF0XaohGo7lc7vr6en5+vqWlpaaqfD5/dnZW23C+73d0dDiOU61Wv179307o5eVF1/W5ublalEwmgzE2TbNWjeu6m9ubh4cHz8/PYhbHx8fFYnFpaenk5KRQKIiPBUGQzWaj0aioU2h8a2vL8zxRyU9vyHphYYx/6CXe4BsMw/jN/6X3nN/0XBy/PwgR7e/+JSUSiUQikUgkv8QnX2Km3QCOpg8AAAAASUVORK5CYII=" },
  title: "Aarkledger — Financial Consultancy | Bookkeeping, Tax & FP&A",
  description:
    "Aarkledger provides bookkeeping, tax compliance, financial reporting, payroll, and FP&A for sole proprietors, SMEs, and corporations across Canada, the United States, and the Philippines.",
  keywords: [
    "bookkeeping",
    "accounting",
    "tax preparation",
    "financial reporting",
    "payroll",
    "FP&A",
    "Canada",
    "United States",
    "Philippines",
  ],
  openGraph: {
    title: "Aarkledger — Financial Consultancy",
    description:
      "Bookkeeping, tax, reporting, payroll, and FP&A across Canada, the US, and the Philippines.",
    url: "https://aarkledger.com",
    siteName: "Aarkledger",
    type: "website",
  },
  alternates: {
    canonical: "https://aarkledger.com",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
