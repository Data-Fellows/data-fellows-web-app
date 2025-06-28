import { getUser } from "@/helpers";
import { useProblemsData } from "@/hooks/useProblems";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import {
  FiBookmark,
  FiBriefcase,
  FiChevronDown,
  FiClock,
  FiDollarSign,
  FiFilter,
  FiGrid,
  FiHeart,
  FiList,
  FiMapPin,
  FiSearch,
  FiUsers,
} from "react-icons/fi";

const SkeletonProblemCard = () => (
  <div className="group relative bg-card border border-border rounded-2xl p-6 shadow-lg animate-pulse overflow-hidden">
    <div className="relative z-10">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-start gap-4 flex-1 min-w-0">
          <div className="w-12 h-12 bg-muted rounded-xl"></div>
          <div className="min-w-0 flex-1">
            <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </div>
        <div className="h-6 bg-muted rounded w-16"></div>
      </div>

      <div className="space-y-4 mb-6">
        <div className="bg-muted/30 border border-border/50 rounded-lg p-3">
          <div className="h-4 bg-muted rounded w-full mb-2"></div>
        </div>

        <div className="bg-muted/30 border border-border/50 rounded-lg p-3">
          <div className="h-4 bg-muted rounded w-3/4"></div>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="h-6 bg-muted rounded w-16"></div>
          <div className="h-6 bg-muted rounded w-20"></div>
          <div className="h-6 bg-muted rounded w-14"></div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div className="flex gap-3">
          <div className="h-10 bg-muted rounded w-24"></div>
          <div className="h-10 bg-muted rounded w-28"></div>
        </div>
        <div className="h-10 bg-muted rounded w-10"></div>
      </div>
    </div>
  </div>
);

const SkeletonBookmarkCard = () => (
  <div className="bg-card border border-border rounded-lg p-4 animate-pulse">
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 bg-muted rounded-lg"></div>
      <div className="flex-1 min-w-0">
        <div className="h-4 bg-muted rounded w-full mb-2"></div>
        <div className="h-3 bg-muted rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-muted rounded w-1/2"></div>
      </div>
    </div>
  </div>
);

const SkeletonHeader = () => (
  <div className="space-y-6 animate-pulse">
    <div>
      <div className="h-8 bg-muted rounded w-64 mb-2"></div>
      <div className="h-4 bg-muted rounded w-96"></div>
    </div>

    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="h-10 bg-muted rounded w-72"></div>
        <div className="h-10 bg-muted rounded w-32"></div>
        <div className="h-10 bg-muted rounded w-24"></div>
      </div>
      <div className="flex items-center gap-3">
        <div className="h-10 bg-muted rounded w-20"></div>
        <div className="h-10 bg-muted rounded w-10"></div>
        <div className="h-10 bg-muted rounded w-10"></div>
      </div>
    </div>
  </div>
);

export default function ProblemsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<
    "newest" | "oldest" | "salary_high" | "salary_low" | "applicants"
  >("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedFilters, setSelectedFilters] = useState<{
    type: string[];
    skills: string[];
    payRange: string;
    status: string;
  }>({
    type: [],
    skills: [],
    payRange: "",
    status: "",
  });
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  const user = useMemo(() => getUser(), []);
  const router = useRouter();

  // Ensure component is mounted (client-side only)
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Handle authentication redirect on client side only
  useEffect(() => {
    if (isMounted && !user) {
      router.replace("/auth/sign-in");
    }
  }, [isMounted, user, router]);

  const {
    problems,
    totalProblems,
    totalPages,
    isLoading,
    error,
    handleApply,
    handleBookmark,
    isApplying,
    isBookmarking,
  } = useProblemsData({
    page: currentPage,
    limit: 12,
    search: searchTerm,
    status: selectedFilters.status,
    sortBy,
    skills: selectedFilters.skills,
    type: selectedFilters.type,
  });

  // Track initial load completion
  useMemo(() => {
    if (!isLoading && isInitialLoad) {
      setIsInitialLoad(false);
    }
  }, [isLoading, isInitialLoad]);

  // Get bookmarked jobs for sidebar
  const bookmarkedJobs = useMemo(() => {
    return problems.filter((problem) => problem.isBookmarked);
  }, [problems]);

  const formatSalary = (min: number, max: number) => {
    return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "unsolved":
        return "bg-orange-50 border-orange-200 text-orange-700 dark:bg-orange-900/20 dark:border-orange-800/30 dark:text-orange-400";
      case "solved":
        return "bg-green-50 border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-800/30 dark:text-green-400";
      case "in progress":
        return "bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-800/30 dark:text-blue-400";
      default:
        return "bg-gray-50 border-gray-200 text-gray-700 dark:bg-gray-900/20 dark:border-gray-800/30 dark:text-gray-400";
    }
  };

  const filteredProblems = useMemo(() => {
    // Since we're using API-based filtering, we don't need client-side filtering
    // The API handles search, status, and other filters
    // We only need to handle client-side sorting if not handled by API
    return problems;
  }, [problems]);

  const handleApplyClick = (problemId: string) => {
    handleApply(problemId);
  };

  const handleBookmarkClick = (
    problemId: string,
    isCurrentlyBookmarked: boolean
  ) => {
    handleBookmark(problemId, isCurrentlyBookmarked);
  };

  if (!user) {
    // Redirect will be handled by useEffect above
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-full mx-auto px-4 py-8">
        {/* Header */}
        {isInitialLoad && isLoading ? (
          <SkeletonHeader />
        ) : (
          <div className="space-y-6 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Explore Opportunities
              </h1>
              <p className="text-muted-foreground text-lg">
                Discover {totalProblems} data science problems from top
                companies
              </p>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div className="flex items-center gap-4 flex-1 max-w-2xl">
                <div className="relative flex-1">
                  <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search problems, companies, or skills..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all duration-200"
                  />
                </div>

                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) =>
                      setSortBy(
                        e.target.value as
                          | "newest"
                          | "oldest"
                          | "salary_high"
                          | "salary_low"
                          | "applicants"
                      )
                    }
                    className="bg-card border border-border rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all duration-200 appearance-none cursor-pointer"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="salary_high">Highest Salary</option>
                    <option value="salary_low">Lowest Salary</option>
                    <option value="applicants">Most Applied</option>
                  </select>
                  <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 pointer-events-none" />
                </div>

                <button className="bg-card hover:bg-muted/50 border border-border rounded-xl px-4 py-3 font-medium transition-all duration-200 flex items-center gap-2">
                  <FiFilter className="w-4 h-4" />
                  <span>Filters</span>
                </button>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground font-medium">
                  {filteredProblems.length} results
                </span>

                <div className="flex items-center bg-card border border-border rounded-lg p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-md transition-all duration-200 ${
                      viewMode === "grid"
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                  >
                    <FiGrid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-md transition-all duration-200 ${
                      viewMode === "list"
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                  >
                    <FiList className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Layout: 70% Jobs + 30% Bookmarks */}
        <div className="flex gap-8">
          {/* Jobs Section - 70% */}
          <div className="flex-1" style={{ flexBasis: "70%" }}>
            {isInitialLoad && isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, index) => (
                  <SkeletonProblemCard key={index} />
                ))}
              </div>
            ) : error ? (
              <div className="bg-card border border-border rounded-2xl p-16 text-center shadow-lg relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/3 to-orange-500/3"></div>
                <div className="relative z-10">
                  <div className="bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800/30 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
                    <FiSearch className="w-10 h-10 text-red-600" />
                  </div>
                  <h3 className="font-bold text-foreground text-xl mb-3">
                    Failed to load problems
                  </h3>
                  <p className="text-muted-foreground text-base mb-6 max-w-sm mx-auto">
                    There was an error loading the job opportunities. Please try
                    again.
                  </p>
                  <button
                    onClick={() => window.location.reload()}
                    className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            ) : filteredProblems.length === 0 ? (
              <div className="bg-card border border-border rounded-2xl p-16 text-center shadow-lg relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/3 to-accent/3"></div>
                <div className="relative z-10">
                  <div className="bg-muted/30 border border-border w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
                    <FiSearch className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="font-bold text-foreground text-xl mb-3">
                    No problems found
                  </h3>
                  <p className="text-muted-foreground text-base mb-6 max-w-sm mx-auto">
                    Try adjusting your search terms or filters to find more
                    opportunities
                  </p>
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedFilters({
                        type: [],
                        skills: [],
                        payRange: "",
                        status: "",
                      });
                    }}
                    className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            ) : (
              <div
                className={`grid gap-6 ${
                  viewMode === "grid"
                    ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
                    : "grid-cols-1"
                }`}
              >
                {filteredProblems.map((problem) => (
                  <div
                    key={problem._id}
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
                              {problem.fellowField}
                            </h3>
                            <p className="text-sm text-muted-foreground font-medium mb-1">
                              {problem.employer.companyName}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <FiUsers className="w-3 h-3" />
                              <span>{problem.noOfApplicants} applicants</span>
                              <span>•</span>
                              <FiClock className="w-3 h-3" />
                              <span>{formatDate(problem.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                        <div
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold shadow-md ${getStatusColor(
                            problem.status
                          )}`}
                        >
                          {problem.status}
                        </div>
                      </div>

                      {/* Problem description */}
                      <div className="mb-6">
                        <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                          {problem.description}
                        </p>
                      </div>

                      {/* Job details */}
                      <div className="space-y-3 mb-6">
                        <div className="bg-muted/30 border border-border/50 rounded-lg p-3 hover:bg-muted/50 transition-all duration-300">
                          <div className="flex items-center gap-3 text-sm">
                            <div className="bg-primary/10 p-1.5 rounded-lg">
                              <FiMapPin className="w-4 h-4 text-primary" />
                            </div>
                            <span className="font-medium text-foreground">
                              {problem.employer.companyCity},{" "}
                              {problem.employer.companyCountry}
                            </span>
                          </div>
                        </div>

                        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/30 rounded-lg p-3 hover:bg-green-100 dark:hover:bg-green-900/30 transition-all duration-300">
                          <div className="flex items-center gap-3 text-sm">
                            <div className="bg-green-500/20 p-1.5 rounded-lg">
                              <FiDollarSign className="w-4 h-4 text-green-600" />
                            </div>
                            <span className="font-bold text-green-600">
                              {formatSalary(
                                problem.payRange.min,
                                problem.payRange.max
                              )}
                            </span>
                          </div>
                        </div>

                        {/* Job type and skills */}
                        <div className="flex flex-wrap gap-2">
                          {problem.type.map((type, index) => (
                            <span
                              key={index}
                              className="bg-accent/10 border border-accent/20 text-accent-foreground px-3 py-1 rounded-full text-xs font-medium shadow-sm"
                            >
                              {type}
                            </span>
                          ))}
                          {problem.skills.slice(0, 2).map((skill, index) => (
                            <span
                              key={index}
                              className="bg-primary/10 border border-primary/20 text-primary px-3 py-1 rounded-full text-xs font-medium shadow-sm"
                            >
                              {skill}
                            </span>
                          ))}
                          {problem.skills.length > 2 && (
                            <span className="bg-muted/50 border border-border text-muted-foreground px-3 py-1 rounded-full text-xs font-medium">
                              +{problem.skills.length - 2} more
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleApplyClick(problem._id)}
                            disabled={problem.isApplied || isApplying}
                            className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 ${
                              problem.isApplied
                                ? "bg-muted/50 text-muted-foreground cursor-not-allowed"
                                : isApplying
                                ? "bg-primary/50 text-white cursor-not-allowed"
                                : "bg-primary hover:bg-primary/90 text-white"
                            }`}
                          >
                            {problem.isApplied
                              ? "Applied"
                              : isApplying
                              ? "Applying..."
                              : "Apply Now"}
                          </button>
                          <button className="border border-border bg-background hover:bg-muted/50 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 hover:shadow-md">
                            View Details
                          </button>
                        </div>
                        <button
                          onClick={() =>
                            handleBookmarkClick(
                              problem._id,
                              problem.isBookmarked
                            )
                          }
                          disabled={isBookmarking}
                          className={`border border-border p-2.5 rounded-lg transition-all duration-300 hover:scale-110 group-hover:rotate-12 ${
                            problem.isBookmarked
                              ? "bg-primary/20 border-primary/30 text-primary"
                              : "bg-muted/50 hover:bg-primary/20 hover:border-primary/30 text-muted-foreground hover:text-primary"
                          } ${
                            isBookmarking ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                        >
                          {problem.isBookmarked ? (
                            <FiHeart className="w-4 h-4 fill-current" />
                          ) : (
                            <FiBookmark className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bookmarked Jobs Sidebar - 30% */}
          <div className="w-80 flex-shrink-0" style={{ flexBasis: "30%" }}>
            <div className="bg-card border border-border rounded-2xl p-6 shadow-lg sticky top-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                  <FiHeart className="w-5 h-5 text-primary" />
                  Saved Jobs
                </h2>
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                  {bookmarkedJobs.length}
                </span>
              </div>

              {isInitialLoad && isLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <SkeletonBookmarkCard key={index} />
                  ))}
                </div>
              ) : bookmarkedJobs.length === 0 ? (
                <div className="text-center py-8">
                  <div className="bg-muted/30 border border-border w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiBookmark className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">
                    No Bookmarks
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Save jobs by clicking the bookmark icon to see them here
                  </p>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {bookmarkedJobs.map((job) => (
                    <div
                      key={job._id}
                      className="bg-muted/30 border border-border/50 rounded-lg p-4 hover:bg-muted/50 transition-all duration-300 cursor-pointer"
                    >
                      <div className="flex items-start gap-3">
                        <div className="bg-primary/10 p-2 rounded-lg flex-shrink-0">
                          <FiBriefcase className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-foreground text-sm leading-tight mb-1 line-clamp-2">
                            {job.fellowField}
                          </h4>
                          <p className="text-xs text-muted-foreground mb-2">
                            {job.employer.companyName}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-green-600">
                              {formatSalary(job.payRange.min, job.payRange.max)}
                            </span>
                            <button
                              onClick={() =>
                                handleBookmarkClick(job._id, job.isBookmarked)
                              }
                              className="text-primary hover:text-primary/80 transition-colors"
                            >
                              <FiHeart className="w-4 h-4 fill-current" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
