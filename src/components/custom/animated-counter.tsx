"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type AnimatedCounterProps = {
  value: number;
  suffix?: string;
};

// Counts up from 0 to `value` once the element scrolls into view. Purely
// decorative -- under prefers-reduced-motion it renders the final value
// immediately instead of animating.
const AnimatedCounter = ({ value, suffix = "" }: AnimatedCounterProps) => {
  const ref = useRef<HTMLSpanElement | null>(null);
  const reduced = useReducedMotion();
  const [shown, setShown] = useState(reduced ? value : 0);

  useEffect(() => {
    if (reduced) {
      setShown(value);
      return;
    }

    const node = ref.current;
    if (!node) return;

    // Tracks whichever requestAnimationFrame is currently pending so the
    // effect cleanup can cancel it -- without this, navigating away (or a
    // re-render restarting the effect) while the count-up is mid-flight
    // left the recursive tick() loop running and calling setShown on an
    // unmounted component for the rest of its 900ms duration.
    let frameId: number | null = null;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        const start = performance.now();
        const duration = 900;
        const tick = (now: number) => {
          const progress = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - progress, 3);
          setShown(Math.round(value * eased));
          if (progress < 1) {
            frameId = requestAnimationFrame(tick);
          }
        };
        frameId = requestAnimationFrame(tick);
        observer.disconnect();
      },
      { threshold: 0.35 }
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
      if (frameId !== null) cancelAnimationFrame(frameId);
    };
  }, [value, reduced]);

  return (
    <span ref={ref}>
      {shown.toLocaleString()}
      {suffix}
    </span>
  );
};

export default AnimatedCounter;
