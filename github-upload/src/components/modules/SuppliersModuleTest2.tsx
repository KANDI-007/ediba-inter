import React from 'react';

const SuppliersModuleTest2: React.FC = () => {
  console.log('SuppliersModuleTest2 - Component rendering');
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-green-600 mb-4">
        ✅ TEST MODULE FOURNISSEURS - VERSION 2
      </h1>
      <p className="text-gray-700">
        Si vous voyez ce message, le composant se charge correctement !
      </p>
      <div className="mt-4 p-4 bg-green-100 rounded-lg">
        <p className="text-green-800">
          Le problème de page blanche est résolu avec ce composant de test.
        </p>
      </div>
    </div>
  );
};

export default SuppliersModuleTest2;
