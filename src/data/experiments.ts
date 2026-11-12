import type { Experiment } from "@/types";

export const experiments: Experiment[] = [
  {
    slug: "planet-rounds",
    title: "Planet Rounds",
    description:
      "A networked tank game I'm building in Unity, fought on small voxel planets where every shell carves the terrain. Its planet renderer is rebuilt for the browser here.",
    tags: ["Unity", "Three.js", "Web Workers", "GLSL"],
    href: "/lab/planet-rounds",
  },
  {
    slug: "generative-forest",
    title: "Generative Forest",
    description:
      "Procedural tree generation with layered canopy systems and ambient motion.",
    tags: ["Three.js", "WebGL", "Generative"],
  },
  {
    slug: "eastern-bloc-rally",
    title: "Eastern Bloc Rally",
    description:
      "Browser-based driving experiment with retro aesthetics and physics-driven controls.",
    tags: ["Three.js", "Game Dev", "WebGL"],
  },
  {
    slug: "webgl-experiments",
    title: "Three.js & WebGL Experiments",
    description:
      "Shader studies, particle systems, and interactive terrain prototypes.",
    tags: ["Three.js", "GLSL", "R3F"],
  },
  {
    slug: "data-viz",
    title: "Data Visualization Experiments",
    description:
      "Interactive chart prototypes exploring narrative data presentation in the browser.",
    tags: ["D3.js", "Highcharts", "Canvas"],
  },
];
