"use client";

import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

const slides = [
  { index: "01", name: "Vape Vending Machine", kicker: "Age-aware retail", accent: "#58d9f9", image: "/images/hero/vape-machine-cutout.webp" },
  { index: "02", name: "Cold Drink Vending Machine", kicker: "Precision cooling", accent: "#a9f470", image: "/images/hero/cold-drink-machine-cutout.webp" },
  { index: "03", name: "Elevator Vending Machine", kicker: "Careful product delivery", accent: "#ffc665", image: "/images/hero/elevator-machine-cutout.webp" },
  { index: "04", name: "Eyelash Vending Machine", kicker: "Beauty, automated", accent: "#ff91c8", image: "/images/hero/eyelash-machine-dark-complete.webp", studio: true },
];

export function HeroCarousel() {
  const [active, setActive] = useState(0);
  const activeSlide = slides[active];

  useEffect(() => {
    const timer = setInterval(() => setActive((value) => (value + 1) % slides.length), 6500);
    return () => clearInterval(timer);
  }, []);

  return <>
    <div className={`product-stage ${activeSlide.studio ? "studio-active" : ""}`} aria-live="polite">
      <div className="stage-glow" />
      <Image key={activeSlide.image} className={`hero-product ${activeSlide.studio ? "studio-product" : ""} is-active`} src={activeSlide.image} alt={`${activeSlide.name} product view`} width={1024} height={1536} priority={active === 0} sizes="(max-width: 700px) 70vw, 38vw" />
      <p className="visual-note">{activeSlide.name.toUpperCase()}<br /><span>3D PRODUCT VISUAL</span></p>
    </div>
    <div className="hero-rail">
      {slides.map((slide, index) => <button onClick={() => setActive(index)} className={index === active ? "active" : ""} key={slide.name} style={{ "--accent": slide.accent } as React.CSSProperties}><span>{slide.index}</span><div><small>{slide.kicker}</small><strong>{slide.name}</strong></div><ChevronRight size={17} /></button>)}
    </div>
  </>;
}
