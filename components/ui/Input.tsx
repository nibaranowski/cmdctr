import React, { forwardRef } from 'react';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      size = 'md',
      fullWidth = false,
      loading = false,
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = !!error;

    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-4 py-3 text-base',
    };

    const baseClasses = [
      'block w-full border rounded-lg transition-colors',
      'focus:outline-none focus:ring-2 focus:ring-offset-0',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      'placeholder:text-gray-400',
    ];

    const stateClasses = hasError
      ? [
          'border-red-300 text-red-900',
          'focus:border-red-500 focus:ring-red-500',
          'bg-red-50',
        ]
      : [
          'border-gray-300 text-gray-900',
          'focus:border-blue-500 focus:ring-blue-500',
          'hover:border-gray-400',
          'bg-white',
        ];

    const widthClass = fullWidth ? 'w-full' : '';

    const inputClasses = [
      ...baseClasses,
      sizeClasses[size],
      ...stateClasses,
      widthClass,
      leftIcon && 'pl-10',
      rightIcon && 'pr-10',
      className,
    ].join(' ');

    return (
      <div className={fullWidth ? 'w-full' : 'inline-block'}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <div className="text-gray-400">{leftIcon}</div>
            </div>
          )}
          
          <input
            ref={ref}
            id={inputId}
            className={inputClasses}
            aria-invalid={hasError}
            aria-describedby={
              error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
            }
            {...props}
          />
          
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <div className="text-gray-400">{rightIcon}</div>
            </div>
          )}
          
          {loading && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
            </div>
          )}
        </div>
        
        {error && (
          <p
            id={`${inputId}-error`}
            className="mt-1 text-sm text-red-600"
            role="alert"
          >
            {error}
          </p>
        )}
        
        {helperText && !error && (
          <p
            id={`${inputId}-helper`}
            className="mt-1 text-sm text-gray-500"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input; 