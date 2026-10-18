import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "BazarDor | বাংলাদেশের দৈনিক বাজারদর",
    template: "%s | BazarDor",
  },
  description:
    "বাংলাদেশের বিভিন্ন পণ্যের দৈনিক বাজারদর জানুন। আজকের দাম, আগের দামের তুলনা এবং বিভিন্ন বাজারের মূল্য এক জায়গায় দেখুন।",
  applicationName: "BazarDor",
  keywords: [
    "BazarDor",
    "বাংলাদেশের বাজারদর",
    "আজকের বাজারদর",
    "নিত্যপ্রয়োজনীয় পণ্যের দাম",
    "Daily Market Price Bangladesh",
  ],
  openGraph: {
    title: "BazarDor | বাংলাদেশের দৈনিক বাজারদর",
    description:
      "বাংলাদেশের বিভিন্ন পণ্যের দৈনিক বাজারদর এক জায়গায় জানুন।",
    siteName: "BazarDor",
    locale: "bn_BD",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="bn"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}