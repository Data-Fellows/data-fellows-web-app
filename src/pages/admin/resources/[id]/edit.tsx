import AdminLayout from "@/layouts/admin-layout";
import type { Resource } from "@/types/resource";
import ResourceForm from "@/views/admin/resources/resource-form";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";

const fetchResource = async (id: string) => {
  const response = await fetch(`/api/admin/resources/${id}`);
  if (response.status === 401) {
    window.location.href = "/admin/login";
    throw new Error("Not authorized");
  }
  if (!response.ok) {
    throw new Error("Failed to load resource");
  }
  return (await response.json()) as { resource: Resource };
};

const EditResourcePage = () => {
  const router = useRouter();
  const id = typeof router.query.id === "string" ? router.query.id : undefined;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-resource", id],
    queryFn: () => fetchResource(id!),
    enabled: !!id,
  });

  return (
    <AdminLayout>
      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading...</p>
      ) : isError || !data?.resource ? (
        <p className="text-sm text-destructive">That resource couldn&apos;t be found.</p>
      ) : (
        <ResourceForm mode="edit" resourceId={id} initialResource={data.resource} />
      )}
    </AdminLayout>
  );
};

export default EditResourcePage;
