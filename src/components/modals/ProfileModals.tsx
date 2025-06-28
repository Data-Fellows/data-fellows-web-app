import { Education, Skill, UserProfile, WorkExperience } from "@/api/profile";
import dayjs from "dayjs";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  FiAlertTriangle,
  FiBook,
  FiBriefcase,
  FiEdit,
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
  companyName: string;
  roleHeld: string;
  location: string;
  responsibilities: string;
  currentRole: boolean;
  dateStarted?: Date;
  dateEnded?: Date;
};

type EducationFormData = {
  institutionName: string;
  degree: string;
  course: string;
  grade: string;
  isCompleted: boolean;
  entryPeriod?: Date;
  completionDate?: Date;
};

type SkillFormData = {
  name: string;
  level?: string;
};

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
          className="h-12 border border-border rounded-lg px-3 py-2 w-full text-base bg-background dark:bg-zinc-900 text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition"
        />
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
            className="h-10 px-6 text-base rounded-lg border border-border bg-gray-100 dark:bg-zinc-800 font-semibold hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
            onClick={onClose}
            type="button"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            className="h-10 px-6 text-base rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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

// Work Experience Modal
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
        companyName: "",
        roleHeld: "",
        location: "",
        responsibilities: "",
        currentRole: false,
        dateStarted: undefined,
        dateEnded: undefined,
      },
    });

  const isEditing = !!workExperience;

  useEffect(() => {
    if (isOpen) {
      if (workExperience) {
        reset({
          companyName: workExperience.companyName || "",
          roleHeld: workExperience.roleHeld || "",
          location: workExperience.location || "",
          responsibilities: workExperience.responsibilities || "",
          currentRole: workExperience.isCurrentRole || false,
          dateStarted: workExperience.dateStarted
            ? new Date(workExperience.dateStarted)
            : undefined,
          dateEnded: workExperience.dateEnded
            ? new Date(workExperience.dateEnded)
            : undefined,
        });
      } else {
        reset({
          companyName: "",
          roleHeld: "",
          location: "",
          responsibilities: "",
          currentRole: false,
          dateStarted: undefined,
          dateEnded: undefined,
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
            className="h-10 px-6 text-base rounded-lg border border-border bg-gray-100 dark:bg-zinc-800 font-semibold hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
            onClick={onClose}
            type="button"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            className="h-10 px-6 text-base rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleSubmit(onSubmit)}
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : isEditing ? "Update" : "Add"}
          </button>
        </>
      }
    >
      <form className="space-y-4">
        <div>
          <label className="block mb-1 text-sm font-medium">Job Title *</label>
          <input
            {...register("roleHeld", { required: "Job title is required" })}
            className="h-12 border border-border rounded-lg px-3 py-2 w-full text-base bg-background dark:bg-zinc-900 text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition"
            placeholder="Software Engineer"
          />
          {formState.errors.roleHeld && (
            <div className="text-red-500 text-xs mt-1">
              {formState.errors.roleHeld.message}
            </div>
          )}
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">Company *</label>
          <input
            {...register("companyName", { required: "Company is required" })}
            className="h-12 border border-border rounded-lg px-3 py-2 w-full text-base bg-background dark:bg-zinc-900 text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition"
            placeholder="Tech Corp"
          />
          {formState.errors.companyName && (
            <div className="text-red-500 text-xs mt-1">
              {formState.errors.companyName.message}
            </div>
          )}
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">Location</label>
          <input
            {...register("location")}
            className="h-12 border border-border rounded-lg px-3 py-2 w-full text-base bg-background dark:bg-zinc-900 text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition"
            placeholder="San Francisco, CA"
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            {...register("currentRole")}
            className="h-5 w-5 accent-primary rounded"
            id="currentRole"
          />
          <label htmlFor="currentRole" className="text-sm">
            I currently work here
          </label>
        </div>

        <div className="flex w-full space-x-4">
          <DatePicker
            value={watch("dateStarted")}
            onChange={(date) => setValue("dateStarted", date)}
            label="Start Date"
            max={
              watch("currentRole")
                ? undefined
                : watch("dateEnded")
                ? dayjs(watch("dateEnded")).format("YYYY-MM")
                : undefined
            }
            disabled={isLoading}
          />
          {!watch("currentRole") && (
            <DatePicker
              value={watch("dateEnded")}
              onChange={(date) => setValue("dateEnded", date)}
              label="End Date"
              min={
                watch("dateStarted")
                  ? dayjs(watch("dateStarted")).format("YYYY-MM")
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
            {...register("responsibilities")}
            className="h-24 border border-border rounded-lg px-3 py-2 w-full text-base bg-background dark:bg-zinc-900 text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition"
            placeholder="Describe your role and achievements..."
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
        institutionName: "",
        degree: "",
        course: "",
        grade: "",
        isCompleted: false,
        entryPeriod: undefined,
        completionDate: undefined,
      },
    });

  const isEditing = !!education;

  useEffect(() => {
    if (isOpen) {
      if (education) {
        reset({
          institutionName: education.institutionName || "",
          degree: education.degree || "",
          course: education.course || "",
          grade: education.grade || "",
          isCompleted: education.isCompleted || false,
          entryPeriod: education.entryPeriod
            ? new Date(education.entryPeriod)
            : undefined,
          completionDate: education.completionDate
            ? new Date(education.completionDate)
            : undefined,
        });
      } else {
        reset({
          institutionName: "",
          degree: "",
          course: "",
          grade: "",
          isCompleted: false,
          entryPeriod: undefined,
          completionDate: undefined,
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
      title={isEditing ? "Edit Education" : "Add Education"}
      icon={<FiBook className="w-5 h-5 text-primary" />}
      footer={
        <>
          <button
            className="h-10 px-6 text-base rounded-lg border border-border bg-gray-100 dark:bg-zinc-800 font-semibold hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
            onClick={onClose}
            type="button"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            className="h-10 px-6 text-base rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleSubmit(onSubmit)}
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : isEditing ? "Update" : "Add"}
          </button>
        </>
      }
    >
      <form className="space-y-4">
        <div>
          <label className="block mb-1 text-sm font-medium">
            Institution *
          </label>
          <input
            {...register("institutionName", {
              required: "Institution is required",
            })}
            className="h-12 border border-border rounded-lg px-3 py-2 w-full text-base bg-background dark:bg-zinc-900 text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition"
            placeholder="University of California"
          />
          {formState.errors.institutionName && (
            <div className="text-red-500 text-xs mt-1">
              {formState.errors.institutionName.message}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-sm font-medium">Degree *</label>
            <input
              {...register("degree", { required: "Degree is required" })}
              className="h-12 border border-border rounded-lg px-3 py-2 w-full text-base bg-background dark:bg-zinc-900 text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition"
              placeholder="Bachelor's"
            />
            {formState.errors.degree && (
              <div className="text-red-500 text-xs mt-1">
                {formState.errors.degree.message}
              </div>
            )}
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Course *</label>
            <input
              {...register("course", { required: "Course is required" })}
              className="h-12 border border-border rounded-lg px-3 py-2 w-full text-base bg-background dark:bg-zinc-900 text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition"
              placeholder="Computer Science"
            />
            {formState.errors.course && (
              <div className="text-red-500 text-xs mt-1">
                {formState.errors.course.message}
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">Grade/GPA</label>
          <input
            {...register("grade")}
            className="h-12 border border-border rounded-lg px-3 py-2 w-full text-base bg-background dark:bg-zinc-900 text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition"
            placeholder="3.8 GPA or First Class"
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            {...register("currentlyStudying")}
            className="h-5 w-5 accent-primary rounded"
            id="currentlyStudying"
          />
          <label htmlFor="currentlyStudying" className="text-sm">
            I am currently studying here
          </label>
        </div>

        <div className="flex w-full space-x-4">
          <DatePicker
            value={watch("startDate")}
            onChange={(date) => setValue("startDate", date)}
            label="Start Date"
            max={
              watch("currentlyStudying")
                ? undefined
                : watch("endDate")
                ? dayjs(watch("endDate")).format("YYYY-MM")
                : undefined
            }
            disabled={isLoading}
          />
          {!watch("currentlyStudying") && (
            <DatePicker
              value={watch("endDate")}
              onChange={(date) => setValue("endDate", date)}
              label="End Date"
              min={
                watch("startDate")
                  ? dayjs(watch("startDate")).format("YYYY-MM")
                  : undefined
              }
              disabled={isLoading}
            />
          )}
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">Description</label>
          <textarea
            {...register("description")}
            className="h-24 border border-border rounded-lg px-3 py-2 w-full text-base bg-background dark:bg-zinc-900 text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition"
            placeholder="Relevant coursework, projects, achievements..."
          />
        </div>
      </form>
    </BaseModal>
  );
}

// Skills Modal
export function SkillsModal({
  isOpen,
  onClose,
  skill,
  onSave,
  isLoading,
}: {
  isOpen: boolean;
  onClose: () => void;
  skill?: Skill;
  onSave: (data: SkillFormData) => void;
  isLoading: boolean;
}) {
  const { register, handleSubmit, reset, formState } = useForm<SkillFormData>({
    defaultValues: {
      name: "",
      level: "Intermediate",
    },
  });

  const isEditing = !!skill;

  useEffect(() => {
    if (isOpen) {
      if (skill) {
        reset({
          name: skill.name || "",
          level: skill.level || "Intermediate",
        });
      } else {
        reset({
          name: "",
          level: "Intermediate",
        });
      }
    }
  }, [isOpen, skill, reset]);

  const onSubmit = (data: SkillFormData) => {
    onSave(data);
  };

  if (!isOpen) return null;

  return (
    <BaseModal
      onClose={onClose}
      title={isEditing ? "Edit Skill" : "Add Skill"}
      icon={<FiEdit className="w-5 h-5 text-primary" />}
      footer={
        <>
          <button
            className="h-10 px-6 text-base rounded-lg border border-border bg-gray-100 dark:bg-zinc-800 font-semibold hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
            onClick={onClose}
            type="button"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            className="h-10 px-6 text-base rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleSubmit(onSubmit)}
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : isEditing ? "Update" : "Add"}
          </button>
        </>
      }
    >
      <form className="space-y-4">
        <div>
          <label className="block mb-1 text-sm font-medium">Skill Name *</label>
          <input
            {...register("name", { required: "Skill name is required" })}
            className="h-12 border border-border rounded-lg px-3 py-2 w-full text-base bg-background dark:bg-zinc-900 text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition"
            placeholder="JavaScript, Python, Design..."
          />
          {formState.errors.name && (
            <div className="text-red-500 text-xs mt-1">
              {formState.errors.name.message}
            </div>
          )}
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">
            Proficiency Level
          </label>
          <select
            {...register("level")}
            className="h-12 border border-border rounded-lg px-3 py-2 w-full text-base bg-background dark:bg-zinc-900 text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition"
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
            <option value="Expert">Expert</option>
          </select>
        </div>
      </form>
    </BaseModal>
  );
}

// Delete Confirmation Modal
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
            className="h-10 px-6 text-base rounded-lg border border-border bg-gray-100 dark:bg-zinc-800 font-semibold hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
            onClick={onClose}
            type="button"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            className="h-10 px-6 text-base rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
