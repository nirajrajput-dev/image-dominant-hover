import { useState } from 'react';
import { ImageCard, type RGBColor } from '../../src/lib/index';
import './App.css';

const cards = [
  {
    src: 'https://images.unsplash.com/photo-1565726089014-3f292ec3e65a?q=80&w=1260&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    alt: 'Sunrise over mountains',
    title: 'Sunrise',
    description: 'Golden light breaks dawn',
  },
  {
    src: 'https://images.unsplash.com/photo-1564500617448-e541b1df7cee?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    alt: 'Clouds in the sky',
    title: 'Clouds',
    description: 'Soft whispers above us',
  },
  {
    src: 'https://images.unsplash.com/photo-1546721485-73d443535041?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    alt: 'Aurora Borealis',
    title: 'Aurora Borealis',
    description: 'Dancing lights in darkness',
  },
];

// Helper function to dim the dominant color (reduce saturation and brightness)
function dimColor(color: RGBColor, factor: number = 0.4): string {
  const r = Math.round(color.r * factor);
  const g = Math.round(color.g * factor);
  const b = Math.round(color.b * factor);
  return `rgb(${r}, ${g}, ${b})`;
}

// Helper function to mix dominant color subtly with base colors
function mixColorWithBase(dominantColor: RGBColor, baseHex: string, mixRatio: number = 0.15): string {
  // Parse base color hex
  const baseR = parseInt(baseHex.slice(1, 3), 16);
  const baseG = parseInt(baseHex.slice(3, 5), 16);
  const baseB = parseInt(baseHex.slice(5, 7), 16);
  
  // Mix colors (subtle blend)
  const r = Math.round(baseR * (1 - mixRatio) + dominantColor.r * mixRatio);
  const g = Math.round(baseG * (1 - mixRatio) + dominantColor.g * mixRatio);
  const b = Math.round(baseB * (1 - mixRatio) + dominantColor.b * mixRatio);
  
  return `rgb(${r}, ${g}, ${b})`;
}

function App() {
  const [showCopied, setShowCopied] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [cardColors, setCardColors] = useState<Record<number, RGBColor>>({});

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };

  const handleColorExtracted = (color: RGBColor, index: number) => {
    setCardColors((prev) => ({ ...prev, [index]: color }));
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="container">
          <nav className="nav">
            <a
              href="https://www.npmjs.com/package/@nirajrajput-dev/image-dominant-hover"
              target="_blank"
              rel="noopener noreferrer"
              className="nav-link"
            >
              NPM
            </a>
            <a
              href="https://github.com/nirajrajput-dev/image-dominant-hover"
              target="_blank"
              rel="noopener noreferrer"
              className="nav-link"
            >
              GitHub
            </a>
            <button onClick={handleShare} className="nav-link share-button">
              Share
              {showCopied && <span className="tooltip">Link copied!</span>}
            </button>
          </nav>
        </div>
      </header>

      {/* Landing Section */}
      <section className="landing">
        <div className="container">
          <div className="landing-content">
            <h1 className="landing-title">Image Dominant Hover</h1>
            <p className="landing-description">
              React component library for YouTube-style thumbnail hover effects with dominant color extraction
            </p>
          </div>
        </div>
      </section>

      {/* Cards Section */}
      <section className="cards-section">
        <div className="container">
          <div className="cards-grid">
            {cards.map((card, index) => {
              const dominantColor = cardColors[index];
              const isHovered = hoveredCard === index;
              
              // Only apply color effects when hovering AND color is extracted
              const shouldApplyEffect = isHovered && dominantColor;
              
              return (
                <div
                  key={index}
                  className="card-wrapper"
                  onMouseEnter={() => setHoveredCard(index)}
                  onMouseLeave={() => setHoveredCard(null)}
                  style={{
                    '--dominant-bg': shouldApplyEffect ? dimColor(dominantColor, 0.4) : 'transparent',
                    '--title-color': shouldApplyEffect
                      ? mixColorWithBase(dominantColor, '#fdfdfd', 0.15)
                      : '#fdfdfd',
                    '--desc-color': shouldApplyEffect
                      ? mixColorWithBase(dominantColor, '#a5a4b2', 0.12)
                      : '#a5a4b2',
                  } as React.CSSProperties}
                >
                  <ImageCard
                    src={card.src}
                    alt={card.alt}
                    title={card.title}
                    description={card.description}
                    width={360}
                    height={240}
                    transitionDuration={300}
                    onColorExtracted={(color: RGBColor) => handleColorExtracted(color, index)}
                    className="demo-card"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p className="footer-text">
            © 2026 Image Dominant Hover — Developed & maintained by{' '}
            <a
              href="https://nirajrajput.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
            >
              Niraj Rajput
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;