"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { searchIndex, type SearchItem } from "@/lib/search-index";
import styles from "./SearchBar.module.css";

export default function SearchBar() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [productItems, setProductItems] = useState<SearchItem[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;

    supabase
      .from("skincare_products")
      .select("slug, title, description")
      .then(({ data, error }) => {
        if (error || cancelled || !data) return;
        setProductItems(
          data.map((product) => ({
            title: product.title,
            description: product.description,
            href: `/products#${product.slug}`,
          })),
        );
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!open) return;

    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        close();
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") close();
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return [...searchIndex, ...productItems]
      .filter(
        (item) =>
          item.title.toLowerCase().includes(q) || item.description.toLowerCase().includes(q),
      )
      .slice(0, 8);
  }, [query, productItems]);

  function close() {
    setOpen(false);
    setQuery("");
  }

  function openSearch() {
    setOpen(true);
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  function goTo(href: string) {
    router.push(href);
    close();
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (results[0]) goTo(results[0].href);
  }

  return (
    <div className={styles.wrapper} ref={containerRef}>
      <button
        type="button"
        className={styles.trigger}
        aria-label={open ? "Close search" : "Search"}
        aria-expanded={open}
        onClick={() => (open ? close() : openSearch())}
      >
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.5" />
          <path d="M20 20l-4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      {open && (
        <div className={styles.panel} role="search">
          <form onSubmit={handleSubmit} className={styles.form}>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search LoveSkin…"
              className={styles.input}
              aria-label="Search LoveSkin"
            />
          </form>

          {query.trim() && (
            <ul className={styles.results}>
              {results.length > 0 ? (
                results.map((item) => (
                  <li key={item.href}>
                    <button type="button" className={styles.result} onClick={() => goTo(item.href)}>
                      <span className={styles.resultTitle}>{item.title}</span>
                      <span className={styles.resultDescription}>{item.description}</span>
                    </button>
                  </li>
                ))
              ) : (
                <li className={styles.empty}>No results for &ldquo;{query}&rdquo;</li>
              )}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
