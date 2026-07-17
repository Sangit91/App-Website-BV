import React, { forwardRef } from "react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, placeholder, className = "", ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="block text-xs font-bold text-green-dark">
            {label}
            {props.required && <span className="text-peach ml-0.5">*</span>}
          </label>
        )}
        <select
          ref={ref}
          className={`
            w-full bg-white border rounded-xl py-2.5 px-3
            text-xs md:text-sm text-ink font-semibold font-sans
            focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green
            disabled:bg-gray-100 disabled:cursor-not-allowed
            ${error 
              ? "border-red-400 focus:border-red-500 focus:ring-red-500" 
              : "border-green-800/20"
            }
            ${className}
          `}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && (
          <p className="text-xs text-red-500 font-semibold">{error}</p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";

export default Select;