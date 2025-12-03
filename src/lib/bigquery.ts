import { BigQuery } from '@google-cloud/bigquery';
import * as fs from 'fs';
import * as path from 'path';

let bigqueryClient: BigQuery | null = null;

export function getBigQueryClient(): BigQuery {
    if (bigqueryClient) return bigqueryClient;

    const serviceAccountPath = path.join(process.cwd(), 'service-account.json');

    if (!fs.existsSync(serviceAccountPath)) {
        throw new Error("service-account.json not found");
    }

    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

    bigqueryClient = new BigQuery({
        projectId: 'daino-platform',
        credentials: {
            client_email: serviceAccount.client_email,
            private_key: serviceAccount.private_key,
        },
    });

    return bigqueryClient;
}
