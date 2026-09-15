import { EnquirySection } from "./enquiry-section";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Cpu,
  Factory,
  Globe2,
  Headphones,
  ShieldCheck,
  SlidersHorizontal,
  Truck,
} from "lucide-react";
import { getProducts } from "@/lib/keystatic-content";
import { JsonLd } from "./json-ld";
import { faqJsonLd } from "@/lib/seo";
import styles from "./home-company.module.css";
import { ProductTilt } from "./product-tilt";
import { CompanyStats } from "./company-stats";
import { CredentialsPreview } from "./credentials-preview";
import { WhyBohol } from "./why-bohol";
import { ApplicationGallery } from "./application-gallery";
const faqs = [
  {
    q: "What can BOHOL customize?",
    a: "Cabinet dimensions, product channels, cooling, elevator delivery, touchscreen UI, branding, payments, connectivity and software integrations can all be configured around the project.",
  },
  {
    q: "What information is needed for a quotation?",
    a: "Tell us the product type and dimensions, target country, preferred payment methods, estimated quantity and any special functions. Drawings or reference photos are helpful but not required.",
  },
  {
    q: "Can the machines work in our country?",
    a: "We configure voltage, plug, language, payment and connectivity options for the destination market. Compliance requirements are reviewed during project definition.",
  },
  {
    q: "How are machines tested before shipment?",
    a: "Production units follow incoming inspection, assembly checks, functional verification and a final quality review. Project-specific validation can be added for custom builds.",
  },
];
export async function HomeSections() {
  const products = await getProducts();
  return (
    <>
      <section className={styles.companyIntro}>
        <div className={styles.companyBenefits}>
          <article>
            <Headphones />
            <div>
              <h3>24 × 7 Online Support</h3>
              <p>Full after-sales support including remote assistance, training, software upgrades, troubleshooting, maintenance guidance and genuine spare parts.</p>
            </div>
          </article>
          <article>
            <Truck />
            <div>
              <h3>On-Time Delivery</h3>
              <p>Production scheduling and core-component planning help keep your order on track, from confirmed specifications to shipment.</p>
            </div>
          </article>
          <article>
            <BadgeCheck />
            <div>
              <h3>Project Configuration Support</h3>
              <p>Get guidance on machine format, product fit and payment options before confirming your order.</p>
            </div>
          </article>
        </div>
      </section>
      <section className={styles.companyProfile}>
        <div className={styles.companyProfileMain}>
          <div className={styles.factoryPhoto}>
            <Image
              src="/images/bohol-guangzhou-factory.webp"
              alt="BOHOL modern manufacturing facility in Panyu, Guangzhou"
              width={1400}
              height={875}
              sizes="(max-width: 900px) 100vw, 52vw"
            />
          </div>
          <div className={styles.companyProfileCopy}>
            <p className="section-tag">COMPANY PROFILE</p>
            <h2>Source-direct manufacturing from Guangzhou.</h2>
            <p>Based in <strong>Panyu, Guangzhou, Guangdong, China</strong>, BOHOL builds intelligent vending machines for brand owners, distributors and retail operators.</p>
            <p>Work directly with our factory to match your products to the right machine. Explore our company profile for production capabilities, quality standards and international cooperation.</p>
            <div className={styles.companyProfileActions}>
              <Link href="/about">Discover BOHOL <ArrowUpRight size={17} /></Link>
              <Link href="/contact">Contact our team <ArrowRight size={17} /></Link>
            </div>
          </div>
        </div>
        <CompanyStats />
      </section>
      <CredentialsPreview />
      <section className="home-products">
        <div className="section-head">
          <div>
            <p className="section-tag">FEATURED MACHINES</p>
            <h2>
              One platform.
              <br />
              Four opportunities.
            </h2>
          </div>
          <Link className="featured-machines-button" href="/vending-machines">
            View all machines <ArrowUpRight size={16} />
          </Link>
        </div>
        <div className="home-product-grid">
          {products.map((p) => (
            <Link href={`/vending-machines/${p.slug}`} key={p.slug}>
              <div className="home-product-image">
                <Image
                  src={p.image}
                  alt={p.name}
                  width={520}
                  height={760}
                  sizes="(max-width:700px) 100vw, 25vw"
                />
              </div>
              <small>{p.category}</small>
              <h3>{p.name}</h3>
              <ArrowUpRight className="card-arrow" />
            </Link>
          ))}
        </div>
      </section>
      <WhyBohol />
      <section className="dark-system">
        <ProductTilt />
        <div className="system-grid">
          {[
            [
              Cpu,
              "Intelligent control",
              "Cloud-ready telemetry and configurable touchscreen journeys.",
            ],
            [
              SlidersHorizontal,
              "Flexible configuration",
              "Channels, temperature, payment and cabinet format matched to your products.",
            ],
            [
              ShieldCheck,
              "Built for uptime",
              "Serviceable modules, quality checks and remote alerts reduce operational friction.",
            ],
            [
              Globe2,
              "Global deployment",
              "Voltage, language, connectivity and payment support for international markets.",
            ],
          ].map(([Icon, t, d]) => (
            <article key={String(t)}>
              <Icon size={26} />
              <h3>{String(t)}</h3>
              <p>{String(d)}</p>
            </article>
          ))}
        </div>
      </section>
      <ApplicationGallery />
      <section className="faq-band">
        <JsonLd data={faqJsonLd(faqs)} />
        <div>
          <p className="section-tag">FREQUENTLY ASKED</p>
          <h2>
            Start with the
            <br />
            right questions.
          </h2>
          <Link href="/contact">
            Ask something else <ArrowUpRight size={16} />
          </Link>
        </div>
        <div>
          {faqs.map((x, i) => (
            <details key={x.q} open={i === 0}>
              <summary>
                {x.q}
                <span>+</span>
              </summary>
              <p>{x.a}</p>
            </details>
          ))}
        </div>
      </section>
      <EnquirySection />
    </>
  );
}
