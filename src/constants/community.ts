// The single community-rhythm list used everywhere it's shown (the
// homepage Community section and /community) -- previously each kept
// its own near-duplicate copy with slightly different wording, and the
// "Journey So Far" cadence had already drifted between the two ("Last
// Friday of every month" vs. "Stories from members, last Friday
// monthly"). Consolidating avoids that kind of silent drift going
// forward; wording below is carried over from whichever copy said it
// most clearly, not a new claim about the cadence.
export const communityRhythm = [
  {
    title: "Community Sunday Catchup",
    cadence: "Every two weeks",
    description:
      "Interactive stand-ups featuring demos, open asks, and a quick celebration of weekly wins.",
  },
  {
    title: "Fireside Sessions",
    cadence: "Once a month",
    description:
      "Cozy, video-first chats with mentors unpacking a challenge and sharing actionable templates.",
  },
  {
    title: "Newsletter",
    cadence: "Every two weeks",
    description:
      "Inbox roundups that stitch together member stories, new guides, and curated opportunities.",
  },
  {
    title: "Journey So Far",
    cadence: "Last Friday of every month",
    description:
      "An audio-first spotlight revealing the behind-the-scenes of a Fellow's latest success.",
  },
];
