# BOHOL 后台实施记录

## 用户要求
- 中文后台、英文发布内容；平台式导航、真实数据，不接受演示数字。
- 产品和文章管理、SEO/GEO、留言收件箱、聊天记录、GA4 报表。
- 节约 token；每次完成部分后更新本文件，下次继续未完成工作。

## 已检查的事实
- 前台原有 5 个产品在 lib/content.ts；Keystatic 的 content/products 原来为空。
- 旧 admin 页面硬编码统计、文章和产品示例，搜索没有处理逻辑。
- 询盘 components/quote-form.tsx 使用 Web3Forms，未配置 access key 时不能发送。
- components/contact-float.tsx 只有关键词回复和 mailto，没有消息持久化。
- 无管理员身份验证、数据库或消息 API；不可把客户数据放进公开 CMS 目录。
- Sanity 仅配置产品读取分支；不等于已完成数据库及后台接入。

## 本轮改动（待验证记录见下）
- 将 5 个已有产品迁入 content/products/*.mdoc，保留英文名称、摘要、图片与卖点。
- admin 工作台改读真实 CMS 条目；搜索、状态筛选和各条目编辑链接。
- Keystatic 常驻返回管理首页 / 查看网站入口。
- 文章新增发布状态及 SEO 标题/描述，前台读取 SEO 字段并排除草稿。
- 移除演示统计和假接入状态，后台隐藏前台聊天悬浮窗。

## 尚未完成，禁止宣称已完成
1. 正式管理员登录与角色权限，保护 admin、Keystatic 和写入接口。
2. 选择服务器持久化目录/数据库（不可在 git deploy 清理范围内）；备份与恢复。
3. 询盘 API、限流、字段校验、幂等、收件箱真实保存/读取/处理状态。
4. 客服会话、访客令牌、聊天历史保存、客服回复与访客读取；现有历史无法补回。
5. 将前台研究文章完整迁入 CMS，保留引用、FAQ、目录等原有结构。
6. 编辑器分组、中文按钮/提示、上传与详情预览完整重做。
7. GA4 报表需要读取授权或 Looker Studio 报表；测量 ID 不等于报表权限。
8. 自定义后台 skill 已创建：C:/Users/admin/.codex/skills/bohol-admin/SKILL.md。已使用 efficient-delivery、skill-creator；沿用 Impeccable Operate 规范。
9. 本次验证成功后才决定推送；必须报告部署是否实际确认。
10. 用户放弃 Google/Data Studio，改用 Umami 作为网站访问统计。已开始接入 Umami，但服务器安装、DNS、反向代理、真实 Website ID 和 Share URL 仍未完成。

## 继续位置
先运行构建确认迁入条目可读；检查 /admin/products 与 Keystatic 返回导航。
然后实施登录和持久化消息系统。不要再以 UI 示意列表替代功能。

## 本轮验证结果
- npx tsc --noEmit 通过。
- npm run build 通过，5 个产品详情静态页正常生成。
- Impeccable detect 对 admin-workspace.tsx / module.css 返回空列表。
- HTTP 检查 /admin/products、/keystatic/collection/products、/vending-machines/card-vending-machine 均为 200。
- admin/products 返回真实 Card Vending Machine，Keystatic 页面包含返回管理首页链接。
- 浏览器工具无法连接，尚未做桌面/手机截图和点击验收。
- bohol-admin Skill 校验通过（python -X utf8 quick_validate.py）。
- 已向用户询问管理员登录方式：独立账号密码 / Google 登录。回复前不假设已授权 Google 登录配置。
- 本轮先保留本地提交；不宣称生产部署完成。

## Umami 统计接入记录
- 新增 components/umami-analytics.tsx：读取 NEXT_PUBLIC_UMAMI_SCRIPT_URL 与 NEXT_PUBLIC_UMAMI_WEBSITE_ID，使用 lazyOnload 加载。
- app/layout.tsx 改为加载 Umami，不再加载 GoogleAnalytics 组件。
- /admin/analytics 改为 Umami 面板：配置 NEXT_PUBLIC_UMAMI_SHARE_URL 后嵌入报表；未配置时显示真实待办，不显示假数字。
- 报价表单、聊天面板和联系方式按钮已加 Umami 事件标记。
- 新增 deploy/umami-docker-compose.yml 与 docs/umami-analytics.md，准备服务器自托管方案。
- Umami 已安装并可通过 http://stats.boholvending.com 访问；真实 Website ID 为 67526bd7-f75d-45f3-b748-86d84ac8ab32。
- 仍需给 stats.boholvending.com 配置 HTTPS，否则 https 主站会拦截 http 统计脚本。
- Share URL 已生成：https://stats.boholvending.com/share/TDZJE9DwE8PFyJe4，并准备接入后台 /admin/analytics。
- 工作台首页访问数据模块已改为直接嵌入完整报表和国家来源报表，不再只给外部链接。
- 新增 /api/inquiries：前台询盘表单和右下角聊天留言保存到服务器文件，/admin/inbox 读取真实留言列表；历史聊天无法补回，管理员登录保护仍待接入。
- 2026-09-17 线上 POST 诊断返回 `EACCES: permission denied, mkdir '/var/lib/bohol-vending'`，证明此前提交没有保存。默认路径改为网站运行账户的 `~/.local/share/bohol-vending/inquiries.jsonl`（可用 `BOHOL_INQUIRIES_FILE` 覆盖），目录和文件分别按 0700、0600 创建。需在部署后实测 POST、读回及后台页面；备份此目录。当前仅“留下联系方式”保存，聊天框即时自动回复不保存。
- 修复提交 37f8d9a 已部署（GitHub Actions 35168057395 成功）。线上测试提交返回 200 和 ID `mu4td7v3-c6f25553-3123-4f77-8418-d8a13f887cbf`；GET 读回及 /admin/inbox HTML 均包含 `BOHOL delivery test`。此测试记录仍需服务器权限清理；旧失败提交未写入，无法恢复。管理员鉴权仍待完成。

## 后台安全加固（2026-09-17）
- 用户选择自行指定安全码；不要在聊天或仓库中记录。已新增隐藏输入的服务器设置脚本 `deploy/set-admin-password.mjs`，把 PBKDF2 摘要和会话密钥保存于运行账户私有配置文件；部署脚本在重启前加载它。
- `/login`、签名 HttpOnly Cookie、8 小时会话、退出、错误安全码限制；后台页面、Keystatic 编辑页面及 API 需登录。未配置时后台锁定。
- `/api/inquiries` 删除公开 GET；前台写入加同源、大小和限流检查；配置安全响应头。备份/恢复和设置步骤见 `docs/admin-security.md`。
- 待办：本地功能测试、部署后用户在 SSH 终端运行一次设置脚本、线上登录与权限/前台询盘回归测试。服务器防火墙与系统更新不由网站代码替代。
- 本地生产构建通过；以临时测试安全码运行后验证：匿名 `/admin/inbox` 307、匿名 Keystatic 编辑接口 401、公开留言 GET 405、错误安全码跳回登录、正确安全码进入后台 200、退出 303、跨站表单请求 403、同源无效表单 400。线上安全码设置和实际登录仍待用户在 SSH 输入自选安全码后验证。
- `npm audit --omit=dev` 报告 14 项依赖告警（2 high，12 moderate），主要位于 Sanity 相关依赖链；需单独评估兼容升级，不能宣称零漏洞。
- 提交 a1f76a2 已推送，GitHub Actions 35173611498 部署成功。线上匿名 `/admin/inbox` 和 `/keystatic` 均 307 跳转 `/login`，匿名 Keystatic API 401，公开留言 GET 405，`/login` 和 `/contact` 均 200；同源但缺少字段的前台 POST 400，表明写入端点可达。尚未设置用户自选安全码，因此线上正确密码登录、真实前台提交和后台已登录读回仍待用户在 SSH 运行设置脚本后验证。
- 用户要求安全码改为 8–12 位；登录表单、服务器设置脚本和说明已同步调整，待构建与线上验证。
- 用户反馈登录跳到 `https://localhost:3000/login?error=setup`。线上无效测试登录复现 303 Location 指向 localhost；修复 `adminUrl` 在生产固定使用 `https://boholvending.com`。用户在聊天里发出的旧安全码长度为 15 位且已暴露，不应使用或存储；应由用户在服务器终端另选 8–12 位新安全码。
- 修复提交 719b7dc 的 GitHub Actions 35187178582 部署成功；线上无效测试登录现在 303 跳到 `https://boholvending.com/login?error=setup`，不再跳 localhost。`error=setup` 确认网站运行进程尚未加载后台安全码配置；待用户在 SSH 运行 `node deploy/set-admin-password.mjs` 并自行输入新码后，再验收实际登录。
- 用户多次在网页 SSH 中输入两次安全码仍失败，要求先给初始化密码再进后台修改。新增 `--generate`：在 SSH 终端生成并显示 12 位随机初始码，无需手输两遍；后台新增“安全设置”用于验证当前码后修改。认证运行时读取服务器私有配置文件，修改后新密码/会话密钥立即生效，旧会话失效。待本地测试、部署与用户实际登录验收。
- 本地生产构建无告警；临时测试配置验证：旧测试码登录后安全设置页 200，改码跳新登录页，旧会话立即 307 失效，旧码登录被拒，新码登录进入后台。临时凭据文件已清理。待生产部署和用户执行 `--generate`，之后验收实际登录与改码。
- 用户担心公开 `/admin` 易被自动扫描。后台页面入口已移至 `/bohol-control-7e9c2f`，同步修改登录跳转、工作台导航、安全设置返回地址及 Keystatic 返回链接；旧页面路径应返回 404。此举仅降低常见路径扫描，认证和服务端权限检查仍是实际防线。待构建、部署及线上匿名访问验证。此前用户设置初始安全码仍未确认完成。
- 提交 63b75a7 已推送，GitHub Actions 35189978949 部署成功。生产构建通过；线上匿名访问旧 `/admin` 返回 404、新入口返回 307 至 `/login`，响应 `Cache-Control: private, no-store`。已登录使用和初始化安全码仍待用户完成并确认。
- 首页首屏第 4 张 Eyelash 机器图在内置浏览器里被 studio 样式 `object-fit: cover` 横向铺满，出现黑底大块和产品跑偏。已改为保持比例完整显示、限制最大宽高并保留阴影；`npm run build` 通过，Impeccable 检测返回空列表。Playwright 截图工具因浏览器内核下载长时间无进度，未完成截图验证。
- 用户反馈等比例后仍有黑色区域，确认黑色来自 `eyelash-machine-dark-complete.webp` 图片本身。首页轮播第 4 张已改用 `eyelash-machine-cutout-v2.webp`，并移除对应黑底 studio 类名；`npm run build` 通过，Impeccable 检测返回空列表。
- 用户指出 `cutout-v2` 显示棋盘格，确认该文件为 RGB、棋盘格已烘焙进图片；项目内 `eyelash-machine-cutout.webp` 为 RGBA 真透明图。首页轮播第 4 张已改用 `eyelash-machine-cutout.webp`，目标为像冷饮机器图一样直接浮在深色背景上；`npm run build` 通过，Impeccable 检测返回空列表。
- 首页公司数据卡片下方新增 `FactoryVrShowcase`：三个场景（工厂外景、展厅、生产车间），带场景切换、缩略图和鼠标 3D 视差效果，使用现有真实/已发布图片资源。`npm run build` 通过，Impeccable 检测返回空列表；本地 Chrome 截图确认模块出现在公司数据下方。
- 2026-09-23 产品详情页重构：新增可点击切换的产品图库、主图全屏查看、真实产品图卖点区，以及工厂外景/生产/设计装配公司实力模块；壁挂款产品已迁入 `content/products`，后台新增公司实力标题、说明和生产图库字段。生产构建通过；本地页面验证 6 张产品图可切换、全屏图加载成功、全页无损坏图片。Impeccable 仅报告 `globals.css` 中任务范围外的既有全局样式告警。
- 2026-09-28 后台新增“Google 收录”页面，集中显示已启用的 Sitemap、robots、Canonical、SEO/GEO 与结构化数据，并提供真实 Sitemap、robots 和 Search Console 入口；产品页新增 Product 与 FAQ Schema.org 数据。后台不伪造收录状态，真实状态仍需 Search Console 授权查看。
- 2026-09-28 “Google 收录”页面新增用户提供的 Search Console 效果截图，通过管理员会话保护的 `/api/admin/search-console-snapshot` 读取；面板明确标记统计区间与静态截图属性，并保留实时 Search Console 入口。自动实时数据仍需 Search Console API 授权。
- 2026-09-28 静态 Search Console 截图改为真实 OAuth/API 数据面板：后台可上传 Web OAuth JSON 到服务器私有目录、连接 Google 只读授权，并查询 7/28/90 天的点击、曝光、CTR、排名及查询词/网页/国家/设备/日期。OAuth 凭据和 refresh token 不进入 Git；真实授权仍需用户在部署后的后台完成。
- 2026-09-28 SEO/GEO 自动化新增 2 篇英文文章：vending machine payment system integration 与 vending machine quality inspection checklist；均使用 BOHOL 本地产品图、官方 PCI/EMVCo/ISO/IEC 来源、内部链接、FAQ，并扩展 CMS 的 GEO 摘要、权威来源和 Article/FAQ Schema 字段。待生产部署与 Search Console 授权后请求收录。
- 2026-09-29 Search Console OAuth 授权完成后错误跳转到 `localhost:3000`：生产反向代理传入的内部 `request.url` 被回调路由直接用作跳转基址。回调成功、状态校验失败和换取令牌失败三个分支均改用生产安全的 `adminUrl`，避免暴露内部上游地址；本地生产构建通过，提交 `0f40005` 已部署，线上无参数回调的错误分支已验证跳转正式域名、不再指向 localhost。真实 Search Console 数据读回仍需管理员会话内打开页面确认。
- 2026-09-29 Google 收录后台扩展为同页真实数据工作台：直接显示概览、数据洞察、搜索效果、网址检查、网页表现和站点地图；新增只读 Sitemap API 与受管理员会话/同源校验保护的网址检查 API，只允许检查 BOHOL HTTPS 页面。生产构建通过，Impeccable 检测无告警；待部署后在已登录会话内验证 Google 实际返回值和手机排版。
- 2026-09-29 Google 收录后台“网页”列表改为每页固定 10 条，显示数字页码、上一页/下一页、当前页/总页数和总条数；切换统计时间后自动回到第 1 页。生产构建通过，Impeccable 检测无告警；待部署验证。
- 2026-09-29 SEO/GEO 自动化新增 2 篇英文文章：custom vending machine manufacturer RFQ guide 与 vending machine for Europe compliance guide。两篇均为 published CMS 内容，包含 GEO 摘要、FAQ、权威官方来源、自然内部链接、真实现有 BOHOL 产品/工厂图及 Article/FAQ Schema 所需字段；未修改机器图片。生产构建、保存后读回、页面 200、图片、内部链接、metadata、Schema、sitemap、robots 和桌面/手机首屏均已在本地验证。前两篇 2026-09-28 文章经 Google 搜索仍无法可靠确认收录，继续保留待收录；今日两篇待生产部署和 Search Console 请求。
- 2026-09-29 修复顶部导航从长文章底部跳转后仍停留在新页面底部的问题：新增统一 `TopNavigationLink`，在正常左键导航前显式回到页面顶部，并覆盖英文/中文桌面导航、移动菜单、下拉菜单、Logo、顶部询价按钮；语言切换也同步回到顶部。生产构建通过，Impeccable 检测无告警；项目未安装 Playwright/Puppeteer，因此本轮未做自动浏览器点击回归，待部署后人工点击确认。
- 2026-09-29 根据线上反馈补充页面渲染后的全局滚动校正：新增 `NavigationScrollReset` 监听 pathname/query，在 Next.js 完成客户端路由切换后以禁用平滑动画的方式将 document 滚动归零，避免框架再次恢复底部位置。内置浏览器逐项从页面底部实测 Home、Vending Machines、Solutions、Contact、Insights、About BOHOL，六项跳转后的 `window.scrollY` 均为 0；生产构建通过。
- 2026-09-29 统一压缩导航栏目页首屏顶部留白：`inner-page`、Contact、文章详情和案例详情的桌面顶部间距改为 48–64px，文章手机端改为 48px；About 新版页面原有 64px 顶距保持。内置浏览器确认 Insights、Vending Machines、Solutions、Contact 的实际顶部 padding 均约 51px，首屏标题和主图前移；生产构建通过。
- 2026-09-29 定位“后台需要打开两次”：生产 Nginx 将 `https://boholvending.com/任意路径` 301 到 `https://www.boholvending.com`，错误丢失 `$request_uri`，因此第一次打开后台会落到首页。已扩展 `scripts/server/fix-nginx.sh`，同时修复带/不带 `$request_uri` 的旧规则，并新增后台路径保留验证；需在生产服务器用 sudo 执行脚本后复测，未执行前不能宣称线上已修复。
- 2026-09-29 后台新增“社媒管理”模块：显示 Facebook、Instagram、LinkedIn、YouTube、TikTok、X、WhatsApp Business 的真实服务器配置状态；未配置时明确显示待配置。新增 WhatsApp Cloud API Webhook（GET 验证、POST App Secret 签名校验）、服务器私有 JSONL 聊天记录、会话列表和后台文字回复端点。历史手机聊天不会伪造导入；其他平台自动发布仍需各平台开发者应用、OAuth 与审核，当前不显示为已连接。
- 2026-09-30 SEO/GEO 自动化新增并发布 2 篇英文文章：vending machine for USA market buyer guide 与 vending machine manufacturing process guide。两篇均为 published CMS 内容，包含直接答案、GEO 摘要、FAQ、官方 OSHA/ADA/FCC/ISO/IEC 来源、自然内部链接及 Article/FAQ Schema 所需字段；分别使用 `E:\自动售货机\外贸冷饮机\7寸外贸制冷.jpg` 与 `E:\自动售货机\外贸睫毛机\外贸展厅.jpg` 的真实本地原图，未修图或改变机器。保存后读回、生产构建、文章页面、图片、内部链接、metadata、Schema、sitemap 和 robots 均已验证；提交 `1e279ad` 已推送，GitHub Actions 36654520577 部署成功，两个正式 URL 与图片均返回 200，sitemap 已包含新 URL。2026-09-28 与 2026-09-29 的 4 篇文章经 Google 搜索仍无法可靠确认收录，继续标记待收录；当前浏览器无可用 Search Console 会话，今日两篇记录为等待 Search Console 授权/人工请求，不声称已提交或已收录。
- 2026-10-01 SEO/GEO 自动化新增并发布 2 篇英文文章：custom vending machine cost factors 与 smart vending machine system guide。两篇均为 published CMS 内容，包含直接答案、GEO 摘要、FAQ、官方 ICC/US DOE/NIST/PCI SSC 来源、自然内部链接及 Article/FAQ Schema 所需字段；分别使用 `E:\自动售货机\冷饮机\e0d87265f570831731a3eeb1df3ba5a.jpg` 与 `E:\自动售货机\没logo产品图片\untitled.png` 的真实本地原图，未修图或改变机器。保存后读回、生产构建、文章页面、图片、内部/外部链接、metadata、Schema、sitemap、robots 及桌面/手机首屏均已验证；提交 `9516693` 已推送，GitHub Actions 36800239524 部署成功，两个正式 URL 与图片均返回 200，sitemap 已包含新 URL。项目现有 lint 仍被任务范围外的 6 个既有错误阻断，文章内容未新增 lint 错误。2026-09-28 至 2026-09-30 的 6 篇文章经 Google 搜索仍无法可靠确认收录，继续标记待收录；当前浏览器自动化不可用，今日两篇记录为等待 Search Console 授权/人工请求，不声称已提交或已收录。
- 2026-10-02 SEO/GEO 自动化新增并发布 2 篇全新英文文章：OEM vending machine guide 与 ODM vending machine development guide。两篇均为 published CMS 内容，包含前段直接答案、GEO 摘要、FAQ、官方 ISO/WIPO/ICC/IEC 来源、自然内部链接、转化询盘及 Article/FAQ Schema 所需字段；分别使用 `E:\自动售货机\没logo产品图片\untitle4.png` 与 `E:\自动售货机\组合柜，橱窗柜\58298aaba57a05fde834205c9d873a6.jpg` 的真实本地图片，仅做等比例缩放与 WebP 压缩，未改变机器结构、文字、Logo 或功能。保存后读回、生产构建、本地文章页面 200、图片、内部链接、metadata、Schema、sitemap、robots 及桌面/手机首屏均已验证；外部官方链接除 ISO 的自动请求被 403 防机器人拦截外均返回 200，ISO 页面已通过浏览查询确认。内容提交 `339bafd` 已推送，GitHub Actions 36950036637 部署成功；两个正式 URL 与两张新图片均返回 200，线上 Article/FAQ Schema、sitemap 和 robots 均通过验证。2026-09-28 至 2026-10-01 的 8 篇文章经 Google 搜索仍无法可靠确认收录，继续标记待收录；当前无可用的已登录 Search Console 浏览器会话，今日两篇记录为等待 Search Console 授权/人工请求，不声称已提交或已收录。
- 2026-10-02 用户复现后台安全码正确后仍落到前端首页。线上检查确认 `https://boholvending.com/bohol-control-7e9c2f` 被 Nginx 301 到 `https://www.boholvending.com` 且丢失路径；同时登录成功代码仍把目标生成为裸域名。已将生产 `adminUrl` 固定为 `https://www.boholvending.com`，使登录、退出、改密及相关后台回调不再经过会丢路径的裸域名重定向。生产构建通过，提交 `fe0a743` 已推送，GitHub Actions 36955789173 部署成功；线上无效安全码回归返回 303 且 Location 保持 `https://www.boholvending.com/login?error=invalid`，匿名后台入口仍以 307 跳转 `/login`。正确安全码的真实登录需用户重新输入后最终确认；服务器裸域名 Nginx 规则仍建议另行执行 `scripts/server/fix-nginx.sh`，但不再阻断后台登录流程。
- 2026-10-02 访问数据复盘显示最近 30 天记录 70 位访客、120 次访问、429 次浏览，但包含后台、Keystatic、管理员测试及疑似机房流量，不能直接视为潜在客户。统计脚本新增 `beforeSend` 过滤，停止采集登录、旧 admin、新后台、Keystatic 及相关管理 API；同时排除查询参数和 hash，并启用真实性能指标。robots 增加登录、后台、Keystatic 和管理 API 的抓取屏蔽。产品详情 metadata 改用绝对标题，避免根布局再次追加 `| BOHOL`。每日自动任务改为先读 Search Console/Umami 再优化：默认 2 篇，只有不重复、不蚕食且所有质量与发布验证通过时最多 4 篇，不以文章数量替代排名和询盘目标。生产构建通过；提交 `8e77618` 已推送，GitHub Actions 36957909366 部署成功。线上读回确认产品标题为单一 `Card Vending Machine | BOHOL`、robots 已屏蔽登录和新后台、页面包含统计过滤及性能采集配置。
- 2026-10-02 全站线上 SEO 审计覆盖 sitemap 的 81 个 URL：全部返回 200，未发现缺失 title、description、canonical 或异常 H1；发现 9 个中文首页/联系/产品页面共用 `智能自动售货机制造商 | BOHOL | BOHOL`。中文动态 metadata 已按首页、联系、产品列表和各产品的独立搜索意图重写，并使用 absolute title 避免品牌重复。生产构建通过；提交 `55a0ec7` 已推送，GitHub Actions 36959078548 部署成功。线上复查 `/zh`、`/zh/contact`、`/zh/vending-machines` 与卡牌产品页均返回 200，并输出独立标题且不再重复品牌。
- 2026-10-03 SEO/GEO 自动化新增并发布 2 篇英文文章：cold drink vending machine buying guide 与 vending machine maintenance design guide。两篇分别面向冷饮机采购和可维护性设计，包含前段直接答案、GEO 摘要、FAQ、官方 DOE/ENERGY STAR/OSHA/EPA 来源、自然内链、询盘转化和 Article/FAQ Schema 字段；使用 `E:\自动售货机\外贸冷饮机\7寸制冷.jpg` 与 `E:\自动售货机\外贸冷饮机\5275aec08898b64b9d1e79f9e73c533.jpg` 的真实本地图片，仅等比例缩放及 WebP 压缩，未改变机器结构、Logo、文字或功能。保存后读回、生产构建、本地页面 200、图片、内链、metadata、Schema、sitemap、robots 与桌面首屏均已验证；移动文章容器补充盒模型与溢出保护。OSHA 对自动 HEAD 请求返回 403 防机器人，其余官方来源返回 200，OSHA 正式页面已人工确认可访问。内容提交 `7fb2693` 已推送，GitHub Actions 37085636132 部署成功；两个正式 URL 和两张新图片均返回 200，线上 metadata、Article/FAQ Schema、sitemap 与 robots 均通过验证。此前 10 篇新 CMS 文章仍无可靠 Google 收录证据，继续标记待收录；当前无可用的已登录 Search Console 自动化会话，今日两篇记录为等待 Search Console 授权/人工请求，不声称已提交或已收录。
- 2026-10-04 SEO/GEO 优化：读取 Umami 最近约 30 天数据：81 位访客、133 次访问、443 次页面浏览、81 次跳出；其中历史后台/登录/Keystatic 和测试访问仍有污染，不能当成纯潜客数据。路径访客数：首页 68，`/vending-machines`、`/about`、`/solutions` 各 7，`/insights` 及 `/login` 各 6，`/contact` 5；来源 `google.com`、`google.com.hk` 各 1；国家以 US 57 为主，NL/CN 各 4；设备 laptop 53、mobile 25、desktop 3。事件中 5 位访客点击报价提交、2 位访客触发提交成功，WhatsApp 与 WeChat 点击各 2 位（小样本，且受历史过滤污染，不能解读为转化率）。据此将报价详情字段改为可选、减少表单阻力，并新增不携带个人信息的提交失败事件；下轮查看过滤生效后的真实提交/失败趋势。今日新增两篇 CMS published 英文指南：Hotel Vending Machine Buyer Guide（主词 `hotel vending machine`，`/insights/hotel-vending-machine-buyer-guide`）及 Gym Vending Machine Buyer Guide（`vending machine for gyms`，`/insights/gym-vending-machine-buyer-guide`）；均含 80–120 词直接回答、GEO摘要、FAQ、自然内链、询盘 CTA、Article/FAQ Schema 字段及至少两条官方来源。主图来自用户授权的酒店/健身房场景图片目录，转换为等比例 1440×810 WebP 并压缩；图片本身是说明性场景而非 BOHOL 客户安装实拍，alt/caption 明确披露。生产构建通过（70 routes）；两篇文章本地生产页 HTTP 200、图片加载成功；桌面（1280px）及手机视口（390px）均无横向溢出，主图在手机宽度内按比例显示。Google 搜索未可靠确认 2026-09-28 至 2026-10-04 新文章收录；GSC 未获得已登录授权，本日两条列为等待授权/人工请求，未声称提交或已收录。构建仍提示既有 `lib/google-search-console.ts` 动态文件读取会扩大跟踪文件范围，非本轮阻断项。
- 2026-10-04 发布复核：提交 `473aa66` 已推送，GitHub Actions 37168492539 成功。线上酒店与健身房文章、两张 WebP 主图均返回 200；标题、meta description（154/142 字符）、canonical、Article 与 FAQPage JSON-LD 符合预期；robots.txt 与 sitemap.xml 返回 200 且含 Sitemap 声明，新 URL 已进入 sitemap。引用的 US Access Board、ENERGY STAR、FDA 官方资料均可访问。Google 精确 site 查询没有可靠返回本日新文 URL，故仍标记待收录；GSC 会话/权限不可用，等待用户授权或人工提交网址检查。本轮移除本地工作目录里的临时验证文件未获授权且未执行，保留原样。
- 2026-10-05 SEO/GEO 增长记录：Umami 最近 30 天窗口读回 84 位访客、136 次访问、446 次页面浏览、84 次跳出；比 10-04 快照多 3 位访客、3 次访问及 3 次浏览，但滚动窗口不同且后台/旧测试路径仍有残留，不能视为净新增潜客。过滤管理/测试路径后，`/` 约 70 位访客，`/about`、`/solutions`、`/vending-machines` 各 7，`/insights` 6、`/contact` 5；Google 来源记录 2 次。5 位访客触发报价提交点击事件、2 位触发提交成功事件，WhatsApp 与 WeChat 点击各 2 位；小样本且受历史过滤影响，不计算或宣称转化率。GSC 本轮内置浏览器连续超时，未能读取已登录 Search Console 查询/排名/收录数据；对既有待收录 URL 的 Google `site:` 精确搜索未返回目标 URL，未新增已收录标记。
- 2026-10-06 SEO/GEO 增长记录：Umami 滚动 30 天读回 85 位访客、137 次访问、447 次页面浏览、85 次跳出；最近 7 天为 29 位访客、33 次访问、65 次浏览、26 次跳出，对照前 7 天原始值为 27/43/204/20。历史后台、登录、异常路径及测试访问仍有残留，不能把原始周环比解释为真实潜客或需求变化。过滤明显管理路径后 `/` 仍是主要入口；`/solutions` 最近 30 天约 7 位访客、最近 7 天约 1 位。近 7 天没有可用来源或询盘事件，30 天 Google 来源仍为极少量；样本不足以选定可靠的排名 8–20 优先词。GSC 已登录会话因浏览器读取超时不可用；对 16 条待收录 URL 作 Google 精确查询仍未能可靠确认收录，队列无状态变更。
- 基于现有 location 场景买家指南与 `/solutions` 商业页的对应关系，在英文 `/solutions` 场景卡下新增指向公寓、酒店、健身房三份买家指南的上下文内链，帮助用户从使用场景进入采购清单；未改动原产品卡、OEM/ODM 或联系 CTA。未发布新文章：现有 10 月 4–5 日指南已覆盖相邻购买意图，而本轮缺少可用 GSC 查询与转化证据，不为数量新增可能蚕食意图的内容。生产构建 72 routes 成功；本轮组件 ESLint 与 Impeccable detect 通过，桌面 1280px 和手机 390px 检查无横向溢出，方案页及三篇指南本地均 HTTP 200。待线上部署及 sitemap/robots 复核。
- 今日新增两篇内容：Apartment Building Vending Machine Buyer Guide（主词 `vending machine for apartments`，`/insights/apartment-building-vending-machine-buyer-guide`）与 Beauty Vending Machine for Salons: Buyer Guide（`beauty vending machine for salons`，`/insights/beauty-vending-machine-for-salons-guide`）。分别支持 `/solutions` residential 场景及 `/vending-machines/eyelash-vending-machine`，不复用酒店/健身房买家意图或睫毛产品页的纯产品意图。两文包含 80–120 词直接答案（公寓 107 词、美容 96 词）、GEO 摘要、5/4 条自然正文内链、各 4 个 FAQ、询盘 CTA、Article/FAQ Schema 字段和各 2 条官方来源（US Access Board/ENERGY STAR；FDA）。SEO 描述为 149/147 字符。图片选自用户授权的 `E:\自动售货机\冷饮机\281d9a23f2aa46882aa503228778510.jpg` 与 `E:\自动售货机\外贸睫毛机\外贸展厅.jpg`：前者完整等比置于中性 16:9 底图，后者纠正 EXIF 方向并中心裁切为 16:9，处理只涉及适配/压缩，没有重绘或更改机器、文字、Logo、支付模块或功能。第一张注明为机器格式参考、不是公寓现场；第二张保留可见的 Zhongda Smart/现有品牌，并注明不是 BOHOL 品牌或客户项目，避免把本地图误表述成 BOHOL 部署。
- 为支持每篇真实图片 alt，Keystatic news schema 新增 `coverImageAlt` 字段，文章主图从该字段读 alt，旧条目回退文章标题。保存后通过生产构建 read-back；本地两篇页面与图片 HTTP 200、meta/canonical、Article/FAQ JSON-LD（每篇 4 问）、正文内链及 `/sitemap.xml`、`/robots.txt` 均通过。构建生成 72 routes；桌面 1280px 与手机 390px 视口检查两文均无横向溢出。`npm run lint` 仍报 6 个既有错误和 5 个警告（错误在 Keystatic 导航、工厂展示、产品筛选和 GSC 面板文件；本轮文件无新增 lint 报错）。构建保留既有 GSC 动态文件读取 tracing warning。提交 `33aae58` 已推送 `main`，GitHub Actions 部署运行 `37252863271` 成功；线上两篇正式页面和主图均为 HTTP 200，meta/canonical、Article/FAQ Schema、生产 sitemap（包含两条新 URL）及 robots.txt 均已读回验证。部署后的 Google 精确 site 查询未可靠返回两条新 URL；GSC 授权会话不可用，故继续标为待收录，等待授权/人工网址检查，不宣称已提交或已收录。`.tmp-seo-check/` 是原有未跟踪内容，保持不动。
