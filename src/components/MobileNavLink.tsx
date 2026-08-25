"use client";

import Link from "next/link";
import { useCloseMobileMenu } from "./MobileMenuContext";

export default function MobileNavLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  const closeMenu = useCloseMobileMenu();

  return (
    <Link href={href} className={className} onClick={closeMenu}>
      {children}
    </Link>
  );
}
