"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./ChatWidget.module.css";

interface ChatMessage {
  role: "user" | "model";
  text: string;
}

const WELCOME: ChatMessage = {
  role: "model",
  text: "Hi! I'm your LoveSkin assistant. Ask me anything about skincare routines, ingredients, or products — like how to start retinol, or what order to layer your products in.",
};

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, open]);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || isSending) return;

    const nextMessages: ChatMessage[] = [...messages, { role: "user", text }];
    setMessages([...nextMessages, { role: "model", text: "" }]);
    setInput("");
    setIsSending(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });

      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? "Something went wrong.");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let assistantText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        assistantText += decoder.decode(value, { stream: true });
        const textSoFar = assistantText;
        setMessages((prev) => {
          const copy = [...prev];
          copy[copy.length - 1] = { role: "model", text: textSoFar };
          return copy;
        });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong.";
      setMessages((prev) => {
        const copy = [...prev];
        copy[copy.length - 1] = { role: "model", text: message };
        return copy;
      });
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className={styles.wrapper}>
      {open && (
        <div className={styles.panel} role="dialog" aria-label="Skincare assistant chat">
          <div className={styles.header}>
            <span>LoveSkin Assistant</span>
            <button
              type="button"
              className={styles.closeButton}
              onClick={() => setOpen(false)}
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>

          <div className={styles.messages} ref={listRef}>
            {messages.map((m, i) => (
              <div
                key={i}
                className={m.role === "user" ? styles.userMessage : styles.modelMessage}
              >
                {m.text || (isSending && i === messages.length - 1 ? "…" : "")}
              </div>
            ))}
          </div>

          <form className={styles.form} onSubmit={sendMessage}>
            <input
              type="text"
              className={styles.input}
              placeholder="Ask about routines, retinol, products..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isSending}
              aria-label="Message"
            />
            <button
              type="submit"
              className={styles.sendButton}
              disabled={isSending || !input.trim()}
              aria-label="Send message"
            >
              →
            </button>
          </form>
        </div>
      )}

      <button
        type="button"
        className={styles.toggle}
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close skincare assistant chat" : "Open skincare assistant chat"}
        aria-expanded={open}
      >
        {open ? (
          "✕"
        ) : (
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path
              d="M4 5.5h16a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H9.5L5 20.5V16.5H4a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>
    </div>
  );
}
