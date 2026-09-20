import { describe, expect, it } from "vitest";
import { searchIndex } from "./search-index";
import { blogPosts } from "./blog-content";

describe("searchIndex", () => {
  it("includes an entry for every blog post, linking to its slug", () => {
    for (const post of blogPosts) {
      const entry = searchIndex.find((item) => item.href === `/blog/${post.slug}`);
      expect(entry).toBeDefined();
      expect(entry?.title).toBe(post.title);
      expect(entry?.description).toBe(post.description);
    }
  });

  it("includes the core static site sections", () => {
    const hrefs = searchIndex.map((item) => item.href);
    expect(hrefs).toEqual(
      expect.arrayContaining(["/", "/quiz", "/skin-profile", "/products", "/blog"]),
    );
  });

  it("gives every entry a title, description, and href", () => {
    for (const item of searchIndex) {
      expect(item.title).toBeTruthy();
      expect(item.description).toBeTruthy();
      expect(item.href).toBeTruthy();
    }
  });

  it("has no duplicate hrefs", () => {
    const hrefs = searchIndex.map((item) => item.href);
    expect(new Set(hrefs).size).toBe(hrefs.length);
  });
});
