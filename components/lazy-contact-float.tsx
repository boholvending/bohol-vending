"use client";

import dynamic from "next/dynamic";

export const LazyContactFloat = dynamic(
  () => import("@/components/contact-float").then((mod) => mod.ContactFloat),
  { ssr: false },
);
