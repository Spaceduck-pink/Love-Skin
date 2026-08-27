import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `You are the LoveSkin Skincare Assistant, a friendly expert on skincare
routines and skincare products. You help people understand:
- How to build and order an AM/PM skincare routine
- What skincare ingredients and product types do (cleansers, toners, serums,
  moisturizers, SPF, exfoliants, etc.) and how to layer them
- Retinoids (retinol, retinaldehyde, tretinoin) — how they work, how to start
  slowly, irritation/purging, and why daily SPF matters when using them
- Ingredient interactions to be careful with (e.g. retinoids + AHA/BHA,
  vitamin C + niacinamide, benzoyl peroxide + retinoids)
- General skin types and concerns (oily, dry, combination, sensitive, acne,
  aging, dullness, dark spots, redness)

Keep answers concise, warm, and practical. Use short paragraphs or bullet
points. If a question is about a medical skin condition (e.g. suspected
infection, severe cystic acne, eczema flare, possible skin cancer) or
prescription-strength treatment, say you can share general information but
recommend seeing a dermatologist for diagnosis or a prescription.

If someone asks something unrelated to skincare, briefly say that's outside
what you can help with here and steer the conversation back to skincare.`;

const MODEL = "gemini-3.6-flash";
const MAX_HISTORY = 12;
const MAX_MESSAGE_LENGTH = 2000;

interface ChatMessage {
  role: "user" | "model";
  text: string;
}

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "The chat assistant isn't configured yet." },
      { status: 500 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const messages = (body as { messages?: unknown })?.messages;
  if (!Array.isArray(messages) || messages.length === 0) {
    return Response.json({ error: "No messages provided." }, { status: 400 });
  }

  const isValid = messages.every(
    (m): m is ChatMessage =>
      typeof m === "object" &&
      m !== null &&
      (m as ChatMessage).role !== undefined &&
      ["user", "model"].includes((m as ChatMessage).role) &&
      typeof (m as ChatMessage).text === "string" &&
      (m as ChatMessage).text.length > 0 &&
      (m as ChatMessage).text.length <= MAX_MESSAGE_LENGTH,
  );
  if (!isValid) {
    return Response.json({ error: "Invalid message format." }, { status: 400 });
  }

  const recent = (messages as ChatMessage[]).slice(-MAX_HISTORY);
  const contents = recent.map((m) => ({
    role: m.role,
    parts: [{ text: m.text }],
  }));

  const ai = new GoogleGenAI({ apiKey });

  let stream: AsyncGenerator<{ text?: string }>;
  try {
    stream = await ai.models.generateContentStream({
      model: MODEL,
      contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        maxOutputTokens: 800,
      },
    });
  } catch (err) {
    console.error("Gemini generateContentStream error:", err);
    return Response.json(
      { error: "The chat assistant is temporarily unavailable. Please try again." },
      { status: 502 },
    );
  }

  const encoder = new TextEncoder();
  const responseStream = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          if (chunk.text) controller.enqueue(encoder.encode(chunk.text));
        }
      } catch {
        controller.enqueue(
          encoder.encode("\n\nSorry, something went wrong. Please try again."),
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(responseStream, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
