"use client";

import { SensorReading } from "@/utils/mockData";
import { format, getDay, getHours, parseISO } from "date-fns";

interface OccupancyHeatmapProps {
    data: SensorReading[];
}

export function OccupancyHeatmap({ data }: OccupancyHeatmapProps) {
    // Process data into a grid: 7 days x 24 hours
    // Initialize grid
    const grid: number[][] = Array(7).fill(0).map(() => Array(24).fill(0));
    const counts: number[][] = Array(7).fill(0).map(() => Array(24).fill(0));

    data.forEach((reading) => {
        const date = parseISO(reading.timestamp);
        const day = getDay(date); // 0 = Sunday
        const hour = getHours(date);

        grid[day][hour] += reading.motion;
        counts[day][hour] += 1;
    });

    // Calculate averages
    const averages = grid.map((row, d) => row.map((total, h) => {
        return counts[d][h] > 0 ? Math.round(total / counts[d][h]) : 0;
    }));

    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const hours = Array.from({ length: 24 }, (_, i) => i);

    // Helper for color scale
    const getColor = (value: number) => {
        // Scale 0 to 100 (approx max motion)
        // White to Mint Green (#97D9B9)
        // 0 -> 255, 255, 255
        // 100 -> 151, 217, 185

        if (value === 0) return "rgb(255, 255, 255)";

        const intensity = Math.min(value / 60, 1); // Cap at 60 events for max color

        // Interpolate between white (255,255,255) and Mint (151, 217, 185)
        const r = Math.round(255 - (255 - 151) * intensity);
        const g = Math.round(255 - (255 - 217) * intensity);
        const b = Math.round(255 - (255 - 185) * intensity);

        return `rgb(${r}, ${g}, ${b})`;
    };

    return (
        <div className="w-full retro-border bg-background p-4 overflow-x-auto">
            <h3 className="mb-4 font-pixel text-lg font-bold">OCCUPANCY HEATMAP // 7 DAY CYCLE</h3>

            <div className="min-w-[600px]">
                {/* Header Row */}
                <div className="flex mb-2">
                    <div className="w-12"></div>
                    {hours.map(h => (
                        <div key={h} className="flex-1 text-center text-[10px] font-mono text-muted-foreground">
                            {h}
                        </div>
                    ))}
                </div>

                {/* Grid Rows */}
                {days.map((day, dayIndex) => (
                    <div key={day} className="flex mb-1 h-8 items-center">
                        <div className="w-12 text-xs font-bold font-pixel">{day}</div>
                        {hours.map(hourIndex => {
                            const value = averages[dayIndex][hourIndex];
                            return (
                                <div
                                    key={hourIndex}
                                    className="flex-1 h-full mx-[1px] border border-black/5 relative group cursor-pointer"
                                    style={{ backgroundColor: getColor(value) }}
                                >
                                    <div className="opacity-0 group-hover:opacity-100 absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-black text-white text-[10px] p-1 whitespace-nowrap z-10 pointer-events-none">
                                        {value} events
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>

            <div className="mt-4 flex items-center justify-end gap-2 text-xs font-mono">
                <span>Low Activity</span>
                <div className="w-20 h-2 bg-gradient-to-r from-white to-[#97D9B9] border border-black/10"></div>
                <span>High Activity</span>
            </div>
        </div>
    );
}
