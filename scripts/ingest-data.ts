import { BigQuery } from '@google-cloud/bigquery';
import * as fs from 'fs';
import * as path from 'path';
import csv from 'csv-parser';

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

interface CSVRow {
    clientsite_id: string;
    datetime: string;
    deveui: string;
    motion: string;
    avg_temperature: string;
    min_temperature: string;
    max_temperature: string;
    avg_light: string;
    avg_humidity: string;
}

async function ingestData() {
    const csvFilePath = path.join(process.cwd(), 'data/historical/Site_Data.csv');
    if (!fs.existsSync(csvFilePath)) {
        console.error(`ERROR: File not found at ${csvFilePath}`);
        process.exit(1);
    }

    console.log('🚀 Starting ingestion...');
    const rows: any[] = [];
    const BATCH_SIZE = 5000; // BigQuery recommends larger batches for streaming, but we'll be careful with memory
    let totalInserted = 0;

    fs.createReadStream(csvFilePath)
        .pipe(csv())
        .on('data', (data) => {
            // Map CSV columns to BigQuery Schema
            // CSV: clientsite_id,datetime,deveui,motion,avg_temperature,min_temperature,max_temperature,avg_light,avg_humidity
            // BQ: timestamp, temperature, occupancy, humidity, device_id, site_id, metadata

            // Clean timestamp (remove +01 timezone if needed or let BQ handle it)
            // BQ expects 'YYYY-MM-DD HH:MM:SS' or ISO

            const row = {
                timestamp: data.datetime,
                temperature: parseFloat(data.avg_temperature) || null,
                occupancy: parseInt(data.motion) || 0,
                humidity: parseFloat(data.avg_humidity) || null,
                device_id: data.deveui,
                site_id: parseInt(data.clientsite_id) || 0,
                metadata: JSON.stringify({
                    min_temp: data.min_temperature,
                    max_temp: data.max_temperature,
                    light: data.avg_light
                })
            };

            rows.push(row);

            if (rows.length >= BATCH_SIZE) {
                // Pause stream to insert
                // Actually, for simplicity in this script, we'll just accumulate a chunk and insert asynchronously
                // But with 700MB, we can't load all into memory.
                // We need to handle backpressure or just use the BigQuery load job from a file.
                // Streaming inserts cost money. Load jobs are free.
                // Let's write to a JSONL file and then Load.
            }
        })
        .on('end', async () => {
            console.log('CSV parsing complete. Starting Load Job...');
            // This approach above (streaming insert) is expensive for 700MB.
            // Better approach: Transform to JSONL file locally, then upload via Load Job.
        });
}

// Re-writing for JSONL transformation + Load Job
async function transformAndLoad() {
    const csvFilePath = path.join(process.cwd(), 'data/historical/Site_Data.csv');
    const jsonlFilePath = path.join(process.cwd(), 'data/historical/Site_Data.jsonl');

    if (!fs.existsSync(csvFilePath)) {
        console.error(`ERROR: File not found at ${csvFilePath}`);
        process.exit(1);
    }

    console.log('🔄 Transforming CSV to JSONL...');
    const writeStream = fs.createWriteStream(jsonlFilePath);

    fs.createReadStream(csvFilePath)
        .pipe(csv())
        .on('data', (data: CSVRow) => {
            const row = {
                timestamp: new Date(data.datetime).toISOString(), // Ensure ISO format
                temperature: parseFloat(data.avg_temperature) || null,
                occupancy: parseInt(data.motion) || 0,
                humidity: parseFloat(data.avg_humidity) || null,
                device_id: data.deveui,
                site_id: parseInt(data.clientsite_id) || 0,
                metadata: JSON.stringify({
                    min_temp: data.min_temperature,
                    max_temp: data.max_temperature,
                    light: data.avg_light
                })
            };
            writeStream.write(JSON.stringify(row) + '\n');
        })
        .on('end', async () => {
            console.log('✅ Transformation complete.');
            writeStream.end();

            console.log('🚀 Starting BigQuery Load Job...');
            try {
                const [job] = await bigquery
                    .dataset(datasetId)
                    .table(tableId)
                    .load(jsonlFilePath, {
                        sourceFormat: 'NEWLINE_DELIMITED_JSON',
                        autodetect: false, // We defined schema already
                    });

                console.log(`Job ${job.id} started.`);

                // Poll for job completion using ID
                let jobDone = false;
                let finalMetadata;

                while (!jobDone) {
                    // Re-fetch job to get status
                    const [remoteJob] = await bigquery.job(job.id as string).get();
                    const metadata = remoteJob.metadata;

                    if (metadata.status.state === 'DONE') {
                        jobDone = true;
                        finalMetadata = metadata;
                    } else {
                        // Wait 2 seconds before checking again
                        await new Promise(resolve => setTimeout(resolve, 2000));
                    }
                }

                if (finalMetadata?.status?.errorResult) {
                    console.error('Errors:', finalMetadata.status.errorResult);
                } else {
                    console.log(`✅ Load job completed successfully.`);
                }

            } catch (error) {
                console.error('Error loading data:', error);
            }
        });
}

transformAndLoad();
