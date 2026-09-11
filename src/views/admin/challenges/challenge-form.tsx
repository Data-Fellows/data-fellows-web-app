import type { ChallengeWithDays } from "@/types/challenge";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import { z } from "zod";

const dayFormSchema = z.object({
  id: z.string().optional(),
  title: z.string().trim().min(1, "Required"),
  lesson_url: z.string().trim().optional(),
  summary: z.string().trim().optional(),
});

const challengeFormSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1, "Required")
    .regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers, and hyphens only"),
  title: z.string().trim().min(1, "Required"),
  subtitle: z.string().trim().optional(),
  description: z.string().trim().optional(),
  start_date: z.string().trim().min(1, "Required"),
  end_date: z.string().trim().min(1, "Required"),
  daily_commitment: z.string().trim().optional(),
  member_target: z.string().trim().optional(),
  status: z.enum(["draft", "published", "archived"]),
  cta_join_label: z.string().trim().optional(),
  cta_join_href: z.string().trim().optional(),
  partner_name: z.string().trim().optional(),
  days: z.array(dayFormSchema).min(1, "Add at least one day"),
});

type FormValues = z.infer<typeof challengeFormSchema>;

const inputClass =
  "w-full rounded-full border border-border bg-background px-4 h-11 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30";
const textareaClass =
  "w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30";
const labelClass = "flex flex-col gap-2 text-sm font-medium text-foreground";

const toFormValues = (challenge?: ChallengeWithDays): FormValues => ({
  slug: challenge?.slug ?? "",
  title: challenge?.title ?? "",
  subtitle: challenge?.subtitle ?? "",
  description: challenge?.description ?? "",
  start_date: challenge?.start_date ?? "",
  end_date: challenge?.end_date ?? "",
  daily_commitment: challenge?.daily_commitment ?? "",
  member_target: challenge?.member_target ? String(challenge.member_target) : "",
  status: challenge?.status ?? "draft",
  cta_join_label: challenge?.cta_join_label ?? "",
  cta_join_href: challenge?.cta_join_href ?? "",
  partner_name: challenge?.partner_name ?? "",
  days:
    challenge?.challenge_days && challenge.challenge_days.length > 0
      ? challenge.challenge_days.map((day) => ({
          id: day.id,
          title: day.title,
          lesson_url: day.lesson_url ?? "",
          summary: day.summary ?? "",
        }))
      : [{ title: "", lesson_url: "", summary: "" }],
});

type SavePayload = Omit<FormValues, "member_target"> & {
  member_target: number | null;
};

const buildPayload = (values: FormValues): SavePayload => ({
  ...values,
  member_target: values.member_target ? Number(values.member_target) : null,
});

const saveChallenge = async (
  mode: "create" | "edit",
  id: string | undefined,
  payload: SavePayload
) => {
  const url = mode === "create" ? "/api/admin/challenges" : `/api/admin/challenges/${id}`;
  const method = mode === "create" ? "POST" : "PUT";
  const response = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const body = await response.json();
  if (!response.ok) {
    throw new Error(body.error || "Something went wrong. Try again.");
  }
  return body;
};

const deleteChallenge = async (id: string) => {
  const response = await fetch(`/api/admin/challenges/${id}`, { method: "DELETE" });
  const body = await response.json();
  if (!response.ok) {
    throw new Error(body.error || "Failed to delete the challenge.");
  }
};

type ChallengeFormProps = {
  mode: "create" | "edit";
  challengeId?: string;
  initialChallenge?: ChallengeWithDays;
};

const ChallengeForm = ({ mode, challengeId, initialChallenge }: ChallengeFormProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(challengeFormSchema),
    defaultValues: toFormValues(initialChallenge),
  });

  const { fields, append, remove } = useFieldArray({ control, name: "days" });

  const saveMutation = useMutation({
    mutationFn: (values: FormValues) => saveChallenge(mode, challengeId, buildPayload(values)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-challenges"] });
      router.push("/admin/challenges");
    },
    onError: (error: Error) => setFormError(error.message),
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteChallenge(challengeId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-challenges"] });
      router.push("/admin/challenges");
    },
    onError: (error: Error) => setFormError(error.message),
  });

  const onSubmit = (values: FormValues) => {
    setFormError(null);
    saveMutation.mutate(values);
  };

  const handleDelete = () => {
    if (!challengeId) return;
    if (!window.confirm("Delete this challenge? This can't be undone.")) return;
    deleteMutation.mutate();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">
          {mode === "create" ? "New challenge" : "Edit challenge"}
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
        <div className="grid gap-4 sm:grid-cols-2">
          <label className={labelClass}>
            Title
            <input {...register("title")} className={inputClass} placeholder="Claude 101 Challenge" />
            {errors.title ? <span className="text-xs text-destructive">{errors.title.message}</span> : null}
          </label>
          <label className={labelClass}>
            Slug
            <input {...register("slug")} className={inputClass} placeholder="claude-101" />
            {errors.slug ? (
              <span className="text-xs text-destructive">{errors.slug.message}</span>
            ) : (
              <span className="text-xs text-muted-foreground">
                Used in the URL -- changing it breaks old links.
              </span>
            )}
          </label>
        </div>

        <label className={labelClass}>
          Subtitle
          <input {...register("subtitle")} className={inputClass} placeholder="A one-line hook" />
        </label>

        <label className={labelClass}>
          Description
          <textarea {...register("description")} rows={3} className={textareaClass} />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className={labelClass}>
            Start date
            <input type="date" {...register("start_date")} className={inputClass} />
            {errors.start_date ? (
              <span className="text-xs text-destructive">{errors.start_date.message}</span>
            ) : null}
          </label>
          <label className={labelClass}>
            End date
            <input type="date" {...register("end_date")} className={inputClass} />
            {errors.end_date ? (
              <span className="text-xs text-destructive">{errors.end_date.message}</span>
            ) : null}
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <label className={labelClass}>
            Daily commitment
            <input {...register("daily_commitment")} className={inputClass} placeholder="20-30 min" />
          </label>
          <label className={labelClass}>
            Member target
            <input
              type="number"
              min={1}
              {...register("member_target")}
              className={inputClass}
              placeholder="Optional"
            />
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

        <div className="grid gap-4 sm:grid-cols-2">
          <label className={labelClass}>
            Join button label
            <input {...register("cta_join_label")} className={inputClass} placeholder="Join the Challenge" />
          </label>
          <label className={labelClass}>
            Join button link
            <input {...register("cta_join_href")} className={inputClass} placeholder="https://..." />
          </label>
        </div>

        <label className={labelClass}>
          Partner name (optional)
          <input
            {...register("partner_name")}
            className={inputClass}
            placeholder="Shown on the certificate as 'Powered by ...'"
          />
        </label>
      </div>

      <div className="space-y-4 rounded-3xl border border-primary/10 bg-background px-6 py-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Days</h2>
          <button
            type="button"
            onClick={() => append({ title: "", lesson_url: "", summary: "" })}
            className="inline-flex items-center gap-2 rounded-full border border-primary/20 px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary/10"
          >
            <FiPlus className="h-4 w-4" />
            Add day
          </button>
        </div>
        {errors.days?.message ? (
          <p className="text-xs text-destructive">{errors.days.message}</p>
        ) : null}

        <div className="space-y-4">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="space-y-3 rounded-2xl border border-primary/10 bg-secondary/10 px-5 py-4"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                  Day {index + 1}
                </p>
                {fields.length > 1 ? (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    aria-label={`Remove day ${index + 1}`}
                    className="text-muted-foreground transition hover:text-destructive"
                  >
                    <FiTrash2 className="h-4 w-4" />
                  </button>
                ) : null}
              </div>
              <label className={labelClass}>
                Title
                <input
                  {...register(`days.${index}.title` as const)}
                  className={inputClass}
                  placeholder="Meet Claude"
                />
                {errors.days?.[index]?.title ? (
                  <span className="text-xs text-destructive">
                    {errors.days[index]?.title?.message}
                  </span>
                ) : null}
              </label>
              <label className={labelClass}>
                Lesson link (optional)
                <input
                  {...register(`days.${index}.lesson_url` as const)}
                  className={inputClass}
                  placeholder="https://..."
                />
              </label>
              <label className={labelClass}>
                Summary (optional)
                <textarea
                  {...register(`days.${index}.summary` as const)}
                  rows={2}
                  className={textareaClass}
                />
              </label>
            </div>
          ))}
        </div>
      </div>

      {formError ? <p className="text-center text-sm text-destructive">{formError}</p> : null}

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => router.push("/admin/challenges")}
          className="rounded-full border border-border px-6 py-2.5 text-sm font-semibold text-foreground transition hover:border-primary/40"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting || saveMutation.isPending}
          className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-60"
        >
          {saveMutation.isPending ? "Saving..." : "Save challenge"}
        </button>
      </div>
    </form>
  );
};

export default ChallengeForm;
