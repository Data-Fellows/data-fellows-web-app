import apiClient from "@/api";

// Types
export interface AddSkillsPayload {
  skillIds: string[];
}

export interface AddSkillsResponse {
  status: string;
  message: string;
  user?: any;
}

export interface AddWorkExperiencePayload {
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate?: string | null;
  description: string;
}

export interface AddEducationPayload {
  school: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate?: string | null;
  description?: string;
}

export interface AddBioPayload {
  bio: string;
}

export interface AddProfileDetailsPayload {
  dateOfBirth: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  photo?: File;
}

export interface UploadCVPayload {
  file: File;
}

export interface ExtractedWorkExperience {
  title: string;
  company: string;
  location?: string;
  country?: string;
  startDate: string;
  endDate?: string | null;
  description: string;
  currentlyWorking?: boolean;
}

export interface UploadCVResponse {
  status: string;
  message: string;
  data?: {
    workExperienceExtracted: number;
    educationHistoryExtracted: number;
    workExperience: ExtractedWorkExperience[];
    educationHistory: any[];
    rawText: string;
  };
  user?: any;
}

export interface AddCompanyDetailsPayload {
  companyName: string;
  companyAbout: string;
  companyType: string;
  companyCreatedAt?: string;
  noOfEmployees: number; // Changed from string to number
  companyPhone: string;
  companyAddress: string;
  companyCountry: string;
  companyState: string;
  companyCity: string;
  photo?: File;
}

export async function addSkillsApi(
  payload: AddSkillsPayload
): Promise<AddSkillsResponse> {
  const { data } = await apiClient.put("/profile/skills", payload);
  return data;
}

export async function addWorkExperienceApi(
  payload: AddWorkExperiencePayload
): Promise<any> {
  const { data } = await apiClient.put("/profile/work-experience", payload);
  return data;
}

export async function addEducationApi(
  payload: AddEducationPayload
): Promise<any> {
  const { data } = await apiClient.put("/profile/education-history", payload);
  return data;
}

export async function addBioApi(payload: AddBioPayload): Promise<any> {
  const { data } = await apiClient.put("/profile/bio", payload);
  return data;
}

export async function addProfileDetailsApi(
  payload: AddProfileDetailsPayload
): Promise<any> {
  const formData = new FormData();

  // Add text fields to FormData
  formData.append("dateOfBirth", payload.dateOfBirth);
  formData.append("phone", payload.phone);
  formData.append("address", payload.address);
  formData.append("city", payload.city);
  formData.append("state", payload.state);
  formData.append("country", payload.country);

  // Add photo file if provided
  if (payload.photo) {
    formData.append("photo", payload.photo);
  }

  const { data } = await apiClient.put("/profile/details", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
}

export async function getAvailableSkillsApi(): Promise<any> {
  const { data } = await apiClient.get("/skills");
  return data;
}

export async function getAvailableCategoriesApi(): Promise<any> {
  const { data } = await apiClient.get("/categories");
  return data;
}

// Upload CV and extract work experience
export async function uploadCVApi(file: File): Promise<UploadCVResponse> {
  const formData = new FormData();
  formData.append("cv", file);

  const { data } = await apiClient.post("/profile/upload-cv", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
}

// Parse CV without saving (for preview) - using the backend endpoint you created
export async function parseCVApi(file: File): Promise<UploadCVResponse> {
  const formData = new FormData();
  formData.append("cv", file);

  const { data } = await apiClient.post("/profile/upload-cv", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
}

export async function addCompanyDetailsApi(
  payload: AddCompanyDetailsPayload
): Promise<any> {
  const formData = new FormData();

  // Add text fields to FormData
  formData.append("companyName", payload.companyName);
  formData.append("companyAbout", payload.companyAbout);
  formData.append("companyType", payload.companyType);
  formData.append("noOfEmployees", payload.noOfEmployees.toString());
  formData.append("companyPhone", payload.companyPhone);
  formData.append("companyAddress", payload.companyAddress);
  formData.append("companyCountry", payload.companyCountry);
  formData.append("companyState", payload.companyState);
  formData.append("companyCity", payload.companyCity);

  if (payload.companyCreatedAt) {
    formData.append("companyCreatedAt", payload.companyCreatedAt);
  }

  if (payload.photo) {
    formData.append("photo", payload.photo);
  }

  const { data } = await apiClient.put("/profile/details", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
}
