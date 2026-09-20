import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";
import FadeIn from "./FadeIn";

function stubMatchMedia(matches: boolean) {
  // Vitest treats spyOn on an already-mocked function as a no-op wrapper, so
  // restoreAllMocks can't undo a mockReturnValue applied that way. Replacing
  // the whole function per-test (and resetting it in beforeEach) avoids that.
  window.matchMedia = vi.fn().mockReturnValue({
    matches,
    media: "(prefers-reduced-motion: reduce)",
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  });
}

describe("FadeIn", () => {
  beforeEach(() => {
    stubMatchMedia(false);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders its children", () => {
    render(<FadeIn>Hello there</FadeIn>);
    expect(screen.getByText("Hello there")).toBeInTheDocument();
  });

  it("passes the id and className through to the section", () => {
    render(
      <FadeIn id="newsletter" className="extra">
        Content
      </FadeIn>,
    );
    const section = screen.getByText("Content");
    expect(section).toHaveAttribute("id", "newsletter");
    expect(section.className).toContain("extra");
  });

  it("becomes visible immediately when the user prefers reduced motion", () => {
    stubMatchMedia(true);

    render(<FadeIn>Reduced motion content</FadeIn>);
    const section = screen.getByText("Reduced motion content");
    expect(section.className).toContain("visible");
  });

  it("becomes visible once IntersectionObserver reports the element is intersecting", () => {
    let capturedCallback: IntersectionObserverCallback | undefined;
    class ObservingIntersectionObserver {
      constructor(callback: IntersectionObserverCallback) {
        capturedCallback = callback;
      }
      observe = vi.fn();
      unobserve = vi.fn();
      disconnect = vi.fn();
      takeRecords = vi.fn(() => []);
    }
    vi.stubGlobal("IntersectionObserver", ObservingIntersectionObserver);

    render(<FadeIn>Observed content</FadeIn>);
    const section = screen.getByText("Observed content");
    expect(section.className).not.toContain("visible");

    act(() => {
      capturedCallback?.(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      );
    });

    expect(section.className).toContain("visible");
    vi.unstubAllGlobals();
  });
});
