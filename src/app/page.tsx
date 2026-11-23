"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

interface Offer {
  id: string;
  provider: string;
  totalAmount: string;
  currency: string;
}

interface SearchResult {
  testData: boolean;
  offers: Offer[];
  offerRequestId: string;
}

export default function Home() {
  const [origin, setOrigin] = useState("DEL");
  const [destination, setDestination] = useState("BOM");
  const [departureDate, setDepartureDate] = useState("");
  const [adults, setAdults] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<SearchResult | null>(null);

  async function searchFlights(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("/api/duffel/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          origin: origin.trim().toUpperCase(),
          destination: destination.trim().toUpperCase(),
          departureDate,
          adults,
          cabinClass: "economy",
        }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? "Flight search failed");
      setResult(payload);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Flight search failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="home">
      <nav className="nav" aria-label="Primary navigation">
        <Link className="brand" href="/" aria-label="AeroPulse India home">
          <span className="brand-mark" aria-hidden="true">
            <span />
          </span>
          <span>AERO<b>PULSE</b></span>
        </Link>
        <div className="nav-links">
          <Link href="/skytrace">SkyTrace</Link>
          <Link href="/jarvis">AERO JARVIS</Link>
          <Link href="/admin/status">Status</Link>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow"><i /> Aviation intelligence</span>
          <h1>Know the sky.<br /><em>Move with confidence.</em></h1>
          <p>Live airfare intelligence, aircraft tracking, and AI-powered aviation insights for every journey across India.</p>
        </div>

        <form className="search-panel" onSubmit={searchFlights}>
          <div className="search-heading">
            <div>
              <span className="field-label">FROM</span>
              <input
                className="airport-input"
                aria-label="Origin airport code"
                value={origin}
                onChange={(event) => setOrigin(event.target.value)}
                maxLength={3}
                pattern="[A-Za-z]{3}"
                required
              />
            </div>
            <button className="swap-button" type="button" aria-label="Swap airports" onClick={() => {
              setOrigin(destination);
              setDestination(origin);
            }}>⇄</button>
            <div>
              <span className="field-label">TO</span>
              <input
                className="airport-input"
                aria-label="Destination airport code"
                value={destination}
                onChange={(event) => setDestination(event.target.value)}
                maxLength={3}
                pattern="[A-Za-z]{3}"
                required
              />
            </div>
            <div>
              <span className="field-label">DEPARTURE</span>
              <input
                className="date-input"
                aria-label="Departure date"
                type="date"
                value={departureDate}
                onChange={(event) => setDepartureDate(event.target.value)}
                required
              />
            </div>
            <div>
              <span className="field-label">TRAVELERS</span>
              <select aria-label="Number of travelers" value={adults} onChange={(event) => setAdults(Number(event.target.value))}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((count) => <option key={count} value={count}>{count} Adult{count > 1 ? "s" : ""}</option>)}
              </select>
            </div>
            <button className="search-button" type="submit" disabled={loading}>
              {loading ? "Searching..." : "Search fares"}
            </button>
          </div>
        </form>

        {error && <div className="search-message error-message" role="alert">{error}</div>}
        {result && (
          <div className="search-message">
            <strong>{result.testData ? "Test-mode results" : "Flight offers"}</strong>
            {result.offers.length === 0 ? (
              <span>No fares returned for this search.</span>
            ) : (
              <div className="offer-list">
                {result.offers.slice(0, 4).map((offer) => (
                  <div className="offer" key={offer.id}>
                    <span>{offer.provider}</span>
                    <b>{offer.currency} {offer.totalAmount}</b>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      <section className="feature-grid" aria-label="Platform features">
        <Link className="feature-card" href="/skytrace">
          <span className="feature-icon" aria-hidden="true">◉</span>
          <div><span>LIVE MAP</span><h2>SkyTrace</h2><p>Track aircraft movements and regional airspace activity.</p></div>
          <b aria-hidden="true">→</b>
        </Link>
        <Link className="feature-card" href="/jarvis">
          <span className="feature-icon" aria-hidden="true">✦</span>
          <div><span>AI ASSISTANT</span><h2>AERO JARVIS</h2><p>Get clear answers about fares, routes, and aviation data.</p></div>
          <b aria-hidden="true">→</b>
        </Link>
      </section>
    </main>
  );
}
