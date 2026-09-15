"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

const ContactFloat = dynamic(
  () => import("@/components/contact-float").then((mod) => mod.ContactFloat),
  { ssr: false },
);

export function LazyContactFloat() {
  const pathname = usePathname();

  if (pathname.startsWith("/keystatic")) return null;

  return <ContactFloat />;
}
