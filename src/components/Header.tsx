"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./Header.module.css";

const navLinks = [
  { href: "/#how-it-works", label: "How it works" },
  { href: "/products", label: "Products" },
  { href: "/#about", label: "About" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={`container ${styles.bar}`}>
        <Link href="/" className={styles.logo} onClick={() => setMenuOpen(false)}>
          Love<span className={styles.logoAccent}>Skin</span>
        </Link>

        <nav className={styles.nav} aria-label="Primary">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className={styles.navLink}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className={styles.actions}>
          <Link href="/quiz" className={`btn btn-primary ${styles.ctaDesktop}`}>
            Start Quiz
          </Link>

          <button
            type="button"
            className={styles.menuToggle}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className={`${styles.burgerLine} ${menuOpen ? styles.burgerOpen : ""}`} />
          </button>
        </div>
      </div>

      <div
        id="mobile-nav"
        className={`${styles.mobileNav} ${menuOpen ? styles.mobileNavOpen : ""}`}
        inert={!menuOpen}
      >
        <nav aria-label="Mobile primary" className="container">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={styles.mobileNavLink}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/quiz"
            className={`btn btn-primary ${styles.mobileCta}`}
            onClick={() => setMenuOpen(false)}
          >
            Start Quiz
          </Link>
        </nav>
      </div>
    </header>
  );
}
