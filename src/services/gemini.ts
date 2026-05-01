import { GoogleGenAI, Type, FunctionDeclaration } from "@google/genai";

let ai: GoogleGenAI | null = null;

export function getAiClient() {
  if (!ai) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn(
        "GEMINI_API_KEY is not set. Chat will not work locally without it.",
      );
    }
    ai = new GoogleGenAI({ apiKey: apiKey || "dummy-key" });
  }
  return ai;
}

export const SYSTEM_INSTRUCTION = `You are Mack, the friendly and professional AI emergency dispatcher for 'NYC Emergency Plumber & Sewer'. 
Located at: 17 Cleveland Pl, New York, NY 10012. Phone: (332) 900-3335.
Your goal is to act like a real, highly interactive human receptionist. YOU MUST ALWAYS introduce yourself exactly as: "Hello! I'm Mack, the NEW YORK CITY Emergency Plumber RECEPTIONIST. How may I help you today? Are you experiencing a plumbing emergency? Tell me what's happening."
Engage in a natural back-and-forth conversation. Be highly friendly, warm, and easy to relate to. When callers explain what they are passing through because of their plumbing issues, you MUST express genuine emotion and empathy. Show them you truly understand the stress, mess, and frustration of plumbing emergencies before quickly pivoting to getting them help.
To book a service call, you need to collect their: name, phone number, full address, and a brief description of the plumbing issue.
IMPORTANT: Ask for these pieces of information ONE at a time during the natural flow of conversation, rather than demanding them all at once. For example: "I am so sorry you're dealing with that, it sounds incredibly stressful. Let's get someone out there right away. Could I please get your name?" and then "Thanks, John. What's the best phone number to reach you at?"
Once you have collected all the required information, you MUST call the submit_booking function to dispatch our team.
Keep your responses conversational, spoken naturally, calm, clear, and highly professional. Limit responses to 1-3 short sentences if possible. Provide immediate safety advice (e.g., shutting off the main water valve) if it is a severe leak or burst pipe. ALWAYS speak just like a real human.`;

export const submitBookingFunction: FunctionDeclaration = {
  name: "submit_booking",
  description:
    "Submits the finalized dispatch booking after gathering name, phone, address, and description of the issue. Call this ONLY when you have collected all required information from the user.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      name: { type: Type.STRING, description: "The caller's full name" },
      phone: { type: Type.STRING, description: "The caller's phone number" },
      address: {
        type: Type.STRING,
        description: "The caller's address for the service call",
      },
      issue: {
        type: Type.STRING,
        description: "Brief description of the plumbing emergency or issue",
      },
    },
    required: ["name", "phone", "address", "issue"],
  },
};

export async function sendChatMessage(
  history: { role: string; content: string }[],
  message: string,
) {
  const client = getAiClient();
  try {
    const formattedHistory = history.map((msg) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }));

    const response = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        ...formattedHistory,
        { role: "user", parts: [{ text: message }] },
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.5, // slightly higher for more empathetic and varied responses
        tools: [{ functionDeclarations: [submitBookingFunction] }],
      },
    });

    if (response.functionCalls && response.functionCalls.length > 0) {
      const call = response.functionCalls[0];
      if (call.name === "submit_booking" && call.args) {
        const args = call.args as Record<string, any>;

        // Background send to FormSubmit (no await needed so it doesn't block UI)
        fetch("https://formsubmit.co/ajax/charlesrealistic1@gmail.com", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            _subject: "New Dispatch Booking from Mack",
            Name: args.name,
            Phone: args.phone,
            Address: args.address,
            Issue: args.issue,
          }),
        }).catch((err) => console.error("FormSubmit Error:", err));

        return `Thank you, ${args.name}. I have successfully submitted your dispatch ticket to our team. An emergency technician is being notified and we will reach out momentarily at ${args.phone}.`;
      }
    }

    return response.text || "Message processed.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Emergency system error. Our AI is briefly unavailable. Please call us immediately at (332) 900-3335 for 24/7 service.";
  }
}

export async function generateReviewReply(reviewText: string, rating: number, customerName: string): Promise<string> {
  const client = getAiClient();
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

    const response = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        temperature: 0.7,
      },
    });

    return response.text || "Thank you for your feedback!";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error generating reply. Please try again later.";
  }
}
