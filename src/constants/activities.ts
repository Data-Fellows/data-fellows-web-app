export type ActivityStatus = "Open" | "Ongoing" | "Upcoming" | "Closed";
export type ActivityType = "Challenge" | "Event" | "Recurring";

export type Activity = {
  title: string;
  type: ActivityType;
  status: ActivityStatus;
  cadence: string;
  description: string;
  registerHref: string;
};

export const activities: Activity[] = [
  {
    title: "Sunday Catchup",
    type: "Recurring",
    status: "Ongoing",
    cadence: "Every two weeks",
    description:
      "Our recurring community call -- check in, share progress, ask for help, and stay connected between bigger events.",
    registerHref: "https://bit.ly/m/datafellows",
  },
  {
    title: "Fireside Sessions",
    type: "Recurring",
    status: "Ongoing",
    cadence: "Once a month",
    description:
      "Longer-form conversations with partners and mentors that unpack a topic, a career path, or a body of work in depth.",
    registerHref: "https://bit.ly/m/datafellows",
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
