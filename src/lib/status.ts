export type IntegrationStatus = "CONNECTED" | "NOT CONFIGURED" | "TEST MODE" | "PENDING APPROVAL" | "ERROR";

export interface IntegrationStatusItem {
  name: string;
  status: IntegrationStatus;
  detail: string;
}

export function envStatus(name: string, configured: boolean, detail: string): IntegrationStatus {
  if (!configured) return "NOT CONFIGURED";
  if (detail.includes("approval")) return "PENDING APPROVAL";
  return detail.includes("test") ? "TEST MODE" : "CONNECTED";
}
