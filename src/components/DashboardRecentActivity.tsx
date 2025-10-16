import React from 'react';
import { 
  FileText, 
  Users, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  TrendingUp,
  DollarSign,
  Eye
} from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'invoice' | 'client' | 'payment' | 'discharge' | 'report';
  title: string;
  description: string;
  time: string;
  status: 'success' | 'warning' | 'error' | 'info';
  amount?: string;
  icon: React.ComponentType<any>;
}

const DashboardRecentActivity: React.FC = () => {
  const activities: ActivityItem[] = [
    {
      id: '1',
      type: 'invoice',
      title: 'Facture #F2024-001',
      description: 'Nouvelle facture créée pour Client ABC',
      time: 'Il y a 2 minutes',
      status: 'success',
      amount: '125,000 FCFA',
      icon: FileText
    },
    {
      id: '2',
      type: 'payment',
      title: 'Paiement reçu',
      description: 'Paiement partiel de 50,000 FCFA',
      time: 'Il y a 15 minutes',
      status: 'info',
      amount: '50,000 FCFA',
      icon: CheckCircle
    },
    {
      id: '3',
      type: 'client',
      title: 'Nouveau client',
      description: 'Client XYZ ajouté au système',
      time: 'Il y a 1 heure',
      status: 'success',
      icon: Users
    },
    {
      id: '4',
      type: 'discharge',
      title: 'Décharge #D2024-003',
      description: 'Décharge en attente de validation',
      time: 'Il y a 2 heures',
      status: 'warning',
      amount: '75,000 FCFA',
      icon: AlertCircle
    },
    {
      id: '5',
      type: 'report',
      title: 'Rapport mensuel',
      description: 'Rapport de janvier généré',
      time: 'Il y a 3 heures',
      status: 'info',
      icon: TrendingUp
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-green-600 bg-green-100';
      case 'warning':
        return 'text-yellow-600 bg-yellow-100';
      case 'error':
        return 'text-red-600 bg-red-100';
      case 'info':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'invoice':
        return 'text-blue-600 bg-blue-100';
      case 'client':
        return 'text-green-600 bg-green-100';
      case 'payment':
        return 'text-purple-600 bg-purple-100';
      case 'discharge':
        return 'text-orange-600 bg-orange-100';
      case 'report':
        return 'text-indigo-600 bg-indigo-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Clock className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Activité Récente</h3>
              <p className="text-sm text-gray-500">Dernières actions du système</p>
            </div>
          </div>
          
          <button className="flex items-center space-x-2 px-3 py-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors duration-200">
            <Eye className="w-4 h-4" />
            <span>Voir tout</span>
          </button>
        </div>
      </div>

      {/* Activity List */}
      <div className="divide-y divide-gray-100">
        {activities.map((activity, index) => (
          <div 
            key={activity.id} 
            className="group px-6 py-4 hover:bg-gray-50 transition-colors duration-200 relative"
          >
            {/* Timeline Line */}
            {index < activities.length - 1 && (
              <div className="absolute left-8 top-12 w-0.5 h-8 bg-gray-200"></div>
            )}
            
            <div className="flex items-start space-x-4">
              {/* Icon */}
              <div className={`flex-shrink-0 w-8 h-8 rounded-full ${getTypeColor(activity.type)} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                <activity.icon className="w-4 h-4" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-gray-900 group-hover:text-gray-700 transition-colors duration-300">
                      {activity.title}
                    </h4>
                    <p className="text-sm text-gray-500 group-hover:text-gray-600 transition-colors duration-300">
                      {activity.description}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    {activity.amount && (
                      <span className="text-sm font-medium text-gray-900">
                        {activity.amount}
                      </span>
                    )}
                    
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                      {activity.status === 'success' ? 'Succès' :
                       activity.status === 'warning' ? 'Attention' :
                       activity.status === 'error' ? 'Erreur' : 'Info'}
                    </span>
                  </div>
                </div>
                
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs text-gray-400">
                    {activity.time}
                  </span>
                  
                  <button className="opacity-0 group-hover:opacity-100 text-xs text-indigo-600 hover:text-indigo-700 transition-opacity duration-200">
                    Voir détails →
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600">Système en ligne</span>
          </div>
          
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span>Dernière mise à jour: maintenant</span>
            <button className="text-indigo-600 hover:text-indigo-700 font-medium">
              Actualiser
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardRecentActivity;
