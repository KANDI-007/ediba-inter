import React from 'react';
import { 
  FileText, 
  Users, 
  TrendingUp, 
  CheckCircle, 
  Plus,
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  gradient: string;
  href: string;
  badge?: string;
  isNew?: boolean;
}

const DashboardQuickActions: React.FC = () => {
  const actions: QuickAction[] = [
    {
      id: 'new-invoice',
      title: 'Nouvelle Facture',
      description: 'Créer une facture client',
      icon: FileText,
      color: 'bg-blue-500',
      gradient: 'from-blue-500 to-blue-600',
      href: '/invoices',
      isNew: false
    },
    {
      id: 'new-client',
      title: 'Nouveau Client',
      description: 'Ajouter un client',
      icon: Users,
      color: 'bg-green-500',
      gradient: 'from-green-500 to-green-600',
      href: '/clients',
      isNew: false
    },
    {
      id: 'reports',
      title: 'Rapports',
      description: 'Voir les analyses',
      icon: TrendingUp,
      color: 'bg-purple-500',
      gradient: 'from-purple-500 to-purple-600',
      href: '/reports',
      isNew: false
    },
    {
      id: 'discharge',
      title: 'Nouvelle Décharge',
      description: 'Créer une décharge',
      icon: CheckCircle,
      color: 'bg-orange-500',
      gradient: 'from-orange-500 to-orange-600',
      href: '/discharge',
      isNew: true
    }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <Sparkles className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Actions Rapides</h3>
            <p className="text-sm text-gray-500">Accès direct aux fonctions principales</p>
          </div>
        </div>
      </div>

      {/* Actions Grid */}
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {actions.map((action) => (
            <a
              key={action.id}
              href={action.href}
              className="group relative bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 ${action.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
              
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/20 to-transparent rounded-full -translate-y-10 translate-x-10"></div>
              
              {/* Content */}
              <div className="relative">
                {/* Icon */}
                <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <action.icon className="w-6 h-6 text-white" />
                </div>

                {/* Text */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-semibold text-gray-900 group-hover:text-gray-700 transition-colors duration-300">
                      {action.title}
                    </h4>
                    {action.isNew && (
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                        Nouveau
                      </span>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-500 group-hover:text-gray-600 transition-colors duration-300">
                    {action.description}
                  </p>
                </div>

                {/* Arrow */}
                <div className="mt-4 flex items-center text-sm font-medium text-gray-400 group-hover:text-gray-600 transition-colors duration-300">
                  <span>Accéder</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>

              {/* Hover Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </a>
          ))}
        </div>

        {/* Additional Actions */}
        <div className="mt-6 pt-6 border-t border-gray-100">
          <div className="flex flex-wrap gap-3">
            <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200 text-sm font-medium">
              <Plus className="w-4 h-4" />
              <span>Plus d'actions</span>
            </button>
            
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors duration-200 text-sm font-medium">
              <TrendingUp className="w-4 h-4" />
              <span>Voir les statistiques</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardQuickActions;
