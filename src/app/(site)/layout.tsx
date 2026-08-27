import { Suspense } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeaderAuthDesktop from "@/components/HeaderAuthDesktop";
import HeaderAuthMobile from "@/components/HeaderAuthMobile";
import ChatWidget from "@/components/ChatWidget";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header
        authDesktop={
          <Suspense fallback={null}>
            <HeaderAuthDesktop />
          </Suspense>
        }
        authMobile={
          <Suspense fallback={null}>
            <HeaderAuthMobile />
          </Suspense>
        }
      />
      <main id="main-content">{children}</main>
      <Footer />
      <ChatWidget />
    </>
  );
}
