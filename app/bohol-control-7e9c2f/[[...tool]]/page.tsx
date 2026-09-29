import { getAdminContent } from "@/lib/keystatic-content";
import { readInquiries } from "@/lib/inquiries";
import { AdminWorkspace } from "@/components/admin-workspace";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin-auth";
import { getSocialPlatformStatuses } from "@/lib/social-integrations";
import { readWhatsappMessages } from "@/lib/whatsapp-messages";

export const dynamic = "force-dynamic";
export default async function AdminPage({params,searchParams}: {params: Promise<{tool?: string[]}>;searchParams: Promise<{error?: string;whatsapp?: string}>}) {
  await requireAdmin();
  const {tool = []} = await params;
  if (["products","news"].includes(tool[0]) && tool[1] === "create") redirect(`/keystatic/collection/${tool[0]}/create`);
  const content = await getAdminContent();
  const inquiries = await readInquiries();
  const {error,whatsapp} = await searchParams;
  const socialPlatforms = tool[0] === "social" ? getSocialPlatformStatuses() : [];
  const whatsappStore = tool[0] === "social" ? await readWhatsappMessages() : {messages:[],hasMore:false,skippedRecords:0,readError:""};
  return <AdminWorkspace content={content} section={tool[0] || "overview"} inquiries={inquiries} securityError={error} socialPlatforms={socialPlatforms} whatsappMessages={whatsappStore.messages} whatsappNotice={whatsapp} whatsappStorageError={whatsappStore.readError} whatsappHistoryLimited={whatsappStore.hasMore} whatsappSkippedRecords={whatsappStore.skippedRecords} />;
}

