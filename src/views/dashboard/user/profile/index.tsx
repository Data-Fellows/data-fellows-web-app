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
import { Dialog } from "@headlessui/react";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useState } from "react";
import Cropper from "react-easy-crop";
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

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = document.createElement("img");
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.src = url;
  });
}

async function getCroppedImg(
  imageSrc: string,
  pixelCrop: any
): Promise<string> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get canvas context");
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );
  return canvas.toDataURL("image/png");
}

async function dataURLtoFile(dataURL: string, filename: string): Promise<File> {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);

      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], filename, { type: "image/png" });
          resolve(file);
        }
      }, "image/png");
    };

    img.src = dataURL;
  });
}

const SkeletonProfileHeader = () => (
  <div className="bg-gradient-to-br from-primary/10 via-card to-accent/5 border border-border rounded-xl sm:rounded-2xl p-4 sm:p-8 shadow-lg animate-pulse">
    <div className="flex flex-col items-center sm:items-start sm:flex-row gap-4 sm:gap-8">
      <div className="relative flex-shrink-0">
        <div className="w-24 h-24 sm:w-32 sm:h-32 bg-muted rounded-full"></div>
        <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 w-6 h-6 sm:w-10 sm:h-10 bg-muted rounded-full"></div>
      </div>
      <div className="flex-1 space-y-3 sm:space-y-4 text-center sm:text-left w-full">
        <div className="space-y-2">
          <div className="h-6 sm:h-8 bg-muted rounded w-48 sm:w-64 mx-auto sm:mx-0"></div>
          <div className="h-4 sm:h-5 bg-muted rounded w-40 sm:w-48 mx-auto sm:mx-0"></div>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6">
          <div className="h-4 sm:h-5 bg-muted rounded w-32 sm:w-40"></div>
          <div className="h-4 sm:h-5 bg-muted rounded w-24 sm:w-32"></div>
        </div>
        <div className="h-3 sm:h-4 bg-muted rounded w-full max-w-xs sm:max-w-md mx-auto sm:mx-0"></div>
      </div>
      <div className="h-8 sm:h-10 bg-muted rounded w-full sm:w-32"></div>
    </div>
  </div>
);

const SkeletonSection = () => (
  <div className="bg-card border border-border rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg animate-pulse">
    <div className="flex items-center justify-between mb-4 sm:mb-6">
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="w-5 h-5 sm:w-6 sm:h-6 bg-muted rounded"></div>
        <div className="h-5 sm:h-6 bg-muted rounded w-24 sm:w-32"></div>
      </div>
      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-muted rounded"></div>
    </div>
    <div className="space-y-2 sm:space-y-4">
      <div className="h-3 sm:h-4 bg-muted rounded w-full"></div>
      <div className="h-3 sm:h-4 bg-muted rounded w-3/4"></div>
      <div className="h-3 sm:h-4 bg-muted rounded w-1/2"></div>
    </div>
  </div>
);

export default function ProfilePage() {
  const [isMounted, setIsMounted] = useState(false);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isWorkModalOpen, setIsWorkModalOpen] = useState(false);
  const [isEducationModalOpen, setIsEducationModalOpen] = useState(false);
  const [isSkillsModalOpen, setIsSkillsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [cropModalOpen, setCropModalOpen] = useState(false);

  const [editingWorkExperience, setEditingWorkExperience] = useState<any>(null);
  const [editingEducation, setEditingEducation] = useState<any>(null);
  const [deleteItem, setDeleteItem] = useState<{
    type: "work" | "education" | "skill";
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
    handleDeleteSkill,
    isUpdatingProfile,
    isUploadingPhoto,
    isDeletingSkill,
    refetch,
  } = useProfileData();

  useEffect(() => {
    if (profile) {
    }
  }, [profile]);

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      if (typeof ev.target?.result === "string") {
        setImgSrc(ev.target.result);
        setCropModalOpen(true);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCropChange = (c: { x: number; y: number }) => {
    setCrop(c);
  };

  const handleZoomChange = (z: number) => {
    setZoom(z);
  };

  const handleCropComplete = (_: any, croppedPixels: any) => {
    setCroppedAreaPixels(croppedPixels);
  };

  const handleCropConfirm = async () => {
    if (!imgSrc || !croppedAreaPixels) return;

    try {
      const croppedImage = await getCroppedImg(imgSrc, croppedAreaPixels);
      const file = await dataURLtoFile(
        croppedImage,
        `profile_photo_${Date.now()}.png`
      );

      handleUploadPhoto({ photo: file });

      setCropModalOpen(false);
      setImgSrc(null);
    } catch (error) {
      console.error("Error cropping image:", error);
      showToast("Failed to crop image", "error");
    }
  };

  const handleCropCancel = () => {
    setCropModalOpen(false);
    setImgSrc(null);
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
    setIsSkillsModalOpen(true);
  };

  const closeSkillsModal = () => {
    setIsSkillsModalOpen(false);
  };

  const openDeleteModal = (
    type: "work" | "education" | "skill",
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

  const handleSaveProfile = async (data: any) => {
    try {
      await handleUpdateProfile(data);
      showToast("Profile updated successfully!", "success");
      await refetch();
      closeEditProfile();
    } catch (error) {
      showToast("Failed to update profile", "error");
    }
  };

  const handleSaveWorkExperience = async (data: any) => {
    try {
      const workExperienceData = {
        title: data.title,
        company: data.company,
        location: data.location,
        startDate: data.startDate ? data.startDate.toISOString() : "",
        endDate: data.currentlyWorking
          ? null
          : data.endDate?.toISOString() || null,
        description: data.description,
      };

      if (editingWorkExperience) {
        await handleUpdateWorkExperience({
          _id: editingWorkExperience._id,
          ...workExperienceData,
        });
        showToast("Work experience updated successfully!", "success");
      } else {
        await handleAddWorkExperience(workExperienceData);
        showToast("Work experience added successfully!", "success");
      }

      await refetch();
      closeWorkModal();
    } catch (error) {
      showToast("Failed to save work experience", "error");
    }
  };

  const handleSaveEducation = async (data: any) => {
    try {
      const educationData = {
        school: data.school,
        degree: data.degree,
        fieldOfStudy: data.fieldOfStudy,
        startDate: data.startDate
          ? data.startDate.toISOString()
          : data.startYear || "",
        endDate: data.currentlyInSchool
          ? ""
          : data.endDate
          ? data.endDate.toISOString()
          : data.endYear || "",
        description: data.description || "",
      };

      if (editingEducation) {
        await handleUpdateEducation({
          _id: editingEducation._id,
          ...educationData,
        });
        showToast("Education updated successfully!", "success");
      } else {
        await handleAddEducation(educationData);
        showToast("Education added successfully!", "success");
      }

      await refetch();
      closeEducationModal();
    } catch (error) {
      showToast("Failed to save education", "error");
    }
  };

  const handleSaveSkill = async (newSkills: any[]) => {
    try {
      const skillNames = newSkills.map((skill) => skill.name);
      await handleUpdateSkills({ skillNames });
      showToast("Skills updated successfully!", "success");
      await refetch();
      closeSkillsModal();
    } catch (error) {
      showToast("Failed to save skills", "error");
    }
  };

  const handleDeleteSkillAction = (skillName: string) => {
    openDeleteModal("skill", skillName, skillName);
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
        case "skill":
          await handleDeleteSkill({ skillName: deleteItem.id });
          showToast("Skill deleted successfully!", "success");
          break;
      }
      await refetch();
      closeDeleteModal();
    } catch (error) {
      console.error("Delete error:", error);
      showToast("Failed to delete item", "error");
      closeDeleteModal();
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
        <div className="max-w-full mx-auto px-4 sm:px-6 py-4 sm:py-8">
          <SkeletonProfileHeader />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8 mt-4 sm:mt-8">
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
        <div className="max-w-full mx-auto px-4 sm:px-6 py-4 sm:py-8">
          <div className="bg-card border border-border rounded-2xl p-8 sm:p-16 text-center shadow-lg">
            <div className="bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800/30 w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <FiUser className="w-8 h-8 sm:w-10 sm:h-10 text-red-600" />
            </div>
            <h3 className="font-bold text-foreground text-lg sm:text-xl mb-2 sm:mb-3">
              Failed to load profile
            </h3>
            <p className="text-muted-foreground text-sm sm:text-base mb-4 sm:mb-6">
              There was an error loading your profile. Please try again.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-primary hover:bg-primary/90 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-xl font-semibold transition-all duration-300"
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
      <div className="max-w-full mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {/* Enhanced Profile Header with better mobile responsiveness */}
        <div className="bg-gradient-to-br from-primary/10 via-card to-accent/5 border border-border rounded-xl sm:rounded-2xl p-4 sm:p-8 shadow-lg relative overflow-hidden mb-4 sm:mb-8">
          <div className="absolute top-0 right-0 w-32 h-32 sm:w-64 sm:h-64 bg-gradient-to-br from-primary/5 to-transparent rounded-full -translate-y-16 translate-x-16 sm:-translate-y-32 sm:translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 sm:w-48 sm:h-48 bg-gradient-to-tr from-accent/5 to-transparent rounded-full translate-y-12 -translate-x-12 sm:translate-y-24 sm:-translate-x-24"></div>

          <div className="relative z-10">
            <div className="flex flex-col items-center sm:items-start sm:flex-row gap-4 sm:gap-8">
              {/* Profile Image - centered on mobile */}
              <div className="relative group flex-shrink-0">
                <div className="relative">
                  {profile?.photoUrl ? (
                    <img
                      src={profile.photoUrl}
                      alt="Profile"
                      className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white dark:border-gray-800 shadow-xl object-cover"
                    />
                  ) : (
                    <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full border-4 border-white dark:border-gray-800 shadow-xl flex items-center justify-center">
                      <FiUser className="w-12 h-12 sm:w-16 sm:h-16 text-primary" />
                    </div>
                  )}
                  <label
                    htmlFor="photo-upload"
                    className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 bg-primary hover:bg-primary/90 text-white p-2 sm:p-3 rounded-full shadow-lg cursor-pointer transition-all duration-300 hover:scale-110 group-hover:bg-primary/90"
                  >
                    {isUploadingPhoto ? (
                      <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <FiCamera className="w-3 h-3 sm:w-4 sm:h-4" />
                    )}
                  </label>
                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                    disabled={isUploadingPhoto}
                  />
                </div>
              </div>

              {/* Profile Info - centered on mobile */}
              <div className="flex-1 space-y-3 sm:space-y-4 text-center sm:text-left">
                <div className="space-y-3 sm:space-y-4">
                  <div className="space-y-1 sm:space-y-2">
                    <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                      {profile?.firstName} {profile?.lastName}
                    </h1>
                    <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
                      {profile?.bio ||
                        "I build end to end data pipelines to solve real business use cases and ensure stakeholder needs are met"}
                    </p>
                  </div>

                  {/* Contact info - stacked on mobile, row on desktop */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-sm text-muted-foreground">
                    {profile?.city && profile?.country && (
                      <div className="flex items-center justify-center sm:justify-start gap-2">
                        <FiMapPin className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">
                          {profile.city},{" "}
                          {profile.state && `${profile.state}, `}
                          {profile.country}
                        </span>
                      </div>
                    )}
                    {profile?.email && (
                      <div className="flex items-center justify-center sm:justify-start gap-2">
                        <FiMail className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">{profile.email}</span>
                      </div>
                    )}
                    {profile?.phone && (
                      <div className="flex items-center justify-center sm:justify-start gap-2">
                        <FiPhone className="w-4 h-4 flex-shrink-0" />
                        <span>{profile.phone}</span>
                      </div>
                    )}
                  </div>

                  {/* Skills preview */}
                  {profile?.skills && profile.skills.length > 0 && (
                    <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                      {profile.skills.slice(0, 4).map((skill) => (
                        <span
                          key={skill._id}
                          className="bg-primary/10 border border-primary/20 text-primary px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium"
                        >
                          {skill.name}
                        </span>
                      ))}
                      {profile.skills.length > 4 && (
                        <span className="bg-muted/50 border border-border text-muted-foreground px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                          +{profile.skills.length - 4} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Edit button - full width on mobile */}
              <button
                onClick={openEditProfile}
                className="w-full sm:w-auto bg-primary/10 hover:bg-primary/20 border border-primary/20 text-primary px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 hover:scale-105"
              >
                <FiEdit className="w-4 h-4" />
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        {/* Profile Content - single column on mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
          {/* About Me Section */}
          <div className="bg-card border border-border rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-semibold text-foreground flex items-center gap-2 sm:gap-3">
                <div className="bg-primary/10 p-1.5 sm:p-2 rounded-lg">
                  <FiUser className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                </div>
                About Me
              </h2>
              <button
                onClick={openEditProfile}
                className="text-primary hover:text-primary/80 transition-colors p-1"
              >
                <FiEdit className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                {profile?.bio ||
                  "I build end to end data pipelines to solve real business use cases and ensure stakeholder needs are met"}
              </p>

              <div className="grid grid-cols-1 gap-2 sm:gap-3">
                {profile?.city && profile?.country && (
                  <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm bg-muted/30 px-3 sm:px-4 py-2 sm:py-3 rounded-lg">
                    <FiMapPin className="w-3 h-3 sm:w-4 sm:h-4 text-primary flex-shrink-0" />
                    <span className="text-foreground truncate">
                      {profile.address && `${profile.address}, `}
                      {profile.city}, {profile.state && `${profile.state}, `}
                      {profile.country}
                    </span>
                  </div>
                )}
                {profile?.email && (
                  <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm bg-muted/30 px-3 sm:px-4 py-2 sm:py-3 rounded-lg">
                    <FiMail className="w-3 h-3 sm:w-4 sm:h-4 text-primary flex-shrink-0" />
                    <span className="text-foreground truncate">
                      {profile.email}
                    </span>
                  </div>
                )}
                {profile?.phone && (
                  <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm bg-muted/30 px-3 sm:px-4 py-2 sm:py-3 rounded-lg">
                    <FiPhone className="w-3 h-3 sm:w-4 sm:h-4 text-primary flex-shrink-0" />
                    <span className="text-foreground">{profile.phone}</span>
                  </div>
                )}
                {profile?.dateOfBirth && (
                  <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm bg-muted/30 px-3 sm:px-4 py-2 sm:py-3 rounded-lg">
                    <FiCalendar className="w-3 h-3 sm:w-4 sm:h-4 text-primary flex-shrink-0" />
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
          <div className="bg-card border border-border rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-semibold text-foreground flex items-center gap-2 sm:gap-3">
                <div className="bg-primary/10 p-1.5 sm:p-2 rounded-lg">
                  <FiBook className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                </div>
                Skills
              </h2>
              <button
                onClick={openAddSkill}
                className="text-primary hover:text-primary/80 transition-colors p-1"
              >
                <FiPlus className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {profile?.skills && profile.skills.length > 0 ? (
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {profile.skills.map((skill) => (
                  <div
                    key={skill._id}
                    className="group relative bg-primary/10 border border-primary/20 text-primary px-2 sm:px-3 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-medium shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <span>{skill.name}</span>
                    <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleDeleteSkillAction(skill.name)}
                        className="bg-red-500 text-white p-0.5 sm:p-1 rounded-full shadow-lg hover:bg-red-600 transition-colors"
                        disabled={isDeletingSkill}
                      >
                        <FiTrash2 className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 sm:py-8">
                <div className="bg-muted/30 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <FiBook className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground mb-3 sm:mb-4 text-sm sm:text-base">
                  No skills added yet
                </p>
                <button
                  onClick={openAddSkill}
                  className="bg-primary hover:bg-primary/90 text-white px-4 sm:px-6 py-2 rounded-lg font-semibold transition-all duration-300"
                >
                  Add Skills
                </button>
              </div>
            )}
          </div>

          {/* Work Experience Section */}
          <div className="bg-card border border-border rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-semibold text-foreground flex items-center gap-2 sm:gap-3">
                <div className="bg-primary/10 p-1.5 sm:p-2 rounded-lg">
                  <FiBriefcase className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                </div>
                Work Experience
              </h2>
              <button
                onClick={openAddWork}
                className="text-primary hover:text-primary/80 transition-colors p-1"
              >
                <FiPlus className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {profile?.workExperience && profile.workExperience.length > 0 ? (
              <div className="space-y-3 sm:space-y-4">
                {profile.workExperience.map((experience, index) => (
                  <div
                    key={experience._id || index}
                    className="bg-muted/30 border border-border/50 rounded-lg p-3 sm:p-4 hover:bg-muted/50 transition-all duration-300 group"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-0">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-2">
                          <h4 className="font-semibold text-foreground text-sm sm:text-base">
                            {experience.company}
                          </h4>
                          {!experience.endDate && (
                            <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium w-fit">
                              Present
                            </span>
                          )}
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground mb-2">
                          {experience.title}
                        </p>
                        {experience.location && (
                          <p className="text-xs text-muted-foreground mb-2">
                            📍 {experience.location}
                          </p>
                        )}
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                          <FiCalendar className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">
                            {experience.startDate &&
                              formatDate(experience.startDate.toString())}{" "}
                            -{" "}
                            {experience.endDate
                              ? formatDate(experience.endDate.toString())
                              : "Present"}
                          </span>
                        </div>
                        {experience.description && (
                          <p className="text-xs text-muted-foreground line-clamp-3">
                            {experience.description}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openEditWork(experience)}
                          className="text-primary hover:text-primary/80 transition-colors p-1"
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
                          className="text-red-500 hover:text-red-700 transition-colors p-1"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 sm:py-8">
                <div className="bg-muted/30 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <FiBriefcase className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground mb-3 sm:mb-4 text-sm sm:text-base">
                  No work experience added yet
                </p>
                <button
                  onClick={openAddWork}
                  className="bg-primary hover:bg-primary/90 text-white px-4 sm:px-6 py-2 rounded-lg font-semibold transition-all duration-300"
                >
                  Add Experience
                </button>
              </div>
            )}
          </div>

          {/* Education Section */}
          <div className="bg-card border border-border rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-semibold text-foreground flex items-center gap-2 sm:gap-3">
                <div className="bg-primary/10 p-1.5 sm:p-2 rounded-lg">
                  <FiBook className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                </div>
                Education History
              </h2>
              <button
                onClick={openAddEducation}
                className="text-primary hover:text-primary/80 transition-colors p-1"
              >
                <FiPlus className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {profile?.educationHistory &&
            profile.educationHistory.length > 0 ? (
              <div className="space-y-3 sm:space-y-4">
                {profile.educationHistory.map((education: any, index: any) => (
                  <div
                    key={education._id || index}
                    className="bg-muted/30 border border-border/50 rounded-lg p-3 sm:p-4 hover:bg-muted/50 transition-all duration-300 group"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-0">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-foreground mb-2 text-sm sm:text-base">
                          {education.school}
                        </h4>
                        <p className="text-xs sm:text-sm text-muted-foreground mb-1">
                          {education.fieldOfStudy}
                        </p>
                        <p className="text-xs sm:text-sm text-muted-foreground mb-2">
                          {education.degree}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                          <FiCalendar className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">
                            {formatDate(education.startDate)} -{" "}
                            {education.endDate
                              ? formatDate(education.endDate)
                              : "Present"}
                          </span>
                        </div>
                        {education.description && (
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {education.description}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openEditEducation(education)}
                          className="text-primary hover:text-primary/80 transition-colors p-1"
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
                          className="text-red-500 hover:text-red-700 transition-colors p-1"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 sm:py-8">
                <div className="bg-muted/30 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <FiBook className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground mb-3 sm:mb-4 text-sm sm:text-base">
                  No education history added yet
                </p>
                <button
                  onClick={openAddEducation}
                  className="bg-primary hover:bg-primary/90 text-white px-4 sm:px-6 py-2 rounded-lg font-semibold transition-all duration-300"
                >
                  Add Education
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Photo Cropper Modal - mobile responsive */}
      <Dialog open={cropModalOpen} onClose={handleCropCancel}>
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <Dialog.Panel className="bg-white dark:bg-zinc-900 rounded-lg p-4 sm:p-6 w-full max-w-md mx-auto">
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-foreground">
              Crop your photo
            </h3>
            <div className="relative w-full h-48 sm:h-64 bg-gray-100 dark:bg-zinc-800 rounded-lg overflow-hidden mb-3 sm:mb-4">
              {imgSrc && (
                <Cropper
                  image={imgSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  cropShape="round"
                  showGrid={false}
                  onCropChange={handleCropChange}
                  onCropComplete={handleCropComplete}
                  onZoomChange={handleZoomChange}
                />
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
              <button
                type="button"
                className="px-4 py-2 rounded bg-zinc-700 text-white hover:bg-primary/90 transition-colors order-2 sm:order-1"
                onClick={handleCropConfirm}
              >
                Apply Crop
              </button>
              <button
                type="button"
                className="px-4 py-2 rounded bg-gray-200 dark:bg-zinc-700 dark:text-white hover:bg-gray-300 dark:hover:bg-zinc-600 transition-colors order-1 sm:order-2"
                onClick={handleCropCancel}
              >
                Cancel
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Modals remain the same */}
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
        currentSkills={profile?.skills || []}
        onSave={handleSaveSkill}
        isLoading={false}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleConfirmDelete}
        title={`Delete ${deleteItem?.title}`}
        message={`Are you sure you want to delete this ${
          deleteItem?.type === "work"
            ? "work experience"
            : deleteItem?.type === "education"
            ? "education"
            : "skill"
        }? This action cannot be undone.`}
        isLoading={isDeletingSkill}
      />
    </div>
  );
}
