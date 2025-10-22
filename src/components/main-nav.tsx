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
    { href: '/log', label: 'Daily Care' },
    { href: '/calendar', label: 'Calendar' },
    { href: '/communication', label: 'Chat' },
];

const legalEvidenceItems = [
    { href: '/evidence-log', label: 'Evidence Log' },
    { href: '/evidence-ai', label: 'Evidence AI Assistant' },
    { href: '/document-analyzer', label: 'Document Analyzer' },
];

const aiToolsItems = [
    { href: '/ai-tools/schedule-optimizer', label: 'Schedule Optimizer' },
    { href: '/ai-tools/communication-coach', label: 'Communication Coach' },
    { href: '/communication-platform', label: '🚀 Communication Platform' },
];

const childFocusedItems = [
    { href: '/journal', label: 'Journal' },
    { href: '/fund', label: 'Fund' },
    { href: '/health', label: 'Health Hub' },
    { href: '/milestones', label: 'Milestones' },
    { href: '/shared-lists', label: 'Shared Lists' },
    { href: '/family-tree', label: 'Family Tree' },
]

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
        { href: '/divider1', label: '--- Child-Focused ---', isHeader: true },
        ...childFocusedItems,
        { href: '/divider2', label: '--- Legal & Evidence ---', isHeader: true },
        ...legalEvidenceItems,
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
        <NavDropdown label="Child-Focused" items={childFocusedItems} />
        <NavDropdown label="Legal & Evidence" items={legalEvidenceItems} />
        <NavDropdown label="AI Tools" items={aiToolsItems} />
      </nav>
    </>
  )
}
