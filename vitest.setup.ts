import "@testing-library/jest-dom/vitest";
import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";

afterEach(() => {
  cleanup();
});

// jsdom doesn't implement matchMedia; FadeIn and other components query it.
if (!window.matchMedia) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

// jsdom doesn't implement IntersectionObserver; FadeIn relies on it.
if (!("IntersectionObserver" in window)) {
  class MockIntersectionObserver implements IntersectionObserver {
    readonly root: Element | Document | null = null;
    readonly rootMargin: string = "";
    readonly thresholds: ReadonlyArray<number> = [];
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
    takeRecords = vi.fn(() => []);
  }
  // @ts-expect-error -- test-only stub, not a full implementation
  window.IntersectionObserver = MockIntersectionObserver;
  global.IntersectionObserver = MockIntersectionObserver;
}

// Vitest's own createObjectURL polyfill throws on a real File instance in
// this environment; stub it unconditionally rather than relying on jsdom's
// (or vitest's) version. AvatarUploader relies on it for local previews.
window.URL.createObjectURL = vi.fn(() => "blob:mock-url");
window.URL.revokeObjectURL = vi.fn();
