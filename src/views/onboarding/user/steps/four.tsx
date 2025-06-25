import { useState } from "react";
import { useForm } from "react-hook-form";

type EducationSchemaFormInputType = {
  school: string;
  degree: string;
  fieldOfStudy: string;
  description: string;
  currentlyInSchool: boolean;
  startYear?: string;
  endYear?: string;
};

const defaultValues: EducationSchemaFormInputType = {
  school: "",
  degree: "",
  fieldOfStudy: "",
  description: "",
  currentlyInSchool: false,
  startYear: "",
  endYear: "",
};

const EducationExperienceForm = ({
  setPage,
}: {
  setPage: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const [isOpen, setIsOpen] = useState(false);
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

  const { register, handleSubmit, reset, watch, setValue, formState } =
    useForm<EducationSchemaFormInputType>({
      defaultValues,
      mode: "onChange",
    });

  function onSubmit(values: EducationSchemaFormInputType) {
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
                className="text-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full p-1 transition-colors"
                onClick={onClose}
                aria-label="Close"
                type="button"
                tabIndex={0}
                style={{
                  minWidth: 32,
                  minHeight: 32,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
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
        <div className="w-full md:w-[70%] px-2 sm:px-8 py-6 md:py-10 flex flex-col justify-center">
          <h2 className="text-md mb-4 text-border font-semibold">4/6</h2>
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">
            You have some relevant academic experience? Add it here.
          </h2>
          <p className="text-muted-foreground mb-6 text-base">
            Adding your academic experience doubles your chances of finding the
            perfect job. You can skip and return to this later.
          </p>
          <div className="border-t border-border pt-6 mb-4"></div>
          <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:gap-8">
            <div
              className="flex h-48 w-full cursor-pointer flex-col justify-center rounded-xl border border-amber-500 bg-amber-50/10 text-left text-slate-700 transition-colors sm:h-64 sm:w-96"
              onClick={() => {
                setIsOpen(true);
              }}
            >
              <div className="ml-4 sm:ml-6">
                <div className="mb-2 flex w-12 items-center justify-center rounded-full bg-amber-100 p-2 text-2xl text-amber-500 sm:w-[50px]">
                  <span>+</span>
                </div>
                <span className="text-base font-medium sm:text-lg">
                  Add Education History
                </span>
              </div>
            </div>
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
              ({experiences}) added history
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
                🎓
              </text>
            </svg>
            <p className="text-base text-foreground font-medium">
              Data Fellow&apos;s algorithm will match you with specific jobs
              tailored to your academic background.
              <br />
              <span className="font-semibold text-primary">
                Add your education for better matches!
              </span>
            </p>
          </div>
        </div>
      </div>

      {isOpen && (
        <Modal
          onClose={() => setIsOpen(false)}
          title="Add Education History"
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
                type="button"
                onClick={() => setIsOpen(false)}
                disabled={loading}
                className="h-12 px-6 text-base rounded-lg border border-border bg-background hover:bg-gray-100 dark:bg-zinc-800 font-semibold transition"
              >
                Cancel
              </button>
              <button
                className="h-12 px-6 text-base text-white bg-primary rounded-lg font-semibold"
                type="submit"
                form="education-form"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </>
          }
        >
          <form
            id="education-form"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <div>
              <label className="block mb-1 text-sm font-medium">School</label>
              <input
                {...register("school", { required: true })}
                placeholder="Ex. Oxford University"
                className="h-12 border border-border rounded-lg px-3 py-2 w-full text-base bg-background dark:bg-zinc-900 text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition"
              />
              {formState.errors.school && (
                <div className="text-red-500 text-xs mt-1">
                  {formState.errors.school.message}
                </div>
              )}
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">Degree</label>
              <input
                {...register("degree", { required: true })}
                placeholder="Ex. Bachelors"
                className="h-12 border border-border rounded-lg px-3 py-2 w-full text-base bg-background dark:bg-zinc-900 text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition"
              />
              {formState.errors.degree && (
                <div className="text-red-500 text-xs mt-1">
                  {formState.errors.degree.message}
                </div>
              )}
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">
                Field of Study
              </label>
              <input
                {...register("fieldOfStudy", { required: true })}
                placeholder="Ex. Computer Science"
                className="h-12 border border-border rounded-lg px-3 py-2 w-full text-base bg-background dark:bg-zinc-900 text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition"
              />
              {formState.errors.fieldOfStudy && (
                <div className="text-red-500 text-xs mt-1">
                  {formState.errors.fieldOfStudy.message}
                </div>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                {...register("currentlyInSchool")}
                className="h-5 w-5 accent-primary rounded"
                id="currentlyInSchool"
              />
              <label htmlFor="currentlyInSchool" className="text-sm">
                I am currently a student
              </label>
            </div>
            <div className="flex w-full space-x-4">
              <div className="flex-1">
                <label className="block mb-1 text-sm font-medium">
                  Start Year
                </label>
                <select
                  {...register("startYear", { required: true })}
                  className="h-12 border border-border rounded-lg px-3 py-2 w-full text-base bg-background dark:bg-zinc-900 text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition"
                  disabled={loading}
                >
                  <option value="">Select Year</option>
                  {[...Array(30)].map((_, i) => {
                    const year = new Date().getFullYear() - i;
                    return (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    );
                  })}
                </select>
                {formState.errors.startYear && (
                  <div className="text-red-500 text-xs mt-1">
                    {formState.errors.startYear.message}
                  </div>
                )}
              </div>
              {!watch("currentlyInSchool") && (
                <div className="flex-1">
                  <label className="block mb-1 text-sm font-medium">
                    End Year
                  </label>
                  <select
                    {...register("endYear", { required: true })}
                    className="h-12 border border-border rounded-lg px-3 py-2 w-full text-base bg-background dark:bg-zinc-900 text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition"
                    disabled={loading}
                  >
                    <option value="">Select Year</option>
                    {[...Array(30)].map((_, i) => {
                      const year = new Date().getFullYear() - i;
                      return (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      );
                    })}
                  </select>
                  {formState.errors.endYear && (
                    <div className="text-red-500 text-xs mt-1">
                      {formState.errors.endYear.message}
                    </div>
                  )}
                </div>
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
    </div>
  );
};

export default EducationExperienceForm;
