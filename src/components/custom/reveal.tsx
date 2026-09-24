"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
};

// Scroll-triggered entrance used across the marketing site's section
// content. Animates opacity/transform only, runs once per element, and
// collapses to an instant appearance under prefers-reduced-motion.
const Reveal = ({ children, delay = 0, className }: RevealProps) => {
  const prefersReduced = useReducedMotion();
  // framer-motion's useReducedMotion() can resolve synchronously to the
  // real device preference on the client's very first render (it checks
  // matchMedia during render, not in an effect), while SSR always assumes
  // motion is allowed. Feeding it straight into `initial`/`whileInView`
  // meant a reduced-motion visitor's hydration render produced a
  // different inline style than the server had sent (e.g. missing
  // "opacity:0;transform:translateY(18px)"), which React then discarded
  // and replaced -- same root cause as the animated-counter.tsx fix.
  // Default to the SSR-safe "motion allowed" behavior and only switch to
  // the reduced-motion behavior after mount, once client and server
  // already agree.
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    setReduced(Boolean(prefersReduced));
  }, [prefersReduced]);

  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y: 18 }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
};

export default Reveal;
