"use client"

import { signIn, signOut, useSession } from "next-auth/react"
import { LogIn, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function AuthButton() {
  const { data: session } = useSession()

  if (session?.user) {
    const initials = session.user.name?.split(" ").map((part) => part[0]).join("")?.slice(0, 2) ?? "YOU"
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              {session.user.image ? (
                <AvatarImage src={session.user.image} alt={session.user.name ?? "User"} />
              ) : (
                <AvatarFallback>{initials}</AvatarFallback>
              )}
            </Avatar>
            <span className="max-w-[150px] truncate text-sm font-medium">{session.user.name ?? session.user.email}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            Signed in as
            <div className="truncate text-sm font-medium text-foreground">
              {session.user.email}
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => signOut()} className="gap-2">
            <LogOut className="h-4 w-4" /> Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <Button variant="outline" className="gap-2" onClick={() => signIn()}>
      <LogIn className="h-4 w-4" /> Sign in
    </Button>
  )
}
