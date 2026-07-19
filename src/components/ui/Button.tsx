import React from "react";
import { Loader2 } from "lucide-react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-brand-green hover:bg-brand-green/90 text-white shadow-md",
  secondary: "bg-white border border-green-800/10 text-green-dark hover:bg-mint cursor-pointer",
  ghost: "bg-transparent hover:bg-mint text-green-dark cursor-pointer",
  danger: "bg-red-500 hover:bg-red-600 text-white shadow-md",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "text-xs font-bold py-2 px-4 rounded-full",
  md: "text-xs font-bold py-2.5 px-5 rounded-full",
  lg: "text-sm font-bold py-3 px-6 rounded-full",
};

export default function Button(props: ButtonProps) {
  const { variant = "primary", size = "md", loading = false, children, className = "", disabled = false, onClick, type = "button" } = props;

  return (
    <button
      type={type}
      className={`
        flex items-center justify-center gap-2
        disabled:bg-brand-green/60 disabled:cursor-not-allowed
        transition-all duration-200 font-sans
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading && <Loader2 size={14} className="animate-spin" />}
      {children}
    </button>
  );
}