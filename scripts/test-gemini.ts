import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = "AIzaSyDQNIT_aq5KaXqI-6jj0bzG2rSXgQ1Fj9s";
const genAI = new GoogleGenerativeAI(apiKey);

async function test() {
    console.log("Testing Gemini API...");
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const result = await model.generateContent("Hello, are you online?");
        console.log("Response:", result.response.text());
        console.log("✅ SUCCESS: API Key and Model are working.");
    } catch (error: any) {
        console.error("❌ ERROR:", error.message);
    }
}

test();
