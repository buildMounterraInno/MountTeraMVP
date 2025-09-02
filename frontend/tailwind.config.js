/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        white: '#f5f5eb',
        'white-custom': '#f5f5eb',
        gray: {
          50: '#fafaf8',
          100: '#f0f0e8',
          200: '#e5e5dc',
          300: '#d4d4ca',
          400: '#a3a399',
          500: '#737368',
          600: '#5c5c52',
          700: '#4a4a42',
          800: '#3a3a34',
          900: '#2a2a26',
          950: '#1a1a18',
        },
      },
      fontFamily: {
        // Default font (body text, paragraphs, general UI)
        'sans': ['Beatrice', 'ui-sans-serif', 'system-ui'],
        
        // Typography Hierarchy
        'body': ['Beatrice', 'ui-sans-serif', 'system-ui'],           // Body text, descriptions
        'heading': ['BeatriceHeadline', 'Beatrice', 'ui-sans-serif'], // Main headings (H1, H2)
        'display': ['BeatriceDisplay', 'Beatrice', 'ui-sans-serif'],  // Hero text, large showcase
        'ui': ['BeatriceDeck', 'Beatrice', 'ui-sans-serif'],          // Buttons, labels, compact UI
        
        // Specific Use Cases
        'hero': ['BeatriceDisplay', 'BeatriceHeadline', 'ui-sans-serif'],     // Landing page heroes
        'card-title': ['BeatriceHeadline', 'Beatrice', 'ui-sans-serif'],      // Card headings
        'card-body': ['Beatrice', 'ui-sans-serif', 'system-ui'],              // Card descriptions
        'button': ['BeatriceDeck', 'Beatrice', 'ui-sans-serif'],              // Buttons, CTAs
        'price': ['BeatriceHeadline', 'Beatrice', 'ui-sans-serif'],           // Pricing text
        'nav': ['BeatriceDeck', 'Beatrice', 'ui-sans-serif'],                 // Navigation
        
        // Legacy support
        'beatrice': ['Beatrice', 'ui-sans-serif', 'system-ui'],
        'beatrice-headline': ['BeatriceHeadline', 'Beatrice', 'ui-sans-serif'],
        'beatrice-display': ['BeatriceDisplay', 'Beatrice', 'ui-sans-serif'],
        'beatrice-deck': ['BeatriceDeck', 'Beatrice', 'ui-sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}