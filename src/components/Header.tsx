"use client";

import { useState } from "react";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import SearchBar from "./SearchBar";
import AccountMenu from "./AccountMenu";
import { signInWithGoogle, signOut } from "@/lib/auth-actions";
import styles from "./Header.module.css";

const navLinks = [
  { href: "/#how-it-works", label: "How it works" },
  { href: "/skin-profile", label: "Skin Profile" },
  { href: "/products", label: "Products" },
  { href: "/#about", label: "About" },
  { href: "/#newsletter", label: "Newsletter" },
];

interface HeaderProps {
  isSignedIn: boolean;
  isAdmin: boolean;
  firstName: string | null;
  username: string | null;
  avatarUrl: string | null;
}

export default function Header({
  isSignedIn,
  isAdmin,
  firstName,
  username,
  avatarUrl,
}: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const signIn = signInWithGoogle.bind(null, "/");

  return (
    <header className={styles.header}>
      <div className={`container ${styles.bar}`}>
        <Link href="/" className={styles.logo} onClick={() => setMenuOpen(false)}>
          <svg
            className={styles.logoMark}
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path d="M12 21s-7.5-4.6-10-9.3C.4 8.1 2.2 4 6.1 4c2.1 0 3.6 1.1 4.4 2.4l1.5 2.3 1.5-2.3C14.3 5.1 15.8 4 17.9 4c3.9 0 5.7 4.1 4.1 7.7C19.5 16.4 12 21 12 21Z" />
          </svg>
          Love<span className={styles.logoAccent}>Skin</span>
        </Link>

        <nav className={styles.nav} aria-label="Primary">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={styles.navLink}
              prefetch={false}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className={styles.actions}>
          <SearchBar />

          <Link href="/quiz" className={`btn btn-primary ${styles.ctaDesktop}`}>
            Start Quiz
          </Link>

          <ThemeToggle />

          {isSignedIn ? (
            <div className={styles.authDesktop}>
              <AccountMenu
                isAdmin={isAdmin}
                firstName={firstName}
                username={username}
                avatarUrl={avatarUrl}
              />
            </div>
          ) : (
            <form action={signIn} className={styles.authDesktop}>
              <button type="submit" className={styles.authLink}>
                Log in
              </button>
            </form>
          )}

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
              prefetch={false}
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

          {isAdmin && (
            <Link
              href="/admin"
              className={styles.mobileNavLink}
              onClick={() => setMenuOpen(false)}
            >
              Admin dashboard
            </Link>
          )}

          {isSignedIn ? (
            <>
              {username && (
                <Link
                  href={`/u/${username}`}
                  className={styles.mobileNavLink}
                  onClick={() => setMenuOpen(false)}
                >
                  View profile
                </Link>
              )}
              <Link
                href="/my-routine"
                className={styles.mobileNavLink}
                onClick={() => setMenuOpen(false)}
              >
                My routine
              </Link>
              <Link
                href="/settings"
                className={styles.mobileNavLink}
                onClick={() => setMenuOpen(false)}
              >
                Settings
              </Link>
              <form action={signOut}>
                <button type="submit" className={`${styles.mobileNavLink} ${styles.mobileNavButton}`}>
                  Log out
                </button>
              </form>
            </>
          ) : (
            <form action={signIn}>
              <button type="submit" className={`${styles.mobileNavLink} ${styles.mobileNavButton}`}>
                Log in
              </button>
            </form>
          )}
        </nav>
      </div>
    </header>
  );
}
