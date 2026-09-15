import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { sectionDetails } from "@/lib/section-details";
import s from "./section-content.module.css";
import { InsightIndex } from "./insight-editorial";
import { getNews } from "@/lib/keystatic-content";

export async function SectionContent({ section, locale = "en" }: { section: string; locale?: "en" | "zh" }) {
  const zh = locale === "zh";
  const data = sectionDetails[section];
  if (!data) return null;
  const href = (url: string) => `${zh ? "/zh" : ""}${url}`;
  const cmsNews = section === "insights" && !zh ? await getNews() : [];
  if (section === "insights" && !zh) return <InsightIndex cms={cmsNews} />;
  const cards = cmsNews.length ? cmsNews.map((article) => ({ title: article.title, zh: article.title, body: article.excerpt, bodyZh: article.excerpt, href: `/insights/${article.slug}`, label: article.publishedAt })) : data.cards;
  const showImages = cards.some((card) => "image" in card && card.image);
  return <div className={s.content}>
    <h2>{zh ? data.zh : data.title}</h2>
    {section === "projects" && <p className={s.notice}>{zh ? "以下为应用方案示例，并非已核实的客户交付案例。真实客户名称、现场照片和项目结果将在获得授权后发布。" : "These are application concepts, not verified customer deployments. Approved client stories, site photos and project results will be published separately."}</p>}
    <div className={`${s.grid} ${showImages ? s.imageGrid : ""}`}>{cards.map((card, i) => <Link className={s.card} href={href(card.href)} key={card.href + i}>{"image" in card && card.image ? <div className={s.cardImage}><Image src={card.image} alt={zh ? card.zh : card.title} width={1672} height={941} sizes="(max-width:1050px) 100vw, 50vw"/></div> : null}<span>{card.label || `0${i + 1}`}</span><h3>{zh ? card.zh : card.title}</h3><p>{zh ? card.bodyZh : card.body}</p>{"geo" in card && card.geo ? <small className={s.geo}>{card.geo}</small> : null}<b>{zh ? "了解更多" : "Explore"}<ArrowUpRight size={18}/></b></Link>)}</div>
    {section === "solutions" && <div className={s.hubs}><Link href={href("/oem-odm")}><span>{zh ? "定制服务" : "CUSTOM ENGINEERING"}</span><h3>OEM &amp; ODM</h3><p>{zh ? "从外观、结构到软件界面，为您的品牌打造设备。" : "Cabinet, channels and interface development for your brand."}</p><ArrowUpRight/></Link><Link href={href("/projects")}><span>{zh ? "应用与案例" : "APPLICATIONS & CASES"}</span><h3>{zh ? "项目案例" : "Projects & Cases"}</h3><p>{zh ? "了解商品与运营需求如何形成完整解决方案。" : "See how product and operational needs shape a vending solution."}</p><ArrowUpRight/></Link></div>}
    <div className={s.cta}><div><h3>{zh ? "让我们了解您的项目。" : "Let’s talk about your project."}</h3><p>{zh ? "提供商品、目标市场与预计数量，我们一起确定下一步。" : "Share your product, target market and planned quantity to define the next step."}</p></div><Link href={href("/contact")}>{zh ? "联系 BOHOL" : "Contact BOHOL"}<ArrowUpRight size={18}/></Link></div>
  </div>;
}
