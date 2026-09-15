import Link from "next/link";
import { EnquirySection } from "./enquiry-section";
import Image from "next/image";
import { notFound } from "next/navigation";
import { stories } from "@/lib/stories";

const storyImages:Record<string,string>={
  "office-smart-store":"/images/cases/office-smart-store-bohol.webp",
  "apartment-lobby-vending":"/images/cases/apartment-lobby-bohol.webp",
  "hotel-lobby-vending":"/images/cases/hotel-lobby-bohol.webp",
  "gym-vending":"/images/cases/gym-smart-store-bohol.webp",
  "hospital-vending":"/images/cases/hospital-bohol.webp",
  "school-campus-vending":"/images/cases/school-bohol.webp",
  "public-building-vending":"/images/cases/government-bohol.webp",
  "commercial-breakroom-vending":"/images/cases/breakroom.webp",
  "residential-tower-vending":"/images/cases/residential-lobby.webp",
  "dessert-bakery-vending":"/images/cases/dessert-retail.webp",
  "customer-pickup-vending":"/images/cases/customer-buying.webp",
  "distributor-showroom-vending":"/images/cases/market-wall.webp",
};

export function StoryContent({kind,slug,locale="en"}:{kind:string;slug:string;locale?:"en"|"zh"}) {
  const p=stories[kind]?.[slug]; if(!p)notFound(); const zh=locale==="zh"; const root=zh?"/zh":"";
  const image=kind==="projects"?storyImages[slug]:undefined;
  return <><article className="editorial" lang={zh?"zh-CN":"en"}><Link href={`${root}/${kind}`}>← {zh?"返回列表":"Back to all stories"}</Link><p className="section-tag">BOHOL / {kind==="insights"?(zh?"行业洞察":"INSIGHTS"):(zh?"应用方案":"APPLICATION CONCEPT")}</p><h1>{p.title[locale]}</h1><p className="article-lead">{p.intro[locale]}</p>{image&&<div className="story-hero-image"><Image src={image} alt={p.title[locale]} width={1200} height={780} sizes="(max-width:900px) 100vw, 980px"/></div>}{p.sections.map(x=><section key={x.heading.en}><h2>{x.heading[locale]}</h2><p>{x.body[locale]}</p></section>)}<aside><b>{zh?"准备启动项目？":"Planning a vending project?"}</b><p>{zh?"提供您的商品与目标市场，共同确认设备配置。":"Share your product and target market to discuss the right configuration."}</p><Link href={`${root}/contact`}>{zh?"联系 BOHOL":"Contact BOHOL"} →</Link></aside></article><EnquirySection locale={locale}/></>;
}
