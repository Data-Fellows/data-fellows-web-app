import AdminLayout from "@/layouts/admin-layout";
import ResourceForm from "@/views/admin/resources/resource-form";

const NewResourcePage = () => (
  <AdminLayout>
    <ResourceForm mode="create" />
  </AdminLayout>
);

export default NewResourcePage;
