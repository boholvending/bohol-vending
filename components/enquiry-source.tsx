"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
export function EnquirySource() {
 const pathname=usePathname();
 useEffect(()=>{if(pathname.startsWith('/keystatic'))return;try{const current=window.location.origin+pathname;const last=sessionStorage.getItem('bohol.currentPage');if(!sessionStorage.getItem('bohol.entryPage')){sessionStorage.setItem('bohol.entryPage',current);sessionStorage.setItem('bohol.externalReferrer',document.referrer);}if(last&&last!==current)sessionStorage.setItem('bohol.previousPage',last);sessionStorage.setItem('bohol.currentPage',current);}catch{/* Storage is optional. */}},[pathname]);
 return null;
}
