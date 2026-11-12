export interface FederalPlatform {
  name: string;
  url?: string;
  organization: string;
  contribution: string;
  context: string;
  image?: {
    src: string;
    alt: string;
  };
}

export const federalPlatforms: FederalPlatform[] = [
  {
    name: "Youth.gov",
    url: "https://youth.gov/",
    organization: "American Institutes for Research",
    contribution:
      "Contributed UI and front-end development to Youth.gov, an interagency federal resource platform that centralizes research, funding opportunities, community tools, and program guidance for professionals serving young people.",
    context:
      "Youth.gov was created by an interagency working group with representatives from 21 federal agencies. The platform provides content across 25 youth topics and includes funding and community-search resources.",
    image: {
      src: "/images/projects/youth-gov.jpg",
      alt: "Youth.gov homepage with topic navigation and announcements",
    },
  },
];
