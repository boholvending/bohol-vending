import { ArrowUpRight, Globe2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import styles from "./credentials-preview.module.css";

export function CredentialsPreview() {
  return (
    <section id="credentials" className={styles.section}>
      <div className={styles.heading}>
        <h2>Quality you can see.<br /><span>Partnerships that last.</span></h2>
        <div><p>Explore our documentation and find the right way to work with BOHOL.</p></div>
      </div>
      <div className={styles.certificateBanner}>
        <Image src="/images/bohol-certification-banner.webp" alt="BOHOL certifications and quality credentials" fill sizes="(max-width: 900px) 100vw, 1480px" />
      </div>
      <div id="partnerships" className={styles.partners}>
        <div className={styles.partnerIntro}><Globe2 size={28} strokeWidth={1.5} /><h3>Your market.<br />Our machines.<br />New possibilities.</h3><p>From product planning to production and deployment, BOHOL supports the full vending journey.</p><Link href="/contact">Discuss a partnership <ArrowUpRight size={16} /></Link></div>
        <div className={styles.partnerGrid}>
          {[
            { title: "Plan with a responsive team.", label: "For brand owners", image: "/images/partnerships/bohol-reception.webp", href: "/oem-odm", description: "Direct collaboration from concept to launch", position: "50% 50%" },
            { title: "Build at production scale.", label: "For distributors", image: "/images/partnerships/bohol-factory.webp", href: "/manufacturing", description: "Structured assembly and quality checks", position: "50% 50%" },
            { title: "Showcase your offer globally.", label: "For retail operators", image: "/images/partnerships/bohol-trade-show.webp", href: "/solutions", description: "Confident presentations for international markets", position: "50% 50%" },
            { title: "Deliver repeatable quality.", label: "For integration partners", image: "/images/partnerships/bohol-production.webp", href: "/oem-odm", description: "Consistent output across every production run", position: "50% 50%" },
          ].map(item => <Link className={styles.partnerCard} href={item.href} key={item.label}><Image src={item.image} alt={item.description} fill sizes="(max-width: 600px) 90vw, (max-width: 900px) 45vw, 30vw" style={{objectPosition:item.position}}/><div className={styles.cardCopy}><span>{item.label}</span><strong>{item.title}</strong><p>{item.description}</p></div><ArrowUpRight className={styles.cardArrow} size={20}/></Link>)}
        </div>
      </div>
    </section>
  );
}
