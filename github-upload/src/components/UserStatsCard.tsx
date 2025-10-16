import React from 'react';
import { LucideIcon } from 'lucide-react';

interface UserStatsCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  color: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'indigo' | 'pink' | 'teal';
  trend?: {
    value: number;
    isPositive: boolean;
  };
  description?: string;
  className?: string;
}

const UserStatsCard: React.FC<UserStatsCardProps> = ({
  title,
  value,
  icon: Icon,
  color,
  trend,
  description,
  className = ''
}) => {
  const colorConfig = {
    blue: {
      gradient: 'from-blue-500 to-blue-600',
      iconBg: 'text-blue-200',
      text: 'text-blue-100'
    },
    green: {
      gradient: 'from-green-500 to-green-600',
      iconBg: 'text-green-200',
      text: 'text-green-100'
    },
    purple: {
      gradient: 'from-purple-500 to-purple-600',
      iconBg: 'text-purple-200',
      text: 'text-purple-100'
    },
    orange: {
      gradient: 'from-orange-500 to-orange-600',
      iconBg: 'text-orange-200',
      text: 'text-orange-100'
    },
    red: {
      gradient: 'from-red-500 to-red-600',
      iconBg: 'text-red-200',
      text: 'text-red-100'
    },
    indigo: {
      gradient: 'from-indigo-500 to-indigo-600',
      iconBg: 'text-indigo-200',
      text: 'text-indigo-100'
    },
    pink: {
      gradient: 'from-pink-500 to-pink-600',
      iconBg: 'text-pink-200',
      text: 'text-pink-100'
    },
    teal: {
      gradient: 'from-teal-500 to-teal-600',
      iconBg: 'text-teal-200',
      text: 'text-teal-100'
    }
  };

  const config = colorConfig[color];

  return (
    <div className={`bg-gradient-to-r ${config.gradient} rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1">
          <p className={`text-sm ${config.text} font-medium`}>{title}</p>
          <p className="text-3xl font-bold mt-1">{value}</p>
          {description && (
            <p className={`text-xs ${config.text} mt-1`}>{description}</p>
          )}
        </div>
        <div className={`p-3 rounded-lg bg-white/20 backdrop-blur-sm`}>
          <Icon className={`w-8 h-8 ${config.iconBg}`} />
        </div>
      </div>
      
      {trend && (
        <div className="flex items-center">
          <div className={`flex items-center text-sm ${config.text}`}>
            <span className={`mr-1 ${trend.isPositive ? 'text-green-300' : 'text-red-300'}`}>
              {trend.isPositive ? '↗' : '↘'}
            </span>
            <span className="font-medium">
              {Math.abs(trend.value)}%
            </span>
            <span className="ml-1">vs mois dernier</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserStatsCard;
