"use client";

import { useEffect } from "react";
import "./globals.css";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
            textAlign: "center",
          }}
        >
          <div style={{ maxWidth: "28rem" }}>
            <h1 style={{ marginBottom: "0.75rem" }}>Something went wrong</h1>
            <p style={{ marginBottom: "1.5rem", color: "var(--color-text-muted)" }}>
              LoveSkin hit an unexpected error. Please try reloading the page.
            </p>
            <button type="button" onClick={reset} className="btn btn-primary">
              Reload
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
