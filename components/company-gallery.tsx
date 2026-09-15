"use client";
import { useState } from "react";
import Image from "next/image";
import type { CompanyPhoto } from "@/lib/company-media";
import s from "@/app/about/company.module.css";
export function CompanyGallery({items,exhibition=false}:{items:CompanyPhoto[];exhibition?:boolean}){
 const [expanded,setExpanded]=useState(false);
 return <><div className={`${s.gallery} ${exhibition?s.exhibitionGallery:""}`} data-count={Math.min(items.length,3)}>{(expanded?items:items.slice(0,6)).map(item=><figure key={item.src}><a href={item.src} target="_blank" rel="noreferrer" aria-label={`View full image: ${item.title}`}><Image src={item.src} alt={item.title} width={1200} height={800} sizes="(max-width:600px) 100vw, (max-width:1000px) 50vw, 40vw"/></a><figcaption><h3>{item.title}</h3><p>{item.caption}</p></figcaption></figure>)}</div>{items.length>6&&<button className={s.galleryButton} aria-expanded={expanded} onClick={()=>setExpanded(!expanded)}>{expanded?"Show fewer photos":`View all ${items.length} photos`}</button>}</>;
}
