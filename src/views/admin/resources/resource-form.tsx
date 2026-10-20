import ImageUploadField from "@/components/admin/image-upload-field";
import type { Resource } from "@/types/resource";
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
  category: z.enum(["Story", "Guide", "Lesson"]),
  href: z.string().trim().url("Enter a valid URL, e.g. https://example.com"),
  image_url: z
    .string()
    .trim()
    .url("Enter a valid URL, e.g. https://example.com")
    .optional()
    .or(z.literal("")),
  published_date: z.string().trim().optional().or(z.literal("")),
  status: z.enum(["draft", "published", "archived"]),
});

type FormValues = z.infer<typeof formSchema>;

const inputClass =
  "w-full rounded-full border border-border bg-background px-4 h-11 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30";
const textareaClass =
  "w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30";
const labelClass = "flex flex-col gap-2 text-sm font-medium text-foreground";

const toFormValues = (resource?: Resource): FormValues => ({
  title: resource?.title ?? "",
  description: resource?.description ?? "",
  category: resource?.category ?? "Lesson",
  href: resource?.href ?? "",
  image_url: resource?.image_url ?? "",
  published_date: resource?.published_date ?? "",
  status: resource?.status ?? "draft",
});

const saveResource = async (mode: "create" | "edit", id: string | undefined, values: FormValues) => {
  const url = mode === "create" ? "/api/admin/resources" : `/api/admin/resources/${id}`;
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

const deleteResource = async (id: string) => {
  const response = await fetch(`/api/admin/resources/${id}`, { method: "DELETE" });
  const body = await response.json();
  if (!response.ok) {
    throw new Error(body.error || "Failed to delete the resource.");
  }
};

type ResourceFormProps = {
  mode: "create" | "edit";
  resourceId?: string;
  initialResource?: Resource;
};

const ResourceForm = ({ mode, resourceId, initialResource }: ResourceFormProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: toFormValues(initialResource),
  });

  const saveMutation = useMutation({
    mutationFn: (values: FormValues) => saveResource(mode, resourceId, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-resources"] });
      router.push("/admin/resources");
    },
    onError: (error: Error) => setFormError(error.message),
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteResource(resourceId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-resources"] });
      router.push("/admin/resources");
    },
    onError: (error: Error) => setFormError(error.message),
  });

  const onSubmit = (values: FormValues) => {
    setFormError(null);
    saveMutation.mutate(values);
  };

  const handleDelete = () => {
    if (!resourceId) return;
    if (!window.confirm("Delete this resource? This can't be undone.")) return;
    deleteMutation.mutate();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">
          {mode === "create" ? "New resource" : "Edit resource"}
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
            placeholder="How we run Sunday Catchup"
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
            placeholder="One or two sentences shown on the card"
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className={labelClass}>
            Type
            <select {...register("category")} className={inputClass}>
              <option value="Story">Story</option>
              <option value="Guide">Guide</option>
              <option value="Lesson">Lesson</option>
            </select>
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
          Link
          <input
            {...register("href")}
            className={inputClass}
            placeholder="https://..."
          />
          {errors.href ? (
            <span className="text-xs text-destructive">{errors.href.message}</span>
          ) : (
            <span className="text-xs text-muted-foreground">
              Where "Open" sends people -- the article, video, or post itself.
            </span>
          )}
        </label>

        <label className={labelClass}>
          Published date (optional)
          <input type="date" {...register("published_date")} className={inputClass} />
          {errors.published_date ? (
            <span className="text-xs text-destructive">{errors.published_date.message}</span>
          ) : (
            <span className="text-xs text-muted-foreground">
              Shown on the card and used to order the resources list. Leave blank to hide the date.
            </span>
          )}
        </label>

        <ImageUploadField
          label="Thumbnail image"
          value={watch("image_url") ?? ""}
          onChange={(url) => setValue("image_url", url, { shouldDirty: true })}
          error={errors.image_url?.message}
          helpText="Shown on the resource card. Leave blank for a plain text card."
        />
      </div>

      {formError ? <p className="text-center text-sm text-destructive">{formError}</p> : null}

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => router.push("/admin/resources")}
          className="rounded-full border border-border px-6 py-2.5 text-sm font-semibold text-foreground transition hover:border-primary/40"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting || saveMutation.isPending}
          className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-60"
        >
          {saveMutation.isPending ? "Saving..." : "Save resource"}
        </button>
      </div>
    </form>
  );
};

export default ResourceForm;
