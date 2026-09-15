import Image from "next/image";
import styles from "./why-bohol.module.css";

const benefits = [
  { title: "Fit the right location", text: "Choose a cabinet format and exterior finish that suit your space, from compact retail corners to dedicated vending areas." },
  { title: "Make products stand out", text: "Clear product displays and configurable touchscreen layouts help shoppers explore your range and choose with confidence." },
  { title: "Build a flexible range", text: "Match channels and product capacity to your assortment, with options for drinks, beauty products and other specialist goods." },
  { title: "Configure your payments", text: "Select payment options for your target market and review electrical and connectivity requirements before production." },
  { title: "Simplify daily operation", text: "Plan stock loading, service access and remote monitoring around the practical needs of your operating team." },
  { title: "Get support that helps", text: "Access guidance on setup, maintenance and troubleshooting, with spare-part support for the equipment you operate." },
];

export function WhyBohol() {
  return <section className={styles.section} id="why-bohol" aria-labelledby="why-bohol-title">
    <h2 id="why-bohol-title">Why choose <span>BOHOL<br />Smart Vending</span></h2>
    <div className={styles.layout}>
      <div className={styles.column}>{benefits.slice(0, 3).map(item => <article key={item.title}><h3>{item.title}</h3><p>{item.text}</p></article>)}</div>
      <figure className={styles.visual}><Image src="/images/catalog/cold-drink-queue-concept.png" alt="International shoppers queue to purchase drinks from a BOHOL vending machine" width={1024} height={1536} sizes="(max-width: 700px) 90vw, (max-width: 1000px) 40vw, 360px" /></figure>
      <div className={styles.column}>{benefits.slice(3).map(item => <article key={item.title}><h3>{item.title}</h3><p>{item.text}</p></article>)}</div>
    </div>
  </section>;
}
