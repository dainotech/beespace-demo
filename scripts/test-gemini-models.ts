import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GOOGLE_API_KEY || "AIzaSyBq_9mRvEfrVKmUTRD0QrW3FZAXb4kmb3w"; // Use the key user provided
const genAI = new GoogleGenerativeAI(apiKey);

async function listModels() {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        // There isn't a direct listModels on the instance in some versions, 
        // but let's try to just run a generation to see if it works or fails with the same error.
        // Actually, let's try to use the model and print the error detailed.

        console.log("Testing gemini-2.0-flash...");
        const result = await model.generateContent("Hello");
        console.log("Success:", result.response.text());
    } catch (error) {
        console.error("Error with gemini-1.5-flash:", error);
    }

    try {
        console.log("Testing gemini-pro...");
        const modelPro = genAI.getGenerativeModel({ model: "gemini-pro" });
        const resultPro = await modelPro.generateContent("Hello");
        console.log("Success gemini-pro:", resultPro.response.text());
    } catch (error) {
        console.error("Error with gemini-pro:", error);
    }
}

listModels();
