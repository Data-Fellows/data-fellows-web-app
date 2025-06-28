import {
  addEducation,
  addWorkExperience,
  deleteEducation,
  deleteWorkExperience,
  getProfile,
  updateEducation,
  updateProfile,
  updateSkills,
  updateWorkExperience,
  uploadProfilePhoto,
  type AddEducationPayload,
  type AddWorkExperiencePayload,
  type UpdateEducationPayload,
  type UpdateProfilePayload,
  type UpdateSkillsPayload,
  type UpdateWorkExperiencePayload,
  type UploadPhotoPayload,
  type UserProfile,
} from "@/api/profile";
import { useToast } from "@/context/ToastContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Profile query
export const useProfile = () => {
  return useQuery<UserProfile>({
    queryKey: ["profile"],
    queryFn: getProfile,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: true,
  });
};

// Update profile mutation
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(["profile"], updatedProfile);
      queryClient.invalidateQueries({ queryKey: ["dashboard"] }); // Refresh dashboard data
      showToast("Profile updated successfully!", "success");
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
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(["profile"], updatedProfile);
      queryClient.invalidateQueries({ queryKey: ["dashboard"] }); // Refresh dashboard data
      showToast("Skills updated successfully!", "success");
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Failed to update skills";
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
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(["profile"], updatedProfile);
      queryClient.invalidateQueries({ queryKey: ["dashboard"] }); // Refresh dashboard data
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
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(["profile"], updatedProfile);
      queryClient.invalidateQueries({ queryKey: ["dashboard"] }); // Refresh dashboard data
      showToast("Work experience added successfully!", "success");
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
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(["profile"], updatedProfile);
      queryClient.invalidateQueries({ queryKey: ["dashboard"] }); // Refresh dashboard data
      showToast("Work experience updated successfully!", "success");
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
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(["profile"], updatedProfile);
      queryClient.invalidateQueries({ queryKey: ["dashboard"] }); // Refresh dashboard data
      showToast("Work experience deleted successfully!", "success");
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
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(["profile"], updatedProfile);
      queryClient.invalidateQueries({ queryKey: ["dashboard"] }); // Refresh dashboard data
      showToast("Education added successfully!", "success");
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
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(["profile"], updatedProfile);
      queryClient.invalidateQueries({ queryKey: ["dashboard"] }); // Refresh dashboard data
      showToast("Education updated successfully!", "success");
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
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(["profile"], updatedProfile);
      queryClient.invalidateQueries({ queryKey: ["dashboard"] }); // Refresh dashboard data
      showToast("Education deleted successfully!", "success");
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
  const uploadPhotoMutation = useUploadPhoto();

  const addWorkExperienceMutation = useAddWorkExperience();
  const updateWorkExperienceMutation = useUpdateWorkExperience();
  const deleteWorkExperienceMutation = useDeleteWorkExperience();

  const addEducationMutation = useAddEducation();
  const updateEducationMutation = useUpdateEducation();
  const deleteEducationMutation = useDeleteEducation();

  const handleUpdateProfile = (data: UpdateProfilePayload) => {
    updateProfileMutation.mutate(data);
  };

  const handleUpdateSkills = (data: UpdateSkillsPayload) => {
    updateSkillsMutation.mutate(data);
  };

  const handleUploadPhoto = (data: UploadPhotoPayload) => {
    uploadPhotoMutation.mutate(data);
  };

  const handleAddWorkExperience = (data: AddWorkExperiencePayload) => {
    addWorkExperienceMutation.mutate(data);
  };

  const handleUpdateWorkExperience = (data: UpdateWorkExperiencePayload) => {
    updateWorkExperienceMutation.mutate(data);
  };

  const handleDeleteWorkExperience = (experienceId: string) => {
    deleteWorkExperienceMutation.mutate(experienceId);
  };

  const handleAddEducation = (data: AddEducationPayload) => {
    addEducationMutation.mutate(data);
  };

  const handleUpdateEducation = (data: UpdateEducationPayload) => {
    updateEducationMutation.mutate(data);
  };

  const handleDeleteEducation = (educationId: string) => {
    deleteEducationMutation.mutate(educationId);
  };

  return {
    profile: profile.data,
    isLoading: profile.isLoading,
    error: profile.error,
    refetch: profile.refetch,

    // Action handlers
    handleUpdateProfile,
    handleUpdateSkills,
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
    isUploadingPhoto: uploadPhotoMutation.isPending,
    isAddingWorkExperience: addWorkExperienceMutation.isPending,
    isUpdatingWorkExperience: updateWorkExperienceMutation.isPending,
    isDeletingWorkExperience: deleteWorkExperienceMutation.isPending,
    isAddingEducation: addEducationMutation.isPending,
    isUpdatingEducation: updateEducationMutation.isPending,
    isDeletingEducation: deleteEducationMutation.isPending,
  };
};
