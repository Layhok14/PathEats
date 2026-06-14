---
name: PathEat Unified
colors:
  surface: '#f3fcef'
  surface-dim: '#d4ddd0'
  surface-bright: '#f3fcef'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#edf6ea'
  surface-container: '#e8f0e4'
  surface-container-high: '#e2ebde'
  surface-container-highest: '#dce5d9'
  on-surface: '#161d16'
  on-surface-variant: '#3d4a3d'
  inverse-surface: '#2a322a'
  inverse-on-surface: '#ebf3e7'
  outline: '#6d7b6c'
  outline-variant: '#bccbb9'
  surface-tint: '#006e2f'
  primary: '#006e2f'
  on-primary: '#ffffff'
  primary-container: '#22c55e'
  on-primary-container: '#004b1e'
  inverse-primary: '#4ae176'
  secondary: '#565e74'
  on-secondary: '#ffffff'
  secondary-container: '#dae2fd'
  on-secondary-container: '#5c647a'
  tertiary: '#9e4036'
  on-tertiary: '#ffffff'
  tertiary-container: '#ff8b7c'
  on-tertiary-container: '#76231b'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#6bff8f'
  primary-fixed-dim: '#4ae176'
  on-primary-fixed: '#002109'
  on-primary-fixed-variant: '#005321'
  secondary-fixed: '#dae2fd'
  secondary-fixed-dim: '#bec6e0'
  on-secondary-fixed: '#131b2e'
  on-secondary-fixed-variant: '#3f465c'
  tertiary-fixed: '#ffdad5'
  tertiary-fixed-dim: '#ffb4a9'
  on-tertiary-fixed: '#410001'
  on-tertiary-fixed-variant: '#7f2a21'
  background: '#f3fcef'
  on-background: '#161d16'
  surface-variant: '#dce5d9'
  route-blue: '#3B82F6'
  warning-amber: '#F59E0B'
  danger-red: '#EF4444'
  bg-light: '#F8FAFC'
  bg-dark: '#0F172A'
  surface-dark: '#1E293B'
typography:
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.2'
  caption:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: '1.2'
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: '1.2'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 24px
  map-sidebar-width: 30%
---

## Brand & Style
The design system is built for the "on-the-go" lifestyle, prioritizing utility, rapid comprehension, and route-centric discovery. The brand personality is efficient, reliable, and optimistic. 

The design style follows a **Corporate / Modern** aesthetic with a high-utility focus. It utilizes clear visual hierarchies and high-contrast elements to ensure readability in outdoor environments (glare, movement). The UI is "map-first," treating the geographic interface as the primary canvas while supporting information is presented in clean, structured overlays.

**Core Principles:**
- **Route-Awareness:** Every UI decision prioritizes the user's path.
- **Velocity of Information:** Minimized cognitive load for users who are commuting or walking.
- **High Legibility:** Bold weights and high-contrast color pairings for outdoor accessibility.

## Colors
The palette is dominated by **Route Green**, symbolizing growth and successful navigation. **Dark Navy** provides a professional, stable foundation, particularly for navigation and administrative structures.

**Usage Guidance:**
- **Primary (Route Green):** reserved for action-oriented elements like "Order," "Start Route," and active success states.
- **Secondary (Dark Navy):** used for structural elements (Sidebars, Navbars) and primary text in light mode.
- **Accent (Route Blue):** strictly used for path visualization and secondary interactive map layers to distinguish "where I'm going" from "what I'm eating."
- **Color Mode:** In Dark Mode, the background shifts to Dark Navy (#0F172A) with surfaces utilizing a lighter Navy variant (#1E293B) to maintain depth.

## Typography
This design system uses **Plus Jakarta Sans** (as a modern, highly legible alternative to Poppins/Inter) to maintain a friendly yet geometric and professional feel. 

Typography is scaled to ensure that critical information—like food prices and arrival times—is scannable at a glance. Headlines use tighter line heights for a compact, punchy look, while body text uses a more generous 1.6 scale to improve readability during movement.

## Layout & Spacing
The system uses a **Fluid Grid** model with a specific ratio for the "map-first" experience.

**Desktop Layout:** 
- A 70/30 split between the Map (primary viewport) and the Results/Filter panel.
- Elements utilize a 4px base unit for all padding and margins.

**Mobile Layout:** 
- A stacked approach where the map remains the background layer.
- Discovery results are presented in a draggable bottom sheet, allowing the user to control the ratio between map visibility and content list.
- Standard safe-area margins of 16px are enforced on all mobile screens.

## Elevation & Depth
Depth is used functionally to separate the interactive map from the interface controls.

- **Level 1 (Map):** The base layer.
- **Level 2 (Cards/Results):** Uses a subtle ambient shadow (0px 4px 12px, 5% opacity Navy) to appear as if floating just above the map.
- **Level 3 (Search/Modals):** Uses a higher elevation with a more pronounced shadow to grab immediate attention and indicate temporary interruption.

In Dark Mode, elevation is communicated through **Tonal Layers**. Cards are slightly lighter than the background (#1E293B vs #0F172A) to create visual distance without relying on shadows that are less visible in dark themes.

## Shapes
A **Rounded (0.5rem)** approach is standard across the system. This balance avoids the "playfulness" of pill shapes while feeling more modern and approachable than sharp corners. 

- **Standard Buttons/Inputs:** 0.5rem (8px)
- **Container/Cards:** 1rem (16px) for a soft, modern container feel.
- **Filter Chips:** 2rem (32px) to distinguish them as small, pill-shaped interactive tokens.

## Components

**Buttons:**
- **Primary:** Route Green background, White text. High-contrast, bold weight.
- **Secondary:** Dark Navy background, White text. Used for persistent nav or secondary actions.
- **Outline:** Transparent background, Route Green border/text. Used for tertiary actions.

**Filter Chips:**
- Pill-shaped with a light gray border and background. 
- Active state: Primary Green background with White text and a small checkmark icon.

**Input Fields:**
- White background (Light Mode) or Dark Surface (Dark Mode).
- 1px border (#E2E8F0). Focus state uses Route Blue border with a 2px outer glow.

**Cards (Vendor/Food):**
- Features a high-quality image at the top.
- Typography focus: Large bold price and clear star rating.
- Inline "Add to Route" button as the primary CTA.

**Map Markers:**
- Custom pins using Route Green for food locations and Route Blue for path points.
- Selected markers pulse and expand to show a mini-preview card.