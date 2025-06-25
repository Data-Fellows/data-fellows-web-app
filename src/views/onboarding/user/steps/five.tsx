import React from "react";

const formSchema = {
  bio: {
    required: true,
    minLength: 100,
    message: "Bio must be at least 100 characters",
  },
};

const BioForm = ({
  setPage,
}: {
  setPage: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [bio, setBio] = React.useState("");
  const [touched, setTouched] = React.useState(false);

  const bioLength = bio.length;

  function validate() {
    if (!bio || bio.length < 100) {
      return formSchema.bio.message;
    }
    return null;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    setLoading(true);
    setError(null);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setBio("");
      setTouched(false);
      setPage((page) => page + 1);
    }, 1000);
  }

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen bg-background py-6 px-2">
      <div
        className="w-full bg-card rounded-xl shadow-lg flex flex-col md:flex-row items-center md:items-stretch justify-center md:justify-between gap-8 md:gap-0"
        style={{ maxWidth: "1200px", minHeight: "70vh" }}
      >
        <div className="w-full md:w-[70%] px-2 sm:px-8 py-6 md:py-10 flex flex-col justify-center">
          <h2 className="text-md mb-4 text-border font-semibold">5/6</h2>
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">
            Write a Bio to Showcase Yourself
          </h2>
          <p className="text-muted-foreground mb-6 text-base">
            Help business owners get to know you at a glance. Highlight your top
            skills, experiences, and interests using paragraphs or bullet
            points. You can edit later, but proofread now.
          </p>
          <div className="border-t border-border pt-6 mb-4"></div>
          <form onSubmit={onSubmit} className="space-y-4 w-full">
            <div>
              <label className="block mb-1 text-sm font-medium">
                Bio <span className="text-red-500">*</span>
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                onBlur={() => setTouched(true)}
                placeholder="Enter your top skills, experiences, and interests. This is one of the first things clients will see on your profile."
                className="h-32 border border-border rounded-lg px-3 py-2 w-full text-base bg-background dark:bg-zinc-900 text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition"
                disabled={loading}
              />
              {touched && validate() && (
                <div className="text-red-500 text-xs mt-1">
                  {formSchema.bio.message}
                </div>
              )}
            </div>
            <div className="flex justify-end text-sm text-gray-600 sm:text-base">
              {bioLength}/100 characters
            </div>
            {error && (
              <div className="text-sm font-medium text-red-600 sm:text-base">
                {error}
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
                className="w-1/2 sm:w-1/4 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 font-semibold transition"
                disabled={loading}
              >
                {loading ? "Loading..." : "Next"}
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
                📝
              </text>
            </svg>
            <p className="text-base text-foreground font-medium">
              Your bio helps you stand out to employers. Make it count!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BioForm;
