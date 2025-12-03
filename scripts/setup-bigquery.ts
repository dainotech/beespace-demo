import { BigQuery } from '@google-cloud/bigquery';
import * as fs from 'fs';
import * as path from 'path';

// Load Service Account
const serviceAccountPath = path.join(process.cwd(), 'service-account.json');
if (!fs.existsSync(serviceAccountPath)) {
    console.error("ERROR: service-account.json not found!");
    process.exit(1);
}
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

const bigquery = new BigQuery({
    projectId: 'daino-platform',
    credentials: {
        client_email: serviceAccount.client_email,
        private_key: serviceAccount.private_key,
    },
});

const datasetId = 'telemetry_history';
const tableId = 'readings';

async function setupBigQuery() {
    try {
        // 1. Create Dataset
        const [dataset] = await bigquery.createDataset(datasetId).catch(async (err: any) => {
            if (err.code === 409) {
                console.log(`Dataset ${datasetId} already exists.`);
                return bigquery.dataset(datasetId).get();
            }
            throw err;
        });
        console.log(`✅ Dataset ${dataset.id} ready.`);

        // 2. Create Table with Schema
        const schema = [
            { name: 'timestamp', type: 'TIMESTAMP', mode: 'REQUIRED' },
            { name: 'temperature', type: 'FLOAT', mode: 'REQUIRED' },
            { name: 'occupancy', type: 'INTEGER', mode: 'REQUIRED' },
            { name: 'humidity', type: 'FLOAT', mode: 'NULLABLE' },
            { name: 'device_id', type: 'STRING', mode: 'REQUIRED' },
            { name: 'site_id', type: 'INTEGER', mode: 'REQUIRED' },
            { name: 'metadata', type: 'STRING', mode: 'NULLABLE' }
        ];

        const [table] = await dataset.createTable(tableId, { schema }).catch(async (err: any) => {
            if (err.code === 409) {
                console.log(`Table ${tableId} already exists.`);
                return dataset.table(tableId).get();
            }
            throw err;
        });
        console.log(`✅ Table ${table.id} ready.`);

    } catch (error) {
        console.error('ERROR setting up BigQuery:', error);
    }
}

setupBigQuery();
