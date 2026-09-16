import Script from "next/script";

export function UmamiAnalytics() {
  const src = process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL || "https://stats.boholvending.com/script.js";
  const websiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID || "67526bd7-f75d-45f3-b748-86d84ac8ab32";

  if (!src || !websiteId || src.startsWith("replace") || websiteId.startsWith("replace")) return null;

  return (
    <Script
      src={src}
      data-website-id={websiteId}
      data-domains="boholvending.com,www.boholvending.com"
      strategy="lazyOnload"
    />
  );
}
