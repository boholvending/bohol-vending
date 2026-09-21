"use client";

import Image from "next/image";
import { ArrowUpRight, Building2, Factory, Expand, Minus, Plus, RotateCcw } from "lucide-react";
import { useRef, useState } from "react";
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
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const viewer = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; y: number; px: number; py: number } | null>(null);
  const [notice, setNotice] = useState("");
  const reset = () => { setZoom(1); setPosition({ x: 0, y: 0 }); };
  const select = (index: number) => { setActive(index); reset(); };
  const bound = (value: number) => Math.max(-(zoom - 1) * 50, Math.min((zoom - 1) * 50, value));
  const scene = scenes[active];

  return (
    <section className={styles.section} aria-labelledby="factory-vr-heading">
      <div className={styles.copy}>
        <h2 id="factory-vr-heading">A closer look inside BOHOL.</h2>
        <p>
          Explore the factory exterior, showroom and workshop through photographs.
          Zoom in and drag to discover the details, or open a full-screen view.
        </p>
      </div>

      <div className={styles.shell}>
        <div className={styles.controls} role="group" aria-label="Factory photo scenes">
          {scenes.map((item, index) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={index === active}
              className={index === active ? styles.active : undefined}
              onClick={() => select(index)}
            >
              {item.title}
            </button>
          ))}
        </div>

        <div
          className={styles.viewer}
          ref={viewer}
        >
          <div className={styles.frame} tabIndex={0} role="group" aria-label="Photo viewer. Zoom with the controls, then drag or use arrow keys."
          style={{ touchAction: zoom > 1 ? "none" : "pan-y" }}
          onKeyDown={event => {
            if (!event.key.startsWith("Arrow")) return;
            event.preventDefault();
            setPosition(p => ({ x: bound(p.x + (event.key === "ArrowLeft" ? 5 : event.key === "ArrowRight" ? -5 : 0)), y: bound(p.y + (event.key === "ArrowUp" ? 5 : event.key === "ArrowDown" ? -5 : 0)) }));
          }}
          onPointerDown={event => {
            if (zoom <= 1 || event.button !== 0) return;
            event.currentTarget.setPointerCapture(event.pointerId);
            drag.current = { x: event.clientX, y: event.clientY, px: position.x, py: position.y };
          }}
          onPointerMove={(event) => {
            if (!drag.current) return;
            const rect = event.currentTarget.getBoundingClientRect();
            setPosition({ x: bound(drag.current.px + (event.clientX - drag.current.x) / rect.width * 100), y: bound(drag.current.py + (event.clientY - drag.current.y) / rect.height * 100) });
          }}
          onPointerUp={() => { drag.current = null; }} onPointerCancel={() => { drag.current = null; }} onLostPointerCapture={() => { drag.current = null; }}>
            <Image
              key={scene.image}
              src={scene.image}
              alt={scene.alt}
              fill
              sizes="(max-width: 900px) 100vw, 980px"
              className={styles.image}
              draggable={false}
              style={{ transform: `translate(${position.x}%, ${position.y}%) scale(${zoom})` }}
            />
          </div>
            <div className={styles.tools}>
              <span>{zoom > 1 ? "Drag to explore" : "Zoom to explore"}</span>
              <button aria-label="Zoom out" disabled={zoom <= 1} onClick={() => { setZoom(z => Math.max(1, z - .25)); setPosition({ x: 0, y: 0 }); }}><Minus size={18} /></button>
              <output aria-label="Zoom level">{Math.round(zoom * 100)}%</output>
              <button aria-label="Zoom in" disabled={zoom >= 2.5} onClick={() => setZoom(z => Math.min(2.5, z + .25))}><Plus size={18} /></button>
              <button aria-label="Reset view" onClick={reset}><RotateCcw size={18} /></button>
              <button aria-label="Toggle full screen" onClick={async () => {
                try {
                  if (document.fullscreenElement) await document.exitFullscreen();
                  else if (viewer.current?.requestFullscreen) await viewer.current.requestFullscreen();
                  else setNotice("Full screen is unavailable in this browser. You can still zoom and drag here.");
                } catch { setNotice("Full screen is unavailable. You can still zoom and drag here."); }
              }}><Expand size={18} /></button>
            </div>
            {notice && <p role="status">{notice}</p>}
            <div className={styles.caption}>
              <small>{scene.point}</small>
              <h3>{scene.title}</h3>
              <p>{scene.text}</p>
            </div>
        </div>

        <div className={styles.thumbs}>
          {scenes.map((item, index) => (
            <button
              key={item.id}
              type="button"
              className={index === active ? styles.selectedThumb : undefined}
              onClick={() => select(index)}
              aria-pressed={index === active}
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
