# @niraj/image-dominant-hover

A lightweight React component library that replicates YouTube's thumbnail hover effect by extracting dominant colors from images and applying them as smooth background transitions.

[![npm version](https://img.shields.io/npm/v/@niraj/image-dominant-hover.svg)](https://www.npmjs.com/package/@niraj/image-dominant-hover)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)

## ✨ Features

- 🎨 **Automatic Color Extraction** - Canvas-based pixel sampling for accurate dominant color detection
- ⚡ **Performance Optimized** - Memory-based caching for instant color retrieval
- 🎬 **Smooth Animations** - Configurable transition effects that feel natural
- ♿ **Accessible** - WCAG AA compliant with proper ARIA attributes
- 📱 **Responsive** - Works seamlessly on desktop and mobile devices
- 🎯 **TypeScript First** - Full type definitions included
- 🪶 **Lightweight** - Zero dependencies (React is a peer dependency)

## 📦 Installation

```bash
npm install @niraj/image-dominant-hover
```

## 🚀 Quick Start

```tsx
import { ImageCard } from "@niraj/image-dominant-hover";

function App() {
  return (
    <ImageCard
      src="https://example.com/image.jpg"
      alt="Beautiful landscape"
      title="Mountain View"
      description="A stunning mountain landscape"
    />
  );
}
```

## 📖 API Reference

### ImageCard Props

| Prop                     | Type                        | Default     | Description                              |
| ------------------------ | --------------------------- | ----------- | ---------------------------------------- |
| `src`                    | `string`                    | _required_  | Image source URL                         |
| `alt`                    | `string`                    | _required_  | Alt text for accessibility               |
| `title`                  | `string`                    | `undefined` | Optional title displayed below image     |
| `description`            | `string`                    | `undefined` | Optional description text                |
| `width`                  | `number \| string`          | `300`       | Card width (px or CSS string)            |
| `height`                 | `number \| string`          | `180`       | Image height (px or CSS string)          |
| `className`              | `string`                    | `""`        | Additional CSS classes                   |
| `transitionDuration`     | `number`                    | `300`       | Transition duration in milliseconds      |
| `onClick`                | `() => void`                | `undefined` | Click handler (makes card interactive)   |
| `onColorExtracted`       | `(color: RGBColor) => void` | `undefined` | Callback when color extraction completes |
| `onColorExtractionError` | `(error: Error) => void`    | `undefined` | Callback when extraction fails           |

### RGBColor Type

```typescript
interface RGBColor {
  r: number; // 0-255
  g: number; // 0-255
  b: number; // 0-255
}
```

## 🎯 Usage Examples

### Basic Usage

```tsx
import { ImageCard } from "@niraj/image-dominant-hover";

<ImageCard src="/images/sunset.jpg" alt="Sunset over ocean" />;
```

### With Custom Dimensions

```tsx
<ImageCard
  src="/images/portrait.jpg"
  alt="Portrait photo"
  width={400}
  height={600}
/>
```

### With Click Handler

```tsx
<ImageCard
  src="/images/product.jpg"
  alt="Product showcase"
  title="Premium Headphones"
  description="Experience audio perfection"
  onClick={() => console.log("Card clicked!")}
/>
```

### With Callbacks

```tsx
<ImageCard
  src="/images/artwork.jpg"
  alt="Digital artwork"
  onColorExtracted={(color) => {
    console.log(`Dominant color: rgb(${color.r}, ${color.g}, ${color.b})`);
  }}
  onColorExtractionError={(error) => {
    console.error("Color extraction failed:", error);
  }}
/>
```

### Custom Transition Speed

```tsx
<ImageCard
  src="/images/nature.jpg"
  alt="Nature scene"
  transitionDuration={500} // Slower transition
/>
```

### Responsive Width

```tsx
<ImageCard
  src="/images/banner.jpg"
  alt="Banner image"
  width="100%"
  height="auto"
/>
```

## 🛠️ Utility Functions

The library also exports utility functions for advanced use cases:

### extractDominantColor

Extract dominant color from any image URL:

```typescript
import { extractDominantColor } from "@niraj/image-dominant-hover";

const color = await extractDominantColor("https://example.com/image.jpg");
console.log(color); // { r: 128, g: 64, b: 192 }
```

### rgbToString

Convert RGB object to CSS string:

```typescript
import { rgbToString } from "@niraj/image-dominant-hover";

const cssColor = rgbToString({ r: 255, g: 128, b: 0 });
console.log(cssColor); // "rgb(255, 128, 0)"
```

### calculateBrightness

Calculate perceived brightness (0-1):

```typescript
import { calculateBrightness } from "@niraj/image-dominant-hover";

const brightness = calculateBrightness({ r: 128, g: 128, b: 128 });
console.log(brightness); // ~0.215 (WCAG relative luminance)
```

### Cache Management

```typescript
import { getCacheSize, clearColorCache } from "@niraj/image-dominant-hover";

console.log(getCacheSize()); // Number of cached colors
clearColorCache(); // Clear all cached colors
```

## 🎨 Styling

The component uses inline styles by default, but you can customize appearance using the `className` prop:

```tsx
<ImageCard src="/images/photo.jpg" alt="Photo" className="my-custom-card" />
```

```css
.my-custom-card {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 2px solid #e0e0e0;
}

.my-custom-card:hover {
  transform: scale(1.05);
}
```

## ⚙️ How It Works

1. **Image Load**: Component renders with the provided image
2. **Color Extraction**: Canvas API samples center region pixels (asynchronously)
3. **Caching**: Extracted color is cached in memory for instant future use
4. **Hover Effect**: On hover, background smoothly transitions to the dominant color
5. **Performance**: Subsequent hovers use cached color (no re-extraction)

### Color Extraction Algorithm

- Samples from the center 50% of the image (most representative area)
- Skips transparent, very bright, and very dark pixels (noise reduction)
- Uses pixel averaging for accurate color representation
- Limits canvas size to 200×200px for optimal performance

## 🌐 Browser Support

- Chrome/Edge: ✅ Latest 2 versions
- Firefox: ✅ Latest 2 versions
- Safari: ✅ iOS 14+, macOS latest 2 versions
- Modern browsers with ES2020+ support

**Note**: Canvas API and `crossOrigin` support required for external images.

## 📝 CORS Considerations

For external images, ensure the server sends proper CORS headers:

```
Access-Control-Allow-Origin: *
```

Images without CORS headers will fail color extraction. Use same-origin images or configure your CDN appropriately.

## 🤝 Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## 📄 License

MIT © [Niraj Rajput](https://github.com/nirajrajput-dev)

## 🔗 Links

- [Demo](https://image-dominant-hover.vercel.app) (Coming soon)
- [GitHub Repository](https://github.com/nirajrajput-dev/image-dominant-hover)
- [npm Package](https://www.npmjs.com/package/@niraj/image-dominant-hover)
- [Report Issues](https://github.com/nirajrajput-dev/image-dominant-hover/issues)

## 🙏 Acknowledgments

Inspired by YouTube's thumbnail hover effect. Built with React, TypeScript, and Canvas API.
