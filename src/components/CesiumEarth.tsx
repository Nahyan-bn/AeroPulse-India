"use client";

import { useEffect, useRef, useState } from "react";
import type * as CesiumTypes from "cesium";

export default function CesiumEarth() {
  const container = useRef<HTMLDivElement>(null);
  const [message, setMessage] = useState("Initializing Cesium...");

  useEffect(() => {
    let viewer: CesiumTypes.Viewer | undefined;
    let disposed = false;

    async function initialize() {
      const Cesium = await import("cesium");
      if (!container.current) return;
      const token = process.env.NEXT_PUBLIC_CESIUM_ION_TOKEN;
      if (!token) {
        setMessage("Cesium ion token is not configured. Showing a basic fallback Earth.");
        viewer = new Cesium.Viewer(container.current, {
          animation: false,
          timeline: false,
          baseLayer: Cesium.ImageryLayer.fromProviderAsync(Cesium.TileMapServiceImageryProvider.fromUrl(Cesium.buildModuleUrl("Assets/Textures/NaturalEarthII"))),
        });
      } else {
        Cesium.Ion.defaultAccessToken = token;
        try {
          viewer = new Cesium.Viewer(container.current, {
            animation: false,
            timeline: false,
            baseLayer: Cesium.ImageryLayer.fromProviderAsync(Cesium.IonImageryProvider.fromAssetId(2)),
            geocoder: false,
          });
        } catch {
          if (!disposed) setMessage("Satellite imagery unavailable; try the basic Earth view.");
        }
      }

      if (!viewer) return;
      viewer.camera.setView({ destination: Cesium.Cartesian3.fromDegrees(78.9629, 20.5937, 7000000) });
      const aircraftResponse = await fetch("/api/aircraft");
      if (!aircraftResponse.ok) return;
      const { aircraft } = await aircraftResponse.json() as { aircraft: Array<{ icao24: string; callsign: string; latitude: number; longitude: number; altitudeM: number }> };
      for (const plane of aircraft) {
        viewer.entities.add({
          name: `${plane.callsign} (DEMONSTRATION)`,
          position: Cesium.Cartesian3.fromDegrees(plane.longitude, plane.latitude, plane.altitudeM ?? 8000),
          point: { pixelSize: 10, color: Cesium.Color.CYAN },
          label: { text: `${plane.callsign} - DEMONSTRATION`, pixelOffset: new Cesium.Cartesian2(0, -20) },
        });
      }
    }

    initialize().catch(() => setMessage("3D Earth could not initialize. Demonstration aircraft data remains unavailable."));
    return () => {
      disposed = true;
      viewer?.destroy();
    };
  }, []);

  return (
    <section>
      {message !== "Initializing Cesium..." && <p>{message}</p>}
      <div ref={container} style={{ height: "520px", width: "100%", borderRadius: "10px", overflow: "hidden" }} />
    </section>
  );
}
