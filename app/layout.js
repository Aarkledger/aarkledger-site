import "./globals.css";

export const metadata = {
  metadataBase: new URL("https://aarkledger.com"),
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
