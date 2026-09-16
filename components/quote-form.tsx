"use client";
import { useState } from "react";

export function QuoteForm({ locale = "en", productName = "" }: { locale?: "en" | "zh"; productName?: string }) {
  const zh = locale === "zh";
  const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY || "";
  const [status, setStatus] = useState<{ type: "idle" | "success" | "error"; message: string }>({ type: "idle", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  async function submitEnquiry(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;
    if (!accessKey || accessKey.startsWith("replace")) return setStatus({ type: "error", message: zh ? "在线发送暂未开通，请发送邮件至 sales@boholvending.com。内容已保留。" : "Online sending is not available yet. Please email sales@boholvending.com. Your entries have been kept." });
    const form = event.currentTarget;
    setIsSubmitting(true); setStatus({ type: "idle", message: "" });
    try {
      const data = new FormData(form);
      data.set("Page URL", window.location.origin + window.location.pathname);
      data.set("Page title", document.title);
      data.set("Product", productName || "General enquiry");
      data.set("Page type", productName ? "Product detail" : /^\/(zh\/?)?$/.test(window.location.pathname) ? "Homepage" : /^\/(zh\/)?insights\//.test(window.location.pathname) ? "Industry article" : /^\/(zh\/)?projects\//.test(window.location.pathname) ? "Case article" : "Other page");
      data.set("subject", `BOHOL enquiry — ${productName || window.location.pathname}`);
      data.set("replyto", String(data.get("Email") || ""));
      try {
        data.set("Previous page", sessionStorage.getItem("bohol.previousPage") || document.referrer || "Direct / unavailable");
        data.set("First landing page", sessionStorage.getItem("bohol.entryPage") || window.location.pathname);
        data.set("External referrer", sessionStorage.getItem("bohol.externalReferrer") || "Direct / unavailable");
      } catch { data.set("Previous page", document.referrer || "Unavailable"); }
      const response = await fetch(form.action, { method: "POST", body: data, headers: { Accept: "application/json" }, signal: AbortSignal.timeout(20000) });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || "Submission failed");
      window.umami?.track("Quote form submitted", { product: productName || "General enquiry" });
      form.reset();
      setStatus({ type: "success", message: zh ? "感谢您的询盘。BOHOL 团队会尽快与您联系。" : "Thank you. Your enquiry has been sent and the BOHOL team will contact you shortly." });
    } catch {
      setStatus({ type: "error", message: zh ? "暂时无法发送，请检查网络后重试。您填写的内容仍保留在页面中。" : "We could not send your enquiry. Check your connection and try again; your entries are still here." });
    } finally { setIsSubmitting(false); }
  }
  return <form className="quote-form" action="https://api.web3forms.com/submit" method="POST" onSubmit={submitEnquiry}>
    <input type="hidden" name="access_key" value={accessKey} />
    <input type="hidden" name="subject" value="New BOHOL vending machine enquiry" />
    <input type="hidden" name="from_name" value="BOHOL Website" />
    <input type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" style={{ display: "none" }} aria-hidden="true" />
    <div><label htmlFor="quote-name">{zh ? "姓名 *" : "Full name *"}</label><input id="quote-name" required name="Name" autoComplete="name" maxLength={120}/></div>
    <div><label htmlFor="quote-email">{zh ? "工作邮箱 *" : "Business email *"}</label><input id="quote-email" required type="email" name="Email" autoComplete="email" maxLength={180}/></div>
    <div><label htmlFor="quote-company">{zh ? "公司" : "Company"}</label><input id="quote-company" name="Company" autoComplete="organization" maxLength={160}/></div>
    <div><label htmlFor="quote-country">{zh ? "目标国家 / 市场 *" : "Country / market *"}</label><input id="quote-country" required name="Market" autoComplete="country-name" maxLength={120}/></div>
    {productName ? <div className="full"><label htmlFor="quote-product">{zh ? "咨询产品" : "Selected product"}</label><input id="quote-product" name="Machine" value={productName} readOnly /></div> : (
    <div className="full"><label htmlFor="quote-machine">{zh ? "产品方向 *" : "What do you want to vend? *"}</label><select id="quote-machine" required name="Machine" defaultValue=""><option value="" disabled>{zh ? "选择设备类型" : "Select a machine"}</option>{["Vape products", "Cold drinks", "Fragile / elevator delivery", "Eyelashes / beauty products", "Trading cards / collectibles", "Another product"].map((x,i)=><option key={x} value={x}>{zh ? ["电子烟", "冷饮", "易碎商品 / 升降出货", "睫毛 / 美妆", "卡牌 / 收藏品", "其他商品"][i] : x}</option>)}</select></div>
    )}
    <div><label htmlFor="quote-quantity">{zh ? "预计数量" : "Estimated quantity"}</label><select id="quote-quantity" name="Quantity">{["1-10", "11-50", "51-200", "200+"].map(x=><option key={x}>{x}</option>)}</select></div>
    <div><label htmlFor="quote-timeline">{zh ? "项目时间" : "Project timeline"}</label><select id="quote-timeline" name="Timeline">{["Exploring options", "Within 3 months", "3-6 months", "6+ months"].map((x,i)=><option key={x} value={x}>{zh ? ["方案调研", "3 个月内", "3-6 个月", "6 个月以上"][i] : x}</option>)}</select></div>
    <div className="full"><label htmlFor="quote-message">{zh ? "项目需求 *" : "Project requirements *"}</label><textarea id="quote-message" required name="Requirements" rows={6} maxLength={3000} placeholder={zh ? "商品尺寸、支付方式和定制要求……" : "Product dimensions, payments and customization requirements…"}/></div>
    <button className="submit-button" type="submit" disabled={isSubmitting} data-umami-event="Quote form submit click">{isSubmitting ? (zh ? "发送中..." : "Sending...") : (zh ? "发送询盘" : "Send enquiry")}</button>
    {status.message && <p className="full" role="status" aria-live="polite" data-status={status.type}>{status.message}</p>}
  </form>;
}
