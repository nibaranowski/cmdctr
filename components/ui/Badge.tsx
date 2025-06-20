import React, { forwardRef } from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
  children: React.ReactNode;
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      variant = 'default',
      size = 'md',
      dot = false,
      children,
      className = '',
      ...props
    },
    ref
  ) => {
    const baseClasses = [
      'inline-flex items-center font-medium rounded-full',
      'transition-colors duration-200',
    ];

    const variantClasses = {
      default: [
        'bg-gray-100 text-gray-800',
        'hover:bg-gray-200',
      ],
      primary: [
        'bg-blue-100 text-blue-800',
        'hover:bg-blue-200',
      ],
      success: [
        'bg-green-100 text-green-800',
        'hover:bg-green-200',
      ],
      warning: [
        'bg-yellow-100 text-yellow-800',
        'hover:bg-yellow-200',
      ],
      danger: [
        'bg-red-100 text-red-800',
        'hover:bg-red-200',
      ],
      info: [
        'bg-cyan-100 text-cyan-800',
        'hover:bg-cyan-200',
      ],
    };

    const sizeClasses = {
      sm: 'px-2 py-0.5 text-xs gap-1',
      md: 'px-2.5 py-1 text-sm gap-1.5',
      lg: 'px-3 py-1.5 text-base gap-2',
    };

    const dotClasses = {
      default: 'bg-gray-400',
      primary: 'bg-blue-500',
      success: 'bg-green-500',
      warning: 'bg-yellow-500',
      danger: 'bg-red-500',
      info: 'bg-cyan-500',
    };

    const classes = [
      ...baseClasses,
      ...variantClasses[variant],
      sizeClasses[size],
      className,
    ].join(' ');

    return (
      <span
        ref={ref}
        className={classes}
        {...props}
      >
        {dot && (
          <div className={`w-1.5 h-1.5 rounded-full ${dotClasses[variant]}`} />
        )}
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

export default Badge; 