import Script from "next/script";

export function UmamiAnalytics() {
  const src = process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL;
  const websiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;

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
