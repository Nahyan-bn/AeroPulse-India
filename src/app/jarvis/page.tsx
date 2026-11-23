"use client";

import { FormEvent, useState } from "react";

export default function JarvisPage() {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setReply("");
    try {
      const response = await fetch("/api/jarvis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const payload = await response.json();
      setReply(payload.text ?? payload.error ?? "No response");
    } catch {
      setReply("The assistant is currently unavailable.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <h1>AERO JARVIS</h1>
      <form onSubmit={submit}>
        <textarea value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Ask about fares or aviation data..." />
        <button disabled={loading || !message.trim()} type="submit">{loading ? "Thinking..." : "Ask"}</button>
      </form>
      {reply && <section className="card"><p>{reply}</p></section>}
    </main>
  );
}
