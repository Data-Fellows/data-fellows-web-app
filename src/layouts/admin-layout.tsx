import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import type { ReactNode } from "react";
import { FiLogOut } from "react-icons/fi";

const AdminLayout = ({ children }: { children: ReactNode }) => {
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createSupabaseBrowserClient();
    await supabase?.auth.signOut();
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/admin/challenges" className="flex items-center gap-3">
            <Image
              src="/svgs/data-fellow.svg"
              alt="Data Fellows"
              width={36}
              height={36}
              className="h-9 w-9"
            />
            <span className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Admin
            </span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link
              href="/admin/challenges"
              className="text-sm font-medium text-foreground hover:text-primary"
            >
              Challenges
            </Link>
            <Link
              href="/admin/sessions"
              className="text-sm font-medium text-foreground hover:text-primary"
            >
              Sessions
            </Link>
            <button
              type="button"
              onClick={handleSignOut}
              className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground transition hover:border-primary/40"
            >
              <FiLogOut className="h-4 w-4" />
              Sign out
            </button>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">{children}</main>
    </div>
  );
};

export default AdminLayout;
