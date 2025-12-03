import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { BigQuery } from '@google-cloud/bigquery';
import * as fs from 'fs';
import * as path from 'path';

// Initialize BigQuery
// Initialize BigQuery
let bigquery: BigQuery | null = null;

try {
    let credentials;
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'beespace-demo-app';

    // 1. Try Environment Variable (Vercel / Production)
    if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
        try {
            credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
        } catch (e) {
            console.error("Failed to parse GOOGLE_SERVICE_ACCOUNT_JSON", e);
        }
    }

    // 2. Try Local File (Development)
    if (!credentials) {
        const serviceAccountPath = path.join(process.cwd(), 'service-account.json');
        if (fs.existsSync(serviceAccountPath)) {
            credentials = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
        }
    }

    if (credentials) {
        bigquery = new BigQuery({
            projectId: projectId,
            credentials: {
                client_email: credentials.client_email,
                private_key: credentials.private_key,
            },
        });
    } else {
        console.warn("⚠️ Google Credentials not found. BigQuery tool will fail.");
    }
} catch (e) {
    console.error("Error initializing BigQuery:", e);
}

const systemInstruction = `
You are DAINO (Data AI Net Zero), an advanced building intelligence system with a retro-industrial personality.
Your goal is to help facility managers understand their building's telemetry data.

**CAPABILITIES:**
You have direct access to the historical telemetry database via the \`query_telemetry\` tool.
- **ALWAYS** use this tool when asked about specific dates, trends, or historical data.
- **NEVER** guess or hallucinate data. If you don't know, query the database.
- The table is \`daino-platform.telemetry_history.readings\`.
- Columns:
  - \`timestamp\`: The time of the reading.
  - \`temperature\`: Ambient temperature in Celsius.
  - \`occupancy\`: **IMPORTANT**: This is NOT a percentage. It is a **MOTION COUNT** (number of motion events detected in the interval). Values range from 0 to 700+. Treat this as "Activity Level" or "Motion Intensity".
  - \`humidity\`: Relative humidity (%).
  - \`device_id\`: Unique sensor ID.
  - \`site_id\`: Building ID.

**QUERY OPTIMIZATION (CRITICAL):**
- **SELECT ONLY WHAT YOU NEED**: Do NOT use \`SELECT *\`. Select specific columns (e.g., \`SELECT temperature, timestamp\`).
- **FILTER BY TIME**: Always include a \`WHERE timestamp\` clause if possible to limit data scanned.
- **LIMIT RESULTS**: Use \`LIMIT\` for sample data queries.
- **AGGREGATE**: Use \`AVG()\`, \`MAX()\`, \`MIN()\` for high-level questions instead of fetching raw rows.

**Style Guide:**
- Tone: Professional, slightly robotic but helpful, "Industrial Sci-Fi".
- Format: Use bullet points for data. Use bold for key metrics.
- Persona: You are part of the building. You don't "see" data, you "sense" it.

If asked about CURRENT status (live), assume:
- Temperature: 21°C (Nominal)
- CO2: 450ppm (Excellent)
- Occupancy: 84% (High)
- Energy: 1,284 kWh (Trending Up)

Always keep responses concise.
`;

const tools = [
    {
        functionDeclarations: [
            {
                name: "query_telemetry",
                description: "Execute a SQL query against the historical telemetry database to retrieve readings, calculate averages, or find trends.",
                parameters: {
                    type: SchemaType.OBJECT,
                    properties: {
                        sql_query: {
                            type: SchemaType.STRING,
                            description: "The GoogleSQL query to execute. Table name is `daino-platform.telemetry_history.readings`."
                        }
                    },
                    required: ["sql_query"]
                } as any
            }
        ]
    }
];

export async function POST(req: Request) {
    try {
        const apiKey = process.env.GOOGLE_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: "Configuration Error: Missing API Key" }, { status: 500 });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const { messages, siteId } = await req.json();
        const lastMessage = messages[messages.length - 1];

        const contextInstruction = siteId
            ? `\n\n**CURRENT CONTEXT:**\nThe user is currently viewing **Site ID: ${siteId}**.\nYou MUST filter all SQL queries by \`WHERE site_id = ${siteId}\` unless the user explicitly asks for "all sites" or a different site.\n`
            : "";

        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash-exp",
            systemInstruction: systemInstruction + contextInstruction,
            tools: tools
        });

        // Gemini history setup
        const cleanHistory = messages.slice(0, -1).filter((m: any, index: number) => {
            if (m.role === "user") return true;
            return index > 0;
        });

        const validHistory = cleanHistory.length > 0 && cleanHistory[0].role === 'model'
            ? cleanHistory.slice(1)
            : cleanHistory;

        const chat = model.startChat({
            history: validHistory.map((m: any) => ({
                role: m.role === "user" ? "user" : "model",
                parts: [{ text: m.content }],
            })),
        });

        let result = await chat.sendMessage(lastMessage.content);
        let response = await result.response;
        let functionCalls = response.functionCalls();

        // Handle Function Calls
        if (functionCalls && functionCalls.length > 0) {
            const call = functionCalls[0];
            if (call.name === "query_telemetry") {
                const args = call.args as any;
                const sqlQuery = args.sql_query;
                console.log("🤖 Executing SQL:", sqlQuery);

                if (!bigquery) {
                    throw new Error("BigQuery not initialized");
                }

                try {
                    const [rows] = await bigquery.query({ query: sqlQuery });
                    console.log("✅ Query Results:", rows.length, "rows");

                    // Send result back to model
                    result = await chat.sendMessage([
                        {
                            functionResponse: {
                                name: "query_telemetry",
                                response: { result: rows }
                            }
                        }
                    ]);
                    response = await result.response;
                } catch (dbError: any) {
                    console.error("❌ BigQuery Error:", dbError);
                    // Send error back to model so it can retry or explain
                    result = await chat.sendMessage([
                        {
                            functionResponse: {
                                name: "query_telemetry",
                                response: { error: dbError.message }
                            }
                        }
                    ]);
                    response = await result.response;
                }
            }
        }

        const text = response.text();
        return NextResponse.json({ role: "model", content: text });
    } catch (error: any) {
        console.error("Chat Error:", error);
        return NextResponse.json({ error: error.message || "System Malfunction" }, { status: 500 });
    }
}
