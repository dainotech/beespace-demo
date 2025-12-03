"use client";

import { useEffect, useState } from "react";
import { SensorReading } from "@/utils/mockData";
import { EfficiencyOverlay } from "@/components/analytics/EfficiencyOverlay";
import { OccupancyHeatmap } from "@/components/analytics/OccupancyHeatmap";
import { ChartBuilder } from "@/components/analytics/ChartBuilder";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { getReadings } from "@/app/actions/analytics";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { DateRange } from "react-day-picker";
import { subDays } from "date-fns";
import { useSite } from "@/lib/site-context";

export function AnalyticsDashboard() {
    const [data, setData] = useState<SensorReading[]>([]);
    const { selectedSite, loading: siteLoading } = useSite();
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: subDays(new Date(), 30),
        to: new Date(),
    });
    const [loadingData, setLoadingData] = useState(false);

    // Fetch Readings when Site or Date Range Changes
    useEffect(() => {
        if (!selectedSite || !dateRange?.from || !dateRange?.to) return;

        async function fetchData() {
            setLoadingData(true);
            try {
                if (dateRange && dateRange.from && dateRange.to) {
                    const readings = await getReadings(selectedSite, dateRange.from, dateRange.to);
                    setData(readings);
                }
            } catch (error) {
                console.error("Failed to fetch readings", error);
            } finally {
                setLoadingData(false);
            }
        }
        fetchData();
    }, [selectedSite, dateRange]);

    if (siteLoading) {
        return (
            <div className="flex h-full w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2 font-pixel text-sm">CONNECTING TO BIGQUERY...</span>
            </div>
        );
    }

    return (
        <div className="space-y-6 p-6 pb-20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex flex-col gap-2">
                    <h1 className="font-pixel text-2xl font-bold uppercase tracking-widest text-foreground">
                        Advanced Analytics
                    </h1>
                    <p className="text-muted-foreground font-mono text-sm">
                        Real-time telemetry from BigQuery Data Warehouse.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className="font-pixel text-xs font-bold uppercase text-muted-foreground">RANGE:</span>
                        <DatePickerWithRange date={dateRange} setDate={setDateRange} />
                    </div>
                </div>
            </div>

            {loadingData ? (
                <div className="flex h-[400px] w-full items-center justify-center retro-border bg-muted/10">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <span className="ml-2 font-pixel text-sm">FETCHING DATA...</span>
                </div>
            ) : (
                <Tabs defaultValue="insights" className="w-full space-y-6">
                    <TabsList className="w-full justify-start rounded-none border-b-2 border-foreground bg-transparent p-0 h-auto">
                        <TabsTrigger
                            value="insights"
                            className="rounded-none border-b-4 border-transparent px-6 py-3 font-pixel font-bold uppercase data-[state=active]:border-primary data-[state=active]:bg-muted/50"
                        >
                            System Insights
                        </TabsTrigger>
                        <TabsTrigger
                            value="custom"
                            className="rounded-none border-b-4 border-transparent px-6 py-3 font-pixel font-bold uppercase data-[state=active]:border-primary data-[state=active]:bg-muted/50"
                        >
                            Custom Query Builder
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="insights" className="space-y-8 animate-in fade-in-50 duration-500">
                        <EfficiencyOverlay data={data} />
                        <OccupancyHeatmap data={data} />
                    </TabsContent>

                    <TabsContent value="custom" className="animate-in fade-in-50 duration-500">
                        <ChartBuilder data={data} />
                    </TabsContent>
                </Tabs>
            )}
        </div>
    );
}
