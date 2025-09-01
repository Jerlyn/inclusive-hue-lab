import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Shuffle, Lightbulb } from "lucide-react";
import { Color } from "./ColorPaletteStudio";
import chroma from "chroma-js";
import { useEffect, useState } from "react";

interface PaletteRecommendationsProps {
  baseColor: string;
  currentPalette: Color[];
  onAddColor: (color: string) => void;
}

export const PaletteRecommendations = ({ baseColor, currentPalette, onAddColor }: PaletteRecommendationsProps) => {
  const [recommendations, setRecommendations] = useState<Array<{ color: string; type: string; name: string }>>([]);

  const generateRecommendations = () => {
    try {
      const base = chroma(baseColor);
      const newRecommendations = [];

      // Complementary color
      const complementary = base.set("hsl.h", (base.get("hsl.h") + 180) % 360);
      newRecommendations.push({
        color: complementary.hex(),
        type: "Complementary",
        name: "Complementary"
      });

      // Triadic colors
      const triadic1 = base.set("hsl.h", (base.get("hsl.h") + 120) % 360);
      const triadic2 = base.set("hsl.h", (base.get("hsl.h") + 240) % 360);
      newRecommendations.push(
        {
          color: triadic1.hex(),
          type: "Triadic",
          name: "Triadic 1"
        },
        {
          color: triadic2.hex(),
          type: "Triadic",
          name: "Triadic 2"
        }
      );

      // Analogous colors
      const analogous1 = base.set("hsl.h", (base.get("hsl.h") + 30) % 360);
      const analogous2 = base.set("hsl.h", (base.get("hsl.h") - 30 + 360) % 360);
      newRecommendations.push(
        {
          color: analogous1.hex(),
          type: "Analogous",
          name: "Analogous 1"
        },
        {
          color: analogous2.hex(),
          type: "Analogous",
          name: "Analogous 2"
        }
      );

      // Split complementary
      const splitComp1 = base.set("hsl.h", (base.get("hsl.h") + 150) % 360);
      const splitComp2 = base.set("hsl.h", (base.get("hsl.h") + 210) % 360);
      newRecommendations.push(
        {
          color: splitComp1.hex(),
          type: "Split Complementary",
          name: "Split Comp 1"
        },
        {
          color: splitComp2.hex(),
          type: "Split Complementary",
          name: "Split Comp 2"
        }
      );

      // Monochromatic variations
      const lighter = base.brighten(1);
      const darker = base.darken(1);
      const desaturated = base.desaturate(1);
      
      newRecommendations.push(
        {
          color: lighter.hex(),
          type: "Monochromatic",
          name: "Lighter"
        },
        {
          color: darker.hex(),
          type: "Monochromatic",
          name: "Darker"
        },
        {
          color: desaturated.hex(),
          type: "Monochromatic",
          name: "Desaturated"
        }
      );

      // Filter out colors already in palette
      const currentColors = currentPalette.map(c => c.hex.toLowerCase());
      const filteredRecommendations = newRecommendations.filter(
        rec => !currentColors.includes(rec.color.toLowerCase())
      );

      setRecommendations(filteredRecommendations.slice(0, 8)); // Limit to 8 recommendations
    } catch (error) {
      console.error("Error generating recommendations:", error);
      setRecommendations([]);
    }
  };

  useEffect(() => {
    generateRecommendations();
  }, [baseColor, currentPalette]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Complementary":
        return "bg-accent text-accent-foreground";
      case "Triadic":
        return "bg-primary text-primary-foreground";
      case "Analogous":
        return "bg-secondary text-secondary-foreground";
      case "Split Complementary":
        return "bg-warning text-warning-foreground";
      case "Monochromatic":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  if (recommendations.length === 0) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        <Lightbulb className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">Select a color to see recommendations</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">Smart Suggestions</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={generateRecommendations}
          className="h-8 px-2"
        >
          <Shuffle className="w-3 h-3" />
        </Button>
      </div>

      {/* Recommendations Grid */}
      <div className="grid grid-cols-2 gap-2">
        {recommendations.map((rec, index) => (
          <div
            key={index}
            className="group relative border rounded-lg overflow-hidden hover:shadow-soft transition-all duration-200"
          >
            {/* Color Display */}
            <div
              className="h-16 relative cursor-pointer"
              style={{ backgroundColor: rec.color }}
              onClick={() => onAddColor(rec.color)}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/10" />
              
              {/* Add Button */}
              <Button
                size="sm"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  onAddColor(rec.color);
                }}
              >
                <Plus className="w-3 h-3" />
              </Button>
            </div>

            {/* Info */}
            <div className="p-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono">{rec.color}</span>
              </div>
              <div className="mt-1">
                <Badge variant="secondary" className={`text-xs ${getTypeColor(rec.type)}`}>
                  {rec.type}
                </Badge>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Color Theory Info */}
      <div className="bg-muted rounded-lg p-3">
        <h5 className="text-xs font-medium mb-2">Color Theory Guide</h5>
        <div className="text-xs text-muted-foreground space-y-1">
          <div><strong>Complementary:</strong> Opposite on color wheel, high contrast</div>
          <div><strong>Triadic:</strong> Three colors evenly spaced, vibrant</div>
          <div><strong>Analogous:</strong> Adjacent colors, harmonious</div>
          <div><strong>Split Complementary:</strong> Softer than complementary</div>
          <div><strong>Monochromatic:</strong> Same hue, different shades</div>
        </div>
      </div>
    </div>
  );
};