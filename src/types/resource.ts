export type ResourceCategory = "Story" | "Guide" | "Lesson";
export type ResourceStatus = "draft" | "published" | "archived";
export type EditorialTrack =
  | "Business Insights"
  | "Engineering Notes"
  | "Research & Community";

export const EDITORIAL_TRACKS: EditorialTrack[] = [
  "Business Insights",
  "Engineering Notes",
  "Research & Community",
];

export type Resource = {
  id: string;
  title: string;
  description: string | null;
  category: ResourceCategory;
  href: string;
  image_url: string | null;
  published_date: string | null;
  status: ResourceStatus;
  author_name: string | null;
  // Loosely matches a person's name in src/views/shared/team.ts -- used to
  // link a card back to that person's About/People entry. Not a DB foreign
  // key (team.ts isn't a database table).
  author_people_slug: string | null;
  original_publisher: string | null;
  topic: string | null;
  featured: boolean;
  is_external_article: boolean;
  editorial_track: EditorialTrack | null;
  created_at: string;
  updated_at: string;
};
