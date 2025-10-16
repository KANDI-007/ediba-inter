import React, { useState } from 'react';
import { 
  Calendar, 
  Plus, 
  Lock, 
  Unlock, 
  CheckCircle, 
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  DollarSign,
  FileText,
  Users,
  BarChart3,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';
import { useFiscalYear, FiscalYear } from '../../contexts/FiscalYearContext';
import { useAuth } from '../../contexts/AuthContext';

const FiscalYearModule: React.FC = () => {
  const { 
    fiscalYears, 
    currentFiscalYear, 
    setCurrentFiscalYear,
    createFiscalYear, 
    closeFiscalYear, 
    lockFiscalYear, 
    unlockFiscalYear,
    getFiscalYearStats,
    canModifyFiscalYear 
  } = useFiscalYear();
  
  const { hasPermission } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCloseModal, setShowCloseModal] = useState<string | null>(null);
  const [editingYear, setEditingYear] = useState<FiscalYear | null>(null);
  const [newYear, setNewYear] = useState({
    year: new Date().getFullYear() + 1,
    startDate: '',
    endDate: ''
  });
  const [closeNotes, setCloseNotes] = useState('');

  const getStatusIcon = (status: FiscalYear['status']) => {
    switch (status) {
      case 'open':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'closed':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'locked':
        return <Lock className="w-4 h-4 text-red-500" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: FiscalYear['status']) => {
    switch (status) {
      case 'open':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-yellow-100 text-yellow-800';
      case 'locked':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: FiscalYear['status']) => {
    switch (status) {
      case 'open':
        return 'Ouvert';
      case 'closed':
        return 'Clôturé';
      case 'locked':
        return 'Verrouillé';
      default:
        return 'Inconnu';
    }
  };

  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString('fr-FR')} FCFA`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const handleCreateFiscalYear = () => {
    if (!newYear.startDate || !newYear.endDate) {
      alert('Veuillez renseigner les dates de début et de fin');
      return;
    }

    if (new Date(newYear.startDate) >= new Date(newYear.endDate)) {
      alert('La date de début doit être antérieure à la date de fin');
      return;
    }

    const fiscalYear = createFiscalYear(newYear.year, newYear.startDate, newYear.endDate);
    setCurrentFiscalYear(fiscalYear);
    setShowCreateModal(false);
    setNewYear({
      year: new Date().getFullYear() + 1,
      startDate: '',
      endDate: ''
    });
  };

  const handleCloseFiscalYear = (yearId: string) => {
    closeFiscalYear(yearId, closeNotes);
    setShowCloseModal(null);
    setCloseNotes('');
  };

  const stats = fiscalYears.reduce((acc, fy) => {
    const fyStats = getFiscalYearStats(fy.id);
    return {
      totalRevenue: acc.totalRevenue + fyStats.totalRevenue,
      totalExpenses: acc.totalExpenses + fyStats.totalExpenses,
      totalProfit: acc.totalProfit + fyStats.profit,
      totalInvoices: acc.totalInvoices + fyStats.totalInvoices
    };
  }, { totalRevenue: 0, totalExpenses: 0, totalProfit: 0, totalInvoices: 0 });

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="bg-gradient-to-r from-sky-400 to-green-400 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Gestion des Exercices Fiscaux</h1>
            <p className="text-sky-100">Gestion multi-exercices et clôture comptable</p>
          </div>
          {hasPermission('settings.manage') && (
            <button 
              onClick={() => setShowCreateModal(true)}
              className="bg-white text-sky-600 px-4 py-2 rounded-lg font-medium hover:bg-sky-50 transition-colors duration-200 flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nouvel exercice
            </button>
          )}
        </div>
      </div>

      {/* Statistiques globales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center">
            <TrendingUp className="w-8 h-8 text-green-500" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
              <p className="text-gray-600">CA Total</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center">
            <TrendingDown className="w-8 h-8 text-red-500" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalExpenses)}</p>
              <p className="text-gray-600">Dépenses Total</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center">
            <DollarSign className="w-8 h-8 text-blue-500" />
            <div className="ml-4">
              <p className={`text-2xl font-bold ${stats.totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(stats.totalProfit)}
              </p>
              <p className="text-gray-600">Bénéfice Total</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center">
            <FileText className="w-8 h-8 text-purple-500" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{stats.totalInvoices}</p>
              <p className="text-gray-600">Factures Total</p>
            </div>
          </div>
        </div>
      </div>

      {/* Exercice fiscal courant */}
      {currentFiscalYear && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Exercice Fiscal Courant
            </h3>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(currentFiscalYear.status)}`}>
              {getStatusIcon(currentFiscalYear.status)}
              <span className="ml-1">{getStatusText(currentFiscalYear.status)}</span>
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500">Période</p>
              <p className="font-semibold text-gray-900">
                {formatDate(currentFiscalYear.startDate)} - {formatDate(currentFiscalYear.endDate)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Année</p>
              <p className="font-semibold text-gray-900">{currentFiscalYear.year}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Statut</p>
              <p className="font-semibold text-gray-900">{getStatusText(currentFiscalYear.status)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Liste des exercices fiscaux */}
      <div className="bg-white shadow-sm rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Historique des Exercices</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {fiscalYears.map((fiscalYear) => {
            const fyStats = getFiscalYearStats(fiscalYear.id);
            const isCurrent = currentFiscalYear?.id === fiscalYear.id;
            
            return (
              <div key={fiscalYear.id} className={`p-6 hover:bg-gray-50 transition-colors duration-200 ${isCurrent ? 'bg-blue-50' : ''}`}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-lg font-semibold text-gray-900">
                        Exercice {fiscalYear.year}
                      </h4>
                      {isCurrent && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Courant
                        </span>
                      )}
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(fiscalYear.status)}`}>
                        {getStatusIcon(fiscalYear.status)}
                        <span className="ml-1">{getStatusText(fiscalYear.status)}</span>
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-500">Période</p>
                        <p className="font-medium text-gray-900">
                          {formatDate(fiscalYear.startDate)} - {formatDate(fiscalYear.endDate)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Chiffre d'affaires</p>
                        <p className="font-medium text-green-600">{formatCurrency(fyStats.totalRevenue)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Dépenses</p>
                        <p className="font-medium text-red-600">{formatCurrency(fyStats.totalExpenses)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Bénéfice</p>
                        <p className={`font-medium ${fyStats.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatCurrency(fyStats.profit)}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <FileText className="w-4 h-4 mr-2" />
                        <span>{fyStats.totalInvoices} factures</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="w-4 h-4 mr-2" />
                        <span>{fyStats.totalSuppliers} fournisseurs</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <BarChart3 className="w-4 h-4 mr-2" />
                        <span>{formatCurrency(fyStats.totalVAT)} TVA</span>
                      </div>
                    </div>

                    {fiscalYear.closingDate && (
                      <div className="mt-2 text-sm text-gray-500">
                        Clôturé le {formatDate(fiscalYear.closingDate)} par {fiscalYear.closedBy}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    {!isCurrent && (
                      <button
                        onClick={() => setCurrentFiscalYear(fiscalYear)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                        title="Définir comme exercice courant"
                      >
                        <Calendar className="w-4 h-4" />
                      </button>
                    )}
                    
                    {hasPermission('settings.manage') && (
                      <>
                        {fiscalYear.status === 'open' && (
                          <button
                            onClick={() => setShowCloseModal(fiscalYear.id)}
                            className="p-2 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors duration-200"
                            title="Clôturer l'exercice"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        
                        {fiscalYear.status === 'closed' && (
                          <button
                            onClick={() => lockFiscalYear(fiscalYear.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                            title="Verrouiller l'exercice"
                          >
                            <Lock className="w-4 h-4" />
                          </button>
                        )}
                        
                        {fiscalYear.status === 'locked' && (
                          <button
                            onClick={() => unlockFiscalYear(fiscalYear.id)}
                            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200"
                            title="Déverrouiller l'exercice"
                          >
                            <Unlock className="w-4 h-4" />
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal Création d'exercice */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden">
            <div className="px-6 py-4 bg-gradient-to-r from-sky-400 to-green-400 text-white">
              <h3 className="text-lg font-semibold">Nouvel Exercice Fiscal</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Année</label>
                <input
                  type="number"
                  value={newYear.year}
                  onChange={(e) => setNewYear({ ...newYear, year: Number(e.target.value) })}
                  className="w-full border rounded-lg px-3 py-2"
                  min={new Date().getFullYear()}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Date de début</label>
                <input
                  type="date"
                  value={newYear.startDate}
                  onChange={(e) => setNewYear({ ...newYear, startDate: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Date de fin</label>
                <input
                  type="date"
                  value={newYear.endDate}
                  onChange={(e) => setNewYear({ ...newYear, endDate: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 flex justify-end gap-2">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 rounded-lg border"
              >
                Annuler
              </button>
              <button
                onClick={handleCreateFiscalYear}
                className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
              >
                Créer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Clôture d'exercice */}
      {showCloseModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden">
            <div className="px-6 py-4 bg-gradient-to-r from-yellow-400 to-orange-400 text-white">
              <h3 className="text-lg font-semibold">Clôturer l'Exercice</h3>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-gray-600">
                Êtes-vous sûr de vouloir clôturer cet exercice fiscal ? Cette action est irréversible.
              </p>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Notes de clôture (optionnel)</label>
                <textarea
                  value={closeNotes}
                  onChange={(e) => setCloseNotes(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2"
                  rows={3}
                  placeholder="Ajoutez des notes sur la clôture de cet exercice..."
                />
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 flex justify-end gap-2">
              <button
                onClick={() => setShowCloseModal(null)}
                className="px-4 py-2 rounded-lg border"
              >
                Annuler
              </button>
              <button
                onClick={() => handleCloseFiscalYear(showCloseModal)}
                className="px-4 py-2 rounded-lg bg-yellow-600 text-white hover:bg-yellow-700"
              >
                Clôturer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FiscalYearModule;
