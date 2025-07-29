import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  className = "",
  id,
  ...props
}) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          {label}
        </label>
      )}

      <input
        id={inputId}
        className={`
          w-full px-3 py-2 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1
          ${
            error
              ? "border-red-300 focus:ring-red-500 focus:border-red-500"
              : "border-belle-secondary-200 focus:ring-belle-primary-500 focus:border-belle-primary-500"
          }
          ${props.disabled ? "bg-gray-50 cursor-not-allowed" : "bg-white"}
          ${className}
        `}
        {...props}
      />

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

      {helperText && !error && (
        <p className="text-gray-500 text-sm mt-1">{helperText}</p>
      )}
    </div>
  );
};
