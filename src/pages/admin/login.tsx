import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  email: z.string().trim().email("Enter a valid email"),
  password: z.string().min(1, "Enter your password"),
});

type FormValues = z.infer<typeof formSchema>;

const AdminLoginPage = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(formSchema) });

  const onSubmit = async (values: FormValues) => {
    setError(null);
    const supabase = createSupabaseBrowserClient();
    if (!supabase) {
      setError("Admin sign-in isn't available right now.");
      return;
    }

    const { error: signInError } = await supabase.auth.signInWithPassword(values);
    if (signInError) {
      setError("Incorrect email or password.");
      return;
    }

    const next =
      typeof router.query.next === "string" ? router.query.next : "/admin/challenges";
    router.push(next);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-6 rounded-3xl border border-primary/10 bg-background px-8 py-10">
        <div className="flex flex-col items-center gap-3 text-center">
          <Image
            src="/svgs/data-fellow.svg"
            alt="Data Fellows"
            width={48}
            height={48}
            className="h-12 w-12"
          />
          <h1 className="text-xl font-semibold text-foreground">Admin sign-in</h1>
          <p className="text-sm text-muted-foreground">Staff access only.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <label className="flex flex-col gap-2 text-sm font-medium text-foreground">
            Email
            <input
              type="email"
              {...register("email")}
              className="h-11 rounded-full border border-border bg-background px-4 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
              placeholder="you@datafellowsai.com"
            />
            {errors.email ? (
              <span className="text-xs text-destructive">{errors.email.message}</span>
            ) : null}
          </label>

          <label className="flex flex-col gap-2 text-sm font-medium text-foreground">
            Password
            <input
              type="password"
              {...register("password")}
              className="h-11 rounded-full border border-border bg-background px-4 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
              placeholder="********"
            />
            {errors.password ? (
              <span className="text-xs text-destructive">{errors.password.message}</span>
            ) : null}
          </label>

          {error ? <p className="text-center text-sm text-destructive">{error}</p> : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-60"
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;
