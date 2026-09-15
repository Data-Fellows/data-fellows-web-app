import type { Session } from "@/types/session";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FiTrash2 } from "react-icons/fi";
import { z } from "zod";

const formSchema = z.object({
  title: z.string().trim().min(1, "Required"),
  description: z.string().trim().optional(),
  session_date: z.string().trim().min(1, "Required"),
  registration_url: z.string().trim().optional(),
  status: z.enum(["draft", "published", "archived"]),
});

type FormValues = z.infer<typeof formSchema>;

const inputClass =
  "w-full rounded-full border border-border bg-background px-4 h-11 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30";
const textareaClass =
  "w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30";
const labelClass = "flex flex-col gap-2 text-sm font-medium text-foreground";

const toFormValues = (session?: Session): FormValues => ({
  title: session?.title ?? "",
  description: session?.description ?? "",
  session_date: session?.session_date ?? "",
  registration_url: session?.registration_url ?? "",
  status: session?.status ?? "draft",
});

const saveSession = async (mode: "create" | "edit", id: string | undefined, values: FormValues) => {
  const url = mode === "create" ? "/api/admin/sessions" : `/api/admin/sessions/${id}`;
  const method = mode === "create" ? "POST" : "PUT";
  const response = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });
  const body = await response.json();
  if (!response.ok) {
    throw new Error(body.error || "Something went wrong. Try again.");
  }
  return body;
};

const deleteSession = async (id: string) => {
  const response = await fetch(`/api/admin/sessions/${id}`, { method: "DELETE" });
  const body = await response.json();
  if (!response.ok) {
    throw new Error(body.error || "Failed to delete the session.");
  }
};

type SessionFormProps = {
  mode: "create" | "edit";
  sessionId?: string;
  initialSession?: Session;
};

const SessionForm = ({ mode, sessionId, initialSession }: SessionFormProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: toFormValues(initialSession),
  });

  const saveMutation = useMutation({
    mutationFn: (values: FormValues) => saveSession(mode, sessionId, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-sessions"] });
      router.push("/admin/sessions");
    },
    onError: (error: Error) => setFormError(error.message),
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteSession(sessionId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-sessions"] });
      router.push("/admin/sessions");
    },
    onError: (error: Error) => setFormError(error.message),
  });

  const onSubmit = (values: FormValues) => {
    setFormError(null);
    saveMutation.mutate(values);
  };

  const handleDelete = () => {
    if (!sessionId) return;
    if (!window.confirm("Delete this session? This can't be undone.")) return;
    deleteMutation.mutate();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">
          {mode === "create" ? "New session" : "Edit session"}
        </h1>
        {mode === "edit" ? (
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="inline-flex items-center gap-2 rounded-full border border-destructive/30 px-4 py-2 text-sm font-semibold text-destructive transition hover:bg-destructive/10 disabled:opacity-60"
          >
            <FiTrash2 className="h-4 w-4" />
            {deleteMutation.isPending ? "Deleting..." : "Delete"}
          </button>
        ) : null}
      </div>

      <div className="space-y-5 rounded-3xl border border-primary/10 bg-background px-6 py-6">
        <label className={labelClass}>
          Title
          <input
            {...register("title")}
            className={inputClass}
            placeholder="Fireside: Jane Doe -- Building a career in data"
          />
          {errors.title ? (
            <span className="text-xs text-destructive">{errors.title.message}</span>
          ) : null}
        </label>

        <label className={labelClass}>
          Description (optional)
          <textarea
            {...register("description")}
            rows={3}
            className={textareaClass}
            placeholder="Who's speaking and what it's about"
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className={labelClass}>
            Date
            <input type="date" {...register("session_date")} className={inputClass} />
            {errors.session_date ? (
              <span className="text-xs text-destructive">{errors.session_date.message}</span>
            ) : null}
          </label>
          <label className={labelClass}>
            Status
            <select {...register("status")} className={inputClass}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </label>
        </div>

        <label className={labelClass}>
          Registration / watch link
          <input
            {...register("registration_url")}
            className={inputClass}
            placeholder="https://..."
          />
          <span className="text-xs text-muted-foreground">
            Where "Register" on the Activities page sends people -- your sign-up form, or the
            YouTube link once you have it.
          </span>
        </label>
      </div>

      {formError ? <p className="text-center text-sm text-destructive">{formError}</p> : null}

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => router.push("/admin/sessions")}
          className="rounded-full border border-border px-6 py-2.5 text-sm font-semibold text-foreground transition hover:border-primary/40"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting || saveMutation.isPending}
          className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-60"
        >
          {saveMutation.isPending ? "Saving..." : "Save session"}
        </button>
      </div>
    </form>
  );
};

export default SessionForm;
