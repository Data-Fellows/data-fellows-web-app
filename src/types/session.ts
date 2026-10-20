export type SessionStatus = "draft" | "published" | "archived";
export type SessionRegistrationMode = "external" | "internal";

export type Session = {
  id: string;
  title: string;
  description: string | null;
  session_date: string;
  registration_url: string | null;
  registration_mode: SessionRegistrationMode;
  replay_url: string | null;
  image_url: string | null;
  status: SessionStatus;
  created_at: string;
  updated_at: string;
};
