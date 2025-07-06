import { Problem, updateProblem } from "@/api/problems";
import { getAllSkills } from "@/api/profile";
import { useToast } from "@/context/ToastContext";
import { useEffect, useState } from "react";
import {
  FiChevronLeft,
  FiChevronRight,
  FiDollarSign,
  FiLoader,
  FiTarget,
  FiX,
} from "react-icons/fi";

interface EditProblemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  problem: Problem | null;
}

interface ProblemFormData {
  fellowField: string;
  type: string[];
  payRange: {
    min: number;
    max: number;
  };
  skills: string[];
  description: string;
  candidatesQualification: string;
  niceToHaves: string;
}

const WORK_TYPES = [
  "Full-time",
  "Part-time",
  "Contract",
  "Freelance",
  "Internship",
  "Remote",
  "Hybrid",
  "On-site",
];

const FELLOW_FIELDS = [
  "Data Science",
  "Machine Learning",
  "Data Analytics",
  "Business Intelligence",
  "Data Engineering",
  "EdTech",
  "FinTech",
  "HealthTech",
  "E-commerce",
  "Marketing Analytics",
  "Product Analytics",
  "Other",
];

// Common skills list - fallback if API fails
const COMMON_SKILLS = [
  "Python",
  "R",
  "SQL",
  "JavaScript",
  "Power BI",
  "Tableau",
  "Excel",
  "TensorFlow",
  "PyTorch",
  "Pandas",
  "NumPy",
  "Scikit-learn",
  "Data Cleaning",
  "Data Visualization",
  "Machine Learning",
  "Deep Learning",
  "Statistical Analysis",
  "Exploratory Data Analysis",
  "A/B Testing",
  "Regression Analysis",
  "Time Series Analysis",
  "Natural Language Processing",
  "Computer Vision",
  "Apache Spark",
  "Hadoop",
  "AWS",
  "Azure",
  "Google Cloud",
  "Docker",
  "Kubernetes",
];

export default function EditProblemModal({
  isOpen,
  onClose,
  onSuccess,
  problem,
}: EditProblemModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [availableSkills, setAvailableSkills] = useState<string[]>([]);
  const [skillsLoading, setSkillsLoading] = useState(false);
  const { showToast } = useToast();

  const [formData, setFormData] = useState<ProblemFormData>({
    fellowField: "",
    type: [],
    payRange: {
      min: 0,
      max: 0,
    },
    skills: [],
    description: "",
    candidatesQualification: "",
    niceToHaves: "",
  });

  // Prefill form data when problem changes
  useEffect(() => {
    if (problem && isOpen) {
      setFormData({
        fellowField: problem.fellowField || "",
        type: problem.type || [],
        payRange: {
          min: problem.payRange?.min || 0,
          max: problem.payRange?.max || 0,
        },
        skills: problem.skills || [],
        description: problem.description || "",
        candidatesQualification: problem.candidatesQualification || "",
        niceToHaves: problem.niceToHaves || "",
      });
      setCurrentStep(1);
    }
  }, [problem, isOpen]);

  // Load skills on mount
  useEffect(() => {
    if (isOpen) {
      loadSkills();
    }
  }, [isOpen]);

  const loadSkills = async () => {
    setSkillsLoading(true);
    try {
      const skills = await getAllSkills();
      setAvailableSkills(skills);
    } catch (error) {
      console.error("Failed to load skills:", error);
      setAvailableSkills(COMMON_SKILLS);
    } finally {
      setSkillsLoading(false);
    }
  };

  const handleInputChange = (field: keyof ProblemFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleWorkTypeToggle = (type: string) => {
    setFormData((prev) => ({
      ...prev,
      type: prev.type.includes(type)
        ? prev.type.filter((t) => t !== type)
        : [...prev.type, type],
    }));
  };

  const handleSkillToggle = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill],
    }));
  };

  const handleSalaryChange = (type: "min" | "max", value: string) => {
    const numValue = parseInt(value) || 0;
    setFormData((prev) => ({
      ...prev,
      payRange: {
        ...prev.payRange,
        [type]: numValue,
      },
    }));
  };

  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        return formData.fellowField && formData.type.length > 0;
      case 2:
        return formData.payRange.min > 0 && formData.payRange.max > 0;
      case 3:
        return formData.skills.length > 0;
      case 4:
        return (
          formData.description.trim() && formData.candidatesQualification.trim()
        );
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    } else {
      showToast("Please fill in all required fields", "error");
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!problem) return;

    if (!validateStep(4)) {
      showToast("Please fill in all required fields", "error");
      return;
    }

    setIsLoading(true);
    try {
      const response = await updateProblem(problem._id, formData);

      console.log("Update response:", response);
      if (response?.status === "OK") {
        showToast(
          response.message || "Problem updated successfully!",
          "success"
        );
        onSuccess?.();
        onClose();
      } else {
        showToast(response.message || "Failed to update problem", "error");
      }
    } catch (error: any) {
      console.error("Error updating problem:", error);
      showToast(
        error.response?.data?.message || "Failed to update problem",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setCurrentStep(1);
    onClose();
  };

  if (!isOpen || !problem) return null;

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4 sm:space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Fellow Field <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.fellowField}
                onChange={(e) =>
                  handleInputChange("fellowField", e.target.value)
                }
                placeholder="e.g., Data Science, Machine Learning"
                className="w-full px-3 sm:px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base min-h-[44px] touch-manipulation"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                Work Types <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                {WORK_TYPES.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleWorkTypeToggle(type)}
                    className={`px-3 sm:px-4 py-2.5 sm:py-2 rounded-lg border transition-all text-xs sm:text-sm font-medium min-h-[44px] touch-manipulation ${
                      formData.type.includes(type)
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border bg-background text-foreground hover:bg-muted"
                    }`}
                  >
                    {type}
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
              <label className="block text-sm font-medium text-foreground mb-3">
                Salary Range <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs text-muted-foreground mb-2">
                    Minimum (₦)
                  </label>
                  <div className="relative">
                    <FiDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <input
                      type="number"
                      value={formData.payRange.min || ""}
                      onChange={(e) =>
                        handleSalaryChange("min", e.target.value)
                      }
                      placeholder="0"
                      className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-3 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base min-h-[44px] touch-manipulation"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-2">
                    Maximum (₦)
                  </label>
                  <div className="relative">
                    <FiDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <input
                      type="number"
                      value={formData.payRange.max || ""}
                      onChange={(e) =>
                        handleSalaryChange("max", e.target.value)
                      }
                      placeholder="0"
                      className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-3 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base min-h-[44px] touch-manipulation"
                    />
                  </div>
                </div>
              </div>
              {formData.payRange.min > 0 && formData.payRange.max > 0 && (
                <div className="mt-3 p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Range: ${formData.payRange.min.toLocaleString()} - $
                    {formData.payRange.max.toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4 sm:space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                Required Skills <span className="text-red-500">*</span>
              </label>
              {skillsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <FiLoader className="w-5 h-5 sm:w-6 sm:h-6 animate-spin text-primary" />
                  <span className="ml-2 text-muted-foreground text-sm sm:text-base">
                    Loading skills...
                  </span>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 max-h-48 sm:max-h-64 overflow-y-auto scrollbar-hide">
                  {availableSkills.map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => handleSkillToggle(skill)}
                      className={`px-2.5 sm:px-3 py-2 text-xs sm:text-sm rounded-lg border transition-all min-h-[44px] touch-manipulation ${
                        formData.skills.includes(skill)
                          ? "bg-primary text-primary-foreground border-primary"
                          : "border-border bg-background text-foreground hover:bg-muted"
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              )}
              {formData.skills.length > 0 && (
                <div className="mt-3 p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">
                    Selected skills ({formData.skills.length}):
                  </p>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {formData.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-1 bg-primary text-primary-foreground text-xs rounded-md"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4 sm:space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Problem Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                placeholder="Describe the problem you need solved..."
                rows={3}
                className="w-full px-3 sm:px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent resize-none text-sm sm:text-base touch-manipulation"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Candidate Qualifications <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.candidatesQualification}
                onChange={(e) =>
                  handleInputChange("candidatesQualification", e.target.value)
                }
                placeholder="List the required qualifications..."
                rows={3}
                className="w-full px-3 sm:px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent resize-none text-sm sm:text-base touch-manipulation"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Nice to Haves
              </label>
              <textarea
                value={formData.niceToHaves}
                onChange={(e) =>
                  handleInputChange("niceToHaves", e.target.value)
                }
                placeholder="Additional preferred qualifications..."
                rows={3}
                className="w-full px-3 sm:px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent resize-none text-sm sm:text-base touch-manipulation"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!isOpen || !problem) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
      <div className="bg-background border border-border rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-sm sm:max-w-lg md:max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden touch-manipulation">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border">
          <div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">
              Edit Problem
            </h2>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base">
              Step {currentStep} of 4
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-muted rounded-lg transition-all min-h-[44px] min-w-[44px] touch-manipulation"
            disabled={isLoading}
          >
            <FiX className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-border">
          <div className="flex items-center space-x-1 sm:space-x-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className={`flex-1 h-1.5 sm:h-2 rounded-full transition-all ${
                  index + 1 <= currentStep ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto scrollbar-hide max-h-[calc(95vh-220px)] sm:max-h-[calc(90vh-240px)]">
          {renderStep()}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-t border-border bg-muted/20">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1 || isLoading}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg border border-border bg-background text-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm sm:text-base min-h-[44px] touch-manipulation"
          >
            <FiChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Previous</span>
          </button>

          <div className="flex items-center space-x-1 sm:space-x-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all ${
                  index + 1 === currentStep
                    ? "bg-primary"
                    : index + 1 < currentStep
                    ? "bg-primary/50"
                    : "bg-muted"
                }`}
              />
            ))}
          </div>

          {currentStep < 4 ? (
            <button
              onClick={handleNext}
              disabled={!validateStep(currentStep) || isLoading}
              className="flex items-center gap-2 px-4 sm:px-6 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm sm:text-base min-h-[44px] touch-manipulation"
            >
              <span className="hidden sm:inline">Next</span>
              <span className="sm:hidden">Next</span>
              <FiChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!validateStep(currentStep) || isLoading}
              className="flex items-center gap-2 px-4 sm:px-6 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm sm:text-base min-h-[44px] touch-manipulation"
            >
              {isLoading ? (
                <>
                  <FiLoader className="w-4 h-4 animate-spin" />
                  <span className="hidden sm:inline">Updating...</span>
                  <span className="sm:hidden">Save</span>
                </>
              ) : (
                <>
                  <FiTarget className="w-4 h-4" />
                  <span className="hidden sm:inline">Update Problem</span>
                  <span className="sm:hidden">Update</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
