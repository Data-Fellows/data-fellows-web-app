import { ReactNode } from "react";
import apiClient from ".";

// Profile API Types
export interface Skill {
  _id: string;
  name: string;
}
export type DeleteSkillPayload = {
  skillName: string;
};
export interface WorkExperience {
  company: ReactNode;
  endDate: any;
  title: ReactNode;
  location: any;
  startDate(startDate: any): import("react").ReactNode;
  description: any;
  _id: string;
  companyName: string;
  roleHeld: string;
  dateStarted: string;
  dateEnded: string | null;
  responsibilities?: string;
  isCurrentRole?: boolean;
}

export interface Education {
  _id: string;
  institutionName: string;
  course: string;
  degree: string;
  entryPeriod: string;
  completionDate: string;
  grade?: string;
  isCompleted?: boolean;
  description?: string;
}

export interface UserProfile {
  data: any;
  user: any;
  educationHistory: any;
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  photoUrl?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  dateOfBirth?: string;
  bio?: string;
  skills: Skill[];
  workExperience: WorkExperience[];
  education: Education[];
  profileCompletion: number;
  verified: boolean;
  onboarded: boolean;
  userType: "user" | "employer";
  createdAt: string;
  updatedAt: string;
}

export interface ProfileResponse {
  success: boolean;
  user: UserProfile;
}

export interface UpdateProfilePayload {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  dateOfBirth?: string;
  bio?: string;
}

export interface UpdateSkillsPayload {
  skillNames: string[];
}

export interface AddWorkExperiencePayload {
  title: string;
  company: string;
  location?: string;
  startDate: string;
  endDate?: string | null;
  description?: string;
}

export interface UpdateWorkExperiencePayload extends AddWorkExperiencePayload {
  _id: string;
}

export interface AddEducationPayload {
  school: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate?: string | null;
  description?: string;
}

export interface UpdateEducationPayload extends AddEducationPayload {
  _id: string;
}

export interface UploadPhotoPayload {
  photo: File;
}

// API Functions
export async function getProfile(): Promise<UserProfile> {
  const { data } = await apiClient.get("/profile");
  return data.user || data;
}

export async function updateProfile(
  payload: UpdateProfilePayload
): Promise<UserProfile> {
  const { data } = await apiClient.put("/profile", payload);
  return data.user || data;
}

export async function updateSkills(
  payload: UpdateSkillsPayload
): Promise<UserProfile> {
  const { data } = await apiClient.put("/profile/skills", payload);
  return data.user || data;
}

export async function addWorkExperience(
  payload: AddWorkExperiencePayload
): Promise<UserProfile> {
  const { data } = await apiClient.put("/profile/work-experience", payload);
  return data.user || data;
}

export async function updateWorkExperience(
  payload: UpdateWorkExperiencePayload
): Promise<UserProfile> {
  const { data } = await apiClient.put(
    `/profile/work-experience/${payload._id}`,
    payload
  );
  return data.user || data;
}

export async function deleteWorkExperience(
  experienceId: string
): Promise<UserProfile> {
  const { data } = await apiClient.delete(
    `/profile/work-experience/${experienceId}`
  );
  return data.user || data;
}

export async function addEducation(
  payload: AddEducationPayload
): Promise<UserProfile> {
  const { data } = await apiClient.put("/profile/education-history", payload);
  return data.user || data;
}

export async function updateEducation(
  payload: UpdateEducationPayload
): Promise<UserProfile> {
  const { data } = await apiClient.put(
    `/profile/education-history/${payload._id}`,
    payload
  );
  return data.user || data;
}

export async function deleteEducation(
  educationId: string
): Promise<UserProfile> {
  const { data } = await apiClient.delete(
    `/profile/education-history/${educationId}`
  );
  return data.user || data;
}

export async function uploadProfilePhoto(
  payload: UploadPhotoPayload
): Promise<UserProfile> {
  const formData = new FormData();
  formData.append("photo", payload.photo);

  const { data } = await apiClient.put("/profile", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data.user || data;
}

export const deleteSkill = async (payload: DeleteSkillPayload) => {
  const response = await apiClient.delete("/profile/skills", {
    data: payload,
  });
  return response.data;
};
