import { deleteProblem, Problem } from "@/api/problems";
import { useToast } from "@/context/ToastContext";
import { useEffect, useState } from "react";
import { FiAlertTriangle, FiLoader, FiTrash2, FiX } from "react-icons/fi";

interface DeleteProblemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  problem: Problem | null;
}

export default function DeleteProblemModal({
  isOpen,
  onClose,
  onSuccess,
  problem,
}: DeleteProblemModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [confirmationText, setConfirmationText] = useState("");
  const { showToast } = useToast();

  // Reset confirmation text when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setConfirmationText("");
    }
  }, [isOpen]);

  const handleDelete = async () => {
    if (!problem) return;

    if (confirmationText.toLowerCase() !== "delete") {
      showToast("Please type 'delete' to confirm", "error");
      return;
    }

    setIsLoading(true);
    try {
      const response = await deleteProblem(problem._id);

      if (response.status === "OK") {
        showToast(
          response.message || "Problem deleted successfully!",
          "success"
        );
        onSuccess?.();
        handleClose();
      } else {
        showToast(response.message || "Failed to delete problem", "error");
      }
    } catch (error: any) {
      console.error("Error deleting problem:", error);
      showToast(
        error.response?.data?.message || "Failed to delete problem",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setConfirmationText("");
    onClose();
  };

  if (!isOpen || !problem) return null;

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      <div className="min-h-screen px-4 text-center">
        <div
          className="fixed inset-0 bg-black/60 transition-opacity"
          onClick={handleClose}
        />

        <span className="inline-block h-screen align-middle" aria-hidden="true">
          &#8203;
        </span>

        <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-background border border-border rounded-2xl shadow-2xl relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between pb-6 border-b border-border">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/20">
                <FiAlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-semibold text-foreground">
                  Delete Problem
                </h3>
                <p className="text-sm text-muted-foreground">
                  This action cannot be undone
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="flex items-center justify-center w-8 h-8 rounded-lg bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors"
            >
              <FiX className="w-4 h-4" />
            </button>
          </div>

          {/* Content */}
          <div className="py-6 space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium text-foreground mb-2">
                Problem Details:
              </h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>
                  <span className="font-medium">Field:</span>{" "}
                  {problem.fellowField}
                </p>
                <p>
                  <span className="font-medium">Type:</span>{" "}
                  {problem.type?.join(", ") || "N/A"}
                </p>
                <p>
                  <span className="font-medium">Salary:</span> $
                  {problem.payRange?.min?.toLocaleString()} - $
                  {problem.payRange?.max?.toLocaleString()}
                </p>
                <p>
                  <span className="font-medium">Skills:</span>{" "}
                  {problem.skills?.join(", ") || "N/A"}
                </p>
              </div>
            </div>

            <div className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-start">
                <FiAlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-red-800 dark:text-red-300 mb-1">
                    Warning
                  </h4>
                  <p className="text-sm text-red-700 dark:text-red-400">
                    Deleting this problem will permanently remove it from your
                    account. All associated applications and data will be lost.
                    This action cannot be undone.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Type "delete" to confirm
              </label>
              <input
                type="text"
                value={confirmationText}
                onChange={(e) => setConfirmationText(e.target.value)}
                placeholder="delete"
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-border">
            <button
              onClick={handleClose}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground border border-border rounded-lg hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={
                isLoading || confirmationText.toLowerCase() !== "delete"
              }
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <FiLoader className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <FiTrash2 className="w-4 h-4 mr-2" />
                  Delete Problem
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
