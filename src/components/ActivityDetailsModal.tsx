import React from 'react';
import { X, User, Calendar, MapPin, Monitor, CheckCircle, XCircle, Info } from 'lucide-react';
import { ActivityLog } from '../contexts/ActivityContext';

interface ActivityDetailsModalProps {
  activity: ActivityLog | null;
  isOpen: boolean;
  onClose: () => void;
}

const ActivityDetailsModal: React.FC<ActivityDetailsModalProps> = ({
  activity,
  isOpen,
  onClose
}) => {
  if (!isOpen || !activity) return null;

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString('fr-FR'),
      time: date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      full: date.toLocaleString('fr-FR')
    };
  };

  const getStatusIcon = (success: boolean) => {
    return success ? (
      <CheckCircle className="w-5 h-5 text-green-500" />
    ) : (
      <XCircle className="w-5 h-5 text-red-500" />
    );
  };

  const getStatusColor = (success: boolean) => {
    return success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const { date, time, full } = formatTimestamp(activity.timestamp);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-xl shadow-2xl overflow-hidden flex flex-col">
        <div className="px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Détails de l'activité</h3>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white text-2xl"
            >
              ×
            </button>
          </div>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1">
          <div className="space-y-6">
            {/* En-tête de l'activité */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(activity.success)}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{activity.action}</h4>
                    <p className="text-sm text-gray-600">{activity.module}</p>
                  </div>
                </div>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(activity.success)}`}>
                  {activity.success ? 'Réussi' : 'Échoué'}
                </span>
              </div>
              <p className="text-gray-800">{activity.details}</p>
            </div>

            {/* Informations utilisateur */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h5 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <User className="w-4 h-4 mr-2 text-blue-500" />
                  Utilisateur
                </h5>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-600">Nom:</span>
                    <span className="ml-2 font-medium">{activity.userName}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Identifiant:</span>
                    <span className="ml-2 font-medium">{activity.userId}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Rôle:</span>
                    <span className="ml-2 font-medium">{activity.userRole}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h5 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-green-500" />
                  Horodatage
                </h5>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-600">Date:</span>
                    <span className="ml-2 font-medium">{date}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Heure:</span>
                    <span className="ml-2 font-medium">{time}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Complet:</span>
                    <span className="ml-2 font-medium">{full}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Informations techniques */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h5 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-purple-500" />
                  Localisation
                </h5>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-600">Adresse IP:</span>
                    <span className="ml-2 font-medium">{activity.ipAddress || 'Non disponible'}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h5 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Monitor className="w-4 h-4 mr-2 text-orange-500" />
                  Navigateur
                </h5>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-600">User Agent:</span>
                    <span className="ml-2 font-medium text-xs break-all">{activity.userAgent || 'Non disponible'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Métadonnées */}
            {activity.metadata && Object.keys(activity.metadata).length > 0 && (
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h5 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Info className="w-4 h-4 mr-2 text-indigo-500" />
                  Métadonnées
                </h5>
                <div className="space-y-2 text-sm">
                  {Object.entries(activity.metadata).map(([key, value]) => (
                    <div key={key}>
                      <span className="text-gray-600">{key}:</span>
                      <span className="ml-2 font-medium">
                        {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ID de l'activité */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h5 className="font-semibold text-gray-900 mb-2">Identifiant de l'activité</h5>
              <p className="text-sm text-gray-600 font-mono">{activity.id}</p>
            </div>
          </div>
        </div>
        
        <div className="px-6 py-4 bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-600 text-white hover:bg-gray-700"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActivityDetailsModal;
