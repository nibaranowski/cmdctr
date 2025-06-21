import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  showValue?: boolean;
  animated?: boolean;
  striped?: boolean;
  label?: string;
}

const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  (
    {
      value,
      max = 100,
      size = 'md',
      variant = 'default',
      showValue = false,
      animated = true,
      striped = false,
      label,
      className = '',
      ...props
    },
    ref
  ) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    const sizeClasses = {
      sm: 'h-1',
      md: 'h-2',
      lg: 'h-3',
    };

    const variantClasses = {
      default: 'bg-primary-500',
      success: 'bg-success-500',
      warning: 'bg-warning-500',
      error: 'bg-error-500',
      info: 'bg-info-500',
    };

    const baseClasses = [
      'relative w-full bg-surface border border-border rounded-full overflow-hidden',
      sizeClasses[size],
      className,
    ].join(' ');

    const progressClasses = [
      'h-full transition-all duration-500 ease-out',
      variantClasses[variant],
      striped && 'bg-gradient-to-r from-transparent via-white/20 to-transparent bg-[length:20px_100%]',
      animated && 'animate-pulse',
    ].filter(Boolean).join(' ');

    return (
      <div ref={ref} className="w-full" {...props}>
        {(label || showValue) && (
          <div className="flex items-center justify-between mb-2">
            {label && (
              <span className="text-sm font-medium text-text-primary">{label}</span>
            )}
            {showValue && (
              <span className="text-sm text-text-secondary">
                {Math.round(percentage)}%
              </span>
            )}
          </div>
        )}
        
        <div className={baseClasses}>
          <motion.div
            className={progressClasses}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            role="progressbar"
            aria-valuenow={value}
            aria-valuemin={0}
            aria-valuemax={max}
            aria-label={label || `Progress: ${Math.round(percentage)}%`}
          />
        </div>
      </div>
    );
  }
);

Progress.displayName = 'Progress';

export default Progress; 