import { BigQuery } from '@google-cloud/bigquery';
import * as fs from 'fs';
import * as path from 'path';

let bigqueryClient: BigQuery | null = null;

export function getBigQueryClient(): BigQuery {
    if (bigqueryClient) return bigqueryClient;

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

    if (!credentials) {
        // In build phase, we might not have credentials, but we shouldn't crash unless we try to query.
        // However, for now, let's warn and return a dummy or throw if critical.
        console.warn("No Google Credentials found. BigQuery will fail.");
        // We'll throw here to match previous behavior, but maybe we should allow build to pass?
        // Let's throw, but the user needs to add the env var.
        throw new Error("Google Credentials not found (Env: GOOGLE_SERVICE_ACCOUNT_JSON or File: service-account.json)");
    }

    bigqueryClient = new BigQuery({
        projectId: projectId,
        credentials: {
            client_email: credentials.client_email,
            private_key: credentials.private_key,
        },
    });

    return bigqueryClient;
}
