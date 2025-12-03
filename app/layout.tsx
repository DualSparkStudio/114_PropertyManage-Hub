import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LoadingBar } from "@/components/loading-bar";
import { GitHubPagesScript } from "@/components/github-pages-script";
import { PrefetchHead } from "@/components/prefetch-head";
import { CustomCursor } from "@/components/premium/custom-cursor";
import { SmoothScroll } from "@/components/premium/smooth-scroll";
import { BlurredBlobs, GradientNoise } from "@/components/premium/background-effects";
import { AOSInit } from "@/components/premium/aos-init";

const inter = Inter({ 
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "PropertyManage Hub - Multi-Property Management System",
  description: "Modern property management system for hotels and resorts",
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
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="stylesheet" href="https://unpkg.com/aos@next/dist/aos.css" />
      </head>
      <body className={inter.className}>
        <SmoothScroll>
          <AOSInit />
          <CustomCursor />
          <GradientNoise />
          <BlurredBlobs />
          <PrefetchHead />
          <GitHubPagesScript />
          <LoadingBar />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}

