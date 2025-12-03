# AOS & Hover Effects Usage Guide

## AOS (Animate On Scroll) Usage

AOS is now integrated and ready to use. Simply add data attributes to your elements:

### Basic Usage

```tsx
<div data-aos="fade-up">
  Content that fades up on scroll
</div>

<div data-aos="fade-in" data-aos-delay="200">
  Content with delay
</div>

<div data-aos="zoom-in" data-aos-duration="1000">
  Content with custom duration
</div>
```

### Available Animations

- `fade-up` - Fade in from bottom
- `fade-down` - Fade in from top
- `fade-left` - Fade in from right
- `fade-right` - Fade in from left
- `fade-up-right` - Fade in from bottom-right
- `fade-up-left` - Fade in from bottom-left
- `fade-down-right` - Fade in from top-right
- `fade-down-left` - Fade in from top-left
- `zoom-in` - Zoom in
- `zoom-out` - Zoom out
- `zoom-in-up` - Zoom in from bottom
- `zoom-in-down` - Zoom in from top
- `zoom-in-left` - Zoom in from right
- `zoom-in-right` - Zoom in from left
- `flip-left` - Flip from left
- `flip-right` - Flip from right
- `flip-up` - Flip from bottom
- `flip-down` - Flip from top

### Data Attributes

- `data-aos` - Animation type (required)
- `data-aos-delay` - Delay in milliseconds
- `data-aos-duration` - Duration in milliseconds
- `data-aos-easing` - Easing function
- `data-aos-offset` - Offset from trigger point
- `data-aos-anchor` - Anchor element
- `data-aos-anchor-placement` - Placement of anchor

### Example

```tsx
<section>
  <h1 data-aos="fade-up">Welcome</h1>
  <p data-aos="fade-up" data-aos-delay="100">
    This text fades in after the heading
  </p>
  <div data-aos="zoom-in" data-aos-duration="800">
    <img src="image.jpg" alt="Image" />
  </div>
</section>
```

## Hover Effects Usage

### CSS Classes

Add these classes to any element for instant hover effects:

#### 1. Hover Lift
```tsx
<div className="hover-lift">
  Lifts up on hover
</div>
```

#### 2. Hover Scale
```tsx
<div className="hover-scale">
  Scales up on hover
</div>
```

#### 3. Hover Glow
```tsx
<div className="hover-glow">
  Glows on hover
</div>
```

#### 4. Hover Rotate
```tsx
<div className="hover-rotate">
  Rotates slightly on hover
</div>
```

#### 5. Hover Brightness
```tsx
<img className="hover-brightness" src="image.jpg" />
```

#### 6. Hover Underline
```tsx
<a className="hover-underline">Link with animated underline</a>
```

#### 7. Hover Slide Background
```tsx
<button className="hover-slide-bg">
  Button with sliding shine effect
</button>
```

#### 8. Hover Border Glow
```tsx
<div className="hover-border-glow border-2">
  Border glows on hover
</div>
```

#### 9. Hover Text Gradient
```tsx
<h1 className="hover-text-gradient">
  Text with gradient on hover
</h1>
```

### React Components

Use these components for more advanced hover effects:

```tsx
import { HoverLift, HoverScale, HoverGlow, CardHover } from "@/components/premium/hover-effects"

<HoverLift>
  <Card>Content</Card>
</HoverLift>

<HoverScale scale={1.1}>
  <Image src="image.jpg" />
</HoverScale>

<HoverGlow>
  <div>Glowing content</div>
</HoverGlow>

<CardHover>
  <Card>Card with hover effect</Card>
</CardHover>
```

## Lenis Smooth Scroll

Lenis smooth scrolling is now active automatically. No configuration needed!

### Disable Smooth Scroll for Specific Elements

Add `data-lenis-prevent` to elements that should use native scrolling:

```tsx
<div data-lenis-prevent>
  Native scroll here
</div>
```

## Combining Effects

You can combine multiple effects:

```tsx
<div 
  className="hover-lift hover-glow"
  data-aos="fade-up"
  data-aos-delay="200"
>
  Combined effects
</div>
```

## Best Practices

1. **Performance**: Use AOS sparingly - don't animate every element
2. **Accessibility**: Respect `prefers-reduced-motion`
3. **Mobile**: Test hover effects on touch devices
4. **Delay**: Use delays to create staggered animations
5. **Duration**: Keep animations under 1 second for best UX

## Examples in Codebase

Check these files for examples:
- `app/explore/page.tsx` - Property cards with hover effects
- `components/layout/footer.tsx` - Footer with AOS animations
- `components/reusable/property-card.tsx` - Card hover effects

