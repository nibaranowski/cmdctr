import { motion } from 'framer-motion';
import React, { forwardRef } from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined' | 'ghost';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  interactive?: boolean;
  loading?: boolean;
  children: React.ReactNode;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = 'default',
      padding = 'md',
      hover = false,
      interactive = false,
      loading = false,
      children,
      className = '',
      ...props
    },
    ref
  ) => {
    const baseClasses = [
      'relative',
      'overflow-hidden',
      'transition-all',
      'duration-200',
      'focus:outline-none',
      'focus:ring-2',
      'focus:ring-offset-2',
    ];

    const variantClasses = {
      default: [
        'bg-white',
        'border',
        'border-gray-200',
        'shadow-sm',
        hover ? 'hover:shadow-md' : '',
        hover ? 'hover:border-gray-300' : '',
      ],
      elevated: [
        'bg-white',
        'border',
        'border-gray-200',
        'shadow-md',
        hover ? 'hover:shadow-lg' : '',
        hover ? 'hover:border-gray-300' : '',
      ],
      outlined: [
        'bg-white',
        'border-2',
        'border-gray-200',
        hover ? 'hover:border-gray-300' : '',
      ],
      ghost: [
        'bg-transparent',
        hover ? 'hover:bg-gray-50' : '',
      ],
    };

    const paddingClasses = {
      none: '',
      sm: 'p-3',
      md: 'p-4',
      lg: 'p-6',
    };

    const interactiveClasses = interactive ? [
      'cursor-pointer',
      'hover:scale-[1.02]',
      'active:scale-[0.98]',
      'focus:ring-blue-500',
    ] : [];

    const classes = [
      ...baseClasses,
      ...variantClasses[variant],
      paddingClasses[padding],
      ...interactiveClasses,
      className,
    ].filter(Boolean).join(' ');

    if (interactive) {
      return (
        <motion.div
          ref={ref}
          className={classes}
          data-testid="card-root"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          {...(props as any)}
        >
          {loading && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent" />
            </div>
          )}
          {children}
        </motion.div>
      );
    }

    return (
      <div
        ref={ref}
        className={classes}
        data-testid="card-root"
        {...props}
      >
        {loading && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent" />
          </div>
        )}
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export default Card; 