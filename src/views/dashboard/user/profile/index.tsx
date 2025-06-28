import {
  DeleteConfirmationModal,
  EducationModal,
  ProfileEditModal,
  SkillsModal,
  WorkExperienceModal,
} from "@/components/modals/ProfileModals";
import { useToast } from "@/context/ToastContext";
import { getUser } from "@/helpers";
import { useProfileData } from "@/hooks/useProfile";
import { useRouter } from "next/router";
import {
  JSXElementConstructor,
  ReactElement,
  ReactNode,
  ReactPortal,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  FiBook,
  FiBriefcase,
  FiCalendar,
  FiCamera,
  FiEdit,
  FiMail,
  FiMapPin,
  FiPhone,
  FiPlus,
  FiTrash2,
  FiUser,
} from "react-icons/fi";

// Skeleton Components
const SkeletonProfileHeader = () => (
  <div className="bg-gradient-to-br from-primary/10 via-card to-accent/5 border border-border rounded-2xl p-8 shadow-lg animate-pulse">
    <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
      <div className="relative">
        <div className="w-32 h-32 bg-muted rounded-full"></div>
        <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-muted rounded-full"></div>
      </div>
      <div className="flex-1 space-y-4">
        <div className="space-y-2">
          <div className="h-8 bg-muted rounded w-64"></div>
          <div className="h-5 bg-muted rounded w-48"></div>
        </div>
        <div className="flex items-center gap-6">
          <div className="h-5 bg-muted rounded w-40"></div>
          <div className="h-5 bg-muted rounded w-32"></div>
        </div>
        <div className="h-4 bg-muted rounded w-full max-w-md"></div>
      </div>
      <div className="h-10 bg-muted rounded w-32"></div>
    </div>
  </div>
);

const SkeletonSection = () => (
  <div className="bg-card border border-border rounded-2xl p-6 shadow-lg animate-pulse">
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <div className="w-6 h-6 bg-muted rounded"></div>
        <div className="h-6 bg-muted rounded w-32"></div>
      </div>
      <div className="w-8 h-8 bg-muted rounded"></div>
    </div>
    <div className="space-y-4">
      <div className="h-4 bg-muted rounded w-full"></div>
      <div className="h-4 bg-muted rounded w-3/4"></div>
      <div className="h-4 bg-muted rounded w-1/2"></div>
    </div>
  </div>
);

export default function ProfilePage() {
  const [isMounted, setIsMounted] = useState(false);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);

  // Modal states
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isWorkModalOpen, setIsWorkModalOpen] = useState(false);
  const [isEducationModalOpen, setIsEducationModalOpen] = useState(false);
  const [isSkillsModalOpen, setIsSkillsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Edit states
  const [editingWorkExperience, setEditingWorkExperience] = useState<any>(null);
  const [editingEducation, setEditingEducation] = useState<any>(null);
  const [editingSkill, setEditingSkill] = useState<any>(null);
  const [deleteItem, setDeleteItem] = useState<{
    type: "work" | "education";
    id: string;
    title: string;
  } | null>(null);

  const user = useMemo(() => getUser(), []);
  const router = useRouter();
  const { showToast } = useToast();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && !user) {
      router.replace("/auth/sign-in");
    }
  }, [isMounted, user, router]);

  const {
    profile,
    isLoading,
    error,
    handleUpdateProfile,
    handleUploadPhoto,
    handleAddWorkExperience,
    handleUpdateWorkExperience,
    handleDeleteWorkExperience,
    handleAddEducation,
    handleUpdateEducation,
    handleDeleteEducation,
    handleUpdateSkills,
    isUpdatingProfile,
    isUploadingPhoto,
  } = useProfileData();

  // Initialize states
  useEffect(() => {
    if (profile) {
      // Any initialization logic if needed
    }
  }, [profile]);

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleUploadPhoto({ photo: file });
    }
  };

  // Modal handlers
  const openEditProfile = () => setIsProfileModalOpen(true);
  const closeEditProfile = () => setIsProfileModalOpen(false);

  const openAddWork = () => {
    setEditingWorkExperience(null);
    setIsWorkModalOpen(true);
  };

  const openEditWork = (workExperience: any) => {
    setEditingWorkExperience(workExperience);
    setIsWorkModalOpen(true);
  };

  const closeWorkModal = () => {
    setIsWorkModalOpen(false);
    setEditingWorkExperience(null);
  };

  const openAddEducation = () => {
    setEditingEducation(null);
    setIsEducationModalOpen(true);
  };

  const openEditEducation = (education: any) => {
    setEditingEducation(education);
    setIsEducationModalOpen(true);
  };

  const closeEducationModal = () => {
    setIsEducationModalOpen(false);
    setEditingEducation(null);
  };

  const openAddSkill = () => {
    setEditingSkill(null);
    setIsSkillsModalOpen(true);
  };

  const openEditSkill = (skill: any) => {
    setEditingSkill(skill);
    setIsSkillsModalOpen(true);
  };

  const closeSkillsModal = () => {
    setIsSkillsModalOpen(false);
    setEditingSkill(null);
  };

  const openDeleteModal = (
    type: "work" | "education",
    id: string,
    title: string
  ) => {
    setDeleteItem({ type, id, title });
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeleteItem(null);
  };

  // Save handlers
  const handleSaveProfile = async (data: any) => {
    try {
      await handleUpdateProfile(data);
      showToast("Profile updated successfully!", "success");
      closeEditProfile();
    } catch (error) {
      showToast("Failed to update profile", "error");
    }
  };

  const handleSaveWorkExperience = async (data: any) => {
    try {
      if (editingWorkExperience) {
        await handleUpdateWorkExperience({
          id: editingWorkExperience.id,
          ...data,
        });
        showToast("Work experience updated successfully!", "success");
      } else {
        await handleAddWorkExperience(data);
        showToast("Work experience added successfully!", "success");
      }
      closeWorkModal();
    } catch (error) {
      showToast("Failed to save work experience", "error");
    }
  };

  const handleSaveEducation = async (data: any) => {
    try {
      if (editingEducation) {
        await handleUpdateEducation({ id: editingEducation.id, ...data });
        showToast("Education updated successfully!", "success");
      } else {
        await handleAddEducation(data);
        showToast("Education added successfully!", "success");
      }
      closeEducationModal();
    } catch (error) {
      showToast("Failed to save education", "error");
    }
  };

  const handleSaveSkill = async (data: any) => {
    try {
      // For skills, we need to manage them differently since the API uses bulk update
      const currentSkills = profile?.skills || [];
      let updatedSkills;

      if (editingSkill) {
        // Update existing skill
        updatedSkills = currentSkills.map((skill) =>
          skill._id === editingSkill._id ? { ...skill, ...data } : skill
        );
      } else {
        // Add new skill
        const newSkill = {
          _id: Date.now().toString(), // Temporary ID for optimistic UI
          ...data,
        };
        updatedSkills = [...currentSkills, newSkill];
      }

      // Convert to the format expected by the API (array of skill names or IDs)
      const skillsPayload = updatedSkills.map(
        (skill) => skill.name || skill._id
      );
      await handleUpdateSkills({ skills: skillsPayload });

      showToast(
        editingSkill
          ? "Skill updated successfully!"
          : "Skill added successfully!",
        "success"
      );
      closeSkillsModal();
    } catch (error) {
      showToast("Failed to save skill", "error");
    }
  };

  const handleDeleteSkill = async (skillId: string) => {
    try {
      const currentSkills = profile?.skills || [];
      const updatedSkills = currentSkills.filter(
        (skill) => skill._id !== skillId
      );
      const skillsPayload = updatedSkills.map(
        (skill) => skill.name || skill._id
      );

      await handleUpdateSkills({ skills: skillsPayload });
      showToast("Skill deleted successfully!", "success");
    } catch (error) {
      showToast("Failed to delete skill", "error");
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteItem) return;

    try {
      switch (deleteItem.type) {
        case "work":
          await handleDeleteWorkExperience(deleteItem.id);
          showToast("Work experience deleted successfully!", "success");
          break;
        case "education":
          await handleDeleteEducation(deleteItem.id);
          showToast("Education deleted successfully!", "success");
          break;
      }
      closeDeleteModal();
    } catch (error) {
      showToast("Failed to delete item", "error");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  if (!user) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-full mx-auto px-4 py-8">
          <SkeletonProfileHeader />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            <SkeletonSection />
            <SkeletonSection />
            <SkeletonSection />
            <SkeletonSection />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-full mx-auto px-4 py-8">
          <div className="bg-card border border-border rounded-2xl p-16 text-center shadow-lg">
            <div className="bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800/30 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiUser className="w-10 h-10 text-red-600" />
            </div>
            <h3 className="font-bold text-foreground text-xl mb-3">
              Failed to load profile
            </h3>
            <p className="text-muted-foreground text-base mb-6">
              There was an error loading your profile. Please try again.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-full mx-auto px-4 py-8">
        <div className="bg-gradient-to-br from-primary/10 via-card to-accent/5 border border-border rounded-2xl p-8 shadow-lg relative overflow-hidden mb-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/5 to-transparent rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-accent/5 to-transparent rounded-full translate-y-24 -translate-x-24"></div>

          <div className="relative z-10">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
              <div className="relative group">
                <div className="relative">
                  {profile?.photoUrl ? (
                    <img
                      src={profile.photoUrl}
                      alt="Profile"
                      className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 shadow-xl object-cover"
                    />
                  ) : (
                    <div className="w-32 h-32 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full border-4 border-white dark:border-gray-800 shadow-xl flex items-center justify-center">
                      <FiUser className="w-16 h-16 text-primary" />
                    </div>
                  )}
                  <label
                    htmlFor="photo-upload"
                    className="absolute -bottom-2 -right-2 bg-primary hover:bg-primary/90 text-white p-3 rounded-full shadow-lg cursor-pointer transition-all duration-300 hover:scale-110 group-hover:bg-primary/90"
                  >
                    {isUploadingPhoto ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <FiCamera className="w-4 h-4" />
                    )}
                  </label>
                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                    disabled={isUploadingPhoto}
                  />
                </div>
              </div>

              <div className="flex-1 space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h1 className="text-3xl font-bold text-foreground">
                      {profile?.firstName} {profile?.lastName}
                    </h1>
                    <p className="text-muted-foreground text-lg">
                      {profile?.bio ||
                        "I build end to end data pipelines to solve real business use cases and ensure stakeholder needs are met"}
                    </p>
                  </div>

                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    {profile?.city && profile?.country && (
                      <div className="flex items-center gap-2">
                        <FiMapPin className="w-4 h-4" />
                        <span>
                          {profile.city},{" "}
                          {profile.state && `${profile.state}, `}
                          {profile.country}
                        </span>
                      </div>
                    )}
                    {profile?.email && (
                      <div className="flex items-center gap-2">
                        <FiMail className="w-4 h-4" />
                        <span>{profile.email}</span>
                      </div>
                    )}
                    {profile?.phone && (
                      <div className="flex items-center gap-2">
                        <FiPhone className="w-4 h-4" />
                        <span>{profile.phone}</span>
                      </div>
                    )}
                  </div>

                  {profile?.skills && profile.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.slice(0, 6).map((skill) => (
                        <span
                          key={skill._id}
                          className="bg-primary/10 border border-primary/20 text-primary px-3 py-1 rounded-full text-sm font-medium"
                        >
                          {skill.name}
                        </span>
                      ))}
                      {profile.skills.length > 6 && (
                        <span className="bg-muted/50 border border-border text-muted-foreground px-3 py-1 rounded-full text-sm font-medium">
                          +{profile.skills.length - 6} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Edit Button */}
              <button
                onClick={openEditProfile}
                className="bg-primary/10 hover:bg-primary/20 border border-primary/20 text-primary px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 hover:scale-105"
              >
                <FiEdit className="w-4 h-4" />
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* About Me Section */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <FiUser className="w-5 h-5 text-primary" />
                </div>
                About Me
              </h2>
              <button
                onClick={openEditProfile}
                className="text-primary hover:text-primary/80 transition-colors"
              >
                <FiEdit className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                {profile?.bio ||
                  "I build end to end data pipelines to solve real business use cases and ensure stakeholder needs are met"}
              </p>

              <div className="grid grid-cols-1 gap-3">
                {profile?.city && profile?.country && (
                  <div className="flex items-center gap-3 text-sm bg-muted/30 px-4 py-3 rounded-lg">
                    <FiMapPin className="w-4 h-4 text-primary" />
                    <span className="text-foreground">
                      {profile.address && `${profile.address}, `}
                      {profile.city}, {profile.state && `${profile.state}, `}
                      {profile.country}
                    </span>
                  </div>
                )}
                {profile?.email && (
                  <div className="flex items-center gap-3 text-sm bg-muted/30 px-4 py-3 rounded-lg">
                    <FiMail className="w-4 h-4 text-primary" />
                    <span className="text-foreground">{profile.email}</span>
                  </div>
                )}
                {profile?.phone && (
                  <div className="flex items-center gap-3 text-sm bg-muted/30 px-4 py-3 rounded-lg">
                    <FiPhone className="w-4 h-4 text-primary" />
                    <span className="text-foreground">{profile.phone}</span>
                  </div>
                )}
                {profile?.dateOfBirth && (
                  <div className="flex items-center gap-3 text-sm bg-muted/30 px-4 py-3 rounded-lg">
                    <FiCalendar className="w-4 h-4 text-primary" />
                    <span className="text-foreground">
                      Born{" "}
                      {new Date(profile.dateOfBirth).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Skills Section */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <FiBook className="w-5 h-5 text-primary" />
                </div>
                Skills
              </h2>
              <button
                onClick={openAddSkill}
                className="text-primary hover:text-primary/80 transition-colors"
              >
                <FiPlus className="w-5 h-5" />
              </button>
            </div>

            {profile?.skills && profile.skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill) => (
                  <div
                    key={skill._id}
                    className="group relative bg-primary/10 border border-primary/20 text-primary px-3 py-2 rounded-full text-sm font-medium shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <span>{skill.name}</span>
                    <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                      <button
                        onClick={() => openEditSkill(skill)}
                        className="bg-primary text-white p-1 rounded-full shadow-lg hover:bg-primary/90 transition-colors"
                      >
                        <FiEdit className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleDeleteSkill(skill._id)}
                        className="bg-red-500 text-white p-1 rounded-full shadow-lg hover:bg-red-600 transition-colors"
                      >
                        <FiTrash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="bg-muted/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiBook className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground mb-4">
                  No skills added yet
                </p>
                <button
                  onClick={openAddSkill}
                  className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300"
                >
                  Add Skills
                </button>
              </div>
            )}
          </div>

          {/* Work Experience Section */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <FiBriefcase className="w-5 h-5 text-primary" />
                </div>
                Work Experience
              </h2>
              <button
                onClick={openAddWork}
                className="text-primary hover:text-primary/80 transition-colors"
              >
                <FiPlus className="w-5 h-5" />
              </button>
            </div>

            {profile?.workExperience && profile.workExperience.length > 0 ? (
              <div className="space-y-4">
                {profile.workExperience.map((experience, index) => (
                  <div
                    key={experience._id || index}
                    className="bg-muted/30 border border-border/50 rounded-lg p-4 hover:bg-muted/50 transition-all duration-300 group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-foreground">
                            {experience.company}
                          </h4>
                          {!experience.endDate && (
                            <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                              Present
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {experience.title}
                        </p>
                        {experience.location && (
                          <p className="text-xs text-muted-foreground mb-2">
                            📍 {experience.location}
                          </p>
                        )}
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <FiCalendar className="w-3 h-3" />
                          <span>
                            {experience.startDate &&
                              formatDate(experience.startDate.toString())}{" "}
                            -{" "}
                            {experience.endDate
                              ? formatDate(experience.endDate.toString())
                              : "Present"}
                          </span>
                        </div>
                        {experience.description && (
                          <p className="text-xs text-muted-foreground mt-2">
                            {experience.description}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openEditWork(experience)}
                          className="text-primary hover:text-primary/80 transition-colors"
                        >
                          <FiEdit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() =>
                            openDeleteModal(
                              "work",
                              experience._id,
                              `${experience.title} at ${experience.company}`
                            )
                          }
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="bg-muted/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiBriefcase className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground mb-4">
                  No work experience added yet
                </p>
                <button
                  onClick={openAddWork}
                  className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300"
                >
                  Add Experience
                </button>
              </div>
            )}
          </div>

          {/* Education Section */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <FiBook className="w-5 h-5 text-primary" />
                </div>
                Education History
              </h2>
              <button
                onClick={openAddEducation}
                className="text-primary hover:text-primary/80 transition-colors"
              >
                <FiPlus className="w-5 h-5" />
              </button>
            </div>

            {profile?.educationHistory &&
            profile.educationHistory.length > 0 ? (
              <div className="space-y-4">
                {profile.educationHistory.map(
                  (
                    education: {
                      _id: string;
                      school:
                        | string
                        | number
                        | bigint
                        | boolean
                        | ReactElement<
                            unknown,
                            string | JSXElementConstructor<any>
                          >
                        | Iterable<ReactNode>
                        | ReactPortal
                        | Promise<
                            | string
                            | number
                            | bigint
                            | boolean
                            | ReactPortal
                            | ReactElement<
                                unknown,
                                string | JSXElementConstructor<any>
                              >
                            | Iterable<ReactNode>
                            | null
                            | undefined
                          >
                        | null
                        | undefined;
                      fieldOfStudy:
                        | string
                        | number
                        | bigint
                        | boolean
                        | ReactElement<
                            unknown,
                            string | JSXElementConstructor<any>
                          >
                        | Iterable<ReactNode>
                        | ReactPortal
                        | Promise<
                            | string
                            | number
                            | bigint
                            | boolean
                            | ReactPortal
                            | ReactElement<
                                unknown,
                                string | JSXElementConstructor<any>
                              >
                            | Iterable<ReactNode>
                            | null
                            | undefined
                          >
                        | null
                        | undefined;
                      degree:
                        | string
                        | number
                        | bigint
                        | boolean
                        | ReactElement<
                            unknown,
                            string | JSXElementConstructor<any>
                          >
                        | Iterable<ReactNode>
                        | ReactPortal
                        | Promise<
                            | string
                            | number
                            | bigint
                            | boolean
                            | ReactPortal
                            | ReactElement<
                                unknown,
                                string | JSXElementConstructor<any>
                              >
                            | Iterable<ReactNode>
                            | null
                            | undefined
                          >
                        | null
                        | undefined;
                      startDate: string;
                      endDate: string;
                      description:
                        | string
                        | number
                        | bigint
                        | boolean
                        | ReactElement<
                            unknown,
                            string | JSXElementConstructor<any>
                          >
                        | Iterable<ReactNode>
                        | ReactPortal
                        | Promise<
                            | string
                            | number
                            | bigint
                            | boolean
                            | ReactPortal
                            | ReactElement<
                                unknown,
                                string | JSXElementConstructor<any>
                              >
                            | Iterable<ReactNode>
                            | null
                            | undefined
                          >
                        | null
                        | undefined;
                    },
                    index: any
                  ) => (
                    <div
                      key={education._id || index}
                      className="bg-muted/30 border border-border/50 rounded-lg p-4 hover:bg-muted/50 transition-all duration-300 group"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground mb-2">
                            {education.school}
                          </h4>
                          <p className="text-sm text-muted-foreground mb-1">
                            {education.fieldOfStudy}
                          </p>
                          <p className="text-sm text-muted-foreground mb-2">
                            {education.degree}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <FiCalendar className="w-3 h-3" />
                            <span>
                              {formatDate(education.startDate)} -{" "}
                              {education.endDate
                                ? formatDate(education.endDate)
                                : "Present"}
                            </span>
                          </div>
                          {education.description && (
                            <p className="text-xs text-muted-foreground mt-2">
                              {education.description}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => openEditEducation(education)}
                            className="text-primary hover:text-primary/80 transition-colors"
                          >
                            <FiEdit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() =>
                              openDeleteModal(
                                "education",
                                education._id,
                                `${education.degree} from ${education.school}`
                              )
                            }
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="bg-muted/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiBook className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground mb-4">
                  No education history added yet
                </p>
                <button
                  onClick={openAddEducation}
                  className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300"
                >
                  Add Education
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <ProfileEditModal
        isOpen={isProfileModalOpen}
        onClose={closeEditProfile}
        profile={profile!}
        onSave={handleSaveProfile}
        isLoading={isUpdatingProfile}
      />

      <WorkExperienceModal
        isOpen={isWorkModalOpen}
        onClose={closeWorkModal}
        workExperience={editingWorkExperience}
        onSave={handleSaveWorkExperience}
        isLoading={false}
      />

      <EducationModal
        isOpen={isEducationModalOpen}
        onClose={closeEducationModal}
        education={editingEducation}
        onSave={handleSaveEducation}
        isLoading={false}
      />

      <SkillsModal
        isOpen={isSkillsModalOpen}
        onClose={closeSkillsModal}
        skill={editingSkill}
        onSave={handleSaveSkill}
        isLoading={false}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleConfirmDelete}
        title={`Delete ${deleteItem?.title}`}
        message={`Are you sure you want to delete this ${
          deleteItem?.type === "work" ? "work experience" : "education"
        }? This action cannot be undone.`}
        isLoading={false}
      />
    </div>
  );
}
