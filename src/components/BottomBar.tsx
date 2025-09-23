"use client"

import { Minus, Plus, Scan } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface BottomBarProps {
  zoom: number
  zoomIn: () => void
  zoomOut: () => void
  resetZoom: () => void
}

export default function BottomBar({ zoom, zoomIn, zoomOut, resetZoom }: BottomBarProps) {
  const pct = Math.round(zoom * 100)

  return (
    <div className="pointer-events-auto fixed bottom-6 left-1/2 z-30 -translate-x-1/2">
      <Card className="flex items-center gap-3 rounded-full border-border/60 bg-background/80 px-4 py-2 shadow-xl backdrop-blur">
        <Button variant="ghost" size="icon" className="h-9 w-9" onClick={zoomOut} aria-label="Zoom out">
          <Minus className="h-4 w-4" />
        </Button>
        <span className="min-w-[3rem] text-center text-sm font-medium text-muted-foreground">{pct}%</span>
        <Button variant="ghost" size="icon" className="h-9 w-9" onClick={zoomIn} aria-label="Zoom in">
          <Plus className="h-4 w-4" />
        </Button>
        <Button variant="secondary" size="icon" className="h-9 w-9" onClick={resetZoom} aria-label="Reset zoom">
          <Scan className="h-4 w-4" />
        </Button>
      </Card>
    </div>
  )
}
