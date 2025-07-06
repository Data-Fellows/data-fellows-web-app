import {
  acceptApplicant,
  Applicant,
  getEmployerProblems,
  getProblemApplicants,
  Problem,
  ProblemsParams,
  rejectApplicant,
  shortlistApplicant,
  updateProblem,
} from "@/api/problems";
import DeleteProblemModal from "@/components/modals/DeleteProblemModal";
import EditProblemModal from "@/components/modals/EditProblemModal";
import { usePostProblemModal } from "@/context/PostProblemModalContext";
import { useToast } from "@/context/ToastContext";
import { getUser } from "@/helpers";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import {
  FiBriefcase,
  FiCalendar,
  FiCheck,
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiDollarSign,
  FiDownload,
  FiEdit3,
  FiExternalLink,
  FiEye,
  FiFilter,
  FiGrid,
  FiList,
  FiMail,
  FiMapPin,
  FiPhone,
  FiPlus,
  FiSearch,
  FiTrash2,
  FiUsers,
  FiX,
} from "react-icons/fi";

// Skeleton loader component
const SkeletonCard = () => (
  <div className="bg-card border border-border rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-lg animate-pulse touch-manipulation">
    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
      <div className="flex-1 min-w-0">
        <div className="h-5 sm:h-6 md:h-7 lg:h-8 bg-muted rounded-lg w-4/5 sm:w-2/3 mb-2 sm:mb-3"></div>
        <div className="h-3 sm:h-4 md:h-5 bg-muted rounded w-3/5 sm:w-1/2 mb-2"></div>
        <div className="h-3 sm:h-4 md:h-5 bg-muted rounded w-2/5 sm:w-1/3"></div>
      </div>
      <div className="h-5 sm:h-6 md:h-7 bg-muted rounded-full w-14 sm:w-16 md:w-20 flex-shrink-0"></div>
    </div>

    <div className="grid grid-cols-1 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6">
      <div className="bg-muted/30 border border-border/50 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5">
        <div className="h-3 sm:h-4 md:h-5 bg-muted rounded w-2/3 sm:w-1/2 mb-2 sm:mb-3 md:mb-4"></div>
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          <div className="h-5 sm:h-6 md:h-7 bg-muted rounded-md w-12 sm:w-14 md:w-16"></div>
          <div className="h-5 sm:h-6 md:h-7 bg-muted rounded-md w-16 sm:w-18 md:w-20"></div>
          <div className="h-5 sm:h-6 md:h-7 bg-muted rounded-md w-10 sm:w-12 md:w-14"></div>
        </div>
      </div>
      <div className="bg-muted/30 border border-border/50 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5">
        <div className="h-3 sm:h-4 md:h-5 bg-muted rounded w-2/3 sm:w-1/2 mb-2 sm:mb-3 md:mb-4"></div>
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          <div className="h-5 sm:h-6 md:h-7 bg-muted rounded-md w-8 sm:w-10 md:w-12"></div>
          <div className="h-5 sm:h-6 md:h-7 bg-muted rounded-md w-12 sm:w-14 md:w-16"></div>
          <div className="h-5 sm:h-6 md:h-7 bg-muted rounded-md w-14 sm:w-16 md:w-18"></div>
        </div>
      </div>
    </div>

    <div className="bg-muted/20 border border-border/30 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 mb-4 sm:mb-6">
      <div className="h-3 sm:h-4 bg-muted rounded w-full mb-2"></div>
      <div className="h-3 sm:h-4 bg-muted rounded w-4/5 mb-2"></div>
      <div className="h-3 sm:h-4 bg-muted rounded w-3/4"></div>
    </div>

    <div className="flex flex-col gap-3 sm:gap-4 pt-3 sm:pt-4 md:pt-6 border-t border-border">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 md:gap-6">
        <div className="h-3 sm:h-4 md:h-5 bg-muted rounded w-16 sm:w-20 md:w-24"></div>
        <div className="h-3 sm:h-4 md:h-5 bg-muted rounded w-24 sm:w-28 md:w-32"></div>
        <div className="h-3 sm:h-4 md:h-5 bg-muted rounded w-12 sm:w-16 md:w-20"></div>
      </div>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
        <div className="h-10 sm:h-11 md:h-12 bg-muted rounded-lg sm:rounded-xl flex-1 sm:flex-none sm:w-28 md:w-32"></div>
        <div className="h-10 sm:h-11 md:h-12 bg-muted rounded-lg sm:rounded-xl flex-1 sm:flex-none sm:w-20 md:w-24"></div>
        <div className="h-10 sm:h-11 md:h-12 bg-muted rounded-lg sm:rounded-xl flex-1 sm:flex-none sm:w-24 md:w-28"></div>
      </div>
    </div>
  </div>
);

// Progressive Edit Modal Component
interface EditModalProps {
  problem: Problem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedProblem: Problem) => void;
}

const EditModal = ({ problem, isOpen, onClose, onSave }: EditModalProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<Problem>>({});
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    if (problem && isOpen) {
      setFormData(problem);
      setCurrentStep(1);
    }
  }, [problem, isOpen]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  const handleSave = async () => {
    if (!formData._id) return;

    setIsLoading(true);
    try {
      const response = await updateProblem(formData._id, formData);
      if (response.status === "OK") {
        const updatedProblem = { ...problem, ...formData } as Problem;
        onSave(updatedProblem);
        showToast("Problem updated successfully!", "success");
        onClose();
      } else {
        showToast(response.message || "Failed to update problem", "error");
      }
    } catch (error) {
      console.error("Error updating problem:", error);
      // Fallback to local update if API fails
      const updatedProblem = { ...problem, ...formData } as Problem;
      onSave(updatedProblem);
      showToast("Problem updated locally (API unavailable)", "error");
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !problem) return null;

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4 sm:space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Field
              </label>
              <select
                value={formData.fellowField || ""}
                onChange={(e) =>
                  handleInputChange("fellowField", e.target.value)
                }
                className="w-full px-3 sm:px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base min-h-[44px] touch-manipulation"
              >
                <option value="">Select Field</option>
                <option value="Data Science">Data Science</option>
                <option value="Data Engineering">Data Engineering</option>
                <option value="Data Analytics">Data Analytics</option>
                <option value="Machine Learning">Machine Learning</option>
                <option value="Business Intelligence">
                  Business Intelligence
                </option>
                <option value="EdTech, Learner Behavior Analytics">
                  EdTech, Learner Behavior Analytics
                </option>
                <option value="Business Intelligence, Market Insights">
                  Business Intelligence, Market Insights
                </option>
                <option value="AI-Driven Healthcare, Epidemiological Data Analysis">
                  AI-Driven Healthcare, Epidemiological Data Analysis
                </option>
                <option value="Data Curation, Predictive Modeling">
                  Data Curation, Predictive Modeling
                </option>
                <option value="Sales Optimization, Customer Retention">
                  Sales Optimization, Customer Retention
                </option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Problem Types
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  "Full-time",
                  "Part-time",
                  "Contract",
                  "Internship",
                  "Remote",
                ].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => {
                      const types = Array.isArray(formData.type)
                        ? formData.type
                        : [];
                      const newTypes = types.includes(type)
                        ? types.filter((t) => t !== type)
                        : [...types, type];
                      handleInputChange("type", newTypes);
                    }}
                    className={`px-3 py-2.5 sm:py-2 rounded-lg border text-xs sm:text-sm font-medium transition-colors min-h-[44px] touch-manipulation ${
                      Array.isArray(formData.type) &&
                      formData.type.includes(type)
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background border-border text-foreground hover:bg-muted"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Required Skills
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  "Python",
                  "SQL",
                  "R",
                  "Tableau",
                  "Power BI",
                  "Excel",
                  "Machine Learning",
                  "Statistics",
                ].map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => {
                      const skills = Array.isArray(formData.skills)
                        ? formData.skills
                        : [];
                      const newSkills = skills.includes(skill)
                        ? skills.filter((s) => s !== skill)
                        : [...skills, skill];
                      handleInputChange("skills", newSkills);
                    }}
                    className={`px-3 py-2.5 sm:py-2 rounded-lg border text-xs sm:text-sm font-medium transition-colors min-h-[44px] touch-manipulation ${
                      Array.isArray(formData.skills) &&
                      formData.skills.includes(skill)
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background border-border text-foreground hover:bg-muted"
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4 sm:space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Description
              </label>
              <textarea
                value={formData.description || ""}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                rows={3}
                className="w-full px-3 sm:px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent resize-none text-sm sm:text-base touch-manipulation"
                placeholder="Describe the problem or role..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Candidate Qualifications
              </label>
              <textarea
                value={formData.candidatesQualification || ""}
                onChange={(e) =>
                  handleInputChange("candidatesQualification", e.target.value)
                }
                rows={3}
                className="w-full px-3 sm:px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent resize-none text-sm sm:text-base touch-manipulation"
                placeholder="Required qualifications..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Nice to Haves
              </label>
              <textarea
                value={formData.niceToHaves || ""}
                onChange={(e) =>
                  handleInputChange("niceToHaves", e.target.value)
                }
                rows={3}
                className="w-full px-3 sm:px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent resize-none text-sm sm:text-base touch-manipulation"
                placeholder="Nice to have qualifications..."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Min Salary ($)
                </label>
                <input
                  type="number"
                  value={formData.payRange?.min || ""}
                  onChange={(e) =>
                    handleInputChange("payRange", {
                      ...formData.payRange,
                      min: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3 sm:px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base min-h-[44px] touch-manipulation"
                  placeholder="50000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Max Salary ($)
                </label>
                <input
                  type="number"
                  value={formData.payRange?.max || ""}
                  onChange={(e) =>
                    handleInputChange("payRange", {
                      ...formData.payRange,
                      max: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3 sm:px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base min-h-[44px] touch-manipulation"
                  placeholder="80000"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="bg-muted/50 border border-border rounded-lg p-4">
              <h4 className="font-semibold text-foreground mb-3">
                Review Your Changes
              </h4>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="font-medium">Field:</span>{" "}
                  {formData.fellowField}
                </div>
                <div>
                  <span className="font-medium">Types:</span>{" "}
                  {Array.isArray(formData.type) ? formData.type.join(", ") : ""}
                </div>
                <div>
                  <span className="font-medium">Skills:</span>{" "}
                  {Array.isArray(formData.skills)
                    ? formData.skills.join(", ")
                    : ""}
                </div>
                <div>
                  <span className="font-medium">Pay Range:</span> $
                  {formData.payRange?.min?.toLocaleString()} - $
                  {formData.payRange?.max?.toLocaleString()}
                </div>
                <div>
                  <span className="font-medium">Description:</span>
                  <p className="text-muted-foreground mt-1">
                    {formData.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
      <div className="bg-card border border-border rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-sm sm:max-w-lg md:max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden touch-manipulation">
        {/* Header */}
        <div className="border-b border-border p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-foreground">
                Edit Problem
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Step {currentStep} of 3:{" "}
                {currentStep === 1
                  ? "Basic Info"
                  : currentStep === 2
                  ? "Details"
                  : "Review"}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-lg transition-colors min-h-[44px] min-w-[44px] touch-manipulation"
            >
              <FiX className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mt-3 sm:mt-4">
            <div className="flex items-center justify-between mb-2">
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={`flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full text-xs sm:text-sm font-medium transition-colors ${
                    step <= currentStep
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {step < currentStep ? (
                    <FiCheck className="w-3 h-3 sm:w-4 sm:h-4" />
                  ) : (
                    step
                  )}
                </div>
              ))}
            </div>
            <div className="w-full bg-muted rounded-full h-1.5 sm:h-2">
              <div
                className="bg-primary rounded-full h-1.5 sm:h-2 transition-all duration-300"
                style={{ width: `${(currentStep / 3) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto scrollbar-hide max-h-[calc(95vh-180px)] sm:max-h-[calc(90vh-200px)]">
          {renderStep()}
        </div>

        {/* Footer */}
        <div className="border-t border-border p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-h-[44px] touch-manipulation"
            >
              <FiChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Previous</span>
            </button>

            <div className="flex items-center gap-2 sm:gap-3">
              {currentStep < 3 ? (
                <button
                  onClick={handleNext}
                  className="flex items-center gap-2 px-4 sm:px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium min-h-[44px] touch-manipulation"
                >
                  <span className="hidden sm:inline">Next</span>
                  <span className="sm:hidden">Next</span>
                  <FiChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="flex items-center gap-2 px-4 sm:px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium min-h-[44px] touch-manipulation"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground" />
                      <span className="hidden sm:inline">Saving...</span>
                      <span className="sm:hidden">Save</span>
                    </>
                  ) : (
                    <>
                      <FiCheck className="w-4 h-4" />
                      <span className="hidden sm:inline">Save Changes</span>
                      <span className="sm:hidden">Save</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// View Applicants Modal Component
interface ViewApplicantsModalProps {
  problemId: string;
  problemTitle: string;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdate?: () => void;
}

const ViewApplicantsModal = ({
  problemId,
  problemTitle,
  isOpen,
  onClose,
  onStatusUpdate,
}: ViewApplicantsModalProps) => {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [confirmReject, setConfirmReject] = useState<{
    applicantId: string;
    applicantName: string;
  } | null>(null);
  const { showToast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (isOpen && problemId) {
      fetchApplicants();
    }
  }, [isOpen, problemId]);

  const fetchApplicants = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getProblemApplicants(problemId);
      setApplicants(response.applicants || []);
    } catch (error) {
      console.error("Error fetching applicants:", error);
      setError("Failed to load applicants");
      showToast("Failed to load applicants", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (
    applicantId: string,
    action: "shortlist" | "accept" | "reject",
    applicantName?: string
  ) => {
    // Show confirmation dialog for reject action
    if (action === "reject") {
      setConfirmReject({
        applicantId,
        applicantName: applicantName || "this applicant",
      });
      return;
    }

    await performStatusUpdate(applicantId, action);
  };

  const performStatusUpdate = async (
    applicantId: string,
    action: "shortlist" | "accept" | "reject"
  ) => {
    setUpdatingStatus(`${applicantId}-${action}`);
    try {
      let response;
      switch (action) {
        case "shortlist":
          response = await shortlistApplicant(problemId, applicantId);
          break;
        case "accept":
          response = await acceptApplicant(problemId, applicantId);
          break;
        case "reject":
          response = await rejectApplicant(problemId, applicantId);
          break;
      }

      if (response.success) {
        showToast(response.message, "success");
        // Refresh applicants list to show updated status
        await fetchApplicants();
        // Trigger dashboard refresh if callback provided
        if (onStatusUpdate) {
          onStatusUpdate();
        }
      } else {
        showToast(response.message || `Failed to ${action} applicant`, "error");
      }
    } catch (error: any) {
      console.error(`Error ${action}ing applicant:`, error);
      const errorMessage =
        error.response?.data?.message || `Failed to ${action} applicant`;
      showToast(errorMessage, "error");
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleConfirmReject = async () => {
    if (confirmReject) {
      await performStatusUpdate(confirmReject.applicantId, "reject");
      setConfirmReject(null);
    }
  };

  const canPerformAction = (currentStatus: string, action: string) => {
    const status = currentStatus.toLowerCase();
    switch (action) {
      case "shortlist":
        // Can shortlist from "pending", "reviewed", or "applied", but not from "rejected"
        return (
          status === "pending" || status === "reviewed" || status === "applied"
        );
      case "accept":
        // Can ONLY accept from "shortlisted" status (must be shortlisted first)
        return status === "shortlisted";
      case "reject":
        // Can reject from any status except already "rejected"
        return status !== "rejected";
      default:
        return false;
    }
  };

  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case "pending":
      case "applied":
        return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800";
      case "reviewed":
        return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800";
      case "shortlisted":
        return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800";
      case "hired":
      case "accepted":
        return "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800";
    }
  };

  const getStatusDescription = (status: string) => {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case "pending":
      case "applied":
        return "Application submitted and awaiting review";
      case "reviewed":
        return "Application has been reviewed";
      case "shortlisted":
        return "Candidate has been shortlisted for further consideration";
      case "rejected":
        return "Application has been rejected";
      case "accepted":
        return "Candidate has been accepted for the position";
      case "hired":
        return "Candidate has been hired";
      default:
        return "Application status";
    }
  };

  const getStatusDisplayText = (status: string) => {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case "applied":
        return "Applied";
      case "shortlisted":
        return "Shortlisted";
      case "accepted":
        return "Accepted";
      case "rejected":
        return "Rejected";
      case "pending":
        return "Pending";
      case "reviewed":
        return "Reviewed";
      case "hired":
        return "Hired";
      default:
        return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto scrollbar-hide">
      <div className="min-h-screen px-2 sm:px-4 text-center">
        <div
          className="fixed inset-0 bg-black/60 transition-opacity"
          onClick={onClose}
        />

        <span className="inline-block h-screen align-middle" aria-hidden="true">
          &#8203;
        </span>

        <div className="inline-block w-full max-w-xs sm:max-w-2xl md:max-w-4xl lg:max-w-6xl p-3 sm:p-6 my-4 sm:my-8 overflow-hidden text-left align-middle transition-all transform bg-background border border-border rounded-lg sm:rounded-xl md:rounded-2xl shadow-2xl relative z-10">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 pb-3 sm:pb-4 md:pb-6 border-b border-border">
            <div className="flex-1 min-w-0">
              <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-foreground truncate">
                Applicants for "{problemTitle}"
              </h3>
              <p className="text-xs sm:text-sm md:text-base text-muted-foreground mt-1">
                {applicants.length} total applicant
                {applicants.length !== 1 ? "s" : ""}
              </p>
            </div>
            <button
              onClick={onClose}
              className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors flex-shrink-0 self-start sm:self-center min-h-[44px] min-w-[44px] touch-manipulation"
            >
              <FiX className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="mt-3 sm:mt-4 md:mt-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-8 sm:py-12">
                <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-primary"></div>
                <span className="ml-2 sm:ml-3 text-muted-foreground text-sm sm:text-base">
                  Loading applicants...
                </span>
              </div>
            ) : error ? (
              <div className="text-center py-8 sm:py-12">
                <div className="text-red-500 mb-2">
                  <FiUsers className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 opacity-50" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">
                  Error Loading Applicants
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4">
                  {error}
                </p>
                <button
                  onClick={fetchApplicants}
                  className="px-3 sm:px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm sm:text-base min-h-[44px] touch-manipulation"
                >
                  Try Again
                </button>
              </div>
            ) : applicants.length === 0 ? (
              <div className="text-center py-8 sm:py-12">
                <FiUsers className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">
                  No Applicants Yet
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground">
                  This problem hasn't received any applications yet.
                </p>
              </div>
            ) : (
              <div className="space-y-2 sm:space-y-3 md:space-y-4 max-h-[60vh] overflow-y-auto scrollbar-hide">
                {applicants.filter(Boolean).map((applicant) => {
                  const user = applicant.user || applicant;
                  const applicationDate =
                    applicant.applicationDate || applicant.appliedAt;
                  const applicationStatus = applicant.status || "pending";

                  // Get the correct user ID for API calls
                  const userId = (user as any)?._id || applicant._id;

                  const userPhotoUrl =
                    (user as any)?.photoUrl ||
                    (applicant as any)?.profilePicture;
                  const userFirstName = (user as any)?.firstName || "";
                  const userLastName = (user as any)?.lastName || "";
                  const userEmail = (user as any)?.email || "";
                  const userPhone = (user as any)?.phone || "";
                  const userCity = (user as any)?.city || "";
                  const userCountry = (user as any)?.country || "";
                  const userSkills = (user as any)?.skills || [];
                  const userWorkExperience =
                    (user as any)?.workExperience || [];
                  const userEducationHistory =
                    (user as any)?.educationHistory || [];
                  const userCV = (user as any)?.cv || (applicant as any)?.cv;

                  return (
                    <div
                      key={applicant._id}
                      className="bg-card border border-border rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 hover:shadow-lg transition-shadow touch-manipulation"
                    >
                      {/* Mobile layout - stacked */}
                      <div className="block sm:hidden">
                        {/* Header with photo, name, and status */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2.5 flex-1 min-w-0">
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                              {userPhotoUrl ? (
                                <img
                                  src={userPhotoUrl}
                                  alt={`${userFirstName} ${userLastName}`}
                                  className="w-8 h-8 rounded-full object-cover"
                                  loading="lazy"
                                />
                              ) : (
                                <span className="text-primary font-semibold text-xs">
                                  {(userFirstName?.[0] || "").toUpperCase()}
                                  {(userLastName?.[0] || "").toUpperCase()}
                                </span>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-semibold text-foreground truncate">
                                {userFirstName || "Unknown"}{" "}
                                {userLastName || "User"}
                              </h4>
                              <p className="text-xs text-muted-foreground">
                                Applied{" "}
                                {applicationDate
                                  ? new Date(
                                      applicationDate
                                    ).toLocaleDateString()
                                  : "Unknown date"}
                              </p>
                            </div>
                          </div>
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                              applicationStatus
                            )} flex-shrink-0`}
                            title={getStatusDescription(applicationStatus)}
                          >
                            {getStatusDisplayText(applicationStatus)}
                          </span>
                        </div>

                        {/* Contact info */}
                        <div className="space-y-1 mb-3 text-xs text-muted-foreground">
                          {userEmail && (
                            <div className="flex items-center gap-2">
                              <FiMail className="w-3 h-3 flex-shrink-0" />
                              <span className="truncate">{userEmail}</span>
                            </div>
                          )}
                          {userPhone && (
                            <div className="flex items-center gap-2">
                              <FiPhone className="w-3 h-3 flex-shrink-0" />
                              <span>{userPhone}</span>
                            </div>
                          )}
                          {userCity && userCountry && (
                            <div className="flex items-center gap-2">
                              <FiMapPin className="w-3 h-3 flex-shrink-0" />
                              <span className="truncate">
                                {userCity}, {userCountry}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Match Score */}
                        {applicant.match && (
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-xs font-medium text-foreground">
                              Match:
                            </span>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-bold ${
                                applicant.match >= 80
                                  ? "bg-green-100 text-green-700"
                                  : applicant.match >= 60
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {applicant.match}%
                            </span>
                          </div>
                        )}

                        {/* Skills */}
                        {userSkills && userSkills.length > 0 && (
                          <div className="mb-3">
                            <span className="text-xs font-medium text-foreground block mb-1.5">
                              Skills:
                            </span>
                            <div className="flex flex-wrap gap-1">
                              {userSkills
                                .slice(0, 3)
                                .map((skill: any, index: number) => (
                                  <span
                                    key={index}
                                    className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-secondary/80 text-secondary-foreground"
                                  >
                                    {typeof skill === "string"
                                      ? skill
                                      : skill.name}
                                  </span>
                                ))}
                              {userSkills.length > 3 && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-muted text-muted-foreground">
                                  +{userSkills.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Experience & Education */}
                        <div className="space-y-2 text-xs mb-3">
                          {userWorkExperience &&
                            userWorkExperience.length > 0 && (
                              <div>
                                <span className="font-medium text-foreground block">
                                  Latest Experience:
                                </span>
                                <div className="text-muted-foreground">
                                  <p className="font-medium truncate">
                                    {userWorkExperience[0].title}
                                  </p>
                                  <p className="text-xs truncate">
                                    {userWorkExperience[0].company}
                                  </p>
                                </div>
                              </div>
                            )}
                          {userEducationHistory &&
                            userEducationHistory.length > 0 && (
                              <div>
                                <span className="font-medium text-foreground block">
                                  Education:
                                </span>
                                <div className="text-muted-foreground">
                                  <p className="font-medium truncate">
                                    {userEducationHistory[0].degree} in{" "}
                                    {userEducationHistory[0].fieldOfStudy}
                                  </p>
                                  <p className="text-xs truncate">
                                    {userEducationHistory[0].school}
                                  </p>
                                </div>
                              </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-2 pt-3 border-t border-border">
                          {/* Primary Actions */}
                          <div className="flex items-center gap-2">
                            {userCV && (
                              <button className="flex items-center gap-1 px-2.5 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-colors text-xs font-medium flex-1 justify-center min-h-[44px] touch-manipulation">
                                <FiDownload className="w-3 h-3" />
                                <span>CV</span>
                              </button>
                            )}
                            <button
                              onClick={() =>
                                router.push(`/dashboard/user-profile/${userId}`)
                              }
                              className="flex items-center gap-1 px-2.5 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors text-xs font-medium flex-1 justify-center min-h-[44px] touch-manipulation"
                            >
                              <FiExternalLink className="w-3 h-3" />
                              <span>Profile</span>
                            </button>
                          </div>

                          {/* Status Update Actions */}
                          <div className="flex items-center gap-1">
                            {canPerformAction(
                              applicationStatus,
                              "shortlist"
                            ) && (
                              <button
                                onClick={() =>
                                  handleStatusUpdate(userId, "shortlist")
                                }
                                disabled={
                                  updatingStatus === `${userId}-shortlist`
                                }
                                className="flex items-center gap-1 px-2 py-1.5 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 rounded-md transition-colors text-xs font-medium flex-1 justify-center disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] touch-manipulation"
                              >
                                {updatingStatus === `${userId}-shortlist` ? (
                                  <div className="animate-spin rounded-full h-3 w-3 border-b border-yellow-700"></div>
                                ) : (
                                  <FiClock className="w-3 h-3" />
                                )}
                                <span className="hidden xs:inline">
                                  Shortlist
                                </span>
                                <span className="xs:hidden">Short</span>
                              </button>
                            )}
                            {canPerformAction(applicationStatus, "accept") && (
                              <button
                                onClick={() =>
                                  handleStatusUpdate(userId, "accept")
                                }
                                disabled={updatingStatus === `${userId}-accept`}
                                className="flex items-center gap-1 px-2 py-1.5 bg-green-100 hover:bg-green-200 text-green-700 rounded-md transition-colors text-xs font-medium flex-1 justify-center disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] touch-manipulation"
                              >
                                {updatingStatus === `${userId}-accept` ? (
                                  <div className="animate-spin rounded-full h-3 w-3 border-b border-green-700"></div>
                                ) : (
                                  <FiCheck className="w-3 h-3" />
                                )}
                                <span>Accept</span>
                              </button>
                            )}
                            {canPerformAction(applicationStatus, "reject") && (
                              <button
                                onClick={() =>
                                  handleStatusUpdate(
                                    userId,
                                    "reject",
                                    `${userFirstName} ${userLastName}`
                                  )
                                }
                                disabled={updatingStatus === `${userId}-reject`}
                                className="flex items-center gap-1 px-2 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-md transition-colors text-xs font-medium flex-1 justify-center disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] touch-manipulation"
                              >
                                {updatingStatus === `${userId}-reject` ? (
                                  <div className="animate-spin rounded-full h-3 w-3 border-b border-red-700"></div>
                                ) : (
                                  <FiX className="w-3 h-3" />
                                )}
                                <span>Reject</span>
                              </button>
                            )}
                            {!canPerformAction(
                              applicationStatus,
                              "shortlist"
                            ) &&
                              !canPerformAction(applicationStatus, "accept") &&
                              !canPerformAction(
                                applicationStatus,
                                "reject"
                              ) && (
                                <div className="text-xs text-muted-foreground text-center px-2 py-1.5 bg-muted/30 rounded-md flex-1">
                                  No actions available
                                </div>
                              )}
                          </div>
                        </div>
                      </div>

                      {/* Desktop layout - side by side */}
                      <div className="hidden sm:block">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 sm:gap-4 flex-1">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                              {userPhotoUrl ? (
                                <img
                                  src={userPhotoUrl}
                                  alt={`${userFirstName} ${userLastName}`}
                                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
                                  loading="lazy"
                                />
                              ) : (
                                <span className="text-primary font-semibold text-base sm:text-lg">
                                  {(userFirstName?.[0] || "").toUpperCase()}
                                  {(userLastName?.[0] || "").toUpperCase()}
                                </span>
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3 mb-2">
                                <h4 className="text-base sm:text-lg font-semibold text-foreground">
                                  {userFirstName || "Unknown"}{" "}
                                  {userLastName || "User"}
                                </h4>
                                <span
                                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                                    applicationStatus
                                  )}`}
                                  title={getStatusDescription(
                                    applicationStatus
                                  )}
                                >
                                  {getStatusDisplayText(applicationStatus)}
                                </span>
                              </div>

                              <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-muted-foreground mb-3">
                                {userEmail && (
                                  <div className="flex items-center gap-2">
                                    <FiMail className="w-4 h-4" />
                                    <span className="truncate max-w-[200px]">
                                      {userEmail}
                                    </span>
                                  </div>
                                )}
                                {userPhone && (
                                  <div className="flex items-center gap-2">
                                    <FiPhone className="w-4 h-4" />
                                    <span>{userPhone}</span>
                                  </div>
                                )}
                                {userCity && userCountry && (
                                  <div className="flex items-center gap-2">
                                    <FiMapPin className="w-4 h-4" />
                                    <span className="truncate max-w-[150px]">
                                      {userCity}, {userCountry}
                                    </span>
                                  </div>
                                )}
                                <div className="flex items-center gap-2">
                                  <FiCalendar className="w-4 h-4" />
                                  <span>
                                    Applied{" "}
                                    {applicationDate
                                      ? new Date(
                                          applicationDate
                                        ).toLocaleDateString()
                                      : "Unknown date"}
                                  </span>
                                </div>
                              </div>

                              {/* Match Score */}
                              {applicant.match && (
                                <div className="mb-3">
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="text-sm font-medium text-foreground">
                                      Match Score:
                                    </span>
                                    <span
                                      className={`px-2 py-1 rounded-full text-xs font-bold ${
                                        applicant.match >= 80
                                          ? "bg-green-100 text-green-700"
                                          : applicant.match >= 60
                                          ? "bg-yellow-100 text-yellow-700"
                                          : "bg-red-100 text-red-700"
                                      }`}
                                    >
                                      {applicant.match}%
                                    </span>
                                  </div>
                                </div>
                              )}

                              {/* Skills */}
                              {userSkills && userSkills.length > 0 && (
                                <div className="mb-3">
                                  <span className="text-sm font-medium text-foreground mr-2">
                                    Skills:
                                  </span>
                                  <div className="flex flex-wrap gap-2 mt-1">
                                    {userSkills
                                      .slice(0, 6)
                                      .map((skill: any, index: number) => (
                                        <span
                                          key={index}
                                          className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-secondary/80 text-secondary-foreground"
                                        >
                                          {typeof skill === "string"
                                            ? skill
                                            : skill.name}
                                        </span>
                                      ))}
                                    {userSkills.length > 6 && (
                                      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-muted text-muted-foreground">
                                        +{userSkills.length - 6} more
                                      </span>
                                    )}
                                  </div>
                                </div>
                              )}

                              {/* Experience & Education */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                {userWorkExperience &&
                                  userWorkExperience.length > 0 && (
                                    <div>
                                      <span className="font-medium text-foreground">
                                        Latest Experience:
                                      </span>
                                      <div className="text-muted-foreground mt-1">
                                        <p className="font-medium truncate">
                                          {userWorkExperience[0].title}
                                        </p>
                                        <p className="text-xs truncate">
                                          {userWorkExperience[0].company}
                                        </p>
                                      </div>
                                    </div>
                                  )}
                                {userEducationHistory &&
                                  userEducationHistory.length > 0 && (
                                    <div>
                                      <span className="font-medium text-foreground">
                                        Education:
                                      </span>
                                      <div className="text-muted-foreground mt-1">
                                        <p className="font-medium truncate">
                                          {userEducationHistory[0].degree} in{" "}
                                          {userEducationHistory[0].fieldOfStudy}
                                        </p>
                                        <p className="text-xs truncate">
                                          {userEducationHistory[0].school}
                                        </p>
                                      </div>
                                    </div>
                                  )}
                              </div>

                              {/* What Matched & Went Against */}
                              {(applicant.what_matched ||
                                applicant.went_against) && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-3 border-t border-border">
                                  {applicant.what_matched &&
                                    applicant.what_matched.length > 0 && (
                                      <div>
                                        <span className="text-sm font-medium text-green-700 flex items-center gap-1">
                                          <FiCheck className="w-3 h-3" />
                                          What Matched:
                                        </span>
                                        <ul className="text-xs text-muted-foreground mt-1 space-y-1">
                                          {applicant.what_matched
                                            .slice(0, 2)
                                            .map((item, index) => (
                                              <li key={index}>• {item}</li>
                                            ))}
                                        </ul>
                                      </div>
                                    )}
                                  {applicant.went_against &&
                                    applicant.went_against.length > 0 && (
                                      <div>
                                        <span className="text-sm font-medium text-orange-700 flex items-center gap-1">
                                          <FiX className="w-3 h-3" />
                                          Areas to Improve:
                                        </span>
                                        <ul className="text-xs text-muted-foreground mt-1 space-y-1">
                                          {applicant.went_against
                                            .slice(0, 2)
                                            .map((item, index) => (
                                              <li key={index}>• {item}</li>
                                            ))}
                                        </ul>
                                      </div>
                                    )}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex-shrink-0 ml-4">
                            <div className="flex items-center gap-2 mb-2">
                              {userCV && (
                                <button className="flex items-center gap-2 px-3 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-colors text-sm font-medium min-h-[44px] touch-manipulation">
                                  <FiDownload className="w-4 h-4" />
                                  CV
                                </button>
                              )}
                              <button
                                onClick={() =>
                                  router.push(
                                    `/dashboard/user-profile/${userId}`
                                  )
                                }
                                className="flex items-center gap-2 px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors text-sm font-medium min-h-[44px] touch-manipulation"
                              >
                                <FiExternalLink className="w-4 h-4" />
                                Profile
                              </button>
                            </div>

                            {/* Status Update Actions */}
                            <div className="flex items-center gap-2">
                              {canPerformAction(
                                applicationStatus,
                                "shortlist"
                              ) && (
                                <button
                                  onClick={() =>
                                    handleStatusUpdate(userId, "shortlist")
                                  }
                                  disabled={
                                    updatingStatus === `${userId}-shortlist`
                                  }
                                  className="flex items-center gap-2 px-3 py-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 rounded-lg transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] touch-manipulation"
                                >
                                  {updatingStatus === `${userId}-shortlist` ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-b border-yellow-700"></div>
                                  ) : (
                                    <FiClock className="w-4 h-4" />
                                  )}
                                  Shortlist
                                </button>
                              )}
                              {canPerformAction(
                                applicationStatus,
                                "accept"
                              ) && (
                                <button
                                  onClick={() =>
                                    handleStatusUpdate(userId, "accept")
                                  }
                                  disabled={
                                    updatingStatus === `${userId}-accept`
                                  }
                                  className="flex items-center gap-2 px-3 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] touch-manipulation"
                                >
                                  {updatingStatus === `${userId}-accept` ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-b border-green-700"></div>
                                  ) : (
                                    <FiCheck className="w-4 h-4" />
                                  )}
                                  Accept
                                </button>
                              )}
                              {canPerformAction(
                                applicationStatus,
                                "reject"
                              ) && (
                                <button
                                  onClick={() =>
                                    handleStatusUpdate(
                                      userId,
                                      "reject",
                                      `${userFirstName} ${userLastName}`
                                    )
                                  }
                                  disabled={
                                    updatingStatus === `${userId}-reject`
                                  }
                                  className="flex items-center gap-2 px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] touch-manipulation"
                                >
                                  {updatingStatus === `${userId}-reject` ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-b border-red-700"></div>
                                  ) : (
                                    <FiX className="w-4 h-4" />
                                  )}
                                  Reject
                                </button>
                              )}
                              {!canPerformAction(
                                applicationStatus,
                                "shortlist"
                              ) &&
                                !canPerformAction(
                                  applicationStatus,
                                  "accept"
                                ) &&
                                !canPerformAction(
                                  applicationStatus,
                                  "reject"
                                ) && (
                                  <div className="text-sm text-muted-foreground px-3 py-2 bg-muted/30 rounded-lg">
                                    No actions available
                                  </div>
                                )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-border mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-border text-foreground hover:bg-muted rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Reject Confirmation Modal */}
      {confirmReject && (
        <div className="fixed inset-0 z-[10000] overflow-y-auto">
          <div className="min-h-screen px-4 text-center">
            <div className="fixed inset-0 bg-black/70 transition-opacity" />

            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-background border border-border rounded-xl shadow-2xl relative z-10">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-red-100 dark:bg-red-900/20 p-3 rounded-full">
                  <FiX className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    Reject Applicant
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    This action cannot be undone.
                  </p>
                </div>
              </div>

              <p className="text-muted-foreground mb-6">
                Are you sure you want to reject{" "}
                <span className="font-medium text-foreground">
                  {confirmReject.applicantName}
                </span>
                ? They will be notified via email.
              </p>

              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => setConfirmReject(null)}
                  className="px-4 py-2 border border-border text-foreground hover:bg-muted rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmReject}
                  disabled={
                    updatingStatus === `${confirmReject.applicantId}-reject`
                  }
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {updatingStatus === `${confirmReject.applicantId}-reject` ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b border-white"></div>
                      Rejecting...
                    </>
                  ) : (
                    "Reject Applicant"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default function EmployerProblemsPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const { openModal } = usePostProblemModal();
  const [problems, setProblems] = useState<Problem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [editingProblem, setEditingProblem] = useState<Problem | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [deletingProblem, setDeletingProblem] = useState<Problem | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProblemId, setSelectedProblemId] = useState<string | null>(
    null
  );
  const [selectedProblemTitle, setSelectedProblemTitle] = useState<string>("");
  const [showApplicantsModal, setShowApplicantsModal] = useState(false);

  useEffect(() => {
    const user = getUser();
    if (!user) {
      router.push("/auth/sign-in");
      return;
    }

    if (user.userType !== "employer") {
      router.push("/dashboard");
      return;
    }

    fetchProblems();
  }, [router, currentPage, searchTerm, statusFilter]);

  // Listen for problem creation/update events
  useEffect(() => {
    const handleProblemUpdate = () => {
      fetchProblems();
    };

    window.addEventListener("problemPosted", handleProblemUpdate);
    return () => {
      window.removeEventListener("problemPosted", handleProblemUpdate);
    };
  }, [currentPage, searchTerm, statusFilter]);

  // Auto-open ViewApplicants modal based on query parameters
  useEffect(() => {
    const { viewApplicants, problemTitle } = router.query;
    if (viewApplicants && typeof viewApplicants === "string" && !isLoading) {
      setSelectedProblemId(viewApplicants);
      setSelectedProblemTitle(
        typeof problemTitle === "string" ? decodeURIComponent(problemTitle) : ""
      );
      setShowApplicantsModal(true);

      // Clean up the URL after opening the modal
      const {
        viewApplicants: _,
        problemTitle: __,
        ...cleanQuery
      } = router.query;
      router.replace(
        {
          pathname: router.pathname,
          query: cleanQuery,
        },
        undefined,
        { shallow: true }
      );
    }
  }, [router.query, isLoading, router]);

  const fetchProblems = async () => {
    setIsLoading(true);
    try {
      const params: ProblemsParams = {
        page: currentPage,
        limit: 12,
        search: searchTerm,
        status: statusFilter,
      };

      const response = await getEmployerProblems(params);
      setProblems(response.problems || []);
      setTotalPages(response.totalPages || 1);
    } catch (error) {
      console.error("Failed to fetch problems:", error);
      showToast("Failed to load problems. Please try again.", "error");
      setProblems([]);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditProblem = (problem: Problem) => {
    setEditingProblem(problem);
    setShowEditModal(true);
  };

  const handleEditSuccess = () => {
    fetchProblems();
    window.dispatchEvent(new CustomEvent("problemPosted"));
  };

  const handleDeleteProblem = (problem: Problem) => {
    setDeletingProblem(problem);
    setShowDeleteModal(true);
  };

  const handleDeleteSuccess = () => {
    fetchProblems();
    window.dispatchEvent(new CustomEvent("problemPosted"));
  };

  const handleViewApplicants = (problemId: string, problemTitle: string) => {
    setSelectedProblemId(problemId);
    setSelectedProblemTitle(problemTitle);
    setShowApplicantsModal(true);
  };

  const filteredProblems = useMemo(() => {
    return problems.filter((problem) => {
      const matchesSearch =
        problem.fellowField.toLowerCase().includes(searchTerm.toLowerCase()) ||
        problem.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = !statusFilter || problem.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [problems, searchTerm, statusFilter]);

  const stats = useMemo(() => {
    const totalProblems = problems.length;
    const activeProblems = problems.filter(
      (p) => p.status.toLowerCase() === "unsolved"
    ).length;
    const totalApplicants = problems.reduce(
      (sum, p) => sum + p.noOfApplicants,
      0
    );
    const averageApplicants =
      totalProblems > 0 ? Math.round(totalApplicants / totalProblems) : 0;

    return {
      totalProblems,
      activeProblems,
      totalApplicants,
      averageApplicants,
    };
  }, [problems]);

  const StatusBadge = ({ status }: { status: string }) => {
    const getStatusColor = (status: string) => {
      switch (status.toLowerCase()) {
        case "unsolved":
          return "bg-blue-100 text-blue-800 border-blue-200";
        case "active":
          return "bg-green-100 text-green-800 border-green-200";
        case "paused":
          return "bg-yellow-100 text-yellow-800 border-yellow-200";
        case "closed":
        case "solved":
          return "bg-red-100 text-red-800 border-red-200";
        default:
          return "bg-gray-100 text-gray-800 border-gray-200";
      }
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
          status
        )}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const ProblemCard = ({ problem }: { problem: Problem }) => (
    <div className="group relative bg-card border border-border rounded-2xl p-4 sm:p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                {problem.fellowField}
              </h3>
            </div>
            <div className="flex-shrink-0">
              <StatusBadge status={problem.status} />
            </div>
          </div>

          <div className="flex flex-col gap-2 text-muted-foreground text-sm sm:text-base">
            <div className="flex items-center gap-2">
              <FiMapPin className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              <span className="truncate">
                {problem.employer.companyCity},{" "}
                {problem.employer.companyCountry}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <FiClock className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              <span className="whitespace-nowrap">
                {new Date(problem.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 gap-4 sm:gap-6 mb-4 sm:mb-6">
          {/* Problem Types */}
          <div className="bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-xl p-4 sm:p-5">
            <div className="flex items-center gap-3 mb-3 sm:mb-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                <FiBriefcase className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              </div>
              <span className="text-base sm:text-lg font-semibold text-foreground">
                Problem Types
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {problem.type.map((type, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium bg-primary text-primary-foreground shadow-sm"
                >
                  {type}
                </span>
              ))}
            </div>
          </div>

          {/* Required Skills */}
          <div className="bg-gradient-to-br from-secondary/5 to-secondary/10 border border-secondary/20 rounded-xl p-4 sm:p-5">
            <div className="flex items-center gap-3 mb-3 sm:mb-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-secondary/20 rounded-lg flex items-center justify-center">
                <FiUsers className="w-4 h-4 sm:w-5 sm:h-5 text-secondary-foreground" />
              </div>
              <span className="text-base sm:text-lg font-semibold text-foreground">
                Required Skills
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {problem.skills.slice(0, 4).map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium bg-secondary/80 text-secondary-foreground shadow-sm"
                >
                  {skill}
                </span>
              ))}
              {problem.skills.length > 4 && (
                <span className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium bg-muted text-muted-foreground shadow-sm">
                  +{problem.skills.length - 4} more
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-muted/20 border border-border/30 rounded-xl p-4 sm:p-5 mb-4 sm:mb-6">
          <h4 className="text-base sm:text-lg font-semibold text-foreground mb-2 sm:mb-3">
            Description
          </h4>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed line-clamp-3">
            {problem.description}
          </p>
        </div>

        {/* Footer */}
        <div className="flex flex-col gap-4 pt-4 sm:pt-6 border-t border-border">
          <div className="flex flex-col gap-2 sm:gap-0 sm:flex-row sm:items-center sm:justify-between text-muted-foreground text-sm sm:text-base">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
              <div className="flex items-center gap-2">
                <FiUsers className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <span className="font-medium">
                  {problem.noOfApplicants} applicant
                  {problem.noOfApplicants !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FiDollarSign className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <span className="font-medium">
                  ${problem.payRange.min.toLocaleString()} - $
                  {problem.payRange.max.toLocaleString()}
                </span>
              </div>
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground">
              Posted{" "}
              {new Date(problem.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:gap-3">
            <button
              onClick={() =>
                handleViewApplicants(problem._id, problem.fellowField)
              }
              className="flex items-center justify-center gap-2 px-4 py-3 sm:px-5 sm:py-3 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-xl transition-colors font-medium text-sm sm:text-base min-h-[44px] touch-manipulation"
              title="View Applicants"
            >
              <FiEye className="w-4 h-4" />
              <span>View Applicants</span>
            </button>
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <button
                onClick={() => handleEditProblem(problem)}
                className="flex items-center justify-center gap-2 px-4 py-3 sm:px-5 sm:py-3 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl transition-colors font-medium text-sm sm:text-base min-h-[44px] touch-manipulation"
                title="Edit Problem"
              >
                <FiEdit3 className="w-4 h-4" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => handleDeleteProblem(problem)}
                className="flex items-center justify-center gap-2 px-4 py-3 sm:px-5 sm:py-3 bg-red-100 hover:bg-red-200 text-red-700 rounded-xl transition-colors font-medium text-sm sm:text-base min-h-[44px] touch-manipulation"
                title="Delete Problem"
              >
                <FiTrash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const ProblemListItem = ({ problem }: { problem: Problem }) => (
    <div className="group relative bg-card border border-border rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 lg:gap-6">
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                {problem.fellowField}
              </h3>
              <StatusBadge status={problem.status} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-8 text-muted-foreground mb-4 text-sm sm:text-base">
              <div className="flex items-center gap-2">
                <FiMapPin className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <span className="truncate">
                  {problem.employer.companyCity},{" "}
                  {problem.employer.companyCountry}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FiUsers className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <span>
                  {problem.noOfApplicants} applicant
                  {problem.noOfApplicants !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FiDollarSign className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <span className="truncate">
                  ${problem.payRange.min.toLocaleString()} - $
                  {problem.payRange.max.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FiClock className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <span className="whitespace-nowrap">
                  {new Date(problem.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-2">
                  Problem Types
                </h4>
                <div className="flex flex-wrap gap-2">
                  {problem.type.map((type, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-1 sm:px-3 sm:py-1 rounded-lg text-xs sm:text-sm font-medium bg-primary text-primary-foreground"
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-2">
                  Required Skills
                </h4>
                <div className="flex flex-wrap gap-2">
                  {problem.skills.slice(0, 5).map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-1 sm:px-3 sm:py-1 rounded-lg text-xs sm:text-sm font-medium bg-secondary/80 text-secondary-foreground"
                    >
                      {skill}
                    </span>
                  ))}
                  {problem.skills.length > 5 && (
                    <span className="inline-flex items-center px-2.5 py-1 sm:px-3 sm:py-1 rounded-lg text-xs sm:text-sm font-medium bg-muted text-muted-foreground">
                      +{problem.skills.length - 5} more
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-muted/20 border border-border/30 rounded-xl p-3 sm:p-4 mb-4 lg:mb-0">
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed line-clamp-2">
                {problem.description}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-2 sm:gap-3 lg:gap-3 flex-shrink-0 lg:ml-6 lg:w-32">
            <button
              onClick={() =>
                handleViewApplicants(problem._id, problem.fellowField)
              }
              className="flex items-center justify-center gap-2 px-4 py-2.5 sm:px-5 sm:py-3 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-xl transition-colors font-medium text-sm sm:text-base lg:min-w-[120px]"
              title="View Applicants"
            >
              <FiEye className="w-4 h-4" />
              <span className="sm:hidden lg:inline">View</span>
              <span className="hidden sm:inline lg:hidden">
                View Applicants
              </span>
            </button>
            <button
              onClick={() => handleEditProblem(problem)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 sm:px-5 sm:py-3 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl transition-colors font-medium text-sm sm:text-base lg:min-w-[120px]"
              title="Edit Problem"
            >
              <FiEdit3 className="w-4 h-4" />
              <span>Edit</span>
            </button>
            <button
              onClick={() => handleDeleteProblem(problem)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 sm:px-5 sm:py-3 bg-red-100 hover:bg-red-200 text-red-700 rounded-xl transition-colors font-medium text-sm sm:text-base lg:min-w-[120px]"
              title="Delete Problem"
            >
              <FiTrash2 className="w-4 h-4" />
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10 safe-area-padding">
      <div className="max-w-full mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:gap-6 md:gap-8 mb-6 sm:mb-8 md:mb-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6">
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-1 sm:mb-2 md:mb-3 line-clamp-2">
                My Problems
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground line-clamp-2">
                Manage your posted problems and view applicants
              </p>
            </div>
            <button
              onClick={() => openModal()}
              className="flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-6 md:px-8 py-3 sm:py-3.5 md:py-4 bg-primary text-primary-foreground rounded-xl sm:rounded-2xl hover:bg-primary/90 transition-colors shadow-lg text-sm sm:text-base md:text-lg font-semibold min-h-[44px] touch-manipulation"
            >
              <FiPlus className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
              <span className="hidden sm:inline">Post New Problem</span>
              <span className="sm:hidden">New Problem</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            <div className="bg-card border border-border rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-lg hover:shadow-xl transition-shadow touch-manipulation">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 sm:mb-2 truncate">
                    Total Problems
                  </p>
                  <p className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">
                    {stats.totalProblems}
                  </p>
                </div>
                <div className="p-2 sm:p-3 md:p-4 bg-primary/10 rounded-lg sm:rounded-xl md:rounded-2xl flex-shrink-0">
                  <FiBriefcase className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-primary" />
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-lg hover:shadow-xl transition-shadow touch-manipulation">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 sm:mb-2 truncate">
                    Unsolved Problems
                  </p>
                  <p className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">
                    {stats.activeProblems}
                  </p>
                </div>
                <div className="p-2 sm:p-3 md:p-4 bg-green-100 rounded-lg sm:rounded-xl md:rounded-2xl flex-shrink-0">
                  <FiCheck className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-lg hover:shadow-xl transition-shadow touch-manipulation">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 sm:mb-2 truncate">
                    Total Applicants
                  </p>
                  <p className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">
                    {stats.totalApplicants}
                  </p>
                </div>
                <div className="p-2 sm:p-3 md:p-4 bg-blue-100 rounded-lg sm:rounded-xl md:rounded-2xl flex-shrink-0">
                  <FiUsers className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-lg hover:shadow-xl transition-shadow touch-manipulation">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 sm:mb-2 truncate">
                    Avg. Applicants
                  </p>
                  <p className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">
                    {stats.averageApplicants}
                  </p>
                </div>
                <div className="p-2 sm:p-3 md:p-4 bg-purple-100 rounded-lg sm:rounded-xl md:rounded-2xl flex-shrink-0">
                  <FiUsers className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-purple-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="flex flex-col lg:flex-row gap-3 sm:gap-4">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 sm:left-4 md:left-5 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
              <input
                type="text"
                placeholder="Search problems..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 sm:pl-12 md:pl-14 pr-3 sm:pr-4 md:pr-6 py-3 sm:py-3.5 md:py-4 bg-card border border-border rounded-xl sm:rounded-2xl text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base md:text-lg shadow-sm min-h-[44px]"
              />
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <div className="relative flex-shrink-0">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="appearance-none bg-card border border-border rounded-xl sm:rounded-2xl px-3 sm:px-4 md:px-6 py-3 sm:py-3.5 md:py-4 pr-8 sm:pr-10 md:pr-12 text-foreground focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base md:text-lg shadow-sm min-w-[120px] sm:min-w-[140px] md:min-w-[160px] min-h-[44px]"
                >
                  <option value="">All Status</option>
                  <option value="Unsolved">Unsolved</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Solved">Solved</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
                <FiFilter className="absolute right-2 sm:right-3 md:right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 sm:w-5 sm:h-5 pointer-events-none" />
              </div>

              <div className="flex items-center bg-card border border-border rounded-xl sm:rounded-2xl p-1 sm:p-1.5 md:p-2 shadow-sm">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 sm:p-2.5 md:p-3 rounded-lg sm:rounded-xl transition-colors min-h-[44px] min-w-[44px] touch-manipulation ${
                    viewMode === "grid"
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                  title="Grid View"
                >
                  <FiGrid className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 sm:p-2.5 md:p-3 rounded-lg sm:rounded-xl transition-colors min-h-[44px] min-w-[44px] touch-manipulation ${
                    viewMode === "list"
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                  title="List View"
                >
                  <FiList className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 xl:grid-cols-2 gap-6"
                : "space-y-6"
            }
          >
            {Array.from({ length: 4 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        ) : filteredProblems.length === 0 ? (
          <div className="text-center py-12 sm:py-16 md:py-20 px-4">
            <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-muted rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <FiBriefcase className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 text-muted-foreground" />
            </div>
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mb-3 sm:mb-4">
              No problems found
            </h3>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground mb-6 sm:mb-8 max-w-md mx-auto leading-relaxed">
              {searchTerm || statusFilter
                ? "Try adjusting your search criteria or filters to find problems."
                : "Start by posting your first problem to connect with talented data fellows."}
            </p>
            {!searchTerm && !statusFilter && (
              <button
                onClick={() => openModal()}
                className="inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors text-sm sm:text-base md:text-lg font-semibold shadow-lg min-h-[44px] touch-manipulation"
              >
                <FiPlus className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                <span className="hidden sm:inline">
                  Post Your First Problem
                </span>
                <span className="sm:hidden">Post Problem</span>
              </button>
            )}
          </div>
        ) : (
          <>
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 xl:grid-cols-2 gap-6"
                  : "space-y-4 sm:space-y-6"
              }
            >
              {filteredProblems.map((problem) =>
                viewMode === "grid" ? (
                  <ProblemCard key={problem._id} problem={problem} />
                ) : (
                  <ProblemListItem key={problem._id} problem={problem} />
                )
              )}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-1 sm:gap-2 mt-6 sm:mt-8 md:mt-12 px-3 sm:px-4">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1}
                  className="p-2 sm:p-2.5 rounded-lg border border-border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-h-[44px] min-w-[44px] touch-manipulation"
                  title="Previous page"
                >
                  <FiChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                <div className="flex items-center gap-1 sm:gap-2">
                  {/* Mobile compact pagination */}
                  <div className="sm:hidden flex items-center gap-1">
                    {currentPage > 1 && (
                      <button
                        onClick={() => setCurrentPage(1)}
                        className="px-2.5 py-2 rounded-lg border border-border hover:bg-muted text-sm min-h-[44px] min-w-[44px] touch-manipulation"
                      >
                        1
                      </button>
                    )}
                    {currentPage > 2 && (
                      <span className="text-muted-foreground text-sm px-1">
                        ...
                      </span>
                    )}
                    <button className="px-2.5 py-2 rounded-lg bg-primary text-primary-foreground border-primary text-sm min-h-[44px] min-w-[44px] font-medium">
                      {currentPage}
                    </button>
                    {currentPage < totalPages - 1 && (
                      <span className="text-muted-foreground text-sm px-1">
                        ...
                      </span>
                    )}
                    {currentPage < totalPages && (
                      <button
                        onClick={() => setCurrentPage(totalPages)}
                        className="px-2.5 py-2 rounded-lg border border-border hover:bg-muted text-sm min-h-[44px] min-w-[44px] touch-manipulation"
                      >
                        {totalPages}
                      </button>
                    )}
                  </div>

                  {/* Desktop full pagination */}
                  <div className="hidden sm:flex items-center gap-1 sm:gap-2">
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      let page;
                      if (totalPages <= 5) {
                        page = i + 1;
                      } else if (currentPage <= 3) {
                        page = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        page = totalPages - 4 + i;
                      } else {
                        page = currentPage - 2 + i;
                      }

                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-2 sm:px-4 sm:py-2 rounded-lg border transition-colors text-sm sm:text-base min-h-[44px] min-w-[44px] touch-manipulation ${
                            page === currentPage
                              ? "bg-primary text-primary-foreground border-primary font-medium"
                              : "border-border hover:bg-muted"
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="p-2 sm:p-2.5 rounded-lg border border-border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-h-[44px] min-w-[44px] touch-manipulation"
                  title="Next page"
                >
                  <FiChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <EditProblemModal
        problem={editingProblem}
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingProblem(null);
        }}
        onSuccess={handleEditSuccess}
      />

      <DeleteProblemModal
        problem={deletingProblem}
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeletingProblem(null);
        }}
        onSuccess={handleDeleteSuccess}
      />

      <ViewApplicantsModal
        problemId={selectedProblemId || ""}
        problemTitle={selectedProblemTitle}
        isOpen={showApplicantsModal}
        onClose={() => setShowApplicantsModal(false)}
        onStatusUpdate={() => {
          // Trigger a dashboard refresh by dispatching an event
          window.dispatchEvent(new CustomEvent("applicantStatusUpdated"));
        }}
      />
    </div>
  );
}
