import AdminLayout from "@/layouts/admin-layout";
import type { Resource, ResourceStatus } from "@/types/resource";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";
import { FiPlus } from "react-icons/fi";

const statusStyles: Record<ResourceStatus, string> = {
  draft: "border-border bg-muted text-muted-foreground",
  published: "border-primary/30 bg-primary/10 text-primary",
  archived: "border-border bg-muted text-muted-foreground",
};

const fetchResources = async () => {
  const response = await fetch("/api/admin/resources");
  if (response.status === 401) {
    window.location.href = "/admin/login";
    throw new Error("Not authorized");
  }
  if (!response.ok) {
    throw new Error("Failed to load resources");
  }
  return (await response.json()) as { resources: Resource[] };
};

const patchStatus = async (id: string, status: ResourceStatus) => {
  const response = await fetch(`/api/admin/resources/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || "Failed to update status.");
  }
};

const AdminResourcesPage = () => {
  const queryClient = useQueryClient();
  const [statusError, setStatusError] = useState<string | null>(null);
  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-resources"],
    queryFn: fetchResources,
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: ResourceStatus }) =>
      patchStatus(id, status),
    onSuccess: () => {
      setStatusError(null);
      queryClient.invalidateQueries({ queryKey: ["admin-resources"] });
    },
    onError: (error: Error) => setStatusError(error.message),
  });

  const resources = data?.resources ?? [];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-foreground">Resources</h1>
          <Link
            href="/admin/resources/new"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
          >
            <FiPlus className="h-4 w-4" />
            New resource
          </Link>
        </div>

        {statusError ? <p className="text-sm text-destructive">{statusError}</p> : null}

        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading...</p>
        ) : isError ? (
          <p className="text-sm text-destructive">Failed to load resources.</p>
        ) : resources.length === 0 ? (
          <div className="rounded-3xl border border-primary/10 bg-background px-6 py-12 text-center">
            <p className="text-sm text-muted-foreground">
              No resources yet -- add a story, guide, or lesson to get started.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {resources.map((resource) => (
              <div
                key={resource.id}
                className="flex flex-col gap-3 rounded-2xl border border-primary/10 bg-background px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <Link
                  href={`/admin/resources/${resource.id}/edit`}
                  onMouseEnter={() =>
                    queryClient.prefetchQuery({ queryKey: ["admin-resource", resource.id] })
                  }
                  className="flex-1 transition hover:opacity-80"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide ${statusStyles[resource.status]}`}
                    >
                      {resource.status}
                    </span>
                    <span className="inline-flex items-center rounded-full border border-primary/20 bg-secondary/10 px-2.5 py-0.5 text-xs font-semibold text-foreground">
                      {resource.category}
                    </span>
                    <p className="text-sm font-semibold text-foreground">{resource.title}</p>
                  </div>
                </Link>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      statusMutation.mutate({
                        id: resource.id,
                        status: resource.status === "archived" ? "draft" : "archived",
                      })
                    }
                    disabled={statusMutation.isPending}
                    className="inline-flex items-center rounded-full border border-border px-4 py-2 text-xs font-semibold text-foreground transition hover:border-primary/40 disabled:opacity-60"
                  >
                    {resource.status === "archived" ? "Restore" : "Archive"}
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

export default AdminResourcesPage;
