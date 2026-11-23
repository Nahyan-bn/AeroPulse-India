import { NextResponse } from "next/server";
import { getAircraftObservations } from "@/lib/aircraft";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return NextResponse.json({ aircraft: await getAircraftObservations() });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Aircraft provider unavailable" }, { status: 503 });
  }
}
