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
