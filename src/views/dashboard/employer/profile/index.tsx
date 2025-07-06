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
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="animate-pulse space-y-6 sm:space-y-8">
            {/* Header Skeleton */}
            <div className="bg-card dark:bg-card border border-border rounded-2xl p-4 sm:p-6 lg:p-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-muted dark:bg-muted rounded-full"></div>
                <div className="space-y-2 sm:space-y-3 flex-1 w-full sm:w-auto">
                  <div className="h-6 sm:h-8 bg-muted dark:bg-muted rounded w-full sm:w-64"></div>
                  <div className="h-4 sm:h-5 bg-muted dark:bg-muted rounded w-3/4 sm:w-48"></div>
                  <div className="h-3 sm:h-4 bg-muted dark:bg-muted rounded w-1/2 sm:w-32"></div>
                </div>
              </div>
            </div>
            {/* Content Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              <div className="bg-card dark:bg-card border border-border rounded-2xl p-4 sm:p-6 h-80 sm:h-96">
                <div className="space-y-3 sm:space-y-4">
                  <div className="h-5 sm:h-6 bg-muted dark:bg-muted rounded w-3/4 sm:w-48"></div>
                  <div className="h-3 sm:h-4 bg-muted dark:bg-muted rounded w-full"></div>
                  <div className="h-3 sm:h-4 bg-muted dark:bg-muted rounded w-3/4"></div>
                  <div className="h-3 sm:h-4 bg-muted dark:bg-muted rounded w-5/6"></div>
                </div>
              </div>
              <div className="bg-card dark:bg-card border border-border rounded-2xl p-4 sm:p-6 h-80 sm:h-96">
                <div className="space-y-3 sm:space-y-4">
                  <div className="h-5 sm:h-6 bg-muted dark:bg-muted rounded w-3/4 sm:w-56"></div>
                  <div className="flex flex-wrap gap-2">
                    <div className="h-6 sm:h-8 bg-muted dark:bg-muted rounded w-16 sm:w-20"></div>
                    <div className="h-6 sm:h-8 bg-muted dark:bg-muted rounded w-20 sm:w-24"></div>
                    <div className="h-6 sm:h-8 bg-muted dark:bg-muted rounded w-12 sm:w-16"></div>
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
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10 flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4">
            Profile Not Found
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Unable to load your profile.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        {/* Header Section - Mobile Optimized */}
        <div className="bg-card border border-border rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 mb-4 sm:mb-6 lg:mb-8 shadow-lg">
          {/* Mobile Stack Layout */}
          <div className="space-y-4 sm:space-y-6">
            {/* Profile Photo and Basic Info - Mobile First */}
            <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left gap-4 sm:gap-6">
              {/* Profile Photo */}
              <div className="relative shrink-0">
                <div className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-full overflow-hidden bg-muted flex items-center justify-center ring-2 ring-border">
                  {profile.photoUrl || profile.companyLogo ? (
                    <img
                      src={profile.photoUrl || profile.companyLogo}
                      alt={`${profile.firstName} ${profile.lastName} Profile`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <FiGlobe className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 text-muted-foreground" />
                  )}
                </div>
                <label className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 w-9 h-9 sm:w-10 sm:h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center cursor-pointer hover:bg-primary/90 active:scale-95 transition-all shadow-lg touch-manipulation">
                  <FiCamera className="w-4 h-4 sm:w-5 sm:h-5" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                    aria-label="Upload profile photo"
                  />
                </label>
              </div>

              {/* Basic Info */}
              <div className="flex-1 min-w-0 space-y-2 sm:space-y-3">
                {/* Name and Verification Badge */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground leading-tight">
                    {profile.firstName} {profile.lastName}
                  </h1>
                  {profile.verified && (
                    <div className="inline-flex items-center justify-center w-6 h-6 bg-green-500 rounded-full mx-auto sm:mx-0 shrink-0">
                      <FiCheck className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}
                </div>

                {/* Company Name */}
                <p className="text-base sm:text-lg lg:text-xl text-muted-foreground font-medium">
                  {profile.companyName}
                </p>

                {/* Contact Info - Mobile Optimized */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2 justify-center sm:justify-start">
                    <FiMail className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate max-w-[200px] sm:max-w-none">
                      {profile.email}
                    </span>
                  </div>
                  {profile.companyCity && profile.companyCountry && (
                    <div className="flex items-center gap-2 justify-center sm:justify-start">
                      <FiMapPin className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">
                        {profile.companyCity}, {profile.companyCountry}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons - Mobile Optimized */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-border sm:border-t-0 sm:pt-0">
              {!isEditing ? (
                <button
                  onClick={handleEdit}
                  className="flex items-center justify-center gap-2 px-6 py-3 min-h-[48px] bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 active:scale-[0.98] transition-all font-medium text-base sm:text-sm lg:text-base shadow-sm touch-manipulation w-full sm:w-auto sm:ml-auto"
                >
                  <FiEdit3 className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto sm:ml-auto">
                  <button
                    onClick={handleCancel}
                    className="flex items-center justify-center gap-2 px-6 py-3 min-h-[48px] border-2 border-border rounded-lg hover:bg-muted active:scale-[0.98] transition-all font-medium text-base sm:text-sm lg:text-base touch-manipulation order-2 sm:order-1"
                  >
                    <FiX className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={updateProfileMutation.isPending}
                    className="flex items-center justify-center gap-2 px-6 py-3 min-h-[48px] bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] transition-all font-medium text-base sm:text-sm lg:text-base shadow-sm touch-manipulation order-1 sm:order-2"
                  >
                    <FiSave className="w-4 h-4" />
                    <span>
                      {updateProfileMutation.isPending
                        ? "Saving..."
                        : "Save Changes"}
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content Grid - Mobile Optimized */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {/* Company Information Card */}
          <div className="bg-card border border-border rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg order-1">
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <FiGlobe className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              </div>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">
                Company Information
              </h2>
            </div>

            <div className="space-y-4 sm:space-y-6">
              {/* Company Name & Type */}
              <div className="grid grid-cols-1 gap-4 sm:gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-muted-foreground mb-2">
                      Company Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.companyName || ""}
                        onChange={(e) =>
                          handleInputChange("companyName", e.target.value)
                        }
                        className="w-full px-4 py-3 min-h-[48px] border-2 border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all text-base font-medium touch-manipulation"
                        placeholder="Enter company name"
                      />
                    ) : (
                      <p className="text-base font-semibold text-foreground bg-muted/30 px-4 py-3 rounded-lg">
                        {profile.companyName || "Not specified"}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-muted-foreground mb-2">
                        Company Type
                      </label>
                      <p className="text-base font-medium text-foreground bg-muted/30 px-4 py-3 rounded-lg capitalize">
                        {profile.companyType || "Not specified"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-muted-foreground mb-2">
                        Company Size
                      </label>
                      <p className="text-base font-medium text-foreground bg-muted/30 px-4 py-3 rounded-lg">
                        {profile.companySize || "Not specified"}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-muted-foreground mb-2">
                      Number of Employees
                    </label>
                    <p className="text-base font-medium text-foreground bg-muted/30 px-4 py-3 rounded-lg">
                      {profile.noOfEmployees || "Not specified"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Company Address */}
              <div>
                <label className="block text-sm font-semibold text-muted-foreground mb-2">
                  Company Address
                </label>
                {isEditing ? (
                  <textarea
                    value={editData.companyAddress || ""}
                    onChange={(e) =>
                      handleInputChange("companyAddress", e.target.value)
                    }
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all resize-none text-base font-medium touch-manipulation"
                    placeholder="Enter company address"
                  />
                ) : (
                  <p className="text-base font-medium text-foreground bg-muted/30 px-4 py-3 rounded-lg min-h-[120px] whitespace-pre-wrap">
                    {profile.companyAddress || "Address not provided"}
                  </p>
                )}
              </div>

              {/* About Company */}
              <div>
                <label className="block text-sm font-semibold text-muted-foreground mb-2">
                  About Company
                </label>
                {isEditing ? (
                  <textarea
                    value={editData.companyAbout || ""}
                    onChange={(e) =>
                      handleInputChange("companyAbout", e.target.value)
                    }
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all resize-none text-base font-medium touch-manipulation"
                    placeholder="Tell us about your company"
                  />
                ) : (
                  <p className="text-base font-medium text-foreground bg-muted/30 px-4 py-3 rounded-lg min-h-[140px] whitespace-pre-wrap">
                    {profile.companyAbout || "Company description not provided"}
                  </p>
                )}
              </div>

              {/* Contact Information */}
              <div>
                <label className="block text-sm font-semibold text-muted-foreground mb-3">
                  Contact Information
                </label>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                    <FiPhone className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    {isEditing ? (
                      <input
                        type="tel"
                        value={editData.companyPhone || ""}
                        onChange={(e) =>
                          handleInputChange("companyPhone", e.target.value)
                        }
                        className="flex-1 px-3 py-2 min-h-[44px] border border-border rounded bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all text-base font-medium touch-manipulation"
                        placeholder="Company phone number"
                      />
                    ) : (
                      <span className="text-base font-medium text-foreground">
                        {profile.companyPhone || "Phone not provided"}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                    <FiMail className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    <span className="text-base font-medium text-foreground truncate">
                      {profile.email}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Business Analytics Needs Card */}
          <div className="bg-card border border-border rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg order-2">
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                <FiBarChart className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">
                Business Analytics Needs
              </h2>
            </div>

            <div className="space-y-6 sm:space-y-8">
              {/* Business Data Types */}
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
                  Business Data Types
                </h3>
                <div className="flex flex-wrap gap-2">
                  {profile.businessData?.length ? (
                    profile.businessData.map((data, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 rounded-lg text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors touch-manipulation"
                      >
                        {data}
                      </span>
                    ))
                  ) : (
                    <div className="w-full p-4 bg-muted/30 rounded-lg border-2 border-dashed border-muted-foreground/20 text-center">
                      <p className="text-muted-foreground font-medium">
                        No data types specified
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Data Analysis Tools */}
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
                  Current Analysis Tools
                </h3>
                <div className="flex flex-wrap gap-2">
                  {profile.dataAnalysisTools?.length ? (
                    profile.dataAnalysisTools.map((tool, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800 rounded-lg text-sm font-medium hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors touch-manipulation"
                      >
                        {tool}
                      </span>
                    ))
                  ) : (
                    <div className="w-full p-4 bg-muted/30 rounded-lg border-2 border-dashed border-muted-foreground/20 text-center">
                      <p className="text-muted-foreground font-medium">
                        No tools specified
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Challenges Faced */}
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
                  Current Challenges
                </h3>
                <div className="flex flex-wrap gap-2">
                  {profile.challengesFaced?.length ? (
                    profile.challengesFaced.map((challenge, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-2 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 rounded-lg text-sm font-medium hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors touch-manipulation"
                      >
                        {challenge}
                      </span>
                    ))
                  ) : (
                    <div className="w-full p-4 bg-muted/30 rounded-lg border-2 border-dashed border-muted-foreground/20 text-center">
                      <p className="text-muted-foreground font-medium">
                        No challenges specified
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Expected Outcomes */}
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
                  Expected Outcomes
                </h3>
                <div className="flex flex-wrap gap-2">
                  {profile.expectedOutcome?.length ? (
                    profile.expectedOutcome.map((outcome, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-2 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 rounded-lg text-sm font-medium hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors touch-manipulation"
                      >
                        {outcome}
                      </span>
                    ))
                  ) : (
                    <div className="w-full p-4 bg-muted/30 rounded-lg border-2 border-dashed border-muted-foreground/20 text-center">
                      <p className="text-muted-foreground font-medium">
                        No outcomes specified
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Needed Skills */}
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
                  Skills Needed
                </h3>
                <div className="flex flex-wrap gap-2">
                  {profile.neededSkills?.length ? (
                    profile.neededSkills.map((skill) => (
                      <span
                        key={skill._id}
                        className="inline-flex items-center px-3 py-2 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800 rounded-lg text-sm font-medium hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors touch-manipulation"
                      >
                        {skill.name}
                      </span>
                    ))
                  ) : (
                    <div className="w-full p-4 bg-muted/30 rounded-lg border-2 border-dashed border-muted-foreground/20 text-center">
                      <p className="text-muted-foreground font-medium">
                        No skills specified
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Company Overview Statistics - Mobile Optimized */}
        <div className="mt-4 sm:mt-6 lg:mt-8 bg-card border border-border rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg">
          <div className="flex items-center gap-3 mb-4 sm:mb-6">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center">
              <FiBarChart className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">
              Company Overview
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Account Status */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border border-green-200 dark:border-green-800 rounded-xl p-4 sm:p-6 text-center group hover:shadow-lg transition-all">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <FiCheck className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-green-700 dark:text-green-400 mb-1">
                {profile.verified ? "Verified" : "Pending"}
              </h3>
              <p className="text-sm text-green-600 dark:text-green-300 font-medium">
                Account Status
              </p>
            </div>

            {/* Company Age */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 sm:p-6 text-center group hover:shadow-lg transition-all">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <FiGlobe className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-blue-700 dark:text-blue-400 mb-1">
                {profile.companyCreatedAt
                  ? new Date(profile.companyCreatedAt).getFullYear()
                  : "N/A"}
              </h3>
              <p className="text-sm text-blue-600 dark:text-blue-300 font-medium">
                Founded
              </p>
            </div>

            {/* Team Size */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border border-purple-200 dark:border-purple-800 rounded-xl p-4 sm:p-6 text-center group hover:shadow-lg transition-all">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <FiUsers className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-purple-700 dark:text-purple-400 mb-1">
                {profile.noOfEmployees || "N/A"}
              </h3>
              <p className="text-sm text-purple-600 dark:text-purple-300 font-medium">
                Employees
              </p>
            </div>

            {/* Active Status */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border border-orange-200 dark:border-orange-800 rounded-xl p-4 sm:p-6 text-center group hover:shadow-lg transition-all">
              <div
                className={`w-12 h-12 sm:w-14 sm:h-14 ${
                  profile.active ? "bg-orange-500" : "bg-gray-500"
                } rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}
              >
                <FiSettings className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <h3
                className={`text-lg sm:text-xl font-bold mb-1 ${
                  profile.active
                    ? "text-orange-700 dark:text-orange-400"
                    : "text-gray-700 dark:text-gray-400"
                }`}
              >
                {profile.active ? "Active" : "Inactive"}
              </h3>
              <p
                className={`text-sm font-medium ${
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
