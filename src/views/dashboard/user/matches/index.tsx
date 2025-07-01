import { Match } from "@/api/matches";
import { useMatches } from "@/hooks/useMatches";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import {
  FiBriefcase,
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
  FiDollarSign,
  FiEye,
  FiFilter,
  FiGrid,
  FiList,
  FiMapPin,
  FiSearch,
  FiStar,
  FiTrendingUp,
  FiX,
} from "react-icons/fi";

// Skeleton loader component
const SkeletonCard = () => (
  <div className="bg-card border border-border rounded-2xl p-8 shadow-lg animate-pulse">
    <div className="flex items-start justify-between mb-6">
      <div className="flex-1 min-w-0">
        <div className="h-8 bg-muted rounded-lg w-2/3 mb-3"></div>
        <div className="h-5 bg-muted rounded w-1/3 mb-4"></div>
        <div className="h-4 bg-muted rounded w-1/4"></div>
      </div>
      <div className="flex-shrink-0 ml-6">
        <div className="w-16 h-16 bg-muted rounded-full"></div>
      </div>
    </div>
    <div className="space-y-3 mb-6">
      <div className="h-4 bg-muted rounded w-full"></div>
      <div className="h-4 bg-muted rounded w-3/4"></div>
    </div>
    <div className="flex flex-wrap gap-2 mb-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-6 bg-muted rounded-full w-16"></div>
      ))}
    </div>
    <div className="flex items-center justify-between pt-4 border-t border-border">
      <div className="h-6 bg-muted rounded w-24"></div>
      <div className="h-6 bg-muted rounded w-20"></div>
    </div>
  </div>
);

// Empty state component
const EmptyState = ({
  searchQuery,
  hasFilters,
}: {
  searchQuery: string;
  hasFilters: boolean;
}) => (
  <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
    <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
      <FiTrendingUp className="w-12 h-12 text-muted-foreground" />
    </div>
    <h3 className="text-2xl font-bold text-foreground mb-3">
      {searchQuery || hasFilters ? "No matches found" : "No job matches yet"}
    </h3>
    <p className="text-muted-foreground max-w-md leading-relaxed">
      {searchQuery || hasFilters
        ? "Try adjusting your search terms or filters to find more matches."
        : "Job matches will appear here when employers show interest in your profile and applications."}
    </p>
  </div>
);

export default function UserMatchesPage() {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    fellowField: "",
    skills: [] as string[],
    type: [] as string[],
    minSalary: "",
    maxSalary: "",
    sortBy: "newest" as const,
  });

  const {
    matches,
    totalMatches,
    totalPages,
    currentPage,
    loading,
    error,
    refetch,
    updateParams,
    params,
  } = useMatches();

  // Update API params when filters change
  useEffect(() => {
    const apiParams = {
      page: params.page,
      limit: params.limit,
      search: searchQuery || undefined,
      fellowField: filters.fellowField || undefined,
      skills: filters.skills.length ? filters.skills : undefined,
      type: filters.type.length ? filters.type : undefined,
      minSalary: filters.minSalary ? parseInt(filters.minSalary) : undefined,
      maxSalary: filters.maxSalary ? parseInt(filters.maxSalary) : undefined,
      sortBy: filters.sortBy,
    };
    updateParams(apiParams);
  }, [searchQuery, filters, updateParams, params.page, params.limit]);

  const hasActiveFilters = useMemo(() => {
    return !!(
      filters.fellowField ||
      filters.skills.length > 0 ||
      filters.type.length > 0 ||
      filters.minSalary ||
      filters.maxSalary
    );
  }, [filters]);

  const clearFilters = () => {
    setFilters({
      fellowField: "",
      skills: [],
      type: [],
      minSalary: "",
      maxSalary: "",
      sortBy: "newest",
    });
    setSearchQuery("");
  };

  const handleSkillToggle = (skill: string) => {
    setFilters((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill],
    }));
  };

  const handleTypeToggle = (type: string) => {
    setFilters((prev) => ({
      ...prev,
      type: prev.type.includes(type)
        ? prev.type.filter((t) => t !== type)
        : [...prev.type, type],
    }));
  };

  const formatSalary = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const MatchCard = ({ match }: { match: Match }) => (
    <div className="bg-card border border-border rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-primary/20">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl font-bold text-foreground truncate">
              {match.problem.fellowField}
            </h3>
            <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
              <FiStar className="w-3 h-3 mr-1" />
              Matched
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
            <div className="flex items-center gap-1">
              <FiBriefcase className="w-4 h-4" />
              <span>{match.employer.companyName}</span>
            </div>
            {match.employer.companyCity && (
              <div className="flex items-center gap-1">
                <FiMapPin className="w-4 h-4" />
                <span>
                  {match.employer.companyCity}, {match.employer.companyCountry}
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Applied:</span>
            <span className="font-medium text-foreground">
              {formatDate(match.createdAt)}
            </span>
          </div>
        </div>

        <div className="flex-shrink-0 ml-6">
          {match.employer.companyLogo ? (
            <img
              src={match.employer.companyLogo}
              alt={match.employer.companyName}
              className="w-16 h-16 rounded-full object-cover border-2 border-border"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center border-2 border-border">
              <FiBriefcase className="w-8 h-8 text-primary" />
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="text-muted-foreground mb-6 line-clamp-3 leading-relaxed">
        {match.problem.description}
      </p>

      {/* Skills */}
      <div className="flex flex-wrap gap-2 mb-6">
        {match.problem.skills.slice(0, 4).map((skill, index) => (
          <span
            key={index}
            className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
          >
            {skill}
          </span>
        ))}
        {match.problem.skills.length > 4 && (
          <span className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-sm">
            +{match.problem.skills.length - 4} more
          </span>
        )}
      </div>

      {/* Problem Types */}
      <div className="flex flex-wrap gap-2 mb-6">
        {match.problem.type.slice(0, 3).map((type, index) => (
          <span
            key={index}
            className="px-3 py-1 bg-secondary/50 text-secondary-foreground rounded-full text-sm"
          >
            {type}
          </span>
        ))}
        {match.problem.type.length > 3 && (
          <span className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-sm">
            +{match.problem.type.length - 3} more
          </span>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-6 border-t border-border">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <FiDollarSign className="w-4 h-4" />
            <span>
              {formatSalary(match.problem.payRange.min)} -{" "}
              {formatSalary(match.problem.payRange.max)}
            </span>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <FiCalendar className="w-4 h-4" />
            <span>{formatDate(match.createdAt)}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => console.log("Problem details would open in a modal")}
            className="flex items-center gap-2 px-3 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors text-sm font-medium"
          >
            <FiBriefcase className="w-4 h-4" />
            Problem
          </button>
          <button
            onClick={() => router.push(`/dashboard/matches/${match._id}`)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
          >
            <FiEye className="w-4 h-4" />
            View Match
          </button>
        </div>
      </div>
    </div>
  );

  const MatchListItem = ({ match }: { match: Match }) => (
    <div className="bg-card border border-border rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-primary/20">
      <div className="flex items-start gap-6">
        {/* Company Logo */}
        <div className="flex-shrink-0">
          {match.employer.companyLogo ? (
            <img
              src={match.employer.companyLogo}
              alt={match.employer.companyName}
              className="w-12 h-12 rounded-full object-cover border-2 border-border"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center border-2 border-border">
              <FiBriefcase className="w-6 h-6 text-primary" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-lg font-bold text-foreground truncate">
                  {match.problem.fellowField}
                </h3>
                <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                  <FiStar className="w-3 h-3 mr-1" />
                  Matched
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <FiBriefcase className="w-4 h-4" />
                  <span>{match.employer.companyName}</span>
                </div>
                {match.employer.companyCity && (
                  <div className="flex items-center gap-1">
                    <FiMapPin className="w-4 h-4" />
                    <span>
                      {match.employer.companyCity},{" "}
                      {match.employer.companyCountry}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <FiDollarSign className="w-4 h-4" />
                  <span>
                    {formatSalary(match.problem.payRange.min)} -{" "}
                    {formatSalary(match.problem.payRange.max)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() =>
                  console.log("Problem details would open in a modal")
                }
                className="flex items-center gap-2 px-3 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors text-sm font-medium"
              >
                <FiBriefcase className="w-4 h-4" />
                Problem
              </button>
              <button
                onClick={() => router.push(`/dashboard/matches/${match._id}`)}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
              >
                <FiEye className="w-4 h-4" />
                View Match
              </button>
            </div>
          </div>

          <p className="text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
            {match.problem.description}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {match.problem.skills.slice(0, 3).map((skill, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium"
                >
                  {skill}
                </span>
              ))}
              {match.problem.skills.length > 3 && (
                <span className="px-2 py-1 bg-muted text-muted-foreground rounded-full text-xs">
                  +{match.problem.skills.length - 3} more
                </span>
              )}
            </div>

            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <FiCalendar className="w-3 h-3" />
                <span>Applied: {formatDate(match.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Job Matches
          </h1>
          <p className="text-muted-foreground">
            Explore problems that match your skills and experience
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-muted rounded-lg p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-md transition-colors ${
                viewMode === "grid"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <FiGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-md transition-colors ${
                viewMode === "list"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <FiList className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search job matches..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          />
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
              showFilters || hasActiveFilters
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background text-foreground border-border hover:border-primary/50"
            }`}
          >
            <FiFilter className="w-4 h-4" />
            Filters
            {hasActiveFilters && (
              <span className="bg-primary-foreground text-primary rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium">
                {
                  Object.values(filters).filter((v) =>
                    Array.isArray(v) ? v.length > 0 : v
                  ).length
                }
              </span>
            )}
          </button>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-background text-foreground hover:border-primary/50 transition-colors"
            >
              <FiX className="w-4 h-4" />
              Clear All
            </button>
          )}

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{totalMatches.toLocaleString()} matches found</span>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-card border border-border rounded-xl p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Fellow Field Filter */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Field
                </label>
                <select
                  value={filters.fellowField}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      fellowField: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                >
                  <option value="">All Fields</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Machine Learning">Machine Learning</option>
                  <option value="Data Analytics">Data Analytics</option>
                  <option value="Data Engineering">Data Engineering</option>
                  <option value="Business Intelligence">
                    Business Intelligence
                  </option>
                  <option value="Software Engineering">
                    Software Engineering
                  </option>
                </select>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Sort By
                </label>
                <select
                  value={filters.sortBy}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      sortBy: e.target.value as any,
                    }))
                  }
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="salary_high">Highest Salary</option>
                  <option value="salary_low">Lowest Salary</option>
                </select>
              </div>

              {/* Salary Range */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Min Salary
                </label>
                <input
                  type="number"
                  placeholder="e.g. 50000"
                  value={filters.minSalary}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      minSalary: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Max Salary
                </label>
                <input
                  type="number"
                  placeholder="e.g. 150000"
                  value={filters.maxSalary}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      maxSalary: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                />
              </div>
            </div>

            {/* Skills Filter */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                Skills
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  "Python",
                  "R",
                  "SQL",
                  "Machine Learning",
                  "Deep Learning",
                  "TensorFlow",
                  "PyTorch",
                  "Data Visualization",
                  "Tableau",
                  "Power BI",
                  "Statistics",
                  "A/B Testing",
                  "Big Data",
                  "Spark",
                  "Hadoop",
                  "AWS",
                  "Azure",
                  "GCP",
                  "Docker",
                  "Kubernetes",
                ].map((skill) => (
                  <button
                    key={skill}
                    onClick={() => handleSkillToggle(skill)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filters.skills.includes(skill)
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>

            {/* Problem Types Filter */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                Problem Types
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  "Full-time",
                  "Part-time",
                  "Contract",
                  "Freelance",
                  "Remote",
                  "Hybrid",
                  "On-site",
                ].map((type) => (
                  <button
                    key={type}
                    onClick={() => handleTypeToggle(type)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filters.type.includes(type)
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      {loading ? (
        <div
          className={`grid gap-6 ${
            viewMode === "grid"
              ? "grid-cols-1 lg:grid-cols-2 xl:grid-cols-3"
              : "grid-cols-1"
          }`}
        >
          {Array.from({ length: 9 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <div className="w-24 h-24 bg-destructive/10 rounded-full flex items-center justify-center mb-6">
            <FiX className="w-12 h-12 text-destructive" />
          </div>
          <h3 className="text-2xl font-bold text-foreground mb-3">
            Something went wrong
          </h3>
          <p className="text-muted-foreground max-w-md leading-relaxed mb-6">
            {error}
          </p>
          <button
            onClick={refetch}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            Try Again
          </button>
        </div>
      ) : matches.length === 0 ? (
        <EmptyState searchQuery={searchQuery} hasFilters={hasActiveFilters} />
      ) : (
        <>
          {/* Matches Grid/List */}
          <div
            className={`grid gap-6 ${
              viewMode === "grid"
                ? "grid-cols-1 lg:grid-cols-2 xl:grid-cols-3"
                : "grid-cols-1"
            }`}
          >
            {matches.map((match) => (
              <div key={match._id}>
                {viewMode === "grid" ? (
                  <MatchCard match={match} />
                ) : (
                  <MatchListItem match={match} />
                )}
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-8 border-t border-border">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>
                  Showing {(currentPage - 1) * (params.limit || 12) + 1} to{" "}
                  {Math.min(currentPage * (params.limit || 12), totalMatches)}{" "}
                  of {totalMatches.toLocaleString()} matches
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateParams({ page: currentPage - 1 })}
                  disabled={currentPage === 1}
                  className="flex items-center gap-2 px-4 py-2 bg-background border border-border rounded-lg hover:border-primary/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                >
                  <FiChevronLeft className="w-4 h-4" />
                  Previous
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((page) => {
                      const distance = Math.abs(page - currentPage);
                      return (
                        distance === 0 ||
                        distance === 1 ||
                        page === 1 ||
                        page === totalPages
                      );
                    })
                    .map((page, index, array) => {
                      const showEllipsis =
                        index > 0 && array[index - 1] !== page - 1;
                      return (
                        <div key={page} className="flex items-center gap-1">
                          {showEllipsis && (
                            <span className="px-2 py-1 text-muted-foreground">
                              ...
                            </span>
                          )}
                          <button
                            onClick={() => updateParams({ page })}
                            className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                              currentPage === page
                                ? "bg-primary text-primary-foreground"
                                : "bg-background border border-border hover:border-primary/50"
                            }`}
                          >
                            {page}
                          </button>
                        </div>
                      );
                    })}
                </div>

                <button
                  onClick={() => updateParams({ page: currentPage + 1 })}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-2 px-4 py-2 bg-background border border-border rounded-lg hover:border-primary/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                >
                  Next
                  <FiChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
