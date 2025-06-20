import React, { forwardRef } from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  children: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      children,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    const baseClasses = [
      'inline-flex items-center justify-center font-medium transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      'select-none transform hover:scale-[1.02] active:scale-[0.98]',
    ];

    const sizeClasses = {
      xs: 'px-2 py-1 text-xs rounded-md gap-1',
      sm: 'px-3 py-1.5 text-sm rounded-md gap-1.5',
      md: 'px-4 py-2 text-sm rounded-lg gap-2',
      lg: 'px-6 py-3 text-base rounded-lg gap-2',
    };

    const variantClasses = {
      primary: [
        'bg-blue-600 text-white hover:bg-blue-700',
        'focus:ring-blue-500 active:bg-blue-800',
        'shadow-sm hover:shadow-md',
      ],
      secondary: [
        'bg-gray-100 text-gray-900 hover:bg-gray-200',
        'focus:ring-gray-500 active:bg-gray-300',
        'border border-gray-300',
      ],
      ghost: [
        'bg-transparent text-gray-700 hover:bg-gray-100',
        'focus:ring-gray-500 active:bg-gray-200',
      ],
      danger: [
        'bg-red-600 text-white hover:bg-red-700',
        'focus:ring-red-500 active:bg-red-800',
        'shadow-sm hover:shadow-md',
      ],
      success: [
        'bg-green-600 text-white hover:bg-green-700',
        'focus:ring-green-500 active:bg-green-800',
        'shadow-sm hover:shadow-md',
      ],
    };

    const widthClass = fullWidth ? 'w-full' : '';

    const classes = [
      ...baseClasses,
      sizeClasses[size],
      ...variantClasses[variant],
      widthClass,
      className,
    ].join(' ');

    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        className={classes}
        disabled={isDisabled}
        {...props}
      >
        {loading && (
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        )}
        {!loading && leftIcon && (
          <span className="flex-shrink-0">{leftIcon}</span>
        )}
        <span className="flex-shrink-0">{children}</span>
        {!loading && rightIcon && (
          <span className="flex-shrink-0">{rightIcon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button; 