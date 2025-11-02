import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

// Version simplifiée de l'App sans contextes complexes
function SimpleApp() {
  const [currentView, setCurrentView] = React.useState('dashboard');

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <div style={{ padding: '20px' }}>
            <h1 style={{ color: '#2563eb' }}>🏠 Tableau de Bord EDIBA-INTER</h1>
            <p>Application de gestion de facturation</p>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: '20px',
              marginTop: '30px'
            }}>
              <button 
                onClick={() => setCurrentView('invoices')}
                style={{
                  padding: '20px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: 'bold'
                }}
              >
                📄 Facturation
              </button>
              
              <button 
                onClick={() => setCurrentView('clients')}
                style={{
                  padding: '20px',
                  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: 'bold'
                }}
              >
                👥 Clients
              </button>
              
              <button 
                onClick={() => setCurrentView('reports')}
                style={{
                  padding: '20px',
                  background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: 'bold'
                }}
              >
                📊 Rapports
              </button>
            </div>
          </div>
        );
        
      case 'invoices':
        return (
          <div style={{ padding: '20px' }}>
            <div style={{ marginBottom: '20px' }}>
              <button 
                onClick={() => setCurrentView('dashboard')}
                style={{
                  padding: '10px 20px',
                  background: '#6b7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                ← Retour
              </button>
            </div>
            <h1 style={{ color: '#2563eb' }}>📄 Module Facturation</h1>
            <p>Gestion des factures, devis et bons de livraison</p>
            
            <div style={{ 
              background: '#f0f9ff', 
              padding: '20px', 
              borderRadius: '8px',
              border: '1px solid #0ea5e9',
              marginTop: '20px'
            }}>
              <h3>✅ Fonctionnalités Disponibles</h3>
              <ul>
                <li>Création de devis et factures</li>
                <li>Gestion des bons de livraison</li>
                <li>Suivi des paiements</li>
                <li>Export PDF</li>
                <li>Vue tableau avec colonne NIF</li>
              </ul>
            </div>
          </div>
        );
        
      case 'clients':
        return (
          <div style={{ padding: '20px' }}>
            <div style={{ marginBottom: '20px' }}>
              <button 
                onClick={() => setCurrentView('dashboard')}
                style={{
                  padding: '10px 20px',
                  background: '#6b7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                ← Retour
              </button>
            </div>
            <h1 style={{ color: '#2563eb' }}>👥 Module Clients</h1>
            <p>Gestion de la base clients</p>
            
            <div style={{ 
              background: '#f0fdf4', 
              padding: '20px', 
              borderRadius: '8px',
              border: '1px solid #22c55e',
              marginTop: '20px'
            }}>
              <h3>✅ Fonctionnalités Disponibles</h3>
              <ul>
                <li>Ajout et modification de clients</li>
                <li>Gestion des informations NIF</li>
                <li>Historique des factures</li>
                <li>Recherche et filtrage</li>
              </ul>
            </div>
          </div>
        );
        
      case 'reports':
        return (
          <div style={{ padding: '20px' }}>
            <div style={{ marginBottom: '20px' }}>
              <button 
                onClick={() => setCurrentView('dashboard')}
                style={{
                  padding: '10px 20px',
                  background: '#6b7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                ← Retour
              </button>
            </div>
            <h1 style={{ color: '#2563eb' }}>📊 Module Rapports</h1>
            <p>Génération de rapports et statistiques</p>
            
            <div style={{ 
              background: '#fef3c7', 
              padding: '20px', 
              borderRadius: '8px',
              border: '1px solid #f59e0b',
              marginTop: '20px'
            }}>
              <h3>✅ Fonctionnalités Disponibles</h3>
              <ul>
                <li>Rapports de facturation</li>
                <li>Statistiques par période</li>
                <li>Export Excel/PDF</li>
                <li>Graphiques et tableaux</li>
              </ul>
            </div>
          </div>
        );
        
      default:
        return <div>Vue non trouvée</div>;
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      background: '#f8fafc',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Header */}
      <header style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{ margin: 0, fontSize: '24px' }}>🏢 EDIBA-INTER</h1>
          <p style={{ margin: '5px 0 0 0', opacity: 0.9 }}>
            Application de Gestion de Facturation
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {renderContent()}
      </main>

      {/* Footer */}
      <footer style={{
        background: '#1f2937',
        color: 'white',
        padding: '20px',
        textAlign: 'center',
        marginTop: '50px'
      }}>
        <p style={{ margin: 0 }}>
          © 2025 EDIBA INTER SARL U - Tous droits réservés
        </p>
        <p style={{ margin: '5px 0 0 0', fontSize: '14px', opacity: 0.8 }}>
          Développé par LARE Kandi - kandilare20@gmail.com
        </p>
      </footer>
    </div>
  );
}

// Point d'entrée
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<SimpleApp />);
} else {
  console.error('❌ Élément root non trouvé dans le DOM');
}
