import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { GoogleAnalytics } from '@next/third-parties/google';
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Toronto Airbnb Directory | Find Short-Term Rentals in Toronto",
  description: "Search and find registered short-term rental properties in Toronto. View operator registration numbers, addresses, units, and property types. Discover the top buildings with the most Airbnb listings.",
  keywords: "Toronto Airbnb, short-term rentals, Toronto rentals, Airbnb directory, Toronto vacation rentals, STR registration",
  authors: [{ name: "Toronto Airbnb Directory" }],
  openGraph: {
    title: "Toronto Airbnb Directory | Find Short-Term Rentals in Toronto",
    description: "Search and find registered short-term rental properties in Toronto. View operator registration numbers, addresses, units, and property types.",
    type: "website",
    locale: "en_CA",
    siteName: "Toronto Airbnb Directory",
  },
  twitter: {
    card: "summary_large_image",
    title: "Toronto Airbnb Directory | Find Short-Term Rentals in Toronto",
    description: "Search and find registered short-term rental properties in Toronto. View operator registration numbers, addresses, units, and property types.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
  },
  verification: {
    google: "your-google-site-verification", // Add your Google Search Console verification code
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
      <GoogleAnalytics gaId="G-DWHZW7YK28" />
    </html>
  );
}
