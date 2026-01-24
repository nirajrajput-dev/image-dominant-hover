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

function App() {
  const [showCopied, setShowCopied] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };

  const handleColorExtracted = (color: RGBColor) => {
    // Keep existing logic for color extraction
    console.log('Color extracted:', color);
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
            {cards.map((card, index) => (
              <ImageCard
                key={index}
                src={card.src}
                alt={card.alt}
                title={card.title}
                description={card.description}
                width={360}
                height={240}
                transitionDuration={300}
                onColorExtracted={handleColorExtracted}
                className="demo-card"
              />
            ))}
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