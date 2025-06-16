import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import {
  FiArrowRight,
  FiBookOpen,
  FiBriefcase,
  FiStar,
  FiUser,
} from "react-icons/fi";

const steps = [
  {
    title: "Welcome to Data Fellows!",
    description:
      "Let's get your profile set up so you can start matching with the best data problems and opportunities.",
    icon: <FiUser className="text-primary w-10 h-10" />,
  },
  {
    title: "Add Your Skills",
    description:
      "Tell us what you're good at. This helps us match you with the right problems.",
    icon: <FiStar className="text-primary w-10 h-10" />,
  },
  {
    title: "Add Your Education",
    description:
      "Share your educational background to showcase your expertise.",
    icon: <FiBookOpen className="text-primary w-10 h-10" />,
  },
  {
    title: "Add Work Experience",
    description:
      "Highlight your professional experience to stand out to employers.",
    icon: <FiBriefcase className="text-primary w-10 h-10" />,
  },
];

export default function UserOnboarding() {
  const [step, setStep] = useState(0);
  const router = useRouter();

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      // Mark user as onboarded in your backend here if needed
      router.replace("/dashboard/home");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground px-4">
      <div className="max-w-md w-full bg-card rounded-2xl shadow-lg p-8 flex flex-col items-center">
        <Image
          src="/svgs/data-fellow.svg"
          alt="Data Fellows"
          width={64}
          height={64}
          className="mb-4"
        />
        <div className="mb-6 flex flex-col items-center">
          {steps[step].icon}
          <h2 className="text-2xl font-bold mt-4 mb-2 text-center">
            {steps[step].title}
          </h2>
          <p className="text-muted-foreground text-center">
            {steps[step].description}
          </p>
        </div>
        <div className="flex items-center justify-between w-full mt-6">
          <div className="flex gap-2">
            {steps.map((_, i) => (
              <span
                key={i}
                className={`h-2 w-2 rounded-full transition-all ${
                  i === step ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>
          <button
            onClick={handleNext}
            className="ml-auto flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2 rounded-lg font-semibold hover:bg-primary/90 transition"
          >
            {step === steps.length - 1 ? "Finish" : "Next"}
            <FiArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
}
