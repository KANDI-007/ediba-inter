import React from 'react';
import { CheckCircle, AlertCircle, Info, Clock } from 'lucide-react';

interface UserActionSummaryProps {
  action: 'create' | 'update' | 'delete' | 'bulk';
  count: number;
  success: boolean;
  message?: string;
  className?: string;
}

const UserActionSummary: React.FC<UserActionSummaryProps> = ({
  action,
  count,
  success,
  message,
  className = ''
}) => {
  const getActionConfig = () => {
    switch (action) {
      case 'create':
        return {
          icon: CheckCircle,
          color: success ? 'text-green-600' : 'text-red-600',
          bgColor: success ? 'bg-green-100' : 'bg-red-100',
          label: 'Création'
        };
      case 'update':
        return {
          icon: CheckCircle,
          color: success ? 'text-blue-600' : 'text-red-600',
          bgColor: success ? 'bg-blue-100' : 'bg-red-100',
          label: 'Modification'
        };
      case 'delete':
        return {
          icon: AlertCircle,
          color: success ? 'text-orange-600' : 'text-red-600',
          bgColor: success ? 'bg-orange-100' : 'bg-red-100',
          label: 'Suppression'
        };
      case 'bulk':
        return {
          icon: Clock,
          color: success ? 'text-purple-600' : 'text-red-600',
          bgColor: success ? 'bg-purple-100' : 'bg-red-100',
          label: 'Action groupée'
        };
      default:
        return {
          icon: Info,
          color: 'text-gray-600',
          bgColor: 'bg-gray-100',
          label: 'Action'
        };
    }
  };

  const config = getActionConfig();
  const IconComponent = config.icon;

  return (
    <div className={`flex items-center p-4 rounded-lg border ${config.bgColor} ${className}`}>
      <div className={`flex-shrink-0 ${config.color}`}>
        <IconComponent className="w-5 h-5" />
      </div>
      <div className="ml-3 flex-1">
        <p className={`text-sm font-medium ${config.color}`}>
          {config.label} {count > 1 ? `de ${count} utilisateurs` : 'd\'utilisateur'}
        </p>
        {message && (
          <p className="text-sm text-gray-600 mt-1">
            {message}
          </p>
        )}
      </div>
      <div className={`text-sm font-medium ${config.color}`}>
        {success ? 'Réussi' : 'Échec'}
      </div>
    </div>
  );
};

export default UserActionSummary;
