import React, { useState } from 'react';
import { X, Save, FileText } from 'lucide-react';

interface ContractOrderFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ContractOrderData) => void;
  type: 'contract' | 'order';
}

export interface ContractOrderData {
  // Informations générales
  documentType: 'contract' | 'order';
  documentNumber: string;
  date: string;
  authorizingReference: string;
  
  // Informations de l'attributaire (EDIBA INTER)
  awardee: string;
  taxId: string;
  
  // Informations financières
  amount: number;
  amountInWords: string;
  warrantyPeriod: number;
  warrantyRetention: number;
  performanceGuarantee: string;
  
  // Informations bancaires
  bankAccount: string;
  bankName: string;
  
  // Informations budgétaires
  budgetAllocation: string;
  depositAccount: string;
  depositAccountTitle: string;
  
  // Informations du projet
  subject: string;
  lotDescription: string;
  executionPeriod: number;
  
  // Informations de l'autorité émettrice
  issuingAuthority: string;
  country: string;
  motto: string;
}

const ContractOrderFormModal: React.FC<ContractOrderFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  type
}) => {
  const [formData, setFormData] = useState<ContractOrderData>({
    documentType: type,
    documentNumber: '',
    date: new Date().toISOString().slice(0, 10),
    authorizingReference: '',
    awardee: 'EDIBA INTER SARL U',
    taxId: '1001694526',
    amount: 0,
    amountInWords: '',
    warrantyPeriod: 1,
    warrantyRetention: 5,
    performanceGuarantee: 'NEANT',
    bankAccount: 'TG005 01251 00115511401-48',
    bankName: 'BIA-TOGO POUR CECA',
    budgetAllocation: 'Budget de l\'État, Gestion 2024',
    depositAccount: '1173',
    depositAccountTitle: 'FACT-REGIONS',
    subject: 'EQUIPEMENT DES BUREAUX DE GOUVERNEURS ET SECRETAIRE GENERAUX DES GOUVERNORATS ET AUTRES BUREAUX',
    lotDescription: '',
    executionPeriod: 15,
    issuingAuthority: 'MINISTERE DE L\'ADMINISTRATION TERRITORIALE, DE LA DECENTRALISATION ET DU DEVELOPPEMENT DES TERRITOIRES',
    country: 'REPUBLIQUE TOGOLAISE',
    motto: 'Travail - Liberté - Patrie'
  });

  const handleInputChange = (field: keyof ContractOrderData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    if (!formData.documentNumber || !formData.amount || !formData.lotDescription) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }
    
    // Générer le numéro de document si vide
    if (!formData.documentNumber) {
      const year = new Date().getFullYear();
      const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      formData.documentNumber = `${randomNum}/${year}/ED/MATDDT/F/BIE`;
    }
    
    onSave(formData);
    onClose();
  };

  const convertNumberToWords = (num: number): string => {
    const ones = ['', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf', 'dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize', 'dix-sept', 'dix-huit', 'dix-neuf'];
    const tens = ['', '', 'vingt', 'trente', 'quarante', 'cinquante', 'soixante', 'soixante-dix', 'quatre-vingt', 'quatre-vingt-dix'];
    
    if (num === 0) return 'zéro';
    if (num < 20) return ones[num];
    if (num < 100) {
      const ten = Math.floor(num / 10);
      const one = num % 10;
      if (ten === 7 || ten === 9) {
        return tens[ten] + '-' + ones[10 + one];
      }
      return tens[ten] + (one > 0 ? '-' + ones[one] : '');
    }
    if (num < 1000) {
      const hundred = Math.floor(num / 100);
      const remainder = num % 100;
      return ones[hundred] + ' cent' + (remainder > 0 ? ' ' + convertNumberToWords(remainder) : '');
    }
    if (num < 1000000) {
      const thousand = Math.floor(num / 1000);
      const remainder = num % 1000;
      return convertNumberToWords(thousand) + ' mille' + (remainder > 0 ? ' ' + convertNumberToWords(remainder) : '');
    }
    if (num < 1000000000) {
      const million = Math.floor(num / 1000000);
      const remainder = num % 1000000;
      return convertNumberToWords(million) + ' million' + (remainder > 0 ? ' ' + convertNumberToWords(remainder) : '');
    }
    return num.toString();
  };

  const handleAmountChange = (value: string) => {
    const numValue = parseFloat(value) || 0;
    setFormData(prev => ({
      ...prev,
      amount: numValue,
      amountInWords: numValue > 0 ? convertNumberToWords(numValue) : ''
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white w-full max-w-4xl h-[90vh] rounded-xl shadow-2xl flex flex-col">
        <div className="px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white flex-shrink-0">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              {type === 'contract' ? 'Nouveau Contrat' : 'Nouvelle Lettre de Commande'}
            </h3>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white text-2xl"
            >
              <X size={20} />
            </button>
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
                    Numéro du document *
                  </label>
                  <input
                    type="text"
                    value={formData.documentNumber}
                    onChange={(e) => handleInputChange('documentNumber', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    placeholder="Ex: 075/2024/DC/MINARM/CAB/F/BG"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Référence autorisante
                  </label>
                  <input
                    type="text"
                    value={formData.authorizingReference}
                    onChange={(e) => handleInputChange('authorizingReference', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    placeholder="Ex: Lettre n°1470/MEF/DNCCP/DSCP du 22 mai 2024"
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
                    value={formData.awardee}
                    onChange={(e) => handleInputChange('awardee', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    NIF
                  </label>
                  <input
                    type="text"
                    value={formData.taxId}
                    onChange={(e) => handleInputChange('taxId', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
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
                    Montant (F CFA) *
                  </label>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => handleAmountChange(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Délai de garantie (années)
                  </label>
                  <input
                    type="number"
                    value={formData.warrantyPeriod}
                    onChange={(e) => handleInputChange('warrantyPeriod', parseInt(e.target.value) || 0)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Retenue de garantie (%)
                  </label>
                  <input
                    type="number"
                    value={formData.warrantyRetention}
                    onChange={(e) => handleInputChange('warrantyRetention', parseInt(e.target.value) || 0)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Garantie de bonne exécution
                  </label>
                  <input
                    type="text"
                    value={formData.performanceGuarantee}
                    onChange={(e) => handleInputChange('performanceGuarantee', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Montant en toutes lettres
                  </label>
                  <input
                    type="text"
                    value={formData.amountInWords}
                    readOnly
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100"
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
                    value={formData.bankAccount}
                    onChange={(e) => handleInputChange('bankAccount', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Banque
                  </label>
                  <input
                    type="text"
                    value={formData.bankName}
                    onChange={(e) => handleInputChange('bankName', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
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
                    value={formData.budgetAllocation}
                    onChange={(e) => handleInputChange('budgetAllocation', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Compte de dépôt
                  </label>
                  <input
                    type="text"
                    value={formData.depositAccount}
                    onChange={(e) => handleInputChange('depositAccount', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Intitulé du compte de dépôt
                  </label>
                  <input
                    type="text"
                    value={formData.depositAccountTitle}
                    onChange={(e) => handleInputChange('depositAccountTitle', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
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
                    Objet *
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => handleInputChange('subject', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description du lot *
                  </label>
                  <input
                    type="text"
                    value={formData.lotDescription}
                    onChange={(e) => handleInputChange('lotDescription', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    placeholder="Ex: Lot 2: MOBILIER DE BUREAUX DE BUREAUX AU PROFIT DU GOUVERNORAT DE LA KARA"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Délai d'exécution (jours)
                  </label>
                  <input
                    type="number"
                    value={formData.executionPeriod}
                    onChange={(e) => handleInputChange('executionPeriod', parseInt(e.target.value) || 0)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
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
                    value={formData.issuingAuthority}
                    onChange={(e) => handleInputChange('issuingAuthority', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pays
                  </label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Devise
                  </label>
                  <input
                    type="text"
                    value={formData.motto}
                    onChange={(e) => handleInputChange('motto', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="px-6 py-4 bg-gray-50 border-t flex justify-end space-x-3 flex-shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <Save className="w-4 h-4 mr-2" />
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContractOrderFormModal;
