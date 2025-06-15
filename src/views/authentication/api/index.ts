import apiClient from "@/api";
import { BasicUserData } from "@/helpers";

export interface SignInPayload {
  email: string;
  password: string;
}

export interface SignInResponse {
  status: string;
  message: string;
  token: string;
  user: BasicUserData;
}

export interface SignUpPayload {
  firstName?: string;
  lastName?: string;
  fullName?: string;
  email: string;
  password: string;
  userType: string;
}

export interface SignUpResponse {
  status: string;
  message: string;
  token: string;
  user: any;
}

export interface VerifyEmailPayload {
  email: string;
  otp: string;
}

export interface VerifyEmailResponse {
  status: string;
  message: string;
  token?: string;
  user: BasicUserData;
}

export async function signInApi(
  payload: SignInPayload
): Promise<SignInResponse> {
  const { data } = await apiClient.post("/auth/login", payload);
  return data;
}

export async function signUpApi(
  payload: SignUpPayload
): Promise<SignUpResponse> {
  let body: any = { ...payload };
  if (payload.userType === "employer" && payload.fullName) {
    const [firstName, ...rest] = payload.fullName.trim().split(" ");
    body.firstName = firstName;
    body.lastName = rest.join(" ") || "";
    delete body.fullName;
  }
  const { data } = await apiClient.post("/auth/register", body);
  return data;
}

export async function verifyEmailApi(
  payload: VerifyEmailPayload
): Promise<VerifyEmailResponse> {
  const { data } = await apiClient.post("/auth/verify-email", payload);
  return data;
}
