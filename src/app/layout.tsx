import type { Metadata } from "next";
import { Playfair_Display, Inter, JetBrains_Mono, Lato } from "next/font/google";
import Script from "next/script";
import { siteUrl } from "@/lib/site";
import "./globals.css";

const playfairDisplay = Playfair_Display({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const title = "LoveSkin — Your Skin Routine, Generated";
const description =
  "Answer a few quick questions and LoveSkin generates a personalized AM/PM skincare routine for you. No sign-up, no database — just your routine.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title,
    description,
    url: siteUrl,
    siteName: "LoveSkin",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${playfairDisplay.variable} ${inter.variable} ${jetBrainsMono.variable} ${lato.variable}`}
    >
      <body suppressHydrationWarning>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=localStorage.getItem('theme');var t=(s==='dark'||s==='light')?s:(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.dataset.theme=t;}catch(e){}})();`,
          }}
        />
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        {children}
        <Script
          src="https://cloud.umami.is/script.js"
          data-website-id="a9b07787-ba78-41cd-bb97-7cf57c4c9fe0"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
