# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-01-08

### Added

- Initial release of `@niraj/image-dominant-hover`
- `ImageCard` component with YouTube-style hover effect
- Canvas-based dominant color extraction algorithm
- Memory-based color caching for performance
- TypeScript support with full type definitions
- Comprehensive test suite with >98% coverage
- Accessibility features (ARIA attributes, keyboard navigation)
- Configurable transition duration
- Support for custom dimensions (width/height)
- Click handler support with keyboard accessibility
- Loading and error states
- Utility functions:
  - `extractDominantColor()` - Extract color from image URL
  - `rgbToString()` - Convert RGB to CSS string
  - `calculateBrightness()` - Calculate WCAG luminance
  - `getCacheSize()` - Get cache size
  - `clearColorCache()` - Clear color cache
- Complete documentation (README, CONTRIBUTING)
- MIT License

### Technical Details

- React 18+ peer dependency
- TypeScript 5.3+ with strict mode
- Vite for building and bundling
- Vitest for testing
- ESLint for code quality
- Support for ES2020+ browsers

[1.0.0]: https://github.com/nirajrajput-dev/image-dominant-hover/releases/tag/v1.0.0
