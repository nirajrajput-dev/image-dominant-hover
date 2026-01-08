import React, { useState, useEffect, useRef } from "react";
import {
  extractDominantColor,
  rgbToString,
  type RGBColor,
} from "../utils/colorExtractor";

export interface ImageCardProps {
  /**
   * Image source URL
   */
  src: string;

  /**
   * Alt text for the image
   */
  alt: string;

  /**
   * Optional title displayed below the image
   */
  title?: string;

  /**
   * Optional description displayed below the title
   */
  description?: string;

  /**
   * Width of the card (default: 300px)
   */
  width?: number | string;

  /**
   * Height of the image (default: 180px)
   */
  height?: number | string;

  /**
   * Custom className for the card container
   */
  className?: string;

  /**
   * Transition duration in milliseconds (default: 300)
   */
  transitionDuration?: number;

  /**
   * Called when the card is clicked
   */
  onClick?: () => void;

  /**
   * Called when color extraction is complete
   */
  onColorExtracted?: (color: RGBColor) => void;

  /**
   * Called when color extraction fails
   */
  onColorExtractionError?: (error: Error) => void;
}

/**
 * ImageCard component that displays an image with a hover effect
 * that fills the background with the dominant color from the image
 */
export const ImageCard: React.FC<ImageCardProps> = ({
  src,
  alt,
  title,
  description,
  width = 300,
  height = 180,
  className = "",
  transitionDuration = 300,
  onClick,
  onColorExtracted,
  onColorExtractionError,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [dominantColor, setDominantColor] = useState<RGBColor | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const extractionAttempted = useRef(false);

  useEffect(() => {
    // Prevent multiple extraction attempts for the same image
    if (extractionAttempted.current) {
      return;
    }

    extractionAttempted.current = true;
    setIsLoading(true);
    setHasError(false);

    extractDominantColor(src)
      .then((color) => {
        setDominantColor(color);
        setIsLoading(false);
        onColorExtracted?.(color);
      })
      .catch((error) => {
        console.error("Failed to extract dominant color:", error);
        setHasError(true);
        setIsLoading(false);
        onColorExtractionError?.(error as Error);
      });
  }, [src, onColorExtracted, onColorExtractionError]);

  const cardWidth = typeof width === "number" ? `${width}px` : width;
  const imageHeight = typeof height === "number" ? `${height}px` : height;

  const backgroundColor =
    dominantColor && isHovered ? rgbToString(dominantColor) : "transparent";

  const cardStyle: React.CSSProperties = {
    width: cardWidth,
    backgroundColor,
    transition: `background-color ${transitionDuration}ms ease-in-out`,
    borderRadius: "8px",
    overflow: "hidden",
    cursor: onClick ? "pointer" : "default",
    position: "relative",
  };

  const imageStyle: React.CSSProperties = {
    width: "100%",
    height: imageHeight,
    objectFit: "cover",
    display: "block",
    borderRadius: "8px",
  };

  const contentStyle: React.CSSProperties = {
    padding: title || description ? "12px" : "0",
  };

  const titleStyle: React.CSSProperties = {
    margin: "0 0 4px 0",
    fontSize: "16px",
    fontWeight: "600",
    color: "#000",
  };

  const descriptionStyle: React.CSSProperties = {
    margin: 0,
    fontSize: "14px",
    color: "#606060",
  };

  return (
    <div
      className={`image-card ${className}`}
      style={cardStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
      aria-label={onClick ? alt : undefined}
    >
      <img src={src} alt={alt} style={imageStyle} loading="lazy" />
      {(title || description) && (
        <div style={contentStyle}>
          {title && <h3 style={titleStyle}>{title}</h3>}
          {description && <p style={descriptionStyle}>{description}</p>}
        </div>
      )}
      {isLoading && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            pointerEvents: "none",
          }}
          aria-live="polite"
          aria-busy="true"
        >
          <span style={{ fontSize: "14px", color: "#606060" }}>
            Analyzing...
          </span>
        </div>
      )}
      {hasError && (
        <div
          style={{
            position: "absolute",
            top: "8px",
            right: "8px",
            padding: "4px 8px",
            backgroundColor: "rgba(255, 0, 0, 0.1)",
            borderRadius: "4px",
            fontSize: "12px",
            color: "#d32f2f",
          }}
          role="alert"
        >
          Color extraction failed
        </div>
      )}
    </div>
  );
};
