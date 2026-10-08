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
      { url: "/favicon.ico?v=3", sizes: "any" },
      { url: "/site-icon?v=3", type: "image/png", sizes: "64x64" },
    ],
    shortcut: "/favicon.ico?v=3",
    apple: { url: "/site-icon?v=3", type: "image/png" },
  },
  title: "Aarkledger | Embedded finance & ERP team across Asia-Pacific",
  description:
    "Experienced finance operators who embed in your business: accounting, tax and compliance, FP&A, payroll, corporate & legal compliance, ERP systems (SAP S/4HANA, Oracle NetSuite, Microsoft Dynamics 365 Business Central) and data management for start-ups, SMEs and enterprises across Asia-Pacific. Since 2015.",
  keywords: [
    "embedded finance team",
    "outsourced finance",
    "bookkeeping",
    "accounting",
    "tax preparation",
    "VAT GST compliance",
    "payroll",
    "FP&A",
    "ERP implementation",
    "SAP S/4HANA",
    "Oracle NetSuite",
    "Microsoft Dynamics 365 Business Central",
    "financial consultancy",
    "Asia Pacific",
  ],
  openGraph: {
    title: "Aarkledger | Operators, not consultants",
    description:
      "An experienced finance team that embeds in your operations: accounting, compliance, FP&A, payroll, ERP systems and data across Asia-Pacific.",
    url: "https://aarkledger.com",
    siteName: "Aarkledger",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Aarkledger | Embedded finance & ERP team",
    description: "Experienced finance operators embedded in your business across Asia-Pacific. Since 2015.",
  },
  alternates: {
    canonical: "https://aarkledger.com",
  },
};

export const viewport = {
  themeColor: "#141413",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={archivo.variable}>
      <body>{children}</body>
    </html>
  );
}
