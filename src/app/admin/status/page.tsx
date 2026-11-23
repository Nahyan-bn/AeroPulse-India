async function getStatus() {
  const base = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://127.0.0.1:3000";
  const response = await fetch(`${base}/api/status`, { cache: "no-store" });
  if (!response.ok) throw new Error("Could not load integration status");
  return response.json() as Promise<{ integrations: Array<{ name: string; status: string; detail: string }> }>;
}

const badgeClass: Record<string, string> = {
  CONNECTED: "connected",
  "TEST MODE": "test",
  "PENDING APPROVAL": "pending",
  "NOT CONFIGURED": "configured",
  ERROR: "error",
};

export default async function StatusPage() {
  let data: Awaited<ReturnType<typeof getStatus>>;
  try {
    data = await getStatus();
  } catch {
    data = { integrations: [{ name: "Status API", status: "ERROR", detail: "Status endpoint could not be reached" }] };
  }

  return (
    <main>
      <h1>Integration Status</h1>
      <p>Secret values are never returned by this page.</p>
      <div className="grid">
        {data.integrations.map((item) => (
          <section className="card" key={item.name}>
            <h2>{item.name}</h2>
            <span className={`badge ${badgeClass[item.status] ?? "configured"}`}>{item.status}</span>
            <p>{item.detail}</p>
          </section>
        ))}
      </div>
    </main>
  );
}
