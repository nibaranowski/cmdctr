import { motion } from 'framer-motion';
import React, { forwardRef } from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined' | 'ghost' | 'surface';
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
      'focus:ring-border-focus',
    ];

    const variantClasses = {
      default: [
        'bg-surface',
        'border',
        'border-border',
        'shadow-sm',
        hover ? 'hover:shadow-md' : '',
        hover ? 'hover:border-border-hover' : '',
      ],
      elevated: [
        'bg-surface',
        'border',
        'border-border',
        'shadow-md',
        hover ? 'hover:shadow-lg' : '',
        hover ? 'hover:border-border-hover' : '',
      ],
      outlined: [
        'bg-surface',
        'border-2',
        'border-border',
        hover ? 'hover:border-border-hover' : '',
      ],
      surface: [
        'bg-surface',
        'border',
        'border-border',
        'shadow-lg',
        hover ? 'hover:shadow-xl' : '',
        hover ? 'hover:border-border-hover' : '',
      ],
      ghost: [
        'bg-transparent',
        hover ? 'hover:bg-surface-hover' : '',
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
            <div className="absolute inset-0 bg-surface/80 backdrop-blur-sm flex items-center justify-center z-10">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary-600 border-t-transparent" />
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
          <div className="absolute inset-0 bg-surface/80 backdrop-blur-sm flex items-center justify-center z-10">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary-600 border-t-transparent" />
          </div>
        )}
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export default Card; 