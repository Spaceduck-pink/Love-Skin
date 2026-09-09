// Accepts any of the URL shapes people paste from YouTube (watch, youtu.be,
// shorts, embed, with or without extra query params) and returns just the
// video ID, or null if the string doesn't look like a YouTube URL at all.
export function getYoutubeVideoId(url: string): string | null {
  let parsed: URL;
  try {
    parsed = new URL(url.trim());
  } catch {
    return null;
  }

  const host = parsed.hostname.replace(/^www\./, "").replace(/^m\./, "");

  if (host === "youtu.be") {
    const id = parsed.pathname.slice(1).split("/")[0];
    return id || null;
  }

  if (host === "youtube.com" || host === "music.youtube.com") {
    if (parsed.pathname === "/watch") {
      return parsed.searchParams.get("v");
    }
    const match = parsed.pathname.match(/^\/(?:embed|shorts|live)\/([^/]+)/);
    if (match) return match[1];
  }

  return null;
}

// Privacy-enhanced (youtube-nocookie.com) embed URL for a product's optional
// video, or null when there's no video / the pasted URL isn't recognized.
export function getYoutubeEmbedUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  const id = getYoutubeVideoId(url);
  return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
}
