import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full py-24 md:py-32 lg:py-40 bg-background border-b-2 border-foreground relative overflow-hidden">
        {/* Grid Background */}
        <div className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ backgroundImage: 'linear-gradient(#1A1A1A 1px, transparent 1px), linear-gradient(90deg, #1A1A1A 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10 flex flex-col items-center text-center space-y-8">
          <div className="inline-block border-2 border-foreground bg-primary px-4 py-1 shadow-[4px_4px_0px_0px_#1A1A1A] mb-4 transform -rotate-2">
            <span className="font-pixel font-bold text-foreground">V1.0 // NOW LIVE</span>
          </div>

          <h1 className="font-pixel text-5xl md:text-7xl lg:text-8xl tracking-tighter leading-none">
            BIG BRAIN<br />
            <span className="text-primary">ENERGY</span>.
          </h1>

          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl font-mono border-l-4 border-primary pl-4 text-left md:text-center md:border-l-0 md:pl-0">
            Stop guessing. Start knowing. Beespace combines retro-industrial reliability with next-gen AI to visualize your building's invisible data.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 min-w-[300px]">
            <Link href="/dashboard">
              <Button size="lg" className="w-full bg-foreground text-background retro-border font-bold text-lg hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
                Get Started <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="outline" className="w-full border-2 border-foreground retro-border font-bold text-lg hover:bg-muted hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="w-full py-24 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid gap-12 lg:grid-cols-3">
            <div className="flex flex-col space-y-4 p-6 bg-background border-2 border-foreground shadow-[4px_4px_0px_0px_#1A1A1A]">
              <div className="p-3 bg-primary w-fit border-2 border-foreground rounded-none">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-pixel font-bold">Real-Time Telemetry</h3>
              <p className="text-muted-foreground font-mono text-sm">
                Instant visualization of temperature, CO2, and occupancy data. No lag, no fluff.
              </p>
            </div>
            <div className="flex flex-col space-y-4 p-6 bg-background border-2 border-foreground shadow-[4px_4px_0px_0px_#1A1A1A]">
              <div className="p-3 bg-secondary w-fit border-2 border-foreground rounded-none">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-pixel font-bold">AI Intelligence</h3>
              <p className="text-muted-foreground font-mono text-sm">
                Ask questions in plain English. "Why is the heating on?" Laura knows.
              </p>
            </div>
            <div className="flex flex-col space-y-4 p-6 bg-background border-2 border-foreground shadow-[4px_4px_0px_0px_#1A1A1A]">
              <div className="p-3 bg-destructive w-fit border-2 border-foreground rounded-none text-white">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-pixel font-bold">Industrial Grade</h3>
              <p className="text-muted-foreground font-mono text-sm">
                Built for stability. Secure, scalable, and ready for mission-critical operations.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
