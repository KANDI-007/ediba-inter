import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { useRealtimeSync } from '../hooks/useRealtimeSync';
import { useActivityLogger } from '../contexts/ActivityContext';
import { RealtimeActivityFeed } from './SyncNotification';

// Exemple d'intégration de la synchronisation temps réel dans un module
export const SyncIntegrationExample: React.FC = () => {
  const { documents, addDocument, updateDocument, deleteDocument } = useData();
  const { emitDocumentEvent } = useRealtimeSync();
  const { logCreate, logUpdate, logDelete } = useActivityLogger();
  const [isCreating, setIsCreating] = useState(false);

  // Fonction pour créer un document avec synchronisation
  const handleCreateDocument = async (documentData: any) => {
    setIsCreating(true);
    try {
      // Créer le document localement
      const newDocument = addDocument(documentData);
      
      // Émettre l'événement de synchronisation
      emitDocumentEvent('create', newDocument, {
        documentType: newDocument.type,
        clientName: newDocument.client,
        totalAmount: newDocument.totalTtc
      });
      
      // Logger l'activité
      logCreate('Document', `Création de ${newDocument.type} ${newDocument.id} pour ${newDocument.client}`);
      
      console.log('✅ Document créé et synchronisé:', newDocument);
    } catch (error) {
      console.error('❌ Erreur création document:', error);
    } finally {
      setIsCreating(false);
    }
  };

  // Fonction pour mettre à jour un document avec synchronisation
  const handleUpdateDocument = async (id: string, updates: any) => {
    try {
      // Mettre à jour le document localement
      updateDocument(id, updates);
      
      // Trouver le document mis à jour
      const updatedDocument = documents.find(doc => doc.id === id);
      if (updatedDocument) {
        // Émettre l'événement de synchronisation
        emitDocumentEvent('update', updatedDocument, {
          documentType: updatedDocument.type,
          clientName: updatedDocument.client,
          changes: Object.keys(updates)
        });
        
        // Logger l'activité
        logUpdate('Document', `Mise à jour de ${updatedDocument.type} ${updatedDocument.id}`);
        
        console.log('✅ Document mis à jour et synchronisé:', updatedDocument);
      }
    } catch (error) {
      console.error('❌ Erreur mise à jour document:', error);
    }
  };

  // Fonction pour supprimer un document avec synchronisation
  const handleDeleteDocument = async (id: string) => {
    try {
      // Trouver le document avant suppression
      const documentToDelete = documents.find(doc => doc.id === id);
      
      // Supprimer le document localement
      deleteDocument(id);
      
      if (documentToDelete) {
        // Émettre l'événement de synchronisation
        emitDocumentEvent('delete', { id }, {
          documentType: documentToDelete.type,
          clientName: documentToDelete.client
        });
        
        // Logger l'activité
        logDelete('Document', `Suppression de ${documentToDelete.type} ${documentToDelete.id}`);
        
        console.log('✅ Document supprimé et synchronisé:', documentToDelete);
      }
    } catch (error) {
      console.error('❌ Erreur suppression document:', error);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Synchronisation Temps Réel - Exemple
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Section des actions */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">
              Actions Synchronisées
            </h3>
            
            <div className="space-y-3">
              <button
                onClick={() => handleCreateDocument({
                  type: 'proforma',
                  client: 'Client Test',
                  items: [{ description: 'Test', quantity: 1, unitPrice: 100 }],
                  tva: 18.5
                })}
                disabled={isCreating}
                className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
              >
                {isCreating ? 'Création...' : 'Créer Document Test'}
              </button>
              
              <button
                onClick={() => {
                  const firstDoc = documents[0];
                  if (firstDoc) {
                    handleUpdateDocument(firstDoc.id, { status: 'validated' });
                  }
                }}
                disabled={documents.length === 0}
                className="w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 disabled:opacity-50"
              >
                Valider Premier Document
              </button>
              
              <button
                onClick={() => {
                  const firstDoc = documents[0];
                  if (firstDoc) {
                    handleDeleteDocument(firstDoc.id);
                  }
                }}
                disabled={documents.length === 0}
                className="w-full bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 disabled:opacity-50"
              >
                Supprimer Premier Document
              </button>
            </div>
          </div>
          
          {/* Section des documents */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">
              Documents ({documents.length})
            </h3>
            
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {documents.slice(0, 5).map((doc) => (
                <div key={doc.id} className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium text-gray-900">
                        {doc.type} {doc.id}
                      </div>
                      <div className="text-sm text-gray-600">
                        {doc.client} - {doc.totalTtc?.toFixed(2)} FCFA
                      </div>
                      <div className="text-xs text-gray-500">
                        {doc.status} - {new Date(doc.date).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleUpdateDocument(doc.id, { status: 'validated' })}
                        className="text-green-600 hover:text-green-800 text-xs"
                      >
                        Valider
                      </button>
                      <button
                        onClick={() => handleDeleteDocument(doc.id)}
                        className="text-red-600 hover:text-red-800 text-xs"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              {documents.length === 0 && (
                <div className="text-gray-500 text-center py-4">
                  Aucun document trouvé
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Feed d'activité en temps réel */}
      <RealtimeActivityFeed />
    </div>
  );
};
