import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

// Composant de test minimal sans contextes
function MinimalTestApp() {
  const [isLoaded, setIsLoaded] = React.useState(false);

  React.useEffect(() => {
    // Simuler un chargement
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (!isLoaded) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            width: '50px', 
            height: '50px', 
            border: '3px solid rgba(255,255,255,0.3)',
            borderTop: '3px solid white',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <h2>🔧 Diagnostic EDIBA-INTER</h2>
          <p>Chargement en cours...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      background: '#f8fafc',
      minHeight: '100vh'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        background: 'white',
        padding: '30px',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <h1 style={{ color: '#2563eb', marginBottom: '20px' }}>
          ✅ Diagnostic EDIBA-INTER Réussi
        </h1>
        
        <div style={{ 
          background: '#f0f9ff', 
          padding: '20px', 
          borderRadius: '8px',
          border: '1px solid #0ea5e9',
          marginBottom: '20px'
        }}>
          <h3 style={{ color: '#0369a1', marginTop: 0 }}>🎯 Statut de l'Application</h3>
          <ul style={{ color: '#0c4a6e' }}>
            <li>✅ React fonctionne correctement</li>
            <li>✅ CSS se charge correctement</li>
            <li>✅ JavaScript s'exécute sans erreur</li>
            <li>✅ Composants se rendent correctement</li>
          </ul>
        </div>

        <div style={{ 
          background: '#fef3c7', 
          padding: '20px', 
          borderRadius: '8px',
          border: '1px solid #f59e0b',
          marginBottom: '20px'
        }}>
          <h3 style={{ color: '#92400e', marginTop: 0 }}>⚠️ Problème Identifié</h3>
          <p style={{ color: '#78350f', margin: 0 }}>
            Si vous voyez cette page, le problème vient probablement d'un contexte ou composant spécifique 
            dans l'application principale. Le problème n'est pas dans React lui-même.
          </p>
        </div>

        <div style={{ 
          background: '#ecfdf5', 
          padding: '20px', 
          borderRadius: '8px',
          border: '1px solid #10b981'
        }}>
          <h3 style={{ color: '#047857', marginTop: 0 }}>🔧 Solutions Recommandées</h3>
          <ol style={{ color: '#065f46' }}>
            <li>Vérifier la console du navigateur pour les erreurs JavaScript</li>
            <li>Désactiver temporairement les contextes un par un</li>
            <li>Vérifier les imports dans App.tsx</li>
            <li>Redémarrer le serveur de développement</li>
          </ol>
        </div>

        <div style={{ 
          marginTop: '30px',
          padding: '15px',
          background: '#f1f5f9',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <p style={{ margin: 0, color: '#475569' }}>
            <strong>Prochaine étape :</strong> Ouvrez la console du navigateur (F12) 
            et recherchez les erreurs JavaScript.
          </p>
        </div>
      </div>
    </div>
  );
}

// Styles CSS pour l'animation
const style = document.createElement('style');
style.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(style);

// Point d'entrée
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<MinimalTestApp />);
} else {
  console.error('❌ Élément root non trouvé dans le DOM');
}
