"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CheckCircle2, ChevronLeft, ChevronRight, ExternalLink, FileSearch, Globe2, LoaderCircle, RefreshCw, Search, Upload } from "lucide-react";
import s from "./admin-workspace.module.css";

type Status = { configured: boolean; connected: boolean };
type Row = { keys: string[]; clicks: number; impressions: number; ctr: number; position: number };
type Performance = { range: { startDate: string; endDate: string }; totals: Row; rows: Row[] };
type Sitemap = { path: string; lastSubmitted?: string; lastDownloaded?: string; isPending?: boolean; warnings?: string; errors?: string; contents?: { type: string; submitted: string; indexed?: string }[] };
type Inspection = { inspectionResult?: { inspectionResultLink?: string; indexStatusResult?: { verdict?: string; coverageState?: string; robotsTxtState?: string; indexingState?: string; lastCrawlTime?: string; pageFetchState?: string; googleCanonical?: string; userCanonical?: string; crawledAs?: string } } };

const dimensionLabels: Record<string, string> = { query: "查询词", page: "网页", country: "国家/地区", device: "设备", date: "日期" };
const verdictLabel: Record<string, string> = { PASS: "已通过", PARTIAL: "部分通过", FAIL: "未通过", VERDICT_UNSPECIFIED: "暂无结论" };
const formatDate = (value?: string) => value ? new Intl.DateTimeFormat("zh-CN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value)) : "—";
const compact = (value?: string) => Number(value || 0).toLocaleString("zh-CN");

export function SearchConsolePanel() {
  const [status, setStatus] = useState<Status | null>(null);
  const [days, setDays] = useState(28);
  const [dimension, setDimension] = useState("query");
  const [performance, setPerformance] = useState<Record<string, Performance>>({});
  const [sitemaps, setSitemaps] = useState<Sitemap[]>([]);
  const [inspection, setInspection] = useState<Inspection | null>(null);
  const [inspectionUrl, setInspectionUrl] = useState("https://www.boholvending.com/");
  const [loading, setLoading] = useState(false);
  const [inspecting, setInspecting] = useState(false);
  const [error, setError] = useState("");

  const loadStatus = () => fetch("/api/admin/google-search-console/status").then(async response => {
    const value = await response.json();
    if (!response.ok) throw new Error(value.error);
    setStatus(value);
  }).catch(() => setError("无法读取 Google 连接状态，请刷新页面重试。"));

  async function loadDashboard(selectedDays = days) {
    setLoading(true); setError("");
    try {
      const dimensions = ["query", "page", "country", "device", "date"];
      const [mapResponse, ...responses] = await Promise.all([
        fetch("/api/admin/google-search-console/sitemaps"),
        ...dimensions.map(item => fetch(`/api/admin/google-search-console/data?days=${selectedDays}&dimension=${item}`)),
      ]);
      const mapValue = await mapResponse.json();
      const values = await Promise.all(responses.map(response => response.json().then(value => ({ response, value }))));
      if (!mapResponse.ok) throw new Error(mapValue.error);
      const failed = values.find(item => !item.response.ok);
      if (failed) throw new Error(failed.value.error);
      setSitemaps(mapValue.sitemaps || []);
      setPerformance(Object.fromEntries(dimensions.map((item, index) => [item, values[index].value])));
    } catch {
      setError("Google 实时数据读取失败。请重新授权，或稍后刷新数据。");
    } finally { setLoading(false); }
  }

  useEffect(() => { void loadStatus(); }, []);
  useEffect(() => { if (status?.connected) void loadDashboard(days); }, [status?.connected, days]);

  async function upload(form: FormData) {
    setError("");
    const response = await fetch("/api/admin/google-search-console/configure", { method: "POST", body: form });
    if (response.ok) void loadStatus();
    else setError("JSON 无效。请确认这是 Web OAuth 客户端文件，并包含后台显示的正式回调地址。");
  }

  async function inspect(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setInspecting(true); setInspection(null); setError("");
    try {
      const response = await fetch("/api/admin/google-search-console/inspect", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url: inspectionUrl }) });
      const value = await response.json();
      if (!response.ok) throw new Error(value.error);
      setInspection(value);
    } catch {
      setError("网址检查失败。请输入 boholvending.com 的完整 HTTPS 地址后重试。");
    } finally { setInspecting(false); }
  }

  const active = performance[dimension];
  const totals = performance.query?.totals || { clicks: 0, impressions: 0, ctr: 0, position: 0 };
  const sitemapTotals = useMemo(() => sitemaps.reduce((sum, item) => {
    for (const content of item.contents || []) { sum.submitted += Number(content.submitted || 0); sum.indexed += Number(content.indexed || 0); }
    return sum;
  }, { submitted: 0, indexed: 0 }), [sitemaps]);
  const insightItems = [
    ["主要搜索词", performance.query?.rows[0]?.keys[0] || "暂无查询数据", performance.query?.rows[0] ? `${compact(String(performance.query.rows[0].impressions))} 次曝光` : "Google 尚未返回数据"],
    ["表现最好网页", performance.page?.rows[0]?.keys[0]?.replace("https://www.boholvending.com", "") || "暂无网页数据", performance.page?.rows[0] ? `${compact(String(performance.page.rows[0].clicks))} 次点击` : "等待产生搜索表现"],
    ["主要访问国家", performance.country?.rows[0]?.keys[0]?.toUpperCase() || "暂无国家数据", performance.country?.rows[0] ? `${compact(String(performance.country.rows[0].impressions))} 次曝光` : "等待产生搜索表现"],
  ];

  if (!status) return <section className={s.panel}><p className={s.loadingLine}><LoaderCircle size={18} /> 正在检查 Google 连接…</p></section>;
  if (!status.configured) return <section className={s.panel}><h2>连接 Google Search Console</h2><p>上传刚下载的 OAuth JSON。文件只保存到服务器私有目录，不会进入公开网站或 GitHub。</p><form className={s.gscUpload} action={upload}><input type="file" name="credentials" accept="application/json,.json" required /><button type="submit"><Upload size={16} />上传并安全保存</button></form>{error && <p className={s.gscError} role="alert">{error}</p>}</section>;
  if (!status.connected) return <section className={s.panel}><h2>授权 Search Console 数据</h2><p>OAuth 配置已安全保存。使用拥有 boholvending.com 权限的 Google 账号授权只读访问后，以下六项会直接显示在后台。</p><Link className={s.primary} href="/api/admin/google-search-console/connect">连接 Google 账号 <ExternalLink size={16} /></Link>{error && <p className={s.gscError} role="alert">{error}</p>}</section>;

  const indexResult = inspection?.inspectionResult?.indexStatusResult;
  return <div className={s.gscDashboard}>
    <section className={`${s.panel} ${s.gscOverview}`} id="gsc-overview">
      <div className={s.snapshotHead}><div><h2>Google 收录概览</h2><p>已连接 sc-domain:boholvending.com · {performance.query ? `${performance.query.range.startDate}–${performance.query.range.endDate}` : "正在同步"}</p></div><button className={s.gscRefresh} type="button" onClick={() => void loadDashboard()} disabled={loading}><RefreshCw size={16} className={loading ? s.spin : ""} />{loading ? "同步中" : "刷新数据"}</button></div>
      <nav className={s.gscSectionNav} aria-label="Search Console 后台功能"><a href="#gsc-overview">概览</a><a href="#gsc-insights">数据洞察</a><a href="#gsc-performance">效果</a><a href="#gsc-inspection">网址检查</a><a href="#gsc-pages">网页</a><a href="#gsc-sitemaps">站点地图</a></nav>
      <div className={s.gscMetrics}><div><span>总点击</span><b>{compact(String(totals.clicks))}</b></div><div><span>总曝光</span><b>{compact(String(totals.impressions))}</b></div><div><span>平均点击率</span><b>{(totals.ctr * 100).toFixed(1)}%</b></div><div><span>平均排名</span><b>{totals.position.toFixed(1)}</b></div></div>
      {error && <p className={s.gscError} role="alert">{error}</p>}
    </section>

    <section className={s.panel} id="gsc-insights"><div className={s.gscHeading}><Globe2 size={21} /><div><h2>数据洞察</h2><p>根据所选时间段的 Google 实时搜索表现自动归纳。</p></div></div><div className={s.gscInsights}>{insightItems.map(([label, value, meta]) => <div key={label}><span>{label}</span><b title={value}>{value}</b><small>{meta}</small></div>)}</div></section>

    <section className={s.panel} id="gsc-performance"><div className={s.snapshotHead}><div><h2>搜索效果</h2><p>查看查询词、国家、设备和日期的点击与曝光。</p></div><div className={s.gscControls}><select aria-label="时间范围" value={days} onChange={event => setDays(Number(event.target.value))}><option value="7">7 天</option><option value="28">28 天</option><option value="90">3 个月</option></select><select aria-label="数据维度" value={dimension} onChange={event => setDimension(event.target.value)}>{Object.entries(dimensionLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></div></div><PerformanceTable data={active} dimension={dimension} /></section>

    <section className={s.panel} id="gsc-inspection"><div className={s.gscHeading}><FileSearch size={21} /><div><h2>网址检查</h2><p>直接查询某个 BOHOL 页面当前在 Google 索引中的状态。</p></div></div><form className={s.gscInspectForm} onSubmit={inspect}><label htmlFor="inspection-url">完整网页地址</label><div><input id="inspection-url" type="url" value={inspectionUrl} onChange={event => setInspectionUrl(event.target.value)} required /><button type="submit" disabled={inspecting}>{inspecting ? <LoaderCircle className={s.spin} size={17} /> : <Search size={17} />}{inspecting ? "检查中" : "检查网址"}</button></div></form>{indexResult && <div className={s.gscInspectionResult}><div><span>Google 结论</span><b>{verdictLabel[indexResult.verdict || ""] || indexResult.verdict || "暂无结论"}</b></div><div><span>覆盖状态</span><b>{indexResult.coverageState || "—"}</b></div><div><span>上次抓取</span><b>{formatDate(indexResult.lastCrawlTime)}</b></div><div><span>网页抓取</span><b>{indexResult.pageFetchState || "—"}</b></div><div><span>Google 规范网址</span><b>{indexResult.googleCanonical || "—"}</b></div><div><span>用户规范网址</span><b>{indexResult.userCanonical || "—"}</b></div>{inspection?.inspectionResult?.inspectionResultLink && <a href={inspection.inspectionResult.inspectionResultLink} target="_blank" rel="noreferrer">查看 Google 详细报告 <ExternalLink size={14} /></a>}</div>}</section>

    <section className={s.panel} id="gsc-pages"><div className={s.snapshotHead}><div><h2>网页</h2><p>Google 搜索中已经产生展示的网页；收录结论请使用上方网址检查。</p></div><span className={s.gscCount}>{performance.page?.rows.length || 0} 个有表现的网页</span></div><PaginatedPages data={performance.page} /></section>

    <section className={s.panel} id="gsc-sitemaps"><div className={s.snapshotHead}><div><h2>站点地图</h2><p>Google Search Console 已接收的 Sitemap 及发现网页数量。</p></div><div className={s.gscSitemapTotals}><span>{compact(String(sitemapTotals.submitted))} 已发现</span><span>{compact(String(sitemapTotals.indexed))} 已编入索引</span></div></div><div className={s.tableWrap}><table><thead><tr><th>站点地图</th><th>状态</th><th>提交时间</th><th>上次读取</th><th>已发现</th></tr></thead><tbody>{sitemaps.length ? sitemaps.map(item => <tr key={item.path}><td><a href={item.path} target="_blank" rel="noreferrer">{item.path.replace("https://www.boholvending.com", "")} <ExternalLink size={12} /></a></td><td><span className={item.isPending ? s.gscPending : s.gscSuccess}><CheckCircle2 size={14} />{item.isPending ? "处理中" : Number(item.errors || 0) ? `${item.errors} 个错误` : "成功"}</span></td><td>{formatDate(item.lastSubmitted)}</td><td>{formatDate(item.lastDownloaded)}</td><td>{compact(String((item.contents || []).reduce((sum, content) => sum + Number(content.submitted || 0), 0)))}</td></tr>) : <tr><td colSpan={5}>Google 尚未返回站点地图记录。</td></tr>}</tbody></table></div></section>
  </div>;
}

function PerformanceTable({ data, dimension, rows = data?.rows }: { data?: Performance; dimension: string; rows?: Row[] }) {
  return <div className={s.tableWrap}><table><thead><tr><th>{dimensionLabels[dimension]}</th><th>点击</th><th>曝光</th><th>CTR</th><th>排名</th></tr></thead><tbody>{rows?.length ? rows.map((row, index) => <tr key={`${row.keys[0]}-${index}`}><td title={row.keys[0]}>{dimension === "page" ? row.keys[0].replace("https://www.boholvending.com", "") : row.keys[0]}</td><td>{compact(String(row.clicks))}</td><td>{compact(String(row.impressions))}</td><td>{(row.ctr * 100).toFixed(1)}%</td><td>{row.position.toFixed(1)}</td></tr>) : <tr><td colSpan={5}>所选时间段暂无数据。</td></tr>}</tbody></table></div>;
}

function PaginatedPages({ data }: { data?: Performance }) {
  const pageSize = 10;
  const [page, setPage] = useState(1);
  const totalRows = data?.rows.length || 0;
  const totalPages = Math.max(1, Math.ceil(totalRows / pageSize));
  useEffect(() => { setPage(1); }, [data]);
  const currentPage = Math.min(page, totalPages);
  const rows = data?.rows.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  return <>
    <PerformanceTable data={data} dimension="page" rows={rows} />
    {totalRows > pageSize && <nav className={s.gscPagination} aria-label="网页列表分页">
      <span>每页 10 条</span>
      <div>
        <button type="button" onClick={() => setPage(value => Math.max(1, value - 1))} disabled={currentPage === 1} aria-label="上一页"><ChevronLeft size={16} /></button>
        {Array.from({ length: totalPages }, (_, index) => index + 1).map(value => <button type="button" key={value} onClick={() => setPage(value)} aria-current={currentPage === value ? "page" : undefined}>{value}</button>)}
        <button type="button" onClick={() => setPage(value => Math.min(totalPages, value + 1))} disabled={currentPage === totalPages} aria-label="下一页"><ChevronRight size={16} /></button>
      </div>
      <span>第 {currentPage} / {totalPages} 页，共 {totalRows} 条</span>
    </nav>}
  </>;
}
