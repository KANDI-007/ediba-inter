import React from 'react';
import { 
  Activity, 
  User, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Eye,
  Download,
  Trash2,
  Edit,
  FileText,
  Settings,
  Database,
  Shield,
  Zap
} from 'lucide-react';
import { ActivityLog } from '../contexts/ActivityContext';

interface ActivityLogCardProps {
  activity: ActivityLog;
  onViewDetails: (activity: ActivityLog) => void;
  onExport?: (activity: ActivityLog) => void;
  onDelete?: (activity: ActivityLog) => void;
}

const ActivityLogCard: React.FC<ActivityLogCardProps> = ({
  activity,
  onViewDetails,
  onExport,
  onDelete
}) => {
  const getActionIcon = (action: string) => {
    switch (action.toLowerCase()) {
      case 'connexion': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'déconnexion': return <XCircle className="w-5 h-5 text-gray-500" />;
      case 'création': return <FileText className="w-5 h-5 text-blue-500" />;
      case 'modification': return <Edit className="w-5 h-5 text-yellow-500" />;
      case 'suppression': return <Trash2 className="w-5 h-5 text-red-500" />;
      case 'consultation': return <Eye className="w-5 h-5 text-gray-500" />;
      case 'export': return <Download className="w-5 h-5 text-purple-500" />;
      case 'paiement': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'erreur': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'configuration': return <Settings className="w-5 h-5 text-indigo-500" />;
      case 'sauvegarde': return <Database className="w-5 h-5 text-cyan-500" />;
      case 'sécurité': return <Shield className="w-5 h-5 text-orange-500" />;
      case 'performance': return <Zap className="w-5 h-5 text-yellow-500" />;
      default: return <Activity className="w-5 h-5 text-gray-500" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action.toLowerCase()) {
      case 'connexion': return 'bg-green-100 text-green-800 border-green-200';
      case 'déconnexion': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'création': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'modification': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'suppression': return 'bg-red-100 text-red-800 border-red-200';
      case 'consultation': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'export': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'paiement': return 'bg-green-100 text-green-800 border-green-200';
      case 'erreur': return 'bg-red-100 text-red-800 border-red-200';
      case 'configuration': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'sauvegarde': return 'bg-cyan-100 text-cyan-800 border-cyan-200';
      case 'sécurité': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'performance': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getModuleIcon = (module: string) => {
    switch (module.toLowerCase()) {
      case 'authentification': return <Shield className="w-4 h-4" />;
      case 'facturation': return <FileText className="w-4 h-4" />;
      case 'clients': return <User className="w-4 h-4" />;
      case 'fournisseurs': return <User className="w-4 h-4" />;
      case 'décharges': return <FileText className="w-4 h-4" />;
      case 'articles': return <Database className="w-4 h-4" />;
      case 'utilisateurs': return <User className="w-4 h-4" />;
      case 'rapports': return <FileText className="w-4 h-4" />;
      case 'système': return <Settings className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'À l\'instant';
    if (diffInMinutes < 60) return `Il y a ${diffInMinutes} min`;
    if (diffInMinutes < 1440) return `Il y a ${Math.floor(diffInMinutes / 60)}h`;
    if (diffInMinutes < 10080) return `Il y a ${Math.floor(diffInMinutes / 1440)}j`;
    
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (success: boolean) => {
    return success 
      ? 'text-green-600 bg-green-50 border-green-200' 
      : 'text-red-600 bg-red-50 border-red-200';
  };

  return (
    <div className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            {/* Action Icon */}
            <div className="flex-shrink-0">
              {getActionIcon(activity.action)}
            </div>
            
            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-gray-700 transition-colors duration-300">
                  {activity.action}
                </h3>
                
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getActionColor(activity.action)}`}>
                  {activity.action}
                </span>
                
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(activity.success)}`}>
                  {activity.success ? 'Succès' : 'Échec'}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-300 mb-3">
                {activity.description}
              </p>
              
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <User className="w-4 h-4" />
                  <span>{activity.userName}</span>
                </div>
                
                <div className="flex items-center space-x-1">
                  {getModuleIcon(activity.module)}
                  <span>{activity.module}</span>
                </div>
                
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{formatTimestamp(activity.timestamp)}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onViewDetails(activity)}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
              title="Voir les détails"
            >
              <Eye className="w-4 h-4" />
            </button>
            
            {onExport && (
              <button
                onClick={() => onExport(activity)}
                className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200"
                title="Exporter"
              >
                <Download className="w-4 h-4" />
              </button>
            )}
            
            {onDelete && (
              <button
                onClick={() => onDelete(activity)}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                title="Supprimer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Details */}
      <div className="px-6 py-4 bg-gray-50">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-700">ID:</span>
            <span className="ml-2 text-gray-600 font-mono">{activity.id}</span>
          </div>
          
          <div>
            <span className="font-medium text-gray-700">IP:</span>
            <span className="ml-2 text-gray-600">{activity.ipAddress || 'N/A'}</span>
          </div>
          
          <div>
            <span className="font-medium text-gray-700">User Agent:</span>
            <span className="ml-2 text-gray-600 truncate">
              {activity.userAgent ? activity.userAgent.substring(0, 30) + '...' : 'N/A'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityLogCard;
