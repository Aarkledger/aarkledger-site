import "./globals.css";

export const metadata = {
  metadataBase: new URL("https://aarkledger.com"),
  icons: { icon: [{ url: "/site-icon", type: "image/png" }] },
  title: "Aarkledger — Financial Consultancy | Bookkeeping, Tax & FP&A",
  description:
    "Aarkledger provides bookkeeping, tax compliance, financial reporting, payroll, and FP&A for sole proprietors, SMEs, and corporations across the Philippines and Southeast Asia.",
  keywords: [
    "bookkeeping",
    "accounting",
    "tax preparation",
    "financial reporting",
    "payroll",
    "FP&A",
    "Philippines",
    "Southeast Asia",
    "BIR compliance",
  ],
  openGraph: {
    title: "Aarkledger — Financial Consultancy",
    description:
      "Bookkeeping, tax, reporting, payroll, and FP&A across the Philippines and Southeast Asia.",
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
