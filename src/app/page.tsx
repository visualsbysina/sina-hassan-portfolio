import Hero from "@/components/sections/Hero";
import CredibilityStrip from "@/components/sections/CredibilityStrip";
import SelectedWork from "@/components/sections/SelectedWork";
import AllWork from "@/components/sections/AllWork";
import FederalPlatformsSection from "@/components/sections/FederalPlatformsSection";
import ExperimentsSection from "@/components/sections/ExperimentsSection";
import ExperienceSection from "@/components/sections/ExperienceSection";
import AboutSection from "@/components/sections/AboutSection";
import ContactSection from "@/components/sections/ContactSection";
import { getFeaturedProjects, projects } from "@/data/projects";

export default function HomePage() {
  const featured = getFeaturedProjects();

  return (
    <>
      <Hero />
      <CredibilityStrip />
      <SelectedWork projects={featured} />
      <AllWork projects={projects} />
      <FederalPlatformsSection />
      <ExperimentsSection />
      <ExperienceSection />
      <AboutSection />
      <ContactSection />
    </>
  );
}
