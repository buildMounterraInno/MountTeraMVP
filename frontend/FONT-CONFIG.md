# Font Configuration Guide

## Current Setup
✅ **Beatrice** is now the default font for the entire website

### Available Beatrice Font Variants:
- **Beatrice** (Regular) - For body text, UI components
- **BeatriceHeadline** - For large headings, hero text
- **BeatriceDisplay** - For decorative, showcase text
- **BeatriceDeck** - For compact, condensed text

### Font Weights Available:
- **Thin** (100) - `font-thin`
- **Light** (300) - `font-light` 
- **Regular** (400) - `font-normal`
- **Medium** (500) - `font-medium`
- **Semibold** (600) - `font-semibold`
- **Bold** (700) - `font-bold`
- **Extrabold** (800) - `font-extrabold`

## How to Use Different Beatrice Variants

### Using Tailwind Classes:
```html
<!-- Default Beatrice (body text) -->
<p class="font-sans">Regular body text</p>

<!-- Headlines -->
<h1 class="font-beatrice-headline font-bold text-4xl">Main Heading</h1>

<!-- Display text (decorative) -->
<h2 class="font-beatrice-display font-semibold text-2xl">Feature Title</h2>

<!-- Compact text -->
<span class="font-beatrice-deck font-medium text-sm">Compact Info</span>
```

## How to Change to a Different Font Family

### Option 1: Replace with Local Fonts
1. Add your font files to `src/assets/Fonts/`
2. Update the `@font-face` declarations in `src/index.css`
3. Update the font family variables in the `@theme` section

### Option 2: Switch to Google Fonts
1. **Update `index.html`** - Add Google Fonts link
2. **Update `src/index.css`** - Change the `--font-sans` variable
3. **Update `tailwind.config.js`** - Change the font family definitions

### Option 2: Advanced Configuration
If you want multiple fonts, update `tailwind.config.js`:

```javascript
theme: {
  extend: {
    fontFamily: {
      'sans': ['YourMainFont', 'ui-sans-serif', 'system-ui'],
      'heading': ['YourHeadingFont', 'ui-sans-serif', 'system-ui'],
      'body': ['YourBodyFont', 'ui-sans-serif', 'system-ui'],
    },
  },
}
```

## Popular Font Alternatives

### Sans-Serif Options:
- **Inter**: Modern, clean, excellent readability
- **Poppins**: Rounded, friendly, popular for modern sites
- **Roboto**: Google's flagship font, very versatile
- **Open Sans**: Humanist, great for body text

### Serif Options:
- **Playfair Display**: Elegant, great for headings
- **Lora**: Readable serif for body text
- **Crimson Text**: Classic book-style serif

### Display Fonts:
- **Oswald**: Bold, condensed, great for headings
- **Raleway**: Elegant, thin, modern

## Example: Switching to Inter Font

1. **Update index.html:**
```html
<link
  href="https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,100..900;1,100..900&display=swap"
  rel="stylesheet"
/>
```

2. **Update src/index.css @theme section:**
```css
@theme {
  /* Fonts - Main Site Font */
  --font-sans: 'Inter', ui-sans-serif, system-ui;
  --font-beatrice: 'Inter', ui-sans-serif, system-ui;
  --font-tpc: 'Inter', sans-serif;
}
```

3. **Update tailwind.config.js:**
```javascript
fontFamily: {
  'sans': ['Inter', 'ui-sans-serif', 'system-ui'],
  'beatrice': ['Inter', 'ui-sans-serif', 'system-ui'],
},
```

## Font Weight Classes Available:
- `font-thin` (100)
- `font-extralight` (200)
- `font-light` (300)
- `font-normal` (400)
- `font-medium` (500)
- `font-semibold` (600)
- `font-bold` (700)
- `font-extrabold` (800)
- `font-black` (900)

## Testing Your Font Change:
After making changes, restart your dev server:
```bash
npm run dev
```

The font will automatically apply to all text across the website since it's set as the default sans-serif font.