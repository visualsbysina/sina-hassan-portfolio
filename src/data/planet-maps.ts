export interface PlanetMap {
  id: string;
  name: string;
  file: string;
}

// Maps from the Planet Rounds match rotation, baked for the web by
// scripts/bake-planet.mjs.
export const planetMaps: PlanetMap[] = [
  { id: "coral-reef", name: "Coral Reef", file: "/lab/planet/coral-reef.pvm" },
  { id: "spiky-orb", name: "Spiky Orb", file: "/lab/planet/spiky-orb.pvm" },
  { id: "tiny-terra-haven", name: "Tiny Terra Haven", file: "/lab/planet/tiny-terra-haven.pvm" },
  { id: "circular-cityscape", name: "Circular Cityscape", file: "/lab/planet/circular-cityscape.pvm" },
  { id: "oasis", name: "Oasis", file: "/lab/planet/oasis.pvm" },
];
