import AdminLayout from "@/layouts/admin-layout";
import type { Challenge, ChallengeStatus } from "@/types/challenge";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";
import { FiPlus } from "react-icons/fi";

const statusStyles: Record<ChallengeStatus, string> = {
  draft: "border-border bg-muted text-muted-foreground",
  published: "border-primary/30 bg-primary/10 text-primary",
  archived: "border-border bg-muted text-muted-foreground",
};

const fetchChallenges = async () => {
  const response = await fetch("/api/admin/challenges");
  if (response.status === 401) {
    window.location.href = "/admin/login";
    throw new Error("Not authorized");
  }
  if (!response.ok) {
    throw new Error("Failed to load challenges");
  }
  return (await response.json()) as { challenges: Challenge[] };
};

const patchStatus = async (id: string, status: ChallengeStatus) => {
  const response = await fetch(`/api/admin/challenges/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || "Failed to update status.");
  }
};

const formatDateRange = (start: string, end: string) =>
  `${new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(
    new Date(`${start}T00:00:00Z`)
  )} -- ${new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(
    new Date(`${end}T00:00:00Z`)
  )}`;

const AdminChallengesPage = () => {
  const queryClient = useQueryClient();
  const [statusError, setStatusError] = useState<string | null>(null);
  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-challenges"],
    queryFn: fetchChallenges,
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: ChallengeStatus }) =>
      patchStatus(id, status),
    onSuccess: () => {
      setStatusError(null);
      queryClient.invalidateQueries({ queryKey: ["admin-challenges"] });
    },
    onError: (error: Error) => setStatusError(error.message),
  });

  const challenges = data?.challenges ?? [];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-foreground">Challenges</h1>
          <Link
            href="/admin/challenges/new"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
          >
            <FiPlus className="h-4 w-4" />
            New challenge
          </Link>
        </div>

        {statusError ? (
          <p className="text-sm text-destructive">{statusError}</p>
        ) : null}

        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading...</p>
        ) : isError ? (
          <p className="text-sm text-destructive">Failed to load challenges.</p>
        ) : challenges.length === 0 ? (
          <div className="rounded-3xl border border-primary/10 bg-background px-6 py-12 text-center">
            <p className="text-sm text-muted-foreground">
              No challenges yet. Create the first one to get started.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {challenges.map((challenge) => (
              <div
                key={challenge.id}
                className="flex flex-col gap-3 rounded-2xl border border-primary/10 bg-background px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <Link
                  href={`/admin/challenges/${challenge.id}/edit`}
                  onMouseEnter={() =>
                    queryClient.prefetchQuery({ queryKey: ["admin-challenge", challenge.id] })
                  }
                  className="flex-1 transition hover:opacity-80"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide ${statusStyles[challenge.status]}`}
                    >
                      {challenge.status}
                    </span>
                    <p className="text-sm font-semibold text-foreground">{challenge.title}</p>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">/{challenge.slug}</p>
                </Link>
                <div className="flex items-center gap-3">
                  <p className="text-xs text-muted-foreground">
                    {formatDateRange(challenge.start_date, challenge.end_date)}
                  </p>
                  <button
                    type="button"
                    onClick={() =>
                      statusMutation.mutate({
                        id: challenge.id,
                        status: challenge.status === "archived" ? "draft" : "archived",
                      })
                    }
                    disabled={statusMutation.isPending}
                    className="inline-flex items-center rounded-full border border-border px-4 py-2 text-xs font-semibold text-foreground transition hover:border-primary/40 disabled:opacity-60"
                  >
                    {challenge.status === "archived" ? "Restore" : "Archive"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminChallengesPage;
