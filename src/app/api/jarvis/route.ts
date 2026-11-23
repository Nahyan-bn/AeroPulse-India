import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export const runtime = "nodejs";

const requestSchema = z.object({
  message: z.string().trim().min(1).max(4000),
});

export async function POST(request: NextRequest) {
  const parsed = requestSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid message" }, { status: 400 });
  if (!process.env.ANTHROPIC_API_KEY) return NextResponse.json({ error: "ANTHROPIC_API_KEY is not configured" }, { status: 503 });

  try {
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const response = await anthropic.messages.create({
      model: process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-5",
      max_tokens: 800,
      system: "You are AERO JARVIS, an aviation and airfare assistant for AeroPulse India. Be accurate, disclose uncertainty, and never imply a booking is confirmed.",
      messages: [{ role: "user", content: parsed.data.message }],
    });
    const text = response.content.filter((block) => block.type === "text").map((block) => block.text).join("\n");
    return NextResponse.json({ text });
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Claude request failed";
    return NextResponse.json({ error: "Claude request failed", detail }, { status: 502 });
  }
}
