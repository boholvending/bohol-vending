import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Linkedin, Mail, MapPin, MessageCircle, Phone, Youtube } from "lucide-react";
import s from "./site-footer-v3.module.css";

const socials = [["LinkedIn","https://www.linkedin.com/",Linkedin],["Facebook","https://www.facebook.com/",Facebook],["Instagram","https://www.instagram.com/",Instagram],["YouTube","https://www.youtube.com/",Youtube]] as const;
const products = [["Vape Vending Machine","/vending-machines/vape-vending-machine","电子烟自动售货机"],["Cold Drink Vending Machine","/vending-machines/cold-drink-vending-machine","冷饮自动售货机"],["Elevator Vending Machine","/vending-machines/elevator-vending-machine","履带升降自动售货机"],["Eyelash Vending Machine","/vending-machines/eyelash-vending-machine","睫毛自动售货机"],["Card Vending Machine","/vending-machines/card-vending-machine","卡牌自动售货机"]] as const;

export function SiteFooter({ locale = "en" }: { locale?: "en" | "zh" }) {
  const zh=locale==="zh";const path=(href:string)=>zh?`/zh${href}`:href;
  return <footer className={s.footer}>
    <div className={`${s.panel} ${s.about}`}><Link className={s.logo} href={zh?"/zh":"/"} aria-label="BOHOL home"><Image src="/images/brand/bohol-logo.png" alt="BOHOL" width={500} height={500} sizes="108px"/></Link><p>{zh?"BOHOL 专注智能自动售货设备的研发与制造，为品牌方、运营商和经销商提供专业产品及 OEM/ODM 定制服务。":"BOHOL designs and manufactures intelligent vending machines, providing specialized products and OEM/ODM solutions for brands, operators and distributors worldwide."}</p></div>
    <div className={s.panel}><h2>{zh?"主营产品":"PRODUCT"}</h2><nav>{products.map(([en,href,cn])=><span key={href}><Link href={path(href)}>{zh?cn:en}</Link></span>)}</nav></div>
    <div className={s.panel}><h2>{zh?"网站导航":"SUPPORT"}</h2><nav><span><Link href={zh?"/zh":"/"}>{zh?"首页":"Home"}</Link></span><span><Link href={path("/about")}>{zh?"关于 BOHOL":"About Us"}</Link></span><span><Link href={path("/solutions")}>{zh?"解决方案":"Solutions"}</Link></span><span><Link href={path("/oem-odm")}>OEM &amp; ODM</Link></span><span><Link href={path("/projects")}>{zh?"成功案例":"Projects & Cases"}</Link></span><span><Link href={path("/insights")}>{zh?"新闻资讯":"Insights & FAQ"}</Link></span></nav></div>
    <div className={`${s.panel} ${s.contact}`}><h2>{zh?"联系我们":"CONTACT"}</h2><div className={s.contactRow}><Phone/><span>{zh?"电话：+86 19128839757":"Phone: +86 19128839757"}</span></div><div className={s.contactRow}><MessageCircle/><span>WhatsApp: +86 19128839757</span></div><div className={s.contactRow}><Mail/><span>{zh?"邮箱：sales@boholvending.com":"Email: sales@boholvending.com"}</span></div><div className={s.contactRow}><MapPin/><span>{zh?"中国，广东省广州市番禺区市莲路永善村段10号":"10 Shilian Road, Yongshan Village, Panyu District, Guangzhou, Guangdong, China"}</span></div></div>
    <div className={s.bottom}><span aria-hidden="true"/><div className={s.socials}>{socials.map(([label,href,Icon])=><a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}><Icon size={13}/></a>)}<a href="https://x.com/" target="_blank" rel="noopener noreferrer" aria-label="X">X</a></div><small>Copyright © {new Date().getFullYear()} BOHOL. All Rights Reserved.</small></div>
  </footer>;
}
