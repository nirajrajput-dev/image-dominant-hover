import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import {
  extractDominantColor,
  rgbToString,
  calculateBrightness,
  clearColorCache,
  getCacheSize,
  type RGBColor,
} from './colorExtractor';

describe('colorExtractor', () => {
  beforeEach(() => {
    clearColorCache();
    vi.clearAllMocks();
  });

  describe('rgbToString', () => {
    it('should convert RGB object to CSS string', () => {
      const color: RGBColor = { r: 255, g: 128, b: 64 };
      expect(rgbToString(color)).toBe('rgb(255, 128, 64)');
    });

    it('should handle zero values', () => {
      const color: RGBColor = { r: 0, g: 0, b: 0 };
      expect(rgbToString(color)).toBe('rgb(0, 0, 0)');
    });

    it('should handle maximum values', () => {
      const color: RGBColor = { r: 255, g: 255, b: 255 };
      expect(rgbToString(color)).toBe('rgb(255, 255, 255)');
    });
  });

  describe('calculateBrightness', () => {
    it('should return 0 for black', () => {
      const black: RGBColor = { r: 0, g: 0, b: 0 };
      expect(calculateBrightness(black)).toBe(0);
    });

    it('should return 1 for white', () => {
      const white: RGBColor = { r: 255, g: 255, b: 255 };
      expect(calculateBrightness(white)).toBeCloseTo(1, 5);
    });

    it('should return value between 0 and 1 for gray', () => {
      const gray: RGBColor = { r: 128, g: 128, b: 128 };
      const brightness = calculateBrightness(gray);
      expect(brightness).toBeGreaterThan(0);
      expect(brightness).toBeLessThan(1);
    });

    it('should weight green more than red and blue', () => {
      const red: RGBColor = { r: 255, g: 0, b: 0 };
      const green: RGBColor = { r: 0, g: 255, b: 0 };
      const blue: RGBColor = { r: 0, g: 0, b: 255 };

      const redBrightness = calculateBrightness(red);
      const greenBrightness = calculateBrightness(green);
      const blueBrightness = calculateBrightness(blue);

      expect(greenBrightness).toBeGreaterThan(redBrightness);
      expect(greenBrightness).toBeGreaterThan(blueBrightness);
    });
  });

  describe('extractDominantColor', () => {
    let mockCanvas: HTMLCanvasElement;
    let mockContext: CanvasRenderingContext2D;
    let mockImage: HTMLImageElement;

    beforeEach(() => {
      // Create mock canvas with proper methods
      mockCanvas = {
        width: 0,
        height: 0,
        getContext: vi.fn(),
      } as unknown as HTMLCanvasElement;

      // Create mock 2D context
      mockContext = {
        drawImage: vi.fn(),
        getImageData: vi.fn(() => {
          // Return mock image data with red pixels
          const data = new Uint8ClampedArray(400 * 4); // 20x20 pixels
          for (let i = 0; i < data.length; i += 4) {
            data[i] = 200;     // R
            data[i + 1] = 100; // G
            data[i + 2] = 50;  // B
            data[i + 3] = 255; // A
          }
          return { data, width: 20, height: 20 } as ImageData;
        }),
      } as unknown as CanvasRenderingContext2D;

      // Mock canvas.getContext to return our mock context
      (mockCanvas.getContext as any).mockReturnValue(mockContext);

      // Create mock image
      mockImage = {
        width: 100,
        height: 100,
        naturalWidth: 100,
        naturalHeight: 100,
        crossOrigin: '',
        src: '',
        onload: null as ((ev: Event) => void) | null,
        onerror: null as ((ev: Event) => void) | null,
      } as unknown as HTMLImageElement;

      // Mock document.createElement for canvas
      vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
        if (tagName === 'canvas') {
          return mockCanvas;
        }
        return document.createElement(tagName);
      });

      // Mock Image constructor
      global.Image = class MockImage {
        width = 100;
        height = 100;
        naturalWidth = 100;
        naturalHeight = 100;
        crossOrigin = '';
        src = '';
        onload: ((ev: Event) => void) | null = null;
        onerror: ((ev: Event) => void) | null = null;

        constructor() {
          // Simulate async image loading
          setTimeout(() => {
            if (this.onload) {
              this.onload(new Event('load'));
            }
          }, 0);
        }
      } as any;
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('should extract color from image', async () => {
      const imgSrc = 'https://example.com/test.jpg';
      const color = await extractDominantColor(imgSrc);

      expect(color).toHaveProperty('r');
      expect(color).toHaveProperty('g');
      expect(color).toHaveProperty('b');
      expect(color.r).toBeGreaterThanOrEqual(0);
      expect(color.r).toBeLessThanOrEqual(255);
      expect(color.g).toBeGreaterThanOrEqual(0);
      expect(color.g).toBeLessThanOrEqual(255);
      expect(color.b).toBeGreaterThanOrEqual(0);
      expect(color.b).toBeLessThanOrEqual(255);
    });

    it('should cache extracted colors', async () => {
      const imgSrc = 'https://example.com/cached.jpg';

      expect(getCacheSize()).toBe(0);

      // First extraction
      const color1 = await extractDominantColor(imgSrc);
      expect(getCacheSize()).toBe(1);

      // Second extraction should use cache (no new Image created)
      const color2 = await extractDominantColor(imgSrc);
      expect(getCacheSize()).toBe(1);
      expect(color2).toEqual(color1);
    });

    it('should reject when image fails to load', async () => {
      const imgSrc = 'https://example.com/invalid.jpg';

      // Override Image mock to fail
      global.Image = class FailingMockImage {
        width = 0;
        height = 0;
        naturalWidth = 0;
        naturalHeight = 0;
        crossOrigin = '';
        src = '';
        onload: ((ev: Event) => void) | null = null;
        onerror: ((ev: Event) => void) | null = null;

        constructor() {
          setTimeout(() => {
            if (this.onerror) {
              this.onerror(new Event('error'));
            }
          }, 0);
        }
      } as any;

      await expect(extractDominantColor(imgSrc)).rejects.toThrow('Failed to load image');
    });

    it('should handle canvas context failure', async () => {
      const imgSrc = 'https://example.com/test.jpg';

      // Mock getContext to return null
      (mockCanvas.getContext as any).mockReturnValue(null);

      await expect(extractDominantColor(imgSrc)).rejects.toThrow('Canvas 2D context not supported');
    });
  });

  describe('clearColorCache', () => {
    let mockCanvas: HTMLCanvasElement;
    let mockContext: CanvasRenderingContext2D;

    beforeEach(() => {
      // Setup mocks similar to extractDominantColor tests
      mockCanvas = {
        width: 0,
        height: 0,
        getContext: vi.fn(),
      } as unknown as HTMLCanvasElement;

      mockContext = {
        drawImage: vi.fn(),
        getImageData: vi.fn(() => {
          const data = new Uint8ClampedArray(400 * 4);
          for (let i = 0; i < data.length; i += 4) {
            data[i] = 200;
            data[i + 1] = 100;
            data[i + 2] = 50;
            data[i + 3] = 255;
          }
          return { data, width: 20, height: 20 } as ImageData;
        }),
      } as unknown as CanvasRenderingContext2D;

      (mockCanvas.getContext as any).mockReturnValue(mockContext);

      vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
        if (tagName === 'canvas') {
          return mockCanvas;
        }
        return document.createElement(tagName);
      });

      global.Image = class MockImage {
        width = 100;
        height = 100;
        naturalWidth = 100;
        naturalHeight = 100;
        crossOrigin = '';
        src = '';
        onload: ((ev: Event) => void) | null = null;
        onerror: ((ev: Event) => void) | null = null;

        constructor() {
          setTimeout(() => {
            if (this.onload) {
              this.onload(new Event('load'));
            }
          }, 0);
        }
      } as any;
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('should clear the cache', async () => {
      const imgSrc = 'https://example.com/test.jpg';

      await extractDominantColor(imgSrc);
      expect(getCacheSize()).toBe(1);

      clearColorCache();
      expect(getCacheSize()).toBe(0);
    });
  });

  describe('getCacheSize', () => {
    let mockCanvas: HTMLCanvasElement;
    let mockContext: CanvasRenderingContext2D;

    beforeEach(() => {
      mockCanvas = {
        width: 0,
        height: 0,
        getContext: vi.fn(),
      } as unknown as HTMLCanvasElement;

      mockContext = {
        drawImage: vi.fn(),
        getImageData: vi.fn(() => {
          const data = new Uint8ClampedArray(400 * 4);
          for (let i = 0; i < data.length; i += 4) {
            data[i] = 200;
            data[i + 1] = 100;
            data[i + 2] = 50;
            data[i + 3] = 255;
          }
          return { data, width: 20, height: 20 } as ImageData;
        }),
      } as unknown as CanvasRenderingContext2D;

      (mockCanvas.getContext as any).mockReturnValue(mockContext);

      vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
        if (tagName === 'canvas') {
          return mockCanvas;
        }
        return document.createElement(tagName);
      });

      global.Image = class MockImage {
        width = 100;
        height = 100;
        naturalWidth = 100;
        naturalHeight = 100;
        crossOrigin = '';
        src = '';
        onload: ((ev: Event) => void) | null = null;
        onerror: ((ev: Event) => void) | null = null;

        constructor() {
          setTimeout(() => {
            if (this.onload) {
              this.onload(new Event('load'));
            }
          }, 0);
        }
      } as any;
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('should return 0 for empty cache', () => {
      expect(getCacheSize()).toBe(0);
    });

    it('should return correct size after caching', async () => {
      const img1 = 'https://example.com/img1.jpg';
      const img2 = 'https://example.com/img2.jpg';

      await extractDominantColor(img1);
      await extractDominantColor(img2);

      expect(getCacheSize()).toBe(2);
    });
  });
});