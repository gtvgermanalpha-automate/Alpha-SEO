/**
 * Team page content — editable in src/content/team.json (an object collection).
 * Re-exported from @/lib/content.
 */
import raw from "@/content/team.json";

export type TeamMember = {
  name: string;
  role: string;
  image?: string;
  imageAlt?: string;
  bio: string;
};

export type TeamContent = {
  heading: string;
  intro: string;
  members: TeamMember[];
};

export const team: TeamContent = raw as unknown as TeamContent;
