import { getAdminContent } from "@/lib/keystatic-content";
import { readInquiries } from "@/lib/inquiries";
import { AdminWorkspace } from "@/components/admin-workspace";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";
export default async function AdminPage({params,searchParams}: {params: Promise<{tool?: string[]}>;searchParams: Promise<{error?: string}>}) {
  await requireAdmin();
  const {tool = []} = await params;
  if (["products","news"].includes(tool[0]) && tool[1] === "create") redirect(`/keystatic/collection/${tool[0]}/create`);
  const content = await getAdminContent();
  const inquiries = await readInquiries();
  const {error} = await searchParams;
  return <AdminWorkspace content={content} section={tool[0] || "overview"} inquiries={inquiries} securityError={error} />;
}

