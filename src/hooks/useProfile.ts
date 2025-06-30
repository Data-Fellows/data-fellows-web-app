import {
  addEducation,
  addWorkExperience,
  deleteEducation,
  deleteSkill,
  deleteWorkExperience, // Add this import
  getProfile,
  updateEducation,
  updateProfile,
  updateSkills,
  updateWorkExperience,
  uploadProfilePhoto,
  type AddEducationPayload,
  type AddWorkExperiencePayload,
  type DeleteSkillPayload,
  type UpdateEducationPayload,
  type UpdateProfilePayload,
  type UpdateSkillsPayload,
  type UpdateWorkExperiencePayload,
  type UploadPhotoPayload,
  type UserProfile,
} from "@/api/profile";
import { useToast } from "@/context/ToastContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useProfile = () => {
  return useQuery<UserProfile>({
    queryKey: ["profile"],
    queryFn: getProfile,
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: true,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (response) => {
      // Handle different response structures
      const updatedProfile = response?.user || response?.data || response;
      queryClient.setQueryData(["profile"], updatedProfile);
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      // Don't show toast here - let the component handle it
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Failed to update profile";
      showToast(message, "error");
    },
  });
};

// Update skills mutation
export const useUpdateSkills = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: updateSkills,
    onSuccess: (response) => {
      const updatedProfile = response?.user || response?.data || response;
      queryClient.setQueryData(["profile"], updatedProfile);
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      // Don't show toast here - let the component handle it
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Failed to update skills";
      showToast(message, "error");
    },
  });
};

// Delete skill mutation
export const useDeleteSkill = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: deleteSkill,
    onSuccess: (response) => {
      const updatedProfile = response?.user || response?.data || response;
      queryClient.setQueryData(["profile"], updatedProfile);
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      // Don't show toast here - let the component handle it
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Failed to delete skill";
      showToast(message, "error");
    },
  });
};

// Upload photo mutation
export const useUploadPhoto = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: uploadProfilePhoto,
    onSuccess: (response) => {
      const updatedProfile = response?.user || response?.data || response;
      queryClient.setQueryData(["profile"], updatedProfile);
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      showToast("Profile photo updated successfully!", "success");
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Failed to upload photo";
      showToast(message, "error");
    },
  });
};

// Work Experience mutations
export const useAddWorkExperience = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: addWorkExperience,
    onSuccess: (response) => {
      const updatedProfile = response?.user || response?.data || response;
      queryClient.setQueryData(["profile"], updatedProfile);
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      // Don't show toast here - let the component handle it
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Failed to add work experience";
      showToast(message, "error");
    },
  });
};

export const useUpdateWorkExperience = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: updateWorkExperience,
    onSuccess: (response) => {
      const updatedProfile = response?.user || response?.data || response;
      queryClient.setQueryData(["profile"], updatedProfile);
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      // Don't show toast here - let the component handle it
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Failed to update work experience";
      showToast(message, "error");
    },
  });
};

export const useDeleteWorkExperience = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: deleteWorkExperience,
    onSuccess: (response) => {
      const updatedProfile = response?.user || response?.data || response;
      queryClient.setQueryData(["profile"], updatedProfile);
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      // Don't show toast here - let the component handle it
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Failed to delete work experience";
      showToast(message, "error");
    },
  });
};

// Education mutations
export const useAddEducation = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: addEducation,
    onSuccess: (response) => {
      const updatedProfile = response?.user || response?.data || response;
      queryClient.setQueryData(["profile"], updatedProfile);
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      // Don't show toast here - let the component handle it
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Failed to add education";
      showToast(message, "error");
    },
  });
};

export const useUpdateEducation = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: updateEducation,
    onSuccess: (response) => {
      const updatedProfile = response?.user || response?.data || response;
      queryClient.setQueryData(["profile"], updatedProfile);
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      // Don't show toast here - let the component handle it
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Failed to update education";
      showToast(message, "error");
    },
  });
};

export const useDeleteEducation = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: deleteEducation,
    onSuccess: (response) => {
      const updatedProfile = response?.user || response?.data || response;
      queryClient.setQueryData(["profile"], updatedProfile);
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      // Don't show toast here - let the component handle it
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Failed to delete education";
      showToast(message, "error");
    },
  });
};

// Combined hook for all profile operations
export const useProfileData = () => {
  const profile = useProfile();

  const updateProfileMutation = useUpdateProfile();
  const updateSkillsMutation = useUpdateSkills();
  const deleteSkillMutation = useDeleteSkill();
  const uploadPhotoMutation = useUploadPhoto();

  const addWorkExperienceMutation = useAddWorkExperience();
  const updateWorkExperienceMutation = useUpdateWorkExperience();
  const deleteWorkExperienceMutation = useDeleteWorkExperience();

  const addEducationMutation = useAddEducation();
  const updateEducationMutation = useUpdateEducation();
  const deleteEducationMutation = useDeleteEducation();

  const handleUpdateProfile = async (data: UpdateProfilePayload) => {
    return updateProfileMutation.mutateAsync(data);
  };

  const handleUpdateSkills = async (data: UpdateSkillsPayload) => {
    return updateSkillsMutation.mutateAsync(data);
  };

  const handleDeleteSkill = async (data: DeleteSkillPayload) => {
    return deleteSkillMutation.mutateAsync(data);
  };

  const handleUploadPhoto = (data: UploadPhotoPayload) => {
    uploadPhotoMutation.mutate(data);
  };

  const handleAddWorkExperience = async (data: AddWorkExperiencePayload) => {
    return addWorkExperienceMutation.mutateAsync(data);
  };

  const handleUpdateWorkExperience = async (
    data: UpdateWorkExperiencePayload
  ) => {
    return updateWorkExperienceMutation.mutateAsync(data);
  };

  const handleDeleteWorkExperience = async (experienceId: string) => {
    return deleteWorkExperienceMutation.mutateAsync(experienceId);
  };

  const handleAddEducation = async (data: AddEducationPayload) => {
    return addEducationMutation.mutateAsync(data);
  };

  const handleUpdateEducation = async (data: UpdateEducationPayload) => {
    return updateEducationMutation.mutateAsync(data);
  };

  const handleDeleteEducation = async (educationId: string) => {
    return deleteEducationMutation.mutateAsync(educationId);
  };

  return {
    profile: profile.data,
    isLoading: profile.isLoading,
    error: profile.error,
    refetch: profile.refetch,

    // Action handlers
    handleUpdateProfile,
    handleUpdateSkills,
    handleDeleteSkill,
    handleUploadPhoto,
    handleAddWorkExperience,
    handleUpdateWorkExperience,
    handleDeleteWorkExperience,
    handleAddEducation,
    handleUpdateEducation,
    handleDeleteEducation,

    // Loading states
    isUpdatingProfile: updateProfileMutation.isPending,
    isUpdatingSkills: updateSkillsMutation.isPending,
    isDeletingSkill: deleteSkillMutation.isPending,
    isUploadingPhoto: uploadPhotoMutation.isPending,
    isAddingWorkExperience: addWorkExperienceMutation.isPending,
    isUpdatingWorkExperience: updateWorkExperienceMutation.isPending,
    isDeletingWorkExperience: deleteWorkExperienceMutation.isPending,
    isAddingEducation: addEducationMutation.isPending,
    isUpdatingEducation: updateEducationMutation.isPending,
    isDeletingEducation: deleteEducationMutation.isPending,
  };
};
