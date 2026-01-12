// src/components/main-nav.tsx
'use client';

import Link from "next/link"
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils"
import { ComponentProps, useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { ChevronDown, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";

const navItems = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/calendar', label: 'Calendar' },
    { href: '/communication', label: 'Communication Hub' },
    { href: '/blog', label: 'Blog' },
];

const toolsMenuItems = [
    { href: '/log', label: 'Daily Log', group: 'Child Development' },
    { href: '/health', label: 'Health Hub', group: 'Child Development' },
    { href: '/milestones', label: 'Milestones', group: 'Child Development' },
    { href: '/journal', label: 'Journal', group: 'Planning' },
    { href: '/fund', label: 'Fund', group: 'Planning' },
    { href: '/shared-lists', label: 'Shared Lists', group: 'Planning' },
    { href: '/family-tree', label: 'Family Tree', group: 'Planning' },
    { href: '/legal-export', label: 'Legal Export Center', group: 'Planning' },
    { href: '/ai-tools/schedule-optimizer', label: 'Schedule Optimizer', group: 'AI Tools' },
    { href: '/ai-tools/communication-coach', label: 'Communication Coach', group: 'AI Tools' },
    { href: '/ai-tools/best-interest-checker', label: 'Best Interest Checker', group: 'AI Tools' },
    { href: '/transition-summary', label: 'Transition Summary AI', group: 'AI Tools' },
    { href: '/evidence-ai', label: 'Evidence AI Assistant', group: 'AI Tools' },
    { href: '/communication-platform', label: 'Platform Vision', group: 'AI Tools' },
];


const NavDropdown = ({ label, items, groups }: { label: string, items: {href: string, label: string, group: string}[], groups: string[] }) => {
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
            <DropdownMenuContent className="w-64" align="start" forceMount>
                {groups.map((group, index) => (
                    <DropdownMenuGroup key={group}>
                        {index > 0 && <DropdownMenuSeparator />}
                        <DropdownMenuLabel>{group}</DropdownMenuLabel>
                        {items.filter(item => item.group === group).map(item => (
                            <Link href={item.href} key={item.href} passHref>
                                <DropdownMenuItem>
                                    {item.label}
                                </DropdownMenuItem>
                            </Link>
                        ))}
                    </DropdownMenuGroup>
                ))}
            </DropdownMenuContent>
      </DropdownMenu>
    );
};

const MobileNav = () => {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();
    
    const menuGroups = ['Child Development', 'Planning', 'AI Tools'];

    const allNavItems = [
      ...navItems,
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
                    <SheetTitle className="text-left">placed.ca</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-1">
                    {allNavItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setOpen(false)}
                            className={cn(
                                "block px-3 py-2 rounded-md text-base font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                                pathname === item.href ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                            )}
                        >
                            {item.label}
                        </Link>
                    ))}

                    <DropdownMenuSeparator />

                     {menuGroups.map((group) => (
                        <div key={group}>
                            <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                {group}
                            </div>
                             {toolsMenuItems.filter(item => item.group === group).map(item => (
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
                            ))}
                        </div>
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
        <NavDropdown label="Tools & Logs" items={toolsMenuItems} groups={['Child Development', 'Planning', 'AI Tools']} />
      </nav>
    </>
  )
}
