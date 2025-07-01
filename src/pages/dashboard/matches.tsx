import MatchesPage from "@/views/dashboard/matches";
import { GetServerSideProps } from "next";

export default function Matches() {
  return <MatchesPage />;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  // For now, we'll handle authentication on the client side
  // You can add server-side auth check here if needed
  return {
    props: {},
  };
};
