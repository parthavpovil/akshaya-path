

# Akshaya Agent — Demo Login Flow

## Change 1: Rename to "Akshaya Agent"
- Update page title, meta tags, and navbar branding to "Akshaya Agent"

## Change 2: Landing Page with Demo CTA
- Dark hero page with "Akshaya Agent" branding, tagline, and animated mesh gradient background
- Prominent "Go to Demo →" button (saffron gradient) that navigates to the demo login screen
- Staggered fade-up text animations on mount

## Change 3: Demo Login Page (`/demo-login`)
- Centered glassmorphic login card on dark background
- Username and password input fields
- When the page loads, after a brief pause:
  1. Username field auto-types "demo_judge" character by character with a typewriter animation
  2. Password field auto-types "••••••••" with the same effect
  3. Login button gets a glow/pulse animation
  4. Button auto-clicks after a short delay
  5. Success toast appears, then auto-navigates to the main dashboard

## Change 4: Main Dashboard Page (`/dashboard`)
- The core SaarthiAI screen with:
  - Fixed navbar (backdrop-blur, "Akshaya Agent" logo in saffron gradient, nav links)
  - Welcome section with citizen stats cards (schemes available, applications, success rate)
  - Quick action buttons: "Browse Schemes", "Apply Now", "My Applications"
  - Recent activity feed placeholder
- Full dark theme with the specified color palette (ink background, saffron/teal accents, Sora + DM Sans fonts)

## Change 5: Routing & Navigation
- `/` → Landing page with demo CTA
- `/demo-login` → Auto-animated login screen
- `/dashboard` → Main dashboard after login

