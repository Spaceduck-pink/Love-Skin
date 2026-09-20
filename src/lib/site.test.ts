import { afterEach, describe, expect, it, vi } from "vitest";

const ORIGINAL_ENV = process.env.NEXT_PUBLIC_SITE_URL;

async function importSiteUrl() {
  vi.resetModules();
  const mod = await import("./site");
  return mod.siteUrl;
}

describe("siteUrl", () => {
  afterEach(() => {
    process.env.NEXT_PUBLIC_SITE_URL = ORIGINAL_ENV;
    vi.resetModules();
  });

  it("falls back to localhost when NEXT_PUBLIC_SITE_URL is unset", async () => {
    delete process.env.NEXT_PUBLIC_SITE_URL;
    expect(await importSiteUrl()).toBe("http://localhost:3000");
  });

  it("uses NEXT_PUBLIC_SITE_URL when set", async () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://loveskin.example.com";
    expect(await importSiteUrl()).toBe("https://loveskin.example.com");
  });

  it("strips a single trailing slash", async () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://loveskin.example.com/";
    expect(await importSiteUrl()).toBe("https://loveskin.example.com");
  });
});
