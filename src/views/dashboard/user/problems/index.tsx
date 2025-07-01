import { getUser } from "@/helpers";
import { useProblemsData } from "@/hooks/useProblems";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import {
  FiBookmark,
  FiBriefcase,
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiDollarSign,
  FiGrid,
  FiHeart,
  FiList,
  FiMapPin,
  FiSearch,
  FiUsers,
  FiX,
} from "react-icons/fi";

const SkeletonProblemCard = () => (
  <div className="group relative bg-card border border-border rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg animate-pulse overflow-hidden">
    <div className="relative z-10">
      <div className="flex items-start justify-between mb-4 sm:mb-6">
        <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-muted rounded-lg sm:rounded-xl flex-shrink-0"></div>
          <div className="min-w-0 flex-1">
            <div className="h-4 sm:h-6 bg-muted rounded w-3/4 mb-2"></div>
            <div className="h-3 sm:h-4 bg-muted rounded w-1/2"></div>
          </div>
        </div>
        <div className="h-5 sm:h-6 bg-muted rounded w-12 sm:w-16 flex-shrink-0"></div>
      </div>

      <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
        <div className="bg-muted/30 border border-border/50 rounded-lg p-2 sm:p-3">
          <div className="h-3 sm:h-4 bg-muted rounded w-full mb-2"></div>
        </div>

        <div className="bg-muted/30 border border-border/50 rounded-lg p-2 sm:p-3">
          <div className="h-3 sm:h-4 bg-muted rounded w-3/4"></div>
        </div>

        <div className="flex flex-wrap gap-1 sm:gap-2">
          <div className="h-5 sm:h-6 bg-muted rounded w-12 sm:w-16"></div>
          <div className="h-5 sm:h-6 bg-muted rounded w-16 sm:w-20"></div>
          <div className="h-5 sm:h-6 bg-muted rounded w-10 sm:w-14"></div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-border">
        <div className="flex gap-2 sm:gap-3">
          <div className="h-8 sm:h-10 bg-muted rounded w-20 sm:w-24"></div>
          <div className="hidden sm:block h-10 bg-muted rounded w-28"></div>
        </div>
        <div className="h-8 sm:h-10 bg-muted rounded w-8 sm:w-10 flex-shrink-0"></div>
      </div>
    </div>
  </div>
);

const SkeletonBookmarkCard = () => (
  <div className="bg-card border border-border rounded-lg p-3 sm:p-4 animate-pulse">
    <div className="flex items-start gap-2 sm:gap-3">
      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-muted rounded-lg flex-shrink-0"></div>
      <div className="flex-1 min-w-0">
        <div className="h-3 sm:h-4 bg-muted rounded w-full mb-2"></div>
        <div className="h-2 sm:h-3 bg-muted rounded w-3/4 mb-2"></div>
        <div className="h-2 sm:h-3 bg-muted rounded w-1/2"></div>
      </div>
    </div>
  </div>
);

const SkeletonHeader = () => (
  <div className="space-y-4 sm:space-y-6 animate-pulse">
    <div>
      <div className="h-6 sm:h-8 bg-muted rounded w-48 sm:w-64 mb-2"></div>
      <div className="h-3 sm:h-4 bg-muted rounded w-64 sm:w-96"></div>
    </div>

    <div className="space-y-3 sm:space-y-0">
      <div className="h-10 sm:h-12 bg-muted rounded w-full"></div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
          <div className="h-10 sm:h-12 bg-muted rounded w-32 sm:w-40 flex-1 sm:flex-none"></div>
          <div className="h-10 sm:h-12 bg-muted rounded w-20 sm:w-24"></div>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <div className="h-4 bg-muted rounded w-16 sm:w-20"></div>
          <div className="h-8 sm:h-10 bg-muted rounded w-16 sm:w-20"></div>
        </div>
      </div>
    </div>
  </div>
);

export default function ProblemsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
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
  const [selectedProblem, setSelectedProblem] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  const user = useMemo(() => getUser(), []);
  const router = useRouter();

  // Initialize from URL parameters
  useEffect(() => {
    if (router.isReady) {
      const { search, status, page } = router.query;

      if (search && typeof search === "string") {
        setSearchTerm(search);
      }

      if (status && typeof status === "string") {
        setSelectedFilters((prev) => ({
          ...prev,
          status: status,
        }));
      }

      if (page && typeof page === "string") {
        const pageNum = parseInt(page, 10);
        if (!isNaN(pageNum) && pageNum > 0) {
          setCurrentPage(pageNum);
        }
      }
    }
  }, [router.isReady, router.query]);

  // Update URL when search or filters change
  useEffect(() => {
    if (router.isReady) {
      const query: any = {};

      if (debouncedSearchTerm) query.search = debouncedSearchTerm;
      if (selectedFilters.status) query.status = selectedFilters.status;
      if (currentPage > 1) query.page = currentPage.toString();

      router.replace(
        {
          pathname: router.pathname,
          query,
        },
        undefined,
        { shallow: true }
      );
    }
  }, [
    debouncedSearchTerm,
    selectedFilters.status,
    currentPage,
    router.isReady,
  ]);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Reset page when search or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, selectedFilters.status]);

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
    search: debouncedSearchTerm,
    status: selectedFilters.status,
    sortBy,
    skills: selectedFilters.skills,
    type: selectedFilters.type,
  });

  useMemo(() => {
    if (!isLoading && isInitialLoad) {
      setIsInitialLoad(false);
    }
  }, [isLoading, isInitialLoad]);

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

  const openProblemModal = (problem: any) => {
    setSelectedProblem(problem);
    setShowModal(true);
  };

  const closeProblemModal = () => {
    setShowModal(false);
    setSelectedProblem(null);
  };

  const generatePageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    const halfVisible = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(1, currentPage - halfVisible);
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-full mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        {isInitialLoad && isLoading ? (
          <SkeletonHeader />
        ) : (
          <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                Explore Opportunities
              </h1>
              <p className="text-muted-foreground text-base sm:text-lg">
                Discover {totalProblems} data science problems from top
                companies
              </p>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col gap-4">
              {/* Search Bar */}
              <div className="relative w-full">
                <FiSearch
                  className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 transition-colors duration-200 ${
                    searchTerm !== debouncedSearchTerm
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                />
                <input
                  type="text"
                  placeholder="Search problems, companies, or skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 sm:pl-12 pr-12 py-2.5 sm:py-3 bg-card border rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all duration-200 text-sm sm:text-base ${
                    searchTerm !== debouncedSearchTerm
                      ? "border-primary/30 ring-1 ring-primary/10"
                      : "border-border"
                  }`}
                />
                {searchTerm !== debouncedSearchTerm && (
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                    <span className="text-xs text-primary font-medium hidden sm:inline">
                      Searching
                    </span>
                  </div>
                )}
                {searchTerm && searchTerm === debouncedSearchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <FiX className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Quick Status Filter Buttons */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-1">
                  <span className="text-sm text-muted-foreground font-medium whitespace-nowrap">
                    Quick filters:
                  </span>
                  {[
                    { value: "", label: "All" },
                    { value: "Unsolved", label: "Unsolved" },
                    { value: "Solved", label: "Solved" },
                    { value: "In Progress", label: "In Progress" },
                  ].map((status) => (
                    <button
                      key={status.value}
                      onClick={() =>
                        setSelectedFilters((prev) => ({
                          ...prev,
                          status: status.value,
                        }))
                      }
                      disabled={
                        isLoading && selectedFilters.status === status.value
                      }
                      className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0 flex items-center gap-1 ${
                        selectedFilters.status === status.value
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "bg-card hover:bg-muted/50 border border-border text-foreground"
                      } ${
                        isLoading && selectedFilters.status === status.value
                          ? "opacity-70"
                          : ""
                      }`}
                    >
                      {isLoading && selectedFilters.status === status.value && (
                        <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin"></div>
                      )}
                      {status.label}
                    </button>
                  ))}
                </div>

                {/* Clear All Filters */}
                {(searchTerm || selectedFilters.status) && (
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
                    className="flex items-center gap-1 px-3 py-1.5 text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-all duration-200 whitespace-nowrap"
                  >
                    <FiX className="w-3 h-3" />
                    Clear all
                  </button>
                )}
              </div>

              {/* Controls Row */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                {/* Left side controls */}
                <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto"></div>

                {/* Right side controls */}
                <div className="flex items-center justify-between w-full sm:w-auto sm:justify-end gap-3">
                  <span className="text-xs sm:text-sm text-muted-foreground font-medium">
                    {searchTerm !== debouncedSearchTerm
                      ? "Searching..."
                      : isLoading
                      ? "Loading..."
                      : `${filteredProblems.length} of ${totalProblems} results`}
                    {(debouncedSearchTerm || selectedFilters.status) &&
                      !isLoading &&
                      searchTerm === debouncedSearchTerm && (
                        <span className="text-primary"> • Filtered</span>
                      )}
                  </span>

                  <div className="flex items-center bg-card border border-border rounded-lg p-1">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-1.5 sm:p-2 rounded-md transition-all duration-200 ${
                        viewMode === "grid"
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      }`}
                    >
                      <FiGrid className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-1.5 sm:p-2 rounded-md transition-all duration-200 ${
                        viewMode === "list"
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      }`}
                    >
                      <FiList className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Layout: Responsive Jobs + Sidebar */}
        <div className="flex flex-col xl:flex-row gap-4 sm:gap-6 lg:gap-8">
          {/* Jobs Section - Full width on mobile, 70% on desktop */}
          <div className="flex-1 xl:flex-[7]">
            {(isInitialLoad && isLoading) ||
            searchTerm !== debouncedSearchTerm ||
            (isLoading && (debouncedSearchTerm || selectedFilters.status)) ? (
              <div className="space-y-4">
                {/* Searching indicator */}
                {(searchTerm !== debouncedSearchTerm ||
                  (isLoading &&
                    (debouncedSearchTerm || selectedFilters.status))) &&
                  !isInitialLoad && (
                    <div className="bg-card border border-border rounded-xl sm:rounded-2xl p-6 sm:p-8 text-center shadow-lg relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/3 to-accent/3"></div>
                      <div className="relative z-10">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 border-2 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
                        <h3 className="font-semibold text-foreground text-base sm:text-lg mb-2">
                          {searchTerm !== debouncedSearchTerm
                            ? "Searching..."
                            : "Loading results..."}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {searchTerm !== debouncedSearchTerm
                            ? `Finding jobs that match "${searchTerm}"`
                            : "Please wait while we fetch the latest opportunities"}
                          {selectedFilters.status && (
                            <span className="block mt-1">
                              Status:{" "}
                              <span className="font-medium text-primary">
                                {selectedFilters.status}
                              </span>
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  )}

                {/* Skeleton cards for initial load */}
                {isInitialLoad && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 2xl:grid-cols-3 gap-4 sm:gap-6">
                    {Array.from({ length: 6 }).map((_, index) => (
                      <SkeletonProblemCard key={index} />
                    ))}
                  </div>
                )}
              </div>
            ) : error ? (
              <div className="bg-card border border-border rounded-xl sm:rounded-2xl p-8 sm:p-16 text-center shadow-lg relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/3 to-orange-500/3"></div>
                <div className="relative z-10">
                  <div className="bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800/30 w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-md">
                    <FiSearch className="w-8 h-8 sm:w-10 sm:h-10 text-red-600" />
                  </div>
                  <h3 className="font-bold text-foreground text-lg sm:text-xl mb-2 sm:mb-3">
                    Failed to load problems
                  </h3>
                  <p className="text-muted-foreground text-sm sm:text-base mb-4 sm:mb-6 max-w-sm mx-auto">
                    There was an error loading the job opportunities. Please try
                    again.
                  </p>
                  <button
                    onClick={() => window.location.reload()}
                    className="bg-primary hover:bg-primary/90 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 text-sm sm:text-base"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            ) : filteredProblems.length === 0 ? (
              <div className="bg-card border border-border rounded-xl sm:rounded-2xl p-8 sm:p-16 text-center shadow-lg relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/3 to-accent/3"></div>
                <div className="relative z-10">
                  <div className="bg-muted/30 border border-border w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-md">
                    <FiSearch className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
                  </div>
                  <h3 className="font-bold text-foreground text-lg sm:text-xl mb-2 sm:mb-3">
                    No problems found
                  </h3>
                  <p className="text-muted-foreground text-sm sm:text-base mb-4 sm:mb-6 max-w-sm mx-auto">
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
                    className="bg-primary hover:bg-primary/90 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 text-sm sm:text-base"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            ) : (
              <div
                className={`grid gap-4 sm:gap-6 ${
                  viewMode === "grid"
                    ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 2xl:grid-cols-3"
                    : "grid-cols-1"
                }`}
              >
                {filteredProblems.map((problem) => (
                  <div
                    key={problem._id}
                    className="group relative bg-card border border-border rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:border-primary/30 overflow-hidden cursor-pointer"
                    onClick={() => openProblemModal(problem)}
                  >
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-primary/5 to-transparent rounded-full -translate-y-12 translate-x-12 sm:-translate-y-16 sm:translate-x-16 group-hover:scale-150 transition-transform duration-700"></div>
                    <div className="absolute bottom-0 left-0 w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-tr from-accent/5 to-transparent rounded-full translate-y-10 -translate-x-10 sm:translate-y-12 sm:-translate-x-12 group-hover:scale-125 transition-transform duration-700"></div>

                    {/* Content */}
                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-4 sm:mb-6">
                        <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
                          <div className="bg-gradient-to-br from-primary/20 to-primary/10 p-2 sm:p-3 rounded-lg sm:rounded-xl border border-primary/20 shadow-md group-hover:shadow-lg transition-all duration-300">
                            <FiBriefcase className="text-primary w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform duration-300" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-bold text-foreground text-sm sm:text-base leading-tight mb-1 sm:mb-2 group-hover:text-primary transition-colors duration-300 line-clamp-2">
                              {problem.fellowField}
                            </h3>
                            <p className="text-xs sm:text-sm text-muted-foreground font-medium mb-1 truncate">
                              {problem.employer.companyName}
                            </p>
                            <div className="flex items-center gap-1 sm:gap-2 text-xs text-muted-foreground">
                              <FiUsers className="w-3 h-3 flex-shrink-0" />
                              <span className="truncate">
                                {problem.noOfApplicants} applicants
                              </span>
                              <span className="hidden sm:inline">•</span>
                              <FiClock className="w-3 h-3 flex-shrink-0 hidden sm:block" />
                              <span className="hidden sm:inline truncate">
                                {formatDate(problem.createdAt)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div
                          className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-semibold shadow-md flex-shrink-0 ${getStatusColor(
                            problem.status
                          )}`}
                        >
                          {problem.status}
                        </div>
                      </div>

                      {/* Problem description */}
                      <div className="mb-4 sm:mb-6">
                        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 sm:line-clamp-3 leading-relaxed">
                          {problem.description}
                        </p>
                      </div>

                      {/* Job details */}
                      <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                        <div className="bg-muted/30 border border-border/50 rounded-lg p-2 sm:p-3 hover:bg-muted/50 transition-all duration-300">
                          <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                            <div className="bg-primary/10 p-1 sm:p-1.5 rounded-lg flex-shrink-0">
                              <FiMapPin className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                            </div>
                            <span className="font-medium text-foreground truncate">
                              {problem.employer.companyCity},{" "}
                              {problem.employer.companyCountry}
                            </span>
                          </div>
                        </div>

                        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/30 rounded-lg p-2 sm:p-3 hover:bg-green-100 dark:hover:bg-green-900/30 transition-all duration-300">
                          <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                            <div className="bg-green-500/20 p-1 sm:p-1.5 rounded-lg flex-shrink-0">
                              <FiDollarSign className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                            </div>
                            <span className="font-bold text-green-600 truncate">
                              {formatSalary(
                                problem.payRange.min,
                                problem.payRange.max
                              )}
                            </span>
                          </div>
                        </div>

                        {/* Job type and skills */}
                        <div className="flex flex-wrap gap-1 sm:gap-2">
                          {problem.type.slice(0, 2).map((type, index) => (
                            <span
                              key={index}
                              className="bg-accent/10 border border-accent/20 text-accent-foreground px-2 sm:px-3 py-1 rounded-full text-xs font-medium shadow-sm"
                            >
                              {type}
                            </span>
                          ))}
                          {problem.skills.slice(0, 1).map((skill, index) => (
                            <span
                              key={index}
                              className="bg-primary/10 border border-primary/20 text-primary px-2 sm:px-3 py-1 rounded-full text-xs font-medium shadow-sm"
                            >
                              {skill}
                            </span>
                          ))}
                          {(problem.type.length > 2 ||
                            problem.skills.length > 1) && (
                            <span className="bg-muted/50 border border-border text-muted-foreground px-2 sm:px-3 py-1 rounded-full text-xs font-medium">
                              +{problem.type.length + problem.skills.length - 3}{" "}
                              more
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-border">
                        <div className="flex gap-2 sm:gap-3 flex-1 min-w-0">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleApplyClick(problem._id);
                            }}
                            disabled={problem.isApplied || isApplying}
                            className={`flex-1 sm:flex-none px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 truncate ${
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
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openProblemModal(problem);
                            }}
                            className="hidden sm:flex border border-border bg-background hover:bg-muted/50 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 hover:shadow-md"
                          >
                            View Details
                          </button>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleBookmarkClick(
                              problem._id,
                              problem.isBookmarked
                            );
                          }}
                          disabled={isBookmarking}
                          className={`ml-2 sm:ml-3 border border-border p-2 sm:p-2.5 rounded-lg transition-all duration-300 hover:scale-110 group-hover:rotate-12 flex-shrink-0 ${
                            problem.isBookmarked
                              ? "bg-primary/20 border-primary/30 text-primary"
                              : "bg-muted/50 hover:bg-primary/20 hover:border-primary/30 text-muted-foreground hover:text-primary"
                          } ${
                            isBookmarking ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                        >
                          {problem.isBookmarked ? (
                            <FiHeart className="w-3 h-3 sm:w-4 sm:h-4 fill-current" />
                          ) : (
                            <FiBookmark className="w-3 h-3 sm:w-4 sm:h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pagination */}
          {!isInitialLoad &&
            !isLoading &&
            !error &&
            filteredProblems.length > 0 &&
            totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-lg border transition-all duration-200 ${
                      currentPage === 1
                        ? "border-border bg-muted/50 text-muted-foreground cursor-not-allowed"
                        : "border-border bg-card hover:bg-muted/50 text-foreground"
                    }`}
                  >
                    <FiChevronLeft className="w-4 h-4" />
                  </button>

                  {currentPage > 3 && (
                    <>
                      <button
                        onClick={() => setCurrentPage(1)}
                        className="px-3 py-2 rounded-lg border border-border bg-card hover:bg-muted/50 text-foreground transition-all duration-200"
                      >
                        1
                      </button>
                      {currentPage > 4 && (
                        <span className="px-2 text-muted-foreground">...</span>
                      )}
                    </>
                  )}

                  {generatePageNumbers().map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-2 rounded-lg border transition-all duration-200 ${
                        page === currentPage
                          ? "border-primary bg-primary text-primary-foreground shadow-sm"
                          : "border-border bg-card hover:bg-muted/50 text-foreground"
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  {currentPage < totalPages - 2 && (
                    <>
                      {currentPage < totalPages - 3 && (
                        <span className="px-2 text-muted-foreground">...</span>
                      )}
                      <button
                        onClick={() => setCurrentPage(totalPages)}
                        className="px-3 py-2 rounded-lg border border-border bg-card hover:bg-muted/50 text-foreground transition-all duration-200"
                      >
                        {totalPages}
                      </button>
                    </>
                  )}

                  <button
                    onClick={() =>
                      setCurrentPage(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-lg border transition-all duration-200 ${
                      currentPage === totalPages
                        ? "border-border bg-muted/50 text-muted-foreground cursor-not-allowed"
                        : "border-border bg-card hover:bg-muted/50 text-foreground"
                    }`}
                  >
                    <FiChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

          {/* Bookmarked Jobs Sidebar - Hidden on mobile, sidebar on desktop */}
          <div className="hidden xl:block xl:w-80 xl:flex-[3] flex-shrink-0 scrollbar-hide">
            <div className="bg-card border border-border rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg sticky top-6 scrollbar-hide">
              <div className="flex items-center justify-between mb-4 sm:mb-6 scrollbar-hide">
                <h2 className="text-lg sm:text-xl font-semibold text-foreground flex items-center gap-2">
                  <FiHeart className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  <span className="hidden sm:inline">Saved Jobs</span>
                  <span className="sm:hidden">Saved</span>
                </h2>
                <span className="bg-primary/10 text-primary px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                  {bookmarkedJobs.length}
                </span>
              </div>

              {isInitialLoad && isLoading ? (
                <div className="space-y-3 sm:space-y-4">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <SkeletonBookmarkCard key={index} />
                  ))}
                </div>
              ) : bookmarkedJobs.length === 0 ? (
                <div className="text-center py-6 sm:py-8">
                  <div className="bg-muted/30 border border-border w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <FiBookmark className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2 text-sm sm:text-base">
                    No Bookmarks
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Save jobs by clicking the bookmark icon to see them here
                  </p>
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4 max-h-80 sm:max-h-96 overflow-y-auto">
                  {bookmarkedJobs.map((job) => (
                    <div
                      key={job._id}
                      className="bg-muted/30 border border-border/50 rounded-lg p-3 sm:p-4 hover:bg-muted/50 transition-all duration-300 cursor-pointer"
                      onClick={() => openProblemModal(job)}
                    >
                      <div className="flex items-start gap-2 sm:gap-3">
                        <div className="bg-primary/10 p-1.5 sm:p-2 rounded-lg flex-shrink-0">
                          <FiBriefcase className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-foreground text-xs sm:text-sm leading-tight mb-1 line-clamp-2">
                            {job.fellowField}
                          </h4>
                          <p className="text-xs text-muted-foreground mb-2 truncate">
                            {job.employer.companyName}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-green-600 truncate">
                              {formatSalary(job.payRange.min, job.payRange.max)}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleBookmarkClick(job._id, job.isBookmarked);
                              }}
                              className="text-primary hover:text-primary/80 transition-colors flex-shrink-0 ml-2"
                            >
                              <FiHeart className="w-3 h-3 sm:w-4 sm:h-4 fill-current" />
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

          {/* Mobile Bookmarks Section - Shown only on mobile */}
          {bookmarkedJobs.length > 0 && (
            <div className="xl:hidden">
              <div className="bg-card border border-border rounded-xl p-4 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <FiHeart className="w-5 h-5 text-primary" />
                    Saved Jobs
                  </h2>
                  <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                    {bookmarkedJobs.length}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {bookmarkedJobs.slice(0, 4).map((job) => (
                    <div
                      key={job._id}
                      className="bg-muted/30 border border-border/50 rounded-lg p-3 hover:bg-muted/50 transition-all duration-300 cursor-pointer"
                      onClick={() => openProblemModal(job)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="bg-primary/10 p-2 rounded-lg flex-shrink-0">
                          <FiBriefcase className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-foreground text-sm leading-tight mb-1 line-clamp-1">
                            {job.fellowField}
                          </h4>
                          <p className="text-xs text-muted-foreground mb-2 truncate">
                            {job.employer.companyName}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-green-600 truncate">
                              {formatSalary(job.payRange.min, job.payRange.max)}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleBookmarkClick(job._id, job.isBookmarked);
                              }}
                              className="text-primary hover:text-primary/80 transition-colors flex-shrink-0"
                            >
                              <FiHeart className="w-4 h-4 fill-current" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {bookmarkedJobs.length > 4 && (
                  <div className="mt-3 text-center">
                    <span className="text-sm text-muted-foreground">
                      +{bookmarkedJobs.length - 4} more saved jobs
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Problem Details Modal */}
      {showModal && selectedProblem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4 scrollbar-hide">
          <div className="bg-card border border-border rounded-xl sm:rounded-2xl max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto scrollbar-hide ">
            <div className="sticky top-0 bg-card border-b border-border p-3 sm:p-4 lg:p-6 flex items-center justify-between rounded-t-xl sm:rounded-t-2xl">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">
                Problem Details
              </h2>
              <button
                onClick={closeProblemModal}
                className="p-2 hover:bg-muted/50 rounded-lg transition-colors"
              >
                <FiX className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            <div className="p-3 sm:p-4 lg:p-6">
              <div className="space-y-4 sm:space-y-6">
                <div className="flex flex-col gap-3 sm:gap-4">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="bg-gradient-to-br from-primary/20 to-primary/10 p-2 sm:p-3 rounded-lg sm:rounded-xl border border-primary/20 shadow-md flex-shrink-0">
                      <FiBriefcase className="text-primary w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground mb-1 sm:mb-2">
                        {selectedProblem.fellowField}
                      </h3>
                      <p className="text-base sm:text-lg text-muted-foreground font-medium mb-2">
                        {selectedProblem.employer.companyName}
                      </p>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <FiUsers className="w-4 h-4" />
                          <span>
                            {selectedProblem.noOfApplicants} applicants
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FiClock className="w-4 h-4" />
                          <span>{formatDate(selectedProblem.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                    <div
                      className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-semibold self-start ${getStatusColor(
                        selectedProblem.status
                      )}`}
                    >
                      {selectedProblem.status}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  <div className="bg-muted/30 border border-border/50 rounded-lg p-3 sm:p-4">
                    <div className="flex items-center gap-2 sm:gap-3 mb-2">
                      <div className="bg-primary/10 p-1.5 sm:p-2 rounded-lg">
                        <FiMapPin className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                      </div>
                      <span className="font-medium text-foreground text-sm sm:text-base">
                        Location
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground ml-6 sm:ml-8 lg:ml-11">
                      {selectedProblem.employer.companyCity},{" "}
                      {selectedProblem.employer.companyCountry}
                    </p>
                  </div>

                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/30 rounded-lg p-3 sm:p-4">
                    <div className="flex items-center gap-2 sm:gap-3 mb-2">
                      <div className="bg-green-500/20 p-1.5 sm:p-2 rounded-lg">
                        <FiDollarSign className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 dark:text-green-400" />
                      </div>
                      <span className="font-medium text-muted-foreground text-sm sm:text-base">
                        Salary Range
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm font-bold text-green-600 dark:text-green-400 ml-6 sm:ml-8 lg:ml-11">
                      {formatSalary(
                        selectedProblem.payRange.min,
                        selectedProblem.payRange.max
                      )}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="text-base sm:text-lg font-semibold text-foreground mb-2 sm:mb-3">
                    Description
                  </h4>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    {selectedProblem.description}
                  </p>
                </div>

                <div>
                  <h4 className="text-base sm:text-lg font-semibold text-foreground mb-2 sm:mb-3">
                    Qualifications
                  </h4>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    {selectedProblem.candidatesQualification}
                  </p>
                </div>

                {selectedProblem.niceToHaves && (
                  <div>
                    <h4 className="text-base sm:text-lg font-semibold text-foreground mb-2 sm:mb-3">
                      Nice to Have
                    </h4>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                      {selectedProblem.niceToHaves}
                    </p>
                  </div>
                )}

                <div>
                  <h4 className="text-base sm:text-lg font-semibold text-foreground mb-2 sm:mb-3">
                    Job Types
                  </h4>
                  <div className="flex flex-wrap gap-1 sm:gap-2">
                    {selectedProblem.type.map((type: string, index: number) => (
                      <span
                        key={index}
                        className="bg-accent/10 border border-accent/20 text-accent-foreground px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium"
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-base sm:text-lg font-semibold text-foreground mb-2 sm:mb-3">
                    Required Skills
                  </h4>
                  <div className="flex flex-wrap gap-1 sm:gap-2">
                    {selectedProblem.skills.map(
                      (skill: string, index: number) => (
                        <span
                          key={index}
                          className="bg-primary/10 border border-primary/20 text-primary px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium"
                        >
                          {skill}
                        </span>
                      )
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-base sm:text-lg font-semibold text-foreground mb-2 sm:mb-3">
                    Company Information
                  </h4>
                  <div className="bg-muted/30 border border-border/50 rounded-lg p-3 sm:p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-foreground mb-1">
                          Company Size
                        </p>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          {selectedProblem.employer.companySize}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-foreground mb-1">
                          Number of Employees
                        </p>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          {selectedProblem.employer.noOfEmployees}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 sm:pt-6 border-t border-border gap-3">
                  <button
                    onClick={() =>
                      handleBookmarkClick(
                        selectedProblem._id,
                        selectedProblem.isBookmarked
                      )
                    }
                    disabled={isBookmarking}
                    className={`flex-1 flex items-center justify-center gap-2 border border-border px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-all duration-300 hover:scale-105 text-sm sm:text-base font-medium ${
                      selectedProblem.isBookmarked
                        ? "bg-primary/20 border-primary/30 text-primary"
                        : "bg-muted/50 hover:bg-primary/20 hover:border-primary/30 text-muted-foreground hover:text-primary"
                    } ${isBookmarking ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    {selectedProblem.isBookmarked ? (
                      <>
                        <FiHeart className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
                        <span>Saved</span>
                      </>
                    ) : (
                      <>
                        <FiBookmark className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span>Save Job</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleApplyClick(selectedProblem._id)}
                    disabled={selectedProblem.isApplied || isApplying}
                    className={`flex-1 px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-semibold transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 text-sm sm:text-base ${
                      selectedProblem.isApplied
                        ? "bg-muted/50 text-muted-foreground cursor-not-allowed"
                        : isApplying
                        ? "bg-primary/50 text-white cursor-not-allowed"
                        : "bg-primary hover:bg-primary/90 text-white"
                    }`}
                  >
                    {selectedProblem.isApplied
                      ? "Applied"
                      : isApplying
                      ? "Applying..."
                      : "Apply Now"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
