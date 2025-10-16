import React, { useState, useRef } from 'react';
import { 
  Database, 
  Download, 
  Upload, 
  Trash2, 
  RotateCcw, 
  Plus, 
  Calendar,
  HardDrive,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  Settings
} from 'lucide-react';
import { useBackup, BackupData } from '../../contexts/BackupContext';
import { useAuth } from '../../contexts/AuthContext';

const BackupModule: React.FC = () => {
  const { 
    backups, 
    createBackup, 
    restoreBackup, 
    deleteBackup, 
    exportBackup, 
    importBackup,
    getBackupSize,
    scheduleAutoBackup,
    cancelAutoBackup,
    getStorageUsage
  } = useBackup();
  
  const { hasPermission } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showRestoreModal, setShowRestoreModal] = useState<string | null>(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [newBackup, setNewBackup] = useState({ name: '', description: '' });
  const [isCreating, setIsCreating] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getTypeIcon = (type: BackupData['type']) => {
    switch (type) {
      case 'full':
        return <Database className="w-4 h-4 text-blue-500" />;
      case 'incremental':
        return <Clock className="w-4 h-4 text-green-500" />;
      default:
        return <Database className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTypeColor = (type: BackupData['type']) => {
    switch (type) {
      case 'full':
        return 'bg-blue-100 text-blue-800';
      case 'incremental':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('fr-FR');
  };

  const handleCreateBackup = async () => {
    if (!newBackup.name.trim()) {
      alert('Veuillez renseigner un nom pour la sauvegarde');
      return;
    }

    setIsCreating(true);
    try {
      await createBackup(newBackup.name, newBackup.description);
      setShowCreateModal(false);
      setNewBackup({ name: '', description: '' });
      alert('Sauvegarde créée avec succès');
    } catch (error) {
      alert('Erreur lors de la création de la sauvegarde');
    } finally {
      setIsCreating(false);
    }
  };

  const handleRestoreBackup = async (backupId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir restaurer cette sauvegarde ? Toutes les données actuelles seront remplacées.')) {
      return;
    }

    setIsRestoring(true);
    try {
      const success = await restoreBackup(backupId);
      if (success) {
        alert('Sauvegarde restaurée avec succès. La page va se recharger.');
      } else {
        alert('Erreur lors de la restauration de la sauvegarde');
      }
    } catch (error) {
      alert('Erreur lors de la restauration de la sauvegarde');
    } finally {
      setIsRestoring(false);
      setShowRestoreModal(null);
    }
  };

  const handleImportBackup = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const success = await importBackup(file);
      if (success) {
        alert('Sauvegarde importée avec succès');
      } else {
        alert('Erreur lors de l\'import de la sauvegarde');
      }
    } catch (error) {
      alert('Erreur lors de l\'import de la sauvegarde');
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const storageUsage = getStorageUsage();

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="bg-gradient-to-r from-sky-400 to-green-400 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Gestion des Sauvegardes</h1>
            <p className="text-sky-100">Sauvegarde et restauration des données</p>
          </div>
          {hasPermission('settings.manage') && (
            <button 
              onClick={() => setShowCreateModal(true)}
              className="bg-white text-sky-600 px-4 py-2 rounded-lg font-medium hover:bg-sky-50 transition-colors duration-200 flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle sauvegarde
            </button>
          )}
        </div>
      </div>

      {/* Statistiques de stockage */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center">
            <HardDrive className="w-8 h-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">
                {((storageUsage.used / 1024 / 1024) * 100).toFixed(1)}%
              </p>
              <p className="text-gray-600">Stockage utilisé</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center">
            <Database className="w-8 h-8 text-green-500" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{backups.length}</p>
              <p className="text-gray-600">Sauvegardes</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center">
            <Calendar className="w-8 h-8 text-purple-500" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">
                {backups.length > 0 ? formatDate(backups[0].timestamp).split(' ')[0] : 'Aucune'}
              </p>
              <p className="text-gray-600">Dernière sauvegarde</p>
            </div>
          </div>
        </div>
      </div>

      {/* Barre de progression du stockage */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Utilisation du stockage</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Stockage utilisé</span>
            <span>{((storageUsage.used / 1024 / 1024) * 100).toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${storageUsage.percentage > 80 ? 'bg-red-500' : storageUsage.percentage > 60 ? 'bg-yellow-500' : 'bg-green-500'}`}
              style={{ width: `${storageUsage.percentage}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>{(storageUsage.used / 1024 / 1024).toFixed(2)} MB</span>
            <span>{(storageUsage.total / 1024 / 1024).toFixed(0)} MB</span>
          </div>
        </div>
        {storageUsage.percentage > 80 && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <AlertTriangle className="w-4 h-4 text-red-500 mr-2" />
              <span className="text-sm text-red-700">
                Stockage presque plein. Considérez supprimer d'anciennes sauvegardes.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Actions rapides */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-sky-400 hover:bg-sky-50 transition-colors duration-200"
          >
            <Plus className="w-6 h-6 text-gray-400 mr-2" />
            <span className="text-gray-600">Créer une sauvegarde</span>
          </button>
          
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-400 hover:bg-green-50 transition-colors duration-200"
          >
            <Upload className="w-6 h-6 text-gray-400 mr-2" />
            <span className="text-gray-600">Importer une sauvegarde</span>
          </button>
          
          <button
            onClick={() => setShowScheduleModal(true)}
            className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-colors duration-200"
          >
            <Settings className="w-6 h-6 text-gray-400 mr-2" />
            <span className="text-gray-600">Sauvegarde automatique</span>
          </button>
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleImportBackup}
          className="hidden"
        />
      </div>

      {/* Liste des sauvegardes */}
      <div className="bg-white shadow-sm rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Sauvegardes disponibles</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {backups.map((backup) => (
            <div key={backup.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    {getTypeIcon(backup.type)}
                    <h4 className="text-lg font-semibold text-gray-900">{backup.name}</h4>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(backup.type)}`}>
                      {backup.type === 'full' ? 'Complète' : 'Incrémentale'}
                    </span>
                  </div>
                  
                  {backup.description && (
                    <p className="text-sm text-gray-600 mb-2">{backup.description}</p>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-500">
                    <div>
                      <p className="font-medium text-gray-900">Créée le</p>
                      <p>{formatDate(backup.timestamp)}</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Taille</p>
                      <p>{getBackupSize(backup)}</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Version</p>
                      <p>{backup.version}</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Documents</p>
                      <p>{backup.data.documents.length} factures</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => exportBackup(backup.id)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                    title="Exporter"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={() => setShowRestoreModal(backup.id)}
                    className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200"
                    title="Restaurer"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  
                  {hasPermission('settings.manage') && (
                    <button
                      onClick={() => {
                        if (confirm('Êtes-vous sûr de vouloir supprimer cette sauvegarde ?')) {
                          deleteBackup(backup.id);
                        }
                      }}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {backups.length === 0 && (
          <div className="p-12 text-center">
            <Database className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune sauvegarde</h3>
            <p className="text-gray-500">Créez votre première sauvegarde pour protéger vos données.</p>
          </div>
        )}
      </div>

      {/* Modal Création de sauvegarde */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden">
            <div className="px-6 py-4 bg-gradient-to-r from-sky-400 to-green-400 text-white">
              <h3 className="text-lg font-semibold">Nouvelle sauvegarde</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Nom de la sauvegarde *</label>
                <input
                  type="text"
                  value={newBackup.name}
                  onChange={(e) => setNewBackup({ ...newBackup, name: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="Ex: Sauvegarde du mois de janvier"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Description (optionnel)</label>
                <textarea
                  value={newBackup.description}
                  onChange={(e) => setNewBackup({ ...newBackup, description: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                  rows={3}
                  placeholder="Description de cette sauvegarde..."
                />
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 flex justify-end gap-2">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 rounded-lg border"
                disabled={isCreating}
              >
                Annuler
              </button>
              <button
                onClick={handleCreateBackup}
                disabled={isCreating || !newBackup.name.trim()}
                className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {isCreating ? 'Création...' : 'Créer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Restauration */}
      {showRestoreModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden">
            <div className="px-6 py-4 bg-gradient-to-r from-yellow-400 to-orange-400 text-white">
              <h3 className="text-lg font-semibold">Restaurer la sauvegarde</h3>
            </div>
            <div className="p-6">
              <div className="flex items-center mb-4">
                <AlertTriangle className="w-6 h-6 text-yellow-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-700">
                    <strong>Attention :</strong> Cette action va remplacer toutes les données actuelles par celles de la sauvegarde.
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                Êtes-vous sûr de vouloir continuer ? Cette action est irréversible.
              </p>
            </div>
            <div className="px-6 py-4 bg-gray-50 flex justify-end gap-2">
              <button
                onClick={() => setShowRestoreModal(null)}
                className="px-4 py-2 rounded-lg border"
                disabled={isRestoring}
              >
                Annuler
              </button>
              <button
                onClick={() => handleRestoreBackup(showRestoreModal)}
                disabled={isRestoring}
                className="px-4 py-2 rounded-lg bg-yellow-600 text-white hover:bg-yellow-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {isRestoring ? 'Restauration...' : 'Restaurer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Sauvegarde automatique */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden">
            <div className="px-6 py-4 bg-gradient-to-r from-purple-400 to-purple-600 text-white">
              <h3 className="text-lg font-semibold">Sauvegarde automatique</h3>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-gray-600">
                Configurez la sauvegarde automatique de vos données.
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => {
                    scheduleAutoBackup('daily');
                    setShowScheduleModal(false);
                  }}
                  className="w-full p-3 text-left border rounded-lg hover:bg-gray-50"
                >
                  <div className="font-medium">Quotidienne</div>
                  <div className="text-sm text-gray-500">Sauvegarde tous les jours</div>
                </button>
                <button
                  onClick={() => {
                    scheduleAutoBackup('weekly');
                    setShowScheduleModal(false);
                  }}
                  className="w-full p-3 text-left border rounded-lg hover:bg-gray-50"
                >
                  <div className="font-medium">Hebdomadaire</div>
                  <div className="text-sm text-gray-500">Sauvegarde chaque semaine</div>
                </button>
                <button
                  onClick={() => {
                    scheduleAutoBackup('monthly');
                    setShowScheduleModal(false);
                  }}
                  className="w-full p-3 text-left border rounded-lg hover:bg-gray-50"
                >
                  <div className="font-medium">Mensuelle</div>
                  <div className="text-sm text-gray-500">Sauvegarde chaque mois</div>
                </button>
                <button
                  onClick={() => {
                    cancelAutoBackup();
                    setShowScheduleModal(false);
                  }}
                  className="w-full p-3 text-left border border-red-300 rounded-lg hover:bg-red-50 text-red-600"
                >
                  <div className="font-medium">Désactiver</div>
                  <div className="text-sm text-red-500">Annuler la sauvegarde automatique</div>
                </button>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 flex justify-end">
              <button
                onClick={() => setShowScheduleModal(false)}
                className="px-4 py-2 rounded-lg border"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BackupModule;
