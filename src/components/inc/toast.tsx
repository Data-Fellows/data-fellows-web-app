import { useToast } from "@/context/ToastContext";

const toastTypeClasses = {
  success: "bg-primary text-primary-foreground",
  error: "bg-destructive text-destructive-foreground",
  info: "bg-accent text-accent-foreground",
};

export default function Toast() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 w-full max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-start justify-between rounded-md px-4 py-3 text-sm shadow-md ${
            toastTypeClasses[toast.type]
          }`}
        >
          <span className="flex-1 pr-3">{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            className="ml-2 text-xl font-bold leading-none"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
