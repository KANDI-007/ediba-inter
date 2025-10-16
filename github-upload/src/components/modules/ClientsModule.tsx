import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Download, 
  Eye, 
  Edit, 
  Trash2,
  Users,
  Building,
  Phone,
  Mail,
  MapPin,
  FileText,
  DollarSign,
  Calendar,
  Star,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { useData } from '../../contexts/DataContext';

interface Client {
  id: string;
  raisonSociale: string;
  nomCommercial?: string;
  nif: string;
  rccm?: string;
  adresse: string;
  ville: string;
  telephone: string;
  email: string;
  contactPrincipal: string;
  secteurActivite: string;
  regimeFiscal: 'Réel Normal' | 'Réel Simplifié' | 'Forfait';
  delaiPaiement: number; // en jours
  remise: number; // en pourcentage
  limiteCredit: number;
  statut: 'actif' | 'inactif' | 'suspendu';
  dateCreation: string;
  derniereFacture?: string;
  totalFacture: number;
  totalEncaissement: number;
  soldeImpaye: number;
  nombreFactures: number;
}

const ClientsModule: React.FC = () => {
  const { documents, clients, addClient, updateClient, deleteClient } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [sortBy, setSortBy] = useState<'nom' | 'ca' | 'factures' | 'solde'>('nom');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const [form, setForm] = useState<Partial<Client>>({
    raisonSociale: '',
    nomCommercial: '',
    nif: '',
    rccm: '',
    adresse: '',
    ville: 'Lomé',
    telephone: '',
    email: '',
    contactPrincipal: '',
    secteurActivite: '',
    regimeFiscal: 'Réel Normal',
    delaiPaiement: 30,
    remise: 0,
    limiteCredit: 0,
    statut: 'actif'
  });


  // Calculer les statistiques pour chaque client
  const clientsWithStats = useMemo(() => {
    return clients.map(client => {
      // Calculer les statistiques basées sur les factures finales uniquement
      const clientDocs = documents.filter(doc => doc.client === client.raisonSociale && doc.type === 'invoice');
      const totalFacture = clientDocs.reduce((sum, doc) => {
        const montant = doc.items.reduce((s, it) => s + it.quantity * it.unitPrice, 0) * (1 + doc.tva/100);
        return sum + montant;
      }, 0);
      
      const totalEncaissement = clientDocs.reduce((sum, doc) => {
        if (doc.status === 'paid') {
          const montant = doc.items.reduce((s, it) => s + it.quantity * it.unitPrice, 0) * (1 + doc.tva/100);
          return sum + montant;
        } else if (doc.status === 'partial') {
          const paye = (doc.payments || []).reduce((s, p) => s + p.amount, 0);
          return sum + paye;
        }
        return sum;
      }, 0);
      
      const soldeImpaye = totalFacture - totalEncaissement;
      const nombreFactures = clientDocs.length;
      const derniereFacture = clientDocs.length > 0 ? 
        clientDocs.sort((a, b) => b.date.localeCompare(a.date))[0].date : undefined;
      
      return {
        ...client,
        totalFacture,
        totalEncaissement,
        soldeImpaye,
        nombreFactures,
        derniereFacture
      };
    });
  }, [clients, documents]);

  const filteredClients = clientsWithStats.filter(client => {
    const matchesSearch = client.raisonSociale.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.nif.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'actif' && client.statut === 'actif') ||
                      (activeTab === 'inactif' && client.statut === 'inactif') ||
                      (activeTab === 'suspendu' && client.statut === 'suspendu') ||
                      (activeTab === 'top' && client.totalFacture > 500000);

    return matchesSearch && matchesTab;
  });

  const sortedClients = [...filteredClients].sort((a, b) => {
    let aValue: any, bValue: any;
    
    switch (sortBy) {
      case 'nom':
        aValue = a.raisonSociale;
        bValue = b.raisonSociale;
        break;
      case 'ca':
        aValue = a.totalFacture;
        bValue = b.totalFacture;
        break;
      case 'factures':
        aValue = a.nombreFactures;
        bValue = b.nombreFactures;
        break;
      case 'solde':
        aValue = a.soldeImpaye;
        bValue = b.soldeImpaye;
        break;
      default:
        aValue = a.raisonSociale;
        bValue = b.raisonSociale;
    }

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const stats = {
    totalClients: clientsWithStats.length,
    clientsActifs: clientsWithStats.filter(c => c.statut === 'actif').length,
    caTotal: clientsWithStats.reduce((s, c) => s + c.totalFacture, 0),
    soldeTotal: clientsWithStats.reduce((s, c) => s + c.soldeImpaye, 0)
  };

  const topClients = [...clientsWithStats]
    .sort((a, b) => b.totalFacture - a.totalFacture)
    .slice(0, 5);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'actif':
        return 'bg-green-100 text-green-800';
      case 'inactif':
        return 'bg-gray-100 text-gray-800';
      case 'suspendu':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'actif':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'inactif':
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
      case 'suspendu':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="bg-gradient-to-r from-sky-400 to-green-400 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Module Clients</h1>
            <p className="text-sky-100">Gestion des clients et suivi commercial</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => { setEditingId(null); setForm({}); setShowAddModal(true); }}
              className="bg-white text-sky-600 px-4 py-2 rounded-lg font-medium hover:bg-sky-50 transition-colors duration-200 flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nouveau client
            </button>
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-sky-500" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{stats.totalClients}</p>
              <p className="text-gray-600">Total clients</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-green-500" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{stats.clientsActifs}</p>
              <p className="text-gray-600">Clients actifs</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center">
            <DollarSign className="w-8 h-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{stats.caTotal.toLocaleString('fr-FR')} FCFA</p>
              <p className="text-gray-600">CA Total</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center">
            <AlertCircle className="w-8 h-8 text-red-500" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{stats.soldeTotal.toLocaleString('fr-FR')} FCFA</p>
              <p className="text-gray-600">Soldes impayés</p>
            </div>
          </div>
        </div>
      </div>

      {/* Top 5 Clients */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Star className="w-5 h-5 mr-2 text-yellow-500" />
          Top 5 Clients par CA
        </h3>
        <div className="space-y-3">
          {topClients.map((client, index) => (
            <div key={client.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-sky-400 to-green-400 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                  {index + 1}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{client.raisonSociale}</p>
                  <p className="text-sm text-gray-500">{client.nombreFactures} factures</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">{client.totalFacture.toLocaleString('fr-FR')} FCFA</p>
                <p className="text-sm text-gray-500">CA Total</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Rechercher par raison sociale, NIF ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-400 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-400"
            >
              <option value="nom">Trier par nom</option>
              <option value="ca">Trier par CA</option>
              <option value="factures">Trier par factures</option>
              <option value="solde">Trier par solde</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
            <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              <Download className="w-4 h-4 mr-2" />
              Exporter
            </button>
          </div>
        </div>

        {/* Onglets */}
        <div className="mt-4 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'all', name: 'Tous', count: clientsWithStats.length },
              { id: 'actif', name: 'Actifs', count: clientsWithStats.filter(c => c.statut === 'actif').length },
              { id: 'inactif', name: 'Inactifs', count: clientsWithStats.filter(c => c.statut === 'inactif').length },
              { id: 'suspendu', name: 'Suspendus', count: clientsWithStats.filter(c => c.statut === 'suspendu').length },
              { id: 'top', name: 'Top Clients', count: clientsWithStats.filter(c => c.totalFacture > 500000).length }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-sky-500 text-sky-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.name} ({tab.count})
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Liste des clients */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {sortedClients.map((client) => (
          <div key={client.id} className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-sky-400 to-green-400 rounded-lg flex items-center justify-center">
                    <Building className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-semibold text-gray-900">{client.raisonSociale}</h3>
                    <p className="text-sm text-gray-500">{client.nif}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  {getStatusIcon(client.statut)}
                  <span className={`ml-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(client.statut)}`}>
                    {client.statut}
                  </span>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                  <span className="truncate">{client.adresse}, {client.ville}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="w-4 h-4 mr-2 text-gray-400" />
                  <span>{client.telephone}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="w-4 h-4 mr-2 text-gray-400" />
                  <span className="truncate">{client.email}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                  <span>Client depuis {new Date(client.dateCreation).toLocaleDateString('fr-FR')}</span>
                </div>
              </div>

              {/* Statistiques client */}
              <div className="bg-gray-50 p-3 rounded-lg mb-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-500">CA Total</p>
                    <p className="font-semibold text-gray-900">{client.totalFacture.toLocaleString('fr-FR')} FCFA</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Factures</p>
                    <p className="font-semibold text-gray-900">{client.nombreFactures}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Encaissé</p>
                    <p className="font-semibold text-green-600">{client.totalEncaissement.toLocaleString('fr-FR')} FCFA</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Impayé</p>
                    <p className="font-semibold text-red-600">{client.soldeImpaye.toLocaleString('fr-FR')} FCFA</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  <button className="p-2 text-gray-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors duration-200" title="Voir historique">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button 
                    className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200" 
                    title="Modifier"
                    onClick={() => {
                      setEditingId(client.id);
                      setForm(client);
                      setShowAddModal(true);
                    }}
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200" title="Nouvelle facture">
                    <FileText className="w-4 h-4" />
                  </button>
                </div>
                <button 
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200" 
                  title="Supprimer"
                  onClick={() => {
                    if (confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) {
                      try {
                        deleteClient(client.id);
                        alert('Client supprimé avec succès');
                      } catch (error) {
                        alert('Erreur lors de la suppression du client');
                      }
                    }
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {sortedClients.length === 0 && (
        <div className="bg-white rounded-lg shadow-lg p-12 text-center">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun client trouvé</h3>
          <p className="text-gray-500">Aucun client ne correspond à vos critères de recherche.</p>
        </div>
      )}

      {/* Modal Ajout/Modification Client */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-xl shadow-2xl overflow-hidden flex flex-col">
            <div className="px-6 py-4 bg-gradient-to-r from-sky-400 to-green-400 text-white">
              <h3 className="text-lg font-semibold">{editingId ? 'Modifier client' : 'Nouveau client'}</h3>
            </div>
            <div className="p-6 space-y-4 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600">Raison sociale *</label>
                  <input 
                    className="mt-1 w-full border rounded-lg px-3 py-2" 
                    value={form.raisonSociale || ''} 
                    onChange={(e) => setForm({ ...form, raisonSociale: e.target.value })} 
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Nom commercial</label>
                  <input 
                    className="mt-1 w-full border rounded-lg px-3 py-2" 
                    value={form.nomCommercial || ''} 
                    onChange={(e) => setForm({ ...form, nomCommercial: e.target.value })} 
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">NIF</label>
                  <input 
                    className="mt-1 w-full border rounded-lg px-3 py-2" 
                    value={form.nif || ''} 
                    onChange={(e) => setForm({ ...form, nif: e.target.value })} 
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">RCCM</label>
                  <input 
                    className="mt-1 w-full border rounded-lg px-3 py-2" 
                    value={form.rccm || ''} 
                    onChange={(e) => setForm({ ...form, rccm: e.target.value })} 
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm text-gray-600">Adresse</label>
                  <input 
                    className="mt-1 w-full border rounded-lg px-3 py-2" 
                    value={form.adresse || ''} 
                    onChange={(e) => setForm({ ...form, adresse: e.target.value })} 
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Ville</label>
                  <input 
                    className="mt-1 w-full border rounded-lg px-3 py-2" 
                    value={form.ville || ''} 
                    onChange={(e) => setForm({ ...form, ville: e.target.value })} 
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Téléphone</label>
                  <input 
                    className="mt-1 w-full border rounded-lg px-3 py-2" 
                    value={form.telephone || ''} 
                    onChange={(e) => setForm({ ...form, telephone: e.target.value })} 
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Email</label>
                  <input 
                    type="email"
                    className="mt-1 w-full border rounded-lg px-3 py-2" 
                    value={form.email || ''} 
                    onChange={(e) => setForm({ ...form, email: e.target.value })} 
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Contact principal</label>
                  <input 
                    className="mt-1 w-full border rounded-lg px-3 py-2" 
                    value={form.contactPrincipal || ''} 
                    onChange={(e) => setForm({ ...form, contactPrincipal: e.target.value })} 
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Secteur d'activité</label>
                  <input 
                    className="mt-1 w-full border rounded-lg px-3 py-2" 
                    value={form.secteurActivite || ''} 
                    onChange={(e) => setForm({ ...form, secteurActivite: e.target.value })} 
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Régime fiscal</label>
                  <select 
                    className="mt-1 w-full border rounded-lg px-3 py-2" 
                    value={form.regimeFiscal || 'Réel Normal'} 
                    onChange={(e) => setForm({ ...form, regimeFiscal: e.target.value as any })} 
                  >
                    <option value="Réel Normal">Réel Normal</option>
                    <option value="Réel Simplifié">Réel Simplifié</option>
                    <option value="Forfait">Forfait</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Délai de paiement (jours)</label>
                  <input 
                    type="number"
                    className="mt-1 w-full border rounded-lg px-3 py-2" 
                    value={form.delaiPaiement || 30} 
                    onChange={(e) => setForm({ ...form, delaiPaiement: Number(e.target.value) })} 
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Remise (%)</label>
                  <input 
                    type="number"
                    className="mt-1 w-full border rounded-lg px-3 py-2" 
                    value={form.remise || 0} 
                    onChange={(e) => setForm({ ...form, remise: Number(e.target.value) })} 
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Limite de crédit (FCFA)</label>
                  <input 
                    type="number"
                    className="mt-1 w-full border rounded-lg px-3 py-2" 
                    value={form.limiteCredit || 0} 
                    onChange={(e) => setForm({ ...form, limiteCredit: Number(e.target.value) })} 
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Statut</label>
                  <select 
                    className="mt-1 w-full border rounded-lg px-3 py-2" 
                    value={form.statut || 'actif'} 
                    onChange={(e) => setForm({ ...form, statut: e.target.value as any })} 
                  >
                    <option value="actif">Actif</option>
                    <option value="inactif">Inactif</option>
                    <option value="suspendu">Suspendu</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 flex justify-end gap-2">
              <button className="px-4 py-2 rounded-lg border" onClick={() => setShowAddModal(false)}>Annuler</button>
              <button className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700" onClick={() => {
                if (!form.raisonSociale) {
                  alert('Veuillez remplir la raison sociale');
                  return;
                }
                try {
                  if (editingId) {
                    updateClient(editingId, form as Partial<Client>);
                    alert('Client modifié avec succès');
                  } else {
                    addClient(form as Omit<Client, 'id' | 'dateCreation' | 'totalFacture' | 'totalEncaissement' | 'soldeImpaye' | 'nombreFactures'>);
                    alert('Client enregistré avec succès');
                  }
                  setShowAddModal(false);
                  setForm({});
                  setEditingId(null);
                } catch (error) {
                  alert('Erreur lors de l\'enregistrement du client');
                }
              }}>Enregistrer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientsModule;
