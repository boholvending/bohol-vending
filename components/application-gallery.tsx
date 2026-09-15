import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import styles from "./application-gallery.module.css";

const scenes = [
  { image: "lobby", title: "A refreshment stop in the lobby.", description: "Explore a drinks vending layout for shared entrances and waiting areas." },
  { image: "lounge", title: "Refreshments beside the lounge.", description: "Consider how vending can fit alongside an existing break area." },
  { image: "office", title: "Everyday drinks at the workplace.", description: "Plan a convenient drinks point for staff and visitors." },
];

export function ApplicationGallery() {
  return (
    <section className={styles.section} id="application-scenarios" aria-labelledby="application-heading">
      <header className={styles.header}>
        <h2 id="application-heading">Picture BOHOL<br />in your space.</h2>
        <p>Application concepts for lobbies, shared lounges and workplaces.</p>
      </header>
      <div className={styles.gallery}>
        {scenes.map((scene) => (
          <figure className={styles.scene} key={scene.image}>
            <a className={styles.imageLink} href={`/images/scenarios/${scene.image}.webp`} target="_blank" rel="noopener noreferrer" aria-label={`View full image: ${scene.title} (opens in new tab)`}>
              <Image src={`/images/scenarios/${scene.image}.webp`} alt={`AI-generated BOHOL vending application concept: ${scene.title}`} width={1440} height={1080} sizes="(max-width: 767px) 100vw, 60vw" />
            </a>
            <figcaption>
              <h3>{scene.title}</h3>
              <p>{scene.description}</p>
            </figcaption>
          </figure>
        ))}
      </div>
      <footer className={styles.footer}>
        <p>These edited images illustrate possible applications, not completed BOHOL customer projects. People shown are fictional.</p>
        <Link href="#enquiry">Discuss your location <ArrowUpRight size={18} aria-hidden="true" /></Link>
      </footer>
    </section>
  );
}
