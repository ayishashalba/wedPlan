import React from 'react';

const LoadingSpinner = ({ size = 'md', text = 'Loading...' }) => {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4'
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div
        className={`${sizeClasses[size] || sizeClasses.md} rounded-full border-wed-gold border-t-transparent animate-spin`}
      />
      {text && <p className="mt-3 text-sm font-medium text-wed-brown-muted">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;

