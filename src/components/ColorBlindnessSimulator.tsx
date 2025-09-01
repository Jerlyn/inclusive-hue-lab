import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Color } from "./ColorPaletteStudio";
import chroma from "chroma-js";
import { Eye, Info } from "lucide-react";

interface ColorBlindnessSimulatorProps {
  palette: Color[];
  type: string;
  onTypeChange: (type: string) => void;
}

export const ColorBlindnessSimulator = ({ palette, type, onTypeChange }: ColorBlindnessSimulatorProps) => {
  // Simplified color blindness simulation using color transformations
  const simulateColorBlindness = (hex: string, simulationType: string) => {
    try {
      const color = chroma(hex);
      const [r, g, b] = color.rgb();

      switch (simulationType) {
        case "protanopia": // Red-blind
          return chroma.rgb(
            0.567 * r + 0.433 * g,
            0.558 * r + 0.442 * g,
            0.242 * g + 0.758 * b
          ).hex();
        case "deuteranopia": // Green-blind
          return chroma.rgb(
            0.625 * r + 0.375 * g,
            0.7 * r + 0.3 * g,
            0.3 * g + 0.7 * b
          ).hex();
        case "tritanopia": // Blue-blind
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

  const colorBlindnessTypes = [
    { value: "none", label: "Normal Vision" },
    { value: "protanopia", label: "Protanopia (Red-blind)", description: "~1% of males" },
    { value: "deuteranopia", label: "Deuteranopia (Green-blind)", description: "~1% of males" },
    { value: "tritanopia", label: "Tritanopia (Blue-blind)", description: "~0.001% of population" },
  ];

  const selectedType = colorBlindnessTypes.find(t => t.value === type);

  return (
    <div className="space-y-4">
      {/* Type Selector */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Simulation Type</label>
        <Select value={type} onValueChange={onTypeChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {colorBlindnessTypes.map((cbType) => (
              <SelectItem key={cbType.value} value={cbType.value}>
                <div>
                  <div>{cbType.label}</div>
                  {cbType.description && (
                    <div className="text-xs text-muted-foreground">{cbType.description}</div>
                  )}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Info */}
      {type !== "none" && (
        <div className="flex items-start gap-2 p-3 bg-muted rounded-lg">
          <Info className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <p className="font-medium">{selectedType?.label}</p>
            <p className="text-muted-foreground text-xs mt-1">
              {selectedType?.description} - See how your palette appears to users with this type of color vision.
            </p>
          </div>
        </div>
      )}

      {/* Color Simulation */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium flex items-center gap-2">
          <Eye className="w-4 h-4" />
          Color Simulation
        </h4>
        
        {palette.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            Add colors to your palette to see the simulation
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-2">
            {palette.map((color) => {
              const simulatedColor = simulateColorBlindness(color.hex, type);
              const isDifferent = simulatedColor !== color.hex;

              return (
                <div key={color.id} className="flex items-center gap-3 p-2 border rounded">
                  {/* Original Color */}
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded border"
                      style={{ backgroundColor: color.hex }}
                    />
                    <div>
                      <p className="text-sm font-medium">Original</p>
                      <p className="text-xs text-muted-foreground">{color.hex}</p>
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="text-muted-foreground">→</div>

                  {/* Simulated Color */}
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded border"
                      style={{ backgroundColor: simulatedColor }}
                    />
                    <div>
                      <p className="text-sm font-medium">Simulated</p>
                      <p className="text-xs text-muted-foreground">{simulatedColor}</p>
                    </div>
                  </div>

                  {/* Change Indicator */}
                  <div className="ml-auto">
                    {isDifferent ? (
                      <Badge variant="secondary" className="text-xs">
                        Different
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs">
                        Same
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Tips */}
      {type !== "none" && palette.length > 0 && (
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
          <h5 className="text-sm font-medium text-primary mb-1">Accessibility Tips</h5>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Use patterns, shapes, or text labels in addition to color</li>
            <li>• Ensure sufficient contrast between colors</li>
            <li>• Test your design with multiple color vision types</li>
            <li>• Consider using color-blind friendly palettes</li>
          </ul>
        </div>
      )}
    </div>
  );
};