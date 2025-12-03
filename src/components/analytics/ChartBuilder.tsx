"use client";

import { useState } from "react";
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { SensorReading } from "@/utils/mockData";
import { format, parseISO, differenceInHours } from "date-fns";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface ChartBuilderProps {
    data: SensorReading[];
}

type Metric = "temperature" | "humidity" | "motion" | "light" | "battery";
type ChartType = "line" | "bar" | "area";

export function ChartBuilder({ data }: ChartBuilderProps) {
    const [metric, setMetric] = useState<Metric>("temperature");
    const [chartType, setChartType] = useState<ChartType>("line");

    // Determine date format based on data range
    const getDateFormat = () => {
        if (data.length === 0) return "HH:mm";
        const first = parseISO(data[0].timestamp);
        const last = parseISO(data[data.length - 1].timestamp);
        const hoursDiff = differenceInHours(last, first);

        return hoursDiff > 24 ? "MMM dd" : "HH:mm";
    };

    const dateFormat = getDateFormat();

    // Config for metrics
    const metricConfig = {
        temperature: { color: "#FF4D4D", unit: "°C", label: "Temperature" },
        humidity: { color: "#92D1D6", unit: "%", label: "Humidity" },
        motion: { color: "#97D9B9", unit: "Events", label: "Motion" },
        light: { color: "#FCD34D", unit: "Lux", label: "Light" },
        battery: { color: "#A78BFA", unit: "V", label: "Battery" },
    };

    const config = metricConfig[metric];

    const renderChart = () => {
        const CommonProps = {
            data: data,
            margin: { top: 20, right: 30, left: 0, bottom: 0 },
        };

        const CommonAxis = (
            <>
                <CartesianGrid stroke="#f5f5f5" strokeDasharray="3 3" />
                <XAxis
                    dataKey="timestamp"
                    tickFormatter={(str) => format(parseISO(str), dateFormat)}
                    tick={{ fontFamily: "var(--font-pixel)", fontSize: 10 }}
                    minTickGap={30}
                />
                <YAxis
                    tick={{ fontFamily: "var(--font-pixel)", fontSize: 10 }}
                    domain={['auto', 'auto']}
                />
                <Tooltip
                    contentStyle={{
                        backgroundColor: "var(--background)",
                        border: "2px solid var(--foreground)",
                        borderRadius: "0px",
                        fontFamily: "var(--font-mono)",
                    }}
                    labelFormatter={(label) => format(parseISO(label), "MMM dd, HH:mm")}
                />
                <Legend wrapperStyle={{ fontFamily: "var(--font-pixel)", paddingTop: "10px" }} />
            </>
        );

        if (chartType === "line") {
            return (
                <LineChart {...CommonProps}>
                    {CommonAxis}
                    <Line
                        type="monotone"
                        dataKey={metric}
                        stroke={config.color}
                        strokeWidth={2}
                        dot={false}
                        name={config.label}
                    />
                </LineChart>
            );
        }

        if (chartType === "bar") {
            return (
                <BarChart {...CommonProps}>
                    {CommonAxis}
                    <Bar dataKey={metric} fill={config.color} name={config.label} />
                </BarChart>
            );
        }

        if (chartType === "area") {
            return (
                <AreaChart {...CommonProps}>
                    {CommonAxis}
                    <Area
                        type="monotone"
                        dataKey={metric}
                        stroke={config.color}
                        fill={config.color}
                        fillOpacity={0.3}
                        name={config.label}
                    />
                </AreaChart>
            );
        }
    };

    return (
        <div className="w-full space-y-4">
            {/* Controls Bar */}
            <div className="flex flex-wrap gap-4 p-4 retro-border bg-muted/30">
                <div className="space-y-1">
                    <label className="text-[10px] font-bold font-pixel uppercase text-muted-foreground">Metric</label>
                    <Select value={metric} onValueChange={(v) => setMetric(v as Metric)}>
                        <SelectTrigger className="w-[180px] bg-background border-2 border-foreground rounded-none h-10 font-mono">
                            <SelectValue placeholder="Select Metric" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="temperature">Temperature</SelectItem>
                            <SelectItem value="humidity">Humidity</SelectItem>
                            <SelectItem value="motion">Motion</SelectItem>
                            <SelectItem value="light">Light</SelectItem>
                            <SelectItem value="battery">Battery</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-1">
                    <label className="text-[10px] font-bold font-pixel uppercase text-muted-foreground">Chart Type</label>
                    <Select value={chartType} onValueChange={(v) => setChartType(v as ChartType)}>
                        <SelectTrigger className="w-[180px] bg-background border-2 border-foreground rounded-none h-10 font-mono">
                            <SelectValue placeholder="Select Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="line">Line Chart</SelectItem>
                            <SelectItem value="bar">Bar Chart</SelectItem>
                            <SelectItem value="area">Area Chart</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Canvas */}
            <div className="h-[500px] w-full retro-border bg-background p-4">
                <h3 className="mb-4 font-pixel text-lg font-bold uppercase">
                    CUSTOM QUERY // {metric}
                </h3>
                <ResponsiveContainer width="100%" height="100%">
                    {renderChart()!}
                </ResponsiveContainer>
            </div>
        </div>
    );
}
