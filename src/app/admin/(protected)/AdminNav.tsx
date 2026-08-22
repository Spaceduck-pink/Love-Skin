"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/lib/auth-actions";
import styles from "./layout.module.css";

const links = [
  { href: "/admin/subscribers", label: "Subscribers" },
  { href: "/admin/products", label: "Products" },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <div className={styles.bar}>
      <nav className={styles.nav} aria-label="Admin">
        <Link href="/admin/subscribers" className={styles.navLink} style={{ fontWeight: 700 }}>
          LoveSkin Admin
        </Link>
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`${styles.navLink} ${pathname === link.href ? styles.navLinkActive : ""}`}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <form action={signOut}>
        <button type="submit" className={styles.logoutBtn}>
          Log out
        </button>
      </form>
    </div>
  );
}
