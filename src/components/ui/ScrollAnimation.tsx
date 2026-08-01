import { useEffect, useRef, ReactNode } from "react";
import { useReducedMotion } from "../../hooks/useReducedMotion";

interface ScrollAnimationProps {
  children: ReactNode;
  className?: string;
  animation?: "fade-up" | "fade-in" | "slide-left" | "slide-right" | "scale-up";
  delay?: number;
  id?: string;
}

export default function ScrollAnimation({
  children,
  className = "",
  animation = "fade-up",
  delay = 0,
  id
}: ScrollAnimationProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              element.classList.add("animate-in");
              element.classList.remove("opacity-0");
            }, delay);
            observer.unobserve(element);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [delay, reducedMotion]);

  if (reducedMotion) {
    return (
      <div id={id} className={className}>
        {children}
      </div>
    );
  }

  const animationClasses = {
    "fade-up": "scroll-fade-up",
    "fade-in": "scroll-fade-in",
    "slide-left": "scroll-slide-left",
    "slide-right": "scroll-slide-right",
    "scale-up": "scroll-scale-up",
  };

  return (
    <div
      ref={ref}
      id={id}
      className={`opacity-0 ${animationClasses[animation]} ${className}`}
    >
      {children}
    </div>
  );
}