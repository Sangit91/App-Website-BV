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
  return (
    <motion.div
      style={{ rotate: rotation }}
      animate={isExpanded ? { scale: [1, 1.2, 1] } : { scale: [1, 1.2, 1] }}
      transition={{ duration: reducedMotion ? 0 : 0.3, type: "spring", stiffness: 300 }}
      className={className}
    >
      <motion.div
        initial={false}
        animate={{
          rotate: isExpanded ? 0 : 0,
          scale: isExpanded ? 1 : 1,
        }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      >
        {isExpanded ? expandedIcon : collapsedIcon}
      </motion.div>
    </motion.div>
  );
}