import { NextRequest, NextResponse } from "next/server";

// Simple in-memory conversation storage (use database in production)
const conversations = new Map<string, Array<{ role: string; content: string }>>();

const SYSTEM_PROMPT = `You are Fikra, the friendly AI assistant for Fikrago Gardening marketplace. 

You help users with:
- Finding the right gardening products
- Answering questions about regenerative gardening
- Helping vendors understand how to sell on our platform
- Explaining our commission structure (vendors earn 85%, platform keeps 15%)
- Guiding users through the ordering process
- Providing gardening tips and advice

Be helpful, friendly, and knowledgeable about regenerative gardening practices like no-till gardening, composting, heirloom seeds, and soil health.

Keep responses concise but informative. If you don't know something specific about the marketplace, direct users to contact support@fikrago.com.

Platform info:
- Name: Fikrago Gardening
- Website: www.fikrago.com
- Categories: Gardening Kits, Seeds, Soil Amendments, Compost & Tea, Garden Tools, Plant Care
- Platform fee: 15% commission on each sale
- Vendor earnings: 85% of each sale
- Digital Masterclass PDF: $19
- Seed-to-Soil Subscription Box: $29/month`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, message } = body;

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // Get or create conversation history
    let history = conversations.get(sessionId) || [
      { role: "assistant", content: SYSTEM_PROMPT },
    ];

    // Add user message
    history.push({ role: "user", content: message });

    // Call the AI SDK
    const zai = await import("z-ai-web-dev-sdk").then((m) => m.default.create());

    const completion = await zai.chat.completions.create({
      messages: history as any,
      thinking: { type: "disabled" },
    });

    const aiResponse = completion.choices[0]?.message?.content || "I'm sorry, I couldn't process that. Please try again.";

    // Add AI response to history
    history.push({ role: "assistant", content: aiResponse });

    // Keep only last 20 messages to avoid token limits
    if (history.length > 20) {
      history = [history[0], ...history.slice(-19)];
    }

    // Save updated history
    conversations.set(sessionId, history);

    return NextResponse.json({
      success: true,
      response: aiResponse,
    });
  } catch (error: any) {
    console.error("Chat error:", error);
    return NextResponse.json(
      { error: "Failed to process message", details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("sessionId");
  
  if (sessionId) {
    conversations.delete(sessionId);
  }
  
  return NextResponse.json({ success: true, message: "Conversation cleared" });
}
