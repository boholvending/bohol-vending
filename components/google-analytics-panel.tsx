"use client";
import { useEffect, useState } from "react";
import { ExternalLink, RefreshCw } from "lucide-react";
import s from "./admin-workspace.module.css";

type Row = { dimensions: string[]; metrics: string[] };
type Data = { propertyId: string; range: { startDate: string; endDate: string }; summary: string[]; landingPages: Row[]; sources: Row[]; countries: Row[]; devices: Row[]; events: Row[] };
const count = (value?: string) => Number(value || 0).toLocaleString("zh-CN");
const duration = (value?: string) => `${Math.round(Number(value || 0))} 秒`;

export function GoogleAnalyticsPanel() {
  const [data, setData] = useState<Data | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  async function refresh() {
    setLoading(true); setError("");
    try {
      const response = await fetch("/api/admin/google-analytics/data", { cache: "no-store" });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "unknown");
      setData(body);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "unknown"); }
    finally { setLoading(false); }
  }
  useEffect(() => { void refresh(); }, []);
  const rows = (title: string, items: Row[], metricNames: string[]) => <section className={s.panel} key={title}><h2>{title}</h2>{items.length ? <div className={s.tableWrap}><table><thead><tr><th>{title === "热门落地页" ? "页面" : "维度"}</th>{metricNames.map(name => <th key={name}>{name}</th>)}</tr></thead><tbody>{items.map((row, index) => <tr key={`${row.dimensions.join("-")}-${index}`}><td>{row.dimensions[0] || "(未设置)"}</td>{row.metrics.map((value, metricIndex) => <td key={metricIndex}>{count(value)}</td>)}</tr>)}</tbody></table></div> : <p>该时段暂无数据。</p>}</section>;
  return <>
    <section className={s.panel}>
      <div className={s.gaHead}><div><h2>Google Analytics 4</h2><p>媒体资源 ID：563457157 · 只读报表 · 最近 28 天（截至昨天）</p>{data&&<small>{data.range.startDate} 至 {data.range.endDate}</small>}</div><div className={s.gaButtons}><button className={s.gscRefresh} onClick={() => void refresh()} disabled={loading}><RefreshCw size={16}/>刷新数据</button><a className={s.gaLink} href="https://analytics.google.com/analytics/web/" target="_blank" rel="noreferrer">打开 GA4 <ExternalLink size={15}/></a></div></div>
      {loading&&<p>正在读取 Google Analytics 数据…</p>}
      {error==="not_connected"&&<><p>尚未完成 Google 只读授权。点击下方按钮，在 Google 页面确认访问权限后会返回这里。</p><a className={s.primary} href="/api/admin/google-search-console/connect?return=analytics">连接 Google Analytics</a></>}
      {error==="ga4_403"&&<p className={s.gscError}>Google 已授权，但当前账号没有此媒体资源的查看权限，或 Google Analytics Data API 尚未启用。请确认账号权限和 API 设置后刷新。</p>}
      {error==="ga4_401"&&<><p className={s.gscError}>授权已过期或缺少 GA4 只读范围，请重新授权。</p><a className={s.primary} href="/api/admin/google-search-console/connect?return=analytics">重新连接 Google</a></>}
      {error&&!["not_connected","ga4_403","ga4_401"].includes(error)&&<p className={s.gscError}>暂时无法读取报表（{error}）。请稍后重试；如果提示 API 未启用，请在 Google Cloud 项目中启用 Google Analytics Data API。</p>}
      {data&&<><div className={s.gaMetrics}>{[["活跃用户",data.summary[0]], ["会话",data.summary[1]], ["浏览量",data.summary[2]], ["跳出率",`${(Number(data.summary[3]||0)*100).toFixed(1)}%`], ["平均互动时长",duration(data.summary[4])], ["关键事件",data.summary[5]]].map(([label,value])=><div key={label}><span>{label}</span><b>{value}</b></div>)}</div><p className={s.gaDisclaimer}>数据来自 GA4 报表。首次安装前的访问不会补录；页面和来源表展示 GA4 实际收到的数据。</p></>}
    </section>
    {data&&<>{rows("热门落地页",data.landingPages,["会话","活跃用户"])}{rows("流量来源",data.sources,["会话","关键事件"])}{rows("国家/地区",data.countries,["活跃用户","会话"])}{rows("设备",data.devices,["活跃用户","会话"])}{rows("事件",data.events,["事件次数","关键事件"])}<section className={s.panel}><h2>询盘事件</h2><p>GA4 中事件名 <code>generate_lead</code> 表示成功提交询盘表单；只有事件发生后才会显示。</p><strong>{count(data.events.find(row => row.dimensions[0] === "generate_lead")?.metrics[1])} 次关键事件</strong></section></>}
  </>;
}
