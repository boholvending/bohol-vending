# BOHOL social management

- Target: `components/social-management.tsx`, integrated through `components/admin-workspace.tsx`.
- Mode: Operate.
- Authority: preserve the existing light administration workspace in `components/admin-workspace.module.css`.
- Outcome: staff can understand platform setup readiness, select a WhatsApp customer, read captured history and submit a reply without confusing missing configuration, empty history and errors.

## Composition and responsive behavior

Platform connections appear first as divided rows containing platform name, purpose, configuration status and a developer-console link. The section header summarizes configured platforms. At 800px, links move below each row; at 600px each row stacks vertically.

WhatsApp follows in a bordered panel with contextual history guidance, setup status and a manual refresh control when configured. Desktop conversation selection occupies a 290px column beside the message history and reply form; it narrows to 220px at 800px. At 600px, conversation selectors become a horizontally scrollable strip above the active conversation and the reply controls stack. Mobile send height is at least 46px.

Message history scrolls within a region capped at 520px; on mobile it retains a 360px minimum height. Bubbles use at most 78% of the history width, capped at 620px. Incoming and outgoing messages differ in alignment, background and corner treatment. The customer name/number, message time and status remain visible.

## States and content boundaries

- Configuration status reflects required server values, not a live authorization probe. Preserve the labels “已配置”, “待配置” and “Webhook 可接入” with their explanation.
- Separate setup guidance (“先连接 WhatsApp Business”) from the configured empty state (“还没有 WhatsApp 会话”). Both provide the webhook endpoint context.
- Reply feedback distinguishes API acceptance, send failure and incomplete setup/input. Success is announced with a status role; storage failure and skipped-record warnings use alert roles.
- Display the history-limit notice when only the latest 5000 messages are loaded; older records remain in the storage file. Do not imply an imported or complete phone archive.
- Preserve the customer-service-window guidance below the reply field. Non-text content remains a caption or type placeholder, not a fabricated attachment preview.
- Changing customers resets the reply field for that conversation; sending is disabled when configuration or the selected conversation is unavailable.

## Evidence and acceptance

Documentation checked against the social component, shared admin CSS, platform-status resolver, message storage reader and WhatsApp send/webhook routes. The main task reported completed desktop and 390px visual acceptance and final finish-review disposition `ship` on 2026-09-29. This documentation pass did not repeat the visual review or establish live platform connectivity.
