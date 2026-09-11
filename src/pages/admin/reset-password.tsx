import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z
  .object({
    password: z.string().min(8, "At least 8 characters"),
    confirmPassword: z.string().min(1, "Confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof formSchema>;

// The emailed reset link lands here with a code Supabase's browser client
// exchanges for a temporary session automatically on load. We just wait for
// that to happen (or time out) before showing the "set a new password" form.
const ResetPasswordPage = () => {
  const router = useRouter();
  const [status, setStatus] = useState<"checking" | "ready" | "invalid">("checking");
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(formSchema) });

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    if (!supabase) {
      setStatus("invalid");
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setStatus("ready");
    });

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || (event === "SIGNED_IN" && session)) {
        setStatus("ready");
      }
    });

    const timeout = setTimeout(() => {
      setStatus((current) => (current === "checking" ? "invalid" : current));
    }, 4000);

    return () => {
      listener.subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  const onSubmit = async (values: FormValues) => {
    setError(null);
    const supabase = createSupabaseBrowserClient();
    if (!supabase) {
      setError("Password reset isn't available right now.");
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password: values.password,
    });
    if (updateError) {
      setError("Couldn't update your password. Try requesting a new reset link.");
      return;
    }

    router.push("/admin/challenges");
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
          <h1 className="text-xl font-semibold text-foreground">Set a new password</h1>
        </div>

        {status === "checking" ? (
          <p className="text-center text-sm text-muted-foreground">
            Verifying your reset link...
          </p>
        ) : status === "invalid" ? (
          <div className="space-y-4 text-center">
            <p className="text-sm text-destructive">
              This reset link is invalid or has expired.
            </p>
            <Link
              href="/admin/forgot-password"
              className="text-sm font-semibold text-primary hover:underline"
            >
              Request a new one
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <label className="flex flex-col gap-2 text-sm font-medium text-foreground">
              New password
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

            <label className="flex flex-col gap-2 text-sm font-medium text-foreground">
              Confirm password
              <input
                type="password"
                {...register("confirmPassword")}
                className="h-11 rounded-full border border-border bg-background px-4 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
                placeholder="********"
              />
              {errors.confirmPassword ? (
                <span className="text-xs text-destructive">
                  {errors.confirmPassword.message}
                </span>
              ) : null}
            </label>

            {error ? <p className="text-center text-sm text-destructive">{error}</p> : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-60"
            >
              {isSubmitting ? "Saving..." : "Set new password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordPage;
