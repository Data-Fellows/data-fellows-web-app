import { getUserProfile } from "@/api/profile";
import { useToast } from "@/context/ToastContext";
import { getUser } from "@/helpers";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  FiArrowLeft,
  FiBook,
  FiBriefcase,
  FiCalendar,
  FiDownload,
  FiMail,
  FiMapPin,
  FiPhone,
  FiUser,
  FiUsers,
} from "react-icons/fi";

const SkeletonLoader = () => (
  <div className="animate-pulse">
    {/* Header skeleton */}
    <div className="bg-card border border-border rounded-xl p-6 mb-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
        <div className="w-24 h-24 sm:w-32 sm:h-32 bg-muted rounded-full flex-shrink-0"></div>
        <div className="flex-1 space-y-3">
          <div className="h-8 bg-muted rounded w-48"></div>
          <div className="h-5 bg-muted rounded w-32"></div>
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded w-64"></div>
            <div className="h-4 bg-muted rounded w-48"></div>
            <div className="h-4 bg-muted rounded w-56"></div>
          </div>
        </div>
      </div>
    </div>

    {/* Content skeleton */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        {/* Skills skeleton */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="h-6 bg-muted rounded w-24 mb-4"></div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-8 bg-muted rounded"></div>
            ))}
          </div>
        </div>

        {/* Work experience skeleton */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="h-6 bg-muted rounded w-32 mb-4"></div>
          <div className="space-y-4">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-5 bg-muted rounded w-48"></div>
                <div className="h-4 bg-muted rounded w-32"></div>
                <div className="h-4 bg-muted rounded w-24"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Education skeleton */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="h-6 bg-muted rounded w-24 mb-4"></div>
          <div className="space-y-4">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-5 bg-muted rounded w-56"></div>
                <div className="h-4 bg-muted rounded w-40"></div>
                <div className="h-4 bg-muted rounded w-32"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sidebar skeleton */}
      <div className="space-y-6">
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="h-6 bg-muted rounded w-32 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-muted rounded w-full"></div>
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-5/6"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default function UserProfileView() {
  const router = useRouter();
  const { id } = router.query;
  const { showToast } = useToast();

  const [profileData, setProfileData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id && typeof id === "string") {
      fetchUserProfile(id);
    }
  }, [id]);

  const fetchUserProfile = async (userId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getUserProfile(userId);
      setProfileData(response);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setError("Failed to load user profile");
      showToast("Failed to load user profile", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <FiArrowLeft className="w-4 h-4" />
              Back
            </button>
          </div>
          <SkeletonLoader />
        </div>
      </div>
    );
  }

  if (error || !profileData || !profileData.user) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <FiArrowLeft className="w-4 h-4" />
              Back
            </button>
          </div>
          <div className="text-center py-12">
            <FiUser className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Profile Not Found
            </h3>
            <p className="text-muted-foreground mb-4">
              {error || "The user profile you're looking for doesn't exist."}
            </p>
            <button
              onClick={handleBack}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  const profile = profileData.user;
  const applications = profileData.applicationDetails || [];
  const bookmarkedJobs = profile.bookmarkedJobs || [];
  const fullName = `${profile.firstName || ""} ${
    profile.lastName || ""
  }`.trim();
  const location = [profile.city, profile.state, profile.country]
    .filter(Boolean)
    .join(", ");

  // Check if current user can see bookmarked jobs
  // Only the profile owner should see their own bookmarked jobs
  const currentUser = getUser();
  const canSeeBookmarkedJobs = currentUser && currentUser._id === profile._id;
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <FiArrowLeft className="w-4 h-4" />
            Back
          </button>
        </div>

        {/* Profile Header */}
        <div className="bg-card border border-border rounded-xl p-6 mb-6 shadow-lg">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
              {profile.photoUrl ? (
                <img
                  src={profile.photoUrl}
                  alt={fullName}
                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover"
                />
              ) : (
                <span className="text-primary font-bold text-2xl sm:text-4xl">
                  {(profile.firstName?.[0] || "").toUpperCase()}
                  {(profile.lastName?.[0] || "").toUpperCase()}
                </span>
              )}
            </div>

            <div className="flex-1 space-y-3">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                  {fullName || "Unknown User"}
                </h1>
                <p className="text-muted-foreground mt-1">
                  Data Fellow Profile
                </p>
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                {profile.email && (
                  <div className="flex items-center gap-2">
                    <FiMail className="w-4 h-4" />
                    <span>{profile.email}</span>
                  </div>
                )}
                {profile.phone && (
                  <div className="flex items-center gap-2">
                    <FiPhone className="w-4 h-4" />
                    <span>{profile.phone}</span>
                  </div>
                )}
                {location && (
                  <div className="flex items-center gap-2">
                    <FiMapPin className="w-4 h-4" />
                    <span>{location}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <FiCalendar className="w-4 h-4" />
                  <span>
                    Joined{" "}
                    {profile.createdAt
                      ? new Date(profile.createdAt).toLocaleDateString()
                      : "Recently"}
                  </span>
                </div>
              </div>

              {profile.bio && (
                <p className="text-foreground mt-4 max-w-2xl">{profile.bio}</p>
              )}
            </div>

            {/* Profile Completion Badge */}
            <div className="flex flex-col items-center gap-2 bg-muted/50 rounded-lg p-4">
              <div className="text-sm font-medium text-muted-foreground">
                Profile Completion
              </div>
              <div className="text-2xl font-bold text-primary">
                {profile.profileCompletion || 0}%
              </div>
              <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${profile.profileCompletion || 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Skills Section */}
            {profile.skills && profile.skills.length > 0 && (
              <div className="bg-card border border-border rounded-xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <FiUser className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-semibold text-foreground">
                    Skills
                  </h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill: any, index: number) => (
                    <span
                      key={skill._id || index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20"
                    >
                      {typeof skill === "string" ? skill : skill.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Work Experience Section */}
            {profile.workExperience && profile.workExperience.length > 0 && (
              <div className="bg-card border border-border rounded-xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <FiBriefcase className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-semibold text-foreground">
                    Work Experience
                  </h2>
                </div>
                <div className="space-y-6">
                  {profile.workExperience.map((work: any, index: number) => (
                    <div
                      key={work._id || index}
                      className="border-l-2 border-primary/20 pl-4"
                    >
                      <h3 className="font-semibold text-foreground text-lg">
                        {work.title}
                      </h3>
                      <p className="text-muted-foreground font-medium">
                        {work.company}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <div className="flex items-center gap-1">
                          <FiCalendar className="w-3 h-3" />
                          <span>
                            {work.startDate &&
                              new Date(work.startDate).toLocaleDateString()}
                            {" - "}
                            {work.endDate
                              ? new Date(work.endDate).toLocaleDateString()
                              : "Present"}
                          </span>
                        </div>
                        {work.location && (
                          <div className="flex items-center gap-1">
                            <FiMapPin className="w-3 h-3" />
                            <span>{work.location}</span>
                          </div>
                        )}
                      </div>
                      {work.description && (
                        <p className="text-muted-foreground mt-2 text-sm">
                          {work.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education Section */}
            {profile.educationHistory &&
              profile.educationHistory.length > 0 && (
                <div className="bg-card border border-border rounded-xl p-6 shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <FiBook className="w-5 h-5 text-primary" />
                    <h2 className="text-xl font-semibold text-foreground">
                      Education
                    </h2>
                  </div>
                  <div className="space-y-6">
                    {profile.educationHistory.map((edu: any, index: number) => (
                      <div
                        key={edu._id || index}
                        className="border-l-2 border-primary/20 pl-4"
                      >
                        <h3 className="font-semibold text-foreground text-lg">
                          {edu.degree}{" "}
                          {edu.fieldOfStudy && `in ${edu.fieldOfStudy}`}
                        </h3>
                        <p className="text-muted-foreground font-medium">
                          {edu.school}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          <div className="flex items-center gap-1">
                            <FiCalendar className="w-3 h-3" />
                            <span>
                              {edu.startDate &&
                                new Date(edu.startDate).toLocaleDateString()}
                              {" - "}
                              {edu.endDate
                                ? new Date(edu.endDate).toLocaleDateString()
                                : "In Progress"}
                            </span>
                          </div>
                        </div>
                        {edu.description && (
                          <p className="text-muted-foreground mt-2 text-sm">
                            {edu.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* Applications Section */}
            {applications && applications.length > 0 && (
              <div className="bg-card border border-border rounded-xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <FiBriefcase className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-semibold text-foreground">
                    Job Applications
                  </h2>
                  <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium">
                    {applications.length}
                  </span>
                </div>
                <div className="space-y-4">
                  {applications.map((application: any, index: number) => (
                    <div
                      key={application.jobId || index}
                      className="border border-border rounded-lg p-4"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-foreground">
                            {application.jobTitle}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {application.fellowField}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {application.matchPercentage && (
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-bold ${
                                application.matchPercentage >= 80
                                  ? "bg-green-100 text-green-700"
                                  : application.matchPercentage >= 60
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {application.matchPercentage}% Match
                            </span>
                          )}
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              application.applicationStatus === "Applied"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {application.applicationStatus}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {application.jobDescription}
                      </p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>
                          Applied on{" "}
                          {new Date(
                            application.applicationDate
                          ).toLocaleDateString()}
                        </span>
                        <span>
                          Posted{" "}
                          {new Date(
                            application.jobCreatedAt
                          ).toLocaleDateString()}
                        </span>
                      </div>

                      {/* Match details */}
                      {(application.whatMatched || application.wentAgainst) && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 pt-3 border-t border-border">
                          {application.whatMatched &&
                            application.whatMatched.length > 0 && (
                              <div>
                                <span className="text-xs font-medium text-green-700">
                                  What Matched:
                                </span>
                                <ul className="text-xs text-muted-foreground mt-1 space-y-1">
                                  {application.whatMatched
                                    .slice(0, 2)
                                    .map((item: string, i: number) => (
                                      <li key={i}>• {item}</li>
                                    ))}
                                </ul>
                              </div>
                            )}
                          {application.wentAgainst &&
                            application.wentAgainst.length > 0 && (
                              <div>
                                <span className="text-xs font-medium text-orange-700">
                                  Areas to Improve:
                                </span>
                                <ul className="text-xs text-muted-foreground mt-1 space-y-1">
                                  {application.wentAgainst
                                    .slice(0, 2)
                                    .map((item: string, i: number) => (
                                      <li key={i}>• {item}</li>
                                    ))}
                                </ul>
                              </div>
                            )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bookmarked Jobs Section - Only visible to profile owner */}
            {canSeeBookmarkedJobs &&
              bookmarkedJobs &&
              bookmarkedJobs.length > 0 && (
                <div className="bg-card border border-border rounded-xl p-6 shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <FiUsers className="w-5 h-5 text-primary" />
                    <h2 className="text-xl font-semibold text-foreground">
                      Bookmarked Jobs
                    </h2>
                    <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium">
                      {bookmarkedJobs.length}
                    </span>
                  </div>
                  <div className="space-y-4">
                    {bookmarkedJobs.map((job: any, index: number) => (
                      <div
                        key={job._id || index}
                        className="border border-border rounded-lg p-4"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-foreground">
                              {job.fellowField}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {job.employer?.companyName}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {job.payRange && (
                              <span className="text-xs font-medium text-green-600">
                                ${job.payRange.min?.toLocaleString()} - $
                                {job.payRange.max?.toLocaleString()}
                              </span>
                            )}
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                job.status === "Unsolved"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {job.status}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {job.description}
                        </p>

                        {/* Job type and skills */}
                        <div className="flex flex-wrap gap-2 mb-3">
                          {job.type?.map((type: string, i: number) => (
                            <span
                              key={i}
                              className="px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-700"
                            >
                              {type}
                            </span>
                          ))}
                        </div>

                        {job.skills && job.skills.length > 0 && (
                          <div className="mb-3">
                            <span className="text-xs font-medium text-foreground block mb-1">
                              Required Skills:
                            </span>
                            <div className="flex flex-wrap gap-1">
                              {job.skills
                                .slice(0, 4)
                                .map((skill: string, i: number) => (
                                  <span
                                    key={i}
                                    className="px-2 py-1 rounded-md text-xs font-medium bg-secondary/80 text-secondary-foreground"
                                  >
                                    {skill}
                                  </span>
                                ))}
                              {job.skills.length > 4 && (
                                <span className="px-2 py-1 rounded-md text-xs font-medium bg-muted text-muted-foreground">
                                  +{job.skills.length - 4} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>
                            {job.noOfApplicants || 0} applicant
                            {job.noOfApplicants !== 1 ? "s" : ""}
                          </span>
                          <span>
                            Posted{" "}
                            {new Date(job.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Personal Information */}
            <div className="bg-card border border-border rounded-xl p-6 shadow-lg">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Personal Information
              </h2>
              <div className="space-y-3 text-sm">
                {profile.dateOfBirth && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Date of Birth:
                    </span>
                    <span className="text-foreground font-medium">
                      {new Date(profile.dateOfBirth).toLocaleDateString()}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Verified:</span>
                  <span
                    className={`font-medium ${
                      profile.verified ? "text-green-600" : "text-orange-600"
                    }`}
                  >
                    {profile.verified ? "Yes" : "No"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Onboarded:</span>
                  <span
                    className={`font-medium ${
                      profile.onboarded ? "text-green-600" : "text-orange-600"
                    }`}
                  >
                    {profile.onboarded ? "Yes" : "No"}
                  </span>
                </div>
                {profile.address && (
                  <div>
                    <span className="text-muted-foreground block mb-1">
                      Address:
                    </span>
                    <span className="text-foreground text-xs">
                      {profile.address}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Profile Stats */}
            <div className="bg-card border border-border rounded-xl p-6 shadow-lg">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Profile Statistics
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FiUser className="w-4 h-4 text-primary" />
                    <span className="text-sm text-muted-foreground">
                      Skills
                    </span>
                  </div>
                  <span className="text-lg font-semibold text-foreground">
                    {profile.skills?.length || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FiBriefcase className="w-4 h-4 text-primary" />
                    <span className="text-sm text-muted-foreground">
                      Experience
                    </span>
                  </div>
                  <span className="text-lg font-semibold text-foreground">
                    {profile.workExperience?.length || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FiBook className="w-4 h-4 text-primary" />
                    <span className="text-sm text-muted-foreground">
                      Education
                    </span>
                  </div>
                  <span className="text-lg font-semibold text-foreground">
                    {profile.educationHistory?.length || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FiUsers className="w-4 h-4 text-primary" />
                    <span className="text-sm text-muted-foreground">
                      Applications
                    </span>
                  </div>
                  <span className="text-lg font-semibold text-foreground">
                    {applications?.length || 0}
                  </span>
                </div>
                {/* Only show bookmarks count to profile owner */}
                {canSeeBookmarkedJobs && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FiDownload className="w-4 h-4 text-primary" />
                      <span className="text-sm text-muted-foreground">
                        Bookmarks
                      </span>
                    </div>
                    <span className="text-lg font-semibold text-foreground">
                      {bookmarkedJobs?.length || 0}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-card border border-border rounded-xl p-6 shadow-lg">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Contact Information
              </h2>
              <div className="space-y-3">
                {profile.email && (
                  <div className="flex items-center gap-2">
                    <FiMail className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="text-sm text-foreground truncate">
                      {profile.email}
                    </span>
                  </div>
                )}
                {profile.phone && (
                  <div className="flex items-center gap-2">
                    <FiPhone className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="text-sm text-foreground">
                      {profile.phone}
                    </span>
                  </div>
                )}
                {location && (
                  <div className="flex items-center gap-2">
                    <FiMapPin className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="text-sm text-foreground">{location}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
