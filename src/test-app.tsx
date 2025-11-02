import React from 'react';
import { createRoot } from 'react-dom/client';

// Composant de test simple
function TestApp() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#2563eb' }}>🔧 Test EDIBA-INTER</h1>
      <p>Si vous voyez ce message, React fonctionne correctement.</p>
      <div style={{ 
        background: '#f0f9ff', 
        padding: '15px', 
        borderRadius: '8px',
        border: '1px solid #0ea5e9',
        marginTop: '20px'
      }}>
        <h3>✅ Diagnostic réussi</h3>
        <p>L'application React se charge correctement.</p>
        <p>Le problème pourrait venir d'un composant spécifique.</p>
      </div>
    </div>
  );
}

// Point d'entrée de test
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<TestApp />);
} else {
  console.error('❌ Élément root non trouvé');
}
