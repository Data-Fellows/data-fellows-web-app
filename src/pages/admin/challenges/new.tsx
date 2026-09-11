import AdminLayout from "@/layouts/admin-layout";
import ChallengeForm from "@/views/admin/challenges/challenge-form";

const NewChallengePage = () => (
  <AdminLayout>
    <ChallengeForm mode="create" />
  </AdminLayout>
);

export default NewChallengePage;
