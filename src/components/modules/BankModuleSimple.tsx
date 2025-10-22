import React from 'react';
import { useData } from '../../contexts/DataContext';

const BankModuleSimple: React.FC = () => {
  const { bankAccounts } = useData();
  
  console.log('BankModuleSimple - bankAccounts:', bankAccounts);
  
  if (!bankAccounts) {
    return (
      <div className="p-6 bg-red-100 border border-red-400 rounded-lg">
        <h2 className="text-xl font-bold text-red-800">Erreur Module Banque</h2>
        <p className="text-red-700">bankAccounts est undefined ou null</p>
      </div>
    );
  }
  
  if (bankAccounts.length === 0) {
    return (
      <div className="p-6 bg-yellow-100 border border-yellow-400 rounded-lg">
        <h2 className="text-xl font-bold text-yellow-800">Module Banque</h2>
        <p className="text-yellow-700">Aucun compte bancaire trouvé</p>
        <p className="text-yellow-600 text-sm">bankAccounts: {JSON.stringify(bankAccounts)}</p>
      </div>
    );
  }
  
  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Module Banque - Version Simple</h2>
      
      <div className="mb-4">
        <p className="text-gray-600">Nombre de comptes: {bankAccounts.length}</p>
      </div>
      
      <div className="space-y-4">
        {bankAccounts.map((bank, index) => (
          <div key={bank.id || index} className="p-4 bg-gray-50 border rounded-lg">
            <h3 className="font-semibold text-gray-800">{bank.bankName}</h3>
            <p className="text-gray-600">Compte: {bank.accountNumber}</p>
            <p className="text-gray-600">Titulaire: {bank.accountHolder}</p>
            <p className="text-gray-600">Type: {bank.accountType}</p>
            <p className="text-gray-600">Devise: {bank.currency}</p>
            <p className="text-gray-600">Par défaut: {bank.isDefault ? 'Oui' : 'Non'}</p>
            <p className="text-gray-600">Actif: {bank.isActive ? 'Oui' : 'Non'}</p>
          </div>
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-green-100 border border-green-400 rounded-lg">
        <p className="text-green-700">✅ Module Banque fonctionne correctement!</p>
        <p className="text-green-600 text-sm">Les données sont chargées et affichées.</p>
      </div>
    </div>
  );
};

export default BankModuleSimple;
