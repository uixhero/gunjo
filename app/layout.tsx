import type { Metadata, Viewport } from "next";
import { Inter, Shippori_Mincho } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { ThemeOverridesProvider } from "@/components/providers/ThemeOverridesProvider";
import { LocaleProvider } from "@/components/providers/LocaleProvider";
import { KitLocaleBridge } from "@/components/providers/KitLocaleBridge";
import { ToastProvider, TooltipProvider } from "@gunjo/ui";
import { GoogleTagManager } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({ subsets: ["latin"] });
// Shippori Mincho is a CJK font: next/font can't subset the kanji, so with
// preload on it emits a <link rel=preload> for every unicode-range chunk
// (~244 files, 7.6MB) and the browser downloads them all up front — gating
// LCP. preload:false drops those links; with display:swap the few chunks the
// rendered headings actually need load on demand, after first paint.
const mincho = Shippori_Mincho({
  subsets: ["latin"],
  weight: ["500", "700", "800"],
  variable: "--font-mincho",
  display: "swap",
  preload: false,
});

// gunjo.jp shipped noindex during the pre-launch window. At launch (2026-07)
// we open indexing on production only; Vercel preview/branch deploys stay out
// of the index so they don't compete with www.gunjo.jp for the same content.
// VERCEL_ENV is "production" only for the production deployment; it's unset in
// local dev and "preview" for branch deploys, so both stay noindex. (#553)
const allowIndexing = process.env.VERCEL_ENV === "production";

export const metadata: Metadata = {
  title: "GunjoUI — Becoming blue.",
  description:
    "群青 — A design system for designers and AI, in becoming. SSOT-driven React + Tailwind for rich, data-dense applications.",
  robots: allowIndexing
    ? { index: true, follow: true }
    : { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

  return (
    <html lang="en" suppressHydrationWarning>
      {gtmId ? <GoogleTagManager gtmId={gtmId} /> : null}
      <body
        className={`${inter.className} ${mincho.variable} antialiased min-h-screen bg-background text-foreground`}
      >
        <div className="relative flex min-h-screen flex-col">
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <LocaleProvider>
              <KitLocaleBridge>
                <ThemeOverridesProvider>
                  <ToastProvider>
                    <TooltipProvider delayDuration={300}>
                      <SiteHeader />
                      <div className="flex-1">{children}</div>
                      <SiteFooter />
                    </TooltipProvider>
                  </ToastProvider>
                </ThemeOverridesProvider>
              </KitLocaleBridge>
            </LocaleProvider>
          </ThemeProvider>
        </div>
        <Analytics />
      </body>
    </html>
  );
}
