import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
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
        projectId: 'beespace-demo-app'
    });
}

const auth = getAuth();

async function createDemoUser() {
    const email = 'demo@bee.space';
    const password = 'password';
    const displayName = 'Beespace Demo';

    try {
        // Check if user exists
        try {
            const userRecord = await auth.getUserByEmail(email);
            console.log(`User ${email} already exists: ${userRecord.uid}`);
            // Update password just in case
            await auth.updateUser(userRecord.uid, {
                password: password,
                displayName: displayName,
                emailVerified: true
            });
            console.log(`✅ Updated existing user: ${email}`);
        } catch (error: any) {
            if (error.code === 'auth/user-not-found') {
                // Create new user
                const userRecord = await auth.createUser({
                    email: email,
                    emailVerified: true,
                    password: password,
                    displayName: displayName,
                    photoURL: 'https://daino.co.uk/assets/Daino-1.png',
                    disabled: false,
                });
                console.log(`✅ Successfully created new user: ${userRecord.uid}`);
            } else {
                throw error;
            }
        }
    } catch (error) {
        console.error('Error creating new user:', error);
    }
}

createDemoUser();
