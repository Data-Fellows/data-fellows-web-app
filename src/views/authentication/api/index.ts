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

export async function signInApi(
  payload: SignInPayload
): Promise<SignInResponse> {
  const { data } = await apiClient.post("/auth/login", payload);
  return data;
}
