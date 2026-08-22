import type { Metadata } from "next";
import { Playfair_Display, Inter, JetBrains_Mono, Lato } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NewsletterForm from "@/components/NewsletterForm";
import { createClient } from "@/lib/supabase-server";
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

export const metadata: Metadata = {
  title: "LoveSkin — Your Skin Routine, Generated",
  description:
    "Answer a few quick questions and LoveSkin generates a personalized AM/PM skincare routine for you. No sign-up, no database — just your routine.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let isAdmin = false;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    isAdmin = profile?.role === "admin";
  }

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
        <Header isSignedIn={!!user} isAdmin={isAdmin} />
        <main id="main-content">
          {children}
          <NewsletterForm />
        </main>
        <Footer />
      </body>
    </html>
  );
}
