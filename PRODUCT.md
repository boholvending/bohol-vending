# BOHOL Website Product Context

## Product

BOHOL is a bilingual B2B manufacturing website for intelligent vending machines. It presents real product categories, factory capabilities, OEM/ODM services and application concepts, then converts qualified buyers into direct enquiries.

## Primary users

- Overseas brand owners and distributors comparing source factories
- Vending operators evaluating machines for a specific product and market
- Procurement and engineering teams assessing customization, quality and delivery readiness

## Positioning

BOHOL is positioned as a source-direct manufacturer based in Panyu, Guangzhou, Guangdong, China, with 8 years of manufacturing and R&D experience and a 20,000 square metre facility. The site should feel precise, credible, international and commercially useful.

## Confirmed capabilities and proof points

- Vape, cold-drink, elevator-delivery and eyelash vending machines
- OEM/ODM cabinet, channel, interface, payment, electrical and branding customization
- English and Chinese content
- 8 years of manufacturing experience
- 20,000 square metre manufacturing facility
- 72-hour aging tests
- ISO 9001, CE and RoHS references supplied by the user
- Service across 30+ countries

## Brand and visual direction

- Preserve the BOHOL name and existing logo treatment
- Off-black, off-white and one cyan accent
- Premium industrial visual language with real product and factory imagery
- Strong typography, clear information hierarchy and restrained purposeful motion
- Product images must look natural, clean and fast to load

## Conversion paths

- Explore vending machines
- Review solutions and OEM/ODM capability
- Understand the factory and company profile
- Contact BOHOL for a quotation

## Constraints

- Preserve existing route slugs and primary navigation labels
- Do not invent customer results, addresses, phone numbers or certification details
- Keep performance, responsive behavior, accessibility and SEO metadata production-ready
- Exact contact details and approved customer case evidence remain open facts for launch

## Administration and social management

The authenticated BOHOL administration area also serves internal content operators and customer-service staff. Social management brings platform configuration visibility and WhatsApp Business conversations into the existing workspace.

- Facebook, Instagram, LinkedIn, YouTube, TikTok, X and WhatsApp Business show configuration readiness derived from required server environment values. “已配置” means the required values are present; it does not prove token validity, approved permissions or a working live connection. The other platforms currently provide status and developer-console links, not an implemented publishing workflow.
- Platform account passwords are not collected by this interface. Authorization tokens stay in private server configuration.
- WhatsApp Cloud API receives signed webhook events and stores incoming messages, outgoing text replies and delivery-status updates on the server. Sending requires an authenticated administrator and a same-origin request.
- The workspace groups messages by customer and supports reading a conversation and replying with up to 4000 characters. Configured workspaces refresh every 15 seconds and provide a manual refresh control. “消息已交给 WhatsApp 发送” confirms API acceptance, not delivery or reading by the customer.
- Only messages captured by this integration are available; phone chat history from before connection is not automatically imported. The interface displays the most recent 5000 messages and explicitly indicates when older records remain in storage.
- Unconfigured, configured-but-empty, send failure, storage read failure and skipped damaged-record states must remain explicit. Staff should be able to distinguish missing setup from missing history or an actual error.
- Free-text replies are subject to WhatsApp's customer-service window. The interface explains that approved Meta templates are required outside that window; template sending and media previews are not implemented here. Non-text messages display their caption or message-type placeholder.

The administration area preserves its existing restrained light interface and Chinese operational labels. Detailed surface behavior is recorded in `.impeccable/surfaces/components-social-management-tsx.md`.
