export type ChallengeTabId =
  | "home"
  | "tracker"
  | "check-in"
  | "wall"
  | "certificate";

export const challengeTabs: { id: ChallengeTabId; label: string }[] = [
  { id: "home", label: "Home" },
  { id: "tracker", label: "Tracker" },
  { id: "check-in", label: "Check-in" },
  { id: "wall", label: "Wall" },
  { id: "certificate", label: "Certificate" },
];
