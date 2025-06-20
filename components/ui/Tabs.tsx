import { motion } from 'framer-motion';
import React, { useState, useRef, useEffect } from 'react';

export interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export interface TabsProps {
  items: TabItem[];
  defaultActiveTab?: string;
  variant?: 'default' | 'pills' | 'underline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  onChange?: (activeTab: string) => void;
  className?: string;
}

const Tabs: React.FC<TabsProps> = ({
  items,
  defaultActiveTab,
  variant = 'default',
  size = 'md',
  fullWidth = false,
  onChange,
  className = '',
}) => {
  const [activeTab, setActiveTab] = useState(defaultActiveTab || items[0]?.id);
  const [indicatorStyle, setIndicatorStyle] = useState<{ left: number; width: number }>({ left: 0, width: 0 });
  const tabRefs = useRef<Record<string, HTMLButtonElement>>({});

  const variantClasses = {
    default: {
      container: 'border-b border-gray-200',
      tab: 'border-b-2 border-transparent',
      active: 'border-blue-500 text-blue-600',
      inactive: 'text-gray-500 hover:text-gray-700 hover:border-gray-300',
    },
    pills: {
      container: 'space-x-1',
      tab: 'rounded-lg',
      active: 'bg-blue-100 text-blue-700',
      inactive: 'text-gray-500 hover:text-gray-700 hover:bg-gray-100',
    },
    underline: {
      container: 'border-b border-gray-200',
      tab: 'border-b-2 border-transparent',
      active: 'border-gray-900 text-gray-900',
      inactive: 'text-gray-500 hover:text-gray-700 hover:border-gray-300',
    },
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const widthClass = fullWidth ? 'flex-1' : '';

  useEffect(() => {
    if (activeTab && tabRefs.current[activeTab]) {
      const activeTabElement = tabRefs.current[activeTab];
      const container = activeTabElement.parentElement;
      
      if (container && variant === 'default') {
        const rect = activeTabElement.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        
        setIndicatorStyle({
          left: rect.left - containerRect.left,
          width: rect.width,
        });
      }
    }
  }, [activeTab, variant]);

  const handleTabClick = (tabId: string) => {
    if (items.find(item => item.id === tabId)?.disabled) return;
    
    setActiveTab(tabId);
    onChange?.(tabId);
  };

  const handleKeyDown = (event: React.KeyboardEvent, tabId: string) => {
    const currentIndex = items.findIndex(item => item.id === tabId);
    
    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
        const prevTab = items[prevIndex];
        if (prevTab && !prevTab.disabled) {
          handleTabClick(prevTab.id);
          tabRefs.current[prevTab.id]?.focus();
        }
        break;
      case 'ArrowRight':
        event.preventDefault();
        const nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
        const nextTab = items[nextIndex];
        if (nextTab && !nextTab.disabled) {
          handleTabClick(nextTab.id);
          tabRefs.current[nextTab.id]?.focus();
        }
        break;
      case 'Home':
        event.preventDefault();
        const firstTab = items[0];
        if (firstTab && !firstTab.disabled) {
          handleTabClick(firstTab.id);
          tabRefs.current[firstTab.id]?.focus();
        }
        break;
      case 'End':
        event.preventDefault();
        const lastTab = items[items.length - 1];
        if (lastTab && !lastTab.disabled) {
          handleTabClick(lastTab.id);
          tabRefs.current[lastTab.id]?.focus();
        }
        break;
    }
  };

  const activeItem = items.find(item => item.id === activeTab);

  return (
    <div className={className}>
      <div
        className={`
          flex ${fullWidth ? 'w-full' : ''} ${variantClasses[variant].container}
        `}
        role="tablist"
        aria-orientation="horizontal"
      >
        {items.map((item) => {
          const isActive = item.id === activeTab;
          const isDisabled = item.disabled;
          
          return (
            <button
              key={item.id}
              ref={(el) => {
                if (el) tabRefs.current[item.id] = el;
              }}
              role="tab"
              aria-selected={isActive}
              aria-disabled={isDisabled}
              tabIndex={isActive ? 0 : -1}
              onClick={() => handleTabClick(item.id)}
              onKeyDown={(e) => handleKeyDown(e, item.id)}
              className={`
                flex items-center justify-center font-medium transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                disabled:opacity-50 disabled:cursor-not-allowed
                ${sizeClasses[size]}
                ${widthClass}
                ${variantClasses[variant].tab}
                ${isActive ? variantClasses[variant].active : variantClasses[variant].inactive}
              `}
            >
              {item.icon && (
                <span className="mr-2 flex-shrink-0">{item.icon}</span>
              )}
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Animated indicator for default variant */}
      {variant === 'default' && (
        <motion.div
          className="absolute bottom-0 h-0.5 bg-blue-500"
          style={indicatorStyle}
          initial={false}
          animate={{
            left: indicatorStyle.left,
            width: indicatorStyle.width,
          }}
          transition={{ duration: 0.2 }}
        />
      )}

      {/* Tab content */}
      <div className="mt-4" role="tabpanel" aria-labelledby={`tab-${activeTab}`}>
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeItem?.content}
        </motion.div>
      </div>
    </div>
  );
};

export default Tabs; 