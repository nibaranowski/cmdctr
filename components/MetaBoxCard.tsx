import Link from 'next/link';
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
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center mb-4">
        <div className={`w-10 h-10 ${color} rounded-lg flex items-center justify-center mr-3`}>
          <span className="text-white text-lg">{icon}</span>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
      
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-gray-600">
          <span className="font-medium">{stats.active}</span> active
        </div>
        <div className="text-sm text-gray-600">
          <span className="font-medium">{stats.completed}</span> completed
        </div>
      </div>
      
      <Link
        href={href}
        className="block w-full bg-gray-50 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors text-center"
      >
        Open Workspace
      </Link>
    </div>
  );
};

export default MetaBoxCard; 