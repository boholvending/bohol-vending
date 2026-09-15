import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SiteShell, BreadcrumbJson } from "@/components/site-shell";
import { EnquirySection } from "@/components/enquiry-section";
import exhibitionGallery from "@/public/images/partnerships/bohol-exhibition-gallery.webp";
import industryLogos from "@/public/images/partnerships/industry-brand-logos.webp";
import designProduction from "@/public/images/partnerships/bohol-design-production.webp";
import manufacturingShipping from "@/public/images/partnerships/bohol-manufacturing-shipping.webp";
import teamCustomization from "@/public/images/partnerships/bohol-team-customization.webp";
import s from "./company.module.css";

export const metadata: Metadata = {
  title: "About BOHOL | Vending Machine Factory in Guangzhou",
  description: "Explore BOHOL’s Guangzhou factory, production workshop, credentials and exhibition gallery. OEM/ODM vending machines configured for international markets.",
  alternates: { canonical: "/about" },
  keywords: ["BOHOL vending machine manufacturer", "vending machine factory Guangzhou", "OEM ODM vending machines", "global vending machine supplier", "Panyu China manufacturing"],
  openGraph: { title: "Meet BOHOL. Your vending manufacturing partner.", images: ["/images/bohol-guangzhou-factory.webp"] },
};
export default function AboutPage() {
  const organization = { "@context": "https://schema.org", "@type": "Organization", name: "BOHOL", url: "https://www.boholvending.com", email: "sales@boholvending.com", telephone: "+86 19128839757", address: { "@type": "PostalAddress", streetAddress: "10 Shilian Road, Yongshan Village", addressLocality: "Panyu District, Guangzhou", addressRegion: "Guangdong", addressCountry: "CN" } };
  return <SiteShell>
    <BreadcrumbJson items={[{name:"Home",url:"https://www.boholvending.com"},{name:"About BOHOL",url:"https://www.boholvending.com/about"}]}/>
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(organization)}}/>
    <main className={s.page}>
      <section className={s.hero} id="company">
        <div><h1>Your market.<br/>Our factory.<br/><em>Meet BOHOL.</em></h1><p>Intelligent vending machines, made in Guangzhou. We bring product planning, engineering and production together to help your next retail idea take shape.</p><Link className={s.button} href="#enquiry">Talk to our team <ArrowUpRight size={18}/></Link></div>
        <figure className={s.factory}><Image src="/images/bohol-guangzhou-factory.webp" alt="BOHOL factory exterior in Guangzhou" width={1400} height={875} sizes="(max-width:800px) 100vw, 55vw" preload/><figcaption>BOHOL · Panyu, Guangzhou, China</figcaption></figure>
      </section>
      <nav className={s.sectionNav} aria-label="Company sections">{[["company","Company"],["workshop","Production"],["credentials","Credentials"],["exhibitions","Exhibitions"],["brands","Product brands"]].map(([id,label])=><a href={`#${id}`} key={id}>{label}<ArrowUpRight size={14}/></a>)}</nav>
      <section className={s.profile}>
        <div><h2>A direct connection<br/>to the factory.</h2><p>Based in Panyu, Guangzhou, BOHOL designs and manufactures vending machines for brand owners, distributors and retail operators. Our range covers drinks, beauty products, cards and specialist retail formats.</p><p>We start with what you sell, where you operate and how customers pay. From cabinet finishes and product delivery to touchscreen interfaces, our OEM/ODM team turns those requirements into a practical machine configuration.</p><Link className={s.textLink} href="/oem-odm">Explore OEM &amp; ODM <ArrowUpRight size={17}/></Link></div>
        <div className={s.profileSide}><Image src="/images/partnerships/bohol-reception.png" alt="BOHOL reception area and vending machine display" width={1312} height={1199} sizes="(max-width:800px) 100vw, 40vw"/><dl>{[["8 years","Manufacturing experience"],["20,000 m²","Production facility"],["72 hours","Aging tests"],["30+ countries","Markets served"]].map(([value,label])=><div key={label}><dt>{value}</dt><dd>{label}</dd></div>)}</dl></div>
      </section>
      <section className={s.workshop} id="workshop">
        <div className={s.sectionHead}><h2>From your first idea<br/>to a machine ready to ship.</h2><p>Step inside BOHOL. Explore the design work, manufacturing stages and people behind a vending machine built around your products, your brand and your market.</p></div>
        <div className={s.productionStories}>
          {[
            {image:designProduction,source:"bohol-design-production.png",title:"Designed around what you sell.",text:"Every project starts with the details: product dimensions, cabinet layout and the way customers shop. Our team translates your requirements into engineering drawings and a practical production plan.",points:["Cabinet layout and product channels","Engineering drawings and configuration","Workshop assembly and machine preparation"],alt:"Vending machine engineering drawings and BOHOL workshop assembly areas"},
            {image:manufacturingShipping,source:"bohol-manufacturing-shipping.png",title:"Built with care. Prepared for the journey.",text:"Follow the process from metal fabrication and component installation to machine checks and protective packing. Shipping preparation brings the finished machine one step closer to your location.",points:["Metal fabrication and component assembly","Operation checks before packing","Protective wrapping, crating and loading"],alt:"Metalworking, vending machine assembly, inspection, protective packaging and container loading"},
            {image:teamCustomization,source:"bohol-team-customization.png",title:"Your brand, brought to life.",text:"Work directly with the people coordinating your project. From the first conversation to the finish on the cabinet, we help connect your commercial goals with the details of your machine.",points:["Direct project communication","Exterior colours and branded finishes","Machine configurations for your product range"],alt:"BOHOL office, project meeting and vending machines in a range of branded cabinet finishes"},
          ].map(item=><article className={s.productionStory} key={item.source}>
            <a className={s.productionImage} href={`/images/partnerships/${item.source}`} target="_blank" rel="noreferrer" aria-label={`View full image: ${item.alt}`}><Image src={item.image} alt={item.alt} sizes="(max-width:800px) 100vw, 60vw"/><span>View full image <ArrowUpRight size={16}/></span></a>
            <div className={s.productionCopy}><h3>{item.title}</h3><p>{item.text}</p><ul>{item.points.map(point=><li key={point}>{point}</li>)}</ul></div>
          </article>)}
        </div>
        <div className={s.productionContact}><p>Have a product in mind? Let’s work out the right machine.</p><Link className={s.button} href="#enquiry">Discuss your project <ArrowUpRight size={18}/></Link></div>
      </section>
      <section className={s.credentials} id="credentials"><div className={s.sectionHead}><h2>Quality you can see.</h2><p>Review our company credentials and discuss the documentation required for your machine and destination market.</p></div><a className={s.certificate} href="/images/bohol-certification-banner.png" target="_blank" rel="noreferrer"><Image src="/images/bohol-certification-banner.png" alt="BOHOL company certificates and qualifications" width={2172} height={724} sizes="100vw"/><span>View certificates at full size <ArrowUpRight size={17}/></span></a><div className={s.documentLinks}><span>Quality management</span><span>Product conformity</span><span>Company qualifications</span><Link href="/contact">Request documentation <ArrowUpRight size={17}/></Link></div></section>
      <section className={s.exhibitions} id="exhibitions">
        <div className={s.sectionHead}><h2>Good partnerships<br/>start with a conversation.</h2><p>Get closer to the machines—and the people behind them. Meet BOHOL to explore product ideas, discuss your market and find the right direction for your next vending project.</p></div>
        <a className={s.expoImage} href="/images/partnerships/bohol-exhibition-gallery.webp" target="_blank" rel="noreferrer" aria-label="View the full BOHOL exhibition gallery"><Image src={exhibitionGallery} alt="BOHOL exhibition gallery showing product displays, team conversations and visitor meetings" sizes="(max-width:1600px) 100vw, 1440px"/><span>Explore the exhibition gallery <ArrowUpRight size={18}/></span></a>
        <div className={s.expoFooter}><div><h3>Bring your ideas. Meet your team.</h3><p>Talk through machine formats, branded finishes and payment options with us. Share your requirements before a meeting so we can make the conversation useful.</p></div><a className={s.button} href="https://wa.me/8619128839757" target="_blank" rel="noreferrer">Arrange a meeting <ArrowUpRight size={18}/></a></div>
      </section>
      <section className={s.payments} id="brands">
        <div className={s.brandIntro}><div className={s.industryLogos}><Image src={industryLogos} alt="Industry brand references: RELX, Joyetech, OVALE, NAYAX, SMOK, VTV, SIGELEI, JABIL, Samsung and Walmart" sizes="(max-width:800px) 100vw, 788px"/></div><div className={s.brandIntroCopy}><h2>Connected industries.<br/>New retail possibilities.</h2><p>Products, payment technology and retail experiences come together in modern vending. Discuss your product range and integration requirements with BOHOL to shape the right solution for your market.</p></div></div>
        <div className={s.brandClosing}><div><h3>Your assortment. Your market.</h3><p>Share your product sizes, packaging and temperature requirements. We’ll help you assess channels, capacity and delivery options.</p></div><Link className={s.button} href="#enquiry">Plan your product range <ArrowUpRight size={18}/></Link></div>
        <p className={s.paymentNote}>Brand logos are industry references and do not imply a partnership or endorsement. Product and integration compatibility must be confirmed for each configuration.</p>
      </section>
      <EnquirySection/>
    </main>
  </SiteShell>;
}
