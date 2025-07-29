import React from "react";

interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  className = "",
}) => {
  return (
    <div
      className={`bg-white rounded-xl shadow-sm border border-[#770d7c]/20 p-6 ${className}`}
    >
      {(title || subtitle) && (
        <div className="mb-4">
          {title && (
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {title}
            </h3>
          )}
          {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  );
};
