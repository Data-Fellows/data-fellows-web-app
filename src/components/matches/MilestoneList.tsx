import { Milestone } from "@/api/match-communication";
import { getUser } from "@/helpers";
import {
  useCompleteMilestone,
  useCreateMilestone,
  useMatchMilestones,
} from "@/hooks/useMatchCommunication";
import {
  Calendar,
  Check,
  CheckCircle,
  Circle,
  Clock,
  DollarSign,
  Plus,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { FiLoader } from "react-icons/fi";

interface MilestoneListProps {
  matchId: string;
  isEmployer: boolean;
}

export function MilestoneList({ matchId, isEmployer }: MilestoneListProps) {
  // React Query hooks
  const { milestones, isLoading: loading, error } = useMatchMilestones(matchId);
  const createMilestoneMutation = useCreateMilestone(matchId);
  const completeMilestoneMutation = useCompleteMilestone(matchId);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newMilestone, setNewMilestone] = useState({
    title: "",
    description: "",
    dueDate: "",
    amount: "",
  });
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const user = getUser();
    setCurrentUser(user);
  }, []);

  const handleCreateMilestone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !newMilestone.title.trim() ||
      !newMilestone.dueDate ||
      !newMilestone.amount
    )
      return;

    try {
      await createMilestoneMutation.mutateAsync({
        title: newMilestone.title.trim(),
        description: newMilestone.description.trim(),
        dueDate: newMilestone.dueDate,
        amount: parseFloat(newMilestone.amount),
      });

      setNewMilestone({ title: "", description: "", dueDate: "", amount: "" });
      setShowAddForm(false);
    } catch (error) {
      console.error("Error creating milestone:", error);
    }
  };

  const handleCompleteMilestone = async (milestoneId: string) => {
    try {
      await completeMilestoneMutation.mutateAsync(milestoneId);
    } catch (error) {
      console.error("Error completing milestone:", error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString([], {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString()}`;
  };

  const getStatusColor = (status: Milestone["status"]) => {
    switch (status) {
      case "completed":
        return "text-green-600 bg-green-50 border-green-200";
      case "in_progress":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "overdue":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getStatusIcon = (status: Milestone["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "in_progress":
        return <Clock className="h-4 w-4 text-blue-600" />;
      case "overdue":
        return <X className="h-4 w-4 text-red-600" />;
      default:
        return <Circle className="h-4 w-4 text-gray-600" />;
    }
  };

  const totalAmount = milestones.reduce(
    (sum, milestone) => sum + milestone.amount,
    0
  );
  const completedAmount = milestones
    .filter((m) => m.status === "completed")
    .reduce((sum, milestone) => sum + milestone.amount, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex items-center gap-2 text-muted-foreground">
          <FiLoader className="h-5 w-5 animate-spin" />
          Loading milestones...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <X className="h-8 w-8 text-red-500" />
          </div>
          <h3 className="font-semibold text-foreground mb-2">
            Failed to load milestones
          </h3>
          <p className="text-sm text-muted-foreground">
            There was an error loading the milestones. Please try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Summary */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">
            Project Progress
          </h3>
          {isEmployer && (
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add Milestone
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">
              {milestones.filter((m) => m.status === "completed").length}
            </div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">
              {milestones.filter((m) => m.status === "in_progress").length}
            </div>
            <div className="text-sm text-muted-foreground">In Progress</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">
              {formatCurrency(completedAmount)}
            </div>
            <div className="text-sm text-muted-foreground">
              of {formatCurrency(totalAmount)} earned
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Progress</span>
            <span>
              {milestones.length > 0
                ? Math.round(
                    (milestones.filter((m) => m.status === "completed").length /
                      milestones.length) *
                      100
                  )
                : 0}
              %
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{
                width:
                  milestones.length > 0
                    ? `${
                        (milestones.filter((m) => m.status === "completed")
                          .length /
                          milestones.length) *
                        100
                      }%`
                    : "0%",
              }}
            />
          </div>
        </div>
      </div>

      {/* Add Milestone Form */}
      {showAddForm && (
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">
              Add New Milestone
            </h3>
            <button
              onClick={() => setShowAddForm(false)}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleCreateMilestone} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Title *
              </label>
              <input
                type="text"
                value={newMilestone.title}
                onChange={(e) =>
                  setNewMilestone((prev) => ({
                    ...prev,
                    title: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground"
                placeholder="e.g., Complete wireframes"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Description
              </label>
              <textarea
                value={newMilestone.description}
                onChange={(e) =>
                  setNewMilestone((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground"
                placeholder="Describe what needs to be completed"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Due Date *
                </label>
                <input
                  type="date"
                  value={newMilestone.dueDate}
                  onChange={(e) =>
                    setNewMilestone((prev) => ({
                      ...prev,
                      dueDate: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Amount ($) *
                </label>
                <input
                  type="number"
                  value={newMilestone.amount}
                  onChange={(e) =>
                    setNewMilestone((prev) => ({
                      ...prev,
                      amount: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 border border-border text-muted-foreground rounded-lg hover:bg-muted/10 transition-colors"
                disabled={createMilestoneMutation.isPending}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createMilestoneMutation.isPending}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {createMilestoneMutation.isPending ? (
                  <div className="flex items-center gap-2">
                    <FiLoader className="h-4 w-4 animate-spin" />
                    Creating...
                  </div>
                ) : (
                  "Create Milestone"
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Milestones List */}
      <div className="space-y-4">
        {milestones.length === 0 ? (
          <div className="text-center py-12">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">
              No milestones yet
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {isEmployer
                ? "Create milestones to track project progress and payments."
                : "Milestones will appear here once the employer creates them."}
            </p>
            {isEmployer && (
              <button
                onClick={() => setShowAddForm(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Create First Milestone
              </button>
            )}
          </div>
        ) : (
          milestones.map((milestone) => (
            <div
              key={milestone._id}
              className="bg-card border border-border rounded-lg p-6 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    {getStatusIcon(milestone.status)}
                    <h3 className="font-semibold text-foreground">
                      {milestone.title}
                    </h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                        milestone.status
                      )}`}
                    >
                      {milestone.status.replace("_", " ")}
                    </span>
                  </div>

                  {milestone.description && (
                    <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                      {milestone.description}
                    </p>
                  )}

                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Due: {formatDate(milestone.dueDate)}
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      {formatCurrency(milestone.amount)}
                    </div>
                    {milestone.completedAt && (
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-600" />
                        Completed: {formatDate(milestone.completedAt)}
                      </div>
                    )}
                  </div>
                </div>

                {milestone.status === "pending" && !isEmployer && (
                  <button
                    onClick={() => handleCompleteMilestone(milestone._id)}
                    disabled={completeMilestoneMutation.isPending}
                    className="ml-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                  >
                    {completeMilestoneMutation.isPending ? (
                      <>
                        <FiLoader className="h-4 w-4 animate-spin" />
                        Completing...
                      </>
                    ) : (
                      "Mark Complete"
                    )}
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default MilestoneList;
