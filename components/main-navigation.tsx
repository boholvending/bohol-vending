import Link from "next/link";
import { ChevronDown } from "lucide-react";
import s from "./main-navigation.module.css";

export function MainNavigation({locale="en"}:{locale?:"en"|"zh"}){
  const zh=locale==="zh";const root=zh?"/zh":"";
  const productCategories=[
    {id:"drinks",label:zh?"食品饮料":"Food & beverage",note:zh?"冷饮售货机":"Cold drink vending"},
    {id:"beauty",label:zh?"美妆零售":"Beauty retail",note:zh?"睫毛与美妆产品":"Eyelash and beauty products"},
    {id:"collectibles",label:zh?"卡牌收藏品":"Cards & collectibles",note:zh?"卡牌与盲盒零售":"Cards, blind boxes and collectibles"},
    {id:"restricted",label:zh?"合规零售":"Age-restricted retail",note:zh?"电子烟等特殊品类":"Vape and specialty retail"},
    {id:"gentle",label:zh?"轻拿轻放":"Gentle delivery",note:zh?"升降机保护易碎产品":"Elevator delivery for fragile goods"},
  ];
  const mobileLinks=[["",zh?"首页":"Home"],["vending-machines",zh?"自动售货机":"Vending Machines"],["solutions",zh?"解决方案":"Solutions"],["oem-odm","OEM & ODM"],["projects",zh?"项目案例":"Projects & Cases"],["contact",zh?"联系方式":"Contact"],["insights",zh?"行业洞察":"Insights"],["about",zh?"关于 BOHOL":"About BOHOL"]];
  return <><details className={s.mobile}><summary aria-label={zh?"打开导航":"Open navigation"}>{zh?"菜单":"Menu"} <ChevronDown size={16}/></summary><nav aria-label={zh?"手机导航":"Mobile navigation"}>{mobileLinks.map(([path,label])=><Link key={path} href={`${root}/${path}`}>{label}</Link>)}</nav></details><nav className={s.nav} aria-label={zh?"主导航":"Primary navigation"}>
    <Link href={root||"/"}>{zh?"首页":"Home"}</Link>
    <div className={s.dropdown}>
      <Link href={`${root}/vending-machines`}>{zh?"自动售货机":"Vending Machines"}<ChevronDown size={13}/></Link>
      <div className={`${s.menu} ${s.productMenu}`}>
        <Link href={`${root}/vending-machines`}><b>{zh?"全部产品类目":"All product categories"}</b><small>{zh?"查看 BOHOL 全部自动售货机类目":"View every BOHOL vending category"}</small></Link>
        {productCategories.map((category)=><Link href={`${root}/vending-machines?category=${category.id}`} key={category.id}><b>{category.label}</b><small>{category.note}</small></Link>)}
      </div>
    </div>
    <div className={s.dropdown}>
      <Link href={`${root}/solutions`}>{zh?"解决方案":"Solutions"}<ChevronDown size={13}/></Link>
      <div className={s.menu}>
        <Link href={`${root}/solutions`}><b>{zh?"解决方案总览":"Solutions Overview"}</b><small>{zh?"硬件、软件、支付与运营方案":"Hardware, software and operations"}</small></Link>
        <Link href={`${root}/oem-odm`}><b>OEM &amp; ODM</b><small>{zh?"从设计、样机到批量生产":"From design to mass production"}</small></Link>
        <Link href={`${root}/projects`}><b>{zh?"项目案例":"Projects & Cases"}</b><small>{zh?"真实市场的成功部署":"Successful market deployments"}</small></Link>
      </div>
    </div>
    <Link href={`${root}/contact`}>{zh?"联系方式":"Contact"}</Link>
    <Link href={`${root}/insights`}>{zh?"行业洞察":"Insights"}</Link>
    <Link href={`${root}/about`}>{zh?"关于 BOHOL":"About BOHOL"}</Link>
  </nav></>
}
