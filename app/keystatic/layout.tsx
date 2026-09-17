import KeystaticApp from "./keystatic";
import { requireAdmin } from "@/lib/admin-auth";

export default async function KeystaticLayout() {
  await requireAdmin();
  return <><div style={{position:"fixed",bottom:12,left:12,zIndex:10000,display:"flex",gap:12,padding:"12px 16px",background:"#102336",color:"#fff",borderRadius:8,fontSize:14}}><a href="/bohol-control-7e9c2f">返回管理首页</a><a href="/" target="_blank" rel="noreferrer">查看网站 ↗</a></div><KeystaticApp /></>;
}
