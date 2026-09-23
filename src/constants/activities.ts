export type ActivityStatus = "Open" | "Ongoing" | "Upcoming" | "Closed";
export type ActivityType = "Challenge" | "Event" | "Recurring";

export type Activity = {
  title: string;
  type: ActivityType;
  status: ActivityStatus;
  cadence: string;
  description: string;
  registerHref: string;
  image?: string;
};

export const activities: Activity[] = [
  {
    title: "Sunday Catchup",
    type: "Recurring",
    status: "Ongoing",
    cadence: "Every two weeks",
    description:
      "Our recurring community call -- check in, share progress, ask for help, and stay connected between bigger events.",
    registerHref: "https://forms.gle/LTBu4n9NTMhYjjEM6",
  },
  {
    title: "DataCamp Learning",
    type: "Recurring",
    status: "Open",
    cadence: "Self-paced",
    description:
      "Free access to DataCamp's courses and certifications -- build data, AI, and analytics skills at your own pace.",
    registerHref: "https://forms.gle/NoGwPBVBM3Fq3Pi86",
  },
  {
    title: "Propel Community",
    type: "Recurring",
    status: "Open",
    cadence: "Ongoing",
    description:
      "Job opportunities and paid earning surveys for the Data Fellows community, powered by Propel.",
    registerHref: "https://datafellows.propel.community/auth",
  },
  {
    title: "Claude 101 Challenge",
    type: "Challenge",
    status: "Closed",
    cadence: "One-week sprint",
    description:
      "A one-week AI fluency sprint built with Anthropic's Claude -- prompting fundamentals, Projects and Artifacts, and real use cases across roles.",
    registerHref: "https://claude-community-challenge.lovable.app/",
  },
];
