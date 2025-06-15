import { useToast } from "@/context/ToastContext";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, Info, X, XCircle } from "lucide-react";

const toastTypeClasses = {
  success: {
    base: "bg-primary text-primary-foreground",
    icon: <CheckCircle className="w-5 h-5 text-primary-foreground" />,
  },
  error: {
    base: "bg-destructive text-destructive-foreground",
    icon: <XCircle className="w-5 h-5 text-destructive-foreground" />,
  },
  info: {
    base: "bg-accent text-accent-foreground",
    icon: <Info className="w-5 h-5 text-accent-foreground" />,
  },
};

export default function Toast() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 w-full max-w-sm">
      <AnimatePresence>
        {toasts.map((toast) => {
          const { base, icon } =
            toastTypeClasses[toast.type] || toastTypeClasses.info;

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`flex items-start justify-between rounded-lg px-4 py-3 text-sm shadow-lg border border-border ${base}`}
            >
              <div className="flex items-start space-x-3 flex-1">
                {icon}
                <span>{toast.message}</span>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="ml-4 text-lg font-bold leading-none hover:opacity-75 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
