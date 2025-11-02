import React, { useState } from 'react';
import { X, Save, FileText } from 'lucide-react';
import { useData } from '../contexts/DataContext';

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
  amountType: 'ht' | 'ttc'; // Nouveau: type de montant
  amountHT: number; // Nouveau: montant HT
  amountTTC: number; // Nouveau: montant TTC
  amountInWords: string;
  warrantyPeriod: number; // En mois maintenant
  warrantyRetention: number;
  performanceGuarantee: number; // En pourcentage maintenant
  
  // Informations bancaires
  bankAccount: string;
  bankName: string;
  
  // Informations budgétaires (regroupées en un seul champ)
  budgetInformation: string;
  
  // Informations du projet
  subject: string;
  lotDescription: string; // Non obligatoire maintenant
  executionPeriod: number; // Avec option immédiate
  
  // Informations de l'autorité contractante (renommé)
  contractingAuthority: string; // Renommé de issuingAuthority
  country: string;
}

const ContractOrderFormModal: React.FC<ContractOrderFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  type
}) => {
  const { bankAccounts } = useData();
  const [formData, setFormData] = useState<ContractOrderData>({
    documentType: type,
    documentNumber: '', // Sera généré automatiquement
    date: new Date().toISOString().slice(0, 10),
    authorizingReference: '',
    awardee: 'EDIBA INTER SARL U',
    taxId: '1001694526',
    amountType: 'ht', // Par défaut HT
    amountHT: 0,
    amountTTC: 0,
    amountInWords: '',
    warrantyPeriod: 12, // 12 mois par défaut
    warrantyRetention: 5,
    performanceGuarantee: 5, // 5% par défaut
    bankAccount: bankAccounts?.find(ba => ba.isDefault)?.accountNumber || 'TG005 01251 00115511401-48',
    bankName: bankAccounts?.find(ba => ba.isDefault)?.bankName || 'BIA-TOGO POUR CECA',
    budgetInformation: 'Budget de l\'État, Gestion 2024\nCompte de dépôt: 1173\nIntitulé: FACT-REGIONS',
    subject: 'EQUIPEMENT DES BUREAUX DE GOUVERNEURS ET SECRETAIRE GENERAUX DES GOUVERNORATS ET AUTRES BUREAUX',
    lotDescription: '', // Non obligatoire
    executionPeriod: 15,
    contractingAuthority: 'MINISTERE DE L\'ADMINISTRATION TERRITORIALE, DE LA DECENTRALISATION ET DU DEVELOPPEMENT DES TERRITOIRES',
    country: 'REPUBLIQUE TOGOLAISE'
  });

  const handleInputChange = (field: keyof ContractOrderData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Fonction de génération automatique du numéro de document
  const generateDocumentNumber = () => {
    const year = new Date().getFullYear();
    const month = (new Date().getMonth() + 1).toString().padStart(2, '0');
    const day = new Date().getDate().toString().padStart(2, '0');
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    
    if (type === 'contract') {
      return `${randomNum}/${year}/CONTRAT/MATDDT/F/BIE`;
    } else {
      return `${randomNum}/${year}/LC/MATDDT/F/BIE`;
    }
  };

  const handleSave = () => {
    // Validation des champs obligatoires (lotDescription n'est plus obligatoire)
    if (!formData.subject || formData.amountHT <= 0) {
      alert('Veuillez remplir l\'objet et le montant HT');
      return;
    }
    
    // Générer automatiquement le numéro de document
    const finalFormData = {
      ...formData,
      documentNumber: formData.documentNumber || generateDocumentNumber()
    };
    
    onSave(finalFormData);
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

  // Fonction de calcul HT/TTC avec TVA 18%
  const calculateAmounts = (amount: number, type: 'ht' | 'ttc') => {
    const tvaRate = 0.18; // 18%
    
    if (type === 'ht') {
      const amountHT = amount;
      const amountTTC = amountHT * (1 + tvaRate);
      return { amountHT, amountTTC };
    } else {
      const amountTTC = amount;
      const amountHT = amountTTC / (1 + tvaRate);
      return { amountHT, amountTTC };
    }
  };

  const handleAmountChange = (value: string, type: 'ht' | 'ttc') => {
    const numValue = parseFloat(value) || 0;
    const { amountHT, amountTTC } = calculateAmounts(numValue, type);
    
    setFormData(prev => ({
      ...prev,
      amountType: type,
      amountHT,
      amountTTC,
      amountInWords: amountTTC > 0 ? convertNumberToWords(Math.round(amountTTC)) : ''
    }));
  };

  // Liste des pays avec drapeaux (par ordre alphabétique)
  const countries = [
    { code: 'TG', name: 'République Togolaise', flag: '🇹🇬' },
    { code: 'BF', name: 'Burkina Faso', flag: '🇧🇫' },
    { code: 'BJ', name: 'Bénin', flag: '🇧🇯' },
    { code: 'CI', name: 'Côte d\'Ivoire', flag: '🇨🇮' },
    { code: 'GH', name: 'Ghana', flag: '🇬🇭' },
    { code: 'GN', name: 'Guinée', flag: '🇬🇳' },
    { code: 'ML', name: 'Mali', flag: '🇲🇱' },
    { code: 'NE', name: 'Niger', flag: '🇳🇪' },
    { code: 'SN', name: 'Sénégal', flag: '🇸🇳' },
    { code: 'FR', name: 'France', flag: '🇫🇷' },
    { code: 'US', name: 'États-Unis', flag: '🇺🇸' },
    { code: 'CA', name: 'Canada', flag: '🇨🇦' },
    { code: 'DE', name: 'Allemagne', flag: '🇩🇪' },
    { code: 'GB', name: 'Royaume-Uni', flag: '🇬🇧' },
    { code: 'IT', name: 'Italie', flag: '🇮🇹' },
    { code: 'ES', name: 'Espagne', flag: '🇪🇸' },
    { code: 'NL', name: 'Pays-Bas', flag: '🇳🇱' },
    { code: 'BE', name: 'Belgique', flag: '🇧🇪' },
    { code: 'CH', name: 'Suisse', flag: '🇨🇭' },
    { code: 'CN', name: 'Chine', flag: '🇨🇳' },
    { code: 'JP', name: 'Japon', flag: '🇯🇵' },
    { code: 'KR', name: 'Corée du Sud', flag: '🇰🇷' },
    { code: 'IN', name: 'Inde', flag: '🇮🇳' },
    { code: 'BR', name: 'Brésil', flag: '🇧🇷' },
    { code: 'RU', name: 'Russie', flag: '🇷🇺' },
    { code: 'AU', name: 'Australie', flag: '🇦🇺' },
    { code: 'ZA', name: 'Afrique du Sud', flag: '🇿🇦' },
    { code: 'EG', name: 'Égypte', flag: '🇪🇬' },
    { code: 'NG', name: 'Nigeria', flag: '🇳🇬' },
    { code: 'KE', name: 'Kenya', flag: '🇰🇪' },
    { code: 'MA', name: 'Maroc', flag: '🇲🇦' },
    { code: 'DZ', name: 'Algérie', flag: '🇩🇿' },
    { code: 'TN', name: 'Tunisie', flag: '🇹🇳' },
    { code: 'LY', name: 'Libye', flag: '🇱🇾' },
    { code: 'SD', name: 'Soudan', flag: '🇸🇩' },
    { code: 'ET', name: 'Éthiopie', flag: '🇪🇹' },
    { code: 'UG', name: 'Ouganda', flag: '🇺🇬' },
    { code: 'TZ', name: 'Tanzanie', flag: '🇹🇿' },
    { code: 'ZW', name: 'Zimbabwe', flag: '🇿🇼' },
    { code: 'BW', name: 'Botswana', flag: '🇧🇼' },
    { code: 'NA', name: 'Namibie', flag: '🇳🇦' },
    { code: 'ZM', name: 'Zambie', flag: '🇿🇲' },
    { code: 'MW', name: 'Malawi', flag: '🇲🇼' },
    { code: 'MZ', name: 'Mozambique', flag: '🇲🇿' },
    { code: 'MG', name: 'Madagascar', flag: '🇲🇬' },
    { code: 'MU', name: 'Maurice', flag: '🇲🇺' },
    { code: 'SC', name: 'Seychelles', flag: '🇸🇨' },
    { code: 'KM', name: 'Comores', flag: '🇰🇲' },
    { code: 'DJ', name: 'Djibouti', flag: '🇩🇯' },
    { code: 'SO', name: 'Somalie', flag: '🇸🇴' },
    { code: 'ER', name: 'Érythrée', flag: '🇪🇷' },
    { code: 'CF', name: 'République centrafricaine', flag: '🇨🇫' },
    { code: 'TD', name: 'Tchad', flag: '🇹🇩' },
    { code: 'CM', name: 'Cameroun', flag: '🇨🇲' },
    { code: 'GA', name: 'Gabon', flag: '🇬🇦' },
    { code: 'CG', name: 'Congo', flag: '🇨🇬' },
    { code: 'CD', name: 'République démocratique du Congo', flag: '🇨🇩' },
    { code: 'AO', name: 'Angola', flag: '🇦🇴' },
    { code: 'ST', name: 'Sao Tomé-et-Principe', flag: '🇸🇹' },
    { code: 'GQ', name: 'Guinée équatoriale', flag: '🇬🇶' },
    { code: 'CV', name: 'Cap-Vert', flag: '🇨🇻' },
    { code: 'GM', name: 'Gambie', flag: '🇬🇲' },
    { code: 'GW', name: 'Guinée-Bissau', flag: '🇬🇼' },
    { code: 'SL', name: 'Sierra Leone', flag: '🇸🇱' },
    { code: 'LR', name: 'Libéria', flag: '🇱🇷' },
    { code: 'MR', name: 'Mauritanie', flag: '🇲🇷' },
    { code: 'RW', name: 'Rwanda', flag: '🇷🇼' },
    { code: 'BI', name: 'Burundi', flag: '🇧🇮' },
    { code: 'SS', name: 'Soudan du Sud', flag: '🇸🇸' },
    { code: 'LS', name: 'Lesotho', flag: '🇱🇸' },
    { code: 'SZ', name: 'Eswatini', flag: '🇸🇿' }
  ];

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
                    Numéro du document (généré automatiquement)
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={formData.documentNumber || generateDocumentNumber()}
                      onChange={(e) => handleInputChange('documentNumber', e.target.value)}
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                      placeholder="Sera généré automatiquement"
                    />
                    <button
                      type="button"
                      onClick={() => handleInputChange('documentNumber', generateDocumentNumber())}
                      className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
                    >
                      Générer
                    </button>
                  </div>
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
                {/* Choix du type de montant */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type de montant
                  </label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="amountType"
                        value="ht"
                        checked={formData.amountType === 'ht'}
                        onChange={(e) => handleInputChange('amountType', e.target.value)}
                        className="mr-2"
                      />
                      Montant HT
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="amountType"
                        value="ttc"
                        checked={formData.amountType === 'ttc'}
                        onChange={(e) => handleInputChange('amountType', e.target.value)}
                        className="mr-2"
                      />
                      Montant TTC
                    </label>
                  </div>
                </div>

                {/* Montant HT */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Montant HT (F CFA) *
                  </label>
                  <input
                    type="number"
                    value={formData.amountHT}
                    onChange={(e) => handleAmountChange(e.target.value, 'ht')}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    placeholder="0"
                  />
                </div>

                {/* Montant TTC */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Montant TTC (F CFA) *
                  </label>
                  <input
                    type="number"
                    value={formData.amountTTC}
                    onChange={(e) => handleAmountChange(e.target.value, 'ttc')}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    placeholder="0"
                  />
                </div>

                {/* Délai de garantie en mois */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Délai de garantie (mois)
                  </label>
                  <select
                    value={formData.warrantyPeriod}
                    onChange={(e) => handleInputChange('warrantyPeriod', parseInt(e.target.value))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  >
                    <option value={6}>6 mois</option>
                    <option value={12}>12 mois</option>
                    <option value={18}>18 mois</option>
                    <option value={24}>24 mois</option>
                    <option value={30}>30 mois</option>
                    <option value={36}>36 mois</option>
                    <option value={48}>48 mois</option>
                    <option value={60}>60 mois</option>
                  </select>
                </div>

                {/* Retenue de garantie */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Retenue de garantie (%)
                  </label>
                  <select
                    value={formData.warrantyRetention}
                    onChange={(e) => handleInputChange('warrantyRetention', parseInt(e.target.value))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  >
                    <option value={0}>0%</option>
                    <option value={2}>2%</option>
                    <option value={3}>3%</option>
                    <option value={5}>5%</option>
                    <option value={7}>7%</option>
                    <option value={10}>10%</option>
                    <option value={15}>15%</option>
                    <option value={20}>20%</option>
                  </select>
                </div>

                {/* Garantie de bonne exécution */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Garantie de bonne exécution (%)
                  </label>
                  <select
                    value={formData.performanceGuarantee}
                    onChange={(e) => handleInputChange('performanceGuarantee', parseInt(e.target.value))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  >
                    <option value={0}>0%</option>
                    <option value={2}>2%</option>
                    <option value={3}>3%</option>
                    <option value={5}>5%</option>
                    <option value={7}>7%</option>
                    <option value={10}>10%</option>
                    <option value={15}>15%</option>
                    <option value={20}>20%</option>
                  </select>
                </div>

                {/* Montant en toutes lettres */}
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
                  <select
                    value={formData.bankAccount}
                    onChange={(e) => {
                      const selectedBank = bankAccounts?.find(ba => ba.accountNumber === e.target.value);
                      if (selectedBank) {
                        setFormData(prev => ({
                          ...prev,
                          bankAccount: selectedBank.accountNumber,
                          bankName: selectedBank.bankName
                        }));
                      }
                    }}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  >
                    {bankAccounts?.map((bank) => (
                      <option key={bank.id} value={bank.accountNumber}>
                        {bank.bankName} - {bank.accountNumber} {bank.isDefault ? '(Par défaut)' : ''}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Banque
                  </label>
                  <input
                    type="text"
                    value={formData.bankName}
                    readOnly
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100"
                  />
                </div>
              </div>
            </div>

            {/* Informations budgétaires */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-4">Informations budgétaires</h4>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Informations budgétaires complètes
                </label>
                <textarea
                  value={formData.budgetInformation}
                  onChange={(e) => handleInputChange('budgetInformation', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  rows={4}
                  placeholder="Exemple:&#10;Budget de l'État, Gestion 2024&#10;Compte de dépôt: 1173&#10;Intitulé: FACT-REGIONS"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Vous pouvez saisir toutes les informations budgétaires ici (imputation budgétaire, compte de dépôt, intitulé, etc.)
                </p>
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
                    Description du lot
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
                    Délai d'exécution
                  </label>
                  <select
                    value={formData.executionPeriod}
                    onChange={(e) => handleInputChange('executionPeriod', parseInt(e.target.value))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  >
                    <option value={0}>Immédiate</option>
                    <option value={7}>7 jours</option>
                    <option value={15}>15 jours</option>
                    <option value={30}>30 jours</option>
                    <option value={45}>45 jours</option>
                    <option value={60}>60 jours</option>
                    <option value={90}>90 jours</option>
                    <option value={120}>120 jours</option>
                    <option value={180}>180 jours</option>
                    <option value={365}>1 an</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Informations de l'autorité contractante */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-4">Informations de l'autorité contractante</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Autorité contractante
                  </label>
                  <input
                    type="text"
                    value={formData.contractingAuthority}
                    onChange={(e) => handleInputChange('contractingAuthority', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pays
                  </label>
                  <select
                    value={formData.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  >
                    {countries.map((country) => (
                      <option key={country.code} value={country.name}>
                        {country.flag} {country.name}
                      </option>
                    ))}
                  </select>
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
