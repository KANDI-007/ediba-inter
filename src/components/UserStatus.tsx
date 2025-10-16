import React from 'react';
import { CheckCircle, AlertCircle, Clock, XCircle } from 'lucide-react';

interface UserStatusProps {
  lastLogin?: string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

const UserStatus: React.FC<UserStatusProps> = ({
  lastLogin,
  size = 'md',
  showIcon = true,
  className = ''
}) => {
  const getStatusInfo = () => {
    if (!lastLogin) {
      return {
        label: 'Inactif',
        color: 'text-gray-600',
        bgColor: 'bg-gray-100',
        icon: XCircle,
        description: 'Jamais connecté'
      };
    }

    const date = new Date(lastLogin);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return {
        label: 'En ligne',
        color: 'text-green-700',
        bgColor: 'bg-green-100',
        icon: CheckCircle,
        description: 'Connecté maintenant'
      };
    }
    
    if (diffInHours < 24) {
      return {
        label: 'Actif',
        color: 'text-green-600',
        bgColor: 'bg-green-100',
        icon: CheckCircle,
        description: `Il y a ${diffInHours}h`
      };
    }
    
    if (diffInHours < 168) { // 7 jours
      return {
        label: 'Récent',
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-100',
        icon: Clock,
        description: `Il y a ${Math.floor(diffInHours / 24)}j`
      };
    }
    
    return {
      label: 'Inactif',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      icon: AlertCircle,
      description: `Il y a ${Math.floor(diffInHours / 24)}j`
    };
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base'
  };

  const iconSizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const status = getStatusInfo();
  const IconComponent = status.icon;

  return (
    <span 
      className={`
        inline-flex items-center rounded-full font-medium transition-all duration-200
        ${sizeClasses[size]}
        ${status.bgColor}
        ${status.color}
        ${className}
      `}
      title={status.description}
    >
      {showIcon && (
        <IconComponent className={`${iconSizeClasses[size]} mr-1.5`} />
      )}
      {status.label}
    </span>
  );
};

export default UserStatus;
