"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { getSites } from "@/app/actions/analytics";

interface SiteContextType {
    sites: string[];
    selectedSite: string;
    setSelectedSite: (siteId: string) => void;
    loading: boolean;
}

const SiteContext = createContext<SiteContextType | undefined>(undefined);

export function SiteProvider({ children }: { children: React.ReactNode }) {
    const [sites, setSites] = useState<string[]>([]);
    const [selectedSite, setSelectedSite] = useState<string>("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchSites() {
            try {
                const siteIds = await getSites();
                setSites(siteIds);
                if (siteIds.length > 0) {
                    // Default to the first site if none selected
                    // In a real app, we might persist this in localStorage
                    setSelectedSite(siteIds[0]);
                }
            } catch (error) {
                console.error("Failed to fetch sites", error);
            } finally {
                setLoading(false);
            }
        }
        fetchSites();
    }, []);

    return (
        <SiteContext.Provider value={{ sites, selectedSite, setSelectedSite, loading }}>
            {children}
        </SiteContext.Provider>
    );
}

export function useSite() {
    const context = useContext(SiteContext);
    if (context === undefined) {
        throw new Error("useSite must be used within a SiteProvider");
    }
    return context;
}
