import Link from 'next/link';
import React from 'react';
import { 
  DotsHorizontalIcon,
  BarChartIcon, // Placeholder for dynamic icons
  ArrowUpIcon,
} from '@radix-ui/react-icons';

interface MetaBoxCardProps {
  id: string;
  icon: React.ElementType; // Use ElementType for component icons
  title: string;
  description: string;
  stats: {
    active: number;
    completed: number;
  };
  href: string;
}

const MetaBoxCard: React.FC<MetaBoxCardProps> = ({
  id,
  icon: Icon, // Destructure and rename for use as a component
  title,
  description,
  stats,
  href
}) => {
  const total = stats.active + stats.completed;
  const growth = Math.round((stats.completed / (total || 1)) * 100) / 10; // Example growth calc

  return (
    <div className="group relative flex flex-col justify-between bg-white rounded-lg border border-slate-200 p-6 transition-all duration-200 hover:shadow-md" data-testid="metabox-card">
      {/* Card Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center bg-slate-100 rounded-md">
            <Icon className="h-5 w-5 text-slate-600" />
          </div>
          <h3 className="text-base font-semibold text-slate-800">{title}</h3>
        </div>
        <button className="text-slate-400 hover:text-slate-600">
          <DotsHorizontalIcon className="h-5 w-5" />
        </button>
      </div>

      {/* Main Metric */}
      <div className="my-6">
        <p className="text-4xl font-bold text-slate-900">{stats.active}</p>
        <p className="text-sm text-slate-500">{description}</p>
      </div>
      
      {/* Footer with secondary stat and link */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-1 text-sm text-green-600 font-medium">
          <ArrowUpIcon />
          <span>{growth}%</span>
          <span className="text-slate-500 font-normal ml-1">vs last month</span>
        </div>
        <Link
          href={href}
          className="text-sm font-semibold text-blue-600 hover:underline"
          aria-label={`Open ${title} workspace`}
        >
          View
        </Link>
      </div>
    </div>
  );
};

export default MetaBoxCard; 