// JSON.stringify doesn't escape "<", so embedding it verbatim inside a
// <script type="application/ld+json"> tag lets a "</script>" substring in
// any field (e.g. an admin-edited title or FAQ answer) close the script tag
// early and inject arbitrary HTML/script into the page. Escaping "<" to a
// unicode escape keeps the JSON valid while making that impossible.
export function jsonLdScript(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
