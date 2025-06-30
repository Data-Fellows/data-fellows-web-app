import { getActualNextEmployerStep, getUser } from "@/helpers";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import BizPilotStep from "./steps/bizpilot";
import CompletionStep from "./steps/completion";
import CompanySetup from "./steps/two";

const steps = [CompanySetup, BizPilotStep, CompletionStep];

export default function EmployerOnboardingSteps() {
  const [page, setPage] = useState(0);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const user = getUser();
    if (user) {
      const nextStep = getActualNextEmployerStep(user);
      setPage(nextStep);
    }
    setInitializing(false);
  }, []);

  if (initializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const StepComponent = steps[page];

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <AnimatePresence mode="wait">
        <motion.div
          key={page}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.3 }}
          className="w-full"
        >
          <StepComponent setPage={setPage} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
