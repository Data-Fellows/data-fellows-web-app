import { useQuery } from "@tanstack/react-query";
import { FiActivity, FiUsers } from "react-icons/fi";

type CommunityPulseResponse = {
  checkedInToday: number;
  distinctMembers: number;
  activeChallenges: number;
};

const fetchPulse = async () => {
  const response = await fetch("/api/community-pulse");
  if (!response.ok) {
    throw new Error("Failed to load community pulse");
  }
  return (await response.json()) as CommunityPulseResponse;
};

// Social proof banner for /activities. Renders nothing until there's a real
// number to show -- an empty site with "0 check-ins today" undermines the
// point more than showing nothing at all.
const CommunityPulse = () => {
  const { data } = useQuery({
    queryKey: ["community-pulse"],
    queryFn: fetchPulse,
    refetchInterval: 60000,
    staleTime: 30000,
  });

  if (!data) return null;

  if (data.checkedInToday > 0) {
    return (
      <div className="mx-auto flex max-w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
        <FiActivity className="h-4 w-4" />
        {data.checkedInToday} check-in{data.checkedInToday === 1 ? "" : "s"} today
        {data.activeChallenges > 0
          ? ` across ${data.activeChallenges} active challenge${data.activeChallenges === 1 ? "" : "s"}`
          : ""}
      </div>
    );
  }

  if (data.distinctMembers > 0) {
    return (
      <div className="mx-auto flex max-w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
        <FiUsers className="h-4 w-4" />
        {data.distinctMembers}+ Fellows have completed a challenge
      </div>
    );
  }

  return null;
};

export default CommunityPulse;
