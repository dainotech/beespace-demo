import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const serviceAccount = JSON.parse(readFileSync(join(__dirname, '../service-account.json'), 'utf8'));

if (getApps().length === 0) {
    initializeApp({
        credential: cert(serviceAccount)
    });
}

const db = getFirestore();

async function verify() {
    console.log("Verifying Firestore Data...");
    const snapshot = await db.collection('readings').count().get();
    console.log(`Found ${snapshot.data().count} records in 'readings' collection.`);

    if (snapshot.data().count === 50) {
        console.log("✅ SUCCESS: Data seeding verified.");
    } else {
        console.log("⚠️ WARNING: Unexpected record count.");
    }
}

verify().catch(console.error);
