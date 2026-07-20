import React from "react";
import { motion, MotionValue } from "framer-motion";

export interface ToggleButtonProps {
  isExpanded: boolean;
  expandedIcon: React.ReactNode;
  collapsedIcon: React.ReactNode;
  rotation: MotionValue<number>;
  reducedMotion?: boolean;
  className?: string;
}

export function ToggleButton({
  isExpanded,
  expandedIcon,
  collapsedIcon,
  rotation,
  reducedMotion = false,
  className = "",
}: ToggleButtonProps) {
  const duration = reducedMotion ? 0 : 0.3;

  return (
    <motion.div
      style={{ rotate: rotation }}
      transition={{ duration, type: "spring", stiffness: 100, damping: 15 }}
      className={className}
    >
      {isExpanded ? expandedIcon : collapsedIcon}
    </motion.div>
  );
}