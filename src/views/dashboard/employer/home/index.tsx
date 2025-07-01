import { usePostProblemModal } from "@/context/PostProblemModalContext";
import { useToast } from "@/context/ToastContext";
import { getUser } from "@/helpers";
import {
  useEmployerStats,
  useRecentApplications,
} from "@/hooks/useEmployerDashboard";
import { useEmployerProfile } from "@/hooks/useEmployerProfile";
import { useSuggestedProblems } from "@/hooks/useSuggestedProblems";
import { useRouter } from "next/router";
import { useEffect, useMemo } from "react";
import {
  FiBriefcase,
  FiClock,
  FiEdit,
  FiEye,
  FiHome,
  FiPlus,
  FiTarget,
  FiUser,
  FiUsers,
} from "react-icons/fi";

const SkeletonCard = () => (
  <div className="bg-card rounded-xl p-4 sm:p-6 border border-border animate-pulse">
    <div className="flex items-center gap-3 sm:gap-4">
      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-muted rounded-lg flex-shrink-0"></div>
      <div className="flex-1">
        <div className="h-3 sm:h-4 bg-muted rounded w-20 sm:w-24 mb-2"></div>
        <div className="h-5 sm:h-6 bg-muted rounded w-12 sm:w-16"></div>
      </div>
    </div>
  </div>
);

const SkeletonJobCard = () => (
  <div className="bg-card rounded-xl p-4 sm:p-6 border border-border animate-pulse">
    <div className="flex items-start justify-between mb-3 sm:mb-4">
      <div className="flex items-center gap-2 sm:gap-3 flex-1">
        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-muted rounded-lg flex-shrink-0"></div>
        <div className="min-w-0 flex-1">
          <div className="h-4 sm:h-5 bg-muted rounded w-24 sm:w-32 mb-1 sm:mb-2"></div>
          <div className="h-3 sm:h-4 bg-muted rounded w-20 sm:w-24"></div>
        </div>
      </div>
    </div>
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-3 sm:mb-4">
      <div className="h-3 sm:h-4 bg-muted rounded w-16 sm:w-20"></div>
      <div className="h-3 sm:h-4 bg-muted rounded w-20 sm:w-24"></div>
    </div>
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
      <div className="flex gap-2">
        <div className="h-7 sm:h-8 bg-muted rounded w-16 sm:w-16"></div>
        <div className="h-7 sm:h-8 bg-muted rounded w-18 sm:w-20"></div>
      </div>
      <div className="w-4 h-4 sm:w-5 sm:h-5 bg-muted rounded self-end sm:self-auto"></div>
    </div>
  </div>
);

const SkeletonProfileCard = () => (
  <div className="bg-card rounded-xl p-4 sm:p-6 border border-border animate-pulse">
    <div className="flex flex-col items-center text-center">
      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-muted rounded-full mb-3 sm:mb-4"></div>
      <div className="h-5 sm:h-6 bg-muted rounded w-24 sm:w-32 mb-2"></div>
      <div className="h-3 sm:h-4 bg-muted rounded w-32 sm:w-40 mb-1 sm:mb-2"></div>
      <div className="h-3 sm:h-4 bg-muted rounded w-28 sm:w-36 mb-3 sm:mb-4"></div>
      <div className="h-8 sm:h-10 bg-muted rounded w-full"></div>
    </div>
  </div>
);

export default function EmployerDashboard() {
  const router = useRouter();
  const { showToast } = useToast();
  const { openModal } = usePostProblemModal();
  const user = useMemo(() => getUser(), []);

  // Fetch real data from APIs
  const {
    profile,
    isLoading: profileLoading,
    error: profileError,
  } = useEmployerProfile();
  const {
    suggestions,
    isLoading: suggestionsLoading,
    error: suggestionsError,
  } = useSuggestedProblems();
  const {
    stats,
    isLoading: statsLoading,
    error: statsError,
  } = useEmployerStats();
  const {
    applications: recentApplications,
    isLoading: applicationsLoading,
    error: applicationsError,
  } = useRecentApplications();

  // Derive employer stats from API data with fallback
  const employerStats = stats || {
    totalProblems: 0,
    activeProblems: 0,
    totalApplications: 0,
    totalHired: 0,
    totalShortlisted: 0,
    avgApplicationsPerProblem: 0,
  };

  // Company information from user object or profile
  const companyInfo = {
    name: profile?.companyName || user?.companyName || "Your Company",
    logo: profile?.companyLogo || user?.companyLogo,
    email: profile?.email || user?.email,
    industry: user?.industry || "Technology",
    size: profile?.noOfEmployees || user?.noOfEmployees || "Not specified",
    location:
      profile?.companyCity && profile?.companyCountry
        ? `${profile.companyCity}, ${profile.companyCountry}`
        : user?.location || "Not specified",
    website: user?.website,
    description:
      profile?.companyAbout ||
      user?.companyDescription ||
      "No description available",
    established: user?.yearEstablished,
    phone: profile?.companyPhone || user?.phoneNumber,
    address: profile?.companyAddress || user?.companyAddress,
    state: profile?.companyState || user?.companyState,
    type: profile?.companyType || user?.companyType,
  };

  // Recent applications are now fetched from the API

  const isLoading =
    profileLoading || suggestionsLoading || statsLoading || applicationsLoading;
  const hasError =
    profileError || suggestionsError || statsError || applicationsError;

  useEffect(() => {
    if (hasError) {
      showToast("Failed to load some dashboard data", "error");
    }
  }, [hasError, showToast]);

  const formatSalary = (min: number, max: number, currency = "USD") => {
    return `$${min} - $${max}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case "applied":
      case "pending":
        return "bg-yellow-50 text-yellow-700 border border-yellow-200 dark:bg-yellow-900/10 dark:text-yellow-400 dark:border-yellow-800/30";
      case "shortlisted":
        return "bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/10 dark:text-blue-400 dark:border-blue-800/30";
      case "interview":
        return "bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-900/10 dark:text-purple-400 dark:border-purple-800/30";
      case "hired":
        return "bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/10 dark:text-green-400 dark:border-green-800/30";
      case "rejected":
        return "bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/10 dark:text-red-400 dark:border-red-800/30";
      default:
        return "bg-gray-50 text-gray-700 border border-gray-200 dark:bg-gray-900/10 dark:text-gray-400 dark:border-gray-800/30";
    }
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-background py-4 sm:py-6 px-4 sm:px-6">
        <div className="w-full space-y-4 sm:space-y-6">
          {/* Header Skeleton */}
          <div className="flex items-center justify-between">
            <div>
              <div className="h-6 sm:h-8 bg-muted rounded w-32 sm:w-48 mb-1 sm:mb-2"></div>
              <div className="h-4 sm:h-5 bg-muted rounded w-40 sm:w-64"></div>
            </div>
          </div>

          {/* Profile Completion Banner Skeleton */}
          <div className="bg-card rounded-xl p-4 sm:p-6 border border-border animate-pulse">
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-muted rounded-full flex-shrink-0"></div>
              <div className="flex-1 text-center sm:text-left">
                <div className="h-5 sm:h-6 bg-muted rounded w-64 sm:w-96 mb-1 sm:mb-2 mx-auto sm:mx-0"></div>
                <div className="h-3 sm:h-4 bg-muted rounded w-48 sm:w-64 mx-auto sm:mx-0"></div>
              </div>
              <div className="h-8 sm:h-10 bg-muted rounded w-24 sm:w-24 flex-shrink-0"></div>
            </div>
          </div>

          {/* Stats Cards Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            <SkeletonCard />
            <SkeletonCard />
            <div className="sm:col-span-2 md:col-span-1">
              <SkeletonCard />
            </div>
          </div>

          {/* Suggested Problems Skeleton */}
          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
              <div className="h-5 sm:h-6 bg-muted rounded w-32 sm:w-40"></div>
              <div className="h-4 sm:h-5 bg-muted rounded w-16 sm:w-16"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              <SkeletonJobCard />
              <SkeletonJobCard />
              <SkeletonJobCard />
              <SkeletonJobCard />
            </div>
          </div>

          {/* Applications Skeleton */}
          <div className="space-y-3 sm:space-y-4">
            <div className="h-5 sm:h-6 bg-muted rounded w-28 sm:w-32"></div>
            <div className="bg-card rounded-xl border border-border animate-pulse overflow-hidden">
              <div className="p-3 sm:p-4 border-b border-border">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
                  <div className="h-3 sm:h-4 bg-muted rounded"></div>
                  <div className="h-3 sm:h-4 bg-muted rounded"></div>
                  <div className="h-3 sm:h-4 bg-muted rounded hidden sm:block"></div>
                  <div className="h-3 sm:h-4 bg-muted rounded hidden sm:block"></div>
                </div>
              </div>
              <div className="divide-y divide-border">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-3 sm:p-4">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
                      <div className="h-3 sm:h-4 bg-muted rounded"></div>
                      <div className="h-3 sm:h-4 bg-muted rounded"></div>
                      <div className="h-3 sm:h-4 bg-muted rounded hidden sm:block"></div>
                      <div className="h-3 sm:h-4 bg-muted rounded hidden sm:block"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-background py-4 sm:py-6 px-4 sm:px-6">
      <div className="w-full space-y-4 sm:space-y-6">
        {/* Header with Company Info */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6">
          <div className="flex items-center gap-4">
            {/* Company Logo */}
            <div className="relative">
              {companyInfo.logo ? (
                <img
                  src={companyInfo.logo}
                  alt={`${companyInfo.name} logo`}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl border-2 border-border shadow-md object-cover"
                />
              ) : (
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl border-2 border-primary/20 shadow-md flex items-center justify-center">
                  <FiHome className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
                </div>
              )}
            </div>

            {/* Company Details */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                {companyInfo.name}
              </h1>
              <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                Welcome back, {profile?.firstName || user?.firstName}! Manage
                your company's talent pipeline.
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => openModal()}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 text-sm"
            >
              <FiPlus className="w-4 h-4" />
              Post Problem
            </button>
            <button
              onClick={() => router.push("/dashboard/profile")}
              className="bg-muted hover:bg-muted/80 text-foreground px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 text-sm"
            >
              <FiEdit className="w-4 h-4" />
              Edit Profile
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-card rounded-xl p-4 sm:p-6 border border-border shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02]">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-2 sm:p-3 rounded-xl">
                <FiBriefcase className="text-blue-600 dark:text-blue-400 w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground font-medium">
                  Total Applications
                </p>
                <p className="text-xl sm:text-2xl font-bold text-foreground">
                  {employerStats.totalApplications}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl p-4 sm:p-6 border border-border shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02]">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="bg-green-50 dark:bg-green-900/20 p-2 sm:p-3 rounded-xl">
                <FiUsers className="text-green-600 dark:text-green-400 w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground font-medium">
                  Hired Candidates
                </p>
                <p className="text-xl sm:text-2xl font-bold text-foreground">
                  {employerStats.totalHired}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl p-4 sm:p-6 border border-border shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02]">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="bg-orange-50 dark:bg-orange-900/20 p-2 sm:p-3 rounded-xl">
                <FiTarget className="text-orange-600 dark:text-orange-400 w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground font-medium">
                  Active Problems
                </p>
                <p className="text-xl sm:text-2xl font-bold text-foreground">
                  {employerStats.activeProblems}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl p-4 sm:p-6 border border-border shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02]">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="bg-purple-50 dark:bg-purple-900/20 p-2 sm:p-3 rounded-xl">
                <FiEye className="text-purple-600 dark:text-purple-400 w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground font-medium">
                  Total Shortlisted
                </p>
                <p className="text-xl sm:text-2xl font-bold text-foreground">
                  {employerStats.totalShortlisted}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground flex items-center gap-3 sm:gap-4">
              <div className="bg-gradient-to-r from-primary to-primary/80 p-2 sm:p-3 rounded-xl shadow-lg">
                <FiTarget className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              Suggested Problems
            </h2>
            <div className="flex items-center gap-3">
              <span className="text-xs sm:text-sm text-muted-foreground">
                {suggestions.length > 0
                  ? `Showing ${Math.min(4, suggestions.length)} of ${
                      suggestions.length
                    }`
                  : "0 suggestions"}
              </span>
              {suggestions.length > 4 && (
                <button
                  onClick={() => router.push("/dashboard/problems")}
                  className="bg-primary/10 hover:bg-primary/20 border border-primary/20 text-primary hover:text-primary/90 text-xs sm:text-sm font-semibold transition-all duration-300 px-4 sm:px-6 py-2 sm:py-3 rounded-xl shadow-md hover:shadow-lg"
                >
                  View All
                </button>
              )}
            </div>
          </div>

          {/* Suggested Problems Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
            {suggestionsLoading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <SkeletonJobCard key={index} />
              ))
            ) : suggestions.length > 0 ? (
              suggestions.slice(0, 4).map((suggestion, index) => (
                <div
                  key={index}
                  className="group relative bg-card border border-border rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:border-primary/30 overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-primary/5 to-transparent rounded-full -translate-y-12 translate-x-12 sm:-translate-y-16 sm:translate-x-16 group-hover:scale-150 transition-transform duration-700"></div>
                  <div className="absolute bottom-0 left-0 w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-tr from-accent/5 to-transparent rounded-full translate-y-10 -translate-x-10 sm:translate-y-12 sm:-translate-x-12 group-hover:scale-125 transition-transform duration-700"></div>

                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-4 sm:mb-6">
                      <div className="flex items-center gap-2 sm:gap-3 flex-1">
                        <div className="bg-gradient-to-br from-primary/20 to-primary/10 p-2 sm:p-3 rounded-xl border border-primary/20 shadow-md group-hover:shadow-lg transition-all duration-300">
                          <FiBriefcase className="text-primary w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform duration-300" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-bold text-foreground text-sm sm:text-base leading-tight mb-1 sm:mb-2 group-hover:text-primary transition-colors duration-300">
                            {suggestion.fellowField}
                          </h3>
                          <p className="text-xs sm:text-sm text-muted-foreground font-medium">
                            {suggestion.type.join(", ")}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-3 sm:mb-4">
                      <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm bg-green-50 dark:bg-green-900/20 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border border-green-200 dark:border-green-800/30">
                        <span className="text-green-600 dark:text-green-400 font-semibold">
                          {formatSalary(
                            suggestion.payRange.min,
                            suggestion.payRange.max
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="text-xs sm:text-sm text-muted-foreground font-medium mb-2 truncate">
                      {suggestion.candidatesQualification}
                    </div>

                    <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6 line-clamp-3 leading-relaxed">
                      {suggestion.description}
                    </p>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                      <div className="flex gap-1 sm:gap-2 flex-wrap">
                        {suggestion.skills
                          .slice(0, 2)
                          .map((skill, skillIndex) => (
                            <span
                              key={skillIndex}
                              className="bg-accent/10 border border-accent/20 text-accent-foreground px-2 sm:px-3 py-1 rounded-full text-xs font-medium shadow-sm"
                            >
                              {skill}
                            </span>
                          ))}
                        {suggestion.skills.length > 2 && (
                          <span className="bg-muted/50 border border-border text-muted-foreground px-2 sm:px-3 py-1 rounded-full text-xs font-medium">
                            +{suggestion.skills.length - 2}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => {
                          openModal(suggestion);
                        }}
                        className="self-end sm:self-auto text-white p-2 sm:p-2.5 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 bg-primary hover:bg-primary/90"
                        title="Create problem from this template"
                      >
                        <FiPlus className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full bg-card border border-border rounded-2xl p-8 sm:p-16 text-center shadow-lg relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/3 to-accent/3"></div>
                <div className="relative z-10">
                  <div className="bg-muted/30 border border-border w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-md">
                    <FiTarget className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
                  </div>
                  <h3 className="font-bold text-foreground text-lg sm:text-xl mb-2 sm:mb-3">
                    No suggestions available
                  </h3>
                  <p className="text-muted-foreground text-sm sm:text-base mb-4 sm:mb-6 max-w-sm mx-auto">
                    Complete your company profile to get personalized problem
                    suggestions
                  </p>
                  <button
                    onClick={() => router.push("/dashboard/profile")}
                    className="bg-primary hover:bg-primary/90 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 text-sm sm:text-base"
                  >
                    Complete Profile
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Recent Applications Section */}
        <div className="space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 gap-2 sm:gap-0">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground flex items-center gap-3 sm:gap-4">
              <div className="bg-gradient-to-r from-primary to-primary/80 p-2 sm:p-3 rounded-xl shadow-lg">
                <FiUsers className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              Recent Applications
            </h2>
            <button
              onClick={() => router.push("/dashboard/applications")}
              className="bg-primary/10 hover:bg-primary/20 border border-primary/20 text-primary hover:text-primary/90 text-xs sm:text-sm font-semibold transition-all duration-300 px-4 sm:px-6 py-2 sm:py-3 rounded-xl shadow-md hover:shadow-lg self-start sm:self-auto"
            >
              View All Applications
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {recentApplications && recentApplications.length > 0 ? (
              recentApplications.map((application) => (
                <div
                  key={application.applicationId}
                  className="group relative bg-card border border-border rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:border-primary/30 overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-primary/5 to-transparent rounded-full -translate-y-12 translate-x-12 sm:-translate-y-16 sm:translate-x-16 group-hover:scale-150 transition-transform duration-700"></div>
                  <div className="absolute bottom-0 left-0 w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-tr from-accent/5 to-transparent rounded-full translate-y-10 -translate-x-10 sm:translate-y-12 sm:-translate-x-12 group-hover:scale-125 transition-transform duration-700"></div>

                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-4 sm:mb-6">
                      <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
                        <div className="bg-gradient-to-br from-primary/20 to-primary/10 p-2 sm:p-3 rounded-xl border border-primary/20 shadow-md group-hover:shadow-lg transition-all duration-300 flex-shrink-0">
                          {application.applicant.photoUrl ? (
                            <img
                              src={application.applicant.photoUrl}
                              alt={`${application.applicant.firstName} ${application.applicant.lastName}`}
                              className="w-4 h-4 sm:w-5 sm:h-5 rounded-full object-cover"
                            />
                          ) : (
                            <FiUser className="text-primary w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform duration-300" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-bold text-foreground text-sm sm:text-base leading-tight mb-1 sm:mb-2 group-hover:text-primary transition-colors duration-300">
                            {application.applicant.firstName}{" "}
                            {application.applicant.lastName}
                          </h3>
                          <p className="text-xs sm:text-sm text-muted-foreground font-medium truncate">
                            {application.problem.fellowField}
                          </p>
                        </div>
                      </div>
                      <div
                        className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-semibold flex-shrink-0 ${getStatusColor(
                          application.status
                        )}`}
                      >
                        {application.status}
                      </div>
                    </div>

                    <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                      <div className="bg-muted/30 border border-border/50 rounded-lg p-2 sm:p-3 hover:bg-muted/50 transition-all duration-300">
                        <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                          <div className="bg-primary/10 p-1 sm:p-1.5 rounded-lg">
                            <FiTarget className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                          </div>
                          <span className="font-medium text-foreground truncate">
                            {application.match}% match
                          </span>
                        </div>
                      </div>

                      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/30 rounded-lg p-2 sm:p-3 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all duration-300">
                        <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                          <div className="bg-blue-500/20 p-1 sm:p-1.5 rounded-lg">
                            <FiClock className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                          </div>
                          <span className="font-medium text-blue-600">
                            Applied {formatDate(application.applicationDate)}
                          </span>
                        </div>
                      </div>

                      {application.problem.skills &&
                        application.problem.skills.length > 0 && (
                          <div className="flex flex-wrap gap-1 sm:gap-2">
                            {application.problem.skills
                              .slice(0, 2)
                              .map((skill, index) => (
                                <span
                                  key={index}
                                  className="bg-accent/10 border border-accent/20 text-accent-foreground px-2 sm:px-3 py-1 rounded-full text-xs font-medium shadow-sm"
                                >
                                  {skill}
                                </span>
                              ))}
                            {application.problem.skills.length > 2 && (
                              <span className="bg-muted/50 border border-border text-muted-foreground px-2 sm:px-3 py-1 rounded-full text-xs font-medium">
                                +{application.problem.skills.length - 2}
                              </span>
                            )}
                          </div>
                        )}
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-3 sm:pt-4 border-t border-border gap-3 sm:gap-0">
                      <div className="flex gap-2 sm:gap-3">
                        <button
                          onClick={() =>
                            router.push(
                              `/dashboard/applications/${application.applicationId}`
                            )
                          }
                          className="flex-1 sm:flex-none px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 bg-primary hover:bg-primary/90 text-white"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() =>
                            router.push(
                              `/dashboard/applications/${application.applicationId}/interview`
                            )
                          }
                          className="flex-1 sm:flex-none border border-border bg-background hover:bg-muted/50 px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 hover:shadow-md"
                        >
                          Schedule Interview
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full bg-card border border-border rounded-2xl p-8 sm:p-16 text-center shadow-lg relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/3 to-accent/3"></div>
                <div className="relative z-10">
                  <div className="bg-muted/30 border border-border w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-md">
                    <FiUsers className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
                  </div>
                  <h3 className="font-bold text-foreground text-lg sm:text-xl mb-2 sm:mb-3">
                    No applications yet
                  </h3>
                  <p className="text-muted-foreground text-sm sm:text-base mb-4 sm:mb-6 max-w-sm mx-auto">
                    Post your first problem to start receiving applications from
                    talented data fellows
                  </p>
                  <button
                    onClick={() => router.push("/dashboard/problems/create")}
                    className="bg-primary hover:bg-primary/90 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 text-sm sm:text-base"
                  >
                    Post Your First Problem
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
