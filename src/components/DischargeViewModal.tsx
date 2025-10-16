import React from 'react';
import { 
  X, 
  User, 
  Phone, 
  CreditCard, 
  Calendar, 
  MapPin, 
  FileText, 
  CheckCircle,
  Clock,
  AlertCircle,
  FileCheck,
  Download,
  Edit
} from 'lucide-react';

interface DischargeViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  discharge: any;
  onEdit: (discharge: any) => void;
  onDownload: (discharge: any) => void;
}

const DischargeViewModal: React.FC<DischargeViewModalProps> = ({
  isOpen,
  onClose,
  discharge,
  onEdit,
  onDownload
}) => {
  if (!isOpen || !discharge) return null;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'signed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'completed':
        return <FileCheck className="w-5 h-5 text-blue-500" />;
      case 'overdue':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'signed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'signed':
        return 'Signée';
      case 'pending':
        return 'En attente';
      case 'completed':
        return 'Terminée';
      case 'overdue':
        return 'En retard';
      default:
        return 'En attente';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold">Détails de la décharge</h3>
              <p className="text-blue-100 text-sm">Informations complètes</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Status and ID */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <h4 className="text-lg font-bold text-gray-900">{discharge.id}</h4>
                <p className="text-sm text-gray-600">Numéro de décharge</p>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusIcon(discharge.statut)}
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(discharge.statut)}`}>
                  {getStatusText(discharge.statut)}
                </span>
              </div>
            </div>

            {/* Prestataire Info */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h5 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-blue-600" />
                Informations du prestataire
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nom du prestataire</label>
                  <p className="text-lg font-semibold text-gray-900">{discharge.prestataire}</p>
                </div>
                {discharge.telephone && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                    <p className="text-gray-900 flex items-center">
                      <Phone className="w-4 h-4 mr-2 text-gray-400" />
                      {discharge.telephone}
                    </p>
                  </div>
                )}
                {discharge.cni && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">CNI</label>
                    <p className="text-gray-900">{discharge.cni}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Service Details */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h5 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-green-600" />
                Détails du service
              </h5>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description du service</label>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-900">{discharge.service}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date de prestation</label>
                    <p className="text-gray-900 flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                      {discharge.datePrestation}
                    </p>
                  </div>
                  
                  {discharge.lieu && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Lieu</label>
                      <p className="text-gray-900 flex items-center">
                        <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                        {discharge.lieu}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Financial Info */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
              <h5 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <CreditCard className="w-5 h-5 mr-2 text-green-600" />
                Informations financières
              </h5>
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Montant</label>
                  <p className="text-3xl font-bold text-green-600">
                    {discharge.montant.toLocaleString()} FCFA
                  </p>
                </div>
                <div className="text-right">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date de création</label>
                  <p className="text-gray-900">{discharge.dateCreation}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 flex justify-between">
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-200 font-medium"
          >
            Fermer
          </button>
          
          <div className="flex space-x-3">
            <button
              onClick={() => onDownload(discharge)}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Télécharger PDF</span>
            </button>
            <button
              onClick={() => onEdit(discharge)}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 transition-all duration-200 font-medium flex items-center space-x-2"
            >
              <Edit className="w-4 h-4" />
              <span>Modifier</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DischargeViewModal;
