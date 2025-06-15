import { GoogleLoginButton } from "@/components";
import { useToast } from "@/context/ToastContext";
import AuthLayout from "@/layouts/auth";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FiEye, FiEyeOff, FiUserPlus } from "react-icons/fi";

const SignUp = () => {
  const [activeTab, setActiveTab] = useState<
    "data-professional" | "business-owner"
  >(
    typeof window !== "undefined" &&
      window.location.search.includes("type=business-owner")
      ? "business-owner"
      : "data-professional"
  );
  const [pending, setPending] = useState(false);

  // Data Professional
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dpEmail, setDpEmail] = useState("");
  const [dpPassword, setDpPassword] = useState("");
  const [dpShowPassword, setDpShowPassword] = useState(false);

  // Business Owner
  const [fullName, setFullName] = useState("");
  const [boEmail, setBoEmail] = useState("");
  const [boPassword, setBoPassword] = useState("");
  const [boShowPassword, setBoShowPassword] = useState(false);

  const [success, setSuccess] = useState<string>();
  const [error, setError] = useState<string>();
  const { showToast } = useToast();

  const handleTabChange = (tab: "data-professional" | "business-owner") => {
    setActiveTab(tab);
    setSuccess(undefined);
    setError(undefined);
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", `/auth/sign-up?type=${tab}`);
    }
  };

  const onSubmitDP = (e: React.FormEvent) => {
    e.preventDefault();
    setPending(true);
    setTimeout(() => {
      setPending(false);
      if (!firstName || !lastName || !dpEmail || !dpPassword) {
        setError("All fields are required.");
        setSuccess(undefined);
        showToast("All fields are required.", "error");
      } else {
        setSuccess("Account created successfully!");
        setError(undefined);
        showToast("Account created successfully!", "success");
      }
    }, 1000);
  };

  const onSubmitBO = (e: React.FormEvent) => {
    e.preventDefault();
    setPending(true);
    setTimeout(() => {
      setPending(false);
      if (!fullName || !boEmail || !boPassword) {
        setError("All fields are required.");
        setSuccess(undefined);
        showToast("All fields are required.", "error");
      } else {
        setSuccess("Account created successfully!");
        setError(undefined);
        showToast("Account created successfully!", "success");
      }
    }, 1000);
  };

  return (
    <AuthLayout>
      <div className="space-y-5 w-full">
        <div className="flex flex-col items-center space-y-2 text-center">
          <Image
            src="/svgs/data-fellow.svg"
            height={120}
            width={120}
            alt="Data Fellows logo"
          />
          <h3 className="text-3xl text-foreground font-bold">Sign Up</h3>
          <p className="text-muted-foreground">
            Create an account to get started with us.
          </p>
        </div>

        {/* Tabs */}
        <div className="w-full">
          <div className="mb-6 grid h-12 w-full grid-cols-2 rounded-full bg-muted">
            <button
              type="button"
              className={`h-full rounded-full font-semibold transition ${
                activeTab === "data-professional"
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground"
              }`}
              onClick={() => handleTabChange("data-professional")}
            >
              Data Professional
            </button>
            <button
              type="button"
              className={`h-full rounded-full font-semibold transition ${
                activeTab === "business-owner"
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground"
              }`}
              onClick={() => handleTabChange("business-owner")}
            >
              Business Owner
            </button>
          </div>

          <div className="relative h-[600px] overflow-hidden">
            <div
              className={`flex w-[200%] transition-transform duration-500 ease-in-out ${
                activeTab === "data-professional"
                  ? "translate-x-0"
                  : "-translate-x-1/2"
              }`}
              style={{ height: "100%" }}
            >
              <div className="w-1/2 px-2">
                <form className="space-y-4" onSubmit={onSubmitDP}>
                  <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
                    <div className="flex-1">
                      <label
                        className="block mb-2 font-medium text-foreground"
                        htmlFor="firstName"
                      >
                        First Name
                      </label>
                      <input
                        id="firstName"
                        type="text"
                        disabled={pending}
                        placeholder="Enter your first name"
                        className="w-full rounded-md border border-input bg-background text-foreground p-4"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                    </div>
                    <div className="flex-1">
                      <label
                        className="block mb-2 font-medium text-foreground"
                        htmlFor="lastName"
                      >
                        Last Name
                      </label>
                      <input
                        id="lastName"
                        type="text"
                        disabled={pending}
                        placeholder="Enter your last name"
                        className="w-full rounded-md border border-input bg-background text-foreground p-4"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      className="block mb-2 font-medium text-foreground"
                      htmlFor="dpEmail"
                    >
                      Email
                    </label>
                    <input
                      id="dpEmail"
                      type="email"
                      disabled={pending}
                      placeholder="Enter your email address"
                      className="w-full rounded-md border border-input bg-background text-foreground p-4"
                      value={dpEmail}
                      onChange={(e) => setDpEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <label
                      className="block mb-2 font-medium text-foreground"
                      htmlFor="dpPassword"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <input
                        id="dpPassword"
                        type={dpShowPassword ? "text" : "password"}
                        disabled={pending}
                        placeholder="Enter your password"
                        className="w-full rounded-md border border-input bg-background text-foreground p-4 pr-12"
                        value={dpPassword}
                        onChange={(e) => setDpPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        tabIndex={-1}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition"
                        onClick={() => setDpShowPassword((v) => !v)}
                        aria-label={
                          dpShowPassword ? "Hide password" : "Show password"
                        }
                      >
                        {dpShowPassword ? (
                          <FiEyeOff size={20} />
                        ) : (
                          <FiEye size={20} />
                        )}
                      </button>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full rounded-md bg-primary text-primary-foreground py-3 font-semibold text-lg transition hover:bg-primary/90 flex items-center justify-center gap-2"
                    disabled={pending}
                  >
                    <FiUserPlus className="w-5 h-5" />
                    {pending ? "Submitting..." : "Submit"}
                  </button>
                  <div className="relative flex items-center before:h-[0.5px] before:flex-1 before:bg-input after:h-[0.5px] after:flex-1 after:bg-input">
                    <span className="mx-3 inline-block text-muted-foreground">
                      OR
                    </span>
                  </div>
                  <GoogleLoginButton />
                  <div className="text-center text-muted-foreground">
                    Already have an account?{" "}
                    <Link
                      className="text-primary hover:underline"
                      href="/auth/sign-in"
                    >
                      Sign In
                    </Link>
                  </div>
                </form>
              </div>
              <div className="w-1/2 px-2">
                <form className="space-y-4" onSubmit={onSubmitBO}>
                  <div>
                    <label
                      className="block mb-2 font-medium text-foreground"
                      htmlFor="fullName"
                    >
                      Full Name
                    </label>
                    <input
                      id="fullName"
                      type="text"
                      disabled={pending}
                      placeholder="Enter your full name"
                      className="w-full rounded-md border border-input bg-background text-foreground p-4"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label
                      className="block mb-2 font-medium text-foreground"
                      htmlFor="boEmail"
                    >
                      Email
                    </label>
                    <input
                      id="boEmail"
                      type="email"
                      disabled={pending}
                      placeholder="Enter your email address"
                      className="w-full rounded-md border border-input bg-background text-foreground p-4"
                      value={boEmail}
                      onChange={(e) => setBoEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <label
                      className="block mb-2 font-medium text-foreground"
                      htmlFor="boPassword"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <input
                        id="boPassword"
                        type={boShowPassword ? "text" : "password"}
                        disabled={pending}
                        placeholder="Enter your password"
                        className="w-full rounded-md border border-input bg-background text-foreground p-4 pr-12"
                        value={boPassword}
                        onChange={(e) => setBoPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        tabIndex={-1}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition"
                        onClick={() => setBoShowPassword((v) => !v)}
                        aria-label={
                          boShowPassword ? "Hide password" : "Show password"
                        }
                      >
                        {boShowPassword ? (
                          <FiEyeOff size={20} />
                        ) : (
                          <FiEye size={20} />
                        )}
                      </button>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full rounded-md bg-primary text-primary-foreground py-3 font-semibold text-lg transition hover:bg-primary/90 flex items-center justify-center gap-2"
                    disabled={pending}
                  >
                    <FiUserPlus className="w-5 h-5" />
                    {pending ? "Submitting..." : "Submit"}
                  </button>
                  <div className="relative flex items-center before:h-[0.5px] before:flex-1 before:bg-input after:h-[0.5px] after:flex-1 after:bg-input">
                    <span className="mx-3 inline-block text-muted-foreground">
                      OR
                    </span>
                  </div>
                  <GoogleLoginButton />
                  <div className="text-center text-muted-foreground">
                    Already have an account?{" "}
                    <Link
                      className="text-primary hover:underline"
                      href="/auth/sign-in"
                    >
                      Sign In
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default SignUp;
