import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { searchDuffelOffers } from "@/lib/duffel";

export const runtime = "nodejs";

const schema = z.object({
  origin: z.string().length(3).regex(/^[A-Z]{3}$/),
  destination: z.string().length(3).regex(/^[A-Z]{3}$/),
  departureDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  adults: z.number().int().min(1).max(9),
  cabinClass: z.enum(["economy", "premium_economy", "business", "first"]).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Invalid flight search", issues: parsed.error.flatten() }, { status: 400 });
    const offers = await searchDuffelOffers(parsed.data);
    return NextResponse.json(offers);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Duffel request failed" }, { status: 502 });
  }
}
