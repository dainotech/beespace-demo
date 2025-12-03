import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function MarketingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col min-h-screen bg-background font-mono">
            {/* Public Navbar */}
            <header className="sticky top-0 z-50 w-full border-b-2 border-foreground bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-16 items-center justify-between px-4">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full border-2 border-foreground overflow-hidden bg-white flex items-center justify-center">
                            <img src="/assets/laura.png" alt="Laura Logo" className="w-full h-full object-contain p-1" />
                        </div>
                        <span className="font-pixel text-xl font-bold">BEESPACE</span>
                    </div>
                    <nav className="hidden md:flex items-center gap-6">
                        <a href="#features" className="text-sm font-medium hover:text-primary transition-colors">Features</a>
                        <a href="#pricing" className="text-sm font-medium hover:text-primary transition-colors">Pricing</a>
                        <a href="/login" className="text-sm font-medium hover:text-primary transition-colors">Login</a>
                        <Button asChild variant="default" className="font-pixel text-xs">
                            <a href="/login">ACCESS TERMINAL</a>
                        </Button>
                    </nav>
                </div>
            </header>

            <main className="flex-1">
                {children}
            </main>

            <footer className="border-t-2 border-foreground bg-muted/50 py-8">
                <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 border border-foreground bg-background"></div>
                        <span className="font-pixel text-lg">BEESPACE SYSTEMS</span>
                    </div>
                    <p className="text-xs text-muted-foreground">© 2025 Beespace Tech. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
