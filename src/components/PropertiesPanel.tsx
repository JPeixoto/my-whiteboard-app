"use client"

import { useMemo } from "react"
import { Brush, Droplet } from "lucide-react"
import type { BrushStyle, Tool } from "@/types/whiteboard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

const brushLabels: { key: BrushStyle; label: string; hint: string }[] = [
  { key: "brush", label: "Classic", hint: "Balanced line" },
  { key: "calligraphy-brush", label: "Calligraphy", hint: "Expressive stroke" },
  { key: "calligraphy-pen", label: "Calligraphy pen", hint: "Sharp edges" },
  { key: "airbrush", label: "Airbrush", hint: "Soft texture" },
  { key: "oil-brush", label: "Oil", hint: "Rich paint" },
  { key: "crayon", label: "Crayon", hint: "Layered grain" },
  { key: "marker", label: "Marker", hint: "Bold highlight" },
  { key: "natural-pencil", label: "Pencil", hint: "Sketchy" },
  { key: "watercolor-brush", label: "Watercolor", hint: "Diffuse" },
]

const colorPresets = [
  "#1F2937",
  "#ef4444",
  "#22c55e",
  "#3b82f6",
  "#8b5cf6",
  "#f59e0b",
  "#14b8a6",
]

interface PropertiesPanelProps {
  color: string
  strokeWidth: number
  setColor: (color: string) => void
  setStrokeWidth: (width: number) => void
  brushStyle: BrushStyle
  setBrushStyle: (style: BrushStyle) => void
  tool: Tool
}

export default function PropertiesPanel({
  color,
  strokeWidth,
  setColor,
  setStrokeWidth,
  brushStyle,
  setBrushStyle,
  tool,
}: PropertiesPanelProps) {
  const strokeLabel = tool === "eraser" ? "Eraser size" : "Stroke width"
  const strokeMax = tool === "eraser" ? 60 : 20
  const activeBrush = useMemo(() => brushLabels.find((item) => item.key === brushStyle)?.label ?? "Classic", [brushStyle])

  return (
    <aside className="pointer-events-auto fixed right-6 top-1/2 z-30 -translate-y-1/2 w-72">
      <Card className="overflow-hidden border-border/50 bg-background/70 shadow-xl backdrop-blur">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold tracking-wide text-muted-foreground">
            <Brush className="h-4 w-4" /> Appearance
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6">
          <section className="space-y-3">
            <Label className="text-xs uppercase tracking-wide text-muted-foreground">Color</Label>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-border/60 bg-background">
                <Input
                  aria-label="Stroke color"
                  type="color"
                  value={color}
                  onChange={(event) => setColor(event.target.value)}
                  className="h-10 w-10 cursor-pointer border-none bg-transparent p-0"
                />
              </div>
              <div className="grid flex-1 grid-cols-4 gap-2">
                {colorPresets.map((preset) => (
                  <button
                    type="button"
                    key={preset}
                    onClick={() => setColor(preset)}
                    className={cn(
                      "h-8 rounded-md border border-transparent transition",
                      color.toLowerCase() === preset.toLowerCase()
                        ? "ring-2 ring-offset-1 ring-primary"
                        : "hover:opacity-90"
                    )}
                    style={{ backgroundColor: preset }}
                    aria-label={`Select ${preset} color`}
                  />
                ))}
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <Label className="text-xs uppercase tracking-wide text-muted-foreground">Brush style</Label>
            <div className="rounded-lg border border-border/60 bg-muted/10">
              <ScrollArea className="h-40">
                <div className="flex flex-col p-2">
                  {brushLabels.map((item) => (
                    <Button
                      key={item.key}
                      variant={item.key === brushStyle ? "secondary" : "ghost"}
                      className="justify-between px-3 py-2 text-sm"
                      onClick={() => setBrushStyle(item.key)}
                    >
                      <span className="font-medium text-foreground">{item.label}</span>
                      <span className="text-xs text-muted-foreground">{item.hint}</span>
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </div>
            <p className="flex items-center gap-2 text-xs text-muted-foreground">
              <Droplet className="h-3.5 w-3.5" /> {activeBrush}
            </p>
          </section>

          <section className="space-y-3">
            <Label className="text-xs uppercase tracking-wide text-muted-foreground">
              {strokeLabel}
              <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
                {strokeWidth}px
              </span>
            </Label>
            <Slider
              value={[strokeWidth]}
              min={1}
              max={strokeMax}
              step={1}
              onValueChange={([value]) => setStrokeWidth(value)}
            />
          </section>
        </CardContent>
      </Card>
    </aside>
  )
}
