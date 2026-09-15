import Link from "next/link";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import { HeroCarousel } from "@/components/hero-carousel";
import { HomeSections } from "@/components/home-sections";
import { HomeFooter } from "@/components/home-footer";
import { LanguageSwitcher } from "@/components/language-switcher";
import { MainNavigation } from "@/components/main-navigation";
import { BrandLogo } from "@/components/brand-logo";
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
            <span /> Intelligent vending. Built around your business.
          </p>
          <h1>
            Retail
            <br />
            without <em>limits.</em>
          </h1>
          <p className="lead">
            From concept to global deployment, BOHOL engineers specialized
            vending machines that move your business forward.
          </p>
          <div className="hero-cta">
            <Link className="primary-button" href="/vending-machines">
              Explore machines <ArrowUpRight size={18} />
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
