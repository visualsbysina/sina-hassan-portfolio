import type { Metadata } from "next";
import PlanetDemo from "@/components/planet/PlanetDemo";

export const metadata: Metadata = {
  title: "Planet Rounds — playable voxel planet",
  description:
    "A planet from Sina Hassan's Unity game Planet Rounds, decoded and meshed in a Web Worker and rendered with Three.js. Click to carve craters.",
};

export default function PlanetRoundsPage() {
  return (
    <div className="h-[100svh] bg-void">
      <PlanetDemo mode="full" />
    </div>
  );
}
