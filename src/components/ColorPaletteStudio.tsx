import { useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ColorPicker } from "./ColorPicker";
import { PaletteBuilder } from "./PaletteBuilder";
import { WCAGChecker } from "./WCAGChecker";
import { ColorBlindnessSimulator } from "./ColorBlindnessSimulator";
import { LivePreview } from "./LivePreview";
import { PaletteRecommendations } from "./PaletteRecommendations";
import { Palette, Download, Sparkles, Eye } from "lucide-react";

export interface Color {
  id: string;
  hex: string;
  name?: string;
}

export const ColorPaletteStudio = () => {
  const [selectedColor, setSelectedColor] = useState<string>("#6366f1");
  const [palette, setPalette] = useState<Color[]>([
    { id: "1", hex: "#6366f1", name: "Primary" },
    { id: "2", hex: "#8b5cf6", name: "Secondary" },
    { id: "3", hex: "#06b6d4", name: "Accent" },
  ]);
  const [colorBlindnessType, setColorBlindnessType] = useState<string>("none");

  const addColorToPalette = useCallback(() => {
    const newColor: Color = {
      id: Date.now().toString(),
      hex: selectedColor,
      name: `Color ${palette.length + 1}`,
    };
    setPalette(prev => [...prev, newColor]);
  }, [selectedColor, palette.length]);

  const removeColorFromPalette = useCallback((id: string) => {
    setPalette(prev => prev.filter(color => color.id !== id));
  }, []);

  const updateColorInPalette = useCallback((id: string, hex: string, name?: string) => {
    setPalette(prev => prev.map(color => 
      color.id === id ? { ...color, hex, ...(name && { name }) } : color
    ));
  }, []);

  const exportPalette = () => {
    const paletteData = {
      name: "Color Palette",
      colors: palette,
      exportedAt: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(paletteData, null, 2)], {
      type: "application/json",
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "color-palette.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-primary rounded-xl shadow-glow">
              <Palette className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Color Palette Studio
            </h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Build inclusive brand experiences with real-time WCAG compliance checking, 
            color blindness simulation, and intelligent palette recommendations.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Color Picker & Tools */}
          <div className="space-y-6">
            <Card className="p-6 shadow-card">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Color Picker
              </h3>
              <ColorPicker
                color={selectedColor}
                onChange={setSelectedColor}
                onAddToPalette={addColorToPalette}
              />
            </Card>

            <Card className="p-6 shadow-card">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Eye className="w-5 h-5 text-primary" />
                Accessibility Tools
              </h3>
              <Tabs defaultValue="wcag" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="wcag">WCAG</TabsTrigger>
                  <TabsTrigger value="colorblind">Color Blind</TabsTrigger>
                </TabsList>
                <TabsContent value="wcag" className="mt-4">
                  <WCAGChecker selectedColor={selectedColor} palette={palette} />
                </TabsContent>
                <TabsContent value="colorblind" className="mt-4">
                  <ColorBlindnessSimulator
                    palette={palette}
                    type={colorBlindnessType}
                    onTypeChange={setColorBlindnessType}
                  />
                </TabsContent>
              </Tabs>
            </Card>
          </div>

          {/* Middle Column - Palette Builder */}
          <div className="space-y-6">
            <Card className="p-6 shadow-card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Palette Builder</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={exportPalette}>
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
              <PaletteBuilder
                palette={palette}
                onRemoveColor={removeColorFromPalette}
                onUpdateColor={updateColorInPalette}
                selectedColor={selectedColor}
                onColorSelect={setSelectedColor}
              />
            </Card>

            <Card className="p-6 shadow-card">
              <h3 className="text-lg font-semibold mb-4">Smart Recommendations</h3>
              <PaletteRecommendations
                baseColor={selectedColor}
                currentPalette={palette}
                onAddColor={(color) => {
                  const newColor: Color = {
                    id: Date.now().toString(),
                    hex: color,
                    name: `Recommended ${palette.length + 1}`,
                  };
                  setPalette(prev => [...prev, newColor]);
                }}
              />
            </Card>
          </div>

          {/* Right Column - Live Preview */}
          <div>
            <Card className="p-6 shadow-card h-full">
              <h3 className="text-lg font-semibold mb-4">Live Preview</h3>
              <LivePreview
                palette={palette}
                colorBlindnessType={colorBlindnessType}
              />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};