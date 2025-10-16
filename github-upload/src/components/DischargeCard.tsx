import React from 'react';
import { 
  FileCheck, 
  User, 
  Calendar, 
  MapPin, 
  Phone, 
  CreditCard, 
  Eye, 
  Edit, 
  Trash2, 
  Download, 
  FileSignature as Signature,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';

interface DischargeCardProps {
  discharge: {
    id: string;
    prestataire: string;
    service: string;
    montant: number;
    datePrestation: string;
    lieu: string;
    telephone: string;
    cni: string;
    statut: string;
    dateCreation: string;
  };
  onView: (discharge: any) => void;
  onEdit: (discharge: any) => void;
  onDelete: (id: string) => void;
  onSign: (id: string) => void;
  onDownload: (discharge: any) => void;
}

const DischargeCard: React.FC<DischargeCardProps> = ({
  discharge,
  onView,
  onEdit,
  onDelete,
  onSign,
  onDownload
}) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'signed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'completed':
        return <FileCheck className="w-4 h-4 text-blue-500" />;
      case 'overdue':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
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
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300 group">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
            <FileCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
              {discharge.id}
            </h3>
            <p className="text-sm text-gray-500">Décharge</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {getStatusIcon(discharge.statut)}
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(discharge.statut)}`}>
            {getStatusText(discharge.statut)}
          </span>
        </div>
      </div>

      {/* Prestataire Info */}
      <div className="mb-4">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-8 h-8 bg-gradient-to-r from-green-100 to-green-200 rounded-lg flex items-center justify-center">
            <User className="w-4 h-4 text-green-600" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">{discharge.prestataire}</p>
            <p className="text-sm text-gray-500">Prestataire</p>
          </div>
        </div>
      </div>

      {/* Service */}
      <div className="mb-4">
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-sm text-gray-600 mb-1">Service</p>
          <p className="font-medium text-gray-900 text-sm line-clamp-2">{discharge.service}</p>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="w-4 h-4 mr-2 text-gray-400" />
          <span>Prestation: {discharge.datePrestation}</span>
        </div>
        
        {discharge.lieu && (
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-2 text-gray-400" />
            <span className="truncate">{discharge.lieu}</span>
          </div>
        )}
        
        {discharge.telephone && (
          <div className="flex items-center text-sm text-gray-600">
            <Phone className="w-4 h-4 mr-2 text-gray-400" />
            <span>{discharge.telephone}</span>
          </div>
        )}
      </div>

      {/* Montant */}
      <div className="mb-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <CreditCard className="w-4 h-4 text-green-600 mr-2" />
            <span className="text-sm text-gray-600">Montant</span>
          </div>
          <span className="text-lg font-bold text-green-600">
            {discharge.montant.toLocaleString()} FCFA
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-1">
          <button
            onClick={() => onView(discharge)}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
            title="Voir"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => onEdit(discharge)}
            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200"
            title="Modifier"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onSign(discharge.id)}
            className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-200"
            title="Signature"
          >
            <Signature className="w-4 h-4" />
          </button>
        </div>
        
        <div className="flex items-center space-x-1">
          <button
            onClick={() => onDownload(discharge)}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
            title="Télécharger PDF"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(discharge.id)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
            title="Supprimer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DischargeCard;
