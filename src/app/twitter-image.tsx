import { ogImageSize, renderSiteOgImage } from "@/lib/og-image";

export const alt = "LoveSkin — Your Skin Routine, Generated";
export const size = ogImageSize;
export const contentType = "image/png";

export default async function Image() {
  return renderSiteOgImage();
}
