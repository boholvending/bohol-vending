"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, CircleDashed, ExternalLink, MessageCircle, RefreshCw, Send } from "lucide-react";
import type { SocialPlatformStatus } from "@/lib/social-integrations";
import type { WhatsappMessage } from "@/lib/whatsapp-messages";
import s from "./admin-workspace.module.css";

export function SocialManagement({ platforms, messages, notice, storageError, historyLimited, skippedRecords = 0 }: { platforms: SocialPlatformStatus[]; messages: WhatsappMessage[]; notice?: string; storageError?: string; historyLimited?: boolean; skippedRecords?: number }) {
  const router = useRouter();
  const contacts = useMemo(() => {
    const map = new Map<string, { contact: string; name: string; latest: WhatsappMessage; messages: WhatsappMessage[] }>();
    for (const message of messages) {
      const current = map.get(message.contact);
      if (current) current.messages.push(message);
      else map.set(message.contact, { contact: message.contact, name: message.contactName, latest: message, messages: [message] });
    }
    return [...map.values()];
  }, [messages]);
  const [selected, setSelected] = useState(contacts[0]?.contact || "");
  const selectedContact = contacts.some((item) => item.contact === selected) ? selected : contacts[0]?.contact || "";
  const conversation = contacts.find((item) => item.contact === selectedContact);
  const whatsapp = platforms.find((platform) => platform.key === "whatsapp");
  const noticeText = notice === "sent" ? "消息已交给 WhatsApp 发送。" : notice === "failed" ? "发送失败，请检查 Meta 授权、号码和客服时间窗口。" : notice === "invalid" ? "WhatsApp 尚未配置，或收件人和消息内容不完整。" : "";
  useEffect(() => {
    if (!whatsapp?.configured) return;
    const timer = window.setInterval(() => router.refresh(), 15000);
    return () => window.clearInterval(timer);
  }, [router, whatsapp?.configured]);

  return <>
    <section className={s.panel}>
      <div className={s.socialIntro}>
        <div><h2>平台连接</h2><p>状态来自服务器的真实 API 配置。账号密码不会保存在网站；平台授权令牌只保存在服务器私有配置中。</p></div>
        <span>{platforms.filter((platform) => platform.configured).length} / {platforms.length} 已配置</span>
      </div>
      <div className={s.socialPlatforms}>
        {platforms.map((platform) => <div key={platform.key} className={s.socialPlatform}>
          <div><strong>{platform.name}</strong><small>{platform.purpose}</small></div>
          <span className={platform.configured ? s.connected : s.unconfigured}>{platform.configured ? <CheckCircle2 size={16}/> : <CircleDashed size={16}/>} {platform.configured ? "已配置" : "待配置"}</span>
          <a href={platform.consoleUrl} target="_blank" rel="noreferrer">开发者平台 <ExternalLink size={14}/></a>
        </div>)}
      </div>
    </section>

    <section className={`${s.panel} ${s.whatsappPanel}`}>
      <div className={s.whatsappHead}>
        <div><h2>WhatsApp Business 客服</h2><p>连接 Cloud API 后，新收到和发出的消息会保存在服务器。连接前的手机历史聊天不会自动出现在这里。</p></div>
        <div className={s.whatsappStatus}><span className={whatsapp?.configured ? s.connected : s.unconfigured}>{whatsapp?.configured ? <CheckCircle2 size={16}/> : <CircleDashed size={16}/>} {whatsapp?.configured ? "Webhook 可接入" : "等待 Meta 配置"}</span>{whatsapp?.configured&&<button type="button" onClick={() => router.refresh()}><RefreshCw size={15}/>刷新消息</button>}</div>
      </div>
      {noticeText && <p className={notice === "sent" ? s.formSuccess : s.formError} role="status">{noticeText}</p>}
      {storageError && <p className={s.formError} role="alert">{storageError}</p>}
      {!storageError&&skippedRecords>0&&<p className={s.formError} role="alert">有 {skippedRecords} 条损坏记录已跳过，其余聊天仍正常显示。</p>}
      {historyLimited&&<p className={s.historyNotice}>当前显示最近 5000 条消息；更早记录仍保存在服务器存储文件中。</p>}
      {contacts.length ? <div className={s.whatsappWorkspace}>
        <aside aria-label="WhatsApp 会话">
          {contacts.map((item) => <button key={item.contact} type="button" aria-current={selectedContact === item.contact ? "true" : undefined} onClick={() => setSelected(item.contact)}>
            <span>{item.name || item.contact}</span><small>{item.latest.text || `[${item.latest.type}]`}</small>
          </button>)}
        </aside>
        <div className={s.conversation}>
          <header><MessageCircle size={19}/><div><strong>{conversation?.name || conversation?.contact}</strong><small>+{conversation?.contact}</small></div></header>
          <div className={s.messageHistory}>{conversation?.messages.slice().reverse().map((message) => <article key={`${message.id}-${message.createdAt}`} data-direction={message.direction}>
            <p>{message.text || `[${message.type}]`}</p><small>{new Date(message.createdAt).toLocaleString("zh-CN", { hour12: false })} · {message.status || (message.direction === "incoming" ? "已接收" : "已发送")}</small>
          </article>)}</div>
          <form className={s.whatsappReply} method="post" action="/api/admin/whatsapp/send">
            <input type="hidden" name="to" value={conversation?.contact || ""}/>
            <label htmlFor="whatsapp-message">回复客户</label>
            <div><textarea key={conversation?.contact} id="whatsapp-message" name="message" rows={3} maxLength={4000} required disabled={!conversation} placeholder="输入回复内容…"/><button type="submit" disabled={!whatsapp?.configured || !conversation}><Send size={17}/>发送</button></div>
            <small>超过 WhatsApp 允许的客服会话窗口时，需要改用 Meta 已审批的消息模板。</small>
          </form>
        </div>
      </div> : <div className={s.socialEmpty}>
        <MessageCircle size={28}/><h3>{whatsapp?.configured ? "还没有 WhatsApp 会话" : "先连接 WhatsApp Business"}</h3>
        <p>{whatsapp?.configured ? "客户向企业号码发送消息后，会话会自动显示在这里。" : "在 Meta 开发者平台绑定企业号码，并把 Webhook 指向网站接口后即可开始接收聊天。"}</p>
        <code>https://www.boholvending.com/api/webhooks/whatsapp</code>
      </div>}
    </section>
  </>;
}
