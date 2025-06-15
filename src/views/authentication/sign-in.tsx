import { GoogleLoginButton } from "@/components";
import { useToast } from "@/context/ToastContext";
import AuthLayout from "@/layouts/auth";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FiEye, FiEyeOff, FiLogIn } from "react-icons/fi";

const SignIn = () => {
  const [pending, setPending] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { showToast } = useToast();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPending(true);

    setTimeout(() => {
      setPending(false);

      if (!email || !password) {
        showToast("Email and password are required.", "error");
      } else {
        showToast("Signed in successfully!", "success");
      }
    }, 1000);
  };

  return (
    <AuthLayout>
      <form onSubmit={onSubmit} className="space-y-5">
        <div className="flex flex-col items-center space-y-2 text-center">
          <Image
            src="/svgs/data-fellow.svg"
            height={120}
            width={120}
            alt="logo"
          />
          <h3 className="text-3xl text-foreground font-bold">Sign In</h3>
          <p className="text-muted-foreground">
            Welcome back, you&apos;ve been missed!
          </p>
        </div>
        <div className="flex flex-col space-y-3 sm:flex-row sm:space-x-3 sm:space-y-0">
          <GoogleLoginButton />
        </div>
        <div className="relative flex items-center before:h-[0.5px] before:flex-1 before:bg-border after:h-[0.5px] after:flex-1 after:bg-border">
          <span className="mx-3 inline-block text-muted-foreground">OR</span>
        </div>
        <div className="space-y-4">
          <div>
            <label
              className="block mb-2 font-medium text-foreground"
              htmlFor="email"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              disabled={pending}
              placeholder="Enter your email address"
              className="w-full rounded-md border border-input bg-background text-foreground p-4 focus:border-primary focus:ring-2 focus:ring-primary/30 transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                border:
                  typeof window !== "undefined" &&
                  document.documentElement.classList.contains("dark")
                    ? "none"
                    : undefined,
                background:
                  typeof window !== "undefined" &&
                  document.documentElement.classList.contains("dark")
                    ? "rgba(30,41,59,0.7)"
                    : undefined,
              }}
            />
          </div>
          <div>
            <label
              className="block mb-2 font-medium text-foreground"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                disabled={pending}
                placeholder="Enter your password"
                className="w-full rounded-md border border-input bg-background text-foreground p-4 pr-12 focus:border-primary focus:ring-2 focus:ring-primary/30 transition"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  border:
                    typeof window !== "undefined" &&
                    document.documentElement.classList.contains("dark")
                      ? "none"
                      : undefined,
                  background:
                    typeof window !== "undefined" &&
                    document.documentElement.classList.contains("dark")
                      ? "rgba(30,41,59,0.7)"
                      : undefined,
                }}
              />
              <button
                type="button"
                tabIndex={-1}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>
          </div>
          <Link
            className="text-primary flex self-end justify-end hover:underline text-sm"
            href="/forgot-password"
          >
            Forgot Password?
          </Link>
          <button
            type="submit"
            className="w-full rounded-md bg-primary text-primary-foreground py-3 font-semibold text-lg transition hover:bg-primary/90 flex items-center justify-center gap-2"
            disabled={pending}
          >
            <FiLogIn className="w-5 h-5" />
            {pending ? "Signing In..." : "Submit"}
          </button>
          <div className="text-center text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link className="text-primary hover:underline" href="/sign-up">
              Sign Up
            </Link>
          </div>
        </div>
      </form>
    </AuthLayout>
  );
};

export default SignIn;
