import { getSingleMatch, Match } from "@/api/matches";
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

interface MatchDetailPageProps {
  matchId: string;
}

export default function MatchDetailPage({ matchId }: MatchDetailPageProps) {
  const router = useRouter();
  const [match, setMatch] = useState<Match | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

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
    // This would open a problem modal instead of navigating to a non-existent page
    // For now, we'll keep the button but it won't do anything harmful
    console.log("Problem details would open in a modal");
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
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
                  <div className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                    <Star className="h-3 w-3 fill-current" />
                    High Match
                  </div>
                </div>
              </div>
            </div>

            {/* Problem Details */}
            <div className="bg-card rounded-lg border border-border p-6">
              <h2 className="text-xl font-semibold mb-4">Project Details</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-foreground mb-2">
                    Description
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {problem.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-foreground mb-2">
                      Required Skills
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {problem.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-foreground mb-2">
                      Project Type
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {problem.type.map((type, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm"
                        >
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-foreground mb-2">
                    Compensation
                  </h4>
                  <div className="flex items-center gap-2 text-lg font-semibold text-green-600">
                    <DollarSign className="h-5 w-5" />
                    {formatSalary(problem.payRange.min, problem.payRange.max)}
                  </div>
                </div>

                {problem.candidatesQualification && (
                  <div>
                    <h4 className="font-medium text-foreground mb-2">
                      Qualifications Required
                    </h4>
                    <p className="text-muted-foreground">
                      {problem.candidatesQualification}
                    </p>
                  </div>
                )}

                {problem.niceToHaves && (
                  <div>
                    <h4 className="font-medium text-foreground mb-2">
                      Nice to Have
                    </h4>
                    <p className="text-muted-foreground">
                      {problem.niceToHaves}
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-6 border-t">
                <button
                  onClick={handleViewProblem}
                  className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                  View Full Project Details
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Other User Profile */}
            <div className="bg-card rounded-lg border p-6">
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

              {/* Show company details for employer */}
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

              <div className="space-y-3">
                <button
                  onClick={() => handleViewProfile(otherUser._id)}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 border border-primary text-primary rounded-md hover:bg-primary hover:text-primary-foreground transition-colors"
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
            <div className="bg-card rounded-lg border p-6">
              <h3 className="font-semibold mb-4">Match Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Match Score</span>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">95%</span>
                  </div>
                </div>
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
      </div>
    </div>
  );
}
