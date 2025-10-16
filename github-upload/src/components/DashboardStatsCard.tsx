import React from 'react';
import { LucideIcon } from 'lucide-react';

interface DashboardStatsCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  color: string;
  gradient: string;
  description?: string;
  trend?: {
    value: number;
    period: string;
  };
}

const DashboardStatsCard: React.FC<DashboardStatsCardProps> = ({
  title,
  value,
  change,
  changeType = 'neutral',
  icon: Icon,
  color,
  gradient,
  description,
  trend
}) => {
  const getChangeColor = () => {
    switch (changeType) {
      case 'positive':
        return 'text-green-600 bg-green-100';
      case 'negative':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getChangeIcon = () => {
    switch (changeType) {
      case 'positive':
        return '↗';
      case 'negative':
        return '↘';
      default:
        return '→';
    }
  };

  return (
    <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100">
      {/* Gradient Background */}
      <div className={`absolute inset-0 ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
      
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/10 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-white/5 to-transparent rounded-full translate-y-12 -translate-x-12"></div>
      
      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl ${color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          
          {change && (
            <div className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1 ${getChangeColor()}`}>
              <span>{getChangeIcon()}</span>
              <span>{change}</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">
            {title}
          </h3>
          
          <div className="flex items-baseline space-x-2">
            <p className="text-3xl font-bold text-gray-900 group-hover:text-gray-700 transition-colors duration-300">
              {value}
            </p>
            {trend && (
              <div className="text-xs text-gray-500">
                {trend.value > 0 ? '+' : ''}{trend.value}% {trend.period}
              </div>
            )}
          </div>
          
          {description && (
            <p className="text-sm text-gray-500 group-hover:text-gray-600 transition-colors duration-300">
              {description}
            </p>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
            <div 
              className={`h-full ${gradient} rounded-full transition-all duration-1000 ease-out`}
              style={{ 
                width: changeType === 'positive' ? '85%' : changeType === 'negative' ? '45%' : '65%' 
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* Hover Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
    </div>
  );
};

export default DashboardStatsCard;
