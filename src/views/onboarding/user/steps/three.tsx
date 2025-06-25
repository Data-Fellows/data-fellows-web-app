import dayjs from "dayjs";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";

type WorkSchemaFormInputType = {
  title: string;
  company: string;
  location: string;
  country: string;
  description: string;
  currentlyWorking: boolean;
  startDate?: Date;
  endDate?: Date;
};

const defaultValues: WorkSchemaFormInputType = {
  title: "",
  company: "",
  location: "",
  country: "",
  description: "",
  currentlyWorking: false,
  startDate: undefined,
  endDate: undefined,
};

const WorkExperienceForm = ({
  setPage,
}: {
  setPage: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCVOpen, setIsCVOpen] = useState(false);
  const [experiences, setExperiences] = useState<number>(0);
  const [imported, setImported] = useState<{
    state: boolean;
    msg: string | null;
  }>({
    state: false,
    msg: null,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, reset, watch, setValue, formState } =
    useForm<WorkSchemaFormInputType>({
      defaultValues,
      mode: "onChange",
    });

  function onSubmit(values: WorkSchemaFormInputType) {
    setLoading(true);
    setError(null);
    setTimeout(() => {
      setExperiences((prev) => prev + 1);
      setIsOpen(false);
      reset();
      setLoading(false);
      setImported({ state: false, msg: null });
    }, 1000);
  }

  function DatePicker({
    value,
    onChange,
    min,
    max,
    label,
    disabled,
  }: {
    value?: Date;
    onChange: (date: Date) => void;
    min?: string;
    max?: string;
    label: string;
    disabled?: boolean;
  }) {
    return (
      <div className="mb-2 flex-1">
        <label className="block mb-1 text-sm">{label}</label>
        <div className="relative">
          <input
            type="month"
            value={
              value
                ? `${value.getFullYear()}-${String(
                    value.getMonth() + 1
                  ).padStart(2, "0")}`
                : ""
            }
            onChange={(e) => {
              const [year, month] = e.target.value.split("-");
              onChange(new Date(Number(year), Number(month) - 1));
            }}
            min={min}
            max={max}
            disabled={disabled}
            className="h-12 border border-border rounded-lg px-3 py-2 w-full text-base bg-background dark:bg-zinc-900 text-foreground pr-10 focus:ring-2 focus:ring-primary focus:border-primary transition"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
              <path
                d="M7 10l5 5 5-5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
      </div>
    );
  }

  // CV Import Handler
  const handleCVImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    setImported({ state: false, msg: null });

    // Simulate parsing and importing
    setTimeout(() => {
      setLoading(false);
      setIsCVOpen(false);
      setImported({
        state: true,
        msg: `Imported experience from "${file.name}" successfully!`,
      });
      setExperiences((prev) => prev + 1);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }, 1200);
  };

  // Modal overlay
  const ModalOverlay = () => (
    <div className="fixed inset-0 z-40 bg-black/80 transition-opacity" />
  );

  function Modal({
    children,
    onClose,
    title,
    icon,
    footer,
  }: {
    children: React.ReactNode;
    onClose: () => void;
    title: string;
    icon: React.ReactNode;
    footer: React.ReactNode;
  }) {
    return (
      <>
        <ModalOverlay />
        <div className="fixed inset-0 z-50 flex items-center justify-center px-2">
          <div
            className="relative w-full max-w-lg mx-auto bg-background dark:bg-zinc-900 text-foreground rounded-2xl shadow-2xl flex flex-col border border-border"
            style={{
              maxHeight: "90vh",
              minHeight: "0",
              margin: "auto",
            }}
          >
            <div className="flex items-center justify-between px-6 pt-6 pb-2 border-b border-border bg-background dark:bg-zinc-900 rounded-t-2xl">
              <div className="flex items-center gap-2">
                {icon}
                <h3 className="text-lg font-bold">{title}</h3>
              </div>
              <button
                className="text-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                onClick={onClose}
                aria-label="Close"
                type="button"
              >
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <path
                    d="M18 6L6 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M6 6l12 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
            <div className="overflow-y-auto px-6 py-4 flex-1 custom-scrollbar">
              {children}
            </div>
            <div className="px-6 pb-6 pt-4 bg-background dark:bg-zinc-900 rounded-b-2xl flex justify-end gap-3 border-t border-border">
              {footer}
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen bg-background py-6 px-2">
      <div
        className="w-full bg-card rounded-xl shadow-lg flex flex-col md:flex-row items-center md:items-stretch justify-center md:justify-between gap-8 md:gap-0"
        style={{ maxWidth: "1200px", minHeight: "70vh" }}
      >
        {/* Main Content */}
        <div className="w-full md:w-[70%] px-2 sm:px-8 py-6 md:py-10 flex flex-col justify-center">
          <h2 className="text-md mb-4 text-border font-semibold">3/6</h2>
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">
            You have some relevant work experience? Add it here.
          </h2>
          <p className="text-muted-foreground mb-6 text-base">
            Adding your work experience doubles your chances of finding the
            perfect job. You can skip and return to this later.
          </p>
          <div className="border-t border-border pt-6 mb-4"></div>
          <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:gap-8">
            <div
              className="flex h-48 w-full cursor-pointer flex-col justify-center rounded-xl border border-amber-500 bg-amber-50/10 text-left text-slate-700 transition-colors sm:h-64 sm:w-96"
              onClick={() => {
                setIsOpen(true);
                setIsCVOpen(false);
              }}
            >
              <div className="ml-4 sm:ml-6">
                <div className="mb-2 flex w-12 items-center justify-center rounded-full bg-amber-100 p-2 text-2xl text-amber-500 sm:w-[50px]">
                  <span>+</span>
                </div>
                <span className="text-base font-medium sm:text-lg">
                  Add experience
                </span>
              </div>
            </div>
            <span className="my-4 text-center text-sm sm:my-0 sm:text-base">
              OR
            </span>
            <button
              className="h-12 w-full rounded-lg border border-amber-500 px-6 py-3 text-base text-amber-700 bg-white sm:w-auto sm:text-lg flex items-center justify-center"
              onClick={() => {
                setIsCVOpen(true);
                setIsOpen(false);
              }}
              disabled={loading}
              type="button"
            >
              <svg
                className="mr-2 h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 16L12 8"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M9 11L12 8 15 11"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M3 15V16C3 18.2091 4.79086 20 7 20H17C19.2091 20 21 18.2091 21 16V15"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Import CV
            </button>
          </div>
          {error && (
            <div className="mt-4 text-sm font-medium text-red-600 sm:text-base">
              {error}
            </div>
          )}
          {imported.state && imported.msg && (
            <p className="mt-4 text-sm font-medium text-amber-600 sm:text-base">
              {imported.msg}
            </p>
          )}
          {!imported.state && experiences > 0 && (
            <p className="mt-4 text-sm font-medium text-amber-600 sm:text-base">
              ({experiences}) added experiences
            </p>
          )}
          <div className="flex flex-row justify-between mt-8 gap-4 w-full">
            <button
              className="w-1/2 sm:w-1/4 border border-primary bg-background text-primary hover:bg-primary/10 rounded-md px-4 py-2 font-semibold transition"
              onClick={() => setPage((page) => page - 1)}
              disabled={loading}
              type="button"
            >
              Back
            </button>
            <button
              className="w-1/2 sm:w-1/4 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 font-semibold transition"
              onClick={() => setPage((page) => page + 1)}
              disabled={loading}
              type="button"
            >
              {loading ? "Loading..." : "Next"}
            </button>
          </div>
        </div>
        {/* Info Box */}
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
                💼
              </text>
            </svg>
            <p className="text-base text-foreground font-medium">
              Data Fellow&apos;s algorithm will match you with specific jobs
              tailored to your work experience.
              <br />
              <span className="font-semibold text-primary">
                Add your experience for better matches!
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Modal for Work Experience */}
      {isOpen && (
        <Modal
          onClose={() => setIsOpen(false)}
          title="Add Work Experience"
          icon={
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
              <path
                d="M4 7V6a2 2 0 012-2h12a2 2 0 012 2v1"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <rect
                x="4"
                y="7"
                width="16"
                height="13"
                rx="2"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M16 3v4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M8 3v4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          }
          footer={
            <>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                disabled={loading}
                className="h-12 px-6 text-base rounded-lg border border-border bg-primary/40 font-semibold"
              >
                Cancel
              </button>
              <button
                className="h-12 px-6 text-base text-white bg-primary rounded-lg font-semibold"
                type="submit"
                form="work-exp-form"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </>
          }
        >
          <form
            id="work-exp-form"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <div>
              <label className="block mb-1 text-sm font-medium">Title</label>
              <input
                {...register("title", { required: true })}
                placeholder="Ex. Data Analyst"
                className="h-12 border border-border rounded-lg px-3 py-2 w-full text-base bg-background dark:bg-zinc-900 text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition"
              />
              {formState.errors.title && (
                <div className="text-red-500 text-xs mt-1">
                  {formState.errors.title.message}
                </div>
              )}
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">Company</label>
              <input
                {...register("company", { required: true })}
                placeholder="Ex. Microsoft"
                className="h-12 border border-border rounded-lg px-3 py-2 w-full text-base bg-background dark:bg-zinc-900 text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition"
              />
              {formState.errors.company && (
                <div className="text-red-500 text-xs mt-1">
                  {formState.errors.company.message}
                </div>
              )}
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">Location</label>
              <input
                {...register("location")}
                placeholder="Ex. London"
                className="h-12 border border-border rounded-lg px-3 py-2 w-full text-base bg-background dark:bg-zinc-900 text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">Country</label>
              <input
                {...register("country")}
                placeholder="Country"
                className="h-12 border border-border rounded-lg px-3 py-2 w-full text-base bg-background dark:bg-zinc-900 text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition"
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                {...register("currentlyWorking")}
                className="h-5 w-5 accent-primary rounded"
                id="currentlyWorking"
              />
              <label htmlFor="currentlyWorking" className="text-sm">
                I am currently working in this role
              </label>
            </div>
            <div className="flex w-full space-x-4">
              <DatePicker
                value={watch("startDate")}
                onChange={(date) => setValue("startDate", date)}
                label="Start Date"
                max={
                  watch("currentlyWorking")
                    ? undefined
                    : watch("endDate")
                    ? dayjs(watch("endDate")).format("YYYY-MM")
                    : undefined
                }
                disabled={loading}
              />
              {!watch("currentlyWorking") && (
                <DatePicker
                  value={watch("endDate")}
                  onChange={(date) => setValue("endDate", date)}
                  label="End Date"
                  min={
                    watch("startDate")
                      ? dayjs(watch("startDate")).format("YYYY-MM")
                      : undefined
                  }
                  max={dayjs().format("YYYY-MM")}
                  disabled={loading}
                />
              )}
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">
                Description
              </label>
              <textarea
                {...register("description")}
                placeholder="Description"
                className="h-24 border border-border rounded-lg px-3 py-2 w-full text-base bg-background dark:bg-zinc-900 text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition"
              />
            </div>
          </form>
        </Modal>
      )}

      {/* Import CV Modal */}
      {isCVOpen && (
        <Modal
          onClose={() => setIsCVOpen(false)}
          title="Import CV"
          icon={
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
              <rect
                x="4"
                y="4"
                width="16"
                height="16"
                rx="2"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M8 2v4M16 2v4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path d="M4 10h16" stroke="currentColor" strokeWidth="2" />
            </svg>
          }
          footer={
            <>
              <button
                className="h-10 px-6 text-base rounded-lg border border-border bg-gray-100 dark:bg-zinc-800 font-semibold"
                onClick={() => setIsCVOpen(false)}
                type="button"
                disabled={loading}
              >
                Close
              </button>
            </>
          }
        >
          <p className="mb-4 text-sm">
            Upload your resume in PDF or DOCX format. We'll extract your work
            experience automatically.
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 mb-4"
            onChange={handleCVImport}
            disabled={loading}
          />
          {loading && (
            <div className="mt-4 text-sm text-primary font-semibold">
              Importing...
            </div>
          )}
        </Modal>
      )}
    </div>
  );
};

export default WorkExperienceForm;
