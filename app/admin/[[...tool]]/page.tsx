"use client";

import Link from "next/link";
import { NextStudio } from "next-sanity/studio";
import config from "../../../sanity.config";

export default function AdminStudioPage() {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
    return (
      <main style={{ minHeight: "100vh", padding: "72px clamp(24px, 8vw, 120px)", fontFamily: "Manrope, Arial, sans-serif", background: "#f4f6f5", color: "#071014" }}>
        <p style={{ color: "#1599b6", fontWeight: 800, letterSpacing: ".12em", textTransform: "uppercase" }}>BOHOL admin setup</p>
        <h1 style={{ maxWidth: 780, margin: "18px 0", fontFamily: "Space Grotesk, Arial, sans-serif", fontSize: "clamp(42px, 6vw, 88px)", lineHeight: .92 }}>Sanity backend is installed.</h1>
        <p style={{ maxWidth: 720, color: "#5b696e", fontSize: 17, lineHeight: 1.8 }}>
          To use the new CMS, create or connect a Sanity project and add <code>NEXT_PUBLIC_SANITY_PROJECT_ID</code> plus <code>NEXT_PUBLIC_SANITY_DATASET</code> to the environment.
        </p>
        <div style={{ display: "grid", gap: 12, maxWidth: 780, marginTop: 34 }}>
          <div style={{ padding: 22, background: "#fff", border: "1px solid #cbd4d4" }}><b>Products</b><p>Manage product price, SEO, GEO markets, attributes, specifications, gallery, details, FAQ and downloads.</p></div>
          <div style={{ padding: 22, background: "#fff", border: "1px solid #cbd4d4" }}><b>News & cases</b><p>Publish industry articles, company news and case content with cover images and SEO.</p></div>
          <div style={{ padding: 22, background: "#fff", border: "1px solid #cbd4d4" }}><b>Homepage slides</b><p>Control homepage hero slides and featured product links.</p></div>
        </div>
        <Link href="/keystatic" style={{ display: "inline-flex", marginTop: 34, color: "#071014" }}>Open old local backend as fallback →</Link>
      </main>
    );
  }

  return <NextStudio config={config} />;
}
