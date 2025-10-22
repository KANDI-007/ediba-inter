import React, { useEffect, useState } from 'react';
import { Building2, Save, CreditCard } from 'lucide-react';
import BankModule from './BankModule';

type CompanyDetails = {
  companyName: string;
  tradeName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  country: string;
  taxId: string;
  registrationNumber: string;
  website: string;
};

const STORAGE_KEY = 'ediba.company.details';

const defaultDetails: CompanyDetails = {
  companyName: '',
  tradeName: '',
  phone: '',
  email: '',
  address: '',
  city: '',
  country: '',
  taxId: '',
  registrationNumber: '',
  website: '',
};

const ParametersModule: React.FC = () => {
  const [details, setDetails] = useState<CompanyDetails>(defaultDetails);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'company' | 'bank'>('company');

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CompanyDetails;
        setDetails({ ...defaultDetails, ...parsed });
      }
    } catch (_) {
      // ignore
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setDetails(prev => ({ ...prev, [name]: value }));
    setSaved(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(details));
    setSaved(true);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-sky-400 to-green-400 rounded-lg p-6 text-white">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mr-3">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold mb-1">Paramètres</h1>
            <p className="text-sky-100">Gérez les informations de votre entreprise et vos comptes bancaires.</p>
          </div>
        </div>
        
        {/* Onglets */}
        <div className="flex space-x-1 bg-white/20 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('company')}
            className={`flex-1 flex items-center justify-center px-4 py-2 rounded-md transition-colors ${
              activeTab === 'company' 
                ? 'bg-white text-sky-600 font-semibold' 
                : 'text-white hover:bg-white/10'
            }`}
          >
            <Building2 className="w-4 h-4 mr-2" />
            Informations Entreprise
          </button>
          <button
            onClick={() => setActiveTab('bank')}
            className={`flex-1 flex items-center justify-center px-4 py-2 rounded-md transition-colors ${
              activeTab === 'bank' 
                ? 'bg-white text-sky-600 font-semibold' 
                : 'text-white hover:bg-white/10'
            }`}
          >
            <CreditCard className="w-4 h-4 mr-2" />
            Comptes Bancaires
          </button>
        </div>
      </div>

      {/* Contenu conditionnel basé sur l'onglet actif */}
      {activeTab === 'company' && (
        <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Raison sociale</label>
            <input name="companyName" value={details.companyName} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-400 focus:ring-sky-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom commercial</label>
            <input name="tradeName" value={details.tradeName} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-400 focus:ring-sky-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
            <input name="phone" value={details.phone} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-400 focus:ring-sky-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" name="email" value={details.email} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-400 focus:ring-sky-400" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
            <textarea name="address" value={details.address} onChange={handleChange} rows={2} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-400 focus:ring-sky-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ville</label>
            <input name="city" value={details.city} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-400 focus:ring-sky-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pays</label>
            <input name="country" value={details.country} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-400 focus:ring-sky-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">NIF / Tax ID</label>
            <input name="taxId" value={details.taxId} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-400 focus:ring-sky-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">RCCM / Registre</label>
            <input name="registrationNumber" value={details.registrationNumber} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-400 focus:ring-sky-400" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Site web</label>
            <input type="url" name="website" value={details.website} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-400 focus:ring-sky-400" />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          {saved && (
            <span className="text-sm text-green-600">Enregistré avec succès</span>
          )}
          <button type="submit" className="inline-flex items-center px-4 py-2 rounded-md text-white bg-gradient-to-r from-sky-400 to-green-400 hover:from-sky-500 hover:to-green-500 shadow-md">
            <Save className="w-4 h-4 mr-2" />
            Enregistrer
          </button>
        </div>
      </form>
      )}

      {/* Module Banque */}
      {activeTab === 'bank' && <BankModule />}
    </div>
  );
};

export default ParametersModule;


