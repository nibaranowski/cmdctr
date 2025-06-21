import React, { forwardRef } from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'outline';
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
      'inline-flex items-center justify-center font-medium',
      'transition-all duration-200 ease-out',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      'select-none transform hover:scale-[1.02] active:scale-[0.98]',
      'border border-transparent',
      'relative overflow-hidden',
    ];

    const sizeClasses = {
      xs: 'px-2 py-1 text-xs rounded-md gap-1 h-7',
      sm: 'px-3 py-1.5 text-sm rounded-lg gap-1.5 h-8',
      md: 'px-4 py-2 text-sm rounded-lg gap-2 h-10',
      lg: 'px-6 py-3 text-base rounded-lg gap-2 h-12',
    };

    const variantClasses = {
      primary: [
        'bg-primary-600 text-white hover:bg-primary-700',
        'focus:ring-primary-500 active:bg-primary-800',
        'shadow-sm hover:shadow-md',
        'before:absolute before:inset-0 before:bg-white before:opacity-0',
        'before:hover:opacity-10 before:transition-opacity',
      ],
      secondary: [
        'bg-surface text-text-primary hover:bg-surface-hover',
        'focus:ring-border-focus active:bg-surface-active',
        'border-border hover:border-border-hover',
        'shadow-sm hover:shadow-md',
      ],
      outline: [
        'bg-transparent text-text-primary hover:bg-surface-hover',
        'focus:ring-border-focus active:bg-surface-active',
        'border-border hover:border-border-hover',
        'hover:shadow-sm',
      ],
      ghost: [
        'bg-transparent text-text-secondary hover:text-text-primary',
        'focus:ring-border-focus active:bg-surface-active',
        'hover:bg-surface-hover',
        'hover:shadow-sm',
      ],
      danger: [
        'bg-error-600 text-white hover:bg-error-700',
        'focus:ring-error-500 active:bg-error-800',
        'shadow-sm hover:shadow-md',
      ],
      success: [
        'bg-success-600 text-white hover:bg-success-700',
        'focus:ring-success-500 active:bg-success-800',
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
        aria-disabled={isDisabled}
        {...props}
      >
        {loading && (
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        )}
        {!loading && leftIcon && (
          <span className="flex-shrink-0" aria-hidden="true">{leftIcon}</span>
        )}
        <span className="flex-shrink-0">{children}</span>
        {!loading && rightIcon && (
          <span className="flex-shrink-0" aria-hidden="true">{rightIcon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button; 