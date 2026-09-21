"use client";

import Image from "next/image";
import { ArrowUpRight, Building2, Factory, ScanSearch } from "lucide-react";
import { useState } from "react";
import styles from "./factory-vr-showcase.module.css";

const scenes = [
  {
    id: "outside",
    title: "Factory Exterior",
    label: "工厂外景",
    image: "/images/bohol-guangzhou-factory.webp",
    alt: "BOHOL factory exterior in Guangzhou",
    text: "Start outside the BOHOL manufacturing base and understand the source-direct factory profile.",
    point: "Panyu, Guangzhou",
  },
  {
    id: "showroom",
    title: "Showroom",
    label: "展厅",
    image: "/images/partnerships/bohol-reception.webp",
    alt: "BOHOL reception and showroom with vending machine display",
    text: "Step into the reception and showroom area where product formats, finishes and cooperation details are introduced.",
    point: "Product display",
  },
  {
    id: "workshop",
    title: "Production Workshop",
    label: "生产车间",
    image: "/images/partnerships/bohol-factory.webp",
    alt: "BOHOL production workshop with vending machines in assembly",
    text: "Look across the production floor, assembly area and machine preparation workflow.",
    point: "Assembly area",
  },
];

export function FactoryVrShowcase() {
  const [active, setActive] = useState(0);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const scene = scenes[active];

  return (
    <section className={styles.section} aria-labelledby="factory-vr-heading">
      <div className={styles.copy}>
        <span>3D / VR FACTORY VIEW</span>
        <h2 id="factory-vr-heading">Walk through BOHOL before you visit.</h2>
        <p>
          Switch between the factory exterior, showroom and production workshop.
          Move your cursor across the viewer for a light 3D perspective effect.
        </p>
      </div>

      <div className={styles.shell}>
        <div className={styles.controls} role="tablist" aria-label="Factory VR scenes">
          {scenes.map((item, index) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={index === active}
              className={index === active ? styles.active : undefined}
              onClick={() => setActive(index)}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              {item.label}
            </button>
          ))}
        </div>

        <div
          className={styles.viewer}
          onMouseMove={(event) => {
            const rect = event.currentTarget.getBoundingClientRect();
            const px = (event.clientX - rect.left) / rect.width - 0.5;
            const py = (event.clientY - rect.top) / rect.height - 0.5;
            setTilt({ x: py * -7, y: px * 9 });
          }}
          onMouseLeave={() => setTilt({ x: 0, y: 0 })}
        >
          <div className={styles.frame} style={{ "--rx": `${tilt.x}deg`, "--ry": `${tilt.y}deg` } as React.CSSProperties}>
            <Image
              key={scene.image}
              src={scene.image}
              alt={scene.alt}
              fill
              sizes="(max-width: 900px) 100vw, 980px"
              className={styles.image}
            />
            <div className={styles.scan} />
            <div className={styles.badge}>
              <ScanSearch size={18} aria-hidden="true" />
              VR scene
            </div>
            <div className={styles.caption}>
              <small>{scene.point}</small>
              <h3>{scene.title}</h3>
              <p>{scene.text}</p>
            </div>
          </div>
        </div>

        <div className={styles.thumbs}>
          {scenes.map((item, index) => (
            <button
              key={item.id}
              type="button"
              className={index === active ? styles.selectedThumb : undefined}
              onClick={() => setActive(index)}
              aria-label={`Open ${item.title} scene`}
            >
              <Image src={item.image} alt="" width={260} height={160} sizes="160px" />
              <span>{index === 0 ? <Building2 size={16} /> : <Factory size={16} />}{item.title}</span>
            </button>
          ))}
        </div>
      </div>

      <a className={styles.link} href="/about">
        View full company profile <ArrowUpRight size={17} aria-hidden="true" />
      </a>
    </section>
  );
}
