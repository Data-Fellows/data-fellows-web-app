import { useToast } from "@/context/ToastContext";
import { getEmployerOnboardingProgress, getUser, setUser } from "@/helpers";
import { Dialog } from "@headlessui/react";
import { useMutation } from "@tanstack/react-query";
import { City, Country, State } from "country-state-city";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import Cropper from "react-easy-crop";
import {
  FiBriefcase,
  FiCalendar,
  FiGlobe,
  FiHome,
  FiMapPin,
  FiUpload,
  FiUsers,
} from "react-icons/fi";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { addCompanyDetailsApi, AddCompanyDetailsPayload } from "../../api";

interface CompanySetupProps {
  setPage: (page: number) => void;
}

// Helper functions for image cropping
function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = document.createElement("img");
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.src = url;
  });
}

async function getCroppedImg(
  imageSrc: string,
  pixelCrop: any
): Promise<string> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get canvas context");
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );
  return canvas.toDataURL("image/png");
}

export default function CompanySetup({ setPage }: CompanySetupProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const user = getUser();
  const progress = getEmployerOnboardingProgress(user);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    companyName: "",
    companyAbout: "",
    companyType: "",
    companyCreatedAt: "",
    noOfEmployees: "",
    companyPhone: "",
    companyAddress: "",
    companyCountry: "Nigeria", // Default to Nigeria
    companyState: "",
    companyCity: "",
  });

  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [isCropping, setIsCropping] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Dynamic location data
  const [countries, setCountries] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);

  // Load countries on mount
  useEffect(() => {
    const allCountries = Country.getAllCountries();
    setCountries(allCountries);
  }, []);

  // Load states when country changes
  useEffect(() => {
    if (formData.companyCountry) {
      const selectedCountry = countries.find(
        (country) => country.name === formData.companyCountry
      );
      if (selectedCountry) {
        const countryStates = State.getStatesOfCountry(selectedCountry.isoCode);
        setStates(countryStates);
        // Reset state and city when country changes
        setFormData((prev) => ({ ...prev, companyState: "", companyCity: "" }));
        setCities([]);
      }
    }
  }, [formData.companyCountry, countries]);

  // Load cities when state changes
  useEffect(() => {
    if (formData.companyState && formData.companyCountry) {
      const selectedCountry = countries.find(
        (country) => country.name === formData.companyCountry
      );
      const selectedState = states.find(
        (state) => state.name === formData.companyState
      );
      if (selectedCountry && selectedState) {
        const stateCities = City.getCitiesOfState(
          selectedCountry.isoCode,
          selectedState.isoCode
        );
        setCities(stateCities);
        // Reset city when state changes
        setFormData((prev) => ({ ...prev, companyCity: "" }));
      }
    }
  }, [formData.companyState, formData.companyCountry, countries, states]);

  const { mutate: updateCompany, isPending } = useMutation({
    mutationFn: addCompanyDetailsApi,
    onSuccess: (data) => {
      if (data.user) {
        setUser(data.user);
      }
      showToast("Company information saved successfully!", "success");
      setShowSuccessModal(true);
    },
    onError: (error: any) => {
      console.error("Company setup error:", error);
      const errorMessage =
        error?.response?.data?.message ||
        "Failed to save company information. Please try again.";
      setError(errorMessage);
      showToast(errorMessage, "error");
    },
  });

  const handleInputChange = useCallback((field: string, value: string) => {
    setError(null); // Clear errors when user makes changes
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handlePhotoChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Validate file type and size
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!allowedTypes.includes(file.type)) {
        showToast("Only JPG, JPEG, and PNG files are allowed.", "error");
        return;
      }

      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        showToast("File is too large. Maximum size is 5MB.", "error");
        return;
      }

      setPhotoFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (typeof ev.target?.result === "string") {
          setImgSrc(ev.target.result);
          setCropModalOpen(true);
          setIsCropping(true);
        }
      };
      reader.readAsDataURL(file);
    },
    [showToast]
  );

  const handleCropChange = useCallback((c: { x: number; y: number }) => {
    setCrop(c);
  }, []);

  const handleZoomChange = useCallback((z: number) => {
    setZoom(z);
  }, []);

  const handleCropComplete = useCallback((_: any, croppedPixels: any) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleCropConfirm = useCallback(async () => {
    if (!imgSrc || !croppedAreaPixels) return;
    const cropped = await getCroppedImg(imgSrc, croppedAreaPixels);
    setPhotoPreview(cropped);
    setIsCropping(false);
    setImgSrc(null);
    setCropModalOpen(false);
  }, [imgSrc, croppedAreaPixels]);

  const handleCropCancel = useCallback(() => {
    setIsCropping(false);
    setImgSrc(null);
    setPhotoFile(null);
    setCropModalOpen(false);
  }, []);

  // Helper function to convert cropped image to File
  const dataURLtoFile = useCallback(
    async (dataURL: string, filename: string): Promise<File> => {
      return new Promise((resolve) => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();

        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx?.drawImage(img, 0, 0);

          canvas.toBlob((blob) => {
            if (blob) {
              const file = new File([blob], filename, { type: "image/png" });
              resolve(file);
            }
          }, "image/png");
        };

        img.src = dataURL;
      });
    },
    []
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      // Validate required fields
      if (
        !formData.companyName ||
        !formData.companyAbout ||
        !formData.companyType ||
        !formData.noOfEmployees ||
        !formData.companyPhone ||
        !formData.companyAddress ||
        !formData.companyCountry ||
        !formData.companyState ||
        !formData.companyCity
      ) {
        setError("Please fill in all required fields.");
        return;
      }

      if (!photoFile && !photoPreview) {
        setError("Please upload a company logo.");
        return;
      }

      try {
        // Prepare photo file
        let photoFileToUpload: File | undefined;
        if (photoPreview && photoFile) {
          if (photoPreview.startsWith("data:")) {
            // If it's a cropped image (base64), convert to File
            photoFileToUpload = await dataURLtoFile(
              photoPreview,
              `company_logo_${Date.now()}.png`
            );
          } else {
            // Use original file
            photoFileToUpload = photoFile;
          }
        }

        // Create payload for API
        const payload: AddCompanyDetailsPayload = {
          companyName: formData.companyName,
          companyAbout: formData.companyAbout,
          companyType: formData.companyType,
          noOfEmployees: convertCompanySizeToNumber(formData.noOfEmployees),
          companyPhone: formData.companyPhone,
          companyAddress: formData.companyAddress,
          companyCountry: formData.companyCountry,
          companyState: formData.companyState,
          companyCity: formData.companyCity,
          photo: photoFileToUpload,
        };

        // Add created date if provided
        if (formData.companyCreatedAt) {
          payload.companyCreatedAt = formData.companyCreatedAt;
        }

        updateCompany(payload);
      } catch (err) {
        console.error("Error preparing company data:", err);
        setError("Failed to prepare company information. Please try again.");
      }
    },
    [formData, photoFile, photoPreview, updateCompany, dataURLtoFile]
  );

  const companyTypes = [
    { label: "Private Enterprise", value: "private" },
    { label: "Non-profit Organization", value: "ngo" },
    { label: "Government Organization", value: "public" },
    { label: "Corporate Organization", value: "corporate" },
  ];

  const companySizeOptions = [
    "1-10",
    "11-50",
    "51-200",
    "201-500",
    "501-1000",
    "1000+",
  ];

  // Helper function to convert company size range to number for backend
  const convertCompanySizeToNumber = (sizeRange: string): number => {
    switch (sizeRange) {
      case "1-10":
        return 10;
      case "11-50":
        return 50;
      case "51-200":
        return 200;
      case "201-500":
        return 500;
      case "501-1000":
        return 1000;
      case "1000+":
        return 1001;
      default:
        return 0;
    }
  };

  return (
    <>
      <style jsx global>{`
        .phone-input-wrapper .react-tel-input {
          width: 100%;
          border-radius: 12px;
          overflow: hidden;
        }

        .phone-input-wrapper .react-tel-input .form-control {
          height: 48px !important;
          width: 100% !important;
          font-size: 16px !important;
          padding-left: 60px !important;
          background-color: hsl(var(--background)) !important;
          border: 1px solid hsl(var(--border)) !important;
          border-radius: 0 12px 12px 0 !important;
          border-left: none !important;
          color: hsl(var(--foreground)) !important;
          transition: all 0.2s ease !important;
        }

        .phone-input-wrapper .react-tel-input .form-control:focus {
          border-color: hsl(var(--primary)) !important;
          box-shadow: 0 0 0 2px hsl(var(--primary) / 0.2) !important;
          outline: none !important;
        }

        .phone-input-wrapper .react-tel-input .flag-dropdown {
          background-color: hsl(var(--background)) !important;
          border: 1px solid hsl(var(--border)) !important;
          border-radius: 12px 0 0 12px !important;
          height: 48px !important;
          border-right: none !important;
        }

        .phone-input-wrapper .react-tel-input .flag-dropdown:hover {
          background-color: hsl(var(--muted)) !important;
        }

        .phone-input-wrapper .react-tel-input .country-list {
          background-color: hsl(var(--background)) !important;
          color: hsl(var(--foreground)) !important;
          border: 1px solid hsl(var(--border)) !important;
          border-radius: 8px !important;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1) !important;
        }

        .phone-input-wrapper .react-tel-input .country-list .country {
          color: hsl(var(--foreground)) !important;
        }

        .phone-input-wrapper .react-tel-input .country-list .country:hover {
          background-color: hsl(var(--muted)) !important;
        }

        .phone-input-wrapper .react-tel-input .country-list .country.highlight {
          background-color: hsl(var(--primary)) !important;
          color: hsl(var(--primary-foreground)) !important;
        }

        .phone-input-wrapper .react-tel-input .selected-flag {
          padding: 0 12px !important;
        }
      `}</style>

      <div className="flex flex-col items-center justify-center w-full min-h-screen bg-background py-6 px-4">
        <div className="w-full bg-card rounded-xl shadow-lg flex flex-col lg:flex-row items-stretch justify-between overflow-hidden h-[80vh] max-w-6xl">
          {/* Left side - Form content */}
          <div className="flex-1 lg:w-[70%] flex flex-col">
            {/* Header section */}
            <div className="px-6 lg:px-8 py-6 border-b border-border/10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm text-muted-foreground font-medium">
                  Step 2 of 2
                </h2>
                <div className="flex gap-2">
                  <div className="w-8 h-2 bg-primary rounded-full"></div>
                  <div className="w-8 h-2 bg-primary rounded-full"></div>
                </div>
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold mb-3 text-foreground">
                Company Services
              </h1>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Tell us about your company to help us match you with the right
                talent. Complete your profile to start finding qualified
                candidates.
              </p>
            </div>

            {/* Form content - Scrollable */}
            <div className="flex-1 overflow-y-auto scrollbar-hide px-6 lg:px-8 py-6">
              <form
                id="company-form"
                onSubmit={handleSubmit}
                className="space-y-8"
              >
                {/* Company Logo Upload */}
                <div className="flex justify-center mb-8">
                  <div className="relative">
                    {photoPreview ? (
                      <div className="relative h-32 w-32 lg:h-40 lg:w-40">
                        <img
                          src={photoPreview}
                          alt="Company logo"
                          className="h-full w-full rounded-full object-cover border-4 border-primary/20 shadow-lg"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setPhotoPreview(null);
                            setPhotoFile(null);
                          }}
                          className="absolute -bottom-2 -right-2 rounded-full bg-white dark:bg-zinc-800 p-2.5 shadow-lg hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors border border-border"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-gray-600 dark:text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                            />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <label className="flex h-32 w-32 lg:h-40 lg:w-40 cursor-pointer flex-col items-center justify-center rounded-full border-2 border-dashed border-primary/40 hover:border-primary/60 transition-all duration-200 bg-primary/5 hover:bg-primary/10">
                        <div className="flex flex-col items-center gap-2">
                          <div className="p-3 rounded-full bg-primary/10">
                            <FiUpload className="w-6 h-6 text-primary" />
                          </div>
                          <div className="text-center">
                            <span className="text-sm font-medium text-primary">
                              Upload Logo
                            </span>
                            <p className="text-xs text-muted-foreground mt-1">
                              PNG, JPG up to 5MB
                            </p>
                          </div>
                        </div>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/jpeg,image/png,image/jpg"
                          className="hidden"
                          onChange={handlePhotoChange}
                        />
                      </label>
                    )}
                  </div>
                </div>

                {/* Cropper Modal */}
                <Dialog open={cropModalOpen} onClose={handleCropCancel}>
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
                    <Dialog.Panel className="bg-white dark:bg-zinc-900 rounded-lg p-6 max-w-md w-full mx-4">
                      <h3 className="text-lg font-semibold mb-4 text-foreground">
                        Crop your company logo
                      </h3>
                      <div className="relative w-full h-64 bg-gray-100 dark:bg-zinc-800 rounded-lg overflow-hidden mb-4">
                        {imgSrc && (
                          <Cropper
                            image={imgSrc}
                            crop={crop}
                            zoom={zoom}
                            aspect={1}
                            cropShape="round"
                            showGrid={false}
                            onCropChange={handleCropChange}
                            onCropComplete={handleCropComplete}
                            onZoomChange={handleZoomChange}
                          />
                        )}
                      </div>
                      <div className="flex gap-2 justify-end">
                        <button
                          type="button"
                          className="px-4 py-2 rounded bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                          onClick={handleCropConfirm}
                        >
                          Apply Crop
                        </button>
                        <button
                          type="button"
                          className="px-4 py-2 rounded bg-gray-200 dark:bg-zinc-700 dark:text-white hover:bg-gray-300 dark:hover:bg-zinc-600 transition-colors"
                          onClick={handleCropCancel}
                        >
                          Cancel
                        </button>
                      </div>
                    </Dialog.Panel>
                  </div>
                </Dialog>

                {/* Form Fields Grid */}
                <div className="grid gap-6">
                  {/* Company Name */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                      <FiHome className="w-4 h-4 text-primary" />
                      Company Name
                      <span className="inline-flex items-center justify-center w-4 h-4 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-full text-xs font-bold">
                        !
                      </span>
                    </label>
                    <input
                      type="text"
                      value={formData.companyName}
                      onChange={(e) =>
                        handleInputChange("companyName", e.target.value)
                      }
                      className="h-12 border border-border rounded-xl px-4 py-3 w-full text-base bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                      placeholder="Enter your company name"
                      disabled={isPending}
                      required
                    />
                  </div>

                  {/* Company Type & Number of Employees */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                        <FiBriefcase className="w-4 h-4 text-primary" />
                        Company Type
                        <span className="inline-flex items-center justify-center w-4 h-4 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-full text-xs font-bold">
                          !
                        </span>
                      </label>
                      <select
                        value={formData.companyType}
                        onChange={(e) =>
                          handleInputChange("companyType", e.target.value)
                        }
                        className="h-12 border border-border rounded-xl px-4 py-3 w-full text-base bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                        disabled={isPending}
                        required
                      >
                        <option value="">Select company type</option>
                        {companyTypes.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                        <FiUsers className="w-4 h-4 text-primary" />
                        Number of Employees
                        <span className="inline-flex items-center justify-center w-4 h-4 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-full text-xs font-bold">
                          !
                        </span>
                      </label>
                      <select
                        value={formData.noOfEmployees}
                        onChange={(e) =>
                          handleInputChange("noOfEmployees", e.target.value)
                        }
                        className="h-12 border border-border rounded-xl px-4 py-3 w-full text-base bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                        disabled={isPending}
                        required
                      >
                        <option value="">Select size range</option>
                        {companySizeOptions.map((size) => (
                          <option key={size} value={size}>
                            {size} employees
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Location Fields */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                        <FiGlobe className="w-4 h-4 text-primary" />
                        Country
                        <span className="inline-flex items-center justify-center w-4 h-4 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-full text-xs font-bold">
                          !
                        </span>
                      </label>
                      <select
                        value={formData.companyCountry}
                        onChange={(e) =>
                          handleInputChange("companyCountry", e.target.value)
                        }
                        className="h-12 border border-border rounded-xl px-4 py-3 w-full text-base bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                        disabled={isPending}
                        required
                      >
                        <option value="">Select country</option>
                        {countries.map((country) => (
                          <option key={country.isoCode} value={country.name}>
                            {country.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                        <FiMapPin className="w-4 h-4 text-primary" />
                        State/Province
                        <span className="inline-flex items-center justify-center w-4 h-4 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-full text-xs font-bold">
                          !
                        </span>
                      </label>
                      <select
                        value={formData.companyState}
                        onChange={(e) =>
                          handleInputChange("companyState", e.target.value)
                        }
                        className="h-12 border border-border rounded-xl px-4 py-3 w-full text-base bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 disabled:opacity-50"
                        disabled={isPending || !formData.companyCountry}
                        required
                      >
                        <option value="">
                          {!formData.companyCountry
                            ? "Select country first"
                            : "Select state"}
                        </option>
                        {states.map((state) => (
                          <option key={state.isoCode} value={state.name}>
                            {state.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                        <FiMapPin className="w-4 h-4 text-primary" />
                        City
                        <span className="inline-flex items-center justify-center w-4 h-4 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-full text-xs font-bold">
                          !
                        </span>
                      </label>
                      <select
                        value={formData.companyCity}
                        onChange={(e) =>
                          handleInputChange("companyCity", e.target.value)
                        }
                        className="h-12 border border-border rounded-xl px-4 py-3 w-full text-base bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 disabled:opacity-50"
                        disabled={isPending || !formData.companyState}
                        required
                      >
                        <option value="">
                          {!formData.companyState
                            ? "Select state first"
                            : "Select city"}
                        </option>
                        {cities.map((city) => (
                          <option key={city.name} value={city.name}>
                            {city.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                        <FiMapPin className="w-4 h-4 text-primary" />
                        Company Address
                        <span className="inline-flex items-center justify-center w-4 h-4 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-full text-xs font-bold">
                          !
                        </span>
                      </label>
                      <input
                        type="text"
                        value={formData.companyAddress}
                        onChange={(e) =>
                          handleInputChange("companyAddress", e.target.value)
                        }
                        className="h-12 border border-border rounded-xl px-4 py-3 w-full text-base bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                        placeholder="Enter company address"
                        disabled={isPending}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                        <FiCalendar className="w-4 h-4 text-primary" />
                        Founded Date
                        <span className="text-xs text-muted-foreground font-normal">
                          (Optional)
                        </span>
                      </label>
                      <input
                        type="date"
                        value={formData.companyCreatedAt}
                        onChange={(e) =>
                          handleInputChange("companyCreatedAt", e.target.value)
                        }
                        className="h-12 border border-border rounded-xl px-4 py-3 w-full text-base bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                        disabled={isPending}
                      />
                    </div>
                  </div>

                  {/* Phone Number - Full Width */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                      <svg
                        className="w-4 h-4 text-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                      Phone Number
                      <span className="inline-flex items-center justify-center w-4 h-4 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-full text-xs font-bold">
                        !
                      </span>
                    </label>
                    <div className="phone-input-wrapper">
                      <PhoneInput
                        country={
                          formData.companyCountry === "Nigeria"
                            ? "ng"
                            : formData.companyCountry === "United States"
                            ? "us"
                            : formData.companyCountry === "United Kingdom"
                            ? "gb"
                            : formData.companyCountry === "Canada"
                            ? "ca"
                            : "ng"
                        }
                        value={formData.companyPhone}
                        inputClass="!h-12 !border !border-border !rounded-lg !px-3 !py-2 !w-full !text-base !bg-background dark:!bg-zinc-900 dark:!text-foreground !pl-16"
                        onChange={(phone) => {
                          setError(null);
                          handleInputChange("companyPhone", phone);
                        }}
                        disabled={isPending}
                      />
                    </div>
                  </div>

                  {/* Company About - Full Width */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                      <svg
                        className="w-4 h-4 text-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      About Company
                      <span className="inline-flex items-center justify-center w-4 h-4 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-full text-xs font-bold">
                        !
                      </span>
                    </label>
                    <textarea
                      value={formData.companyAbout}
                      onChange={(e) =>
                        handleInputChange("companyAbout", e.target.value)
                      }
                      className="border border-border rounded-xl px-4 py-3 w-full text-base bg-background text-foreground placeholder:text-muted-foreground resize-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 min-h-[120px]"
                      placeholder="Tell us about your company, mission, and culture..."
                      disabled={isPending}
                      maxLength={2000}
                      required
                    />
                    <div className="flex justify-end">
                      <span className="text-sm text-muted-foreground">
                        {formData.companyAbout.length}/2000 characters
                      </span>
                    </div>
                  </div>

                  {/* Error Display */}
                  {error && (
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                      <p className="text-sm font-medium text-red-600 dark:text-red-400">
                        {error}
                      </p>
                    </div>
                  )}
                </div>
              </form>
            </div>

            {/* Footer with buttons */}
            <div className="border-t border-border/10 px-6 lg:px-8 py-6">
              <div className="flex justify-center">
                <button
                  type="submit"
                  form="company-form"
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground px-8 py-3 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transform hover:scale-[1.02]"
                  disabled={isPending}
                >
                  {isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground"></div>
                      Setting up...
                    </>
                  ) : (
                    <>
                      Continue to BizPilot
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right side - Info panel */}
          <div className="hidden lg:flex lg:w-[30%] bg-gradient-to-br from-primary/5 to-primary/10 items-center justify-center p-8">
            <div className="text-center max-w-sm">
              <div className="relative mb-6">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-lg">
                  <FiBriefcase className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-3 h-3 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>

              <h3 className="text-xl font-bold text-foreground mb-3">
                Build Your Dream Team
              </h3>

              <p className="text-muted-foreground leading-relaxed mb-6">
                A complete company profile helps attract the best talent and
                builds trust with potential candidates.
              </p>

              <div className="space-y-3 text-left">
                <div className="flex items-center gap-3 p-3 bg-white/50 dark:bg-zinc-900/50 rounded-lg">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    Professional presence
                  </span>
                </div>

                <div className="flex items-center gap-3 p-3 bg-white/50 dark:bg-zinc-900/50 rounded-lg">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    Faster hiring process
                  </span>
                </div>

                <div className="flex items-center gap-3 p-3 bg-white/50 dark:bg-zinc-900/50 rounded-lg">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    Quality candidates
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Success Modal */}
        <Dialog open={showSuccessModal} onClose={() => {}}>
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <Dialog.Panel className="bg-white dark:bg-zinc-900 rounded-xl shadow-2xl w-full max-w-md p-6">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/20 mb-4">
                  <svg
                    className="h-8 w-8 text-green-600 dark:text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <Dialog.Title className="text-xl font-semibold text-foreground mb-2">
                  Company Services Complete! 🎉
                </Dialog.Title>
                <p className="text-muted-foreground mb-6">
                  Great! Your company profile is now set up. Next, let's connect
                  you with BizPilot, our AI business consultant who will help
                  identify opportunities and solutions for your business.
                </p>
                <button
                  onClick={() => {
                    setShowSuccessModal(false);
                    setPage(1); // Move to next step (BizPilot)
                  }}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-6 py-3 font-semibold transition"
                >
                  Continue to BizPilot
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      </div>
    </>
  );
}
