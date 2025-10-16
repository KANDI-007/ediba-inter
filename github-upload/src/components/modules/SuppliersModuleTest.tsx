import React from 'react';

const SuppliersModuleTest: React.FC = () => {
  console.log('SuppliersModuleTest - Component rendering');
  
  return (
    <div style={{ padding: '20px', backgroundColor: '#f0f0f0' }}>
      <h1 style={{ color: 'red', fontSize: '24px' }}>TEST MODULE FOURNISSEURS</h1>
      <p>Si vous voyez ce message, le composant se charge !</p>
      <div style={{ marginTop: '20px' }}>
        <button 
          onClick={() => alert('Test réussi !')}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#25C1FF', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Test Bouton
        </button>
      </div>
    </div>
  );
};

export default SuppliersModuleTest;
