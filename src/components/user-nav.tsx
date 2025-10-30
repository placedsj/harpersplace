// src/components/user-nav.tsx
'use client';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation";

export function UserNav() {
    const { user, logOut, loading } = useAuth();
    const router = useRouter();

    const getInitials = (name: string | null | undefined) => {
        if (!name) return 'G'; // Guest mode
        const names = name.split(' ');
        if (names.length > 1) {
            return names[0][0] + names[names.length - 1][0];
        }
        return name[0];
    }

    const getDisplayName = () => {
        if (!user) return 'Guest User';
        return user.displayName || 'User';
    }

    const getDisplayEmail = () => {
        if (!user) return 'guest@harpersplace.app';
        return user.email || '';
    }

    if (loading) {
        return <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />;
    }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.photoURL ?? undefined} alt="User avatar" />
            <AvatarFallback className={!user ? "bg-muted" : ""}>{getInitials(user?.displayName)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{getDisplayName()}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {getDisplayEmail()}
            </p>
            {!user && (
              <p className="text-xs text-accent-foreground bg-accent/10 px-2 py-1 rounded mt-1">
                Guest Mode
              </p>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => router.push('/profile')}>
            👤 Profile
          </DropdownMenuItem>
           <DropdownMenuItem onClick={() => router.push('/blueprint')}>
            📋 Stability Blueprint
          </DropdownMenuItem>
           <DropdownMenuItem onClick={() => router.push('/about')}>
            ℹ️ About Harper's Place
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push('/emergency')}>
            🚨 Emergency Contacts
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        {user ? (
          <DropdownMenuItem onClick={logOut}>
            🚪 Log out
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={() => router.push('/login')}>
            🔐 Sign In
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
