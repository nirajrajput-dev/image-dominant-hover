/**
 * @niraj/image-dominant-hover
 * 
 * A React component library that replicates YouTube's thumbnail hover effect
 * by extracting dominant colors from images and applying them as background colors.
 */

export { ImageCard } from './components/ImageCard';
export type { ImageCardProps } from './components/ImageCard';

export {
  extractDominantColor,
  rgbToString,
  calculateBrightness,
  clearColorCache,
  getCacheSize,
} from './utils/colorExtractor';

export type { RGBColor } from './utils/colorExtractor';