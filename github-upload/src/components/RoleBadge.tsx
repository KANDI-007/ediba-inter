import React from 'react';
import { Crown, Calculator, Briefcase, BookOpen } from 'lucide-react';

interface RoleBadgeProps {
  role: 'admin' | 'comptable' | 'commercial' | 'lecture';
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline' | 'minimal';
  showIcon?: boolean;
  className?: string;
}

const RoleBadge: React.FC<RoleBadgeProps> = ({
  role,
  size = 'md',
  variant = 'default',
  showIcon = true,
  className = ''
}) => {
  const roleConfig = {
    admin: { 
      label: 'Administrateur', 
      icon: Crown, 
      color: 'text-red-700',
      bgColor: 'bg-red-100',
      borderColor: 'border-red-200',
      gradient: 'from-red-500 to-red-600'
    },
    comptable: { 
      label: 'Comptable', 
      icon: Calculator, 
      color: 'text-blue-700',
      bgColor: 'bg-blue-100',
      borderColor: 'border-blue-200',
      gradient: 'from-blue-500 to-blue-600'
    },
    commercial: { 
      label: 'Commercial', 
      icon: Briefcase, 
      color: 'text-green-700',
      bgColor: 'bg-green-100',
      borderColor: 'border-green-200',
      gradient: 'from-green-500 to-green-600'
    },
    lecture: { 
      label: 'Lecture seule', 
      icon: BookOpen, 
      color: 'text-gray-700',
      bgColor: 'bg-gray-100',
      borderColor: 'border-gray-200',
      gradient: 'from-gray-500 to-gray-600'
    }
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  const iconSizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const config = roleConfig[role];
  const IconComponent = config.icon;

  const getVariantClasses = () => {
    switch (variant) {
      case 'outline':
        return `border ${config.borderColor} ${config.color} bg-transparent hover:${config.bgColor}`;
      case 'minimal':
        return `${config.color} bg-transparent`;
      default:
        return `${config.bgColor} ${config.color} border ${config.borderColor}`;
    }
  };

  return (
    <span className={`
      inline-flex items-center rounded-full font-medium transition-all duration-200
      ${sizeClasses[size]}
      ${getVariantClasses()}
      ${className}
    `}>
      {showIcon && (
        <IconComponent className={`${iconSizeClasses[size]} mr-1.5`} />
      )}
      {config.label}
    </span>
  );
};

export default RoleBadge;
