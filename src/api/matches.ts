import apiClient from "@/api";

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  profilePicture?: string;
  photoUrl?: string;
  city?: string;
  country?: string;
  state?: string;
  skills?: Array<{ name: string; _id: string } | string>;
  workExperience?: Array<{
    _id: string;
    title: string;
    company: string;
    location?: string;
    startDate: string;
    endDate?: string | null;
    description?: string;
  }>;
  educationHistory?: Array<{
    _id: string;
    school: string;
    degree: string;
    fieldOfStudy: string;
    startDate: string;
    endDate?: string | null;
    grade?: string;
  }>;
}

export interface Employer {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  verified: boolean;
  active: boolean;
  onboarded: boolean;
  photoUrl: string;
  profileCompletion: number;
  userType: "employer";
  companyDetailsAdded: boolean;
  companyLogo: string;
  comapnyAboutAdded: boolean;
  categoryProblemsAdded: boolean;
  collectBusinessData: boolean;
  businessData: string[];
  dataAnalysisTools: string[];
  challengesFaced: string[];
  expectedOutcome: string[];
  neededSkills: Array<{
    name: string;
    _id: string;
  }>;
  categoryProblems: any[];
  companyAbout: string;
  companyAddress: string;
  companyCity: string;
  companyCountry: string;
  companyCreatedAt: string;
  companyName: string;
  companyPhone: string;
  companySize: string;
  companyState: string;
  companyType: string;
  noOfEmployees: number;
  phone: string;
}

export interface Problem {
  _id: string;
  payRange: {
    min: number;
    max: number;
  };
  fellowField: string;
  type: string[];
  skills: string[];
  description: string;
  status: string;
  candidatesQualification: string;
  niceToHaves?: string;
  noOfApplicants?: number;
  createdAt?: string;
}

export interface Applicant {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePicture?: string;
}

export interface Match {
  _id: string;
  employer: Employer;
  createdAt: string;
  applicant: Applicant;
  problem: Problem;
}

export interface MatchesResponse {
  status: string;
  matches: Match[];
}

export interface MatchesParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  fellowField?: string;
  skills?: string[];
  type?: string[];
  minSalary?: number;
  maxSalary?: number;
  minMatchScore?: number;
  sortBy?: "newest" | "oldest" | "match_score" | "salary_high" | "salary_low";
}

// Get matches for the current user (works for both user and employer)
export const getMatches = async (
  params: MatchesParams = {}
): Promise<MatchesResponse> => {
  const searchParams = new URLSearchParams();

  if (params.page) searchParams.append("page", params.page.toString());
  if (params.limit) searchParams.append("limit", params.limit.toString());
  if (params.search) searchParams.append("search", params.search);
  if (params.status) searchParams.append("status", params.status);
  if (params.fellowField)
    searchParams.append("fellowField", params.fellowField);
  if (params.skills?.length)
    searchParams.append("skills", params.skills.join(","));
  if (params.type?.length) searchParams.append("type", params.type.join(","));
  if (params.minSalary)
    searchParams.append("minSalary", params.minSalary.toString());
  if (params.maxSalary)
    searchParams.append("maxSalary", params.maxSalary.toString());
  if (params.minMatchScore)
    searchParams.append("minMatchScore", params.minMatchScore.toString());
  if (params.sortBy) searchParams.append("sortBy", params.sortBy);

  const response = await apiClient.get(`/matches?${searchParams.toString()}`);
  return response.data;
};

// Get a single match by ID
export const getSingleMatch = async (
  matchId: string
): Promise<{ status: string; match: Match }> => {
  const response = await apiClient.get(`/matches/${matchId}`);
  return response.data;
};

export default {
  getMatches,
  getSingleMatch,
};
