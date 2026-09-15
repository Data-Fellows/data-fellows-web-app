import AdminLayout from "@/layouts/admin-layout";
import type { Session, SessionStatus } from "@/types/session";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";
import { FiPlus } from "react-icons/fi";

const statusStyles: Record<SessionStatus, string> = {
  draft: "border-border bg-muted text-muted-foreground",
  published: "border-primary/30 bg-primary/10 text-primary",
  archived: "border-border bg-muted text-muted-foreground",
};

const fetchSessions = async () => {
  const response = await fetch("/api/admin/sessions");
  if (response.status === 401) {
    window.location.href = "/admin/login";
    throw new Error("Not authorized");
  }
  if (!response.ok) {
    throw new Error("Failed to load sessions");
  }
  return (await response.json()) as { sessions: Session[] };
};

const patchStatus = async (id: string, status: SessionStatus) => {
  const response = await fetch(`/api/admin/sessions/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || "Failed to update status.");
  }
};

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));

const AdminSessionsPage = () => {
  const queryClient = useQueryClient();
  const [statusError, setStatusError] = useState<string | null>(null);
  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-sessions"],
    queryFn: fetchSessions,
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: SessionStatus }) =>
      patchStatus(id, status),
    onSuccess: () => {
      setStatusError(null);
      queryClient.invalidateQueries({ queryKey: ["admin-sessions"] });
    },
    onError: (error: Error) => setStatusError(error.message),
  });

  const sessions = data?.sessions ?? [];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-foreground">Sessions</h1>
          <Link
            href="/admin/sessions/new"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
          >
            <FiPlus className="h-4 w-4" />
            New session
          </Link>
        </div>

        {statusError ? <p className="text-sm text-destructive">{statusError}</p> : null}

        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading...</p>
        ) : isError ? (
          <p className="text-sm text-destructive">Failed to load sessions.</p>
        ) : sessions.length === 0 ? (
          <div className="rounded-3xl border border-primary/10 bg-background px-6 py-12 text-center">
            <p className="text-sm text-muted-foreground">
              No sessions yet -- create one for this month's Fireside to get started.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="flex flex-col gap-3 rounded-2xl border border-primary/10 bg-background px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <Link
                  href={`/admin/sessions/${session.id}/edit`}
                  onMouseEnter={() =>
                    queryClient.prefetchQuery({ queryKey: ["admin-session", session.id] })
                  }
                  className="flex-1 transition hover:opacity-80"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide ${statusStyles[session.status]}`}
                    >
                      {session.status}
                    </span>
                    <p className="text-sm font-semibold text-foreground">{session.title}</p>
                  </div>
                </Link>
                <div className="flex items-center gap-3">
                  <p className="text-xs text-muted-foreground">
                    {formatDate(session.session_date)}
                  </p>
                  <button
                    type="button"
                    onClick={() =>
                      statusMutation.mutate({
                        id: session.id,
                        status: session.status === "archived" ? "draft" : "archived",
                      })
                    }
                    disabled={statusMutation.isPending}
                    className="inline-flex items-center rounded-full border border-border px-4 py-2 text-xs font-semibold text-foreground transition hover:border-primary/40 disabled:opacity-60"
                  >
                    {session.status === "archived" ? "Restore" : "Archive"}
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

export default AdminSessionsPage;
