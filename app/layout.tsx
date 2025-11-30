import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LoadingBar } from "@/components/loading-bar";
import { GitHubPagesScript } from "@/components/github-pages-script";

const inter = Inter({ 
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "PropertyManage Hub - Multi-Property Management System",
  description: "Modern property management system for hotels and resorts",
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
        <link rel="prefetch" href="/explore" />
        <link rel="prefetch" href="/explore/rooms" />
        <link rel="prefetch" href="/explore/attractions" />
        <link rel="prefetch" href="/explore/features" />
        <link rel="prefetch" href="/explore/about" />
        <link rel="prefetch" href="/explore/contact" />
        <link rel="prefetch" href="/admin" />
        <script src="/prefetch.js" defer></script>
      </head>
      <body className={inter.className}>
        <GitHubPagesScript />
        <LoadingBar />
        {children}
      </body>
    </html>
  );
}

