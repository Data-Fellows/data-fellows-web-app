import { getUser } from "@/helpers";

export interface SessionData {
  isLoggedIn: boolean;
  id: string | null;
  user?: any;
}

export async function getSession(): Promise<SessionData> {
  try {
    const user = getUser();

    if (!user || !user.id) {
      return {
        isLoggedIn: false,
        id: null,
        user: null,
      };
    }

    return {
      isLoggedIn: true,
      id: user.id,
      user: user,
    };
  } catch (error) {
    console.error("Error getting session:", error);
    return {
      isLoggedIn: false,
      id: null,
      user: null,
    };
  }
}
