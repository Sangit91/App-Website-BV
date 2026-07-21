import { motion } from "framer-motion";
import { useReducedMotion } from "./useReducedMotion";

interface FloatingShapeProps {
  className: string;
  delay?: number;
}

export function FloatingShape({ className, delay = 0 }: FloatingShapeProps) {
  const reducedMotion = useReducedMotion();
  return (
    <motion.div
      className={`absolute rounded-full opacity-20 ${className}`}
      animate={reducedMotion ? {} : {
        y: [0, -30, 0],
        x: [0, 15, 0],
        scale: [1, 1.1, 1]
      }}
      transition={reducedMotion ? {} : {
        duration: 8,
        delay,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  );
}