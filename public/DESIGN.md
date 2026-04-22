---
name: Everything
colors:
  surface: '#fff8f6'
  surface-dim: '#eed5cd'
  surface-bright: '#fff8f6'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fff1ed'
  surface-container: '#ffe9e3'
  surface-container-high: '#fde3db'
  surface-container-highest: '#f7ddd5'
  on-surface: '#261814'
  on-surface-variant: '#594139'
  inverse-surface: '#3c2d28'
  inverse-on-surface: '#ffede8'
  outline: '#8d7168'
  outline-variant: '#e1bfb5'
  surface-tint: '#ab3500'
  primary: '#ab3500'
  on-primary: '#ffffff'
  primary-container: '#ff6b35'
  on-primary-container: '#5f1900'
  inverse-primary: '#ffb59d'
  secondary: '#6d5b46'
  on-secondary: '#ffffff'
  secondary-container: '#f8dec3'
  on-secondary-container: '#74614b'
  tertiary: '#00677e'
  on-tertiary: '#ffffff'
  tertiary-container: '#00a7cb'
  on-tertiary-container: '#003744'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdbd0'
  primary-fixed-dim: '#ffb59d'
  on-primary-fixed: '#390c00'
  on-primary-fixed-variant: '#832600'
  secondary-fixed: '#f8dec3'
  secondary-fixed-dim: '#dbc3a8'
  on-secondary-fixed: '#261908'
  on-secondary-fixed-variant: '#544430'
  tertiary-fixed: '#b5ebff'
  tertiary-fixed-dim: '#59d5fb'
  on-tertiary-fixed: '#001f28'
  on-tertiary-fixed-variant: '#004e60'
  background: '#fff8f6'
  on-background: '#261814'
  surface-variant: '#f7ddd5'
typography:
  display-lg:
    fontFamily: Noto Serif SC
    fontSize: 40px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Noto Serif SC
    fontSize: 28px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-sm:
    fontFamily: Manrope
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.05em
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  unit: 8px
  container-padding: 24px
  gutter: 16px
  section-gap: 48px
---

## Brand & Style

This design system is built upon the philosophy of "Warm Minimalism." It bridges the gap between a high-stakes professional trading environment and a welcoming lifestyle gallery. The goal is to make asset trading feel less like a clinical financial transaction and more like a curated acquisition of value.

The visual style leverages **Tactile Minimalism**. It uses expansive white space and a restricted palette to maintain a premium feel, while employing organic shapes, soft shadows, and heritage-inspired typography to evoke warmth and trust. The interface should feel spacious and breathable, prioritizing high-quality lifestyle photography that places assets in real-world contexts.

## Colors

The palette is rooted in organic, earthy tones to move away from the "cold" blue typically associated with finance.

- **Primary Accent:** An energetic orange-red (#FF6B35) reserved for critical calls to action and active states. It provides a sharp, modern contrast to the muted background.
- **Background & Base:** A soft cream off-white (#F5F0EB) serves as the canvas, reducing eye strain and providing a more "paper-like" premium feel than pure white.
- **Typography:** A deep, near-black navy (#0A0A0A) ensures maximum legibility and authority.
- **Secondary Elements:** Soft earthy tones like sage, ochre, and warm grays are used for tags, category backgrounds, and subtle UI borders to maintain the natural aesthetic.

## Typography

The typographic hierarchy relies on a sophisticated contrast between serif and sans-serif typefaces. 

**Noto Serif SC** is used for all major headings and display text. This choice conveys tradition, elegance, and established trust. It should be typeset with generous leading to maintain a literary, editorial feel.

**Manrope** is the workhorse for body copy, data points, and interface labels. Its modern, geometric construction ensures clarity even at small sizes, providing the "efficient" counterbalance to the more decorative headings. Use uppercase styling with slight letter spacing for labels to create a professional, "architectural" look.

## Layout & Spacing

This design system utilizes a **Fixed-Width Fluid Hybrid** layout. On mobile, elements respect a 24px safe-margin on either side. The vertical rhythm is governed by an 8px base unit.

Spaciousness is a functional requirement here, not just an aesthetic one. Large gaps between sections (up to 48px or 64px) help separate different asset classes and investment data, preventing the user from feeling overwhelmed. Content blocks should feel like distinct "cards" floating on the cream background.

## Elevation & Depth

Depth is communicated through **Ambient Shadows** and **Tonal Layering** rather than harsh borders. 

- **Level 1 (Surface):** The cream background.
- **Level 2 (Cards):** Pure white surfaces with a very soft, diffused shadow (15% opacity of the secondary earthy tone, rather than pure black) to create a gentle "lift."
- **Level 3 (Pop-overs/Modals):** Increased shadow spread and backdrop blur (12px-20px) to focus the user's attention.

Avoid using black shadows; instead, use a darker tint of the background color to keep the "warmth" intact across all layers.

## Shapes

The shape language is defined by **Extreme Radii**. Large rounded corners (32px for cards and 40px+ for container wrappers) soften the professional nature of the app, making it feel approachable and modern.

Buttons and input fields should follow a pill-shaped or near-pill-shaped convention to maintain consistency with the large radii of the primary containers. Images of assets (cars, watches, real estate) should also feature rounded corners to blend into the UI seamlessly.

## Components

- **Primary Action Buttons:** Pill-shaped, #FF6B35 background with white text. Use a slight inner-glow to give a subtle tactile "pressable" feel.
- **Asset Cards:** Large white cards with 32px rounded corners. The top half should be a high-bleed lifestyle image, with the bottom half containing the Noto Serif title and Manrope data points.
- **Input Fields:** Soft cream-on-white fields with 16px corner radii. Focus states are indicated by a 2px border in the secondary earthy tone, not the primary accent, to keep the experience calm.
- **Chips/Tags:** Use the secondary earthy tones with low opacity (e.g., 10%) and dark text for categorizing assets (e.g., "Real Estate", "Collectibles").
- **Bottom Navigation:** A dark (#0A0A0A) floating "dock" with high roundedness, providing a grounded anchor to the light-themed app.
- **Status Indicators:** Use refined icons with thin strokes to indicate "Verified" or "Trusted" statuses, maintaining the premium feel.