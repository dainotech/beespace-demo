import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import * as fs from 'fs';
import * as path from 'path';

// Load Service Account
const serviceAccountPath = path.join(process.cwd(), 'service-account.json');
if (!fs.existsSync(serviceAccountPath)) {
    console.error("ERROR: service-account.json not found!");
    process.exit(1);
}
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

// Initialize Firebase Admin
if (getApps().length === 0) {
    initializeApp({
        credential: cert(serviceAccount),
        projectId: 'daino-platform'
    });
}

const db = getFirestore();

async function seedData() {
    console.log("🌱 Seeding 24h Telemetry Data...");

    const readingsCollection = db.collection('readings');

    // Delete existing data first (optional, but cleaner for this specific pattern)
    const snapshot = await readingsCollection.get();
    const batchDelete = db.batch();
    snapshot.docs.forEach((doc) => {
        batchDelete.delete(doc.ref);
    });
    await batchDelete.commit();
    console.log(`Deleted ${snapshot.size} existing records.`);

    const batch = db.batch();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let hour = 0; hour <= 24; hour++) {
        const timestamp = new Date(today);
        timestamp.setHours(hour);

        let temperature = 15;
        let occupancy = 0;

        // Temperature Logic
        if (hour < 6) {
            // 00:00 - 06:00: Rise from 15 to 21
            temperature = 15 + ((hour / 6) * 6);
        } else if (hour >= 6 && hour < 17) {
            // 06:00 - 17:00: Constant 21
            temperature = 21;
        } else if (hour >= 17 && hour < 21) {
            // 17:00 - 21:00: Drop from 21 to 15
            const progress = (hour - 17) / 4;
            temperature = 21 - (progress * 6);
        } else {
            // 21:00 - 24:00: Constant 15
            temperature = 15;
        }

        // Occupancy Logic
        if (hour < 6) {
            // 00:00 - 06:00: Rise from 0% to 10%
            occupancy = (hour / 6) * 10;
        } else if (hour >= 6 && hour <= 18) {
            // 06:00 - 18:00: Bell curve peaking at 84% at 12:00
            // Standard Bell Curve formula: f(x) = A * exp( - (x - center)^2 / (2 * width^2) )
            // We want peak at 12, value ~84. Base is 10.
            // Let's use a simpler interpolation for "perfect bell curve" feel
            const peak = 84;
            const base = 10;
            const center = 12;
            const width = 3; // Controls spread

            const bell = Math.exp(-Math.pow(hour - center, 2) / (2 * Math.pow(width, 2)));
            // Scale bell to be between base and peak
            occupancy = base + (bell * (peak - base));
        } else {
            // 18:00 - 24:00: 0%
            occupancy = 0;
        }

        const docRef = readingsCollection.doc();
        batch.set(docRef, {
            timestamp: timestamp,
            temperature: Math.round(temperature * 10) / 10, // Round to 1 decimal
            occupancy: Math.round(occupancy),
            co2: 400 + (occupancy * 5) + (Math.random() * 20), // Correlate CO2 with occupancy
            humidity: 45 // Keeping constant as requested to ignore it
        });
    }

    await batch.commit();
    console.log("✅ Seeded 25 hourly records (00:00 - 24:00).");
}

seedData().catch(console.error);
