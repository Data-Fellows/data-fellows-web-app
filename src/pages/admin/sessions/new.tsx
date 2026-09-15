import AdminLayout from "@/layouts/admin-layout";
import SessionForm from "@/views/admin/sessions/session-form";

const NewSessionPage = () => (
  <AdminLayout>
    <SessionForm mode="create" />
  </AdminLayout>
);

export default NewSessionPage;
