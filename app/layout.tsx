import type { Metadata, Viewport } from "next";
import { Inter, Shippori_Mincho } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { ThemeOverridesProvider } from "@/components/providers/ThemeOverridesProvider";
import { LocaleProvider } from "@/components/providers/LocaleProvider";
import { ToastProvider, TooltipProvider } from "@gunjo/ui";
import { GoogleTagManager } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({ subsets: ["latin"] });
const mincho = Shippori_Mincho({
  subsets: ["latin"],
  weight: ["500", "700", "800"],
  variable: "--font-mincho",
  display: "swap",
});

export const metadata: Metadata = {
  title: "GunjoUI — Becoming blue.",
  description:
    "群青 — A design system for designers and AI, in becoming. SSOT-driven React + Tailwind for rich, data-dense applications.",
  robots: {
    index: false,
    follow: false,
  },
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
              <ThemeOverridesProvider>
                <ToastProvider>
                  <TooltipProvider delayDuration={300}>
                    <SiteHeader />
                    <div className="flex-1">{children}</div>
                    <SiteFooter />
                  </TooltipProvider>
                </ToastProvider>
              </ThemeOverridesProvider>
            </LocaleProvider>
          </ThemeProvider>
        </div>
        <Analytics />
      </body>
    </html>
  );
}
