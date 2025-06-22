'use client';

import { motion } from 'framer-motion';
import React from 'react';

import { useTheme } from './ThemeProvider';

interface ThemeToggleProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export default function ThemeToggle({ 
  className = '', 
  size = 'md',
  showLabel = false 
}: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const handleToggle = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('system');
    } else {
      setTheme('light');
    }
  };

  const getIcon = () => {
    if (theme === 'system') {
      return resolvedTheme === 'dark' ? (
        <svg className={iconSizes[size]} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      ) : (
        <svg className={iconSizes[size]} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      );
    }
    
    return theme === 'dark' ? (
      <svg className={iconSizes[size]} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ) : (
      <svg className={iconSizes[size]} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
      </svg>
    );
  };

  const getLabel = () => {
    if (theme === 'system') {
      return `System (${resolvedTheme})`;
    }
    return theme === 'dark' ? 'Light mode' : 'Dark mode';
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <motion.button
        type="button"
        onClick={handleToggle}
        className={`
          ${sizeClasses[size]}
          flex items-center justify-center
          rounded-lg
          bg-surface hover:bg-surface-hover
          border border-border hover:border-border-hover
          text-text-secondary hover:text-text-primary
          transition-colors duration-200
          focus:outline-none focus:ring-2 focus:ring-border-focus focus:ring-offset-2
          focus:ring-offset-background
        `}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={getLabel()}
        title={getLabel()}
      >
        <motion.div
          key={theme + resolvedTheme}
          initial={{ rotate: -90, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          exit={{ rotate: 90, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {getIcon()}
        </motion.div>
      </motion.button>
      
      {showLabel && (
        <span className="text-sm text-text-secondary font-medium">
          {getLabel()}
        </span>
      )}
    </div>
  );
} 