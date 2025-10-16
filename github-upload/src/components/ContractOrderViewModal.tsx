import React, { useState } from 'react';
import { X, Edit, Save, FileText } from 'lucide-react';
import { ContractOrder } from '../contexts/DataContext';

interface ContractOrderViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  contractOrder: ContractOrder | null;
  onUpdate: (id: string, data: Partial<ContractOrder>) => void;
}

const ContractOrderViewModal: React.FC<ContractOrderViewModalProps> = ({
  isOpen,
  onClose,
  contractOrder,
  onUpdate
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ContractOrder | null>(null);

  React.useEffect(() => {
    if (contractOrder) {
      setFormData(contractOrder);
    }
  }, [contractOrder]);

  const handleInputChange = (field: keyof ContractOrder, value: string | number) => {
    if (formData) {
      setFormData(prev => ({
        ...prev!,
        [field]: value
      }));
    }
  };

  const handleSave = () => {
    if (formData && contractOrder) {
      onUpdate(contractOrder.id, formData);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    if (contractOrder) {
      setFormData(contractOrder);
    }
    setIsEditing(false);
  };

  if (!isOpen || !contractOrder) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white w-full max-w-4xl h-[90vh] rounded-xl shadow-2xl flex flex-col">
        <div className="px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white flex-shrink-0">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              {contractOrder.documentType === 'contract' ? 'Contrat' : 'Lettre de Commande'} - {contractOrder.documentNumber}
            </h3>
            <div className="flex items-center space-x-2">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-colors"
                  title="Modifier"
                >
                  <Edit className="w-4 h-4" />
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={handleSave}
                    className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-colors"
                    title="Sauvegarder"
                  >
                    <Save className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleCancel}
                    className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-colors"
                    title="Annuler"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
              <button
                onClick={onClose}
                className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-colors"
                title="Fermer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Informations générales */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-4">Informations générales</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Numéro du document
                  </label>
                  <input
                    type="text"
                    value={formData?.documentNumber || ''}
                    onChange={(e) => handleInputChange('documentNumber', e.target.value)}
                    disabled={!isEditing}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:border-transparent disabled:bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={formData?.date || ''}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    disabled={!isEditing}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:border-transparent disabled:bg-gray-100"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Référence autorisante
                  </label>
                  <input
                    type="text"
                    value={formData?.authorizingReference || ''}
                    onChange={(e) => handleInputChange('authorizingReference', e.target.value)}
                    disabled={!isEditing}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:border-transparent disabled:bg-gray-100"
                  />
                </div>
              </div>
            </div>

            {/* Informations de l'attributaire */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-4">Informations de l'attributaire</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Attributaire
                  </label>
                  <input
                    type="text"
                    value={formData?.awardee || ''}
                    onChange={(e) => handleInputChange('awardee', e.target.value)}
                    disabled={!isEditing}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:border-transparent disabled:bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    NIF
                  </label>
                  <input
                    type="text"
                    value={formData?.taxId || ''}
                    onChange={(e) => handleInputChange('taxId', e.target.value)}
                    disabled={!isEditing}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:border-transparent disabled:bg-gray-100"
                  />
                </div>
              </div>
            </div>

            {/* Informations financières */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-4">Informations financières</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Montant (F CFA)
                  </label>
                  <input
                    type="number"
                    value={formData?.amount || 0}
                    onChange={(e) => handleInputChange('amount', parseFloat(e.target.value) || 0)}
                    disabled={!isEditing}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:border-transparent disabled:bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Délai de garantie (années)
                  </label>
                  <input
                    type="number"
                    value={formData?.warrantyPeriod || 0}
                    onChange={(e) => handleInputChange('warrantyPeriod', parseInt(e.target.value) || 0)}
                    disabled={!isEditing}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:border-transparent disabled:bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Retenue de garantie (%)
                  </label>
                  <input
                    type="number"
                    value={formData?.warrantyRetention || 0}
                    onChange={(e) => handleInputChange('warrantyRetention', parseInt(e.target.value) || 0)}
                    disabled={!isEditing}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:border-transparent disabled:bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Garantie de bonne exécution
                  </label>
                  <input
                    type="text"
                    value={formData?.performanceGuarantee || ''}
                    onChange={(e) => handleInputChange('performanceGuarantee', e.target.value)}
                    disabled={!isEditing}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:border-transparent disabled:bg-gray-100"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Montant en toutes lettres
                  </label>
                  <input
                    type="text"
                    value={formData?.amountInWords || ''}
                    onChange={(e) => handleInputChange('amountInWords', e.target.value)}
                    disabled={!isEditing}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:border-transparent disabled:bg-gray-100"
                  />
                </div>
              </div>
            </div>

            {/* Informations bancaires */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-4">Informations bancaires</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Compte bancaire
                  </label>
                  <input
                    type="text"
                    value={formData?.bankAccount || ''}
                    onChange={(e) => handleInputChange('bankAccount', e.target.value)}
                    disabled={!isEditing}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:border-transparent disabled:bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Banque
                  </label>
                  <input
                    type="text"
                    value={formData?.bankName || ''}
                    onChange={(e) => handleInputChange('bankName', e.target.value)}
                    disabled={!isEditing}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:border-transparent disabled:bg-gray-100"
                  />
                </div>
              </div>
            </div>

            {/* Informations budgétaires */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-4">Informations budgétaires</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Imputation budgétaire
                  </label>
                  <input
                    type="text"
                    value={formData?.budgetAllocation || ''}
                    onChange={(e) => handleInputChange('budgetAllocation', e.target.value)}
                    disabled={!isEditing}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:border-transparent disabled:bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Compte de dépôt
                  </label>
                  <input
                    type="text"
                    value={formData?.depositAccount || ''}
                    onChange={(e) => handleInputChange('depositAccount', e.target.value)}
                    disabled={!isEditing}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:border-transparent disabled:bg-gray-100"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Intitulé du compte de dépôt
                  </label>
                  <input
                    type="text"
                    value={formData?.depositAccountTitle || ''}
                    onChange={(e) => handleInputChange('depositAccountTitle', e.target.value)}
                    disabled={!isEditing}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:border-transparent disabled:bg-gray-100"
                  />
                </div>
              </div>
            </div>

            {/* Informations du projet */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-4">Informations du projet</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Objet
                  </label>
                  <input
                    type="text"
                    value={formData?.subject || ''}
                    onChange={(e) => handleInputChange('subject', e.target.value)}
                    disabled={!isEditing}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:border-transparent disabled:bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description du lot
                  </label>
                  <input
                    type="text"
                    value={formData?.lotDescription || ''}
                    onChange={(e) => handleInputChange('lotDescription', e.target.value)}
                    disabled={!isEditing}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:border-transparent disabled:bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Délai d'exécution (jours)
                  </label>
                  <input
                    type="number"
                    value={formData?.executionPeriod || 0}
                    onChange={(e) => handleInputChange('executionPeriod', parseInt(e.target.value) || 0)}
                    disabled={!isEditing}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:border-transparent disabled:bg-gray-100"
                  />
                </div>
              </div>
            </div>

            {/* Informations de l'autorité émettrice */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-4">Informations de l'autorité émettrice</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Autorité émettrice
                  </label>
                  <input
                    type="text"
                    value={formData?.issuingAuthority || ''}
                    onChange={(e) => handleInputChange('issuingAuthority', e.target.value)}
                    disabled={!isEditing}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:border-transparent disabled:bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pays
                  </label>
                  <input
                    type="text"
                    value={formData?.country || ''}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    disabled={!isEditing}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:border-transparent disabled:bg-gray-100"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Devise
                  </label>
                  <input
                    type="text"
                    value={formData?.motto || ''}
                    onChange={(e) => handleInputChange('motto', e.target.value)}
                    disabled={!isEditing}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:border-transparent disabled:bg-gray-100"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractOrderViewModal;
