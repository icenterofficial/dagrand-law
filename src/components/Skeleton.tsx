import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'rectangular' | 'circular' | 'text';
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = "", variant = 'rectangular' }) => {
  const baseClasses = "animate-pulse bg-gray-200 dark:bg-gray-700";
  
  let variantClasses = "";
  switch (variant) {
    case 'circular':
      variantClasses = "rounded-full";
      break;
    case 'text':
      variantClasses = "rounded-md h-4";
      break;
    default:
      variantClasses = "rounded-sm";
  }

  return <div className={`${baseClasses} ${variantClasses} ${className}`}></div>;
};