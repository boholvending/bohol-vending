# BOHOL Website Design System

## Direction

Premium industrial B2B. The site communicates engineering confidence, source-factory credibility and global readiness without decorative excess.

The public website guidance below remains unchanged. The authenticated administration workspace is an existing, separate operational surface: restrained light panels, dark blue navigation, compact Chinese labels and clear feedback. Its local patterns are documented below; they do not replace the public site's industrial visual system.

## Design dials

- Design variance: 7/10
- Motion intensity: 5/10
- Visual density: 4/10

## Color tokens

- Ink: `#071014`
- Paper: `#f4f6f5`
- White surface: `#fbfcfb`
- Muted text: `#5b696e`
- Divider: `#cbd4d4`
- Accent: `#49cce9`
- Strong accent: `#1599b6`

Use cyan as the only accent. Dark sections stay within the same cool neutral family rather than introducing another theme.

## Typography

- Manrope for body and interface text
- Space Grotesk for display headlines and key numbers
- Display tracking never tighter than `-0.04em`
- Body copy should remain between 65 and 75 characters per line where practical
- Labels are used sparingly. Headings should normally stand without a decorative eyebrow

## Layout

- Maximum content width: 1480px
- Desktop navigation height: 72px
- Sections use generous vertical separation and a clear visual job
- Asymmetric layouts collapse to one column below 768px
- Product imagery always reserves its dimensions to prevent layout shift

### Administration workspace

The existing admin shell uses a sidebar (228px), a white top bar (68px) and a flexible content region capped at 1500px. Content padding reduces from 32px to 20px at 850px and 16px at 600px. At 600px the sidebar becomes an in-flow header with horizontally scrollable navigation. These are administration-specific breakpoints, independent of the public website grid.

## Shape and depth

- The industrial system uses square containers and buttons
- Borders organize information; shadows are limited to menus and clear elevation states
- Cards are used only when they express hierarchy or an actionable destination

## Motion

- Motion communicates product selection, count-up progress or interaction feedback
- Animate transforms and opacity only
- Respect `prefers-reduced-motion`
- Avoid perpetual decorative effects beyond the single product presentation moment

## Interaction

- All interactive controls have hover, active and visible keyboard-focus states
- Minimum primary control height: 48px
- CTA labels stay on one line
- Cyan controls use dark text for contrast

## Content and imagery

- Use real BOHOL product and factory images
- Never invent customer deployments, contact information or compliance proof
- Product names and navigation labels remain consistent across English and Chinese routes
- Image captions describe the product directly and never cover essential product details

## Components

### Administration panels and controls

Preserve the incumbent admin palette and density: a pale background (`#f3f5f8`), white panels, dark blue text (`#172b42`), blue actions (`#175d9a`) and cool dividers (`#dae2eb`). Administration typography uses Arial, Microsoft YaHei and sans-serif at 14px/1.6; panel headings are 18px. Panels have gently rounded corners (12px), a thin border and 24px internal padding, reducing to 16px on small screens. Controls use smaller corners (5–7px). This local language is already established in `components/admin-workspace.module.css`.

### Status and conversation patterns

Status combines readable text with an icon: green for configured, muted amber for pending configuration. Color alone must not communicate readiness. Keep explanatory text adjacent to the relevant state, and retain separate success and error surfaces. Errors use a pale red background and dark red text; success uses a pale green background and dark green text.

Conversation selection uses a pale blue background and a blue inset edge, with `aria-current` exposing the selected item. Incoming messages align left on white; outgoing messages align right on pale blue. Timestamps and delivery-state text remain subordinate to message content. Keyboard focus is a visible blue outline (3px, offset 3px) on conversation selectors, links, refresh, reply and send controls. A disabled send control is visibly muted and non-actionable.

The social-management surface's composition, responsive behavior and operational states are specified in `.impeccable/surfaces/components-social-management-tsx.md`. Keep that composition local rather than applying chat-specific rules to unrelated admin screens.
