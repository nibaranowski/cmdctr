import { motion, AnimatePresence } from 'framer-motion';
import React, { useState, useRef } from 'react';

export interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  defaultOpen?: string[];
  variant?: 'default' | 'bordered' | 'separated';
  size?: 'sm' | 'md' | 'lg';
  onChange?: (openItems: string[]) => void;
  className?: string;
}

const Accordion: React.FC<AccordionProps> = ({
  items,
  allowMultiple = false,
  defaultOpen = [],
  variant = 'default',
  size = 'md',
  onChange,
  className = '',
}) => {
  const [openItems, setOpenItems] = useState<string[]>(defaultOpen);
  const itemRefs = useRef<Record<string, HTMLButtonElement>>({});

  const variantClasses = {
    default: {
      container: 'space-y-1',
      item: 'bg-white border border-gray-200 rounded-lg',
      header: 'hover:bg-gray-50',
    },
    bordered: {
      container: 'border border-gray-200 rounded-lg divide-y divide-gray-200',
      item: 'bg-white',
      header: 'hover:bg-gray-50',
    },
    separated: {
      container: 'space-y-2',
      item: 'bg-white border border-gray-200 rounded-lg shadow-sm',
      header: 'hover:bg-gray-50',
    },
  };

  const sizeClasses = {
    sm: {
      header: 'px-3 py-2 text-sm',
      content: 'px-3 pb-2 text-sm',
    },
    md: {
      header: 'px-4 py-3 text-sm',
      content: 'px-4 pb-3 text-sm',
    },
    lg: {
      header: 'px-6 py-4 text-base',
      content: 'px-6 pb-4 text-base',
    },
  };

  const handleToggle = (itemId: string) => {
    const item = items.find(item => item.id === itemId);
    if (item?.disabled) return;

    let newOpenItems: string[];

    if (allowMultiple) {
      if (openItems.includes(itemId)) {
        newOpenItems = openItems.filter(id => id !== itemId);
      } else {
        newOpenItems = [...openItems, itemId];
      }
    } else {
      newOpenItems = openItems.includes(itemId) ? [] : [itemId];
    }

    setOpenItems(newOpenItems);
    onChange?.(newOpenItems);
  };

  const handleKeyDown = (event: React.KeyboardEvent, itemId: string) => {
    const currentIndex = items.findIndex(item => item.id === itemId);
    
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        const nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
        const nextItem = items[nextIndex];
        if (nextItem && !nextItem.disabled) {
          itemRefs.current[nextItem.id]?.focus();
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
        const prevItem = items[prevIndex];
        if (prevItem && !prevItem.disabled) {
          itemRefs.current[prevItem.id]?.focus();
        }
        break;
      case 'Home':
        event.preventDefault();
        const firstItem = items[0];
        if (firstItem && !firstItem.disabled) {
          itemRefs.current[firstItem.id]?.focus();
        }
        break;
      case 'End':
        event.preventDefault();
        const lastItem = items[items.length - 1];
        if (lastItem && !lastItem.disabled) {
          itemRefs.current[lastItem.id]?.focus();
        }
        break;
    }
  };

  return (
    <div
      className={`${variantClasses[variant].container} ${className}`}
      role="region"
      aria-label="Accordion"
    >
      {items.map((item) => {
        const isOpen = openItems.includes(item.id);
        const isDisabled = item.disabled;
        
        return (
          <div
            key={item.id}
            className={variantClasses[variant].item}
          >
            <button
              ref={(el) => {
                if (el) itemRefs.current[item.id] = el;
              }}
              onClick={() => handleToggle(item.id)}
              onKeyDown={(e) => handleKeyDown(e, item.id)}
              disabled={isDisabled}
              className={`
                w-full flex items-center justify-between text-left
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-colors duration-200
                ${sizeClasses[size].header}
                ${variantClasses[variant].header}
              `}
              aria-expanded={isOpen}
              aria-disabled={isDisabled}
            >
              <div className="flex items-center min-w-0 flex-1">
                {item.icon && (
                  <span className="mr-3 flex-shrink-0">{item.icon}</span>
                )}
                <span className="font-medium truncate">{item.title}</span>
              </div>
              
              <motion.div
                className="flex-shrink-0 ml-2"
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <svg
                  className="w-4 h-4 text-gray-400"
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
              </motion.div>
            </button>
            
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className={sizeClasses[size].content}>
                    {item.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};

export default Accordion; 