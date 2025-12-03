import { addDays, addHours, format, subDays } from "date-fns";

export interface SensorReading {
    timestamp: string; // ISO Date
    clientSiteId: string;
    devEui: string; // Sensor ID
    temperature: number; // Celsius
    humidity: number; // %
    motion: number; // Count
    light: number; // Lux
    battery: number; // Voltage
}

export const generateMockData = (days: number = 7): SensorReading[] => {
    const data: SensorReading[] = [];
    const endDate = new Date();
    const startDate = subDays(endDate, days);

    let currentDate = startDate;
    while (currentDate <= endDate) {
        // Generate hourly data
        const hour = currentDate.getHours();

        // Simulate daily patterns
        // Office hours (8am - 6pm): Higher temp, high motion, high light
        // Night hours: Lower temp, low motion, low light
        const isOfficeHours = hour >= 8 && hour <= 18;
        const isNight = hour < 6 || hour > 22;

        let baseTemp = 21;
        if (isNight) baseTemp = 18;
        if (isOfficeHours) baseTemp = 22.5;

        // Add some random variation
        const temperature = Number((baseTemp + (Math.random() * 2 - 1)).toFixed(1));

        // Motion: High during day, near zero at night
        let motion = 0;
        if (isOfficeHours) motion = Math.floor(Math.random() * 50) + 20;
        else if (!isNight) motion = Math.floor(Math.random() * 10); // Transition periods

        // Humidity: Relatively stable
        const humidity = Number((45 + (Math.random() * 10 - 5)).toFixed(1));

        // Light: Lux
        let light = 0;
        if (isOfficeHours) light = 400 + Math.floor(Math.random() * 100);
        else if (!isNight) light = 50; // Dim

        // Battery: Slow drain
        // Just simulate a value between 3.5 and 3.6
        const battery = Number((3.6 - (Math.random() * 0.05)).toFixed(2));

        data.push({
            timestamp: currentDate.toISOString(),
            clientSiteId: "SITE-001",
            devEui: "SENSOR-A1",
            temperature,
            humidity,
            motion,
            light,
            battery,
        });

        currentDate = addHours(currentDate, 1);
    }

    return data;
};
