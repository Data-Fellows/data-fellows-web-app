import AdminLayout from "@/layouts/admin-layout";
import type { ChallengeWithDays } from "@/types/challenge";
import ChallengeForm from "@/views/admin/challenges/challenge-form";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";

const fetchChallenge = async (id: string) => {
  const response = await fetch(`/api/admin/challenges/${id}`);
  if (response.status === 401) {
    window.location.href = "/admin/login";
    throw new Error("Not authorized");
  }
  if (!response.ok) {
    throw new Error("Failed to load challenge");
  }
  return (await response.json()) as { challenge: ChallengeWithDays };
};

const EditChallengePage = () => {
  const router = useRouter();
  const id = typeof router.query.id === "string" ? router.query.id : undefined;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-challenge", id],
    queryFn: () => fetchChallenge(id!),
    enabled: !!id,
  });

  return (
    <AdminLayout>
      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading...</p>
      ) : isError || !data?.challenge ? (
        <p className="text-sm text-destructive">That challenge couldn&apos;t be found.</p>
      ) : (
        <ChallengeForm mode="edit" challengeId={id} initialChallenge={data.challenge} />
      )}
    </AdminLayout>
  );
};

export default EditChallengePage;
