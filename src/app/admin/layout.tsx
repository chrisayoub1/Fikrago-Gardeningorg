"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  LayoutDashboard,
  Users,
  Store,
  Package,
  ShoppingCart,
  Settings,
  Menu,
  Bell,
  Search,
  LogOut,
  UserCog,
  ChevronLeft,
  ChevronRight,
  Leaf,
  CreditCard,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  getCount?: string; // key for dynamic count
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    title: "Vendors",
    href: "/admin/vendors",
    icon: <Store className="h-5 w-5" />,
    getCount: "pendingVendors",
  },
  {
    title: "Products",
    href: "/admin/products",
    icon: <Package className="h-5 w-5" />,
    getCount: "pendingProducts",
  },
  {
    title: "Orders",
    href: "/admin/orders",
    icon: <ShoppingCart className="h-5 w-5" />,
    getCount: "pendingOrders",
  },
  {
    title: "Subscriptions",
    href: "/admin/subscriptions",
    icon: <CreditCard className="h-5 w-5" />,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: <Settings className="h-5 w-5" />,
  },
];

interface AdminStats {
  pendingVendors: number;
  pendingProducts: number;
  pendingOrders: number;
  todayRevenue: number;
  newOrders: number;
}

function SidebarNav({ collapsed }: { collapsed: boolean }) {
  const pathname = usePathname();
  const [stats, setStats] = useState<AdminStats | null>(null);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch(() => {});
  }, []);

  const getCount = (key: string): number | undefined => {
    if (!stats) return undefined;
    return stats[key as keyof AdminStats] || 0;
  };

  return (
    <nav className="flex flex-col gap-1 p-3">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        const count = item.getCount ? getCount(item.getCount) : undefined;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all hover:bg-accent",
              isActive
                ? "bg-primary text-primary-foreground hover:bg-primary"
                : "text-muted-foreground hover:text-foreground",
              collapsed && "justify-center px-2"
            )}
          >
            {item.icon}
            {!collapsed && (
              <>
                <span className="flex-1">{item.title}</span>
                {count !== undefined && count > 0 && (
                  <Badge
                    variant={isActive ? "secondary" : "default"}
                    className="h-5 min-w-5 rounded-full px-1.5 text-xs"
                  >
                    {count}
                  </Badge>
                )}
              </>
            )}
          </Link>
        );
      })}
    </nav>
  );
}

function QuickStats() {
  const [stats, setStats] = useState<AdminStats | null>(null);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch(() => {});
  }, []);

  if (!stats) return null;

  const hasData = stats.todayRevenue > 0 || stats.newOrders > 0 || stats.pendingOrders > 0;

  if (!hasData) return null;

  return (
    <div className="hidden lg:flex items-center gap-4 px-4 py-2 border-b bg-muted/30">
      {stats.todayRevenue > 0 && (
        <>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Revenue Today:</span>
            <span className="font-semibold text-green-600">${stats.todayRevenue.toFixed(2)}</span>
          </div>
          <div className="w-px h-4 bg-border" />
        </>
      )}
      {stats.newOrders > 0 && (
        <>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">New Orders:</span>
            <span className="font-semibold">{stats.newOrders}</span>
          </div>
          <div className="w-px h-4 bg-border" />
        </>
      )}
      {stats.pendingOrders > 0 && (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Pending:</span>
          <span className="font-semibold text-orange-500">{stats.pendingOrders}</span>
        </div>
      )}
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Mobile Header */}
      <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b bg-background px-4 lg:hidden">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="shrink-0">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <div className="flex h-14 items-center border-b px-4">
              <Link href="/admin" className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <Leaf className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <span className="font-bold">Fikrago</span>
                  <span className="ml-1 text-xs text-muted-foreground">Admin</span>
                </div>
              </Link>
            </div>
            <ScrollArea className="h-[calc(100vh-3.5rem)]">
              <SidebarNav collapsed={false} />
            </ScrollArea>
          </SheetContent>
        </Sheet>
        <Link href="/admin" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Leaf className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-bold">Admin Panel</span>
        </Link>
        <div className="flex-1" />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={session?.user?.image || ""} alt="Admin" />
                <AvatarFallback>{session?.user?.name?.[0] || "A"}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>{session?.user?.name || "Admin Account"}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <UserCog className="mr-2 h-4 w-4" />
              Profile Settings
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => signOut()} className="text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      {/* Quick Stats Bar */}
      <QuickStats />

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside
          className={cn(
            "hidden lg:flex flex-col border-r bg-background transition-all duration-300 sticky top-0 h-screen",
            sidebarCollapsed ? "w-[68px]" : "w-64"
          )}
        >
          <div className="flex h-14 items-center justify-between border-b px-4">
            {!sidebarCollapsed && (
              <Link href="/admin" className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <Leaf className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <span className="font-bold">Fikrago</span>
                  <span className="ml-1 text-xs text-muted-foreground">Admin</span>
                </div>
              </Link>
            )}
            <Button
              variant="ghost"
              size="icon"
              className={cn("h-8 w-8", sidebarCollapsed && "mx-auto")}
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              {sidebarCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </div>
          <ScrollArea className="flex-1">
            <SidebarNav collapsed={sidebarCollapsed} />
          </ScrollArea>
          {!sidebarCollapsed && (
            <div className="border-t p-4">
              <div className="rounded-lg bg-muted p-3">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Bell className="h-4 w-4" />
                  System Status
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  All systems operational
                </p>
                <div className="mt-2 flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-xs text-muted-foreground">Online</span>
                </div>
              </div>
            </div>
          )}
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          {/* Desktop Header */}
          <header className="hidden lg:flex h-14 items-center justify-between border-b bg-background px-6">
            <div className="flex items-center gap-4">
              <div className="relative w-96">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search orders, vendors, products..."
                  className="pl-9 h-9"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={session?.user?.image || ""} alt="Admin" />
                      <AvatarFallback>{session?.user?.name?.[0] || "A"}</AvatarFallback>
                    </Avatar>
                    <div className="hidden xl:block text-left">
                      <div className="text-sm font-medium">{session?.user?.name || "Admin"}</div>
                      <div className="text-xs text-muted-foreground">Administrator</div>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>{session?.user?.email || "Admin Account"}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <UserCog className="mr-2 h-4 w-4" />
                    Profile Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => signOut()} className="text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* Page Content */}
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
