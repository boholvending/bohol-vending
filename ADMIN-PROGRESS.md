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
- 尚未安装服务器 Umami，尚未拿到真实 Website ID / Share URL，尚未验证生产数据流。
