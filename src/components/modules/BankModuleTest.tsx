import React from 'react';
import { useData } from '../../contexts/DataContext';

const BankModuleTest: React.FC = () => {
  const { bankAccounts } = useData();
  
  console.log('BankModuleTest - bankAccounts:', bankAccounts);
  
  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Test Module Banque</h2>
      
      <div className="mb-4">
        <p className="text-gray-600">Nombre de comptes bancaires: {bankAccounts?.length || 0}</p>
        <p className="text-gray-600">Type de bankAccounts: {typeof bankAccounts}</p>
        <p className="text-gray-600">bankAccounts est undefined: {bankAccounts === undefined ? 'Oui' : 'Non'}</p>
        <p className="text-gray-600">bankAccounts est null: {bankAccounts === null ? 'Oui' : 'Non'}</p>
      </div>
      
      {bankAccounts && bankAccounts.length > 0 ? (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Comptes bancaires trouvés:</h3>
          {bankAccounts.map((bank, index) => (
            <div key={bank.id || index} className="p-3 bg-gray-100 rounded">
              <p><strong>Banque:</strong> {bank.bankName}</p>
              <p><strong>Compte:</strong> {bank.accountNumber}</p>
              <p><strong>Par défaut:</strong> {bank.isDefault ? 'Oui' : 'Non'}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-4 bg-red-100 border border-red-400 rounded">
          <p className="text-red-700">Aucun compte bancaire trouvé!</p>
          <p className="text-red-600 text-sm">bankAccounts: {JSON.stringify(bankAccounts)}</p>
        </div>
      )}
    </div>
  );
};

export default BankModuleTest;
