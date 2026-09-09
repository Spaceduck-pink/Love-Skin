"use client";

import { useState, useSyncExternalStore } from "react";
import styles from "./ShareButtons.module.css";

interface ShareButtonsProps {
  url: string;
  title: string;
  text?: string;
}

// The Web Share API's availability never changes after load, so this reads
// it as an external snapshot rather than mirroring it into state via an
// effect — avoids a hydration mismatch (server has no `navigator`) without
// the extra render an effect-based check would cause.
function subscribe() {
  return () => {};
}

function getCanShareSnapshot() {
  return typeof navigator !== "undefined" && typeof navigator.share === "function";
}

function getServerSnapshot() {
  return false;
}

export default function ShareButtons({ url, title, text }: ShareButtonsProps) {
  const canShare = useSyncExternalStore(subscribe, getCanShareSnapshot, getServerSnapshot);
  const [copied, setCopied] = useState(false);

  const shareText = text ?? title;
  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(shareText);
  const encodedTitle = encodeURIComponent(title);

  async function handleNativeShare() {
    try {
      await navigator.share({ title, text: shareText, url });
    } catch {
      // User cancelled the share sheet — nothing to do.
    }
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access denied — nothing to do.
    }
  }

  const links = [
    {
      name: "Email",
      href: `mailto:?subject=${encodedTitle}&body=${encodedText}%0A%0A${encodedUrl}`,
      icon: <EmailIcon />,
    },
    {
      name: "WhatsApp",
      href: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
      icon: <WhatsAppIcon />,
    },
    {
      name: "X",
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
      icon: <XIcon />,
    },
    {
      name: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      icon: <FacebookIcon />,
    },
    {
      name: "Pinterest",
      href: `https://pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodedText}`,
      icon: <PinterestIcon />,
    },
  ];

  return (
    <div className={styles.shareRow}>
      <span className={styles.label}>Share</span>
      <div className={styles.buttons}>
        {canShare && (
          <button
            type="button"
            className={styles.iconBtn}
            onClick={handleNativeShare}
            aria-label="Share via your device (includes TikTok, Messages, and more)"
            title="Share via your device"
          >
            <ShareIcon />
          </button>
        )}
        {links.map((link) => (
          <a
            key={link.name}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.iconBtn}
            aria-label={`Share on ${link.name}`}
            title={`Share on ${link.name}`}
          >
            {link.icon}
          </a>
        ))}
        <button
          type="button"
          className={styles.iconBtn}
          onClick={handleCopy}
          aria-label="Copy link"
          title="Copy link"
        >
          {copied ? <CheckIcon /> : <LinkIcon />}
        </button>
      </div>
      {copied && (
        <span className={styles.copiedToast} role="status">
          Link copied
        </span>
      )}
    </div>
  );
}

function ShareIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" xmlns="http://www.w3.org/2000/svg">
      <circle cx="18" cy="5" r="2.5" />
      <circle cx="6" cy="12" r="2.5" />
      <circle cx="18" cy="19" r="2.5" />
      <path d="M8.2 10.7 15.8 6.3M8.2 13.3l7.6 4.4" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" xmlns="http://www.w3.org/2000/svg">
      <path d="M9.5 14.5 14.5 9.5" />
      <path d="M11 6.5 12.4 5.1a3.5 3.5 0 0 1 5 5L16 11.5" />
      <path d="M13 17.5 11.6 18.9a3.5 3.5 0 0 1-5-5L8 12.5" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 12.5 9.5 17 19 7" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="5.5" width="16" height="13" rx="2" />
      <path d="m4.5 6.5 7.5 6 7.5-6" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 3.5a8.5 8.5 0 0 0-7.3 12.8L3.5 20.5l4.3-1.1A8.5 8.5 0 1 0 12 3.5Zm0 1.6a6.9 6.9 0 0 1 5.9 10.5 6.9 6.9 0 0 1-9.6 2.3l-.3-.2-2.4.6.6-2.3-.2-.3A6.9 6.9 0 0 1 12 5.1Z" />
      <path d="M17.5 14.4c-.3-.1-1.6-.8-1.8-.9-.2-.1-.4-.1-.6.1-.2.2-.7.9-.8 1-.2.2-.3.2-.5.1-.3-.1-1.2-.4-2.2-1.4-.8-.7-1.4-1.6-1.5-1.9-.2-.3 0-.4.1-.6l.4-.5c.1-.1.2-.3.2-.4.1-.2 0-.3 0-.4-.1-.1-.6-1.4-.8-1.9-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 1.9s.8 2.2 1 2.4c.1.2 1.7 2.6 4.1 3.6.6.2 1 .4 1.4.5.6.2 1.1.2 1.5.1.5-.1 1.6-.6 1.8-1.2.2-.6.2-1.1.1-1.2 0-.1-.2-.2-.5-.3Z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 4h4.2l4.1 5.6L16.9 4H20l-6.2 7.5L20.4 20h-4.2l-4.5-6.1L6.8 20H3.7l6.6-8.1L4 4Z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 21v-7h2.4l.4-3H14V9c0-.9.2-1.5 1.6-1.5H17V5c-.3 0-1.2-.1-2.2-.1-2.2 0-3.8 1.3-3.8 3.8V11H8.5v3H11v7h3Z" />
    </svg>
  );
}

function PinterestIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 3.5c-4.7 0-8.5 3.5-8.5 7.9 0 3.3 2 5 3.1 5 .5 0 .8-1.3.8-1.7 0-.4-1-1.2-1-2.9 0-2.9 2.2-5.4 5.9-5.4 3.2 0 5.4 1.9 5.4 4.6 0 3.1-1.4 5.8-3.6 5.8-1 0-1.8-.8-1.6-1.9.3-1.4.9-2.9.9-3.9 0-2.5-3.5-2.1-3.5.9 0 .9.3 1.5.3 1.5s-1.2 4.7-1.4 5.6c-.3 1.4-.1 3.1 0 3.3.1.1.2.1.3 0 .1-.1 1.5-1.9 2-3.7l.7-2.8c.4.7 1.5 1.3 2.7 1.3 3.5 0 5.9-3.1 5.9-7.3 0-3.6-3.1-6.3-7.4-6.3Z" />
    </svg>
  );
}
