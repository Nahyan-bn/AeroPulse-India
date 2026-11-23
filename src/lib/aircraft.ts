export interface AircraftObservation {
  icao24: string;
  callsign: string | null;
  latitude: number;
  longitude: number;
  altitudeM: number | null;
  headingDeg: number | null;
  velocityMps: number | null;
  onGround: boolean;
  isDemonstration: true;
  source: "DEMONSTRATION";
}

export async function getAircraftObservations(): Promise<AircraftObservation[]> {
  if (process.env.OPENSKY_PERMISSION !== "true") {
    return [
      { icao24: "DEMO01", callsign: "AI DEMO", latitude: 28.6139, longitude: 77.2090, altitudeM: 9000, headingDeg: 90, velocityMps: 220, onGround: false, isDemonstration: true, source: "DEMONSTRATION" },
      { icao24: "DEMO02", callsign: "IX DEMO", latitude: 19.0760, longitude: 72.8777, altitudeM: 10500, headingDeg: 270, velocityMps: 230, onGround: false, isDemonstration: true, source: "DEMONSTRATION" },
    ];
  }
  throw new Error("OpenSky approval exists in configuration but provider credentials are not implemented");
}
