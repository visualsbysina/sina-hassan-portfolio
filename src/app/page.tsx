import Hero from "@/components/sections/Hero";
import CredibilityStrip from "@/components/sections/CredibilityStrip";
import SelectedWork from "@/components/sections/SelectedWork";
import PlanetFeature from "@/components/sections/PlanetFeature";
import AllWork from "@/components/sections/AllWork";
import ContributionsSection from "@/components/sections/ContributionsSection";
import ExperimentsSection from "@/components/sections/ExperimentsSection";
import ExperienceSection from "@/components/sections/ExperienceSection";
import AboutSection from "@/components/sections/AboutSection";
import ContactSection from "@/components/sections/ContactSection";
import { getFeaturedProjects, projects } from "@/data/projects";

export default function HomePage() {
  return (
    <>
      <Hero />
      <CredibilityStrip />
      <SelectedWork projects={getFeaturedProjects()} />
      <PlanetFeature />
      <ExperimentsSection />
      <AllWork projects={projects} />
      <ContributionsSection />
      <ExperienceSection />
      <AboutSection />
      <ContactSection />
    </>
  );
}
