import React from 'react';
import { FileText, FileSignature, X } from 'lucide-react';

interface ContractOrderSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectContract: () => void;
  onSelectOrder: () => void;
}

const ContractOrderSelectionModal: React.FC<ContractOrderSelectionModalProps> = ({
  isOpen,
  onClose,
  onSelectContract,
  onSelectOrder
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white w-full max-w-md rounded-xl shadow-2xl">
        <div className="px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Type de document</h3>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white text-2xl"
            >
              <X size={20} />
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <p className="text-gray-600 mb-6 text-center">
            Choisissez le type de document que vous souhaitez créer :
          </p>
          
          <div className="space-y-4">
            <button
              onClick={onSelectContract}
              className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 group"
            >
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                  <FileSignature className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-left">
                  <h4 className="font-semibold text-gray-900">Contrat</h4>
                  <p className="text-sm text-gray-600">Créer un nouveau contrat</p>
                </div>
              </div>
            </button>
            
            <button
              onClick={onSelectOrder}
              className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all duration-200 group"
            >
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                  <FileText className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-left">
                  <h4 className="font-semibold text-gray-900">Lettre de Commande</h4>
                  <p className="text-sm text-gray-600">Créer une nouvelle lettre de commande</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractOrderSelectionModal;
