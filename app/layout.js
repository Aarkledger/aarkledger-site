import "./globals.css";
import { Archivo } from "next/font/google";

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-archivo",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL("https://aarkledger.com"),
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/site-icon", type: "image/png", sizes: "64x64" },
    ],
    shortcut: "/favicon.ico",
    apple: { url: "/site-icon", type: "image/png" },
  },
  title: "Aarkledger — Financial Consultancy | Bookkeeping, Tax & FP&A",
  description:
    "Aarkledger provides bookkeeping, tax compliance, financial reporting, payroll, and FP&A for start-ups, SMEs, and enterprises across the Asia Pacific region.",
  keywords: [
    "bookkeeping",
    "accounting",
    "tax preparation",
    "financial reporting",
    "payroll",
    "FP&A",
    "financial consultancy",
    "Asia Pacific",
    "outsourced finance",
  ],
  openGraph: {
    title: "Aarkledger — Financial Consultancy",
    description:
      "Bookkeeping, tax, reporting, payroll, and FP&A for start-ups and enterprises across the Asia Pacific region.",
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
    <html lang="en" className={archivo.variable}>
      <body>{children}</body>
    </html>
  );
}
