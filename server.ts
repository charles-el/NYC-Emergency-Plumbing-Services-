import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function generateReviewReply(reviewText: string, rating: number, customerName: string): Promise<string> {
  try {
    const prompt = `
You are the business owner of 'NYC Emergency Plumber & Sewer'. 
Generate a professional, highly empathetic, and SEO-optimized reply to a Google Maps review.
The goal is to increase Google Map ranking by naturally including location keywords (e.g., NYC, Manhattan, our specific neighborhood if applicable) and service keywords (e.g., emergency plumbing, sewer repair, drain cleaning) without keyword stuffing.

Customer Name: ${customerName || 'Our valued customer'}
Rating: ${rating} / 5
Review: "${reviewText}"

Guidelines for the reply:
- If 4 or 5 stars: Be extremely grateful, warm, and mention that you're always here for their plumbing needs in NYC.
- If 3 stars or below: Be highly empathetic, apologize for the frustration, avoid being defensive, and offer a way to resolve it offline (e.g., calling the main line).
- Keep it concise, engaging, and professional.
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        temperature: 0.7,
      },
    });

    return response.text || "Thank you for your feedback!";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Thank you for your feedback! Please call us at (332) 900-3335 if you need further assistance.";
  }
}

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json());

  // Google Business Profile Webhook Endpoint
  // This endpoint would receive real-time notifications about new reviews from Google.
  app.post("/api/webhooks/google-reviews", async (req, res) => {
    try {
      console.log('Received webhook event from Google:', req.body);
      
      // Typical Google Review Payload Structure (simplified)
      // We will parse the review data:
      const { reviewId, reviewerName, rating, reviewText, locationId } = req.body;

      if (!reviewId) {
        // Just acknowledging ping or missing payload
        res.status(200).send("Acknowledged");
        return;
      }

      console.log(`Processing new review from ${reviewerName} (${rating} stars)...`);

      // 1. Generate the optimized SEO reply
      const replyBody = await generateReviewReply(reviewText || "", rating || 5, reviewerName || "Valued Customer");
      
      console.log(`Generated Reply for ${reviewerName}: ${replyBody}`);

      // 2. Post reply back to Google Business Profile API
      // Wait: This requires Google OAuth2 / Service Account integration
      /*
      if (process.env.GOOGLE_BUSINESS_API_CREDENTIALS) {
        await postReplyToGoogle(locationId, reviewId, replyBody);
      }
      */
      
      console.log('Successfully processed review reply automation hook.');
      // Acknowledge receipt to the webhook quickly
      res.status(200).json({ success: true, replyGenerated: replyBody });
    } catch (error) {
      console.error('Error handling Google Review Webhook', error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  // Health check API
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", automationEnabled: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Webhook endpoint active at POST http://localhost:${PORT}/api/webhooks/google-reviews`);
  });
}

startServer();
