export type SocialPlatformStatus = {
  key: "facebook" | "instagram" | "linkedin" | "youtube" | "tiktok" | "x" | "whatsapp";
  name: string;
  purpose: string;
  configured: boolean;
  consoleUrl: string;
};

function present(...names: string[]) {
  return names.every((name) => Boolean(process.env[name]?.trim()));
}

export function getSocialPlatformStatuses(): SocialPlatformStatus[] {
  const metaConfigured = present("META_APP_ID", "META_APP_SECRET");
  return [
    { key: "facebook", name: "Facebook", purpose: "企业主页内容发布", configured: metaConfigured && present("FACEBOOK_PAGE_ID", "FACEBOOK_PAGE_ACCESS_TOKEN"), consoleUrl: "https://developers.facebook.com/apps/" },
    { key: "instagram", name: "Instagram", purpose: "专业账号图片和短视频发布", configured: metaConfigured && present("INSTAGRAM_BUSINESS_ACCOUNT_ID", "FACEBOOK_PAGE_ACCESS_TOKEN"), consoleUrl: "https://developers.facebook.com/apps/" },
    { key: "linkedin", name: "LinkedIn", purpose: "企业主页内容发布", configured: present("LINKEDIN_CLIENT_ID", "LINKEDIN_CLIENT_SECRET", "LINKEDIN_ACCESS_TOKEN"), consoleUrl: "https://www.linkedin.com/developers/apps" },
    { key: "youtube", name: "YouTube", purpose: "频道视频上传与管理", configured: present("YOUTUBE_CLIENT_ID", "YOUTUBE_CLIENT_SECRET", "YOUTUBE_REFRESH_TOKEN"), consoleUrl: "https://console.cloud.google.com/apis/library/youtube.googleapis.com" },
    { key: "tiktok", name: "TikTok", purpose: "企业短视频发布", configured: present("TIKTOK_CLIENT_KEY", "TIKTOK_CLIENT_SECRET", "TIKTOK_ACCESS_TOKEN"), consoleUrl: "https://developers.tiktok.com/apps/" },
    { key: "x", name: "X", purpose: "品牌动态发布", configured: present("X_CLIENT_ID", "X_CLIENT_SECRET", "X_ACCESS_TOKEN"), consoleUrl: "https://developer.x.com/en/portal/dashboard" },
    { key: "whatsapp", name: "WhatsApp Business", purpose: "客户咨询、聊天记录与客服回复", configured: present("WHATSAPP_WABA_ID", "WHATSAPP_PHONE_NUMBER_ID", "WHATSAPP_ACCESS_TOKEN", "WHATSAPP_VERIFY_TOKEN", "META_APP_SECRET"), consoleUrl: "https://developers.facebook.com/apps/" },
  ];
}

export function whatsappConfig() {
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN?.trim() || "";
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID?.trim() || "";
  const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN?.trim() || "";
  const appSecret = process.env.META_APP_SECRET?.trim() || "";
  const graphVersion = process.env.META_GRAPH_API_VERSION?.trim() || "v24.0";
  return { accessToken, phoneNumberId, verifyToken, appSecret, graphVersion, configured: Boolean(accessToken && phoneNumberId && verifyToken && appSecret) };
}
