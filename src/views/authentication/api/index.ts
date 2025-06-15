import apiClient from "@/api";

interface SignInPayload {
  email: string;
  password: string;
}

interface SignInResponse {
  token: string;
  user: {
    id: string;
    email: string;
    // Add other user fields as needed
  };
  message?: string;
}

export async function signInApi(
  payload: SignInPayload
): Promise<SignInResponse> {
  const { data } = await apiClient.post("/auth/login", payload);
  return data;
}
