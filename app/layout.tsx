import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LoadingBar } from "@/components/loading-bar";
import { GitHubPagesScript } from "@/components/github-pages-script";
import { PrefetchHead } from "@/components/prefetch-head";
import { SmoothScroll } from "@/components/premium/smooth-scroll";
import { BlurredBlobs, GradientNoise } from "@/components/premium/background-effects";
import { AOSInit } from "@/components/premium/aos-init";
import { Playfair_Display, DM_Sans } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ 
  subsets: ["latin"],
  display: "swap",
  preload: true,
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "PropertyManage Hub - Multi-Property Management System",
  description: "Modern property management system for hotels and resorts",
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="stylesheet" href="https://unpkg.com/aos@next/dist/aos.css" />
      </head>
      <body className={`${inter.variable} ${playfair.variable} ${dmSans.variable} font-sans`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SmoothScroll>
            <AOSInit />
            <GradientNoise />
            <BlurredBlobs />
            <PrefetchHead />
            <GitHubPagesScript />
            <LoadingBar />
            {children}
          </SmoothScroll>
        </ThemeProvider>
      </body>
    </html>
  );
}

