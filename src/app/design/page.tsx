import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
// Badge import removed
// Actually I should install button, card, input first. Shadcn init doesn't install them by default?
// Shadcn init sets up the base. I need to add components manually using `npx shadcn@latest add button card input`.
// I missed that step. I need to add components before using them.

export default function DesignPage() {
    return (
        <div className="min-h-screen bg-background p-8 space-y-12 font-mono">
            <header className="space-y-4">
                <h1 className="text-4xl font-pixel text-primary">DAINO DESIGN SYSTEM v1.0</h1>
                <p className="text-muted-foreground">Kitchen Sink for the Retro-Industrial Identity.</p>
            </header>

            <section className="space-y-6">
                <h2 className="text-2xl font-pixel border-b-2 border-foreground pb-2">1. TYPOGRAPHY</h2>
                <div className="grid gap-4">
                    <div className="p-4 border-2 border-dashed border-muted-foreground">
                        <p className="font-pixel text-4xl">Pixelify Sans (Headers)</p>
                        <p className="font-mono text-xl">JetBrains Mono (Data/Body)</p>
                    </div>
                </div>
            </section>

            <section className="space-y-6">
                <h2 className="text-2xl font-pixel border-b-2 border-foreground pb-2">2. COLORS</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="h-24 bg-primary retro-border flex items-center justify-center font-bold">Primary (Mint)</div>
                    <div className="h-24 bg-secondary retro-border flex items-center justify-center font-bold">Secondary (Blue)</div>
                    <div className="h-24 bg-destructive retro-border flex items-center justify-center font-bold text-white">Destructive (Red)</div>
                    <div className="h-24 bg-foreground retro-border flex items-center justify-center font-bold text-white">Foreground (Black)</div>
                </div>
            </section>

            <section className="space-y-6">
                <h2 className="text-2xl font-pixel border-b-2 border-foreground pb-2">3. COMPONENTS</h2>
                <div className="grid gap-8 md:grid-cols-2">
                    {/* Buttons */}
                    <div className="space-y-4">
                        <h3 className="font-bold">Buttons</h3>
                        <div className="flex gap-4 flex-wrap">
                            <button className="bg-primary text-primary-foreground px-4 py-2 retro-border font-bold hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
                                Primary Action
                            </button>
                            <button className="bg-secondary text-secondary-foreground px-4 py-2 retro-border font-bold hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
                                Secondary Action
                            </button>
                            <button className="bg-destructive text-destructive-foreground px-4 py-2 retro-border font-bold hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
                                Destructive
                            </button>
                        </div>
                    </div>

                    {/* Inputs */}
                    <div className="space-y-4">
                        <h3 className="font-bold">Inputs</h3>
                        <input type="text" placeholder="Enter data..." className="w-full px-4 py-2 bg-background retro-border focus:outline-none focus:ring-2 focus:ring-primary" />
                    </div>

                    {/* Cards */}
                    <div className="col-span-2">
                        <h3 className="font-bold mb-4">Cards</h3>
                        <div className="p-6 bg-card text-card-foreground retro-border space-y-4">
                            <h4 className="font-pixel text-2xl">System Status</h4>
                            <p className="text-muted-foreground">All systems operational. Efficiency at 98%.</p>
                            <div className="flex justify-end">
                                <button className="bg-primary text-primary-foreground px-4 py-2 retro-border font-bold text-sm">View Details</button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
