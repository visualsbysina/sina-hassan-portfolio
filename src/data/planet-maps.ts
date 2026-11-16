export interface PlanetMap {
  id: string;
  name: string;
  file: string;
  /** Frosted-glass crust + hollow chamber (cursed orb). */
  glass?: boolean;
  /** Static skull prop trapped in the chamber. */
  skull?: string;
}

// Maps from the Planet Rounds match rotation, baked for the web by
// scripts/bake-planet.mjs.
export const planetMaps: PlanetMap[] = [
  { id: "coral-reef", name: "Coral Reef", file: "/lab/planet/coral-reef.pvm" },
  { id: "spiky-orb", name: "Spiky Orb", file: "/lab/planet/spiky-orb.pvm" },
  {
    id: "cursed-orb",
    name: "Cursed Orb",
    file: "/lab/planet/cursed-orb.pvm",
    glass: true,
    skull: "/lab/planet/voidfang-skull.bin",
  },
  { id: "tiny-terra-haven", name: "Tiny Terra Haven", file: "/lab/planet/tiny-terra-haven.pvm" },
  { id: "circular-cityscape", name: "Circular Cityscape", file: "/lab/planet/circular-cityscape.pvm" },
];
