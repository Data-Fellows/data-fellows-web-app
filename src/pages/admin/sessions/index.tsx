import AdminLayout from "@/layouts/admin-layout";
import type { Session, SessionStatus } from "@/types/session";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
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

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));

const AdminSessionsPage = () => {
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-sessions"],
    queryFn: fetchSessions,
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
              <Link
                key={session.id}
                href={`/admin/sessions/${session.id}/edit`}
                onMouseEnter={() =>
                  queryClient.prefetchQuery({ queryKey: ["admin-session", session.id] })
                }
                className="flex flex-col gap-2 rounded-2xl border border-primary/10 bg-background px-5 py-4 transition hover:border-primary/30 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide ${statusStyles[session.status]}`}
                    >
                      {session.status}
                    </span>
                    <p className="text-sm font-semibold text-foreground">{session.title}</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">{formatDate(session.session_date)}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminSessionsPage;
