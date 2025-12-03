"use server";

import { getBigQueryClient } from "@/lib/bigquery";
import { SensorReading } from "@/utils/mockData";

export async function getSites(): Promise<string[]> {
  const bigquery = getBigQueryClient();

  const query = `
    SELECT DISTINCT site_id
    FROM \`daino-platform.telemetry_history.readings\`
    ORDER BY site_id
  `;

  try {
    const [rows] = await bigquery.query({ query });
    return rows.map((row: any) => row.site_id.toString());
  } catch (error) {
    console.error("Error fetching sites:", error);
    return [];
  }
}

export async function getReadings(siteId: string, from: Date, to: Date): Promise<SensorReading[]> {
  const bigquery = getBigQueryClient();

  // We aggregate by hour to prevent sending too much data to the client
  // and to match the visualization granularity.
  const query = `
    SELECT 
      TIMESTAMP_TRUNC(timestamp, HOUR) as hour_timestamp,
      AVG(temperature) as avg_temp,
      SUM(occupancy) as total_motion,
      AVG(humidity) as avg_humidity,
      AVG(CAST(JSON_VALUE(metadata, '$.light') AS FLOAT64)) as avg_light,
      ANY_VALUE(device_id) as device_id,
      ANY_VALUE(site_id) as site_id
    FROM \`daino-platform.telemetry_history.readings\`
    WHERE 
      site_id = @siteId 
      AND timestamp BETWEEN @from AND @to
    GROUP BY hour_timestamp
    ORDER BY hour_timestamp ASC
  `;

  const options = {
    query: query,
    params: {
      siteId: parseInt(siteId),
      from: from,
      to: to
    },
  };

  try {
    const [rows] = await bigquery.query(options);

    return rows.map((row: any) => ({
      timestamp: row.hour_timestamp.value, // BigQuery timestamp object
      clientSiteId: row.site_id.toString(),
      devEui: row.device_id || "UNKNOWN",
      temperature: row.avg_temp || 0,
      humidity: row.avg_humidity || 0,
      motion: row.total_motion || 0,
      light: row.avg_light || 0,
      battery: 3.6, // Placeholder as we don't have battery data in CSV
    }));
  } catch (error) {
    console.error("Error fetching readings:", error);
    return [];
  }
}
