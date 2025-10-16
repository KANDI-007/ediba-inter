import React from 'react';
import { LucideIcon } from 'lucide-react';

interface DischargeStatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  description?: string;
}

const DischargeStatsCard: React.FC<DischargeStatsCardProps> = ({
  title,
  value,
  icon: Icon,
  color,
  trend,
  description
}) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300 group">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 bg-gradient-to-r ${color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {trend && (
          <div className={`flex items-center text-sm ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
            <span className={`w-2 h-2 rounded-full mr-1 ${trend.isPositive ? 'bg-green-500' : 'bg-red-500'}`}></span>
            {trend.isPositive ? '+' : ''}{trend.value}%
          </div>
        )}
      </div>
      
      <div className="space-y-1">
        <p className="text-3xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
          {value}
        </p>
        <p className="text-sm text-gray-600 font-medium">{title}</p>
        {description && (
          <p className="text-xs text-gray-500">{description}</p>
        )}
      </div>
    </div>
  );
};

export default DischargeStatsCard;
