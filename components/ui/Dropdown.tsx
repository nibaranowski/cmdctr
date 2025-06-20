import React, { forwardRef, useState, useRef, useEffect } from 'react';

export interface DropdownOption {
  value: string;
  label: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export interface DropdownProps {
  options: DropdownOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  className?: string;
}

const Dropdown = forwardRef<HTMLDivElement, DropdownProps>(
  (
    {
      options,
      value,
      onChange,
      placeholder = 'Select an option',
      label,
      error,
      disabled = false,
      size = 'md',
      fullWidth = false,
      className = '',
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const listboxRef = useRef<HTMLUListElement>(null);

    const selectedOption = options.find(option => option.value === value);
    const hasError = !!error;

    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-4 py-3 text-base',
    };

    const baseClasses = [
      'relative w-full border rounded-lg transition-colors',
      'focus:outline-none focus:ring-2 focus:ring-offset-0',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      'cursor-pointer',
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

    const triggerClasses = [
      ...baseClasses,
      sizeClasses[size],
      ...stateClasses,
      widthClass,
      className,
    ].join(' ');

    // Handle keyboard navigation
    useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (!isOpen) return;

        switch (event.key) {
          case 'ArrowDown':
            event.preventDefault();
            setFocusedIndex(prev => 
              prev < options.length - 1 ? prev + 1 : 0
            );
            break;
          case 'ArrowUp':
            event.preventDefault();
            setFocusedIndex(prev => 
              prev > 0 ? prev - 1 : options.length - 1
            );
            break;
          case 'Enter':
          case ' ':
            event.preventDefault();
            if (focusedIndex >= 0 && options[focusedIndex] && !options[focusedIndex].disabled) {
              handleSelect(options[focusedIndex].value);
            }
            break;
          case 'Escape':
            setIsOpen(false);
            setFocusedIndex(-1);
            break;
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, focusedIndex, options]);

    // Handle click outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setIsOpen(false);
          setFocusedIndex(-1);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (selectedValue: string) => {
      onChange?.(selectedValue);
      setIsOpen(false);
      setFocusedIndex(-1);
    };

    const handleTriggerClick = () => {
      if (!disabled) {
        setIsOpen(!isOpen);
        setFocusedIndex(-1);
      }
    };

    return (
      <div ref={dropdownRef} className={fullWidth ? 'w-full' : 'inline-block'}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        
        <div className="relative">
          <button
            type="button"
            className={triggerClasses}
            onClick={handleTriggerClick}
            disabled={disabled}
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            aria-labelledby={label ? 'dropdown-label' : undefined}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center min-w-0 flex-1">
                {selectedOption?.icon && (
                  <span className="mr-2 flex-shrink-0">{selectedOption.icon}</span>
                )}
                <span className="truncate">
                  {selectedOption ? selectedOption.label : placeholder}
                </span>
              </div>
              <svg
                className={`ml-2 h-4 w-4 text-gray-400 transition-transform ${
                  isOpen ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </button>

          {isOpen && (
            <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
              <ul
                ref={listboxRef}
                role="listbox"
                className="py-1 max-h-60 overflow-auto"
              >
                {options.map((option, index) => (
                  <li
                    key={option.value}
                    role="option"
                    aria-selected={option.value === value}
                    className={`
                      px-4 py-2 cursor-pointer transition-colors
                      ${option.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}
                      ${option.value === value ? 'bg-blue-50 text-blue-900' : 'text-gray-900'}
                      ${focusedIndex === index ? 'bg-gray-100' : ''}
                    `}
                    onClick={() => !option.disabled && handleSelect(option.value)}
                  >
                    <div className="flex items-center">
                      {option.icon && (
                        <span className="mr-2 flex-shrink-0">{option.icon}</span>
                      )}
                      <span className="truncate">{option.label}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {error && (
          <p className="mt-1 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Dropdown.displayName = 'Dropdown';

export default Dropdown; 