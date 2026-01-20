import { useState } from 'react';
import { ImageCard, type RGBColor, rgbToString, calculateBrightness } from '../../src/lib/index';
import './App.css';

// Sample images from Unsplash (public domain)
const sampleImages = [
  {
    src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    alt: 'Mountain landscape',
    title: 'Mountain Peak',
    description: 'Majestic mountain at sunrise',
  },
  {
    src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
    alt: 'Person portrait',
    title: 'Creative Portrait',
    description: 'Professional photography',
  },
  {
    src: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=400&h=300&fit=crop',
    alt: 'Cat portrait',
    title: 'Adorable Cat',
    description: 'Cute feline friend',
  },
  {
    src: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop',
    alt: 'Nature scene',
    title: 'Forest Path',
    description: 'Peaceful woodland trail',
  },
  {
    src: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=400&h=300&fit=crop',
    alt: 'Abstract art',
    title: 'Modern Abstract',
    description: 'Contemporary digital art',
  },
  {
    src: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&h=300&fit=crop',
    alt: 'Sunset beach',
    title: 'Beach Sunset',
    description: 'Golden hour by the ocean',
  },
];

function App() {
  const [selectedColor, setSelectedColor] = useState<RGBColor | null>(null);
  const [clickedCard, setClickedCard] = useState<string | null>(null);

  const handleColorExtracted = (color: RGBColor, title: string) => {
    console.log(`Color extracted for ${title}:`, rgbToString(color));
    const brightness = calculateBrightness(color);
    console.log(`Brightness: ${(brightness * 100).toFixed(1)}%`);
  };

  const handleCardClick = (title: string) => {
    setClickedCard(title);
    setTimeout(() => setClickedCard(null), 2000);
  };

  return (
    <div className="app">
      <header className="header">
        <h1 className="title">@niraj/image-dominant-hover</h1>
        <p className="subtitle">
          YouTube-style hover effect with dominant color extraction
        </p>
        <div className="badges">
          <span className="badge">React 18+</span>
          <span className="badge">TypeScript</span>
          <span className="badge">Zero Dependencies</span>
        </div>
      </header>

      <section className="demo-section">
        <h2 className="section-title">Live Demo</h2>
        <p className="section-description">
          Hover over any image card to see the dominant color effect in action!
        </p>

        <div className="cards-grid">
          {sampleImages.map((image, index) => (
            <ImageCard
              key={index}
              src={image.src}
              alt={image.alt}
              title={image.title}
              description={image.description}
              width={320}
              height={200}
              transitionDuration={300}
              onClick={() => handleCardClick(image.title)}
              onColorExtracted={(color: RGBColor) => {
                setSelectedColor(color);
                handleColorExtracted(color, image.title);
              }}
              onColorExtractionError={(error: Error) => {
                console.error(`Failed to extract color for ${image.title}:`, error);
              }}
              className="demo-card"
            />
          ))}
        </div>

        {clickedCard && (
          <div className="notification">
            ✨ Clicked: {clickedCard}
          </div>
        )}
      </section>

      <section className="info-section">
        <div className="info-card">
          <h3>🎨 How It Works</h3>
          <ol>
            <li>Image loads and displays</li>
            <li>Canvas API extracts dominant color</li>
            <li>Color is cached in memory</li>
            <li>Hover triggers smooth background transition</li>
          </ol>
        </div>

        <div className="info-card">
          <h3>✨ Features</h3>
          <ul>
            <li>Automatic color extraction</li>
            <li>Performance optimized with caching</li>
            <li>Smooth animations (customizable)</li>
            <li>Fully accessible (WCAG AA)</li>
            <li>TypeScript support</li>
          </ul>
        </div>

        <div className="info-card">
          <h3>📦 Installation</h3>
          <pre className="code-block">
            npm install @niraj/image-dominant-hover
          </pre>
        </div>

        {selectedColor && (
          <div className="info-card color-info">
            <h3>🎯 Last Extracted Color</h3>
            <div className="color-display">
              <div
                className="color-swatch"
                style={{ backgroundColor: rgbToString(selectedColor) }}
              />
              <div className="color-details">
                <p><strong>RGB:</strong> {rgbToString(selectedColor)}</p>
                <p><strong>Values:</strong> R:{selectedColor.r} G:{selectedColor.g} B:{selectedColor.b}</p>
                <p><strong>Brightness:</strong> {(calculateBrightness(selectedColor) * 100).toFixed(1)}%</p>
              </div>
            </div>
          </div>
        )}
      </section>

      <footer className="footer">
        <p>
          Built with ❤️ by{' '}
          <a
            href="https://github.com/nirajrajput-dev"
            target="_blank"
            rel="noopener noreferrer"
          >
            Niraj Rajput
          </a>
        </p>
        <div className="footer-links">
          <a
            href="https://github.com/nirajrajput-dev/image-dominant-hover"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          <span>•</span>
          <a
            href="https://www.npmjs.com/package/@niraj/image-dominant-hover"
            target="_blank"
            rel="noopener noreferrer"
          >
            npm
          </a>
          <span>•</span>
          <a
            href="https://github.com/nirajrajput-dev/image-dominant-hover/blob/main/LICENSE"
            target="_blank"
            rel="noopener noreferrer"
          >
            MIT License
          </a>
        </div>
      </footer>
    </div>
  );
}

export default App;