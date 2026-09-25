import { useEffect, useRef, useState } from "react";

// Fade-up on scroll into view (once). Respects reduced-motion.
export default function Reveal({ children, className = "", delay = 0 }) {
  const ref = useRef(null);
  const [vis, setVis] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  useEffect(() => {
    const el = ref.current;
    if (!el || vis) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVis(true);
          io.disconnect();
        }
      },
      { threshold: 0.06 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [vis]);
  return (
    <div
      ref={ref}
      className={`reveal ${vis ? "in" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
