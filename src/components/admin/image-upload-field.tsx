import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useState } from "react";
import { FiImage, FiLoader, FiX } from "react-icons/fi";

const uploadActivityImage = async (file: File) => {
  const supabase = createSupabaseBrowserClient();
  if (!supabase) {
    throw new Error("Supabase isn't configured.");
  }
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("activity-images").upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type,
  });
  if (error) {
    throw error;
  }
  const { data } = supabase.storage.from("activity-images").getPublicUrl(path);
  return data.publicUrl;
};

type ImageUploadFieldProps = {
  label: string;
  helpText?: string;
  value: string;
  onChange: (url: string) => void;
  error?: string;
};

// Uploads directly to Supabase Storage from the browser -- replaces the
// old "paste an image URL" text field so admins can just pick a file
// (e.g. a flyer already made in Canva) instead of hosting it somewhere
// else first.
const ImageUploadField = ({ label, helpText, value, onChange, error }: ImageUploadFieldProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setUploadError("Please choose an image file.");
      return;
    }
    setIsUploading(true);
    setUploadError(null);
    try {
      const url = await uploadActivityImage(file);
      onChange(url);
    } catch {
      setUploadError("Upload failed. Try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 text-sm font-medium text-foreground">
      <span>{label}</span>
      {value ? (
        <div className="relative overflow-hidden rounded-2xl border border-border">
          {/* eslint-disable-next-line @next/next/no-img-element -- arbitrary uploaded-image URL, not worth allowlisting a Supabase Storage domain for next/image */}
          <img src={value} alt="" className="aspect-video w-full object-cover" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-background/90 px-3 py-1.5 text-xs font-semibold text-foreground shadow"
          >
            <FiX className="h-3.5 w-3.5" />
            Remove
          </button>
        </div>
      ) : (
        <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-background px-4 py-8 text-center text-sm text-muted-foreground transition hover:border-primary/40">
          {isUploading ? (
            <>
              <FiLoader className="h-5 w-5 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <FiImage className="h-5 w-5" />
              Click to upload an image
            </>
          )}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={isUploading}
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
        </label>
      )}
      {error || uploadError ? (
        <span className="text-xs text-destructive">{error || uploadError}</span>
      ) : helpText ? (
        <span className="text-xs text-muted-foreground">{helpText}</span>
      ) : null}
    </div>
  );
};

export default ImageUploadField;
