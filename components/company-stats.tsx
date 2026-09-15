"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./home-company.module.css";

const stats = [
  { value: 8, suffix: "", label: "Years of manufacturing experience" },
  { value: 20000, suffix: "+ m²", label: "Modern manufacturing facility" },
  { value: 72, suffix: "h", label: "Mandatory aging test" },
  { value: 30, suffix: "+", label: "Countries served worldwide" },
];

export function CompanyStats() {
  const root = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const node = root.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      const start = performance.now();
      const duration = 2200;
      const tick = (now: number) => {
        const elapsed = Math.min((now - start) / duration, 1);
        setProgress(1 - Math.pow(1 - elapsed, 3));
        if (elapsed < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.35 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return <div ref={root} className={styles.companyStats}>
    {stats.map((stat, index) => {
      const current = Math.round(stat.value * progress);
      return <article key={stat.label}>
        <span className={styles.statIndex}>0{index + 1}</span>
        <strong>{current.toLocaleString("en-US")}<small>{stat.suffix}</small></strong>
        <span className={styles.statLabel}>{stat.label}</span>
      </article>;
    })}
  </div>;
}
