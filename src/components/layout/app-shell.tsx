"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, MessageSquare, Settings, LogOut, Loader2, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/lib/auth-context";
import { SiteProvider, useSite } from "@/lib/site-context";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

function AppContent({ children }: { children: React.ReactNode }) {
    const { user, loading, signOut } = useAuth();
    const { sites, selectedSite, setSelectedSite, loading: sitesLoading } = useSite();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-muted/20 font-mono">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    <p className="text-sm font-bold">INITIALIZING DAINO OS...</p>
                </div>
            </div>
        );
    }

    if (!user) return null; // Will redirect via useEffect

    return (
        <div className="flex min-h-screen bg-muted/20 font-mono">
            {/* Fixed Sidebar */}
            <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r-2 border-foreground bg-background hidden md:flex flex-col">
                <div className="flex h-16 items-center border-b-2 border-foreground px-6 gap-2">
                    <div className="w-8 h-8 rounded-full border-2 border-foreground overflow-hidden bg-white flex items-center justify-center">
                        <img src="/assets/Daino-1.png" alt="Daino Logo" className="w-full h-full object-contain p-1" />
                    </div>
                    <span className="font-pixel text-xl font-bold">DAINO OS</span>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <Link href="/dashboard">
                        <Button
                            variant={pathname === "/dashboard" ? "secondary" : "ghost"}
                            className="w-full justify-start gap-2 font-bold hover:bg-muted hover:translate-x-1 transition-transform"
                        >
                            <LayoutDashboard className="w-5 h-5" />
                            Telemetry
                        </Button>
                    </Link>
                    <Link href="/chat">
                        <Button
                            variant={pathname === "/chat" ? "secondary" : "ghost"}
                            className="w-full justify-start gap-2 font-bold hover:bg-muted hover:translate-x-1 transition-transform"
                        >
                            <MessageSquare className="w-5 h-5" />
                            Intelligence
                        </Button>
                    </Link>
                    <Link href="/settings">
                        <Button
                            variant={pathname === "/settings" ? "secondary" : "ghost"}
                            className="w-full justify-start gap-2 font-bold hover:bg-muted hover:translate-x-1 transition-transform"
                        >
                            <Settings className="w-5 h-5" />
                            System
                        </Button>
                    </Link>
                </nav>

                <div className="p-4 border-t-2 border-foreground">
                    <div className="bg-muted p-4 border-2 border-foreground mb-4">
                        <p className="text-xs font-bold mb-1">SYSTEM STATUS</p>
                        <div className="flex items-center gap-2 text-xs text-green-600">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            ONLINE
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        onClick={signOut}
                        className="w-full justify-start gap-2 border-2 border-foreground hover:bg-destructive hover:text-white transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        Logout
                    </Button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 md:ml-64 flex flex-col">
                {/* Header */}
                <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b-2 border-foreground bg-background px-6">
                    <div className="flex items-center gap-4">
                        {/* Mobile Menu Trigger */}
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="outline" size="icon" className="md:hidden border-2 border-foreground">
                                    <Menu className="h-6 w-6" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-64 p-0 border-r-2 border-foreground bg-background font-mono">
                                <div className="flex h-16 items-center border-b-2 border-foreground px-6 gap-2">
                                    <div className="w-8 h-8 rounded-full border-2 border-foreground overflow-hidden bg-white flex items-center justify-center">
                                        <img src="/assets/Daino-1.png" alt="Daino Logo" className="w-full h-full object-contain p-1" />
                                    </div>
                                    <span className="font-pixel text-xl font-bold">DAINO OS</span>
                                </div>
                                <nav className="flex-1 p-4 space-y-2">
                                    <Link href="/dashboard">
                                        <Button
                                            variant={pathname === "/dashboard" ? "secondary" : "ghost"}
                                            className="w-full justify-start gap-2 font-bold hover:bg-muted"
                                        >
                                            <LayoutDashboard className="w-5 h-5" />
                                            Telemetry
                                        </Button>
                                    </Link>
                                    <Link href="/chat">
                                        <Button
                                            variant={pathname === "/chat" ? "secondary" : "ghost"}
                                            className="w-full justify-start gap-2 font-bold hover:bg-muted"
                                        >
                                            <MessageSquare className="w-5 h-5" />
                                            Intelligence
                                        </Button>
                                    </Link>
                                    <Link href="/settings">
                                        <Button
                                            variant={pathname === "/settings" ? "secondary" : "ghost"}
                                            className="w-full justify-start gap-2 font-bold hover:bg-muted"
                                        >
                                            <Settings className="w-5 h-5" />
                                            System
                                        </Button>
                                    </Link>
                                </nav>
                                <div className="p-4 border-t-2 border-foreground absolute bottom-0 w-full">
                                    <Button
                                        variant="outline"
                                        onClick={signOut}
                                        className="w-full justify-start gap-2 border-2 border-foreground hover:bg-destructive hover:text-white transition-colors"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Logout
                                    </Button>
                                </div>
                            </SheetContent>
                        </Sheet>

                        <h1 className="font-pixel text-xl hidden md:block">
                            {pathname === "/dashboard" && "DASHBOARD // OVERVIEW"}
                            {pathname === "/chat" && "INTELLIGENCE // CHAT"}
                            {pathname === "/settings" && "SYSTEM // SETTINGS"}
                        </h1>
                        <h1 className="font-pixel text-xl md:hidden">DAINO OS</h1>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Global Site Selector */}
                        {!sitesLoading && sites.length > 0 && (
                            <div className="hidden sm:flex items-center gap-2">
                                <span className="font-pixel text-xs font-bold uppercase text-muted-foreground">SITE:</span>
                                <Select value={selectedSite} onValueChange={setSelectedSite}>
                                    <SelectTrigger className="w-[140px] bg-background border-2 border-foreground rounded-none h-9 font-mono text-xs">
                                        <SelectValue placeholder="Select Site" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {sites.map((site) => (
                                            <SelectItem key={site} value={site}>
                                                SITE {site}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        <div className="text-xs text-right hidden sm:block">
                            <p className="font-bold">OPERATOR</p>
                            <p className="text-muted-foreground">{user.email}</p>
                        </div>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button type="button" variant="ghost" className="relative h-10 w-10 rounded-full p-0 border-2 border-foreground overflow-hidden hover:opacity-80 transition-opacity">
                                    <img
                                        src={user.photoURL || "/assets/Daino-1.png"}
                                        alt="User"
                                        className="w-full h-full object-cover bg-primary"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = "/assets/Daino-1.png";
                                        }}
                                    />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56 retro-border" align="end">
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none font-pixel">OPERATOR PROFILE</p>
                                        <p className="text-xs leading-none text-muted-foreground">
                                            {user.email}
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator className="bg-foreground" />
                                <DropdownMenuItem onClick={signOut} className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10 font-bold">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Log out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-6 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}

export default function AppShell({ children }: { children: React.ReactNode }) {
    return (
        <SiteProvider>
            <AppContent>{children}</AppContent>
        </SiteProvider>
    );
}

