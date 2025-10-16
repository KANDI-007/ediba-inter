import React from 'react';
import { Check, Palette, FileText, Star } from 'lucide-react';

interface InvoiceDesignSelectorProps {
  selectedDesign: string;
  onSelectDesign: (design: string) => void;
  onClose: () => void;
}

const InvoiceDesignSelector: React.FC<InvoiceDesignSelectorProps> = ({
  selectedDesign,
  onSelectDesign,
  onClose
}) => {
  const designs = [
    {
      id: 'proforma',
      name: 'Facture Proforma EDIBA (Défaut)',
      description: 'Design spécialisé pour factures proforma avec en-tête et pied de page personnalisés',
      preview: 'proforma-preview',
      colors: ['#1d4ed8', '#10b981', '#f3f4f6'],
      featured: true
    },
    {
      id: 'kilimandjaro',
      name: 'Design Kilimandjaro (Nouveau)',
      description: 'Design inspiré de la facture Kilimandjaro avec structure professionnelle et mise en page moderne',
      preview: 'kilimandjaro-preview',
      colors: ['#1f2937', '#374151', '#6b7280'],
      featured: false
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white w-full max-w-6xl max-h-[90vh] rounded-xl shadow-2xl overflow-hidden flex flex-col">
        <div className="px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Palette className="w-6 h-6 mr-3" />
              <h3 className="text-lg font-semibold">Sélectionner un design de facture</h3>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white text-2xl"
            >
              ×
            </button>
          </div>
          <p className="text-blue-100 text-sm mt-1">Choisissez le design qui correspond le mieux à votre entreprise</p>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {designs.map((design) => (
              <div
                key={design.id}
                className={`relative border-2 rounded-xl overflow-hidden cursor-pointer transition-all duration-200 ${
                  selectedDesign === design.id
                    ? 'border-blue-500 shadow-lg scale-105'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                }`}
                onClick={() => onSelectDesign(design.id)}
              >
                {design.featured && (
                  <div className="absolute top-2 right-2 z-10">
                    <div className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-semibold flex items-center">
                      <Star className="w-3 h-3 mr-1" />
                      Recommandé
                    </div>
                  </div>
                )}
                
                <div className="h-48 bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
                  {/* Aperçu du design */}
                  <div className="absolute inset-0 p-4">
                    <div className="h-full bg-white rounded-lg shadow-sm border">
                      {/* En-tête avec couleurs du design */}
                      <div 
                        className="h-16 rounded-t-lg flex items-center px-4"
                        style={{ backgroundColor: design.colors[0] }}
                      >
                        <div className="w-8 h-8 bg-white/20 rounded-full mr-3"></div>
                        <div className="text-white">
                          <div className="h-2 bg-white/60 rounded w-24 mb-1"></div>
                          <div className="h-1 bg-white/40 rounded w-16"></div>
                        </div>
                      </div>
                      
                      {/* Corps du document */}
                      <div className="p-4 space-y-2">
                        <div className="h-1 bg-gray-200 rounded w-full"></div>
                        <div className="h-1 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-1 bg-gray-200 rounded w-1/2"></div>
                        
                        {/* Tableau */}
                        <div className="mt-4 space-y-1">
                          <div className="h-1 bg-gray-300 rounded w-full"></div>
                          <div className="h-1 bg-gray-200 rounded w-full"></div>
                          <div className="h-1 bg-gray-200 rounded w-full"></div>
                          <div className="h-1 bg-gray-200 rounded w-full"></div>
                        </div>
                        
                        {/* Total */}
                        <div className="mt-4 flex justify-end">
                          <div 
                            className="h-2 rounded w-20"
                            style={{ backgroundColor: design.colors[1] }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{design.name}</h4>
                    {selectedDesign === design.id && (
                      <Check className="w-5 h-5 text-blue-500" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{design.description}</p>
                  
                  {/* Palette de couleurs */}
                  <div className="flex space-x-2">
                    {design.colors.map((color, index) => (
                      <div
                        key={index}
                        className="w-6 h-6 rounded-full border border-gray-200"
                        style={{ backgroundColor: color }}
                        title={color}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            onClick={() => {
              onSelectDesign(selectedDesign);
              onClose();
            }}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 flex items-center"
          >
            <FileText className="w-4 h-4 mr-2" />
            Utiliser ce design
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDesignSelector;
