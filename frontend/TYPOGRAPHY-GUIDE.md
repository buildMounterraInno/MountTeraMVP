# Typography System Guide

## 🎨 Beatrice Font Hierarchy

### **Research-Based Font Strategy**
Based on analysis of top travel/adventure websites (Airbnb, Booking.com, Expedia) and UX best practices:

## **Font Classes & Usage**

### 📱 **Primary Hierarchy**
```html
<!-- Hero Sections / Landing Pages -->
<h1 class="font-hero font-bold text-5xl">Epic Mountain Adventures</h1>

<!-- Main Headings -->
<h1 class="font-heading font-bold text-3xl">Discover Your Next Trek</h1>

<!-- Large Display Text -->
<h2 class="font-display font-semibold text-2xl">Featured Destinations</h2>

<!-- Card Titles -->
<h3 class="font-card-title font-bold text-lg">Kedarkantha Trek</h3>

<!-- Body Text -->
<p class="font-body text-base">Experience the beauty of...</p>

<!-- UI Elements (buttons, nav, tags) -->
<button class="font-ui font-medium">Book Now</button>

<!-- Price Display -->
<span class="font-price font-bold text-xl">₹15,999</span>
```

### 🎯 **Specific Use Cases**

#### **Navigation**
```html
<nav class="font-nav font-medium">
  <a href="/">Home</a>
  <a href="/treks">Treks</a>
</nav>
```

#### **Cards (Events/Experiences)**
```html
<div class="card">
  <h3 class="font-card-title font-bold">Trek Title</h3>
  <p class="font-card-body">Description text...</p>
  <span class="font-ui text-xs">Duration</span>
  <span class="font-price font-bold">₹12,999</span>
</div>
```

#### **Buttons & CTAs**
```html
<button class="font-button font-semibold">Explore Treks</button>
<button class="font-ui font-medium">Learn More</button>
```

## **Font Weights Available**

| Weight | Class | Best For |
|--------|-------|----------|
| 100 | `font-thin` | Subtle text, watermarks |
| 300 | `font-light` | Secondary info, captions |
| 400 | `font-normal` | Body text, descriptions |
| 500 | `font-medium` | Buttons, UI elements |
| 600 | `font-semibold` | Subheadings, important info |
| 700 | `font-bold` | Headings, titles |
| 800 | `font-extrabold` | Hero text, impact statements |

## **Typography Psychology for Travel**

### **Trust Building** ✅
- **Body text**: `font-body` - Clean, readable Beatrice for trust
- **Descriptions**: `font-card-body` - Easy scanning for details

### **Adventure & Excitement** 🏔️
- **Hero text**: `font-hero` - BeatriceDisplay for impact
- **Headings**: `font-heading` - BeatriceHeadline for authority

### **Conversion Optimization** 💰
- **Prices**: `font-price` - BeatriceHeadline for emphasis
- **Buttons**: `font-button` - BeatriceDeck for clarity

### **User Experience** 🎯
- **Navigation**: `font-nav` - BeatriceDeck for quick scanning
- **UI Elements**: `font-ui` - Compact, clear information

## **Implementation Examples**

### **Landing Page**
```html
<section class="hero">
  <h1 class="font-hero font-extrabold text-6xl">Conquer the Himalayas</h1>
  <p class="font-body font-light text-xl">Your adventure begins here</p>
  <button class="font-button font-semibold">Start Your Journey</button>
</section>
```

### **Trek Card**
```html
<div class="trek-card">
  <h3 class="font-card-title font-bold text-xl">Roopkund Trek</h3>
  <p class="font-card-body text-sm">Mystery lake trek in Uttarakhand</p>
  <div class="font-ui text-xs">
    <span>7 Days</span> • <span>Moderate</span>
  </div>
  <span class="font-price font-bold text-lg">₹18,999</span>
</div>
```

### **Navigation**
```html
<nav class="font-nav font-medium">
  <a href="/">Home</a>
  <a href="/treks">Treks</a>
  <a href="/experiences">Experiences</a>
</nav>
```

## **Best Practices**

1. **Consistency**: Use the same font class for similar elements
2. **Hierarchy**: Larger fonts for more important content
3. **Readability**: Don't go below `font-light` for body text
4. **Contrast**: Ensure sufficient contrast with background
5. **Mobile**: Test all fonts on mobile devices

## **Quick Reference**

| Element Type | Font Class | Weight | Use Case |
|-------------|------------|---------|----------|
| Hero Title | `font-hero` | `font-bold` | Landing pages |
| Main Heading | `font-heading` | `font-bold` | Section titles |
| Card Title | `font-card-title` | `font-bold` | Product cards |
| Body Text | `font-body` | `font-normal` | Paragraphs |
| UI Text | `font-ui` | `font-medium` | Buttons, labels |
| Price | `font-price` | `font-bold` | Pricing display |
| Navigation | `font-nav` | `font-medium` | Menu items |

## **Font Loading Performance**
- All fonts are loaded locally for faster performance
- Font files are optimized TTF format
- Fallbacks: `ui-sans-serif, system-ui` for reliability