import apiClient from "@/api";

export interface PayRange {
  min: number;
  max: number;
}

export interface Employer {
  _id: string;
  companyName: string;
  companyLogo: string;
  companyCity: string;
  companyCountry: string;
  companySize: string;
  noOfEmployees: number;
  companyAddress?: string;
  companyState?: string;
  companyType?: string;
}

export interface Problem {
  _id: string;
  fellowField: string;
  type: string[];
  skills: string[];
  description: string;
  candidatesQualification: string;
  niceToHaves: string;
  status: string;
  noOfApplicants: number;
  payRange: PayRange;
  employer: Employer;
  createdAt: string;
  isApplied: boolean;
  isBookmarked: boolean;
}

export interface ProblemsResponse {
  status: string;
  totalProblems: number;
  totalPages: number;
  currentPage: number;
  problems: Problem[];
}

export interface ProblemsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  fellowField?: string;
  skills?: string[];
  type?: string[];
  minSalary?: number;
  maxSalary?: number;
  sortBy?: "newest" | "oldest" | "salary_high" | "salary_low" | "applicants";
}

export interface SuggestedProblem {
  _id?: string;
  payRange: PayRange;
  fellowField: string;
  type: string[];
  skills: string[];
  description: string;
  candidatesQualification: string;
  niceToHaves: string;
}

export interface SuggestedProblemsPayload {
  suggestions: SuggestedProblem[];
}

export interface Applicant {
  _id: string;
  user?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    photoUrl?: string;
    city?: string;
    country?: string;
    state?: string;
    skills: Array<{ name: string; _id: string } | string>;
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
      description?: string;
    }>;
    bio?: string;
    verified?: boolean;
    profileCompletion?: number;
  };
  // Direct properties for backward compatibility
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  profilePicture?: string;
  city?: string;
  country?: string;
  skills?: string[];
  experience?: string;
  education?: string;
  cv?: string;
  appliedAt?: string;
  applicationDate?: string;
  status:
    | "pending"
    | "Applied"
    | "reviewed"
    | "Shortlisted"
    | "shortlisted"
    | "Accepted"
    | "accepted"
    | "hired"
    | "Rejected"
    | "rejected";
  match?: number;
  what_matched?: string[];
  went_against?: string[];
}

export interface ApplicantsResponse {
  status: string;
  totalApplicants: number;
  applicants: Applicant[];
}

// Employer Dashboard Stats and Applications interfaces
export interface EmployerStats {
  totalProblems: number;
  activeProblems: number;
  solvedProblems: number;
  inProgressProblems: number;
  draftProblems: number;
  totalApplications: number;
  todaysApplications: number;
  totalShortlisted: number;
  totalHired: number;
  totalRejected: number;
  totalMatches: number;
  avgApplicationsPerProblem: number;
  applicationStats: {
    applied: number;
    shortlisted: number;
    hired: number;
    rejected: number;
  };
}

export interface RecentApplicationApplicant {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  photoUrl?: string;
}

export interface RecentApplicationProblem {
  id: string;
  fellowField: string;
  description: string;
  payRange: PayRange;
  skills: string[];
}

export interface RecentApplication {
  applicationId: string;
  applicant: RecentApplicationApplicant;
  status: string;
  applicationDate: string;
  match: number;
  problem: RecentApplicationProblem;
}

export interface RecentApplicationsResponse {
  status: string;
  data: {
    recentApplications: RecentApplication[];
    totalCount: number;
  };
}

export interface EmployerStatsResponse {
  status: string;
  data: EmployerStats;
}

export async function getProblems(
  params: ProblemsParams = {}
): Promise<ProblemsResponse> {
  const {
    page = 1,
    limit = 12,
    search = "",
    status = "",
    fellowField = "",
    skills = [],
    type = [],
    minSalary,
    maxSalary,
    sortBy = "newest",
  } = params;

  const { data } = await apiClient.get("/jobs", {
    params: {
      page,
      limit,
      search,
      status,
      fellowField,
      skills: skills.join(","),
      type: type.join(","),
      minSalary,
      maxSalary,
      sortBy,
    },
  });

  return data;
}

export async function applyToProblem(
  problemId: string
): Promise<{ success: boolean; message: string }> {
  const { data } = await apiClient.post(`/jobs/${problemId}/apply`);
  return data;
}

export async function bookmarkProblem(
  problemId: string
): Promise<{ success: boolean; message: string }> {
  const { data } = await apiClient.post(`/jobs/${problemId}/bookmark`);
  return data;
}

export async function unbookmarkProblem(
  problemId: string
): Promise<{ success: boolean; message: string }> {
  const { data } = await apiClient.delete(
    `/profile/bookmarked-jobs/${problemId}`
  );
  return data;
}

export async function getProblemDetails(problemId: string): Promise<Problem> {
  const { data } = await apiClient.get(`/jobs/${problemId}`);
  return data.data || data;
}

export async function getSuggestedProblems(): Promise<SuggestedProblem[]> {
  const { data } = await apiClient.get("/problems/suggested");
  return data.suggestions || data;
}

export async function saveSuggestedProblems(
  payload: SuggestedProblemsPayload
): Promise<{ success: boolean; message: string; suggestions?: any[] }> {
  const { data } = await apiClient.post("/problems/suggested/create", payload);
  return {
    success: data.status === "CREATED" || data.status === "OK",
    message: data.message || "Suggested problems saved successfully",
    suggestions: data.suggestions,
  };
}

export async function updateProblem(
  problemId: string,
  updates: Partial<Problem>
): Promise<{ status: string; message: string; problem?: Problem }> {
  const { data } = await apiClient.put(`/problems/${problemId}`, updates);
  return data;
}

export async function deleteProblem(
  problemId: string
): Promise<{ status: string; message: string }> {
  const { data } = await apiClient.delete(`/problems/${problemId}`);
  return data;
}

export async function getEmployerProblems(
  params: ProblemsParams = {}
): Promise<ProblemsResponse> {
  const {
    page = 1,
    limit = 12,
    search = "",
    status = "",
    fellowField = "",
    skills = [],
    type = [],
    minSalary,
    maxSalary,
    sortBy = "newest",
  } = params;

  const { data } = await apiClient.get("/problems", {
    params: {
      page,
      limit,
      search,
      status,
      fellowField,
      skills: skills.join(","),
      type: type.join(","),
      minSalary,
      maxSalary,
      sortBy,
    },
  });

  return data;
}

export async function getProblemApplicants(
  problemId: string
): Promise<ApplicantsResponse> {
  const { data } = await apiClient.get(`/problems/${problemId}/applicants`);
  return data;
}

// Employer Dashboard API functions
export async function getEmployerStats(): Promise<EmployerStats> {
  const { data } = await apiClient.get("/problems/stats");
  return data.data;
}

export async function getRecentApplications(): Promise<RecentApplication[]> {
  const { data } = await apiClient.get("/problems/recent-applications");
  return data.data.recentApplications;
}

export async function createProblem(problemData: {
  fellowField: string;
  type: string[];
  payRange: PayRange;
  skills: string[];
  description: string;
  candidatesQualification: string;
  niceToHaves: string;
  suggestedProblemId?: string;
}): Promise<{ success: boolean; message: string; problem?: Problem }> {
  const { data } = await apiClient.post("/problems", problemData);
  return {
    success: data.status === "Created" || data.status === "OK",
    message: data.message || "Problem created successfully",
    problem: data.problem,
  };
}

// Applicant Status Update API functions
export async function shortlistApplicant(
  problemId: string,
  applicantId: string
): Promise<{ success: boolean; message: string }> {
  const { data } = await apiClient.patch(
    `/problems/${problemId}/applicants/${applicantId}/status`,
    { status: "Shortlisted" }
  );
  return {
    success: data.status === "OK" || data.status === "success",
    message: data.message || "Applicant shortlisted successfully",
  };
}

export async function acceptApplicant(
  problemId: string,
  applicantId: string
): Promise<{ success: boolean; message: string }> {
  const { data } = await apiClient.patch(
    `/problems/${problemId}/applicants/${applicantId}/status`,
    { status: "Accepted" }
  );
  return {
    success: data.status === "OK" || data.status === "success",
    message: data.message || "Applicant accepted successfully",
  };
}

export async function rejectApplicant(
  problemId: string,
  applicantId: string
): Promise<{ success: boolean; message: string }> {
  const { data } = await apiClient.patch(
    `/problems/${problemId}/applicants/${applicantId}/status`,
    { status: "Rejected" }
  );
  return {
    success: data.status === "OK" || data.status === "success",
    message: data.message || "Applicant rejected successfully",
  };
}
