"use client";

import Image from "next/image";
import { Expand, X } from "lucide-react";
import { useEffect, useState } from "react";

type GalleryImage = { src: string; alt: string };

export function ProductGallery({ images, productName }: { images: GalleryImage[]; productName: string }) {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const current = images[active] || images[0];
  if (!current) return null;

  return <>
    <div className="product-commerce-gallery">
    {images.length > 1 && <div className="product-gallery-strip" role="list" aria-label={`${productName} image gallery`}>
      {images.map((image, index) => <button className={index === active ? "is-active" : ""} type="button" onClick={() => setActive(index)} key={`${image.src}-${index}`} aria-label={`Show image ${index + 1}: ${image.alt}`} aria-pressed={index === active}>
        <Image src={image.src} alt="" width={240} height={180} sizes="(max-width:560px) 22vw, 84px" />
      </button>)}
    </div>}
    <button className="product-main-image" type="button" onClick={() => setOpen(true)} aria-label={`View ${current.alt} at full size`}>
      <span className="image-index">BOHOL / PRODUCT</span>
      <Image src={current.src} alt={current.alt} width={1200} height={1200} priority sizes="(max-width:900px) 100vw, 48vw" />
      <span className="image-zoom"><Expand size={17} /> View full image</span>
      <span className="image-caption">ENGINEERED FOR GLOBAL RETAIL</span>
    </button>
    </div>
    {open && <div className="product-lightbox" role="dialog" aria-modal="true" aria-label={`${productName} full-size image`} onClick={() => setOpen(false)}>
      <button type="button" onClick={() => setOpen(false)} aria-label="Close full-size image"><X size={24} /></button>
      <div onClick={(event) => event.stopPropagation()}><Image src={current.src} alt={current.alt} width={1800} height={1800} sizes="96vw" /></div>
    </div>}
  </>;
}
