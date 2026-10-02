import Script from "next/script";

export function UmamiAnalytics() {
  const src = process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL || "https://stats.boholvending.com/script.js";
  const websiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID || "67526bd7-f75d-45f3-b748-86d84ac8ab32";

  if (!src || !websiteId || src.startsWith("replace") || websiteId.startsWith("replace")) return null;

  return <>
    <Script id="bohol-umami-filter" strategy="beforeInteractive">{`
      window.boholUmamiBeforeSend = function (type, payload) {
        var path = window.location.pathname || "";
        var privatePath = path === "/login" || path === "/admin" ||
          path.indexOf("/admin/") === 0 ||
          path.indexOf("/bohol-control-7e9c2f") === 0 ||
          path.indexOf("/keystatic") === 0 ||
          path.indexOf("/api/admin/") === 0 ||
          path.indexOf("/api/keystatic/") === 0;
        return privatePath ? false : payload;
      };
    `}</Script>
    <Script
      src={src}
      data-website-id={websiteId}
      data-domains="boholvending.com,www.boholvending.com"
      data-before-send="boholUmamiBeforeSend"
      data-exclude-search="true"
      data-exclude-hash="true"
      data-performance="true"
      strategy="lazyOnload"
    />
  </>;
}
