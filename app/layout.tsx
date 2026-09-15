import { EnquirySource } from "@/components/enquiry-source";
import type { Metadata } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";
import "./globals.css";
import "./home-sections.css";
import "./site-polish.css";
import { JsonLd } from "@/components/json-ld";
import { organizationJsonLd } from "@/lib/seo";
import { LazyContactFloat } from "@/components/lazy-contact-float";
const manrope=Manrope({subsets:["latin"],variable:"--font-body",display:"swap"});
const space=Space_Grotesk({subsets:["latin"],variable:"--font-display",display:"swap"});
const siteUrl=process.env.NEXT_PUBLIC_SITE_URL||"https://www.boholvending.com";
export const metadata:Metadata={metadataBase:new URL(siteUrl),title:{default:"BOHOL | Intelligent Vending Machines",template:"%s | BOHOL"},description:"Custom intelligent vending machines engineered and manufactured for global operators, brands and distributors.",icons:{icon:"/icon.png",apple:"/apple-icon.png"},alternates:{canonical:"/",languages:{"en":"/","zh-CN":"/zh","x-default":"/"}},openGraph:{type:"website",locale:"en_US",alternateLocale:["zh_CN"],siteName:"BOHOL",title:"BOHOL Intelligent Vending Machines",description:"Engineered for retail without limits.",images:[{url:"/og.webp",width:1200,height:630,alt:"BOHOL: Retail without limits"}]},twitter:{card:"summary_large_image",title:"BOHOL Intelligent Vending Machines",description:"Engineered for retail without limits.",images:["/og.webp"]}};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="en" className={`${manrope.variable} ${space.variable}`}><body><EnquirySource/><LazyContactFloat/><JsonLd data={organizationJsonLd}/>{children}</body></html>}
