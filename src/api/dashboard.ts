import apiClient from "@/api";

export interface DashboardStats {
  totalApplications: number;
  todaysApplications: number;
  matches: number;
}

export interface JobMatch {
  _id: string;
  fellowField: string;
  type: string[];
  skills: string[];
  description: string;
  candidatesQualification: string;
  niceToHaves: string;
  status: string;
  noOfApplicants: number;
  payRange: {
    min: number;
    max: number;
  };
  employer: {
    _id: string;
    companyName: string;
    companyLogo?: string;
    companyAddress: string;
    companyCity: string;
    companyCountry: string;
    companyState: string;
    companyType: string;
    noOfEmployees: number;
  };
  createdAt: string;
  isBookmarked: boolean;
}

export interface Application {
  _id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  appliedAt: string;
  status: "pending" | "shortlisted" | "interview" | "hired" | "rejected";
}

export interface UserProfile {
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    photoUrl?: string;
    bio?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    dateOfBirth?: string;
    profileCompletion: number;
    verified: boolean;
    skills: Array<{ _id: string; name: string }>;
    categories: Array<{ _id: string; name: string }>;
    specialities: Array<{ _id: string; name: string }>;
    workExperience: Array<{
      _id: string;
      title: string;
      company: string;
      location: string;
      startDate: string;
      endDate?: string;
      description: string;
      currentlyWorking?: boolean;
    }>;
    educationHistory: Array<{
      _id: string;
      school: string;
      degree: string;
      fieldOfStudy: string;
      startDate: string;
      endDate?: string;
      description?: string;
      currentlyInSchool?: boolean;
    }>;
  };
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const { data } = await apiClient.get("/profile/application-stats");
  return data.data || data;
}

export async function getUserProfile(): Promise<UserProfile> {
  const { data } = await apiClient.get("/profile");
  return data.data || data;
}

export async function getSuggestedMatches(): Promise<JobMatch[]> {
  const { data } = await apiClient.get("/jobs/matching", {
    params: {
      page: 1,
      limit: 10,
      status: "",
      search: "",
    },
  });
  return data.problems || data.data || data;
}

export async function getUserApplications(): Promise<Application[]> {
  const { data } = await apiClient.get("/jobs/applied", {
    params: {
      page: 1,
      limit: 10,
      status: "",
      search: "",
    },
  });
  return data.data || data;
}
