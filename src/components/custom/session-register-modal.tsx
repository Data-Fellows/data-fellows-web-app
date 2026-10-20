import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { MouseEvent, useEffect } from "react";
import { useForm } from "react-hook-form";
import { FiCheckCircle, FiX } from "react-icons/fi";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().trim().min(1, "Enter your name"),
  email: z.string().trim().email("Enter a valid email"),
  company: z.string().max(0).optional(),
});

type FormValues = z.infer<typeof formSchema>;

const submitRegistration = async (sessionId: string, values: FormValues) => {
  const response = await fetch(`/api/sessions/${sessionId}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });
  const body = (await response.json()) as { success: boolean; error?: string };
  if (!response.ok || !body.success) {
    throw new Error(body.error || "Something went wrong. Try again.");
  }
  return body;
};

type SessionRegisterModalProps = {
  session: { id: string; title: string } | null;
  onClose: () => void;
};

const SessionRegisterModal = ({ session, onClose }: SessionRegisterModalProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", company: "" },
  });

  const mutation = useMutation({
    mutationFn: (values: FormValues) => submitRegistration(session!.id, values),
  });

  // Reset to a clean form (including the success state) whenever a
  // different session's modal opens, rather than showing a stale
  // "You're registered" screen from the last session someone registered
  // for.
  useEffect(() => {
    if (session) {
      reset({ name: "", email: "", company: "" });
      mutation.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.id]);

  useEffect(() => {
    if (!session) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    const { body } = document;
    const originalOverflow = body.style.overflow;
    body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      body.style.overflow = originalOverflow;
    };
  }, [session, onClose]);

  if (!session) {
    return null;
  }

  const stopPropagation = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Register for ${session.title}`}
    >
      <div
        className="relative w-full max-w-md rounded-3xl border border-primary/10 bg-background p-6 shadow-2xl sm:p-8"
        onClick={stopPropagation}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground transition hover:bg-muted"
          aria-label="Close registration form"
        >
          <FiX className="h-4 w-4" />
        </button>

        {mutation.isSuccess ? (
          <div className="pt-4 text-center">
            <FiCheckCircle className="mx-auto mb-3 h-8 w-8 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">You&apos;re registered!</h2>
            <p className="mx-auto mt-2 max-w-xs text-sm text-muted-foreground">
              We&apos;ll see you at {session.title}.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit((values) => mutation.mutate(values))}
            className="space-y-4 pt-2"
          >
            <div>
              <h2 className="text-lg font-semibold text-foreground">Register</h2>
              <p className="text-sm text-muted-foreground">{session.title}</p>
            </div>

            <input
              type="text"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="absolute left-[-9999px] h-0 w-0 opacity-0"
              {...register("company")}
            />

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Name
              </label>
              <input
                {...register("name")}
                className="w-full rounded-full border border-primary/20 bg-background px-4 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
                placeholder="Your name"
              />
              {errors.name ? (
                <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>
              ) : null}
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Email
              </label>
              <input
                type="email"
                {...register("email")}
                className="w-full rounded-full border border-primary/20 bg-background px-4 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
                placeholder="you@email.com"
              />
              {errors.email ? (
                <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>
              ) : null}
            </div>

            {mutation.isError ? (
              <p className="text-sm text-destructive">{(mutation.error as Error).message}</p>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting || mutation.isPending}
              className="w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-60"
            >
              {mutation.isPending ? "Registering..." : "Register"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default SessionRegisterModal;
