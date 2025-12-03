"use client";

import {
    ComposedChart,
    Line,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { SensorReading } from "@/utils/mockData";
import { format, parseISO } from "date-fns";

interface EfficiencyOverlayProps {
    data: SensorReading[];
}

export function EfficiencyOverlay({ data }: EfficiencyOverlayProps) {
    // Filter for last 24 hours for this specific view
    const last24Hours = data.slice(-24);

    return (
        <div className="h-[400px] w-full retro-border bg-background p-4">
            <h3 className="mb-4 font-pixel text-lg font-bold">EFFICIENCY OVERLAY // TEMP VS MOTION</h3>
            <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                    data={last24Hours}
                    margin={{
                        top: 20,
                        right: 20,
                        bottom: 30,
                        left: 20,
                    }}
                >
                    <CartesianGrid stroke="#f5f5f5" strokeDasharray="3 3" />
                    <XAxis
                        dataKey="timestamp"
                        tickFormatter={(str) => format(parseISO(str), "HH:mm")}
                        tick={{ fontFamily: "var(--font-pixel)", fontSize: 10 }}
                    />
                    <YAxis
                        yAxisId="left"
                        label={{ value: 'Temp (°C)', angle: -90, position: 'insideLeft', style: { fontFamily: "var(--font-pixel)" } }}
                        domain={[15, 30]}
                        tick={{ fontFamily: "var(--font-pixel)", fontSize: 10 }}
                    />
                    <YAxis
                        yAxisId="right"
                        orientation="right"
                        label={{ value: 'Motion (Events)', angle: 90, position: 'insideRight', style: { fontFamily: "var(--font-pixel)" } }}
                        tick={{ fontFamily: "var(--font-pixel)", fontSize: 10 }}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "var(--background)",
                            border: "2px solid var(--foreground)",
                            borderRadius: "0px",
                            fontFamily: "var(--font-mono)"
                        }}
                        labelFormatter={(label) => format(parseISO(label), "MMM dd, HH:mm")}
                    />
                    <Legend wrapperStyle={{ fontFamily: "var(--font-pixel)", paddingTop: "10px" }} />
                    <Bar yAxisId="right" dataKey="motion" barSize={20} fill="#97D9B9" fillOpacity={0.6} name="Motion" />
                    <Line yAxisId="left" type="monotone" dataKey="temperature" stroke="#FF4D4D" strokeWidth={2} dot={false} name="Temperature" />
                </ComposedChart>
            </ResponsiveContainer>
        </div>
    );
}
