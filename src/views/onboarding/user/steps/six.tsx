import { useToast } from "@/context/ToastContext";
import { setUser } from "@/helpers";
import { Dialog } from "@headlessui/react";
import { useRouter } from "next/router";
import React from "react";
import Cropper from "react-easy-crop";
import "react-international-phone/style.css";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { addProfileDetailsApi, AddProfileDetailsPayload } from "../../api";

const formSchema = {
  dateOfBirth: { required: true, message: "Date of birth is required" },
  country: { required: true, message: "Country is required" },
  phone: { required: true, message: "Phone number is required" },
  address: { required: true, message: "Address is required" },
  city: { required: true, message: "City is required" },
  stateProvince: { required: false },
};

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const countries = [
  "Nigeria",
  "United States",
  "United Kingdom",
  "Canada",
  "Ghana",
  "Kenya",
  "South Africa",
  "India",
  "Germany",
  "France",
];

// Helper for cropping image
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

const ProfileDetailsPage = ({
  setPage,
}: {
  setPage: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [photoPreview, setPhotoPreview] = React.useState<string | null>(null);
  const [photoFile, setPhotoFile] = React.useState<File | null>(null);
  const [imgSrc, setImgSrc] = React.useState<string | null>(null);
  const [isCropping, setIsCropping] = React.useState(false);
  const [crop, setCrop] = React.useState({ x: 0, y: 0 });
  const [zoom, setZoom] = React.useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = React.useState<any>(null);
  const [cropModalOpen, setCropModalOpen] = React.useState(false);
  const [showSuccessModal, setShowSuccessModal] = React.useState(false);
  const { showToast } = useToast();
  const router = useRouter();

  const [fields, setFields] = React.useState({
    dateOfBirth: { day: "", month: "", year: "" },
    country: "",
    phone: "",
    address: "",
    city: "",
    stateProvince: "",
  });

  function validate() {
    if (
      !fields.dateOfBirth.day ||
      !fields.dateOfBirth.month ||
      !fields.dateOfBirth.year
    ) {
      return formSchema.dateOfBirth.message;
    }
    if (!fields.country) return formSchema.country.message;
    if (!fields.phone) return formSchema.phone.message;
    if (!fields.address) return formSchema.address.message;
    if (!fields.city) return formSchema.city.message;
    return null;
  }

  function handleInputChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setError(null); // Clear errors when user makes changes

    if (name === "day" || name === "month" || name === "year") {
      setFields((prev) => ({
        ...prev,
        dateOfBirth: { ...prev.dateOfBirth, [name]: value },
      }));
    } else {
      setFields((prev) => ({ ...prev, [name]: value }));
    }
  }

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
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
  }

  function handleCropChange(c: { x: number; y: number }) {
    setCrop(c);
  }
  function handleZoomChange(z: number) {
    setZoom(z);
  }
  function handleCropComplete(_: any, croppedPixels: any) {
    setCroppedAreaPixels(croppedPixels);
  }
  async function handleCropConfirm() {
    if (!imgSrc || !croppedAreaPixels) return;
    const cropped = await getCroppedImg(imgSrc, croppedAreaPixels);
    setPhotoPreview(cropped);
    setIsCropping(false);
    setImgSrc(null);
    setCropModalOpen(false);
  }
  function handleCropCancel() {
    setIsCropping(false);
    setImgSrc(null);
    setPhotoFile(null);
    setCropModalOpen(false);
  }

  // Helper function to convert cropped image to File
  async function dataURLtoFile(
    dataURL: string,
    filename: string
  ): Promise<File> {
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
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const err = validate();
    if (err) {
      setError(err);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Format date as YYYY-MM-DD
      const dateOfBirth = `${fields.dateOfBirth.year}-${String(
        months.indexOf(fields.dateOfBirth.month) + 1
      ).padStart(2, "0")}-${String(fields.dateOfBirth.day).padStart(2, "0")}`;

      // Prepare photo file
      let photoFileToUpload: File | undefined;
      if (photoPreview && photoFile) {
        if (photoPreview.startsWith("data:")) {
          // If it's a cropped image (base64), convert to File
          photoFileToUpload = await dataURLtoFile(
            photoPreview,
            `profile_photo_${Date.now()}.png`
          );
        } else {
          // Use original file
          photoFileToUpload = photoFile;
        }
      }

      // Create API payload
      const payload: AddProfileDetailsPayload = {
        dateOfBirth,
        phone: fields.phone,
        address: fields.address,
        city: fields.city,
        state: fields.stateProvince,
        country: fields.country,
        photo: photoFileToUpload,
      };

      const response = await addProfileDetailsApi(payload);

      if (response.user) {
        setUser(response.user);
      }

      showToast("Profile completed successfully!", "success");

      setShowSuccessModal(true);
    } catch (err: any) {
      console.error("Error completing profile:", err);
      const errorMessage =
        err?.response?.data?.message ||
        "Failed to complete profile. Please try again.";
      setError(errorMessage);
      showToast(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen bg-background py-6 px-2">
      <div
        className="w-full bg-card rounded-xl shadow-lg flex flex-col md:flex-row items-center md:items-stretch justify-center md:justify-between gap-8 md:gap-0"
        style={{ maxWidth: "1200px", minHeight: "70vh" }}
      >
        <div className="w-full md:w-[70%] px-2 sm:px-8 py-6 md:py-10 flex flex-col justify-center">
          <h2 className="text-md mb-4 text-border font-semibold">6/6</h2>
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">
            Final Details to Complete Your Profile
          </h2>
          <p className="text-muted-foreground mb-6 text-base">
            A professional photo and accurate details help build trust with
            business owners and ensure a smooth, secure process. You’ll be ready
            to apply for jobs once submitted!
          </p>
          <div className="border-t border-border pt-6 mb-4"></div>
          <form onSubmit={onSubmit} className="space-y-6 w-full">
            {/* Photo section */}
            <div className="flex w-full justify-center">
              <div className="relative h-40 w-40 sm:h-48 sm:w-48">
                {photoPreview ? (
                  <div className="relative h-full w-full">
                    <img
                      src={photoPreview}
                      alt="User avatar"
                      className="h-full w-full rounded-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setPhotoPreview(null);
                        setPhotoFile(null);
                      }}
                      className="absolute bottom-2 right-2 rounded-full bg-white p-2 shadow-md"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-600"
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
                  <label className="flex h-full w-full cursor-pointer flex-col items-center justify-center rounded-full border-2 border-dashed border-amber-500">
                    <svg width={80} height={80} fill="none" viewBox="0 0 80 80">
                      <circle
                        cx="40"
                        cy="40"
                        r="40"
                        fill="#FBBF24"
                        fillOpacity="0.15"
                      />
                      <text
                        x="50%"
                        y="50%"
                        textAnchor="middle"
                        dy=".3em"
                        fontSize="32"
                        fill="#FBBF24"
                      >
                        📷
                      </text>
                    </svg>
                    <span className="mt-2 text-sm text-amber-600">
                      Upload Photo
                    </span>
                    <input
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
                <Dialog.Panel className="bg-white dark:bg-zinc-900 rounded-lg p-6 max-w-md w-full">
                  <h3 className="text-lg font-semibold mb-4 text-foreground">
                    Crop your photo
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
                      className="px-4 py-2 rounded bg-[#22343c] text-white"
                      onClick={handleCropConfirm}
                    >
                      Apply Crop
                    </button>
                    <button
                      type="button"
                      className="px-4 py-2 rounded bg-gray-200 dark:bg-zinc-700 dark:text-white"
                      onClick={handleCropCancel}
                    >
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </div>
            </Dialog>
            {/* Form fields section */}
            <div className="w-full space-y-4">
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Date of Birth *
                </label>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <input
                    type="text"
                    name="year"
                    placeholder="Year"
                    className="h-12 border border-border rounded-lg px-3 py-2 w-full text-base bg-background dark:bg-zinc-900 text-foreground"
                    value={fields.dateOfBirth.year}
                    onChange={handleInputChange}
                    disabled={loading}
                  />
                  <select
                    name="month"
                    className="h-12 border border-border rounded-lg px-3 py-2 w-full text-base bg-background dark:bg-zinc-900 text-foreground"
                    value={fields.dateOfBirth.month}
                    onChange={handleInputChange}
                    disabled={loading}
                  >
                    <option value="">Month</option>
                    {months.map((month) => (
                      <option key={month} value={month}>
                        {month}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    name="day"
                    placeholder="Day"
                    className="h-12 border border-border rounded-lg px-3 py-2 w-full text-base bg-background dark:bg-zinc-900 text-foreground"
                    value={fields.dateOfBirth.day}
                    onChange={handleInputChange}
                    disabled={loading}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-4 sm:grid sm:grid-cols-2">
                <div>
                  <label className="block mb-1 text-sm font-medium">
                    Country *
                  </label>
                  <select
                    name="country"
                    className="h-12 border border-border rounded-lg px-3 py-2 w-full text-base bg-background dark:bg-zinc-900 text-foreground"
                    value={fields.country}
                    onChange={handleInputChange}
                    disabled={loading}
                  >
                    <option value="">Select Country</option>
                    {countries.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium">
                    Phone *
                  </label>
                  <PhoneInput
                    country={"ng"}
                    value={fields.phone}
                    onChange={(phone) => {
                      setError(null); // Clear errors when user changes phone
                      setFields((prev) => ({ ...prev, phone }));
                    }}
                    inputClass="!h-12 !border !border-border !rounded-lg !px-3 !py-2 !w-full !text-base !bg-background dark:!bg-zinc-900 dark:!text-foreground !pl-16"
                    buttonClass="!bg-background dark:!bg-zinc-900 !border-border"
                    dropdownClass="!bg-background dark:!bg-zinc-900 !text-foreground !scrollbar-hide !border-border"
                    containerClass="w-full"
                    disabled={loading}
                  />
                </div>
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Address *
                </label>
                <input
                  type="text"
                  name="address"
                  placeholder="Enter your address"
                  className="h-12 border border-border rounded-lg px-3 py-2 w-full text-base bg-background dark:bg-zinc-900 text-foreground"
                  value={fields.address}
                  onChange={handleInputChange}
                  disabled={loading}
                />
              </div>
              <div className="flex flex-col gap-4 sm:grid sm:grid-cols-2">
                <div>
                  <label className="block mb-1 text-sm font-medium">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    placeholder="Enter city"
                    className="h-12 border border-border rounded-lg px-3 py-2 w-full text-base bg-background dark:bg-zinc-900 text-foreground"
                    value={fields.city}
                    onChange={handleInputChange}
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium">
                    State/Province
                  </label>
                  <input
                    type="text"
                    name="stateProvince"
                    placeholder="Enter state/province"
                    className="h-12 border border-border rounded-lg px-3 py-2 w-full text-base bg-background dark:bg-zinc-900 text-foreground"
                    value={fields.stateProvince}
                    onChange={handleInputChange}
                    disabled={loading}
                  />
                </div>
              </div>
            </div>
            {error && (
              <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm font-medium text-red-600 dark:text-red-400">
                  {error}
                </p>
              </div>
            )}
            <div className="flex flex-row justify-between mt-8 gap-4 w-full">
              <button
                type="button"
                className="w-1/2 sm:w-1/4 border border-primary bg-background text-primary hover:bg-primary/10 rounded-md px-4 py-2 font-semibold transition"
                onClick={() => setPage((page) => page - 1)}
                disabled={loading}
              >
                Back
              </button>
              <button
                type="submit"
                className="w-1/2 sm:w-1/4 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? "Completing..." : "Complete Profile"}
              </button>
            </div>
          </form>
        </div>
        <div className="w-full md:w-[30%] flex items-start justify-center px-2 md:px-0 py-2 md:py-20">
          <div className="w-full max-w-xs border border-border bg-primary/5 rounded-lg p-6 text-center shadow-md md:mt-0 mt-8">
            <svg
              width={70}
              height={70}
              className="mx-auto mb-4"
              viewBox="0 0 70 70"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="35"
                cy="35"
                r="35"
                fill="#FBBF24"
                fillOpacity="0.15"
              />
              <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dy=".3em"
                fontSize="32"
                fill="#FBBF24"
              >
                🛡️
              </text>
            </svg>
            <p className="text-base text-foreground font-medium">
              A complete profile builds trust and helps you get hired faster!
            </p>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onClose={() => {}}>
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <Dialog.Panel className="bg-white dark:bg-zinc-900 rounded-lg p-8 max-w-md w-full mx-4">
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
                Profile Completed! 🎉
              </Dialog.Title>
              <p className="text-muted-foreground mb-6">
                Congratulations! Your Data Fellow profile is now complete.
                You're ready to start applying for jobs and connecting with
                employers.
              </p>
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  router.push("/dashboard/home");
                }}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-6 py-3 font-semibold transition"
              >
                Go to Dashboard
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default ProfileDetailsPage;
