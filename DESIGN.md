---
name: Academic Professional
colors:
  surface: '#fef9f0'
  surface-dim: '#dfd9d2'
  surface-bright: '#FFFFFF'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f9f3eb'
  surface-container: '#f3ede5'
  surface-container-high: '#ede7df'
  surface-container-highest: '#e7e2da'
  on-surface: '#1d1b17'
  on-surface-variant: '#45464e'
  inverse-surface: '#32302b'
  inverse-on-surface: '#f6f0e8'
  outline: '#75777f'
  outline-variant: '#c5c6cf'
  surface-tint: '#4f5e81'
  primary: '#041534'
  on-primary: '#ffffff'
  primary-container: '#1b2a4a'
  on-primary-container: '#8392b7'
  inverse-primary: '#b7c6ee'
  secondary: '#5e5f5c'
  on-secondary: '#ffffff'
  secondary-container: '#e0e0dd'
  on-secondary-container: '#626361'
  tertiary: '#161714'
  on-tertiary: '#ffffff'
  tertiary-container: '#2b2b28'
  on-tertiary-container: '#93928e'
  error: '#9B2335'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d9e2ff'
  primary-fixed-dim: '#b7c6ee'
  on-primary-fixed: '#0a1a3a'
  on-primary-fixed-variant: '#384668'
  secondary-fixed: '#e3e2df'
  secondary-fixed-dim: '#c7c6c4'
  on-secondary-fixed: '#1b1c1a'
  on-secondary-fixed-variant: '#464745'
  tertiary-fixed: '#e4e2dd'
  tertiary-fixed-dim: '#c8c6c2'
  on-tertiary-fixed: '#1b1c19'
  on-tertiary-fixed-variant: '#474743'
  background: '#fef9f0'
  on-background: '#1d1b17'
  surface-variant: '#e7e2da'
  brand-hover: '#243660'
  text-heading: '#1A1814'
  text-secondary: '#5C5A52'
  text-muted: '#9B9890'
  text-disabled: '#C5C3BC'
  border-subtle: '#E5E3DE'
  border-medium: '#D8D6D0'
  success: '#2D6A4F'
  accent-blue: '#6B8AB8'
typography:
  headline-lg:
    fontFamily: Libre Baskerville
    fontSize: 36px
    fontWeight: '700'
    lineHeight: '1.25'
  headline-lg-mobile:
    fontFamily: Libre Baskerville
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.25'
  headline-md:
    fontFamily: Libre Baskerville
    fontSize: 28px
    fontWeight: '700'
    lineHeight: '1.3'
  headline-md-mobile:
    fontFamily: Libre Baskerville
    fontSize: 20px
    fontWeight: '700'
    lineHeight: '1.3'
  body-reading:
    fontFamily: Libre Baskerville
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.75'
  body-ui:
    fontFamily: IBM Plex Sans
    fontSize: 15px
    fontWeight: '400'
    lineHeight: '1.6'
  button:
    fontFamily: IBM Plex Sans
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.02em
  label-mono:
    fontFamily: IBM Plex Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.1em
  label-micro:
    fontFamily: IBM Plex Sans
    fontSize: 11px
    fontWeight: '600'
    lineHeight: '1'
spacing:
  max-width-content: 640px
  gutter-page: 40px
  gutter-page-mobile: 20px
  stack-lg: 40px
  stack-md: 32px
  stack-sm: 24px
  padding-btn: 12px 28px
  padding-card: 18px 20px
---

## Brand & Style

This design system embodies the "Academic Professional" aesthetic, specifically tailored for high-end corporate learning. It balances the intellectual rigor of a traditional institution with the streamlined efficiency of modern executive tools. The personality is authoritative, focused, and scholarly, designed to minimize cognitive load and maximize deep work.

The visual style is **Minimalist** with an emphasis on **Information-First Layouts**. It avoids unnecessary ornamentation, relying instead on high-quality typography, precise grid alignment, and a "paper and ink" tactile feel. The interface mimics a digital notebook or a premium journal, utilizing sharp corners and intentional whitespace to evoke a sense of discipline and clarity.

## Colors

The color strategy is rooted in high-contrast legibility. The primary Navy (#1B2A4A) acts as the anchor for all purposeful actions, progress indicators, and structural identity. The background hierarchy moves from a warm "paper" Surface Main (#F7F6F3) to a deeper Surface Dim (#EFEDE8) for contextual guidance boxes, and pure White (#FFFFFF) for active input areas.

Functional accents are muted to maintain a serious tone; Success is a deep forest green and Error is a scholarly brick red. Typography uses a tiered grayscale to guide the eye: near-black for headings, charcoal for body text, and a soft stone-gray for metadata and labels.

## Typography

This design system employs a sophisticated tri-font strategy. **Libre Baskerville** is reserved for high-level headings and long-form reading content (such as scenarios or student entries) to provide a classical, authoritative feel. 

**IBM Plex Sans** handles the functional UI layer—navigation, buttons, and short descriptions—ensuring modern clarity. **IBM Plex Mono** is used exclusively for technical metadata, step numbering, and "exercise" tags, reinforcing the systematic and process-oriented nature of the platform. All typography should follow the defined line-heights to maintain an open, readable vertical rhythm.

## Layout & Spacing

The layout philosophy follows a **Fixed Grid** approach for the core learning experience, constraining content to a `640px` maximum width. This constraint ensures optimal line length for reading and focus, centering the user's attention.

The spacing rhythm is built on a 4px/8px baseline. Vertical transitions between major content blocks should be generous (32px to 40px), while internal component spacing remains tight and structured. Mobile layouts should reduce side margins to 20px but maintain vertical stack units to preserve the "high-end" feel of the whitespace.

## Elevation & Depth

This design system uses a **flat, layered surface model** instead of traditional shadows. Depth is communicated through color-blocking and borders:

1.  **Surface Tiers:** The page background is the lowest tier (#F7F6F3). Elevated content sections or guidance boxes use #EFEDE8 or #FFFFFF to indicate a change in context.
2.  **Stroke Hierarchy:** Subtle borders (#E5E3DE) define structure. Interaction-ready elements like ghost buttons or textareas use a slightly darker stroke (#D8D6D0).
3.  **Accent Borders:** A 3px left-hand solid border in primary navy or accent blue is used to highlight specialized content (e.g., "Guidance" or "Introduction" blocks).
4.  **No Shadows:** Avoid drop shadows entirely. Depth is achieved by contrasting fills and crisp 1px lines.

## Shapes

The shape language is **Strictly Sharp (0px)**. All containers, buttons, inputs, and progress bars must have 0px border-radii. This geometric precision communicates professionalism, technical accuracy, and a disciplined academic tone.

## Components

-   **Buttons:** Rectangular with 1px borders. Primary buttons use #1B2A4A fill with white text. Ghost buttons use #D8D6D0 borders with #2C2A25 text. Hover states involve a slight darkening of the fill or border.
-   **Cards:** Use #FFFFFF background with a 1px #E5E3DE border. No shadows. Vertical stacking of information within cards should be separated by 1px dividers.
-   **Inputs:** Textareas and inputs use #FFFFFF backgrounds with a 1px #D8D6D0 border. Focus states should thicken the border or use the primary navy to highlight the active area.
-   **Progress Indicators:** Linear bars with a 0px radius. The track uses #E5E3DE and the fill uses the brand primary navy (#1B2A4A). Use the Success green for completed or high-achievement states.
-   **Chips/Tags:** Small, rectangular labels using IBM Plex Mono. They should use a light gray background (#EFEDE8) or a simple 1px border.
-   **Guidance Boxes:** Specialized containers for hints or instructions, featuring a 3px left-accent border and a Surface Dim (#EFEDE8) background.