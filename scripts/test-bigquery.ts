import { BigQuery } from '@google-cloud/bigquery';
import * as fs from 'fs';
import * as path from 'path';

async function testBigQuery() {
    try {
        const serviceAccountPath = path.join(process.cwd(), 'service-account.json');
        if (!fs.existsSync(serviceAccountPath)) {
            throw new Error("service-account.json not found");
        }
        const credentials = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

        console.log("Initializing BigQuery with project:", 'beespace-demo-app');
        console.log("Client Email:", credentials.client_email);

        const bigquery = new BigQuery({
            projectId: 'beespace-demo-app',
            credentials: {
                client_email: credentials.client_email,
                private_key: credentials.private_key,
            },
        });

        const query = `
            SELECT *
            FROM \`daino-platform.telemetry_history.readings\`
            LIMIT 5
        `;

        console.log("Running query against daino-platform...");
        const [rows] = await bigquery.query({ query });
        console.log("✅ Query Successful!");
        console.log("Rows returned:", rows.length);
        console.log("Sample row:", rows[0]);

    } catch (error: any) {
        console.error("❌ BigQuery Test Failed:");
        console.error(error.message);
        if (error.errors) {
            console.error("Details:", JSON.stringify(error.errors, null, 2));
        }
    }
}

testBigQuery();
