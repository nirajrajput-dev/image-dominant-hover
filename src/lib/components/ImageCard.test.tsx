import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { ImageCard } from "./ImageCard";
import * as colorExtractor from "../utils/colorExtractor";

// Mock the color extractor module
vi.mock("../utils/colorExtractor", async () => {
  const actual = await vi.importActual("../utils/colorExtractor");
  return {
    ...actual,
    extractDominantColor: vi.fn(),
  };
});

describe("ImageCard", () => {
  const mockColor = { r: 200, g: 100, b: 50 };
  const defaultProps = {
    src: "https://example.com/image.jpg",
    alt: "Test image",
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Default mock implementation
    vi.mocked(colorExtractor.extractDominantColor).mockResolvedValue(mockColor);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("rendering", () => {
    it("should render image with alt text", async () => {
      render(<ImageCard {...defaultProps} />);

      const img = screen.getByAltText("Test image");
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute("src", "https://example.com/image.jpg");
    });

    it("should render title when provided", async () => {
      render(<ImageCard {...defaultProps} title="Test Title" />);

      await waitFor(() => {
        expect(screen.getByText("Test Title")).toBeInTheDocument();
      });
    });

    it("should render description when provided", async () => {
      render(<ImageCard {...defaultProps} description="Test description" />);

      await waitFor(() => {
        expect(screen.getByText("Test description")).toBeInTheDocument();
      });
    });

    it("should apply custom className", () => {
      const { container } = render(
        <ImageCard {...defaultProps} className="custom-class" />
      );

      const card = container.querySelector(".image-card");
      expect(card).toHaveClass("custom-class");
    });

    it("should apply custom width", () => {
      const { container } = render(<ImageCard {...defaultProps} width={400} />);

      const card = container.querySelector(".image-card");
      expect(card).toHaveStyle({ width: "400px" });
    });

    it("should apply custom height to image", () => {
      render(<ImageCard {...defaultProps} height={200} />);

      const img = screen.getByAltText("Test image");
      expect(img).toHaveStyle({ height: "200px" });
    });

    it("should accept string values for width and height", () => {
      const { container } = render(
        <ImageCard {...defaultProps} width="100%" height="auto" />
      );

      const card = container.querySelector(".image-card");
      const img = screen.getByAltText("Test image");

      expect(card).toHaveStyle({ width: "100%" });
      expect(img).toHaveStyle({ height: "auto" });
    });
  });

  describe("color extraction", () => {
    it("should extract dominant color on mount", async () => {
      render(<ImageCard {...defaultProps} />);

      await waitFor(() => {
        expect(colorExtractor.extractDominantColor).toHaveBeenCalledWith(
          "https://example.com/image.jpg"
        );
      });
    });

    it("should call onColorExtracted when extraction succeeds", async () => {
      const onColorExtracted = vi.fn();
      render(
        <ImageCard {...defaultProps} onColorExtracted={onColorExtracted} />
      );

      await waitFor(() => {
        expect(onColorExtracted).toHaveBeenCalledWith(mockColor);
      });
    });

    it("should call onColorExtractionError when extraction fails", async () => {
      const error = new Error("Extraction failed");
      vi.mocked(colorExtractor.extractDominantColor).mockRejectedValue(error);

      const onColorExtractionError = vi.fn();
      render(
        <ImageCard
          {...defaultProps}
          onColorExtractionError={onColorExtractionError}
        />
      );

      await waitFor(() => {
        expect(onColorExtractionError).toHaveBeenCalledWith(error);
      });
    });

    it("should show loading state initially", () => {
      render(<ImageCard {...defaultProps} />);

      expect(screen.getByText("Analyzing...")).toBeInTheDocument();
    });

    it("should hide loading state after extraction", async () => {
      render(<ImageCard {...defaultProps} />);

      await waitFor(() => {
        expect(screen.queryByText("Analyzing...")).not.toBeInTheDocument();
      });
    });

    it("should show error message when extraction fails", async () => {
      vi.mocked(colorExtractor.extractDominantColor).mockRejectedValue(
        new Error("Failed")
      );

      render(<ImageCard {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText("Color extraction failed")).toBeInTheDocument();
      });
    });
  });

  describe("hover effect", () => {
    it("should change background color on hover", async () => {
      const { container } = render(<ImageCard {...defaultProps} />);

      // Wait for color extraction
      await waitFor(() => {
        expect(colorExtractor.extractDominantColor).toHaveBeenCalled();
      });

      const card = container.querySelector(".image-card") as HTMLElement;

      // Initial state - transparent background
      expect(card).toHaveStyle({ backgroundColor: "transparent" });

      // Hover
      fireEvent.mouseEnter(card);

      // Should have color background
      expect(card).toHaveStyle({ backgroundColor: "rgb(200, 100, 50)" });

      // Unhover
      fireEvent.mouseLeave(card);

      // Back to transparent
      expect(card).toHaveStyle({ backgroundColor: "transparent" });
    });

    it("should not change background if color extraction failed", async () => {
      vi.mocked(colorExtractor.extractDominantColor).mockRejectedValue(
        new Error("Failed")
      );

      const { container } = render(<ImageCard {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText("Color extraction failed")).toBeInTheDocument();
      });

      const card = container.querySelector(".image-card") as HTMLElement;

      // Hover
      fireEvent.mouseEnter(card);

      // Should remain transparent
      expect(card).toHaveStyle({ backgroundColor: "transparent" });
    });

    it("should apply custom transition duration", async () => {
      const { container } = render(
        <ImageCard {...defaultProps} transitionDuration={500} />
      );

      await waitFor(() => {
        expect(colorExtractor.extractDominantColor).toHaveBeenCalled();
      });

      const card = container.querySelector(".image-card") as HTMLElement;

      expect(card).toHaveStyle({
        transition: "background-color 500ms ease-in-out",
      });
    });
  });

  describe("interaction", () => {
    it("should call onClick when clicked", async () => {
      const onClick = vi.fn();
      const { container } = render(
        <ImageCard {...defaultProps} onClick={onClick} />
      );

      const card = container.querySelector(".image-card") as HTMLElement;
      fireEvent.click(card);

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("should have pointer cursor when onClick is provided", () => {
      const { container } = render(
        <ImageCard {...defaultProps} onClick={() => {}} />
      );

      const card = container.querySelector(".image-card") as HTMLElement;
      expect(card).toHaveStyle({ cursor: "pointer" });
    });

    it("should have default cursor when onClick is not provided", () => {
      const { container } = render(<ImageCard {...defaultProps} />);

      const card = container.querySelector(".image-card") as HTMLElement;
      expect(card).toHaveStyle({ cursor: "default" });
    });

    it("should be keyboard accessible when onClick is provided", async () => {
      const onClick = vi.fn();
      const { container } = render(
        <ImageCard {...defaultProps} onClick={onClick} />
      );

      const card = container.querySelector(".image-card") as HTMLElement;

      // Should have tabIndex
      expect(card).toHaveAttribute("tabindex", "0");
      expect(card).toHaveAttribute("role", "button");

      // Enter key
      fireEvent.keyDown(card, { key: "Enter" });
      expect(onClick).toHaveBeenCalledTimes(1);

      // Space key
      fireEvent.keyDown(card, { key: " " });
      expect(onClick).toHaveBeenCalledTimes(2);
    });

    it("should not be keyboard accessible when onClick is not provided", () => {
      const { container } = render(<ImageCard {...defaultProps} />);

      const card = container.querySelector(".image-card") as HTMLElement;

      expect(card).not.toHaveAttribute("tabindex");
      expect(card).not.toHaveAttribute("role");
    });
  });

  describe("accessibility", () => {
    it("should have proper ARIA attributes", async () => {
      render(<ImageCard {...defaultProps} onClick={() => {}} />);

      const card = screen.getByRole("button");
      expect(card).toHaveAttribute("aria-label", "Test image");
    });

    it("should have aria-live on loading state", () => {
      render(<ImageCard {...defaultProps} />);

      const loadingDiv = screen.getByText("Analyzing...").parentElement;
      expect(loadingDiv).toHaveAttribute("aria-live", "polite");
      expect(loadingDiv).toHaveAttribute("aria-busy", "true");
    });

    it('should have role="alert" on error message', async () => {
      vi.mocked(colorExtractor.extractDominantColor).mockRejectedValue(
        new Error("Failed")
      );

      render(<ImageCard {...defaultProps} />);

      await waitFor(() => {
        const errorElement = screen.getByRole("alert");
        expect(errorElement).toBeInTheDocument();
        expect(errorElement).toHaveTextContent("Color extraction failed");
      });
    });

    it("should have lazy loading attribute on image", () => {
      render(<ImageCard {...defaultProps} />);

      const img = screen.getByAltText("Test image");
      expect(img).toHaveAttribute("loading", "lazy");
    });
  });
});
