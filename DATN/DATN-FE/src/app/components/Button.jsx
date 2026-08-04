import React from 'react';

export function Button({
  children,
  variant = 'primary', // primary, secondary, outline, danger, ghost
  size = 'md',
  className = '',
  icon: Icon,
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-bold rounded-xl transition duration-200 active:scale-95 shadow-sm focus:outline-none';
  
  const variants = {
    primary: 'bg-gradient-to-r from-orange-500 to-pink-600 text-white hover:from-orange-600 hover:to-pink-700 shadow-orange-500/10',
    secondary: 'bg-gray-100 border border-gray-200 text-gray-700 hover:bg-gray-200 shadow-none',
    outline: 'border-2 border-orange-600 text-orange-600 hover:bg-orange-50 bg-transparent shadow-none',
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-red-600/10',
    ghost: 'bg-transparent text-gray-500 hover:bg-gray-100 hover:text-orange-600 shadow-none border-none',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3.5 text-base',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {Icon && <Icon className="h-4 w-4 mr-1.5" />}
      {children}
    </button>
  );
}
