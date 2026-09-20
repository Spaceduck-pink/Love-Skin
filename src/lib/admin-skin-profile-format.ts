// Text <-> structured field helpers shared between the skin-profile admin
// forms and their server actions. Textareas store one list item per line,
// and FAQ / "what helps" entries as labelled blocks separated by a blank
// line, so admins can edit them without touching raw JSON.

export function linesToArray(text: string): string[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export function arrayToLines(items: string[]): string {
  return items.join("\n");
}

function parseLabelledBlocks(text: string, labels: [string, string]): [string, string][] {
  const [firstLabel, secondLabel] = labels;
  const firstPrefix = new RegExp(`^${firstLabel}:\\s*`, "i");
  const secondPrefix = new RegExp(`^${secondLabel}:\\s*`, "i");

  return text
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => {
      const lines = block.split("\n");
      const firstLineIndex = lines.findIndex((line) => firstPrefix.test(line));
      const secondLineIndex = lines.findIndex((line) => secondPrefix.test(line));

      const first =
        firstLineIndex >= 0 ? lines[firstLineIndex].replace(firstPrefix, "").trim() : "";
      const second =
        secondLineIndex >= 0
          ? lines
              .slice(secondLineIndex)
              .join("\n")
              .replace(secondPrefix, "")
              .trim()
          : "";

      return [first, second] as [string, string];
    })
    .filter(([first, second]) => first && second);
}

export function parseFaqs(text: string): { q: string; a: string }[] {
  return parseLabelledBlocks(text, ["Q", "A"]).map(([q, a]) => ({ q, a }));
}

export function serializeFaqs(faqs: { q: string; a: string }[]): string {
  return faqs.map((faq) => `Q: ${faq.q}\nA: ${faq.a}`).join("\n\n");
}

export function parseWhatHelps(text: string): { title: string; description: string }[] {
  return parseLabelledBlocks(text, ["Title", "Description"]).map(([title, description]) => ({
    title,
    description,
  }));
}

export function serializeWhatHelps(items: { title: string; description: string }[]): string {
  return items.map((item) => `Title: ${item.title}\nDescription: ${item.description}`).join("\n\n");
}
