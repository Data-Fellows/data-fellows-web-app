import AdminLayout from "@/layouts/admin-layout";
import type { Session } from "@/types/session";
import SessionForm from "@/views/admin/sessions/session-form";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";

const fetchSession = async (id: string) => {
  const response = await fetch(`/api/admin/sessions/${id}`);
  if (response.status === 401) {
    window.location.href = "/admin/login";
    throw new Error("Not authorized");
  }
  if (!response.ok) {
    throw new Error("Failed to load session");
  }
  return (await response.json()) as { session: Session };
};

const EditSessionPage = () => {
  const router = useRouter();
  const id = typeof router.query.id === "string" ? router.query.id : undefined;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-session", id],
    queryFn: () => fetchSession(id!),
    enabled: !!id,
  });

  return (
    <AdminLayout>
      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading...</p>
      ) : isError || !data?.session ? (
        <p className="text-sm text-destructive">That session couldn&apos;t be found.</p>
      ) : (
        <SessionForm mode="edit" sessionId={id} initialSession={data.session} />
      )}
    </AdminLayout>
  );
};

export default EditSessionPage;
