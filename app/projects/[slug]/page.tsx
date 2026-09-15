import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteShell, BreadcrumbJson } from "@/components/site-shell";
import { StoryContent } from "@/components/story-content";
import { stories } from "@/lib/stories";
const kind = "projects";
const base = process.env.NEXT_PUBLIC_SITE_URL || "https://www.boholvending.com";
const projectSeo:Record<string,{image:string;keywords:string[]}>={
  "office-smart-store":{image:"/images/cases/office-smart-store-bohol.png",keywords:["office vending machine USA","workplace micro market","smart vending machine supplier"]},
  "apartment-lobby-vending":{image:"/images/cases/apartment-lobby-bohol.png",keywords:["apartment vending machine Canada","condo vending solution","residential smart store"]},
  "hotel-lobby-vending":{image:"/images/cases/hotel-lobby-bohol.png",keywords:["hotel vending machine Europe","lobby vending solution","travel essentials vending"]},
  "gym-vending":{image:"/images/cases/gym-smart-store-bohol.png",keywords:["gym vending machine UAE","fitness vending solution","protein drink vending"]},
  "hospital-vending":{image:"/images/cases/hospital-bohol.png",keywords:["hospital vending machine Singapore","healthcare vending solution","visitor vending"]},
  "school-campus-vending":{image:"/images/cases/school-bohol.png",keywords:["school vending machine Australia","campus vending solution","university smart vending"]},
  "public-building-vending":{image:"/images/cases/government-bohol.png",keywords:["public building vending Germany","municipal vending machine","waiting area vending"]},
  "commercial-breakroom-vending":{image:"/images/cases/breakroom.jpg",keywords:["breakroom vending UK","office snack vending machine","commercial vending solution"]},
  "residential-tower-vending":{image:"/images/cases/residential-lobby.jpg",keywords:["residential tower vending Australia","premium lobby vending","apartment smart store"]},
  "dessert-bakery-vending":{image:"/images/cases/dessert-retail.jpg",keywords:["dessert vending machine France","bakery vending solution","refrigerated food vending"]},
  "customer-pickup-vending":{image:"/images/cases/customer-buying.jpg",keywords:["retail vending machine USA","customer pickup vending","cashless smart vending"]},
  "distributor-showroom-vending":{image:"/images/cases/market-wall.jpg",keywords:["vending machine distributor","OEM vending machine China","custom vending cabinet"]},
};
export function generateStaticParams(){return Object.keys(stories[kind]).map(slug=>({slug}));}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{
  const {slug}=await params; const p=stories[kind][slug]; if(!p)return {};
  const seo=projectSeo[slug];
  return {title:p.title.en,description:p.intro.en,keywords:seo?.keywords,alternates:{canonical:`/${kind}/${slug}`,languages:{en:`/${kind}/${slug}`,"zh-CN":`/zh/${kind}/${slug}`}},openGraph:{title:p.title.en,description:p.intro.en,images:seo?.image?[seo.image]:[]},twitter:{title:p.title.en,description:p.intro.en,images:seo?.image?[seo.image]:[]}};
}
export default async function Page({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params; const p=stories[kind][slug]; if(!p)notFound();
  const data={"@context":"https://schema.org","@type":"WebPage",name:p.title.en,description:p.intro.en,url:`${base}/${kind}/${slug}`,author:{"@type":"Organization",name:"BOHOL",url:base}};
  return <SiteShell><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(data)}}/><BreadcrumbJson items={[{name:"Home",url:base},{name:kind,url:`${base}/${kind}`},{name:p.title.en,url:`${base}/${kind}/${slug}`}]}/><StoryContent kind={kind} slug={slug}/></SiteShell>;
}
