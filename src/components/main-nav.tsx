// src/components/main-nav.tsx
'use client';

import Link from "next/link"
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils"
import { ComponentProps, useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { ChevronDown, Menu, X } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";

const navItems = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/calendar', label: 'Calendar' },
    { href: '/communication', label: 'Chat' },
    { href: '/blog', label: 'Blog' },
];

const careItems = [
    { href: '/log', label: 'Daily Log' },
    { href: '/health', label: 'Health Hub' },
    { href: '/milestones', label: 'Milestones' },
];

const planningItems = [
    { href: '/journal', label: 'Journal' },
    { href: '/fund', label: 'Fund' },
    { href: '/shared-lists', label: 'Shared Lists' },
    { href: '/family-tree', label: 'Family Tree' },
]

const aiToolsItems = [
    { href: '/ai-tools/schedule-optimizer', label: 'Schedule Optimizer' },
    { href: '/ai-tools/communication-coach', label: 'Communication Coach' },
    { href: '/transition-summary', label: 'Transition Summary AI' },
];

const NavDropdown = ({ label, items }: { label: string, items: {href: string, label: string}[] }) => {
    const pathname = usePathname();
    const isActive = items.some(item => pathname.startsWith(item.href));

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className={cn(
                    "text-sm font-medium transition-colors hover:text-primary p-0 h-auto",
                    isActive ? "text-primary" : "text-muted-foreground"
                )}>
                    {label}
                    <ChevronDown className="w-4 h-4 ml-1" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start" forceMount>
                <DropdownMenuGroup>
                     {items.map((item) => (
                        <Link href={item.href} key={item.href} passHref>
                            <DropdownMenuItem>
                                {item.label}
                            </DropdownMenuItem>
                        </Link>
                    ))}
                </DropdownMenuGroup>
            </DropdownMenuContent>
      </DropdownMenu>
    );
};

const MobileNav = () => {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();

    const allItems: Array<{ href: string; label: string; isHeader?: boolean }> = [
        ...navItems,
        { href: '/divider1', label: '--- Daily Care ---', isHeader: true },
        ...careItems,
        { href: '/divider2', label: '--- Planning ---', isHeader: true },
        ...planningItems,
        { href: '/divider3', label: '--- AI Tools ---', isHeader: true },
        ...aiToolsItems,
    ];

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle navigation menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72">
                <SheetHeader>
                    <SheetTitle className="text-left">Harper's Place</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-1">
                    {allItems.map((item) => (
                        item.isHeader ? (
                            <div key={item.href} className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                {item.label.replace(/---/g, '').trim()}
                            </div>
                        ) : (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setOpen(false)}
                                className={cn(
                                    "block px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                                    pathname === item.href ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                                )}
                            >
                                {item.label}
                            </Link>
                        )
                    ))}
                </div>
            </SheetContent>
        </Sheet>
    );
};

export function MainNav({
  className,
  ...props
}: ComponentProps<"nav">) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Navigation */}
      <MobileNav />
      
      {/* Desktop Navigation */}
      <nav
        className={cn("hidden md:flex items-center space-x-4 lg:space-x-6", className)}
        {...props}
      >
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === item.href ? "text-primary" : "text-muted-foreground"
            )}
          >
            {item.label}
          </Link>
        ))}
        <NavDropdown label="Daily Care" items={careItems} />
        <NavDropdown label="Planning" items={planningItems} />
        <NavDropdown label="AI Tools" items={aiToolsItems} />
      </nav>
    </>
  )
}
