import Link from "next/link";
import { useRouter } from "next/router";

export default function PublicUserProfilePage() {
  const router = useRouter();
  const { id } = router.query;

  // Minimal placeholder page for user public profiles.
  // Replace this with the real public profile view when available.
  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground px-4">
      <div className="max-w-3xl w-full text-center">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4">Public profile</h1>
        <p className="text-muted-foreground mb-6">
          This is the public profile page for user{" "}
          <strong>{String(id || "...")}</strong>.
        </p>
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => router.back()}
            className="px-4 py-2 rounded-md bg-primary text-primary-foreground"
          >
            Go back
          </button>
          <Link href="/" className="text-primary underline">
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
