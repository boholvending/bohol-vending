"use client";
import Image from "next/image";
import {ChevronRight} from "lucide-react";
import {useEffect,useState} from "react";
const slides=[
 {index:"01",name:"Vape Vending Machine",kicker:"Age-aware retail",accent:"#58d9f9",image:"/images/hero/vape-machine-bohol-studio.webp",slug:"vape-vending-machine"},
 {index:"02",name:"Cold Drink Vending Machine",kicker:"Precision cooling",accent:"#a9f470",image:"/images/hero/cold-drink-machine-bohol-studio.webp",slug:"cold-drink-vending-machine"},
 {index:"03",name:"Elevator Vending Machine",kicker:"Careful product delivery",accent:"#ffc665",image:"/images/hero/elevator-machine-bohol-studio.webp",slug:"elevator-vending-machine"},
 {index:"04",name:"Eyelash Vending Machine",kicker:"Beauty, automated",accent:"#ff91c8",image:"/images/hero/eyelash-machine-bohol-studio-v2.webp",slug:"eyelash-vending-machine"},
];
export function HeroSlider(){const[active,setActive]=useState(0);useEffect(()=>{const t=setInterval(()=>setActive(v=>(v+1)%slides.length),6500);return()=>clearInterval(t)},[]);return <><div className="product-stage" aria-live="polite"><div className="stage-glow"/>{slides.map((s,i)=><Image key={s.image} className={`hero-product ${i===active?"is-active":""}`} src={s.image} alt={`${s.name} 3D product render`} width={1024} height={1536} priority={i===0} sizes="(max-width: 700px) 70vw, 38vw"/>)}<p className="visual-note">{slides[active].name.toUpperCase()}<br/><span>3D PRODUCT VISUAL</span></p></div><div className="hero-rail">{slides.map((s,i)=><button onClick={()=>setActive(i)} className={i===active?"active":""} key={s.name} style={{"--accent":s.accent} as React.CSSProperties}><span>{s.index}</span><div><small>{s.kicker}</small><strong>{s.name}</strong></div><ChevronRight size={17}/></button>)}</div></>}
