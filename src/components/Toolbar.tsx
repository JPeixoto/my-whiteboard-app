"use client"

import { useMemo } from "react"
import { Circle, Highlighter, MousePointer, Pencil, Square, Triangle, Type, Eraser } from "lucide-react"
import type { Tool, ShapeType } from "@/types/whiteboard"
import { Toggle } from "@/components/ui/toggle"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Card } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

interface ToolbarProps {
  tool: Tool
  setTool: (tool: Tool) => void
  shape: ShapeType
  setShape: (shape: ShapeType) => void
}

const toolItems: Array<{ id: Tool; label: string; shortcut: string; icon: React.ComponentType<{ className?: string }> }> = [
  { id: "pen", label: "Pen", shortcut: "P", icon: Pencil },
  { id: "bruh", label: "Brush", shortcut: "B", icon: Highlighter },
  { id: "eraser", label: "Eraser", shortcut: "E", icon: Eraser },
  { id: "select", label: "Select", shortcut: "V", icon: MousePointer },
  { id: "text", label: "Text", shortcut: "T", icon: Type },
]

const shapeOptions: Array<{ id: ShapeType; label: string; icon: React.ReactNode }> = [
  { id: "rectangle", label: "Rectangle", icon: <Square className="h-4 w-4" /> },
  { id: "circle", label: "Circle", icon: <Circle className="h-4 w-4" /> },
  { id: "triangle", label: "Triangle", icon: <Triangle className="h-4 w-4" /> },
]

export default function Toolbar({ tool, setTool, shape, setShape }: ToolbarProps) {
  const shapeTriggerIcon = useMemo(() => {
    const selected = shapeOptions.find((option) => option.id === shape)
    return selected?.icon ?? <Square className="h-4 w-4" />
  }, [shape])

  return (
    <TooltipProvider delayDuration={150}>
      <aside className="pointer-events-auto fixed left-6 top-1/2 z-30 -translate-y-1/2">
        <Card className="flex flex-col items-center gap-2 rounded-2xl border-border/50 bg-background/70 p-3 shadow-xl">
          <div className="flex flex-col items-center gap-1">
            {toolItems.map(({ id, label, shortcut, icon: Icon }) => (
              <Tooltip key={id}>
                <TooltipTrigger asChild>
                  <Toggle
                    aria-label={`${label} (${shortcut})`}
                    pressed={tool === id}
                    onPressedChange={() => setTool(id)}
                    className="h-10 w-10 border border-transparent bg-muted/30 text-foreground transition hover:bg-muted/60 data-[state=on]:border-primary/40 data-[state=on]:bg-primary/10"
                  >
                    <Icon className="h-4 w-4" />
                  </Toggle>
                </TooltipTrigger>
                <TooltipContent side="right">
                  {label}
                  <span className="ml-2 text-muted-foreground">{shortcut}</span>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant={tool === "shape" ? "default" : "ghost"}
                size="icon"
                className="h-10 w-10 border border-border/80"
                aria-label="Shapes"
                onClick={() => setTool("shape")}
              >
                {shapeTriggerIcon}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" align="center" className="w-40">
              <DropdownMenuLabel>Shapes</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {shapeOptions.map((option) => (
                <DropdownMenuItem
                  key={option.id}
                  onSelect={() => { setShape(option.id); setTool('shape'); }}
                  className="flex items-center gap-2"
                >
                  {option.icon}
                  <span className="text-sm">{option.label}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </Card>
      </aside>
    </TooltipProvider>
  )
}




