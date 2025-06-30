import { getProfile } from "@/api/profile";
import { useEffect, useState } from "react";

interface EmployerProfile {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  verified: boolean;
  active: boolean;
  onboarded: boolean;
  photoUrl: string;
  profileCompletion: number;
  userType: string;
  companyDetailsAdded: boolean;
  companyLogo: string;
  comapnyAboutAdded: boolean;
  categoryProblemsAdded: boolean;
  collectBusinessData: boolean;
  businessData: string[];
  dataAnalysisTools: string[];
  challengesFaced: string[];
  expectedOutcome: string[];
  neededSkills: string[];
  categoryProblems: any[];
  companyAbout: string;
  companyAddress: string;
  companyCity: string;
  companyCountry: string;
  companyCreatedAt: string;
  companyName: string;
  companyPhone: string;
  companyState: string;
  companyType: string;
  noOfEmployees: number;
}

export const useEmployerProfile = () => {
  const [profile, setProfile] = useState<EmployerProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const profileData = await getProfile();
        // Cast to unknown first then to EmployerProfile for safer type conversion
        setProfile(profileData as unknown as EmployerProfile);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error fetching profile:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return { profile, isLoading, error };
};
