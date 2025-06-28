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
  const { data } = await apiClient.delete(`/jobs/${problemId}/bookmark`);
  return data;
}

export async function getProblemDetails(problemId: string): Promise<Problem> {
  const { data } = await apiClient.get(`/jobs/${problemId}`);
  return data.data || data;
}
