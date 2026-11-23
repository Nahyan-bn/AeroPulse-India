const DUFFEL_API = "https://api.duffel.com";

export interface FlightSearchInput {
  origin: string;
  destination: string;
  departureDate: string;
  adults: number;
  cabinClass?: "economy" | "premium_economy" | "business" | "first";
}

export async function searchDuffelOffers(input: FlightSearchInput) {
  const token = process.env.DUFFEL_ACCESS_TOKEN;
  if (!token) throw new Error("DUFFEL_ACCESS_TOKEN is not configured");

  const passengers = Array.from({ length: input.adults }, () => ({ type: "adult" }));
  const response = await fetch(`${DUFFEL_API}/air/offer_requests?return_offers=true`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Duffel-Version": "v2",
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      data: {
        slices: [{
          origin: input.origin,
          destination: input.destination,
          departure_date: input.departureDate,
        }],
        passengers,
        cabin_class: input.cabinClass ?? "economy",
      },
    }),
  });

  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload?.errors?.[0]?.title ?? `Duffel returned HTTP ${response.status}`);
  }

  const offerRequest = payload.data;
  return {
    testData: process.env.DUFFEL_ENV !== "live",
    offerRequestId: offerRequest.id,
    offers: (offerRequest.offers ?? []).map((offer: {
      id: string;
      total_amount: string;
      total_currency: string;
      owner?: { name?: string };
      slices?: Array<{ segments?: Array<{ origin?: { iata_code?: string }; destination?: { iata_code?: string } }> }>;
    }) => ({
      id: offer.id,
      provider: offer.owner?.name ?? "Unknown carrier",
      totalAmount: offer.total_amount,
      currency: offer.total_currency,
      slices: offer.slices ?? [],
    })),
  };
}
