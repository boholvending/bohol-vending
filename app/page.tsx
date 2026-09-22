import Link from "next/link";
import type { Metadata } from "next";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import { HeroCarousel } from "@/components/hero-carousel";
import { HomeSections } from "@/components/home-sections";
import { HomeFooter } from "@/components/home-footer";
import { LanguageSwitcher } from "@/components/language-switcher";
import { MainNavigation } from "@/components/main-navigation";
import { BrandLogo } from "@/components/brand-logo";

export const metadata: Metadata = {
  title: "Vending Machine Manufacturer | Custom Vending Solutions",
  description:
    "BOHOL is a vending machine manufacturer for custom vending, smart vending machines, OEM vending projects and global automated retail deployments.",
  keywords: [
    "vending",
    "vending machine",
    "vending machine manufacturer",
    "custom vending machine",
    "smart vending",
    "OEM vending machine",
    "China vending machine factory",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title: "Vending Machine Manufacturer | BOHOL",
    description:
      "Custom vending machines and smart vending solutions engineered by BOHOL for brands, distributors and operators worldwide.",
    images: ["/og.webp"],
  },
  twitter: {
    title: "Vending Machine Manufacturer | BOHOL",
    description: "Custom vending machines and smart vending solutions for global retail.",
    images: ["/og.webp"],
  },
};
function Header() {
  return (
    <header
      className="site-header"
      style={{
        background: "#fff",
        color: "#071014",
        borderBottom: "1px solid #d9dede",
      }}
    >
      <Link className="brand" href="/" aria-label="BOHOL home">
        <BrandLogo />
      </Link>
      <MainNavigation />
      <div className="header-actions">
        <LanguageSwitcher />
        <Link className="quote" href="/contact">
          Get a Quote <ArrowUpRight size={15} />
        </Link>
      </div>
    </header>
  );
}
export default function Home() {
  return (
    <main>
      <Header />
      <section className="hero">
        <div className="hero-grid" />
        <div className="hero-copy">
          <p className="eyebrow">
            <span /> Vending machine manufacturer for global retail.
          </p>
          <h1>
            Vending
            <br />
            without <em>limits.</em>
          </h1>
          <p className="lead">
            BOHOL engineers custom vending machines, smart vending systems and
            OEM vending solutions for brands, distributors and operators.
          </p>
          <div className="hero-cta">
            <Link className="primary-button" href="/vending-machines">
              Explore machines <ArrowUpRight size={18} />
            </Link>
            <Link className="text-link" href="/vending">
              Why BOHOL vending <ChevronRight size={17} />
            </Link>
            <Link className="text-link" href="/oem-odm">
              Build a custom machine <ChevronRight size={17} />
            </Link>
          </div>
          <div className="proof">
            <span>
              <b>8</b> years manufacturing
            </span>
            <span>
              <b>30+</b> countries served
            </span>
            <span>
              <b>24h</b> engineering response
            </span>
          </div>
        </div>
        <HeroCarousel />
      </section>
      <HomeSections />
      <HomeFooter />
    </main>
  );
}
