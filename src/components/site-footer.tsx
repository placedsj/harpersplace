// src/components/site-footer.tsx
import { cn } from "@/lib/utils";
import Link from "next/link";

export function SiteFooter({ className }: React.HTMLAttributes<HTMLElement>) {
  return (
    <footer className={cn("bg-card border-t font-headline", className)}>
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} Harper's Place. All rights reserved.
          </p>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link href="/about" className="hover:text-primary">About Us</Link>
            <Link href="/blueprint" className="hover:text-primary">The Stability Blueprint</Link>
        </div>
      </div>
    </footer>
  );
}
