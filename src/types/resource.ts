export type ResourceCategory = "Story" | "Guide" | "Lesson";
export type ResourceStatus = "draft" | "published" | "archived";

export type Resource = {
  id: string;
  title: string;
  description: string | null;
  category: ResourceCategory;
  href: string;
  image_url: string | null;
  published_date: string | null;
  status: ResourceStatus;
  created_at: string;
  updated_at: string;
};
