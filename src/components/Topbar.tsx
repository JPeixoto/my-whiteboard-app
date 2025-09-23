"use client"

import { useMemo, useState } from "react"
import { Copy, Download, Eraser, Share2, Users } from "lucide-react"
import AuthButton from "./AuthButton"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"

const shareTargets = [
  {
    label: "Twitter",
    href: (url: string, text: string) =>
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
  },
  {
    label: "Facebook",
    href: (url: string) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  {
    label: "WhatsApp",
    href: (url: string, text: string) =>
      `https://api.whatsapp.com/send?text=${encodeURIComponent(`${text} ${url}`)}`,
  },
  {
    label: "LinkedIn",
    href: (url: string) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  },
]

interface TopbarProps {
  roomInput: string
  setRoomInput: (value: string) => void
  onJoinRoom: () => void
  onClear: () => void
  onExport: () => void
}

export default function Topbar({ roomInput, setRoomInput, onJoinRoom, onClear, onExport }: TopbarProps) {
  const [shareOpen, setShareOpen] = useState(false)
  const shareUrl = useMemo(() => (typeof window !== "undefined" ? window.location.href : ""), [])
  const shareText = "Collaborate with me on Whiteboard"

  const copyToClipboard = async () => {
    if (!shareUrl) return
    try {
      await navigator.clipboard.writeText(shareUrl)
    } catch (err) {
      console.error("Clipboard copy failed", err)
    }
  }

  return (
    <header className="pointer-events-auto fixed inset-x-0 top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-full border border-border/70 bg-background/70 px-4 py-1.5 shadow-sm">
            <div className="flex h-9 items-center rounded-md bg-primary/10 px-3 text-sm font-semibold text-primary">
              Whiteboard
            </div>
            <Separator orientation="vertical" className="h-6" />
            <Input
              aria-label="Room name"
              value={roomInput}
              onChange={(event) => setRoomInput(event.target.value)}
              placeholder="room-name"
              className="h-9 w-40 border-none bg-transparent pl-2 text-sm focus-visible:ring-0"
            />
            <Button size="sm" className="h-8" onClick={onJoinRoom}>
              <Users className="mr-2 h-4 w-4" /> Join
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="h-9" onClick={onClear}>
            <Eraser className="mr-2 h-4 w-4" /> Clear
          </Button>
          <Button variant="ghost" size="sm" className="h-9" onClick={onExport}>
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
          <Dialog open={shareOpen} onOpenChange={setShareOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="h-9">
                <Share2 className="mr-2 h-4 w-4" /> Share
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-sm">
              <DialogHeader>
                <DialogTitle>Share this board</DialogTitle>
                <DialogDescription>Invite collaborators with a direct link.</DialogDescription>
              </DialogHeader>
              <div className="rounded-lg border bg-muted/40 p-3 text-xs text-muted-foreground">
                {shareUrl || "Link available once loaded"}
              </div>
              <div className="flex items-center gap-2">
                <Button className="flex-1" onClick={copyToClipboard}>
                  <Copy className="mr-2 h-4 w-4" /> Copy link
                </Button>
                <Button variant="secondary" onClick={() => setShareOpen(false)}>
                  Close
                </Button>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-2">
                {shareTargets.map(({ label, href }) => (
                  <Button
                    key={label}
                    variant="outline"
                    asChild
                    className="justify-start"
                  >
                    <a
                      href={href(shareUrl, shareText)}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => setShareOpen(false)}
                    >
                      {label}
                    </a>
                  </Button>
                ))}
              </div>
            </DialogContent>
          </Dialog>
          <AuthButton />
        </div>
      </div>
    </header>
  )
}

