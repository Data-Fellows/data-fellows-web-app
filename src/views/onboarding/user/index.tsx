import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import BioForm from "./steps/five";
import EducationExperienceForm from "./steps/four";
import DataFellowIntro from "./steps/one";
import ProfileDetailsPage from "./steps/six";
import WorkExperienceForm from "./steps/three";
import SkillsSelector from "./steps/two";

const steps = [
  DataFellowIntro,
  SkillsSelector,
  WorkExperienceForm,
  EducationExperienceForm,
  BioForm,
  ProfileDetailsPage,
];

export default function OnboardingSteps() {
  const [page, setPage] = useState(0);
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
