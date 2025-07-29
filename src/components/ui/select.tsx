import React from "react";

interface Option {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: Option[];
  placeholder?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  error,
  options,
  placeholder = "Selecione...",
  className = "",
  id,
  ...props
}) => {
  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={selectId}
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          {label}
        </label>
      )}

      <select
        id={selectId}
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
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};
