import type { GetServerSideProps } from "next";

const AdminIndexPage = () => null;

export const getServerSideProps: GetServerSideProps = async () => ({
  redirect: { destination: "/admin/challenges", permanent: false },
});

export default AdminIndexPage;
