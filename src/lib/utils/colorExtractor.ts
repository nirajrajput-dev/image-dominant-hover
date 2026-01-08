/**
 * RGB color representation
 */
export interface RGBColor {
    r: number;
    g: number;
    b: number;
  }
  
  /**
   * In-memory cache for extracted colors
   * Key: image src URL, Value: RGB color object
   */
  const colorCache = new Map<string, RGBColor>();
  
  /**
   * Converts RGB color to CSS rgb string
   */
  export function rgbToString(color: RGBColor): string {
    return `rgb(${color.r}, ${color.g}, ${color.b})`;
  }
  
  /**
   * Converts RGB to HSL to calculate perceived brightness
   * Used for accessibility considerations
   */
  export function calculateBrightness(color: RGBColor): number {
    // Using relative luminance formula (WCAG)
    const r = color.r / 255;
    const g = color.g / 255;
    const b = color.b / 255;
  
    const rLinear = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
    const gLinear = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
    const bLinear = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);
  
    return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
  }
  
  /**
   * Samples pixels from the center region of an image
   * This is faster than analyzing the entire image and works well for most cases
   */
  function sampleImagePixels(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement
  ): RGBColor {
    const width = img.naturalWidth || img.width;
    const height = img.naturalHeight || img.height;
  
    // Set canvas size to match image
    canvas.width = Math.min(width, 200); // Limit size for performance
    canvas.height = Math.min(height, 200);
  
    // Draw image on canvas
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  
    // Sample from center region (50% of image)
    const centerX = Math.floor(canvas.width * 0.25);
    const centerY = Math.floor(canvas.height * 0.25);
    const sampleWidth = Math.floor(canvas.width * 0.5);
    const sampleHeight = Math.floor(canvas.height * 0.5);
  
    // Get pixel data from center region
    const imageData = ctx.getImageData(centerX, centerY, sampleWidth, sampleHeight);
    const pixels = imageData.data;
  
    // Calculate average color
    let totalR = 0;
    let totalG = 0;
    let totalB = 0;
    let pixelCount = 0;
  
    // Sample every 4th pixel for performance (still gives good results)
    const step = 4;
    for (let i = 0; i < pixels.length; i += step * 4) {
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];
      const a = pixels[i + 3];
  
      // Skip transparent pixels
      if (a < 128) continue;
  
      // Skip very bright or very dark pixels (usually background/noise)
      const brightness = (r + g + b) / 3;
      if (brightness > 240 || brightness < 15) continue;
  
      totalR += r;
      totalG += g;
      totalB += b;
      pixelCount++;
    }
  
    // Calculate average
    if (pixelCount === 0) {
      // Fallback if no valid pixels found
      return { r: 128, g: 128, b: 128 };
    }
  
    return {
      r: Math.round(totalR / pixelCount),
      g: Math.round(totalG / pixelCount),
      b: Math.round(totalB / pixelCount),
    };
  }
  
  /**
   * Extracts dominant color from an image using canvas pixel sampling
   * Results are cached in memory for performance
   * 
   * @param imageSrc - The image source URL
   * @returns Promise resolving to RGB color object
   * @throws Error if image fails to load or canvas is not supported
   */
  export async function extractDominantColor(imageSrc: string): Promise<RGBColor> {
    // Check cache first
    const cached = colorCache.get(imageSrc);
    if (cached) {
      return cached;
    }
  
    return new Promise((resolve, reject) => {
      // Check canvas support
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
  
      if (!ctx) {
        reject(new Error('Canvas 2D context not supported'));
        return;
      }
  
      // Create image element
      const img = new Image();
      img.crossOrigin = 'anonymous'; // Enable CORS for external images
  
      img.onload = () => {
        try {
          const color = sampleImagePixels(canvas, ctx, img);
          
          // Cache the result
          colorCache.set(imageSrc, color);
          
          resolve(color);
        } catch (error) {
          reject(new Error(`Failed to extract color: ${error}`));
        }
      };
  
      img.onerror = () => {
        reject(new Error(`Failed to load image: ${imageSrc}`));
      };
  
      // Start loading image
      img.src = imageSrc;
    });
  }
  
  /**
   * Clears the color cache
   * Useful for memory management in long-running applications
   */
  export function clearColorCache(): void {
    colorCache.clear();
  }
  
  /**
   * Gets cache size (number of cached colors)
   */
  export function getCacheSize(): number {
    return colorCache.size;
  }