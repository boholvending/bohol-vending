"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CheckCircle2, ChevronDown, Star } from "lucide-react";
import type { ProductRecord } from "@/lib/keystatic-content";
import s from "./product-browser.module.css";

type Filter = "all" | "drinks" | "beauty" | "collectibles" | "restricted" | "gentle";
type Preference = "all" | "brand" | "operator" | "distributor" | "premium" | "compact";

const productMeta:Record<string,{filter:Filter;preferences:Preference[];rating:string;badge:string;focus:string[];bestFor:string}>={
  "vape-vending-machine":{filter:"restricted",preferences:["operator","distributor","premium"],rating:"High fit",badge:"Compliance-ready",focus:["Age-verification integrations","Remote stock monitoring","Specialty retail branding"],bestFor:"Specialty operators"},
  "cold-drink-vending-machine":{filter:"drinks",preferences:["operator","distributor"],rating:"Popular",badge:"Fast-moving category",focus:["Stable 2-8°C cooling","Temperature alerts","High-capacity beverage layout"],bestFor:"Food & beverage routes"},
  "elevator-vending-machine":{filter:"gentle",preferences:["brand","premium"],rating:"Recommended",badge:"Protects fragile goods",focus:["Elevator delivery","Large pickup bay","Flexible shelf geometry"],bestFor:"Premium and fragile products"},
  "eyelash-vending-machine":{filter:"beauty",preferences:["brand","compact","premium"],rating:"Strong visual appeal",badge:"Beauty retail",focus:["Compact storefront","Illuminated display","Custom brand finish"],bestFor:"Beauty brands and malls"},
  "card-vending-machine":{filter:"collectibles",preferences:["brand","operator","compact"],rating:"New category",badge:"Collectibles ready",focus:["Trading-card channels","Secure cabinet display","Touchscreen payment flow"],bestFor:"Card shops and pop-ups"},
};

const filters:{id:Filter;label:string;note:string}[]=[
  {id:"all",label:"All machines",note:"5 categories"},
  {id:"drinks",label:"Food & beverage",note:"Cold drink"},
  {id:"beauty",label:"Beauty retail",note:"Eyelash"},
  {id:"collectibles",label:"Cards & collectibles",note:"Card vending"},
  {id:"restricted",label:"Age-restricted",note:"Vape"},
  {id:"gentle",label:"Gentle delivery",note:"Elevator"},
];

const preferences:{id:Preference;label:string}[]=[
  {id:"all",label:"Any buying need"},
  {id:"brand",label:"Brand owners"},
  {id:"operator",label:"Operators"},
  {id:"distributor",label:"Distributors"},
  {id:"premium",label:"Premium products"},
  {id:"compact",label:"Compact retail"},
];

export function ProductBrowser({products}:{products:ProductRecord[]}){
  const [filter,setFilter]=useState<Filter>("all");
  const [preference,setPreference]=useState<Preference>("all");
  const [query,setQuery]=useState("");
  useEffect(()=>{
    const category=new URLSearchParams(window.location.search).get("category");
    if(category&&filters.some((item)=>item.id===category))setFilter(category as Filter);
  },[]);
  const filtered=products.filter((product)=>{
    const meta=productMeta[product.slug];
    if(!meta)return true;
    const categoryMatch=filter==="all"||meta.filter===filter;
    const preferenceMatch=preference==="all"||meta.preferences.includes(preference);
    return categoryMatch&&preferenceMatch&&`${product.name} ${product.summary} ${product.category}`.toLowerCase().includes(query.toLowerCase());
  });
  const categories=Array.from(new Set(products.map(product=>product.category)));

  return <section className={s.browser} aria-label="Product selector">
    <div className={s.dropdownRow}>
      <label className={s.selectBox}>
        <span>Product category</span>
        <select value={filter} onChange={(event)=>setFilter(event.target.value as Filter)} aria-label="Product category">
          {filters.map((item)=><option key={item.id} value={item.id}>{item.label} — {item.note}</option>)}
        </select>
        <ChevronDown size={18}/>
      </label>
    </div>

    <div className={s.preferenceBar} aria-label="Buyer preferences">
      <span>Preference</span>
      {preferences.map((item)=><button className={preference===item.id?s.preferenceActive:""} key={item.id} type="button" onClick={()=>setPreference(item.id)}>{item.label}</button>)}
    </div>

    <div className={s.library}><aside className={s.sidebar}><div className={s.sidebarBlock}><h2>Find a machine</h2><label htmlFor="product-search">Search products</label><input id="product-search" type="search" placeholder="Search vending machines" value={query} onChange={event=>setQuery(event.target.value)}/></div><div className={s.sidebarBlock}><h2>Latest products</h2><ol className={s.latestList}>{products.slice(0,5).map(product=><li key={product.slug}><Link href={`/vending-machines/${product.slug}`}>{product.name}</Link><small>{product.category}</small></li>)}</ol></div><div className={s.sidebarBlock}><h2>Product categories</h2><div className={s.categoryList}>{categories.map(category=><button key={category} type="button" onClick={()=>setQuery(category)}>{category}</button>)}</div></div></aside><div className={s.results}><p className={s.resultSummary}>{filtered.length} machines matching your selection</p><div className={s.grid}>
      {filtered.map((product)=>{
        const meta=productMeta[product.slug];
        return <Link className={s.card} href={`/vending-machines/${product.slug}`} key={product.slug}>
          <div className={s.imageWrap}>
            <Image src={product.image} alt={product.name} width={600} height={800} sizes="(max-width:700px) 100vw, 30vw"/>
            <span>{meta?.badge??product.category}</span>
          </div>
          <div className={s.cardBody}>
            <div className={s.cardTop}>
              <small>{product.category}</small>
              <b><Star size={13}/>{meta?.rating??"Recommended"}</b>
            </div>
            <h3>{product.name}</h3>
            <p>{product.summary}</p>
            <div className={s.goodPoints}>
              {(meta?.focus??product.features).slice(0,3).map((point)=><span key={point}><CheckCircle2 size={14}/>{point}</span>)}
            </div>
            <div className={s.cardFooter}>
              <span>{meta?.bestFor??"Configured to order"}</span>
              <b>View machine <ArrowUpRight size={14}/></b>
            </div>
          </div>
        </Link>;
      })}
    </div>{!filtered.length&&<p className={s.empty}>No machines match this search. Try another product or category.</p>}</div></div>
  </section>;
}
