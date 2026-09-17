import { validSession, adminCookie } from "@/lib/admin-auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string; changed?: string }> }) {
  if (validSession((await cookies()).get(adminCookie)?.value)) redirect("/bohol-control-7e9c2f");
  const { error, changed } = await searchParams;
  return <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24, background: "#f4f7fb", color: "#172c42" }}>
    <form method="post" action="/api/admin/login" style={{ width: "min(100%, 400px)", display: "grid", gap: 18, background: "white", padding: 32, border: "1px solid #d6e0eb", borderRadius: 12, boxShadow: "0 12px 40px #172c4210" }}>
      <div><strong style={{ fontSize: 26 }}>BOHOL 网站管理</strong><p>输入后台安全码登录</p></div>
      <label style={{ display: "grid", gap: 8 }}>安全码（8–12 位）<input name="password" type="password" autoComplete="current-password" required minLength={8} maxLength={12} style={{ padding: 12, border: "1px solid #9cacc0", borderRadius: 6, fontSize: 16 }} /></label>
      {error && <p role="alert" style={{ color: "#b42318", margin: 0 }}>{error === "setup" ? "后台安全码尚未在服务器设置。" : error === "limit" ? "尝试次数过多，请稍后再试。" : "安全码不正确，请重试。"}</p>}
      {changed && <p role="status" style={{ color: "#14613e", margin: 0 }}>安全码已更新，请用新安全码登录。</p>}
      <button type="submit" style={{ padding: 12, background: "#1d5b91", color: "white", border: 0, borderRadius: 6, fontSize: 16, cursor: "pointer" }}>登录后台</button>
    </form>
  </main>;
}
