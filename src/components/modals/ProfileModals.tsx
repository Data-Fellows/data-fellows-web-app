import { Education, UserProfile, WorkExperience } from "@/api/profile";
import { getAvailableSkillsApi } from "@/views/onboarding/api";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  FiAlertTriangle,
  FiBook,
  FiBriefcase,
  FiUser,
  FiX,
} from "react-icons/fi";

// Form Types
type ProfileFormData = {
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  bio: string;
  dateOfBirth?: Date;
};

type WorkExperienceFormData = {
  title: string;
  company: string;
  location: string;
  description: string;
  currentlyWorking: boolean;
  startDate?: Date;
  endDate?: Date;
};

type EducationFormData = {
  school: string;
  degree: string;
  fieldOfStudy: string;
  description: string;
  currentlyInSchool: boolean;
  startYear?: string;
  endYear?: string;
};

interface Skill {
  _id: string;
  name: string;
}

interface SkillsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSkills: Skill[];
  onSave: (skills: Skill[]) => void;
  isLoading: boolean;
}
// Modal Overlay
const ModalOverlay = ({ onClick }: { onClick: () => void }) => (
  <div
    className="fixed inset-0 z-40 bg-black/80 transition-opacity"
    onClick={onClick}
  />
);

// Base Modal Component
function BaseModal({
  children,
  onClose,
  title,
  icon,
  footer,
}: {
  children: React.ReactNode;
  onClose: () => void;
  title: string;
  icon: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <>
      <ModalOverlay onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center px-2">
        <div
          className="relative w-full max-w-lg mx-auto bg-background dark:bg-zinc-900 text-foreground rounded-2xl shadow-2xl flex flex-col border border-border"
          style={{
            maxHeight: "90vh",
            minHeight: "0",
            margin: "auto",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between px-6 pt-6 pb-2 border-b border-border bg-background dark:bg-zinc-900 rounded-t-2xl">
            <div className="flex items-center gap-2">
              {icon}
              <h3 className="text-lg font-bold">{title}</h3>
            </div>
            <button
              className="text-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              onClick={onClose}
              aria-label="Close"
              type="button"
            >
              <FiX size={24} />
            </button>
          </div>
          <div className="overflow-y-auto px-6 py-4 flex-1 custom-scrollbar">
            {children}
          </div>
          <div className="px-6 pb-6 pt-4 bg-background dark:bg-zinc-900 rounded-b-2xl flex justify-end gap-3 border-t border-border">
            {footer}
          </div>
        </div>
      </div>
    </>
  );
}

// Date Picker Component
function DatePicker({
  value,
  onChange,
  min,
  max,
  label,
  disabled,
}: {
  value?: Date;
  onChange: (date: Date) => void;
  min?: string;
  max?: string;
  label: string;
  disabled?: boolean;
}) {
  return (
    <div className="mb-2 flex-1">
      <label className="block mb-1 text-sm font-medium">{label}</label>
      <div className="relative">
        <input
          type="month"
          value={
            value
              ? `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(
                  2,
                  "0"
                )}`
              : ""
          }
          onChange={(e) => {
            if (e.target.value) {
              const [year, month] = e.target.value.split("-");
              onChange(new Date(parseInt(year), parseInt(month) - 1, 1));
            }
          }}
          min={min}
          max={max}
          disabled={disabled}
          className="h-12 border border-border rounded-lg px-3 py-2 w-full text-base bg-background dark:bg-zinc-900 text-foreground pr-10 focus:ring-2 focus:ring-primary focus:border-primary transition"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
            <path
              d="M7 10l5 5 5-5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>
    </div>
  );
}

// Profile Edit Modal
export function ProfileEditModal({
  isOpen,
  onClose,
  profile,
  onSave,
  isLoading,
}: {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onSave: (data: ProfileFormData) => void;
  isLoading: boolean;
}) {
  const { register, handleSubmit, reset, setValue, watch, formState } =
    useForm<ProfileFormData>({
      defaultValues: {
        firstName: profile?.firstName || "",
        lastName: profile?.lastName || "",
        phone: profile?.phone || "",
        address: profile?.address || "",
        city: profile?.city || "",
        state: profile?.state || "",
        country: profile?.country || "",
        bio: profile?.bio || "",
        dateOfBirth: profile?.dateOfBirth
          ? new Date(profile.dateOfBirth)
          : undefined,
      },
    });

  useEffect(() => {
    if (profile && isOpen) {
      reset({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        phone: profile.phone || "",
        address: profile.address || "",
        city: profile.city || "",
        state: profile.state || "",
        country: profile.country || "",
        bio: profile.bio || "",
        dateOfBirth: profile.dateOfBirth
          ? new Date(profile.dateOfBirth)
          : undefined,
      });
    }
  }, [profile, isOpen, reset]);

  const onSubmit = (data: ProfileFormData) => {
    onSave(data);
  };

  if (!isOpen) return null;

  return (
    <BaseModal
      onClose={onClose}
      title="Edit Profile"
      icon={<FiUser className="w-5 h-5 text-primary" />}
      footer={
        <>
          <button
            className="h-12 px-6 text-base rounded-lg border border-border bg-background hover:bg-gray-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 font-semibold transition"
            onClick={onClose}
            type="button"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            className="h-12 px-6 text-base text-white bg-primary rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleSubmit(onSubmit)}
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
        </>
      }
    >
      <form className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-sm font-medium">
              First Name *
            </label>
            <input
              {...register("firstName", { required: "First name is required" })}
              className="h-12 border border-border rounded-lg px-3 py-2 w-full text-base bg-background dark:bg-zinc-900 text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition"
              placeholder="John"
            />
            {formState.errors.firstName && (
              <div className="text-red-500 text-xs mt-1">
                {formState.errors.firstName.message}
              </div>
            )}
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">
              Last Name *
            </label>
            <input
              {...register("lastName", { required: "Last name is required" })}
              className="h-12 border border-border rounded-lg px-3 py-2 w-full text-base bg-background dark:bg-zinc-900 text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition"
              placeholder="Doe"
            />
            {formState.errors.lastName && (
              <div className="text-red-500 text-xs mt-1">
                {formState.errors.lastName.message}
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">Phone</label>
          <input
            {...register("phone")}
            className="h-12 border border-border rounded-lg px-3 py-2 w-full text-base bg-background dark:bg-zinc-900 text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition"
            placeholder="+1 (555) 123-4567"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">Address</label>
          <input
            {...register("address")}
            className="h-12 border border-border rounded-lg px-3 py-2 w-full text-base bg-background dark:bg-zinc-900 text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition"
            placeholder="123 Main Street"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block mb-1 text-sm font-medium">City</label>
            <input
              {...register("city")}
              className="h-12 border border-border rounded-lg px-3 py-2 w-full text-base bg-background dark:bg-zinc-900 text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition"
              placeholder="New York"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">State</label>
            <input
              {...register("state")}
              className="h-12 border border-border rounded-lg px-3 py-2 w-full text-base bg-background dark:bg-zinc-900 text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition"
              placeholder="NY"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Country</label>
            <input
              {...register("country")}
              className="h-12 border border-border rounded-lg px-3 py-2 w-full text-base bg-background dark:bg-zinc-900 text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition"
              placeholder="United States"
            />
          </div>
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">
            Date of Birth
          </label>
          <input
            type="date"
            value={
              watch("dateOfBirth")
                ? dayjs(watch("dateOfBirth")).format("YYYY-MM-DD")
                : ""
            }
            onChange={(e) => {
              if (e.target.value) {
                setValue("dateOfBirth", new Date(e.target.value));
              }
            }}
            max={dayjs().format("YYYY-MM-DD")}
            className="h-12 border border-border rounded-lg px-3 py-2 w-full text-base bg-background dark:bg-zinc-900 text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">Bio</label>
          <textarea
            {...register("bio")}
            className="h-24 border border-border rounded-lg px-3 py-2 w-full text-base bg-background dark:bg-zinc-900 text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition"
            placeholder="Tell us about yourself..."
          />
        </div>
      </form>
    </BaseModal>
  );
}

export function WorkExperienceModal({
  isOpen,
  onClose,
  workExperience,
  onSave,
  isLoading,
}: {
  isOpen: boolean;
  onClose: () => void;
  workExperience?: WorkExperience;
  onSave: (data: WorkExperienceFormData) => void;
  isLoading: boolean;
}) {
  const { register, handleSubmit, reset, setValue, watch, formState } =
    useForm<WorkExperienceFormData>({
      defaultValues: {
        title: "",
        company: "",
        location: "",
        description: "",
        currentlyWorking: false,
        startDate: undefined,
        endDate: undefined,
      },
    });

  const isEditing = !!workExperience;

  useEffect(() => {
    if (isOpen) {
      if (workExperience) {
        // Map the actual data structure from your profile - use 'as any' to handle type flexibility
        const workExp = workExperience as any;
        reset({
          title: workExp.title || workExp.roleHeld || "",
          company: workExp.company || workExp.companyName || "",
          location: workExp.location || "",
          description: workExp.description || workExp.responsibilities || "",
          currentlyWorking:
            !workExp.endDate && !workExp.dateEnded
              ? workExp.isCurrentRole || false
              : false,
          startDate: workExp.startDate
            ? new Date(workExp.startDate)
            : workExp.dateStarted
            ? new Date(workExp.dateStarted)
            : undefined,
          endDate: workExp.endDate
            ? new Date(workExp.endDate)
            : workExp.dateEnded
            ? new Date(workExp.dateEnded)
            : undefined,
        });
      } else {
        reset({
          title: "",
          company: "",
          location: "",
          description: "",
          currentlyWorking: false,
          startDate: undefined,
          endDate: undefined,
        });
      }
    }
  }, [isOpen, workExperience, reset]);

  const onSubmit = (data: WorkExperienceFormData) => {
    onSave(data);
  };

  if (!isOpen) return null;

  return (
    <BaseModal
      onClose={onClose}
      title={isEditing ? "Edit Work Experience" : "Add Work Experience"}
      icon={<FiBriefcase className="w-5 h-5 text-primary" />}
      footer={
        <>
          <button
            className="h-12 px-6 text-base rounded-lg border border-border bg-background hover:bg-gray-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 font-semibold transition"
            onClick={onClose}
            type="button"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            className="h-12 px-6 text-base text-white bg-primary rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleSubmit(onSubmit)}
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : isEditing ? "Update" : "Save"}
          </button>
        </>
      }
    >
      <form className="space-y-4">
        <div>
          <label className="block mb-1 text-sm font-medium">Job Title *</label>
          <input
            {...register("title", {
              required: "Job title is required",
              minLength: {
                value: 2,
                message: "Job title must be at least 2 characters",
              },
            })}
            className="h-12 border border-border rounded-lg px-3 py-2 w-full text-base bg-background dark:bg-zinc-900 text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition"
            placeholder="Ex. Software Engineer"
          />
          {formState.errors.title && (
            <div className="text-red-500 text-xs mt-1">
              {formState.errors.title.message}
            </div>
          )}
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">Company *</label>
          <input
            {...register("company", {
              required: "Company is required",
              minLength: {
                value: 2,
                message: "Company must be at least 2 characters",
              },
            })}
            className="h-12 border border-border rounded-lg px-3 py-2 w-full text-base bg-background dark:bg-zinc-900 text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition"
            placeholder="Ex. Google"
          />
          {formState.errors.company && (
            <div className="text-red-500 text-xs mt-1">
              {formState.errors.company.message}
            </div>
          )}
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">Location</label>
          <input
            {...register("location")}
            className="h-12 border border-border rounded-lg px-3 py-2 w-full text-base bg-background dark:bg-zinc-900 text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition"
            placeholder="Ex. London"
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            {...register("currentlyWorking")}
            className="h-5 w-5 accent-primary rounded"
            id="currentlyWorking"
          />
          <label htmlFor="currentlyWorking" className="text-sm">
            I am currently working in this role
          </label>
        </div>

        <div className="flex w-full space-x-4">
          <DatePicker
            value={watch("startDate")}
            onChange={(date) => setValue("startDate", date)}
            label="Start Date"
            max={
              watch("currentlyWorking")
                ? undefined
                : watch("endDate")
                ? dayjs(watch("endDate")).format("YYYY-MM")
                : undefined
            }
            disabled={isLoading}
          />
          {!watch("currentlyWorking") && (
            <DatePicker
              value={watch("endDate")}
              onChange={(date) => setValue("endDate", date)}
              label="End Date"
              min={
                watch("startDate")
                  ? dayjs(watch("startDate")).format("YYYY-MM")
                  : undefined
              }
              max={dayjs().format("YYYY-MM")}
              disabled={isLoading}
            />
          )}
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">Description</label>
          <textarea
            {...register("description")}
            className="h-24 border border-border rounded-lg px-3 py-2 w-full text-base bg-background dark:bg-zinc-900 text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition"
            placeholder="Description"
          />
        </div>
      </form>
    </BaseModal>
  );
}

// Education Modal
export function EducationModal({
  isOpen,
  onClose,
  education,
  onSave,
  isLoading,
}: {
  isOpen: boolean;
  onClose: () => void;
  education?: Education;
  onSave: (data: EducationFormData) => void;
  isLoading: boolean;
}) {
  const { register, handleSubmit, reset, setValue, watch, formState } =
    useForm<EducationFormData>({
      defaultValues: {
        school: "",
        degree: "",
        fieldOfStudy: "",
        description: "",
        currentlyInSchool: false,
        startYear: "",
        endYear: "",
      },
    });

  const isEditing = !!education;

  useEffect(() => {
    if (isOpen) {
      if (education) {
        // Map the actual data structure from your profile - use 'as any' to handle type flexibility
        const edu = education as any;
        let startYear = "";
        let endYear = "";

        // Handle different possible date field names and formats
        if (edu.startDate) {
          startYear = new Date(edu.startDate).getFullYear().toString();
        } else if (edu.entryPeriod) {
          startYear = new Date(edu.entryPeriod).getFullYear().toString();
        }

        if (edu.endDate) {
          endYear = new Date(edu.endDate).getFullYear().toString();
        } else if (edu.completionDate) {
          endYear = new Date(edu.completionDate).getFullYear().toString();
        }

        reset({
          school: edu.school || edu.institutionName || "",
          degree: edu.degree || "",
          fieldOfStudy: edu.fieldOfStudy || edu.course || "",
          description: edu.description || "",
          currentlyInSchool:
            !edu.endDate && !edu.completionDate && !edu.isCompleted,
          startYear,
          endYear,
        });
      } else {
        reset({
          school: "",
          degree: "",
          fieldOfStudy: "",
          description: "",
          currentlyInSchool: false,
          startYear: "",
          endYear: "",
        });
      }
    }
  }, [isOpen, education, reset]);

  const onSubmit = (data: EducationFormData) => {
    onSave(data);
  };

  if (!isOpen) return null;

  return (
    <BaseModal
      onClose={onClose}
      title={isEditing ? "Edit Education History" : "Add Education History"}
      icon={<FiBook className="w-5 h-5 text-primary" />}
      footer={
        <>
          <button
            className="h-12 px-6 text-base rounded-lg border border-border bg-background hover:bg-gray-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 font-semibold transition"
            onClick={onClose}
            type="button"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            className="h-12 px-6 text-base text-white bg-primary rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleSubmit(onSubmit)}
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : isEditing ? "Update" : "Save"}
          </button>
        </>
      }
    >
      <form className="space-y-4">
        <div>
          <label className="block mb-1 text-sm font-medium">School *</label>
          <input
            {...register("school", {
              required: "School name is required",
              minLength: {
                value: 2,
                message: "School name must be at least 2 characters",
              },
            })}
            className="h-12 border border-border rounded-lg px-3 py-2 w-full text-base bg-background dark:bg-zinc-900 text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition"
            placeholder="Ex. Oxford University"
          />
          {formState.errors.school && (
            <div className="text-red-500 text-xs mt-1">
              {formState.errors.school.message}
            </div>
          )}
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">Degree *</label>
          <input
            {...register("degree", {
              required: "Degree is required",
              minLength: {
                value: 2,
                message: "Degree must be at least 2 characters",
              },
            })}
            className="h-12 border border-border rounded-lg px-3 py-2 w-full text-base bg-background dark:bg-zinc-900 text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition"
            placeholder="Ex. Bachelors"
          />
          {formState.errors.degree && (
            <div className="text-red-500 text-xs mt-1">
              {formState.errors.degree.message}
            </div>
          )}
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">
            Field of Study *
          </label>
          <input
            {...register("fieldOfStudy", {
              required: "Field of study is required",
              minLength: {
                value: 2,
                message: "Field of study must be at least 2 characters",
              },
            })}
            className="h-12 border border-border rounded-lg px-3 py-2 w-full text-base bg-background dark:bg-zinc-900 text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition"
            placeholder="Ex. Computer Science"
          />
          {formState.errors.fieldOfStudy && (
            <div className="text-red-500 text-xs mt-1">
              {formState.errors.fieldOfStudy.message}
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            {...register("currentlyInSchool")}
            className="h-5 w-5 accent-primary rounded"
            id="currentlyInSchool"
          />
          <label htmlFor="currentlyInSchool" className="text-sm">
            I am currently a student
          </label>
        </div>

        <div className="flex w-full space-x-4">
          <div className="flex-1">
            <label className="block mb-1 text-sm font-medium">
              Start Year *
            </label>
            <select
              {...register("startYear", {
                required: "Start year is required",
              })}
              className="h-12 border border-border rounded-lg px-3 py-2 w-full text-base bg-background dark:bg-zinc-900 text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition"
              disabled={isLoading}
            >
              <option value="">Select Year</option>
              {[...Array(30)].map((_, i) => {
                const year = new Date().getFullYear() - i;
                return (
                  <option key={year} value={year}>
                    {year}
                  </option>
                );
              })}
            </select>
            {formState.errors.startYear && (
              <div className="text-red-500 text-xs mt-1">
                {formState.errors.startYear.message}
              </div>
            )}
          </div>
          {!watch("currentlyInSchool") && (
            <div className="flex-1">
              <label className="block mb-1 text-sm font-medium">
                End Year *
              </label>
              <select
                {...register("endYear", {
                  required: !watch("currentlyInSchool")
                    ? "End year is required"
                    : false,
                })}
                className="h-12 border border-border rounded-lg px-3 py-2 w-full text-base bg-background dark:bg-zinc-900 text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition"
                disabled={isLoading}
              >
                <option value="">Select Year</option>
                {[...Array(30)].map((_, i) => {
                  const year = new Date().getFullYear() - i;
                  return (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  );
                })}
              </select>
              {formState.errors.endYear && (
                <div className="text-red-500 text-xs mt-1">
                  {formState.errors.endYear.message}
                </div>
              )}
            </div>
          )}
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">Description</label>
          <textarea
            {...register("description")}
            className="h-24 border border-border rounded-lg px-3 py-2 w-full text-base bg-background dark:bg-zinc-900 text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition"
            placeholder="Description"
          />
        </div>
      </form>
    </BaseModal>
  );
}

export const SkillsModal = ({
  isOpen,
  onClose,
  currentSkills,
  onSave,
  isLoading,
}: SkillsModalProps) => {
  const [selectedSkills, setSelectedSkills] = useState<Skill[]>(currentSkills);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [skillsList, setSkillsList] = useState<Skill[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setSelectedSkills(currentSkills);
      fetchSkills();
    }
  }, [isOpen, currentSkills]);

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const response = await getAvailableSkillsApi();
      setSkillsList(response.skills || []);
    } catch (err) {
      console.error("Error fetching skills:", err);
      setError("Failed to load skills. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const addSkill = (skill: Skill) => {
    if (
      selectedSkills.length < 15 &&
      !selectedSkills.find((s) => s.name === skill.name)
    ) {
      const newSkills = [...selectedSkills, skill];
      setSelectedSkills(newSkills);
    }
    setSearch("");
  };

  const removeSkill = (skillToRemove: Skill) => {
    const isCurrentSkill = currentSkills.find(
      (s) => s.name === skillToRemove.name
    );
    if (isCurrentSkill) {
      return;
    }

    const newSkills = selectedSkills.filter(
      (s) => s.name !== skillToRemove.name
    );
    setSelectedSkills(newSkills);
  };

  const filteredSkills = skillsList.filter(
    (skill) =>
      skill.name.toLowerCase().includes(search.toLowerCase()) &&
      !selectedSkills.find((s) => s.name === skill.name)
  );

  const handleSave = () => {
    onSave(selectedSkills);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card rounded-2xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-foreground">
            Manage Skills
          </h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            ✕
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Your skills</h3>
              <div className="w-full mb-1 relative">
                <div className="flex flex-wrap items-center gap-2 border border-border rounded-lg px-2 py-1 bg-background min-h-[48px]">
                  {selectedSkills.map((skill) => {
                    const isCurrentSkill = currentSkills.find(
                      (s) => s.name === skill.name
                    );
                    return (
                      <div
                        key={skill._id}
                        className={`px-3 py-1 rounded-lg flex items-center ${
                          isCurrentSkill
                            ? "bg-muted/50 text-muted-foreground border border-muted-foreground/30"
                            : "bg-card text-primary border border-primary"
                        }`}
                      >
                        {!isCurrentSkill && (
                          <button
                            type="button"
                            onClick={() => removeSkill(skill)}
                            className="mr-1 text-sm text-primary font-bold hover:text-red-500 transition-colors"
                          >
                            ✕
                          </button>
                        )}
                        <span
                          className={`text-sm ${
                            isCurrentSkill
                              ? "text-muted-foreground"
                              : "text-primary"
                          }`}
                        >
                          {skill.name}
                        </span>
                      </div>
                    );
                  })}
                  <input
                    type="text"
                    placeholder="Search and add skills..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="flex-1 bg-background text-primary outline-none py-3 min-w-[120px]"
                  />
                </div>

                {search && filteredSkills.length > 0 && (
                  <div className="border border-border rounded-lg p-3 mt-2 bg-card shadow-md flex flex-wrap gap-2 z-10 max-h-40 overflow-y-auto">
                    {filteredSkills.map((skill) => (
                      <button
                        key={skill._id}
                        type="button"
                        className="border border-primary m-1 text-sm text-primary text-left px-3 py-2 rounded-lg hover:bg-primary/10 transition-colors"
                        onClick={() => addSkill(skill)}
                      >
                        + {skill.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="text-right text-muted-foreground text-sm">
                {selectedSkills.length}/15 skills
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Suggested skills</h3>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                {skillsList
                  .filter(
                    (skill) =>
                      !selectedSkills.find((s) => s.name === skill.name)
                  )
                  .slice(0, 20)
                  .map((skill) => (
                    <button
                      key={skill._id}
                      type="button"
                      className="border border-primary text-sm text-primary px-3 py-2 rounded-lg hover:bg-primary/10 transition-colors"
                      onClick={() => addSkill(skill)}
                    >
                      + {skill.name}
                    </button>
                  ))}
              </div>
            </div>

            <div className="flex gap-4 justify-end">
              <button
                onClick={onClose}
                className="px-6 py-2 border border-border text-muted-foreground rounded-lg hover:bg-muted/10 transition-colors"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  isLoading,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  isLoading: boolean;
}) {
  if (!isOpen) return null;

  return (
    <BaseModal
      onClose={onClose}
      title="Confirm Deletion"
      icon={<FiAlertTriangle className="w-5 h-5 text-red-500" />}
      footer={
        <>
          <button
            className="h-12 px-6 text-base rounded-lg border border-border bg-background hover:bg-gray-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 font-semibold transition"
            onClick={onClose}
            type="button"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            className="h-12 px-6 text-base rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Delete"}
          </button>
        </>
      }
    >
      <div className="text-center py-4">
        <div className="bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <FiAlertTriangle className="w-8 h-8 text-red-600" />
        </div>
        <h3 className="font-bold text-foreground text-lg mb-2">{title}</h3>
        <p className="text-muted-foreground text-sm">{message}</p>
      </div>
    </BaseModal>
  );
}
