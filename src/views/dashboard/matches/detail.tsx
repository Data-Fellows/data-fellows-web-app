import { getSingleMatch, Match } from "@/api/matches";
import MessageComponent from "@/components/matches/MessageComponent";
import MilestoneList from "@/components/matches/MilestoneList";
import PaymentComponent from "@/components/matches/PaymentComponent";
import PriceNegotiation from "@/components/matches/PriceNegotiation";
import { getUser } from "@/helpers";
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  ExternalLink,
  MapPin,
  MessageCircle,
  Send,
  Star,
  Users,
} from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  FiBriefcase,
  FiClock,
  FiDollarSign,
  FiMapPin,
  FiUsers,
  FiX,
} from "react-icons/fi";

// UI Components for tabs
const Tabs = ({ children, defaultValue, className }: any) => {
  const [activeTab, setActiveTab] = useState(defaultValue);
  return (
    <div className={className} data-active-tab={activeTab}>
      {children({ activeTab, setActiveTab })}
    </div>
  );
};

const TabsList = ({ children, className }: any) => (
  <div className={className}>{children}</div>
);

const TabsTrigger = ({
  value,
  children,
  className,
  activeTab,
  setActiveTab,
}: any) => (
  <button
    className={`${className} ${
      activeTab === value ? "bg-card text-primary shadow-sm" : ""
    }`}
    onClick={() => setActiveTab(value)}
  >
    {children}
  </button>
);

const TabsContent = ({ value, children, activeTab }: any) =>
  activeTab === value ? children : null;

interface MatchDetailPageProps {
  matchId: string;
}

export default function MatchDetailPage({ matchId }: MatchDetailPageProps) {
  const router = useRouter();
  const [match, setMatch] = useState<Match | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [showProblemModal, setShowProblemModal] = useState(false);

  useEffect(() => {
    const currentUser = getUser();
    if (!currentUser) {
      router.push("/auth/sign-in");
      return;
    }
    setUser(currentUser);
    fetchMatch();
  }, [matchId]);

  const fetchMatch = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getSingleMatch(matchId);
      setMatch(response.match);
    } catch (err: any) {
      console.error("Error fetching match:", err);
      setError(err.response?.data?.message || "Failed to load match details");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleViewProfile = (userId: string) => {
    router.push(`/dashboard/user-profile/${userId}`);
  };

  const handleViewProblem = () => {
    setShowProblemModal(true);
  };

  const closeProblemModal = () => {
    setShowProblemModal(false);
  };

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
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400";
      case "inactive":
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400";
      case "closed":
        return "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400";
      default:
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
              <p className="text-muted-foreground">Loading match details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !match) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="mb-4">
                <div className="mx-auto h-16 w-16 rounded-full bg-red-100 flex items-center justify-center">
                  <ExternalLink className="h-8 w-8 text-red-600" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {error || "Match not found"}
              </h3>
              <p className="text-muted-foreground mb-6">
                The match you're looking for could not be loaded.
              </p>
              <button
                onClick={handleBack}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isEmployer = user?.userType === "employer";
  const otherUser = isEmployer ? match.applicant : match.employer;
  const problem = match.problem;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8 max-w-full">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Matches
          </button>
        </div>

        {/* Match Details */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content with Tabs */}
          <div className="lg:col-span-3 space-y-6">
            {/* Match Header */}
            <div className="bg-card rounded-lg border border-border p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-foreground mb-2">
                    {problem.fellowField} Match
                  </h1>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Matched on {formatDate(match.createdAt)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      "active"
                    )}`}
                  >
                    Active
                  </span>
                </div>
              </div>
            </div>

            {/* Tabbed Interface */}
            <Tabs defaultValue="overview" className="w-full">
              {({ activeTab, setActiveTab }: any) => (
                <>
                  <TabsList className="grid w-full grid-cols-3 mb-6 p-1 bg-muted rounded-lg">
                    <TabsTrigger
                      value="overview"
                      activeTab={activeTab}
                      setActiveTab={setActiveTab}
                      className="px-6 py-3 text-sm font-medium text-muted-foreground data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-sm rounded-md transition-all"
                    >
                      Overview
                    </TabsTrigger>
                    <TabsTrigger
                      value="messages"
                      activeTab={activeTab}
                      setActiveTab={setActiveTab}
                      className="px-6 py-3 text-sm font-medium text-muted-foreground data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-sm rounded-md transition-all"
                    >
                      Messages
                    </TabsTrigger>
                    <TabsTrigger
                      value="payment"
                      activeTab={activeTab}
                      setActiveTab={setActiveTab}
                      className="px-6 py-3 text-sm font-medium text-muted-foreground data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-sm rounded-md transition-all"
                    >
                      Payment
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" activeTab={activeTab}>
                    <div className="space-y-6">
                      {/* Match Score */}
                      <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                            <Star className="h-6 w-6 text-green-600 fill-current" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-green-800">
                              95% Match
                            </h3>
                            <p className="text-sm text-green-700">
                              Excellent compatibility for this project
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Project Requirements */}
                      <div className="bg-card border border-border rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-foreground mb-4">
                          Project Requirements
                        </h3>
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium text-foreground mb-2">
                              Description
                            </h4>
                            <p className="text-muted-foreground leading-relaxed">
                              {problem.description}
                            </p>
                          </div>

                          <div>
                            <h4 className="font-medium text-foreground mb-2">
                              Required Skills
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {problem.skills.map(
                                (skill: string, index: number) => (
                                  <span
                                    key={index}
                                    className="bg-primary/10 border border-border text-primary px-3 py-1 rounded-full text-sm font-medium"
                                  >
                                    {skill}
                                  </span>
                                )
                              )}
                            </div>
                          </div>

                          <div>
                            <h4 className="font-medium text-foreground mb-2">
                              Budget Range
                            </h4>
                            <div className="flex items-center gap-2">
                              <DollarSign className="h-4 w-4 text-muted-foreground" />
                              <span className="text-foreground font-medium">
                                ${problem.payRange.min.toLocaleString()} - $
                                {problem.payRange.max.toLocaleString()}
                              </span>
                            </div>
                          </div>

                          <div>
                            <h4 className="font-medium text-foreground mb-2">
                              Project Types
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {problem.type.map(
                                (type: string, index: number) => (
                                  <span
                                    key={index}
                                    className="bg-accent/10 border border-border text-accent-foreground px-3 py-1 rounded-full text-sm font-medium"
                                  >
                                    {type}
                                  </span>
                                )
                              )}
                            </div>
                          </div>

                          {problem.candidatesQualification && (
                            <div>
                              <h4 className="font-medium text-foreground mb-2">
                                Required Qualifications
                              </h4>
                              <p className="text-muted-foreground leading-relaxed">
                                {problem.candidatesQualification}
                              </p>
                            </div>
                          )}

                          {problem.niceToHaves && (
                            <div>
                              <h4 className="font-medium text-foreground mb-2">
                                Nice to Have
                              </h4>
                              <p className="text-muted-foreground leading-relaxed">
                                {problem.niceToHaves}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="messages" activeTab={activeTab}>
                    <MessageComponent
                      matchId={match._id}
                      otherUser={otherUser}
                    />
                  </TabsContent>

                  <TabsContent value="payment" activeTab={activeTab}>
                    <div className="space-y-6">
                      {/* Price Negotiation */}
                      <PriceNegotiation
                        matchId={match._id}
                        isEmployer={isEmployer}
                        initialBudget={problem.payRange}
                      />

                      {/* Milestone Tracking */}
                      <MilestoneList
                        matchId={match._id}
                        isEmployer={isEmployer}
                      />

                      {/* Payment Processing */}
                      <PaymentComponent
                        matchId={match._id}
                        isEmployer={isEmployer}
                      />
                    </div>
                  </TabsContent>
                </>
              )}
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Other User Profile */}
            <div className="bg-card rounded-lg border border-border p-6">
              <h2 className="text-lg font-semibold mb-4">
                {isEmployer ? "Matched Talent" : "Company"}
              </h2>

              <div className="flex items-center gap-4 mb-4">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                  {(otherUser as any).profilePicture ||
                  (otherUser as any).photoUrl ? (
                    <img
                      src={
                        (otherUser as any).profilePicture ||
                        (otherUser as any).photoUrl
                      }
                      alt={`${otherUser.firstName} ${otherUser.lastName}`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-lg font-semibold text-primary">
                      {otherUser.firstName[0]}
                      {otherUser.lastName[0]}
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">
                    {otherUser.firstName} {otherUser.lastName}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {otherUser.email}
                  </p>
                </div>
              </div>

              {/* Show company details for users, skills for employers */}
              {!isEmployer && (match.employer as any).companyName && (
                <div className="space-y-3 mb-4">
                  <div>
                    <h4 className="font-medium text-foreground mb-1">
                      Company
                    </h4>
                    <p className="text-muted-foreground text-sm">
                      {(match.employer as any).companyName}
                    </p>
                  </div>
                  {(match.employer as any).companyCity && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {(match.employer as any).companyCity},{" "}
                      {(match.employer as any).companyState}
                    </div>
                  )}
                  {(match.employer as any).companySize && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      {(match.employer as any).companySize} company
                    </div>
                  )}
                </div>
              )}

              {/* Show skills for users */}
              {isEmployer && (otherUser as any).skills && (
                <div className="mb-4">
                  <h4 className="font-medium text-foreground mb-2">Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {(otherUser as any).skills
                      .slice(0, 6)
                      .map((skill: any, index: number) => (
                        <span
                          key={index}
                          className="bg-blue-50 border border-blue-200 text-blue-700 px-2 py-1 rounded-full text-xs"
                        >
                          {typeof skill === "string" ? skill : skill.name}
                        </span>
                      ))}
                    {(otherUser as any).skills.length > 6 && (
                      <span className="text-xs text-muted-foreground">
                        +{(otherUser as any).skills.length - 6} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <button
                  onClick={() => handleViewProfile(otherUser._id)}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 border border-border text-primary rounded-md hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                  View Profile
                </button>

                <button className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
                  <MessageCircle className="h-4 w-4" />
                  Send Message
                </button>

                <button className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                  <Send className="h-4 w-4" />
                  {isEmployer ? "Send Offer" : "Apply Now"}
                </button>
              </div>
            </div>

            {/* Match Stats */}
            <div className="bg-card rounded-lg border border-border p-6">
              <h3 className="font-semibold mb-4">Match Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Status</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                    Active
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Matched On</span>
                  <span className="text-sm">{formatDate(match.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Problem Details Modal */}
        {showProblemModal && match && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4 scrollbar-hide">
            <div className="bg-card border border-border rounded-xl sm:rounded-2xl max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto scrollbar-hide">
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
                      <div className="bg-gradient-to-br from-primary/20 to-primary/10 p-2 sm:p-3 rounded-lg sm:rounded-xl border border-border shadow-md flex-shrink-0">
                        <FiBriefcase className="text-primary w-5 h-5 sm:w-6 sm:h-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground mb-1 sm:mb-2">
                          {problem.fellowField}
                        </h3>
                        <p className="text-base sm:text-lg text-muted-foreground font-medium mb-2">
                          {match.employer.companyName}
                        </p>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <FiUsers className="w-4 h-4" />
                            <span>
                              {problem.noOfApplicants || 0} applicants
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <FiClock className="w-4 h-4" />
                            <span>{formatDate(match.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                      <div
                        className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-semibold self-start ${getStatusColor(
                          problem.status
                        )}`}
                      >
                        {problem.status}
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
                        {match.employer.companyCity || "Remote"},{" "}
                        {match.employer.companyCountry || "Worldwide"}
                      </p>
                    </div>

                    <div className="bg-green-50 dark:bg-green-900/20 border border-border dark:border-green-800/30 rounded-lg p-3 sm:p-4">
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
                          problem.payRange.min,
                          problem.payRange.max
                        )}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-base sm:text-lg font-semibold text-foreground mb-2 sm:mb-3">
                      Description
                    </h4>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                      {problem.description}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-base sm:text-lg font-semibold text-foreground mb-2 sm:mb-3">
                      Qualifications
                    </h4>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                      {problem.candidatesQualification}
                    </p>
                  </div>

                  {problem.niceToHaves && (
                    <div>
                      <h4 className="text-base sm:text-lg font-semibold text-foreground mb-2 sm:mb-3">
                        Nice to Have
                      </h4>
                      <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                        {problem.niceToHaves}
                      </p>
                    </div>
                  )}

                  <div>
                    <h4 className="text-base sm:text-lg font-semibold text-foreground mb-2 sm:mb-3">
                      Job Types
                    </h4>
                    <div className="flex flex-wrap gap-1 sm:gap-2">
                      {problem.type.map((type: string, index: number) => (
                        <span
                          key={index}
                          className="bg-accent/10 border border-border text-accent-foreground px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium"
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
                      {problem.skills.map((skill: string, index: number) => (
                        <span
                          key={index}
                          className="bg-primary/10 border border-border text-primary px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-border">
                    <button
                      onClick={closeProblemModal}
                      className="flex-1 px-6 sm:px-8 py-2.5 sm:py-3 border border-border rounded-lg font-semibold transition-all duration-300 hover:bg-muted text-sm sm:text-base"
                    >
                      Close
                    </button>
                    {!isEmployer && (
                      <button className="flex-1 px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-semibold transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 text-sm sm:text-base bg-primary hover:bg-primary/90 text-white">
                        Apply Now
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
