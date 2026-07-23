import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#050505",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Rayou Va | Frontend Developer & UI Designer",
  description: "Ultra-premium personal portfolio showcasing modern frontend development, UI/UX design, and creative digital experiences built with Next.js, React, and Three.js.",
  keywords: ["frontend developer", "UI designer", "React", "Next.js", "portfolio", "Rayou Va"],
  authors: [{ name: "Rayou Va" }],
  creator: "Rayou Va",
  manifest: "/manifest.json",
  openGraph: {
    title: "Rayou Va | Frontend Developer & UI Designer",
    description: "Ultra-premium personal portfolio showcasing award-winning UI/UX and Full Stack Development.",
    type: "website",
    locale: "en_US",
    siteName: "Rayou Va Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rayou Va | Frontend Developer",
    description: "Ultra-premium personal portfolio showcasing award-winning UI/UX and Full Stack Development.",
    creator: "@rayouva",
  },
  robots: {
    index: true,
    follow: true,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Rayou Va",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/favicon.ico" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body
        suppressHydrationWarning
        className={cn(
          inter.variable,
          spaceGrotesk.variable,
          "antialiased bg-background text-foreground min-h-screen selection:bg-accent selection:text-black"
        )}
      >
        {children}

        <Script id="sw-register" strategy="afterInteractive">{`
          if ('serviceWorker' in navigator) {
            window.addEventListener('load', function() {
              navigator.serviceWorker.register('/sw.js')
                .then(function(reg) { console.log('SW registered'); })
                .catch(function(err) { console.log('SW error', err); });
            });
          }
        `}</Script>
      </body>
    </html>
  );
}
