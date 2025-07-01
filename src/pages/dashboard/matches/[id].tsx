import MatchDetailPage from "@/views/dashboard/matches/detail";
import { GetServerSideProps } from "next";

interface MatchDetailProps {
  matchId: string;
}

export default function MatchDetail({ matchId }: MatchDetailProps) {
  return <MatchDetailPage matchId={matchId} />;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params!;

  if (!id || typeof id !== "string") {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      matchId: id,
    },
  };
};
