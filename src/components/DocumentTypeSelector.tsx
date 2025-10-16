import React from 'react';

interface DocumentType {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  gradient: string;
  isPopular?: boolean;
}

interface DocumentTypeSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (type: string) => void;
}

const DocumentTypeSelector: React.FC<DocumentTypeSelectorProps> = ({ isOpen, onClose, onSelect }) => {
  const documentTypes: DocumentType[] = [
    {
      id: 'proforma',
      name: 'Facture Proforma',
      description: 'Devis préliminaire avant validation',
      icon: '📋',
      color: 'blue',
      gradient: 'from-blue-500 to-blue-600',
      isPopular: true
    },
    {
      id: 'invoice',
      name: 'Facture',
      description: 'Document de facturation définitif',
      icon: '💰',
      color: 'green',
      gradient: 'from-green-500 to-green-600'
    },
    {
      id: 'delivery',
      name: 'Bon de Livraison',
      description: 'Document de livraison des marchandises',
      icon: '🚚',
      color: 'orange',
      gradient: 'from-orange-500 to-orange-600'
    },
    {
      id: 'contract',
      name: 'Contrat',
      description: 'Document contractuel formalisé',
      icon: '📄',
      color: 'purple',
      gradient: 'from-purple-500 to-purple-600'
    },
    {
      id: 'order',
      name: 'Lettre de Commande',
      description: 'Commande officielle client',
      icon: '📝',
      color: 'indigo',
      gradient: 'from-indigo-500 to-indigo-600'
    }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Nouveau Document</h2>
              <p className="text-blue-100">Choisissez le type de document que vous souhaitez créer</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors p-2 rounded-full hover:bg-white hover:bg-opacity-20"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {documentTypes.map((type) => (
              <div
                key={type.id}
                onClick={() => onSelect(type.id)}
                className={`
                  relative group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl
                  ${type.isPopular ? 'ring-2 ring-yellow-400 ring-opacity-50' : ''}
                `}
              >
                {/* Popular Badge */}
                {type.isPopular && (
                  <div className="absolute -top-2 -right-2 z-10">
                    <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                      POPULAIRE
                    </span>
                  </div>
                )}

                {/* Card */}
                <div className={`
                  bg-white border-2 border-gray-200 rounded-xl p-6 h-full
                  group-hover:border-${type.color}-300 group-hover:shadow-lg
                  transition-all duration-300
                `}>
                  {/* Icon */}
                  <div className={`
                    w-16 h-16 rounded-xl bg-gradient-to-br ${type.gradient} 
                    flex items-center justify-center text-3xl mb-4
                    group-hover:scale-110 transition-transform duration-300
                  `}>
                    {type.icon}
                  </div>

                  {/* Content */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-gray-700">
                      {type.name}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {type.description}
                    </p>
                  </div>

                  {/* Hover Effect */}
                  <div className={`
                    absolute inset-0 rounded-xl bg-gradient-to-br ${type.gradient} 
                    opacity-0 group-hover:opacity-5 transition-opacity duration-300
                  `} />
                </div>

                {/* Selection Indicator */}
                <div className={`
                  absolute top-4 right-4 w-6 h-6 rounded-full border-2 border-gray-300
                  group-hover:border-${type.color}-500 group-hover:bg-${type.color}-500
                  transition-all duration-300
                `}>
                  <div className={`
                    w-full h-full rounded-full bg-${type.color}-500 scale-0 group-hover:scale-50
                    transition-transform duration-300
                  `} />
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions Rapides</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => onSelect('proforma')}
                className="flex items-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200"
              >
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white mr-3">
                  📋
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-900">Facture Proforma</div>
                  <div className="text-sm text-gray-600">Création rapide</div>
                </div>
              </button>

              <button
                onClick={() => onSelect('invoice')}
                className="flex items-center p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors duration-200"
              >
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center text-white mr-3">
                  💰
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-900">Facture</div>
                  <div className="text-sm text-gray-600">Facturation définitive</div>
                </div>
              </button>

              <button
                onClick={() => onSelect('delivery')}
                className="flex items-center p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors duration-200"
              >
                <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center text-white mr-3">
                  🚚
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-900">Bon de Livraison</div>
                  <div className="text-sm text-gray-600">Livraison marchandises</div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              💡 <strong>Astuce :</strong> Vous pouvez modifier le type de document après création
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
            >
              Annuler
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentTypeSelector;
