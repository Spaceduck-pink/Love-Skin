// Shared between the checkout and download routes so both agree on what
// was actually purchased — the download route checks this id against the
// Checkout Session's metadata before releasing the file.
export const GUIDE_PRODUCT_ID = "loveskin-guide-v1";
export const GUIDE_PRICE_GBP_PENCE = 100; // £1.00
export const GUIDE_NAME = "The LoveSkin Guide";
export const GUIDE_PDF_PATH = "src/assets/pdfs/love-skin-guide.pdf";
export const GUIDE_DOWNLOAD_FILENAME = "loveskin-guide.pdf";
