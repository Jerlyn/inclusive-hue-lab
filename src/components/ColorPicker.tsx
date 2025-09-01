import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Pipette } from "lucide-react";
import chroma from "chroma-js";

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  onAddToPalette: () => void;
}

export const ColorPicker = ({ color, onChange, onAddToPalette }: ColorPickerProps) => {
  const [inputValue, setInputValue] = useState(color);

  const handleInputChange = (value: string) => {
    setInputValue(value);
    try {
      // Validate and normalize the color
      const validColor = chroma(value).hex();
      onChange(validColor);
    } catch (error) {
      // Invalid color, don't update
    }
  };

  const getColorInfo = () => {
    try {
      const chromaColor = chroma(color);
      return {
        hex: chromaColor.hex(),
        rgb: chromaColor.rgb(),
        hsl: chromaColor.hsl(),
        luminance: chromaColor.luminance(),
      };
    } catch {
      return null;
    }
  };

  const colorInfo = getColorInfo();

  return (
    <div className="space-y-4">
      {/* Color Display */}
      <div className="relative">
        <div
          className="w-full h-32 rounded-lg border-2 border-border shadow-soft transition-all duration-300"
          style={{ backgroundColor: color }}
        />
        <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-transparent via-transparent to-black/10" />
      </div>

      {/* Color Input */}
      <div className="space-y-2">
        <Label htmlFor="color-input">Color Value</Label>
        <div className="flex gap-2">
          <Input
            id="color-input"
            type="color"
            value={color}
            onChange={(e) => handleInputChange(e.target.value)}
            className="w-16 h-10 p-1 border-border"
          />
          <Input
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder="#000000 or rgb(0,0,0)"
            className="flex-1"
          />
        </div>
      </div>

      {/* Color Information */}
      {colorInfo && (
        <div className="bg-muted rounded-lg p-4 space-y-2 text-sm">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-muted-foreground">HEX:</span>
              <span className="ml-2 font-mono">{colorInfo.hex}</span>
            </div>
            <div>
              <span className="text-muted-foreground">RGB:</span>
              <span className="ml-2 font-mono">
                {colorInfo.rgb.map(v => Math.round(v)).join(', ')}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">HSL:</span>
              <span className="ml-2 font-mono">
                {Math.round(colorInfo.hsl[0] || 0)}°, {Math.round(colorInfo.hsl[1] * 100)}%, {Math.round(colorInfo.hsl[2] * 100)}%
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Luminance:</span>
              <span className="ml-2 font-mono">{colorInfo.luminance.toFixed(3)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Add to Palette Button */}
      <Button onClick={onAddToPalette} className="w-full" variant="outline">
        <Plus className="w-4 h-4 mr-2" />
        Add to Palette
      </Button>

      {/* Quick Color Suggestions */}
      <div className="space-y-2">
        <Label>Quick Adjustments</Label>
        <div className="grid grid-cols-3 gap-2">
          {colorInfo && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onChange(chroma(color).brighten(0.5).hex())}
                className="text-xs"
              >
                Brighter
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onChange(chroma(color).darken(0.5).hex())}
                className="text-xs"
              >
                Darker
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onChange(chroma(color).saturate(0.5).hex())}
                className="text-xs"
              >
                Saturate
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};