import { createProblem } from "@/api/problems";
import { getAllSkills } from "@/api/profile";
import { useToast } from "@/context/ToastContext";
import { useEffect, useState } from "react";
import {
  FiBriefcase,
  FiChevronLeft,
  FiChevronRight,
  FiDollarSign,
  FiFileText,
  FiLoader,
  FiPlus,
  FiTag,
  FiTarget,
  FiX,
} from "react-icons/fi";

interface PostProblemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  templateData?: any;
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

export default function PostProblemModal({
  isOpen,
  onClose,
  onSuccess,
  templateData,
}: PostProblemModalProps) {
  const { showToast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const [filteredSkills, setFilteredSkills] = useState<string[]>([]);
  const [availableSkills, setAvailableSkills] = useState<string[]>([]);
  const [isLoadingSkills, setIsLoadingSkills] = useState(false);

  const [formData, setFormData] = useState<ProblemFormData>({
    fellowField: "",
    type: [],
    payRange: { min: 0, max: 0 },
    skills: [],
    description: "",
    candidatesQualification: "",
    niceToHaves: "",
  });

  const totalSteps = 4;

  // Reset form when modal opens/closes and populate with template data
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      if (templateData) {
        setFormData({
          fellowField: templateData.fellowField || "",
          type: templateData.type || [],
          payRange: templateData.payRange || { min: 0, max: 0 },
          skills: templateData.skills || [],
          description: templateData.description || "",
          candidatesQualification: templateData.candidatesQualification || "",
          niceToHaves: templateData.niceToHaves || "",
        });
      } else {
        setFormData({
          fellowField: "",
          type: [],
          payRange: { min: 0, max: 0 },
          skills: [],
          description: "",
          candidatesQualification: "",
          niceToHaves: "",
        });
      }
      setSkillInput("");
    }
  }, [isOpen, templateData]);

  // Load available skills when modal opens
  useEffect(() => {
    if (isOpen && availableSkills.length === 0) {
      const loadSkills = async () => {
        setIsLoadingSkills(true);
        try {
          const skills = await getAllSkills();
          if (skills.length > 0) {
            setAvailableSkills(skills);
          } else {
            // Fallback to static skills if API fails
            setAvailableSkills(COMMON_SKILLS);
          }
        } catch (error) {
          console.error("Error loading skills:", error);
          setAvailableSkills(COMMON_SKILLS);
        } finally {
          setIsLoadingSkills(false);
        }
      };
      loadSkills();
    }
  }, [isOpen, availableSkills.length]);

  // Filter skills based on input
  useEffect(() => {
    if (skillInput.trim() && availableSkills.length > 0) {
      const filtered = availableSkills.filter((skill) => {
        const skillStr = typeof skill === "string" ? skill : String(skill);
        return (
          skillStr.toLowerCase().includes(skillInput.toLowerCase()) &&
          !formData.skills.includes(skillStr)
        );
      });
      setFilteredSkills(filtered.slice(0, 10)); // Show top 10 matches
    } else {
      setFilteredSkills([]);
    }
  }, [skillInput, formData.skills, availableSkills]);

  const handleInputChange = (field: keyof ProblemFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleTypeToggle = (type: string) => {
    setFormData((prev) => ({
      ...prev,
      type: prev.type.includes(type)
        ? prev.type.filter((t) => t !== type)
        : [...prev.type, type],
    }));
  };

  const handleSkillAdd = (skill: string) => {
    if (!formData.skills.includes(skill)) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, skill],
      }));
    }
    setSkillInput("");
  };

  const handleSkillRemove = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  };

  const handleCustomSkillAdd = () => {
    const trimmedSkill = skillInput.trim();
    if (trimmedSkill && !formData.skills.includes(trimmedSkill)) {
      handleSkillAdd(trimmedSkill);
    }
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return formData.fellowField.trim() !== "" && formData.type.length > 0;
      case 2:
        return (
          formData.payRange.min > 0 &&
          formData.payRange.max > formData.payRange.min
        );
      case 3:
        return formData.skills.length > 0;
      case 4:
        return (
          formData.description.trim() !== "" &&
          formData.candidatesQualification.trim() !== ""
        );
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    } else {
      showToast("Please complete all required fields", "error");
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) {
      showToast("Please complete all required fields", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await createProblem(formData);

      if (result.success) {
        showToast("Problem posted successfully!", "success");
        onSuccess?.();
        onClose();
      } else {
        showToast(result.message || "Failed to post problem", "error");
      }
    } catch (error) {
      console.error("Error posting problem:", error);
      showToast("Failed to post problem. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-primary via-primary/90 to-primary/70 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <FiBriefcase className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">
                Problem Details
              </h3>
              <p className="text-muted-foreground text-lg">
                Let's start with the basic information about your problem
              </p>
            </div>

            <div className="space-y-8">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-3">
                  Fellow Field *
                </label>
                <input
                  type="text"
                  value={formData.fellowField}
                  onChange={(e) =>
                    handleInputChange("fellowField", e.target.value)
                  }
                  className="w-full p-4 border-2 border-border rounded-xl bg-card text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all text-lg"
                  placeholder="e.g., Data Science, Machine Learning, Analytics..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-4">
                  Work Type *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {WORK_TYPES.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handleTypeToggle(type)}
                      className={`p-4 rounded-xl border-2 text-sm font-medium transition-all duration-200 hover:scale-[1.02] ${
                        formData.type.includes(type)
                          ? "bg-primary text-white border-primary shadow-lg"
                          : "bg-card border-border text-foreground hover:border-primary/30 hover:bg-primary/5"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
                {formData.type.length > 0 && (
                  <div className="mt-3 p-3 bg-primary/5 rounded-lg border border-primary/20">
                    <p className="text-sm text-primary font-medium">
                      Selected: {formData.type.join(", ")}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 via-green-500/90 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <FiDollarSign className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">
                Compensation
              </h3>
              <p className="text-muted-foreground text-lg">
                Set the salary range for this position
              </p>
            </div>

            <div className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-card border border-border p-6 rounded-2xl">
                  <label className="block text-sm font-semibold text-foreground mb-3">
                    Minimum Salary (USD) *
                  </label>
                  <div className="relative">
                    <FiDollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                    <input
                      type="number"
                      value={formData.payRange.min || ""}
                      onChange={(e) =>
                        handleInputChange("payRange", {
                          ...formData.payRange,
                          min: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-full pl-12 pr-4 py-4 border-2 border-border rounded-xl bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all text-lg font-medium"
                      placeholder="50,000"
                      min="0"
                    />
                  </div>
                </div>

                <div className="bg-card border border-border p-6 rounded-2xl">
                  <label className="block text-sm font-semibold text-foreground mb-3">
                    Maximum Salary (USD) *
                  </label>
                  <div className="relative">
                    <FiDollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                    <input
                      type="number"
                      value={formData.payRange.max || ""}
                      onChange={(e) =>
                        handleInputChange("payRange", {
                          ...formData.payRange,
                          max: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-full pl-12 pr-4 py-4 border-2 border-border rounded-xl bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all text-lg font-medium"
                      placeholder="80,000"
                      min={formData.payRange.min || 0}
                    />
                  </div>
                </div>
              </div>

              {formData.payRange.min > 0 && formData.payRange.max > 0 && (
                <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <FiTarget className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-lg font-bold text-foreground">
                      Salary Range: ${formData.payRange.min.toLocaleString()} -
                      ${formData.payRange.max.toLocaleString()} USD
                    </p>
                  </div>
                  {formData.payRange.max <= formData.payRange.min && (
                    <div className="flex items-center gap-2 mt-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                      <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">!</span>
                      </div>
                      <p className="text-red-600 dark:text-red-400 text-sm font-medium">
                        Maximum salary must be greater than minimum salary
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 rounded-xl shadow-lg w-fit mx-auto mb-4">
                <FiTag className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                Required Skills
              </h3>
              <p className="text-muted-foreground">
                Add the skills required for this position
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Skills *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        if (filteredSkills.length > 0) {
                          handleSkillAdd(filteredSkills[0]);
                        } else {
                          handleCustomSkillAdd();
                        }
                      }
                    }}
                    className="w-full p-3 border border-border rounded-xl bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="Type to search skills or add custom skill..."
                  />
                  {skillInput.trim() && (
                    <button
                      type="button"
                      onClick={handleCustomSkillAdd}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-primary text-white p-1 rounded-lg hover:bg-primary/90 transition-all"
                    >
                      <FiPlus className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Filtered Skills Dropdown */}
                {filteredSkills.length > 0 && (
                  <div className="mt-2 bg-background border border-border rounded-xl shadow-lg max-h-48 overflow-y-auto scrollbar-hide">
                    {filteredSkills.map((skill) => (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => handleSkillAdd(skill)}
                        className="w-full text-left p-3 hover:bg-muted/50 transition-all text-foreground border-b border-border/50 last:border-b-0"
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Selected Skills */}
              {formData.skills.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-foreground mb-2">
                    Selected Skills ({formData.skills.length})
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {formData.skills.map((skill) => (
                      <span
                        key={skill}
                        className="bg-primary/10 border border-primary/20 text-primary px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => handleSkillRemove(skill)}
                          className="hover:bg-primary/20 rounded-full p-0.5 transition-all"
                        >
                          <FiX className="w-3 h-3" />
                        </button>
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
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-3 rounded-xl shadow-lg w-fit mx-auto mb-4">
                <FiFileText className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                Job Description
              </h3>
              <p className="text-muted-foreground">
                Provide detailed information about the role
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Problem Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  rows={4}
                  className="w-full p-3 border border-border rounded-xl bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                  placeholder="Describe the problem and what the fellow will be working on..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Required Qualifications *
                </label>
                <textarea
                  value={formData.candidatesQualification}
                  onChange={(e) =>
                    handleInputChange("candidatesQualification", e.target.value)
                  }
                  rows={3}
                  className="w-full p-3 border border-border rounded-xl bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                  placeholder="What qualifications and experience should candidates have?"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Nice to Have
                </label>
                <textarea
                  value={formData.niceToHaves}
                  onChange={(e) =>
                    handleInputChange("niceToHaves", e.target.value)
                  }
                  rows={3}
                  className="w-full p-3 border border-border rounded-xl bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                  placeholder="Additional skills or experience that would be beneficial..."
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-background border border-border rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              Post a Problem
            </h2>
            <p className="text-muted-foreground mt-1">
              Step {currentStep} of {totalSteps}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-all"
            disabled={isSubmitting}
          >
            <FiX className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-4 border-b border-border">
          <div className="flex items-center space-x-2">
            {Array.from({ length: totalSteps }).map((_, index) => (
              <div
                key={index}
                className={`flex-1 h-2 rounded-full transition-all ${
                  index + 1 <= currentStep ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto scrollbar-hide max-h-[calc(90vh-240px)]">
          {renderStep()}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border bg-muted/20">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1 || isSubmitting}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-background text-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <FiChevronLeft className="w-4 h-4" />
            Previous
          </button>

          <div className="flex items-center space-x-2">
            {Array.from({ length: totalSteps }).map((_, index) => (
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

          {currentStep < totalSteps ? (
            <button
              onClick={handleNext}
              disabled={!validateStep(currentStep) || isSubmitting}
              className="flex items-center gap-2 px-6 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Next
              <FiChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!validateStep(currentStep) || isSubmitting}
              className="flex items-center gap-2 px-6 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isSubmitting ? (
                <>
                  <FiLoader className="w-4 h-4 animate-spin" />
                  Posting...
                </>
              ) : (
                <>
                  <FiTarget className="w-4 h-4" />
                  Post Problem
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
