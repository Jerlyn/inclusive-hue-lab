import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X, Edit2, Check } from "lucide-react";
import { Color } from "./ColorPaletteStudio";
import { useState } from "react";
import chroma from "chroma-js";

interface PaletteBuilderProps {
  palette: Color[];
  onRemoveColor: (id: string) => void;
  onUpdateColor: (id: string, hex: string, name?: string) => void;
  selectedColor: string;
  onColorSelect: (color: string) => void;
}

export const PaletteBuilder = ({
  palette,
  onRemoveColor,
  onUpdateColor,
  selectedColor,
  onColorSelect,
}: PaletteBuilderProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  const startEditing = (color: Color) => {
    setEditingId(color.id);
    setEditingName(color.name || "");
  };

  const saveEdit = (id: string) => {
    onUpdateColor(id, palette.find(c => c.id === id)?.hex || "", editingName);
    setEditingId(null);
  };

  const getContrastRatio = (color1: string, color2: string) => {
    try {
      return chroma.contrast(color1, color2);
    } catch {
      return 1;
    }
  };

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
        <p>No colors in your palette yet.</p>
        <p className="text-sm mt-1">Use the color picker to add colors!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Palette Grid */}
      <div className="grid grid-cols-1 gap-3">
        {palette.map((color) => (
          <div
            key={color.id}
            className={`group relative rounded-lg border-2 transition-all duration-200 cursor-pointer hover:shadow-soft ${
              selectedColor === color.hex
                ? "border-primary ring-2 ring-primary/20"
                : "border-border hover:border-primary/50"
            }`}
            onClick={() => onColorSelect(color.hex)}
          >
            <div
              className="h-16 rounded-t-md flex items-center justify-center relative overflow-hidden"
              style={{ backgroundColor: color.hex }}
            >
              {/* Color value overlay */}
              <span
                className="text-sm font-mono font-medium px-2 py-1 bg-black/20 backdrop-blur-sm rounded"
                style={{ color: getTextColor(color.hex) }}
              >
                {color.hex}
              </span>
              
              {/* Remove button */}
              <Button
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveColor(color.id);
                }}
              >
                <X className="w-3 h-3" />
              </Button>
            </div>

            {/* Color info */}
            <div className="p-3 bg-card">
              <div className="flex items-center justify-between">
                {editingId === color.id ? (
                  <div className="flex items-center gap-2 flex-1">
                    <Input
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      className="h-7 text-sm"
                      placeholder="Color name"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") saveEdit(color.id);
                        if (e.key === "Escape") setEditingId(null);
                      }}
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => saveEdit(color.id)}
                      className="h-7 w-7 p-0"
                    >
                      <Check className="w-3 h-3" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{color.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          Contrast vs White: {getContrastRatio(color.hex, "#ffffff").toFixed(1)}
                        </Badge>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        startEditing(color);
                      }}
                      className="h-7 w-7 p-0"
                    >
                      <Edit2 className="w-3 h-3" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Palette Summary */}
      <div className="bg-muted rounded-lg p-4">
        <h4 className="text-sm font-medium mb-2">Palette Summary</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Colors:</span>
            <span className="ml-2 font-medium">{palette.length}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Accessibility:</span>
            <Badge variant="secondary" className="ml-2 text-xs">
              {palette.filter(color => getContrastRatio(color.hex, "#ffffff") >= 4.5).length} AA compliant
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
};