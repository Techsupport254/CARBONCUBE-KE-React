import React from 'react';

// Enhanced badge component with better contrast
const EnhancedBadge = ({ tier, className = '', ...props }) => {
  const getTierConfig = (tier) => {
    switch (tier) {
      case 'Premium':
        return {
          bgColor: 'bg-amber-500',
          textColor: 'text-gray-900',
          borderColor: 'border-amber-600'
        };
      case 'Standard':
        return {
          bgColor: 'bg-emerald-600',
          textColor: 'text-white',
          borderColor: 'border-emerald-700'
        };
      case 'Basic':
        return {
          bgColor: 'bg-blue-600',
          textColor: 'text-white',
          borderColor: 'border-blue-700'
        };
      default:
        return {
          bgColor: 'bg-gray-600',
          textColor: 'text-white',
          borderColor: 'border-gray-700'
        };
    }
  };

  const config = getTierConfig(tier);

  return (
    <div
      className={`absolute top-1 left-1 px-1.5 py-0.5 text-[10px] font-semibold rounded border ${config.bgColor} ${config.textColor} ${config.borderColor} shadow-sm ${className}`}
      {...props}
    >
      {tier}
    </div>
  );
};

// Enhanced heading component with proper hierarchy
const EnhancedHeading = ({ level = 1, children, className = '', ...props }) => {
  const baseClasses = 'font-bold leading-tight';
  const sizeClasses = {
    1: 'text-3xl md:text-4xl lg:text-5xl',
    2: 'text-2xl md:text-3xl lg:text-4xl',
    3: 'text-xl md:text-2xl lg:text-3xl',
    4: 'text-lg md:text-xl lg:text-2xl',
    5: 'text-base md:text-lg lg:text-xl',
    6: 'text-sm md:text-base lg:text-lg'
  };

  const Tag = `h${level}`;
  const classes = `${baseClasses} ${sizeClasses[level] || sizeClasses[1]} ${className}`;

  return (
    <Tag className={classes} {...props}>
      {children}
    </Tag>
  );
};

// Enhanced text component with better contrast
const EnhancedText = ({ children, className = '', variant = 'body', ...props }) => {
  const variants = {
    body: 'text-gray-800',
    muted: 'text-gray-600',
    light: 'text-gray-500',
    white: 'text-white',
    dark: 'text-gray-900'
  };

  const classes = `${variants[variant]} ${className}`;

  return (
    <p className={classes} {...props}>
      {children}
    </p>
  );
};

// Enhanced button component with better contrast
const EnhancedButton = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  className = '', 
  ...props 
}) => {
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white border-blue-700',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white border-gray-700',
    success: 'bg-green-600 hover:bg-green-700 text-white border-green-700',
    danger: 'bg-red-600 hover:bg-red-700 text-white border-red-700',
    warning: 'bg-yellow-600 hover:bg-yellow-700 text-gray-900 border-yellow-700',
    info: 'bg-cyan-600 hover:bg-cyan-700 text-white border-cyan-700'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed';
  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
};

// Enhanced card component with better contrast
const EnhancedCard = ({ children, className = '', ...props }) => {
  return (
    <div 
      className={`bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

// Enhanced link component with better contrast
const EnhancedLink = ({ children, className = '', ...props }) => {
  return (
    <a 
      className={`text-blue-600 hover:text-blue-800 underline hover:no-underline transition-colors duration-200 ${className}`}
      {...props}
    >
      {children}
    </a>
  );
};

export {
  EnhancedBadge,
  EnhancedHeading,
  EnhancedText,
  EnhancedButton,
  EnhancedCard,
  EnhancedLink
};
