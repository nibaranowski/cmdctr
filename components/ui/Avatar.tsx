import { User } from 'lucide-react';
import React, { forwardRef, useState } from 'react';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  variant?: 'default' | 'rounded' | 'square';
  fallback?: React.ReactNode;
  status?: 'online' | 'offline' | 'away' | 'busy';
  children?: React.ReactNode;
}

const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  (
    {
      src,
      alt,
      size = 'md',
      variant = 'default',
      fallback,
      status,
      children,
      className = '',
      ...props
    },
    ref
  ) => {
    const [imageError, setImageError] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    const sizeClasses = {
      xs: 'w-6 h-6 text-xs',
      sm: 'w-8 h-8 text-sm',
      md: 'w-10 h-10 text-sm',
      lg: 'w-12 h-12 text-base',
      xl: 'w-16 h-16 text-lg',
      '2xl': 'w-20 h-20 text-xl',
    };

    const variantClasses = {
      default: 'rounded-full',
      rounded: 'rounded-lg',
      square: 'rounded-md',
    };

    const statusClasses = {
      online: 'bg-success-500',
      offline: 'bg-gray-400',
      away: 'bg-warning-500',
      busy: 'bg-error-500',
    };

    const statusSizes = {
      xs: 'w-1.5 h-1.5',
      sm: 'w-2 h-2',
      md: 'w-2.5 h-2.5',
      lg: 'w-3 h-3',
      xl: 'w-4 h-4',
      '2xl': 'w-5 h-5',
    };

    const baseClasses = [
      'relative inline-flex items-center justify-center',
      'bg-surface border border-border',
      'overflow-hidden',
      'transition-all duration-200',
      sizeClasses[size],
      variantClasses[variant],
      className,
    ].join(' ');

    const handleImageError = () => {
      setImageError(true);
    };

    const handleImageLoad = () => {
      setImageLoaded(true);
    };

    const renderContent = () => {
      if (children) {
        return children;
      }

      if (src && !imageError) {
        return (
          <img
            src={src}
            alt={alt || 'Avatar'}
            className={`w-full h-full object-cover transition-opacity duration-200 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onError={handleImageError}
            onLoad={handleImageLoad}
          />
        );
      }

      if (fallback) {
        return fallback;
      }

      return <User className="w-1/2 h-1/2 text-text-tertiary" />;
    };

    return (
      <div ref={ref} className={baseClasses} {...props}>
        {renderContent()}
        
        {status && (
          <div
            className={`
              absolute bottom-0 right-0
              ${statusSizes[size]}
              ${statusClasses[status]}
              rounded-full border-2 border-white
              shadow-sm
            `}
            aria-label={`Status: ${status}`}
          />
        )}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';

export default Avatar; 