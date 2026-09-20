import { describe, expect, it } from "vitest";
import { jsonLdScript } from "./json-ld";

describe("jsonLdScript", () => {
  it("serializes plain data as JSON", () => {
    const result = jsonLdScript({ "@type": "Article", name: "Hello" });
    expect(JSON.parse(result)).toEqual({ "@type": "Article", name: "Hello" });
  });

  it("escapes '<' so a closing script tag can't be injected", () => {
    const malicious = { name: "</script><script>alert(1)</script>" };
    const result = jsonLdScript(malicious);

    expect(result).not.toContain("</script>");
    expect(result).toContain("\\u003c/script>");
  });

  it("still round-trips to the original value once unescaped by JSON.parse", () => {
    const malicious = { name: "</script><script>alert(1)</script>" };
    const result = jsonLdScript(malicious);
    expect(JSON.parse(result)).toEqual(malicious);
  });

  it("leaves strings without '<' untouched", () => {
    const data = { name: "Plain text, no angle brackets." };
    expect(jsonLdScript(data)).toBe(JSON.stringify(data));
  });
});
