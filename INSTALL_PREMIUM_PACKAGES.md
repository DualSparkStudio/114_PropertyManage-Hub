# Premium Packages Installation

To enable all premium features, install the following packages:

```bash
npm install framer-motion lenis gsap
```

## Package Details

### framer-motion
- **Version**: Latest
- **Purpose**: React animation library for smooth animations
- **Used in**: Text reveals, buttons, cursor, parallax, preloader

### lenis
- **Version**: Latest  
- **Purpose**: Smooth scrolling library
- **Used in**: Smooth scroll component

### gsap
- **Version**: Latest
- **Purpose**: Advanced animation library (optional, for future GSAP ScrollTrigger)
- **Used in**: Advanced scroll animations (future implementation)

## Installation Steps

1. Open terminal in project root
2. Run: `npm install framer-motion lenis gsap`
3. Wait for installation to complete
4. Restart dev server: `npm run dev`

## Verification

After installation, check that components work:
- Custom cursor should appear on desktop
- Buttons should have smooth animations
- Text should reveal on scroll
- Background effects should be visible

## Note

Some components have CSS fallbacks and will work without packages, but full functionality requires these packages.

