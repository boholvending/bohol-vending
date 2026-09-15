"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export function ProductTilt() {
  const frame = useRef<number | null>(null);
  const stage = useRef<HTMLDivElement>(null);
  const [turning, setTurning] = useState(false);

  useEffect(() => {
    const node = stage.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setTurning(true);
        observer.disconnect();
      }
    }, { threshold: 0.45 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  function move(event: React.PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "touch") return;
    const target = event.currentTarget;
    const rect = target.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    if (frame.current) cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      target.style.setProperty("--tilt-x", `${(-y * 8).toFixed(2)}deg`);
      target.style.setProperty("--tilt-y", `${(x * 11).toFixed(2)}deg`);
      target.style.setProperty("--light-x", `${50 + x * 28}%`);
      target.style.setProperty("--light-y", `${48 + y * 20}%`);
    });
  }

  function reset(event: React.PointerEvent<HTMLDivElement>) {
    const target = event.currentTarget;
    target.style.setProperty("--tilt-x", "0deg");
    target.style.setProperty("--tilt-y", "0deg");
    target.style.setProperty("--light-x", "50%");
    target.style.setProperty("--light-y", "48%");
  }

  return (
    <div ref={stage} className={`system-machine-visual${turning ? " is-turning" : ""}`} onPointerMove={move} onPointerLeave={reset}>
      <div className="system-orbit" aria-hidden="true" />
      <div className="system-machine-model" onAnimationEnd={() => setTurning(false)}>
        <Image
          src="/images/vape-system-3d-unbranded-v2.webp"
          alt="BOHOL automatic electronic cigarette vending machine 3D product view"
          width={443}
          height={1000}
          sizes="(max-width: 900px) 88vw, 42vw"
        />
      </div>
      <div className="system-visual-label">
        <span>SMART VAPE RETAIL</span>
        <strong>Automatic Electronic Cigarette Vending Machine</strong>
      </div>
    </div>
  );
}
