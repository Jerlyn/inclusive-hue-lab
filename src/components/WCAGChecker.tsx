import { Badge } from "@/components/ui/badge";
import { Color } from "./ColorPaletteStudio";
import chroma from "chroma-js";
import { CheckCircle, AlertTriangle, XCircle, Info } from "lucide-react";

interface WCAGCheckerProps {
  selectedColor: string;
  palette: Color[];
}

export const WCAGChecker = ({ selectedColor, palette }: WCAGCheckerProps) => {
  const getContrastRatio = (color1: string, color2: string) => {
    try {
      return chroma.contrast(color1, color2);
    } catch {
      return 1;
    }
  };

  const getWCAGLevel = (ratio: number, largeText: boolean = false) => {
    if (largeText) {
      if (ratio >= 4.5) return "AAA";
      if (ratio >= 3) return "AA";
      return "Fail";
    } else {
      if (ratio >= 7) return "AAA";
      if (ratio >= 4.5) return "AA";
      return "Fail";
    }
  };

  const getWCAGIcon = (level: string) => {
    switch (level) {
      case "AAA":
        return <CheckCircle className="w-4 h-4 text-success" />;
      case "AA":
        return <CheckCircle className="w-4 h-4 text-warning" />;
      default:
        return <XCircle className="w-4 h-4 text-destructive" />;
    }
  };

  const getWCAGColor = (level: string) => {
    switch (level) {
      case "AAA":
        return "bg-success text-success-foreground";
      case "AA":
        return "bg-warning text-warning-foreground";
      default:
        return "bg-destructive text-destructive-foreground";
    }
  };

  // Common background colors to test against
  const commonBackgrounds = [
    { name: "White", color: "#ffffff" },
    { name: "Black", color: "#000000" },
    { name: "Light Gray", color: "#f8f9fa" },
    { name: "Dark Gray", color: "#212529" },
  ];

  return (
    <div className="space-y-4">
      {/* Info */}
      <div className="flex items-start gap-2 p-3 bg-muted rounded-lg">
        <Info className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
        <div className="text-sm">
          <p className="font-medium">WCAG Contrast Guidelines</p>
          <p className="text-muted-foreground text-xs mt-1">
            AA: 4.5:1 (normal), 3:1 (large) • AAA: 7:1 (normal), 4.5:1 (large)
          </p>
        </div>
      </div>

      {/* Selected Color vs Common Backgrounds */}
      <div>
        <h4 className="text-sm font-medium mb-3">
          Selected Color vs Common Backgrounds
        </h4>
        <div className="space-y-2">
          {commonBackgrounds.map((bg) => {
            const ratio = getContrastRatio(selectedColor, bg.color);
            const normalLevel = getWCAGLevel(ratio, false);
            const largeLevel = getWCAGLevel(ratio, true);

            return (
              <div key={bg.name} className="flex items-center justify-between p-2 border rounded">
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded border"
                    style={{ backgroundColor: bg.color }}
                  />
                  <span className="text-sm">{bg.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {ratio.toFixed(1)}:1
                  </span>
                  <div className="flex gap-1">
                    <Badge className={`text-xs ${getWCAGColor(normalLevel)}`}>
                      {normalLevel}
                    </Badge>
                    <Badge className={`text-xs ${getWCAGColor(largeLevel)}`}>
                      {largeLevel} L
                    </Badge>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Palette Color Combinations */}
      {palette.length > 1 && (
        <div>
          <h4 className="text-sm font-medium mb-3">
            Palette Color Combinations
          </h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {palette.map((color1, i) =>
              palette.slice(i + 1).map((color2) => {
                const ratio = getContrastRatio(color1.hex, color2.hex);
                const normalLevel = getWCAGLevel(ratio, false);
                const largeLevel = getWCAGLevel(ratio, true);

                return (
                  <div
                    key={`${color1.id}-${color2.id}`}
                    className="flex items-center justify-between p-2 border rounded"
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        <div
                          className="w-4 h-4 rounded-l border"
                          style={{ backgroundColor: color1.hex }}
                        />
                        <div
                          className="w-4 h-4 rounded-r border"
                          style={{ backgroundColor: color2.hex }}
                        />
                      </div>
                      <span className="text-sm">
                        {color1.name} + {color2.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {ratio.toFixed(1)}:1
                      </span>
                      <div className="flex gap-1">
                        <Badge className={`text-xs ${getWCAGColor(normalLevel)}`}>
                          {normalLevel}
                        </Badge>
                        <Badge className={`text-xs ${getWCAGColor(largeLevel)}`}>
                          {largeLevel} L
                        </Badge>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};