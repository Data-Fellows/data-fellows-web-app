import { uploadProfilePhoto, UserProfile } from "@/api/profile";
import { useToast } from "@/context/ToastContext";
import { getUser } from "@/helpers";
import { useProfile, useUpdateProfile } from "@/hooks/useProfile";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useState } from "react";
import {
  FiBarChart,
  FiCamera,
  FiCheck,
  FiEdit3,
  FiGlobe,
  FiMail,
  FiMapPin,
  FiPhone,
  FiSave,
  FiSettings,
  FiUsers,
  FiX,
} from "react-icons/fi";

export default function EmployerProfilePage() {
  const router = useRouter();
  const { showToast } = useToast();
  const user = useMemo(() => getUser(), []);

  // Use profile hooks
  const { data: profile, isLoading, error, refetch } = useProfile();
  const updateProfileMutation = useUpdateProfile();

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<UserProfile>>({});

  useEffect(() => {
    if (!user) {
      router.push("/auth/sign-in");
      return;
    }

    if (user.userType !== "employer") {
      router.push("/dashboard");
      return;
    }
  }, [user, router]);

  useEffect(() => {
    if (profile) {
      setEditData(profile);
    }
  }, [profile]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditData(profile || {});
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData(profile || {});
  };

  const handleSave = async () => {
    if (!profile) return;

    try {
      await updateProfileMutation.mutateAsync({
        firstName: editData.firstName,
        lastName: editData.lastName,
        email: editData.email,
        phone: editData.companyPhone,
        // Add other fields as needed
      });
      setIsEditing(false);
      showToast("Profile updated successfully!", "success");
    } catch (error) {
      // Error handling is done in the mutation
      console.error("Failed to update profile:", error);
    }
  };

  const handleInputChange = (field: keyof UserProfile, value: any) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePhotoUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const updatedProfile = await uploadProfilePhoto({ photo: file });
      refetch(); // Refetch profile data
      showToast("Profile photo updated successfully!", "success");
    } catch (error) {
      console.error("Failed to upload photo:", error);
      showToast("Failed to upload photo", "error");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-8">
            {/* Header Skeleton */}
            <div className="bg-card dark:bg-zinc-800 border border-border rounded-2xl p-8">
              <div className="flex items-center space-x-6">
                <div className="w-24 h-24 bg-muted dark:bg-zinc-700 rounded-full"></div>
                <div className="space-y-3">
                  <div className="h-8 bg-muted dark:bg-zinc-700 rounded w-64"></div>
                  <div className="h-5 bg-muted dark:bg-zinc-700 rounded w-48"></div>
                  <div className="h-4 bg-muted dark:bg-zinc-700 rounded w-32"></div>
                </div>
              </div>
            </div>
            {/* Content Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-card dark:bg-zinc-800 border border-border rounded-2xl p-6 h-96">
                <div className="space-y-4">
                  <div className="h-6 bg-muted dark:bg-zinc-700 rounded w-48"></div>
                  <div className="h-4 bg-muted dark:bg-zinc-700 rounded w-full"></div>
                  <div className="h-4 bg-muted dark:bg-zinc-700 rounded w-3/4"></div>
                  <div className="h-4 bg-muted dark:bg-zinc-700 rounded w-5/6"></div>
                </div>
              </div>
              <div className="bg-card dark:bg-zinc-800 border border-border rounded-2xl p-6 h-96">
                <div className="space-y-4">
                  <div className="h-6 bg-muted dark:bg-zinc-700 rounded w-56"></div>
                  <div className="flex flex-wrap gap-2">
                    <div className="h-8 bg-muted dark:bg-zinc-700 rounded w-20"></div>
                    <div className="h-8 bg-muted dark:bg-zinc-700 rounded w-24"></div>
                    <div className="h-8 bg-muted dark:bg-zinc-700 rounded w-16"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Profile Not Found
          </h2>
          <p className="text-muted-foreground">Unable to load your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 mb-8 shadow-lg">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center space-x-6">
              {/* Profile Photo */}
              <div className="relative">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-muted flex items-center justify-center">
                  {profile.photoUrl || profile.companyLogo ? (
                    <img
                      src={profile.photoUrl || profile.companyLogo}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FiGlobe className="w-12 h-12 text-muted-foreground" />
                  )}
                </div>
                <label className="absolute -bottom-2 -right-2 w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center cursor-pointer hover:bg-primary/90 transition-colors shadow-lg">
                  <FiCamera className="w-5 h-5" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Basic Info */}
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                    {profile.firstName} {profile.lastName}
                  </h1>
                  {profile.verified && (
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <FiCheck className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
                <p className="text-lg text-muted-foreground mb-2">
                  {profile.companyName}
                </p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <FiMail className="w-4 h-4" />
                    {profile.email}
                  </span>
                  <span className="flex items-center gap-1">
                    <FiMapPin className="w-4 h-4" />
                    {profile.companyCity}, {profile.companyCountry}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              {!isEditing ? (
                <button
                  onClick={handleEdit}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <FiEdit3 className="w-4 h-4" />
                  Edit Profile
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCancel}
                    className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
                  >
                    <FiX className="w-4 h-4" />
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={updateProfileMutation.isPending}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
                  >
                    <FiSave className="w-4 h-4" />
                    {updateProfileMutation.isPending ? "Saving..." : "Save"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Company Information */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <FiGlobe className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-xl font-bold text-foreground">
                Company Information
              </h2>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                    Company Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.companyName || ""}
                      onChange={(e) =>
                        handleInputChange("companyName", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  ) : (
                    <p className="text-foreground font-medium">
                      {profile.companyName}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                    Company Type
                  </label>
                  <p className="text-foreground font-medium capitalize">
                    {profile.companyType}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                    Company Size
                  </label>
                  <p className="text-foreground font-medium">
                    {profile.companySize}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                    Number of Employees
                  </label>
                  <p className="text-foreground font-medium">
                    {profile.noOfEmployees}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  Company Address
                </label>
                {isEditing ? (
                  <textarea
                    value={editData.companyAddress || ""}
                    onChange={(e) =>
                      handleInputChange("companyAddress", e.target.value)
                    }
                    rows={2}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  />
                ) : (
                  <p className="text-foreground font-medium">
                    {profile.companyAddress}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  About Company
                </label>
                {isEditing ? (
                  <textarea
                    value={editData.companyAbout || ""}
                    onChange={(e) =>
                      handleInputChange("companyAbout", e.target.value)
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  />
                ) : (
                  <p className="text-foreground font-medium">
                    {profile.companyAbout}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  Contact Information
                </label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <FiPhone className="w-4 h-4 text-muted-foreground" />
                    {isEditing ? (
                      <input
                        type="tel"
                        value={editData.companyPhone || ""}
                        onChange={(e) =>
                          handleInputChange("companyPhone", e.target.value)
                        }
                        className="flex-1 px-3 py-1 border border-border rounded bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    ) : (
                      <span className="text-foreground font-medium">
                        {profile.companyPhone}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <FiMail className="w-4 h-4 text-muted-foreground" />
                    <span className="text-foreground font-medium">
                      {profile.email}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Business Analytics Needs */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <FiBarChart className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-xl font-bold text-foreground">
                Business Analytics Needs
              </h2>
            </div>

            <div className="space-y-6">
              {/* Business Data Types */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3">
                  Business Data Types
                </h3>
                <div className="flex flex-wrap gap-2">
                  {profile.businessData?.length ? (
                    profile.businessData.map((data, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-sm font-medium"
                      >
                        {data}
                      </span>
                    ))
                  ) : (
                    <span className="text-muted-foreground text-sm">
                      No data types specified
                    </span>
                  )}
                </div>
              </div>

              {/* Data Analysis Tools */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3">
                  Current Tools
                </h3>
                <div className="flex flex-wrap gap-2">
                  {profile.dataAnalysisTools?.length ? (
                    profile.dataAnalysisTools.map((tool, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg text-sm font-medium"
                      >
                        {tool}
                      </span>
                    ))
                  ) : (
                    <span className="text-muted-foreground text-sm">
                      No tools specified
                    </span>
                  )}
                </div>
              </div>

              {/* Challenges Faced */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3">
                  Challenges Faced
                </h3>
                <div className="flex flex-wrap gap-2">
                  {profile.challengesFaced?.length ? (
                    profile.challengesFaced.map((challenge, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg text-sm font-medium"
                      >
                        {challenge}
                      </span>
                    ))
                  ) : (
                    <span className="text-muted-foreground text-sm">
                      No challenges specified
                    </span>
                  )}
                </div>
              </div>

              {/* Expected Outcomes */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3">
                  Expected Outcomes
                </h3>
                <div className="flex flex-wrap gap-2">
                  {profile.expectedOutcome?.length ? (
                    profile.expectedOutcome.map((outcome, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg text-sm font-medium"
                      >
                        {outcome}
                      </span>
                    ))
                  ) : (
                    <span className="text-muted-foreground text-sm">
                      No outcomes specified
                    </span>
                  )}
                </div>
              </div>

              {/* Needed Skills */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3">
                  Skills Needed
                </h3>
                <div className="flex flex-wrap gap-2">
                  {profile.neededSkills?.length ? (
                    profile.neededSkills.map((skill) => (
                      <span
                        key={skill._id}
                        className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-lg text-sm font-medium"
                      >
                        {skill.name}
                      </span>
                    ))
                  ) : (
                    <span className="text-muted-foreground text-sm">
                      No skills specified
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Company Statistics */}
        <div className="mt-8 bg-card border border-border rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
              <FiBarChart className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h2 className="text-xl font-bold text-foreground">
              Company Overview
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Account Status */}
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <FiCheck className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-green-700 dark:text-green-400">
                {profile.verified ? "Verified" : "Pending"}
              </h3>
              <p className="text-sm text-green-600 dark:text-green-300">
                Account Status
              </p>
            </div>

            {/* Company Age */}
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <FiGlobe className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-blue-700 dark:text-blue-400">
                {profile.companyCreatedAt
                  ? new Date(profile.companyCreatedAt).getFullYear()
                  : "N/A"}
              </h3>
              <p className="text-sm text-blue-600 dark:text-blue-300">
                Founded
              </p>
            </div>

            {/* Team Size */}
            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <FiUsers className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-purple-700 dark:text-purple-400">
                {profile.noOfEmployees || "N/A"}
              </h3>
              <p className="text-sm text-purple-600 dark:text-purple-300">
                Employees
              </p>
            </div>

            {/* Active Status */}
            <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-lg">
              <div
                className={`w-12 h-12 ${
                  profile.active ? "bg-orange-500" : "bg-gray-500"
                } rounded-full flex items-center justify-center mx-auto mb-3`}
              >
                <FiSettings className="w-6 h-6 text-white" />
              </div>
              <h3
                className={`text-lg font-bold ${
                  profile.active
                    ? "text-orange-700 dark:text-orange-400"
                    : "text-gray-700 dark:text-gray-400"
                }`}
              >
                {profile.active ? "Active" : "Inactive"}
              </h3>
              <p
                className={`text-sm ${
                  profile.active
                    ? "text-orange-600 dark:text-orange-300"
                    : "text-gray-600 dark:text-gray-300"
                }`}
              >
                Profile Status
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
