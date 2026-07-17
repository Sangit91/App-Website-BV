import React from "react";

type CardVariant = "default" | "elevated" | "bordered";

interface CardProps {
  variant?: CardVariant;
  padding?: "none" | "sm" | "md" | "lg";
  hoverable?: boolean;
  className?: string;
  children: React.ReactNode;
}

const variantClasses: Record<CardVariant, string> = {
  default: "bg-white border border-green-800/10 shadow-sm",
  elevated: "bg-white shadow-lg",
  bordered: "bg-white border-2 border-brand-green/20",
};

const paddingClasses: Record<"none" | "sm" | "md" | "lg", string> = {
  none: "",
  sm: "p-3",
  md: "p-5",
  lg: "p-6",
};

export default function Card({
  variant = "default",
  padding = "md",
  hoverable = false,
  className = "",
  children,
}: CardProps) {
  return (
    <div
      className={`
        rounded-2xl transition-all duration-200
        ${variantClasses[variant]}
        ${paddingClasses[padding]}
        ${hoverable ? "hover:shadow-md hover:scale-[1.01] cursor-pointer" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
}