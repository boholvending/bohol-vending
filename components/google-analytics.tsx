"use client";
import Script from "next/script";
import { usePathname } from "next/navigation";

export const ga4MeasurementId = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID || "G-JL0MQ1697G";

export function GoogleAnalytics() {
  const pathname = usePathname();
  if (pathname?.startsWith("/bohol-control-7e9c2f") || pathname?.startsWith("/keystatic") || pathname?.startsWith("/api/")) return null;
  if (!/^G-[A-Z0-9]+$/.test(ga4MeasurementId)) return null;
  return <>
    <Script src={`https://www.googletagmanager.com/gtag/js?id=${ga4MeasurementId}`} strategy="afterInteractive" />
    <Script id="google-analytics" strategy="afterInteractive">{`
      window.dataLayer = window.dataLayer || [];
      function gtag(){window.dataLayer.push(arguments);}
      window.gtag = gtag;
      gtag('js', new Date());
      gtag('config', '${ga4MeasurementId}');
    `}</Script>
  </>;
}
