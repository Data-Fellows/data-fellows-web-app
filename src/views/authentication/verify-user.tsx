import { useToast } from "@/context/ToastContext";
import {
  isUserFullyOnboarded,
  setToken,
  setUser,
  shouldRedirectToEmployerOnboarding,
} from "@/helpers";
import AuthLayout from "@/layouts/auth";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { verifyEmailApi } from "./api";

export default function Verify() {
  const router = useRouter();
  const { email } = router.query;
  const { showToast } = useToast();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [pending, setPending] = useState(false);
  const [timer, setTimer] = useState(60);
  const [resending, setResending] = useState(false);
  const inputs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (timer > 0) {
      const t = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [timer]);

  const handleChange = (i: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[i] = value.slice(-1);
    setOtp(newOtp);
    if (value && i < 5) {
      inputs.current[i + 1]?.focus();
    }
  };

  const handleKeyDown = (
    i: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) {
      inputs.current[i - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.some((d) => !d)) {
      showToast("Please enter the 6-digit code.", "error");
      return;
    }
    setPending(true);
    try {
      const code = otp.join("");
      const response = await verifyEmailApi({
        email: String(email),
        otp: code,
      });
      if (response.token && response.user) {
        setToken(response.token);
        setUser(response.user);
        showToast("Account verified!", "success");

        if (response.user.userType === "employer") {
          if (shouldRedirectToEmployerOnboarding(response.user)) {
            router.replace("/onboarding/employer");
          } else {
            router.replace("/dashboard/home");
          }
        } else {
          if (isUserFullyOnboarded(response.user)) {
            router.replace("/dashboard/home");
          } else {
            router.replace("/onboarding/user");
          }
        }
      } else {
        showToast(response.message || "Verification failed", "error");
      }
    } catch (error: any) {
      showToast(error.message || "Verification failed", "error");
    } finally {
      setPending(false);
    }
  };
  const handleResend = async () => {
    setResending(true);
    setTimeout(() => {
      setResending(false);
      setTimer(60);
      showToast("Verification code resent!", "success");
    }, 1200);
  };

  return (
    <AuthLayout>
      <div className="max-w-md mx-auto bg-card shadow-lg rounded-2xl p-8 mt-12 border border-border">
        <div className="flex flex-col items-center mb-6">
          <Image
            src="/svgs/data-fellow.svg"
            height={56}
            width={56}
            alt="Data Fellows logo"
            className="mb-2"
          />
          <h3 className="text-2xl font-bold text-primary text-center mb-1">
            Email Verification
          </h3>
          <p className="text-muted-foreground text-center text-base">
            Enter the 6-digit code sent to
          </p>
          <span className="font-semibold text-primary text-center text-base break-all">
            {email}
          </span>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center gap-3 mb-4">
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => {
                  inputs.current[i] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                className="w-[15%] aspect-square text-center text-xl rounded-lg border border-input bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/30 outline-none transition-all"
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                disabled={pending}
                autoFocus={i === 0}
              />
            ))}
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-primary text-primary-foreground py-3 font-semibold text-lg transition hover:bg-primary/90 shadow"
            disabled={pending}
          >
            {pending ? "Verifying..." : "Verify"}
          </button>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2 mt-2">
            <div className="text-muted-foreground text-xs">
              Need help?{" "}
              <a
                href="mailto:support@datafellows.com"
                className="text-primary hover:underline"
              >
                Contact support
              </a>
            </div>
            <div className="text-xs flex items-center gap-1">
              {timer > 0 ? (
                <span className="text-muted-foreground">
                  Resend code in <span className="font-semibold">{timer}s</span>
                </span>
              ) : (
                <button
                  type="button"
                  className="text-primary font-semibold hover:underline disabled:opacity-60"
                  onClick={handleResend}
                  disabled={resending}
                >
                  {resending ? "Resending..." : "Resend code"}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
}
