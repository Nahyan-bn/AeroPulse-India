"use client";

import dynamic from "next/dynamic";

const Earth = dynamic(() => import("@/components/CesiumEarth"), { ssr: false, loading: () => <p>Loading 3D Earth...</p> });

export default function SkyTracePage() {
  return (
    <main>
      <h1>SkyTrace</h1>
      <p>Aircraft positions shown here are demonstration data until OpenSky operational permission is granted.</p>
      <Earth />
    </main>
  );
}
