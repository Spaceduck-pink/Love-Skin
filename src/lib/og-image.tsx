import { ImageResponse } from "next/og";

async function loadGoogleFont(family: string, weight: number) {
  const css = await (
    await fetch(
      `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@${weight}`,
    )
  ).text();
  const match = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/);
  if (!match) throw new Error(`Failed to resolve font URL for ${family}`);

  const res = await fetch(match[1]);
  if (!res.ok) throw new Error(`Failed to download font file for ${family}`);
  return res.arrayBuffer();
}

export const ogImageSize = { width: 1200, height: 630 };

export async function renderSiteOgImage() {
  const [playfair, inter] = await Promise.all([
    loadGoogleFont("Playfair Display", 700),
    loadGoogleFont("Inter", 500),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #f8dced 0%, #f3cbe4 45%, #ef73b8 100%)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "12px 32px",
            borderRadius: 999,
            background: "rgba(36, 18, 38, 0.08)",
            fontFamily: "Inter",
            fontSize: 26,
            fontWeight: 500,
            color: "#6e5a72",
            letterSpacing: 3,
            textTransform: "uppercase",
          }}
        >
          Personalized Skincare
        </div>
        <div
          style={{
            display: "flex",
            fontFamily: "Playfair Display",
            fontWeight: 700,
            fontSize: 140,
            color: "#241226",
            marginTop: 32,
            lineHeight: 1,
          }}
        >
          LoveSkin
        </div>
        <div
          style={{
            display: "flex",
            fontFamily: "Inter",
            fontWeight: 500,
            fontSize: 40,
            color: "#241226",
            marginTop: 16,
          }}
        >
          Your Skin Routine, Generated
        </div>
      </div>
    ),
    {
      ...ogImageSize,
      fonts: [
        { name: "Playfair Display", data: playfair, weight: 700, style: "normal" },
        { name: "Inter", data: inter, weight: 500, style: "normal" },
      ],
    },
  );
}
