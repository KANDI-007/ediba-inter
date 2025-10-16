import React from 'react';
import { Crown, Calculator, Briefcase, BookOpen, User } from 'lucide-react';

interface UserAvatarProps {
  role: 'admin' | 'comptable' | 'commercial' | 'lecture';
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showInitials?: boolean;
  className?: string;
}

const UserAvatar: React.FC<UserAvatarProps> = ({
  role,
  name,
  size = 'md',
  showInitials = true,
  className = ''
}) => {
  const roleConfig = {
    admin: { 
      icon: Crown, 
      gradient: 'from-red-500 to-red-600',
      bgColor: 'bg-red-500'
    },
    comptable: { 
      icon: Calculator, 
      gradient: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-500'
    },
    commercial: { 
      icon: Briefcase, 
      gradient: 'from-green-500 to-green-600',
      bgColor: 'bg-green-500'
    },
    lecture: { 
      icon: BookOpen, 
      gradient: 'from-gray-500 to-gray-600',
      bgColor: 'bg-gray-500'
    }
  };

  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-base',
    lg: 'w-16 h-16 text-lg',
    xl: 'w-20 h-20 text-xl'
  };

  const iconSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-10 h-10'
  };

  const config = roleConfig[role];
  const IconComponent = config.icon;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      <div className={`w-full h-full rounded-full bg-gradient-to-br ${config.gradient} flex items-center justify-center text-white shadow-lg group-hover:shadow-xl transition-all duration-300`}>
        {showInitials ? (
          <span className="font-semibold select-none">
            {getInitials(name)}
          </span>
        ) : (
          <IconComponent className={`${iconSizeClasses[size]} group-hover:scale-110 transition-transform duration-300`} />
        )}
      </div>
      
      {/* Effet de brillance */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-t from-transparent via-white/20 to-white/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      {/* Indicateur de statut (optionnel) */}
      <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full ${config.bgColor} border-2 border-white shadow-md`}></div>
    </div>
  );
};

export default UserAvatar;
