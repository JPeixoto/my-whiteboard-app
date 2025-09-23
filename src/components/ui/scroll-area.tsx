"use client"

import * as React from "react"
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area"

import { cn } from "@/lib/utils"

const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <ScrollAreaPrimitive.Root ref={ref} className={cn("relative overflow-hidden", className)} {...props}>
    <ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]">
      {children}
    </ScrollAreaPrimitive.Viewport>
    <ScrollAreaPrimitive.Scrollbar
      orientation="vertical"
      className="flex touch-none select-none flex-col gap-2 rounded-full border border-transparent bg-border/40 p-1 transition-colors hover:bg-border"
    >
      <ScrollAreaPrimitive.Thumb className="relative flex-1 rounded-full bg-primary/40" />
    </ScrollAreaPrimitive.Scrollbar>
    <ScrollAreaPrimitive.Corner className="bg-border" />
  </ScrollAreaPrimitive.Root>
))
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName

export { ScrollArea }
