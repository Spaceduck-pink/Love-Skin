import { describe, expect, it } from "vitest";
import { getYoutubeEmbedUrl, getYoutubeVideoId } from "./youtube";

describe("getYoutubeVideoId", () => {
  it("extracts the id from a standard watch URL", () => {
    expect(getYoutubeVideoId("https://www.youtube.com/watch?v=abc123XYZ_-")).toBe(
      "abc123XYZ_-",
    );
  });

  it("extracts the id from a watch URL with extra query params", () => {
    expect(
      getYoutubeVideoId("https://youtube.com/watch?v=abc123&t=42s&list=PL123"),
    ).toBe("abc123");
  });

  it("extracts the id from a youtu.be short link", () => {
    expect(getYoutubeVideoId("https://youtu.be/abc123")).toBe("abc123");
  });

  it("extracts the id from a youtu.be short link with extra path segments", () => {
    expect(getYoutubeVideoId("https://youtu.be/abc123/extra")).toBe("abc123");
  });

  it("extracts the id from a shorts URL", () => {
    expect(getYoutubeVideoId("https://www.youtube.com/shorts/abc123")).toBe("abc123");
  });

  it("extracts the id from an embed URL", () => {
    expect(getYoutubeVideoId("https://www.youtube.com/embed/abc123")).toBe("abc123");
  });

  it("extracts the id from a live URL", () => {
    expect(getYoutubeVideoId("https://www.youtube.com/live/abc123")).toBe("abc123");
  });

  it("strips the www. and m. subdomains", () => {
    expect(getYoutubeVideoId("https://m.youtube.com/watch?v=abc123")).toBe("abc123");
  });

  it("supports music.youtube.com", () => {
    expect(getYoutubeVideoId("https://music.youtube.com/watch?v=abc123")).toBe("abc123");
  });

  it("returns null for a watch URL missing the v param", () => {
    expect(getYoutubeVideoId("https://www.youtube.com/watch")).toBeNull();
  });

  it("returns null for an unrelated URL", () => {
    expect(getYoutubeVideoId("https://example.com/video/abc123")).toBeNull();
  });

  it("returns null for a non-URL string", () => {
    expect(getYoutubeVideoId("not a url")).toBeNull();
  });

  it("trims surrounding whitespace before parsing", () => {
    expect(getYoutubeVideoId("  https://youtu.be/abc123  ")).toBe("abc123");
  });
});

describe("getYoutubeEmbedUrl", () => {
  it("builds a privacy-enhanced embed URL for a recognized video URL", () => {
    expect(getYoutubeEmbedUrl("https://www.youtube.com/watch?v=abc123")).toBe(
      "https://www.youtube-nocookie.com/embed/abc123",
    );
  });

  it("returns null when given null", () => {
    expect(getYoutubeEmbedUrl(null)).toBeNull();
  });

  it("returns null when given undefined", () => {
    expect(getYoutubeEmbedUrl(undefined)).toBeNull();
  });

  it("returns null when given an empty string", () => {
    expect(getYoutubeEmbedUrl("")).toBeNull();
  });

  it("returns null when the URL isn't a recognized YouTube URL", () => {
    expect(getYoutubeEmbedUrl("https://example.com")).toBeNull();
  });
});
