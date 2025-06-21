import Link from 'next/link';
import { motion } from 'framer-motion';
import React from 'react';

interface MetaBoxCardProps {
  id: string;
  icon: string;
  title: string;
  description: string;
  color: string;
  stats: {
    active: number;
    completed: number;
  };
  href: string;
}

const MetaBoxCard: React.FC<MetaBoxCardProps> = ({
  id,
  icon,
  title,
  description,
  color,
  stats,
  href
}) => {
  return (
    <motion.div
      className="group relative bg-white rounded-2xl border border-gray-200 p-8 hover:shadow-lg hover:border-gray-300 transition-all duration-200 cursor-pointer"
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      data-testid="metabox-card"
    >
      {/* Colored accent bar */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${color} rounded-t-2xl`} />
      
      {/* Header with icon and title */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center text-white text-xl font-medium`}>
            {icon}
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-1">{title}</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
          </div>
        </div>
      </div>
      
      {/* Stats */}
      <div className="flex justify-between items-center mb-8">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{stats.active}</div>
          <div className="text-xs text-gray-500 font-medium">Active</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{stats.completed}</div>
          <div className="text-xs text-gray-500 font-medium">Completed</div>
        </div>
      </div>
      
      {/* Open Workspace Button */}
      <Link
        href={href}
        className="block w-full bg-gray-50 text-gray-700 px-6 py-4 rounded-xl text-sm font-medium hover:bg-gray-100 focus:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 text-center group-hover:bg-blue-50 group-hover:text-blue-700 group-hover:border-blue-200"
        aria-label={`Open ${title} workspace`}
      >
        Open Workspace
      </Link>
    </motion.div>
  );
};

export default MetaBoxCard; 