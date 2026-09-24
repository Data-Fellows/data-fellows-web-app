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
  // Always start at 0, matching the server-rendered markup exactly -- on
  // the client's *first* render, framer-motion's useReducedMotion() can
  // already resolve synchronously to the device's real preference (it
  // checks matchMedia during render, not in an effect), while SSR has no
  // way to know that preference and always renders `0`. Seeding this
  // state from `reduced` meant a reduced-motion visitor's hydration
  // render produced "1,600" where the server had sent "0", a text
  // mismatch that made React discard and replace the SSR'd subtree. The
  // effect below still jumps straight to the final value for reduced-
  // motion users -- it just does so after hydration, not during it.
  const [shown, setShown] = useState(0);

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
