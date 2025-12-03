"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Send, Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";

type Message = {
    role: "user" | "model";
    content: string;
};

import { useSite } from "@/lib/site-context";

export default function ChatPage() {
    const { selectedSite } = useSite();
    const [messages, setMessages] = useState<Message[]>([
        { role: "model", content: "DAINO System Online. Telemetry link established. Awaiting query." }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { role: "user", content: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: [...messages, userMessage],
                    siteId: selectedSite
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || "Network response was not ok");
            }

            const data = await response.json();
            setMessages((prev) => [...prev, data]);
        } catch (error: any) {
            console.error("Error:", error);
            setMessages((prev) => [...prev, { role: "model", content: `ERROR: ${error.message || "Connection to mainframe lost."}` }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)] max-w-4xl mx-auto">
            <Card className="flex-1 retro-border bg-background p-4 overflow-hidden flex flex-col">
                <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                    {messages.map((m, i) => (
                        <div
                            key={i}
                            className={cn(
                                "flex gap-3 max-w-[80%]",
                                m.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                            )}
                        >
                            <div className={cn(
                                "w-8 h-8 rounded-none border-2 border-foreground flex items-center justify-center shrink-0",
                                m.role === "user" ? "bg-primary" : "bg-secondary"
                            )}>
                                {m.role === "user" ? <User className="w-5 h-5" /> : <img src="/assets/Daino-1.png" className="w-6 h-6 object-contain" />}
                            </div>

                            <div className={cn(
                                "p-3 border-2 border-foreground shadow-[4px_4px_0px_0px_#1A1A1A] text-sm font-mono",
                                m.role === "user" ? "bg-primary/20" : "bg-secondary/20"
                            )}>
                                <p className="whitespace-pre-wrap">{m.content}</p>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex gap-3 mr-auto">
                            <div className="w-8 h-8 rounded-none border-2 border-foreground bg-secondary flex items-center justify-center shrink-0 animate-pulse">
                                <img src="/assets/Daino-1.png" className="w-6 h-6 object-contain" />
                            </div>
                            <div className="p-3 border-2 border-foreground bg-secondary/20 text-sm font-mono">
                                Processing...
                            </div>
                        </div>
                    )}
                    <div ref={scrollRef} />
                </div>

                <div className="mt-4 pt-4 border-t-2 border-foreground">
                    <form onSubmit={handleSubmit} className="flex gap-2">
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask about building status..."
                            className="retro-border bg-background focus-visible:ring-0"
                        />
                        <Button type="submit" disabled={isLoading} className="retro-border bg-primary text-primary-foreground font-bold hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all">
                            <Send className="w-4 h-4" />
                        </Button>
                    </form>
                </div>
            </Card>
        </div>
    );
}
