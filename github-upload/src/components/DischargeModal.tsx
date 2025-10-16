import React, { useState, useEffect } from 'react';
import { X, User, Phone, CreditCard, Calendar, MapPin, FileText, Save, AlertCircle } from 'lucide-react';

interface DischargeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (discharge: any) => void;
  discharge?: any;
  title: string;
  suppliersList: any[];
  documents: any[];
}

const DischargeModal: React.FC<DischargeModalProps> = ({
  isOpen,
  onClose,
  onSave,
  discharge,
  title,
  suppliersList,
  documents
}) => {
  const [formData, setFormData] = useState({
    prestataire: '',
    service: '',
    montant: 0,
    datePrestation: new Date().toISOString().slice(0, 10),
    lieu: '',
    telephone: '',
    cni: ''
  });
  
  const [prestataireType, setPrestataireType] = useState<'fournisseur' | 'client'>('fournisseur');
  const [showPrestataireSuggestions, setShowPrestataireSuggestions] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Récupérer les fournisseurs et clients existants
  const existingPrestataires = {
    fournisseurs: suppliersList.map(s => s.raisonSociale),
    clients: Array.from(new Set(documents.map(d => d.client).filter(Boolean)))
  };

  useEffect(() => {
    if (discharge) {
      setFormData({
        prestataire: discharge.prestataire || '',
        service: discharge.service || '',
        montant: discharge.montant || 0,
        datePrestation: discharge.datePrestation || new Date().toISOString().slice(0, 10),
        lieu: discharge.lieu || '',
        telephone: discharge.telephone || '',
        cni: discharge.cni || ''
      });
    } else {
      setFormData({
        prestataire: '',
        service: '',
        montant: 0,
        datePrestation: new Date().toISOString().slice(0, 10),
        lieu: '',
        telephone: '',
        cni: ''
      });
    }
  }, [discharge]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.prestataire.trim()) {
      newErrors.prestataire = 'Le prestataire est requis';
    }
    if (!formData.service.trim()) {
      newErrors.service = 'Le service est requis';
    }
    if (formData.montant <= 0) {
      newErrors.montant = 'Le montant doit être supérieur à 0';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave(formData);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold">{title}</h3>
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
            {/* Type de prestataire */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Type de prestataire</label>
              <div className="flex space-x-4">
                <button
                  onClick={() => setPrestataireType('fournisseur')}
                  className={`px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                    prestataireType === 'fournisseur'
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Fournisseur
                </button>
                <button
                  onClick={() => setPrestataireType('client')}
                  className={`px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                    prestataireType === 'client'
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Client
                </button>
              </div>
            </div>

            {/* Prestataire */}
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Prestataire <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={formData.prestataire}
                  onChange={(e) => {
                    setFormData({ ...formData, prestataire: e.target.value });
                    setShowPrestataireSuggestions(e.target.value.length > 0);
                  }}
                  onFocus={() => setShowPrestataireSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowPrestataireSuggestions(false), 200)}
                  className={`w-full pl-12 pr-4 py-4 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.prestataire ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                  placeholder={`Nom du ${prestataireType}`}
                />
                {errors.prestataire && (
                  <div className="flex items-center mt-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.prestataire}
                  </div>
                )}
              </div>
              
              {showPrestataireSuggestions && (
                <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-40 overflow-y-auto">
                  {(prestataireType === 'fournisseur' ? existingPrestataires.fournisseurs : existingPrestataires.clients)
                    .filter(name => name.toLowerCase().includes(formData.prestataire.toLowerCase()))
                    .map((name, index) => (
                      <div
                        key={index}
                        className="px-4 py-3 hover:bg-gray-100 cursor-pointer text-sm border-b border-gray-100 last:border-b-0"
                        onClick={() => {
                          setFormData({ ...formData, prestataire: name });
                          setShowPrestataireSuggestions(false);
                        }}
                      >
                        {name}
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Téléphone et CNI */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Téléphone</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={formData.telephone}
                    onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                    className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="+228 XX XX XX XX"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">CNI</label>
                <input
                  type="text"
                  value={formData.cni}
                  onChange={(e) => setFormData({ ...formData, cni: e.target.value })}
                  className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Numéro CNI"
                />
              </div>
            </div>

            {/* Montant et Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Montant <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <CreditCard className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="number"
                    value={formData.montant}
                    onChange={(e) => setFormData({ ...formData, montant: Number(e.target.value) })}
                    className={`w-full pl-12 pr-4 py-4 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.montant ? 'border-red-300 bg-red-50' : 'border-gray-200'
                    }`}
                    placeholder="Montant en FCFA"
                  />
                </div>
                {errors.montant && (
                  <div className="flex items-center mt-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.montant}
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Date de prestation</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="date"
                    value={formData.datePrestation}
                    onChange={(e) => setFormData({ ...formData, datePrestation: e.target.value })}
                    className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>
            </div>

            {/* Lieu */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Lieu</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={formData.lieu}
                  onChange={(e) => setFormData({ ...formData, lieu: e.target.value })}
                  className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Lieu de la prestation"
                />
              </div>
            </div>

            {/* Service */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Service <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FileText className="absolute left-4 top-4 text-gray-400 w-5 h-5" />
                <textarea
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                  className={`w-full pl-12 pr-4 py-4 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none ${
                    errors.service ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                  rows={4}
                  placeholder="Description du service"
                />
              </div>
              {errors.service && (
                <div className="flex items-center mt-2 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.service}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-200 font-medium"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium flex items-center space-x-2 shadow-lg"
          >
            <Save className="w-4 h-4" />
            <span>{discharge ? 'Mettre à jour' : 'Créer la décharge'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DischargeModal;
