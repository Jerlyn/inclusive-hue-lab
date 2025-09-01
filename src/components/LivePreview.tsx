import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Color } from "./ColorPaletteStudio";
import chroma from "chroma-js";
import { Star, Heart, ShoppingCart, User } from "lucide-react";

interface LivePreviewProps {
  palette: Color[];
  colorBlindnessType: string;
}

export const LivePreview = ({ palette, colorBlindnessType }: LivePreviewProps) => {
  // Simplified color blindness simulation
  const simulateColorBlindness = (hex: string, simulationType: string) => {
    if (simulationType === "none") return hex;
    
    try {
      const color = chroma(hex);
      const [r, g, b] = color.rgb();

      switch (simulationType) {
        case "protanopia":
          return chroma.rgb(
            0.567 * r + 0.433 * g,
            0.558 * r + 0.442 * g,
            0.242 * g + 0.758 * b
          ).hex();
        case "deuteranopia":
          return chroma.rgb(
            0.625 * r + 0.375 * g,
            0.7 * r + 0.3 * g,
            0.3 * g + 0.7 * b
          ).hex();
        case "tritanopia":
          return chroma.rgb(
            0.95 * r + 0.05 * g,
            0.433 * g + 0.567 * b,
            0.475 * g + 0.525 * b
          ).hex();
        default:
          return hex;
      }
    } catch {
      return hex;
    }
  };

  const getSimulatedPalette = () => {
    return palette.map(color => ({
      ...color,
      hex: simulateColorBlindness(color.hex, colorBlindnessType)
    }));
  };

  const simulatedPalette = getSimulatedPalette();
  const primary = simulatedPalette[0]?.hex || "#6366f1";
  const secondary = simulatedPalette[1]?.hex || "#8b5cf6";
  const accent = simulatedPalette[2]?.hex || "#06b6d4";

  const getTextColor = (backgroundColor: string) => {
    try {
      const contrast = chroma.contrast(backgroundColor, "#ffffff");
      return contrast > 4.5 ? "#ffffff" : "#000000";
    } catch {
      return "#000000";
    }
  };

  if (palette.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>Add colors to your palette to see the live preview</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Simulation Type Indicator */}
      {colorBlindnessType !== "none" && (
        <div className="text-xs text-muted-foreground text-center p-2 bg-muted rounded">
          Viewing with {colorBlindnessType} simulation
        </div>
      )}

      {/* Color Swatches */}
      <div>
        <h4 className="text-sm font-medium mb-2">Color Swatches</h4>
        <div className="grid grid-cols-3 gap-2">
          {simulatedPalette.map((color) => (
            <div key={color.id} className="text-center">
              <div
                className="w-full h-12 rounded border"
                style={{ backgroundColor: color.hex }}
              />
              <p className="text-xs mt-1 font-mono">{color.hex}</p>
              <p className="text-xs text-muted-foreground">{color.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* UI Elements Preview */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium">UI Elements</h4>
        
        {/* Buttons */}
        <div className="space-y-3">
          <div className="flex gap-2 flex-wrap">
            <button
              className="px-4 py-2 rounded-md text-sm font-medium transition-colors"
              style={{
                backgroundColor: primary,
                color: getTextColor(primary)
              }}
            >
              Primary Button
            </button>
            <button
              className="px-4 py-2 rounded-md text-sm font-medium border transition-colors"
              style={{
                borderColor: primary,
                color: primary,
                backgroundColor: "transparent"
              }}
            >
              Secondary Button
            </button>
            <button
              className="px-4 py-2 rounded-md text-sm font-medium transition-colors"
              style={{
                backgroundColor: accent,
                color: getTextColor(accent)
              }}
            >
              Accent Button
            </button>
          </div>
        </div>

        {/* Card Example */}
        <div className="border rounded-lg p-4 bg-card">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-semibold">Product Card</h3>
              <p className="text-sm text-muted-foreground">Sample product description</p>
            </div>
            <button>
              <Heart className="w-5 h-5 text-muted-foreground hover:text-destructive" />
            </button>
          </div>
          
          <div className="flex items-center gap-2 mb-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className="w-4 h-4"
                style={{ color: accent }}
                fill={star <= 4 ? accent : "none"}
              />
            ))}
            <span className="text-sm text-muted-foreground">(24 reviews)</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-lg font-bold" style={{ color: primary }}>
              $99.99
            </span>
            <button
              className="px-3 py-2 rounded text-sm font-medium flex items-center gap-2"
              style={{
                backgroundColor: primary,
                color: getTextColor(primary)
              }}
            >
              <ShoppingCart className="w-4 h-4" />
              Add to Cart
            </button>
          </div>
        </div>

        {/* Navigation Example */}
        <div className="border rounded-lg p-4 bg-card">
          <nav className="flex items-center justify-between">
            <div className="font-semibold" style={{ color: primary }}>
              Brand Logo
            </div>
            <div className="flex items-center gap-4">
              <a href="#" className="text-sm hover:text-primary">Home</a>
              <a href="#" className="text-sm hover:text-primary">Products</a>
              <a href="#" className="text-sm hover:text-primary">About</a>
              <button
                className="px-3 py-1 rounded text-sm"
                style={{
                  backgroundColor: secondary,
                  color: getTextColor(secondary)
                }}
              >
                <User className="w-4 h-4" />
              </button>
            </div>
          </nav>
        </div>

        {/* Badges */}
        <div className="space-y-2">
          <h5 className="text-sm font-medium">Status Badges</h5>
          <div className="flex gap-2 flex-wrap">
            <span
              className="px-2 py-1 rounded-full text-xs font-medium"
              style={{
                backgroundColor: `${primary}20`,
                color: primary
              }}
            >
              Primary
            </span>
            <span
              className="px-2 py-1 rounded-full text-xs font-medium"
              style={{
                backgroundColor: `${secondary}20`,
                color: secondary
              }}
            >
              Secondary
            </span>
            <span
              className="px-2 py-1 rounded-full text-xs font-medium"
              style={{
                backgroundColor: `${accent}20`,
                color: accent
              }}
            >
              Accent
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};