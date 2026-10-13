'use client';
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import s from "./insight-editorial.module.css";
export type InsightListItem = { slug: string; title: string; description: string; image?: string | null; category: string; region: string; publishedAt: string; minutes?: number };
export function InsightPagination({ items }: { items: InsightListItem[] }) {
  const pageSize = 6; const [page, setPage] = useState(1); const pageCount = Math.max(1, Math.ceil(items.length / pageSize));
  const visible = items.slice((page - 1) * pageSize, page * pageSize);
  return <><div className={s.grid}>{visible.map(a => <article className={s.card} key={a.slug}><Link href={`/insights/${a.slug}`}>{a.image && <div className={s.cover}><Image src={a.image} alt={a.title} fill sizes="(max-width:700px) 100vw, (max-width:1050px) 50vw, 33vw" /></div>}<span>{a.category} · {a.region}</span><h3>{a.title}</h3></Link><p>{a.description}</p><small><time dateTime={a.publishedAt}>{a.publishedAt}</time>{a.minutes ? ` · ${a.minutes} min read` : ""}</small></article>)}</div>{pageCount > 1 && <nav className={s.pagination} aria-label="Industry article pages"><button type="button" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Previous</button><span>Page {page} of {pageCount}</span><button type="button" onClick={() => setPage(p => Math.min(pageCount, p + 1))} disabled={page === pageCount}>Next</button></nav>}</>;
}
