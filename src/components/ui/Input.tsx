import React, { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className = "", ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="block text-xs font-bold text-green-dark">
            {label}
            {props.required && <span className="text-peach ml-0.5">*</span>}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-green/70">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`
              w-full bg-white border rounded-xl py-2.5 px-4
              text-xs md:text-sm text-ink font-medium font-sans
              focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green
              disabled:bg-gray-100 disabled:cursor-not-allowed
              ${icon ? "pl-10" : ""}
              ${error 
                ? "border-red-400 focus:border-red-500 focus:ring-red-500" 
                : "border-green-800/20"
              }
              ${className}
            `}
            {...props}
          />
        </div>
        {error && (
          <p className="text-xs text-red-500 font-semibold">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;