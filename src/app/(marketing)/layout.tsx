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
                            <img src="/assets/Daino-1.png" alt="Daino Logo" className="w-full h-full object-contain p-1" />
                        </div>
                        <span className="font-pixel text-xl font-bold">DAINO</span>
                    </div>
                    <nav className="flex items-center gap-4">
                        <Link href="/login">
                            <Button variant="ghost" className="font-bold hover:bg-muted">Login</Button>
                        </Link>
                        <Link href="/dashboard">
                            <Button className="bg-primary text-primary-foreground retro-border font-bold hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
                                Launch App
                            </Button>
                        </Link>
                    </nav>
                </div>
            </header>

            <main className="flex-1">{children}</main>

            {/* Public Footer */}
            <footer className="border-t-2 border-foreground bg-foreground text-background py-8">
                <div className="container flex flex-col md:flex-row justify-between items-center px-4 gap-4">
                    <div className="flex items-center gap-2">
                        <span className="font-pixel text-lg">DAINO SYSTEMS</span>
                    </div>
                    <p className="text-xs text-muted-foreground">© 2025 Daino Tech. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
