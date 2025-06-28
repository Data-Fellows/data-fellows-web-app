import { useToast } from "@/context/ToastContext";
import { getUser } from "@/helpers";
import { useDashboardData } from "@/hooks/useDashboard";
import { useEffect, useMemo, useState } from "react";
import {
  FiActivity,
  FiBookmark,
  FiBriefcase,
  FiCalendar,
  FiCheckCircle,
  FiEdit,
  FiMail,
  FiMapPin,
  FiTarget,
  FiUser,
} from "react-icons/fi";

// Skeleton Loader Components
const SkeletonCard = () => (
  <div className="bg-card rounded-xl p-6 border border-border animate-pulse">
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 bg-muted rounded-lg"></div>
      <div className="flex-1">
        <div className="h-4 bg-muted rounded w-24 mb-2"></div>
        <div className="h-6 bg-muted rounded w-16"></div>
      </div>
    </div>
  </div>
);

const SkeletonJobCard = () => (
  <div className="bg-card rounded-xl p-6 border border-border animate-pulse">
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-muted rounded-lg"></div>
        <div>
          <div className="h-5 bg-muted rounded w-32 mb-2"></div>
          <div className="h-4 bg-muted rounded w-24"></div>
        </div>
      </div>
    </div>
    <div className="flex items-center gap-4 mb-4">
      <div className="h-4 bg-muted rounded w-20"></div>
      <div className="h-4 bg-muted rounded w-24"></div>
    </div>
    <div className="flex items-center justify-between">
      <div className="flex gap-2">
        <div className="h-8 bg-muted rounded w-16"></div>
        <div className="h-8 bg-muted rounded w-20"></div>
      </div>
      <div className="w-5 h-5 bg-muted rounded"></div>
    </div>
  </div>
);

const SkeletonProfileCard = () => (
  <div className="bg-card rounded-xl p-6 border border-border animate-pulse">
    <div className="flex flex-col items-center text-center">
      <div className="w-20 h-20 bg-muted rounded-full mb-4"></div>
      <div className="h-6 bg-muted rounded w-32 mb-2"></div>
      <div className="h-4 bg-muted rounded w-40 mb-2"></div>
      <div className="h-4 bg-muted rounded w-36 mb-4"></div>
      <div className="h-10 bg-muted rounded w-full"></div>
    </div>
  </div>
);

export default function UserDashboard() {
  const [progressAnimation, setProgressAnimation] = useState(0);
  const { showToast } = useToast();
  const user = useMemo(() => getUser(), []); // Memoize user to prevent unnecessary re-renders

  // Use TanStack Query for data fetching
  const { stats, profile, suggestedJobs, applications, isLoading, hasError } =
    useDashboardData();

  // Calculate profile completion - must be before any conditional returns
  const profileCompletion = useMemo(() => {
    return (
      profile?.user?.profileCompletion ||
      user?.profileCompletion ||
      (user?.onboarded ? 100 : 85)
    );
  }, [
    profile?.user?.profileCompletion,
    user?.profileCompletion,
    user?.onboarded,
  ]);

  // Show error toast if any queries fail (only once)
  useEffect(() => {
    if (hasError) {
      showToast("Failed to load some dashboard data", "error");
    }
  }, [hasError, showToast]);

  // Animate progress bar after loading
  useEffect(() => {
    if (
      !isLoading &&
      (profile?.user?.profileCompletion || user?.profileCompletion)
    ) {
      const targetProgress =
        profile?.user?.profileCompletion || user?.profileCompletion || 85;
      let currentProgress = 0;
      const increment = targetProgress / 30; // 30 frames for smooth animation

      const animateProgress = () => {
        currentProgress += increment;
        if (currentProgress >= targetProgress) {
          setProgressAnimation(targetProgress);
        } else {
          setProgressAnimation(Math.round(currentProgress));
          requestAnimationFrame(animateProgress);
        }
      };

      // Start animation after a short delay
      setTimeout(() => {
        requestAnimationFrame(animateProgress);
      }, 300);
    }
  }, [isLoading, profile?.user?.profileCompletion, user?.profileCompletion]);

  const formatSalary = (min: number, max: number, currency = "USD") => {
    return `$${min} - $${max}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
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
      <div className="w-full min-h-screen bg-background py-6 px-6">
        <div className="w-full space-y-6">
          {/* Header Skeleton */}
          <div className="flex items-center justify-between">
            <div>
              <div className="h-8 bg-muted rounded w-48 mb-2"></div>
              <div className="h-5 bg-muted rounded w-64"></div>
            </div>
          </div>

          {/* Profile Completion Banner Skeleton */}
          <div className="bg-card rounded-xl p-6 border border-border animate-pulse">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-muted rounded-full"></div>
              <div className="flex-1">
                <div className="h-6 bg-muted rounded w-96 mb-2"></div>
                <div className="h-4 bg-muted rounded w-64"></div>
              </div>
              <div className="h-10 bg-muted rounded w-24"></div>
            </div>
          </div>

          {/* Stats Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Profile Card Skeleton */}
            <div className="lg:col-span-1">
              <SkeletonProfileCard />
            </div>

            {/* Suggested Matches Skeleton */}
            <div className="lg:col-span-3 space-y-6">
              <div className="flex items-center justify-between">
                <div className="h-6 bg-muted rounded w-40"></div>
                <div className="h-5 bg-muted rounded w-16"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                <SkeletonJobCard />
                <SkeletonJobCard />
                <SkeletonJobCard />
              </div>
            </div>
          </div>

          {/* Applications Skeleton */}
          <div className="space-y-4">
            <div className="h-6 bg-muted rounded w-32"></div>
            <div className="bg-card rounded-xl border border-border animate-pulse">
              <div className="p-4 border-b border-border">
                <div className="grid grid-cols-4 gap-4">
                  <div className="h-4 bg-muted rounded"></div>
                  <div className="h-4 bg-muted rounded"></div>
                  <div className="h-4 bg-muted rounded"></div>
                  <div className="h-4 bg-muted rounded"></div>
                </div>
              </div>
              <div className="divide-y divide-border">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-4">
                    <div className="grid grid-cols-4 gap-4">
                      <div className="h-4 bg-muted rounded"></div>
                      <div className="h-4 bg-muted rounded"></div>
                      <div className="h-4 bg-muted rounded"></div>
                      <div className="h-4 bg-muted rounded"></div>
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
    <div className="w-full min-h-screen bg-background py-6 px-6">
      <div className="w-full space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Welcome back, {profile?.user?.firstName || user?.firstName}!
            </p>
          </div>
        </div>

        {/* Profile Completion Banner */}
        <div className="bg-gradient-to-br from-card via-card to-accent/10 border border-border rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-8 translate-x-8"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-accent/10 rounded-full translate-y-8 -translate-x-8"></div>

          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-6">
              <div className="relative w-20 h-20">
                <svg
                  className="w-20 h-20 transform -rotate-90"
                  viewBox="0 0 80 80"
                >
                  <circle
                    cx="40"
                    cy="40"
                    r="36"
                    stroke="currentColor"
                    strokeWidth="6"
                    fill="transparent"
                    className="text-muted/30"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="36"
                    stroke="currentColor"
                    strokeWidth="6"
                    fill="transparent"
                    strokeDasharray={`${
                      (progressAnimation / 100) * 226.19
                    } 226.19`}
                    className="text-primary transition-all duration-1000 ease-out"
                    strokeLinecap="round"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="36"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="transparent"
                    strokeDasharray={`${
                      (progressAnimation / 100) * 226.19
                    } 226.19`}
                    className="text-primary/40 transition-all duration-1000 ease-out"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold text-primary">
                    {progressAnimation}%
                  </span>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground mb-2 leading-tight">
                  {profileCompletion === 100
                    ? "🎉 Congratulations! Your profile is complete"
                    : "🚀 Complete your profile to unlock premium features"}
                </h3>
                <p className="text-muted-foreground text-sm font-medium">
                  {profileCompletion === 100
                    ? "You're all set! Your complete profile helps you stand out to top employers and increases your visibility."
                    : `You're ${profileCompletion}% there! Complete the remaining ${
                        100 - profileCompletion
                      }% to unlock personalized job matches and priority placement.`}
                </p>
              </div>
            </div>
            <button className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors duration-200 flex items-center gap-2">
              {profileCompletion === 100 ? (
                <>
                  <FiTarget className="w-4 h-4" />
                  <span>Explore Jobs</span>
                </>
              ) : (
                <>
                  <FiEdit className="w-4 h-4" />
                  <span>Complete Now</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card rounded-xl p-6 border border-border shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02]">
            <div className="flex items-center gap-4">
              <div className="bg-muted p-3 rounded-xl">
                <FiBriefcase className="text-primary w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">
                  Total Applications
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {stats.totalApplications}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl p-6 border border-border shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02]">
            <div className="flex items-center gap-4">
              <div className="bg-muted p-3 rounded-xl">
                <FiCalendar className="text-primary w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">
                  Today's Applications
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {stats.todaysApplications}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl p-6 border border-border shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02]">
            <div className="flex items-center gap-4">
              <div className="bg-muted p-3 rounded-xl">
                <FiTarget className="text-primary w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">
                  Matches
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {stats.matches}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1 flex flex-col">
            <div className="bg-card rounded-xl p-6 border border-border shadow-sm sticky top-6 hover:shadow-md transition-all duration-200 h-fit">
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-6">
                  {profile?.user?.photoUrl || user?.photoUrl ? (
                    <img
                      src={profile?.user?.photoUrl || user?.photoUrl || ""}
                      alt="Profile"
                      width={100}
                      height={100}
                      className="w-25 h-25 rounded-full border-2 border-border shadow-sm object-cover"
                    />
                  ) : (
                    <div className="w-25 h-25 bg-muted rounded-full flex items-center justify-center shadow-sm">
                      <FiUser className="w-10 h-10 text-muted-foreground" />
                    </div>
                  )}
                  {(profile?.user?.verified || user?.verified) && (
                    <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1.5 border-2 border-background">
                      <FiCheckCircle className="text-white w-3 h-3" />
                    </div>
                  )}
                </div>

                <h3 className="font-semibold text-foreground text-lg mb-4">
                  {profile?.user?.firstName || user?.firstName}{" "}
                  {profile?.user?.lastName || user?.lastName}
                </h3>

                <div className="space-y-3 w-full mb-6">
                  {(profile?.user?.email || user?.email) && (
                    <div className="flex items-center gap-3 text-sm bg-muted/30 px-4 py-2.5 rounded-lg border border-border/50">
                      <FiMail className="w-4 h-4 text-muted-foreground" />
                      <span className="truncate text-foreground">
                        {profile?.user?.email || user?.email}
                      </span>
                    </div>
                  )}

                  {profile?.user?.skills && profile.user.skills.length > 0 && (
                    <div className="flex items-center gap-3 text-sm bg-muted/30 px-4 py-2.5 rounded-lg border border-border/50">
                      <FiTarget className="w-4 h-4 text-muted-foreground" />
                      <span className="text-foreground">
                        {profile.user.skills.slice(0, 2).map((skill, index) => (
                          <span key={skill._id} className="font-medium">
                            {skill.name}
                            {index === 0 &&
                              profile.user.skills.length > 1 &&
                              ", "}
                          </span>
                        ))}
                      </span>
                    </div>
                  )}
                </div>

                <button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2">
                  <FiUser className="w-4 h-4" />
                  View Profile
                </button>
              </div>
            </div>
          </div>

          {/* Suggested Matches */}
          <div className="lg:col-span-3 flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-foreground flex items-center gap-4">
                <div className="bg-gradient-to-r from-primary to-primary/80 p-3 rounded-xl shadow-lg">
                  <FiTarget className="w-6 h-6 text-white" />
                </div>
                Suggested Matches
              </h2>
              <button className="bg-primary/10 hover:bg-primary/20 border border-primary/20 text-primary hover:text-primary/90 text-sm font-semibold transition-all duration-300 px-6 py-3 rounded-xl shadow-md hover:shadow-lg">
                See all
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 flex-1">
              {suggestedJobs.length > 0 ? (
                suggestedJobs.map((job) => (
                  <div
                    key={job._id}
                    className="group relative bg-card border border-border rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:border-primary/30 overflow-hidden"
                  >
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/5 to-transparent rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-accent/5 to-transparent rounded-full translate-y-12 -translate-x-12 group-hover:scale-125 transition-transform duration-700"></div>

                    {/* Content */}
                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex items-start gap-4 flex-1 min-w-0">
                          <div className="bg-gradient-to-br from-primary/20 to-primary/10 p-3 rounded-xl border border-primary/20 shadow-md group-hover:shadow-lg transition-all duration-300">
                            <FiBriefcase className="text-primary w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-bold text-foreground text-base leading-tight mb-2 group-hover:text-primary transition-colors duration-300">
                              {job.fellowField}
                            </h3>
                            <p className="text-sm text-muted-foreground font-medium">
                              {job.employer.companyName}
                            </p>
                          </div>
                        </div>
                        {job.status === "Unsolved" && (
                          <div className="bg-orange-50 border border-orange-200 text-orange-700 dark:bg-orange-900/20 dark:border-orange-800/30 dark:text-orange-400 px-3 py-1.5 rounded-full text-xs font-semibold shadow-md">
                            Active
                          </div>
                        )}
                      </div>

                      {/* Job details */}
                      <div className="space-y-4 mb-6">
                        <div className="bg-muted/30 border border-border/50 rounded-lg p-3 hover:bg-muted/50 transition-all duration-300">
                          <div className="flex items-center gap-3 text-sm">
                            <div className="bg-primary/10 p-1.5 rounded-lg">
                              <FiMapPin className="w-4 h-4 text-primary" />
                            </div>
                            <span className="font-medium text-foreground">
                              {job.employer.companyCity},{" "}
                              {job.employer.companyCountry}
                            </span>
                          </div>
                        </div>

                        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/30 rounded-lg p-3 hover:bg-green-100 dark:hover:bg-green-900/30 transition-all duration-300">
                          <div className="flex items-center gap-3 text-sm">
                            <div className="bg-green-500/20 p-1.5 rounded-lg">
                              <FiActivity className="w-4 h-4 text-green-600" />
                            </div>
                            <span className="font-bold text-green-600">
                              {formatSalary(job.payRange.min, job.payRange.max)}
                            </span>
                          </div>
                        </div>

                        {/* Job type badges */}
                        {job.type && job.type.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {job.type.map((type, index) => (
                              <span
                                key={index}
                                className="bg-accent/10 border border-accent/20 text-accent-foreground px-3 py-1 rounded-full text-xs font-medium shadow-sm"
                              >
                                {type}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <div className="flex gap-3">
                          <button className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105">
                            Apply Now
                          </button>
                          <button className="border border-border bg-background hover:bg-muted/50 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 hover:shadow-md">
                            View Details
                          </button>
                        </div>
                        <button className="bg-muted/50 hover:bg-primary/20 border border-border hover:border-primary/30 p-2.5 rounded-lg transition-all duration-300 hover:scale-110 group-hover:rotate-12">
                          <FiBookmark className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full bg-card border border-border rounded-2xl p-16 text-center shadow-lg relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/3 to-accent/3"></div>
                  <div className="relative z-10">
                    <div className="bg-muted/30 border border-border w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
                      <FiTarget className="w-10 h-10 text-primary" />
                    </div>
                    <h3 className="font-bold text-foreground text-xl mb-3">
                      No matches yet
                    </h3>
                    <p className="text-muted-foreground text-base mb-6 max-w-sm mx-auto">
                      Complete your profile to get personalized job
                      recommendations
                    </p>
                    <button className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
                      Complete Profile
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Applications - Full Width */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">
              Applications
            </h2>
            <button className="text-primary hover:text-primary/80 text-sm font-medium transition-colors">
              View all
            </button>
          </div>

          <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
            <div className="p-4 bg-muted border-b border-border">
              <div className="grid grid-cols-4 gap-4">
                <span className="text-sm font-bold text-foreground">
                  Company
                </span>
                <span className="text-sm font-bold text-foreground">Role</span>
                <span className="text-sm font-bold text-foreground">
                  Date Applied
                </span>
                <span className="text-sm font-bold text-foreground">
                  Status
                </span>
              </div>
            </div>

            <div className="divide-y divide-border">
              {applications.length > 0 ? (
                applications.slice(0, 8).map((application, index) => (
                  <div
                    key={application._id}
                    className="p-4 hover:bg-muted/30 transition-colors duration-200"
                  >
                    <div className="grid grid-cols-4 gap-4 items-center">
                      <span className="font-medium text-foreground text-sm">
                        {application.company}
                      </span>
                      <span className="text-muted-foreground text-sm">
                        {application.jobTitle}
                      </span>
                      <span className="text-muted-foreground text-sm">
                        {new Date(application.appliedAt).toLocaleDateString()}
                      </span>
                      <span
                        className={`px-2.5 py-1 rounded-md text-xs font-medium capitalize inline-block w-fit ${getStatusColor(
                          application.status
                        )}`}
                      >
                        {application.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center bg-card">
                  <div className="bg-muted/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiBriefcase className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-semibold text-foreground text-lg mb-2">
                    No applications yet
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Start applying to jobs to track your progress here
                  </p>
                  <button className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors duration-200">
                    Browse Jobs
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
