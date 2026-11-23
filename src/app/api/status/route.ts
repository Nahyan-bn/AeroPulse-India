import { NextResponse } from "next/server";
import { testDatabase } from "@/lib/db";
import type { IntegrationStatusItem } from "@/lib/status";

export const runtime = "nodejs";

export async function GET() {
  const database = await testDatabase();
  const cesiumConfigured = Boolean(process.env.NEXT_PUBLIC_CESIUM_ION_TOKEN);
  const duffelConfigured = Boolean(process.env.DUFFEL_ACCESS_TOKEN);
  const resendConfigured = Boolean(process.env.RESEND_API_KEY);
  const claudeConfigured = Boolean(process.env.ANTHROPIC_API_KEY);

  const integrations: IntegrationStatusItem[] = [
    { name: "Database", status: database.ok ? "CONNECTED" : process.env.DATABASE_URL ? "ERROR" : "NOT CONFIGURED", detail: database.detail },
    { name: "Cesium ion", status: cesiumConfigured ? "CONNECTED" : "NOT CONFIGURED", detail: cesiumConfigured ? "Browser token configured" : "NEXT_PUBLIC_CESIUM_ION_TOKEN is not configured" },
    { name: "Duffel", status: !duffelConfigured ? "NOT CONFIGURED" : process.env.DUFFEL_ENV === "live" ? "ERROR" : "TEST MODE", detail: duffelConfigured ? "Server token configured; live bookings are disabled" : "DUFFEL_ACCESS_TOKEN is not configured" },
    { name: "Resend", status: !resendConfigured ? "NOT CONFIGURED" : process.env.RESEND_FROM_EMAIL?.includes("@gmail.com") ? "ERROR" : "CONNECTED", detail: !resendConfigured ? "RESEND_API_KEY is not configured" : process.env.RESEND_FROM_EMAIL?.includes("@gmail.com") ? "API key configured, but Gmail sender must be replaced by a sender on a verified Resend domain" : "Server key configured; verify the configured sending domain in Resend" },
    { name: "Claude", status: claudeConfigured ? "CONNECTED" : "NOT CONFIGURED", detail: claudeConfigured ? "ANTHROPIC_API_KEY is configured" : "ANTHROPIC_API_KEY is not configured" },
    { name: "OpenSky", status: "PENDING APPROVAL", detail: "No written operational permission or production credentials; demonstration data is in use" },
  ];

  return NextResponse.json({ integrations });
}
