import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SITE } from "@/lib/constants";

const jetbrainsMono = localFont({
  src: [
    { path: "../assets/jetbrains-mono-regular.woff2", weight: "400" },
    { path: "../assets/jetbrains-mono-bold.woff2", weight: "700" },
  ],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} | ${SITE.business}`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  openGraph: {
    type: "website",
    locale: SITE.locale,
    siteName: SITE.name,
  },
  twitter: { card: "summary" },
  alternates: { canonical: "/" },
};

// Anti-flash theme script — hardcoded string, no user input, safe to inline
const themeScript = `(function(){try{var t=localStorage.getItem("ce-theme");var c=t==="light"?"light":t==="dark"?"":"system";if(c==="system"||!t){c=window.matchMedia("(prefers-color-scheme:light)").matches?"light":""}if(c==="light"){document.documentElement.classList.add("light")}else{document.documentElement.classList.remove("light")}}catch(e){}})()`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={jetbrainsMono.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="antialiased overflow-x-hidden">
        {/* Shared SVG grain filter — defined once, referenced by all SectionAtmosphere instances */}
        <svg className="absolute h-0 w-0" aria-hidden="true">
          <defs>
            <filter id="grain-filter">
              <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
              <feColorMatrix type="saturate" values="0" />
            </filter>
          </defs>
        </svg>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
