import { getUser } from "@/helpers";
import { useProfile } from "@/hooks/useProfile";
import { useRouter } from "next/router";
import { useEffect, useMemo } from "react";
import { FiLoader } from "react-icons/fi";

// Import profile components
import EmployerProfile from "@/views/dashboard/employer/profile";
import UserProfile from "@/views/dashboard/user/profile/";

// Loading skeleton component
const ProfileSkeleton = () => (
  <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 py-8">
    <div className="max-w-6xl mx-auto px-4">
      <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-700 overflow-hidden">
        <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-600 animate-pulse"></div>
        <div className="px-6 pb-6">
          <div className="flex items-start justify-between -mt-16 mb-6">
            <div className="flex items-end gap-6">
              <div className="w-32 h-32 bg-gray-200 dark:bg-zinc-700 rounded-full border-4 border-white dark:border-zinc-800 animate-pulse"></div>
              <div className="mb-4">
                <div className="h-6 bg-gray-200 dark:bg-zinc-700 rounded w-48 mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 dark:bg-zinc-700 rounded w-32 animate-pulse"></div>
              </div>
            </div>
            <div className="h-10 bg-gray-200 dark:bg-zinc-700 rounded w-24 animate-pulse"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="bg-gray-50 dark:bg-zinc-900 rounded-lg p-6"
                >
                  <div className="h-5 bg-gray-200 dark:bg-zinc-700 rounded w-32 mb-4 animate-pulse"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-zinc-700 rounded w-full animate-pulse"></div>
                    <div className="h-4 bg-gray-200 dark:bg-zinc-700 rounded w-3/4 animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-6">
              {[...Array(2)].map((_, i) => (
                <div
                  key={i}
                  className="bg-gray-50 dark:bg-zinc-900 rounded-lg p-6"
                >
                  <div className="h-5 bg-gray-200 dark:bg-zinc-700 rounded w-24 mb-4 animate-pulse"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-zinc-700 rounded w-full animate-pulse"></div>
                    <div className="h-4 bg-gray-200 dark:bg-zinc-700 rounded w-2/3 animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Error component
const ProfileError = ({
  error,
  onRetry,
}: {
  error: string;
  onRetry: () => void;
}) => (
  <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 py-8">
    <div className="max-w-2xl mx-auto px-4">
      <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-700 p-8 text-center">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <FiLoader className="w-8 h-8 text-red-600 dark:text-red-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Failed to load profile
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {error || "Something went wrong while loading your profile."}
        </p>
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  </div>
);

/**
 * Common Profile Router Component
 *
 * This component determines which profile view to render based on the user's type.
 * It handles loading states, error states, and user authentication.
 */
export default function ProfileRouter() {
  const user = useMemo(() => getUser(), []);
  const router = useRouter();
  const { data: profile, isLoading, error, refetch } = useProfile();

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!user) {
      router.replace("/auth/sign-in");
    }
  }, [user, router]);

  // Show loading skeleton while fetching profile
  if (isLoading || !profile) {
    return <ProfileSkeleton />;
  }

  // Show error state if profile fetch failed
  if (error) {
    return (
      <ProfileError
        error={
          error instanceof Error ? error.message : "Unknown error occurred"
        }
        onRetry={refetch}
      />
    );
  }

  // Render appropriate profile based on user type
  if (profile.userType === "employer") {
    return <EmployerProfile />;
  } else {
    return <UserProfile />;
  }
}
