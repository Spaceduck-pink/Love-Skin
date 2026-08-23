"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { signOut } from "@/lib/auth-actions";
import Avatar from "./Avatar";
import styles from "./AccountMenu.module.css";

interface AccountMenuProps {
  isAdmin: boolean;
  firstName: string | null;
  username: string | null;
  avatarUrl: string | null;
}

export default function AccountMenu({ isAdmin, firstName, username, avatarUrl }: AccountMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: PointerEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div className={styles.menu} ref={menuRef}>
      <button
        type="button"
        className={styles.trigger}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <Avatar avatarUrl={avatarUrl} name={firstName} size={24} />
        {firstName || "Account"}
        <svg
          className={`${styles.chevron} ${open ? styles.chevronOpen : ""}`}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="m6 9 6 6 6-6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <div className={styles.panel} role="menu">
          {username && (
            <Link
              href={`/u/${username}`}
              className={styles.item}
              role="menuitem"
              onClick={() => setOpen(false)}
            >
              View profile
            </Link>
          )}
          <Link
            href="/my-routine"
            className={styles.item}
            role="menuitem"
            onClick={() => setOpen(false)}
          >
            My routine
          </Link>
          <Link
            href="/settings"
            className={styles.item}
            role="menuitem"
            onClick={() => setOpen(false)}
          >
            Account
          </Link>
          {isAdmin && (
            <Link
              href="/admin"
              className={styles.item}
              role="menuitem"
              onClick={() => setOpen(false)}
            >
              Admin
            </Link>
          )}
          <form action={signOut}>
            <button type="submit" className={`${styles.item} ${styles.itemButton}`} role="menuitem">
              Log out
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
