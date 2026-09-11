import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FiArrowLeft } from "react-icons/fi";
import { z } from "zod";

const formSchema = z.object({
  email: z.string().trim().email("Enter a valid email"),
});

type FormValues = z.infer<typeof formSchema>;

const ForgotPasswordPage = () => {
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(formSchema) });

  const onSubmit = async (values: FormValues) => {
    setError(null);
    const supabase = createSupabaseBrowserClient();
    if (!supabase) {
      setError("Password reset isn't available right now.");
      return;
    }

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      values.email,
      { redirectTo: `${window.location.origin}/admin/reset-password` }
    );

    // Always show the same confirmation whether or not the email is a real
    // admin account, so this can't be used to probe which emails have access.
    if (resetError) {
      setError("Something went wrong. Try again in a moment.");
      return;
    }
    setSent(true);
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
          <h1 className="text-xl font-semibold text-foreground">Reset your password</h1>
          <p className="text-sm text-muted-foreground">
            Enter your admin email and we&apos;ll send a link to reset it.
          </p>
        </div>

        {sent ? (
          <div className="space-y-4 text-center">
            <p className="text-sm text-foreground">
              If that email has admin access, a reset link is on its way. Check
              your inbox.
            </p>
          </div>
        ) : (
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

            {error ? <p className="text-center text-sm text-destructive">{error}</p> : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-60"
            >
              {isSubmitting ? "Sending..." : "Send reset link"}
            </button>
          </form>
        )}

        <Link
          href="/admin/login"
          className="flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary"
        >
          <FiArrowLeft className="h-4 w-4" />
          Back to sign-in
        </Link>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
