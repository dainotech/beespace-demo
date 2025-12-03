"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth-context";
import { Loader2, ShieldCheck } from "lucide-react";

export default function LoginPage() {
    const { signInWithGoogle, signInWithEmail, loading, error } = useAuth();

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/20 p-4 font-mono">
            <Card className="w-full max-w-md p-8 retro-border bg-background flex flex-col items-center gap-6">
                <div className="w-16 h-16 rounded-full border-2 border-foreground bg-white flex items-center justify-center overflow-hidden">
                    <img src="/assets/laura.png" alt="Laura" className="w-full h-full object-contain p-2" />
                </div>
                <div className="text-center space-y-2">
                    <h1 className="font-pixel text-2xl font-bold">Beespace OS</h1>
                    <p className="text-muted-foreground text-sm">SECURE TERMINAL ACCESS</p>
                </div>

                <div className="w-full h-px bg-foreground/20" />

                <div className="w-full space-y-4">
                    <Button
                        onClick={signInWithGoogle}
                        disabled={loading}
                        className="w-full h-12 text-lg font-bold retro-border bg-primary text-primary-foreground hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
                    >
                        {loading ? (
                            <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        ) : (
                            <ShieldCheck className="w-5 h-5 mr-2" />
                        )}
                        {loading ? "INITIALIZING..." : "AUTHENTICATE WITH GOOGLE"}
                    </Button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-foreground/20" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">Or access via credentials</span>
                        </div>
                    </div>

                    <form onSubmit={(e) => {
                        e.preventDefault();
                        const email = (e.currentTarget.elements.namedItem('email') as HTMLInputElement).value;
                        const password = (e.currentTarget.elements.namedItem('password') as HTMLInputElement).value;
                        signInWithEmail(email, password);
                    }} className="space-y-3">
                        <div className="space-y-1">
                            <Input
                                name="email"
                                type="email"
                                placeholder="OPERATOR ID (EMAIL)"
                                className="font-mono border-2 border-foreground rounded-none focus-visible:ring-0 focus-visible:ring-offset-0"
                                required
                            />
                        </div>
                        <div className="space-y-1">
                            <Input
                                name="password"
                                type="password"
                                placeholder="ACCESS CODE (PASSWORD)"
                                className="font-mono border-2 border-foreground rounded-none focus-visible:ring-0 focus-visible:ring-offset-0"
                                required
                            />
                        </div>
                        <Button
                            type="submit"
                            disabled={loading}
                            variant="outline"
                            className="w-full font-bold border-2 border-foreground rounded-none hover:bg-muted"
                        >
                            LOGIN
                        </Button>
                    </form>

                    <div className="p-3 bg-muted border-2 border-foreground/20 text-xs font-mono">
                        <p className="font-bold mb-1">DEMO CREDENTIALS:</p>
                        <p>ID: demo@bee.space</p>
                        <p>CODE: password</p>
                    </div>

                    <p className="text-xs text-center text-muted-foreground">
                        AUTHORIZED PERSONNEL ONLY. <br />
                        ALL ACCESS IS LOGGED.
                    </p>

                    {/* Debug Error Message */}
                    {error && (
                        <div className="p-3 bg-destructive/20 border-2 border-destructive text-destructive text-xs font-bold font-mono break-all">
                            ERROR: {error}
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
}
