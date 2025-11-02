import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
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
  BarChart3
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useData } from '../../contexts/DataContext';

const SuppliersModule: React.FC = () => {
  console.log('SuppliersModule - Component rendering');
  const { addSupplierInvoice, suppliersList: contextSuppliers, addSupplier, updateSupplier, deleteSupplier } = useData();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ 
    type: 'Societe' as 'Societe' | 'Particulier',
    raisonSociale: '', 
    nif: '', 
    rccm: '', 
    adresse: '', 
    telephone: '', 
    email: '', 
    regimeFiscal: 'Réel avec TVA' as any,
    classification: 'National' as 'National' | 'Particulier' | 'Etranger',
    groupeFour: '',
    produits: '' 
  });
  
  // Utiliser les données du contexte ou les données par défaut
  const defaultSuppliers = [
    {
      id: 'SUP-001',
      raisonSociale: 'Ste L WATT',
      nif: 'NIF-LW-001',
      rccm: 'RCCM-LW-001',
      adresse: 'Lomé',
      telephone: '+228 22 21 20 01',
      email: 'contact@lwatt.tg',
      regimeFiscal: 'Réel Normal',
      produits: ['Matériel électrique'],
      delaiPaiement: '30 jours',
      remise: '5%'
    },
    {
      id: 'SUP-002',
      raisonSociale: 'CCT-BATIMENT',
      nif: 'NIF-CCT-001',
      rccm: 'RCCM-CCT-001',
      adresse: 'Lomé',
      telephone: '+228 22 21 20 02',
      email: 'contact@cct-batiment.tg',
      regimeFiscal: 'Réel Normal',
      produits: ['Matériaux de construction'],
      delaiPaiement: '30 jours',
      remise: '3%'
    },
    {
      id: 'SUP-003',
      raisonSociale: 'LUMCHRIST-AMOFIA SARL',
      nif: 'NIF-LA-001',
      rccm: 'RCCM-LA-001',
      adresse: 'Lomé',
      telephone: '+228 22 21 20 03',
      email: 'contact@lumchrist.tg',
      regimeFiscal: 'Réel Normal',
      produits: ['Éclairage'],
      delaiPaiement: '30 jours',
      remise: '4%'
    },
    {
      id: 'SUP-004',
      raisonSociale: 'CHINA MALL',
      nif: 'NIF-CM-001',
      rccm: 'RCCM-CM-001',
      adresse: 'Lomé',
      telephone: '+228 22 21 20 04',
      email: 'contact@chinamall.tg',
      regimeFiscal: 'Réel Normal',
      produits: ['Divers'],
      delaiPaiement: '30 jours',
      remise: '2%'
    },
    {
      id: 'SUP-005',
      raisonSociale: 'Galerie Confortium',
      nif: 'NIF-GC-001',
      rccm: 'RCCM-GC-001',
      adresse: 'Lomé',
      telephone: '+228 22 21 20 05',
      email: 'contact@confortium.tg',
      regimeFiscal: 'Réel Normal',
      produits: ['Mobilier'],
      delaiPaiement: '30 jours',
      remise: '6%'
    },
    {
      id: 'SUP-006',
      raisonSociale: 'Ets AMERICAIN',
      nif: 'NIF-EA-001',
      rccm: 'RCCM-EA-001',
      adresse: 'Lomé',
      telephone: '+228 22 21 20 06',
      email: 'contact@americain.tg',
      regimeFiscal: 'Réel Normal',
      produits: ['Divers'],
      delaiPaiement: '30 jours',
      remise: '3%'
    },
    {
      id: 'SUP-007',
      raisonSociale: 'DONSEN-ALU',
      nif: 'NIF-DA-001',
      rccm: 'RCCM-DA-001',
      adresse: 'Lomé',
      telephone: '+228 22 21 20 07',
      email: 'contact@donsen-alu.tg',
      regimeFiscal: 'Réel Normal',
      produits: ['Aluminium'],
      delaiPaiement: '30 jours',
      remise: '4%'
    },
    {
      id: 'SUP-008',
      raisonSociale: 'SOCIETE SOTIMEX SARL',
      nif: 'NIF-SS-001',
      rccm: 'RCCM-SS-001',
      adresse: 'Lomé',
      telephone: '+228 22 21 20 08',
      email: 'contact@sotimex.tg',
      regimeFiscal: 'Réel Normal',
      produits: ['Import-Export'],
      delaiPaiement: '30 jours',
      remise: '5%'
    },
    {
      id: 'SUP-009',
      raisonSociale: 'CHAMPION',
      nif: 'NIF-CH-001',
      rccm: 'RCCM-CH-001',
      adresse: 'Lomé',
      telephone: '+228 22 21 20 09',
      email: 'contact@champion.tg',
      regimeFiscal: 'Réel Normal',
      produits: ['Divers'],
      delaiPaiement: '30 jours',
      remise: '3%'
    },
    {
      id: 'SUP-010',
      raisonSociale: 'Ste Papeterie Centrale',
      nif: 'NIF-SPC-001',
      rccm: 'RCCM-SPC-001',
      adresse: 'Lomé',
      telephone: '+228 22 21 20 10',
      email: 'contact@papeterie.tg',
      regimeFiscal: 'Réel Normal',
      produits: ['Papeterie'],
      delaiPaiement: '30 jours',
      remise: '2%'
    }
  ];

  const suppliersList = contextSuppliers && contextSuppliers.length > 0 ? contextSuppliers : defaultSuppliers;

  const filteredSuppliers = suppliersList.filter(supplier =>
    supplier.raisonSociale?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.nif?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.telephone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.adresse?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.groupeFour?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (supplier.type && supplier.type.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (supplier.classification && supplier.classification.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Normalise la propriété produits pour éviter les erreurs (string -> array)
  const normalizeProduits = (produits: unknown): string[] => {
    if (Array.isArray(produits)) return produits as string[];
    if (produits == null) return [];
    const text = String(produits);
    if (!text.trim()) return [];
    return text.split(',').map(p => p.trim()).filter(Boolean);
  };

  const handleAddSupplier = (newSupplier: any) => {
    try {
      if (!newSupplier.raisonSociale || !newSupplier.nif) {
        alert('Raison sociale et NIF sont requis');
        return;
      }
      const supplier = addSupplier({
        type: newSupplier.type || 'Societe',
        classification: newSupplier.classification || 'National',
        regimeFiscal: newSupplier.regimeFiscal || 'Réel avec TVA',
        groupeFour: newSupplier.groupeFour || '',
        ...newSupplier,
        produits: newSupplier.produits || [],
        articles: []
      });
      alert('✅ Fournisseur ajouté avec succès !');
      console.log('Added supplier:', supplier);
    } catch (error: any) {
      console.error('Erreur lors de l\'ajout du fournisseur:', error);
      alert(`❌ Erreur lors de l'ajout: ${error?.message || error}`);
    }
  };

  const handleUpdateSupplier = (id: string, updates: any) => {
    try {
      if (!updates.raisonSociale || !updates.nif) {
        alert('Raison sociale et NIF sont requis');
        return;
      }
      updateSupplier(id, {
        type: updates.type || 'Societe',
        classification: updates.classification || 'National',
        regimeFiscal: updates.regimeFiscal || 'Réel avec TVA',
        groupeFour: updates.groupeFour || '',
        ...updates,
        produits: updates.produits || []
      });
      alert('✅ Fournisseur modifié avec succès !');
    } catch (error: any) {
      console.error('Erreur lors de la modification du fournisseur:', error);
      alert(`❌ Erreur lors de la modification: ${error?.message || error}`);
    }
  };

  const handleDeleteSupplier = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce fournisseur ?')) {
      try {
        deleteSupplier(id);
        alert('Fournisseur supprimé avec succès !');
      } catch (error) {
        alert('Erreur lors de la suppression du fournisseur');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="bg-gradient-to-r from-sky-400 to-green-400 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Module Fournisseurs</h1>
            <p className="text-sky-100">Gestion des fournisseurs et de leurs produits</p>
          </div>
          <div className="flex gap-2">
          <button 
            onClick={() => { 
              setEditingId(null); 
              setForm({ 
                type: 'Societe',
                classification: 'National',
                raisonSociale: '', 
                nif: '', 
                rccm: '', 
                adresse: '', 
                telephone: '', 
                email: '', 
                regimeFiscal: 'Réel avec TVA', 
                groupeFour: '',
                produits: '' 
              }); 
              setShowAddModal(true); 
            }}
            className="bg-white text-sky-600 px-4 py-2 rounded-lg font-medium hover:bg-sky-50 transition-colors duration-200 flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouveau fournisseur
          </button>
          </div>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-sky-500" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{suppliersList.length}</p>
              <p className="text-gray-600">Fournisseurs</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center">
            <Building className="w-8 h-8 text-green-500" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{suppliersList.filter(s => s.regimeFiscal === 'Réel Normal').length}</p>
              <p className="text-gray-600">Réel Normal</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center">
            <FileText className="w-8 h-8 text-purple-500" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{suppliersList.filter(s => s.regimeFiscal === 'Réel Simplifié').length}</p>
              <p className="text-gray-600">Réel Simplifié</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center">
            <Download className="w-8 h-8 text-orange-500" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">
                {suppliersList.length > 0 
                  ? (suppliersList.reduce((sum, s) => sum + parseFloat(s.remise || '0'), 0) / suppliersList.length).toFixed(1) + '%'
                  : '0%'
                }
              </p>
              <p className="text-gray-600">Remise moyenne</p>
            </div>
          </div>
        </div>
      </div>

      {/* Nouvelle facture fournisseur */}
      <SupplierInvoiceForm suppliersList={suppliersList} addSupplierInvoice={addSupplierInvoice} />

      {/* Barre de recherche et actions */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="flex flex-col sm:flex-row gap-4">
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
            <Link 
              to="/reports" 
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Voir Rapports
            </Link>
            <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200">
              <Filter className="w-4 h-4 mr-2" />
              Filtres
            </button>
            <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200">
              <Download className="w-4 h-4 mr-2" />
              Exporter
            </button>
          </div>
        </div>
      </div>

      {/* Liste des fournisseurs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredSuppliers.map((supplier) => (
          <div key={supplier.id} className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-sky-400 to-green-400 rounded-lg flex items-center justify-center">
                    <Building className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-semibold text-gray-900">{supplier.raisonSociale}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      {supplier.type && (
                        <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full">{supplier.type}</span>
                      )}
                      {supplier.classification && (
                        <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-800 rounded-full">{supplier.classification}</span>
                      )}
                      <p className="text-sm text-gray-500">{supplier.nif}</p>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <button className="p-2 text-gray-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors durée-200" onClick={() => {
                    setEditingId(supplier.id);
                    setForm({ 
                      type: supplier.type || 'Societe',
                      classification: supplier.classification || 'National',
                      raisonSociale: supplier.raisonSociale, 
                      nif: supplier.nif, 
                      rccm: supplier.rccm || '', 
                      adresse: supplier.adresse || '', 
                      telephone: supplier.telephone || '', 
                      email: supplier.email || '', 
                      regimeFiscal: supplier.regimeFiscal || 'Réel avec TVA', 
                      groupeFour: supplier.groupeFour || '',
                      produits: normalizeProduits(supplier.produits).join(', ') 
                    });
                    setShowAddModal(true);
                  }}>
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors durée-200" onClick={() => {
                    setEditingId(supplier.id);
                    setForm({ 
                      type: supplier.type || 'Societe',
                      classification: supplier.classification || 'National',
                      raisonSociale: supplier.raisonSociale, 
                      nif: supplier.nif, 
                      rccm: supplier.rccm || '', 
                      adresse: supplier.adresse || '', 
                      telephone: supplier.telephone || '', 
                      email: supplier.email || '', 
                      regimeFiscal: supplier.regimeFiscal || 'Réel avec TVA', 
                      groupeFour: supplier.groupeFour || '',
                      produits: normalizeProduits(supplier.produits).join(', ') 
                    });
                    setShowAddModal(true);
                  }}>
                    <Edit className="w-4 h-4" />
                  </button>
                         <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200" onClick={() => handleDeleteSupplier(supplier.id)}>
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                  <span className="truncate">{supplier.adresse}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="w-4 h-4 mr-2 text-gray-400" />
                  <span>{supplier.telephone}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="w-4 h-4 mr-2 text-gray-400" />
                  <span className="truncate">{supplier.email}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Régime fiscal:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    supplier.regimeFiscal === 'Réel Normal' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {supplier.regimeFiscal}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-gray-500">Délai paiement:</span>
                  <span className="font-medium text-gray-900">{supplier.delaiPaiement || '30 jours'}</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-gray-500">Remise:</span>
                  <span className="font-medium text-green-600">{supplier.remise || '0%'}</span>
                </div>
              </div>

              {supplier.groupeFour && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Groupe:</span>
                    <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full font-medium">
                      {supplier.groupeFour}
                    </span>
                  </div>
                </div>
              )}
              <div className="mt-4">
                <p className="text-xs text-gray-500 mb-2">Produits/Services:</p>
                <div className="flex flex-wrap gap-1">
                  {normalizeProduits(supplier.produits).slice(0, 2).map((produit, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                      {produit}
                    </span>
                  ))}
                  {normalizeProduits(supplier.produits).length > 2 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                      +{normalizeProduits(supplier.produits).length - 2}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredSuppliers.length === 0 && (
        <div className="bg-white rounded-lg shadow-lg p-12 text-center">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun fournisseur trouvé</h3>
          <p className="text-gray-500">Aucun fournisseur ne correspond à vos critères de recherche.</p>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden">
            <div className="px-6 py-4 bg-gradient-to-r from-sky-400 to-green-400 text-white">
              <h3 className="text-lg font-semibold">{editingId ? 'Modifier fournisseur' : 'Nouveau fournisseur'}</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600">Type</label>
                  <select className="mt-1 w-full border rounded-lg px-3 py-2" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as any })}>
                    <option value="Societe">Société</option>
                    <option value="Particulier">Particulier</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Classification</label>
                  <select className="mt-1 w-full border rounded-lg px-3 py-2" value={form.classification} onChange={(e) => setForm({ ...form, classification: e.target.value as any })}>
                    <option value="National">National</option>
                    <option value="Particulier">Particulier</option>
                    <option value="Etranger">Etranger</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Raison sociale *</label>
                  <input className="mt-1 w-full border rounded-lg px-3 py-2" value={form.raisonSociale} onChange={(e) => setForm({ ...form, raisonSociale: e.target.value })} />
                </div>
                <div>
                  <label className="text-sm text-gray-600">NIF *</label>
                  <input className="mt-1 w-full border rounded-lg px-3 py-2" value={form.nif} onChange={(e) => setForm({ ...form, nif: e.target.value })} />
                </div>
                <div>
                  <label className="text-sm text-gray-600">RCCM</label>
                  <input className="mt-1 w-full border rounded-lg px-3 py-2" value={form.rccm} onChange={(e) => setForm({ ...form, rccm: e.target.value })} />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Régime fiscal</label>
                  <select className="mt-1 w-full border rounded-lg px-3 py-2" value={form.regimeFiscal} onChange={(e) => setForm({ ...form, regimeFiscal: e.target.value as any })}>
                    <option value="Réel avec TVA">Réel avec TVA</option>
                    <option value="Exonéré de la TVA">Exonéré de la TVA</option>
                    <option value="Sans TVA">Sans TVA</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm text-gray-600">Adresse complète (Quartier, ville, etc.)</label>
                  <textarea className="mt-1 w-full border rounded-lg px-3 py-2" rows={2} value={form.adresse} onChange={(e) => setForm({ ...form, adresse: e.target.value })} />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Téléphone</label>
                  <input className="mt-1 w-full border rounded-lg px-3 py-2" value={form.telephone} onChange={(e) => setForm({ ...form, telephone: e.target.value })} />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Email</label>
                  <input type="email" className="mt-1 w-full border rounded-lg px-3 py-2" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Groupe fournisseur</label>
                  <input className="mt-1 w-full border rounded-lg px-3 py-2" value={form.groupeFour} onChange={(e) => setForm({ ...form, groupeFour: e.target.value })} placeholder="Ex: Matériaux de construction & Quincaillerie" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm text-gray-600">Produits/Services (séparés par des virgules)</label>
                  <input className="mt-1 w-full border rounded-lg px-3 py-2" value={form.produits} onChange={(e) => setForm({ ...form, produits: e.target.value })} />
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 flex justify-end gap-2">
              <button className="px-4 py-2 rounded-lg border" onClick={() => setShowAddModal(false)}>Annuler</button>
              <button className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700" onClick={() => {
                       if (!form.raisonSociale || !form.nif) { 
                         alert('Raison sociale et NIF sont requis'); 
                         return; 
                       }
                const produits = form.produits.split(',').map(p => p.trim()).filter(Boolean);
                if (editingId) {
                         handleUpdateSupplier(editingId, { ...form, produits });
                } else {
                         handleAddSupplier({ ...form, produits });
                }
                setShowAddModal(false);
                setForm({ 
                  type: 'Societe',
                  classification: 'National',
                  raisonSociale: '', 
                  nif: '', 
                  rccm: '', 
                  adresse: '', 
                  telephone: '', 
                  email: '', 
                  regimeFiscal: 'Réel avec TVA', 
                  groupeFour: '',
                  produits: '' 
                });
              }}>Enregistrer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Composant pour créer une nouvelle facture fournisseur
const SupplierInvoiceForm: React.FC<{ suppliersList: any[], addSupplierInvoice: (inv: any) => any }> = ({ suppliersList, addSupplierInvoice }) => {
  const [supplierId, setSupplierId] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().slice(0, 10));
  const [ht, setHt] = useState(0);
  const [tva, setTva] = useState(18);
  const [status, setStatus] = useState<'paid'|'partial'|'unpaid'>('unpaid');
  const [items, setItems] = useState<Array<{description: string, quantity: number, unitPrice: number}>>([]);
  const [newItem, setNewItem] = useState({ description: '', quantity: 1, unitPrice: 0 });

  const selectedSupplier = suppliersList.find(s => s.id === supplierId);
  const totalHT = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  const totalTVA = (totalHT * tva) / 100;
  const totalTTC = totalHT + totalTVA;

  const addItem = () => {
    if (newItem.description && newItem.quantity > 0 && newItem.unitPrice > 0) {
      setItems([...items, { ...newItem }]);
      setNewItem({ description: '', quantity: 1, unitPrice: 0 });
    }
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const saveInvoice = () => {
    if (!selectedSupplier || !invoiceNumber || items.length === 0) {
      alert('Veuillez sélectionner un fournisseur, entrer un numéro de facture et ajouter au moins un article.');
      return;
    }

    const invoice = {
      invoiceNumber,
      supplierName: selectedSupplier.raisonSociale,
      nif: selectedSupplier.nif,
      date: invoiceDate,
      ht: totalHT,
      tva: totalTVA,
      ttc: totalTTC,
      status
    };

    // Utiliser le DataContext pour sauvegarder
    try {
      console.log('Tentative de sauvegarde de la facture:', invoice);
      const savedInvoice = addSupplierInvoice(invoice);
      console.log('Facture sauvegardée avec succès:', savedInvoice);
      
      alert('Facture fournisseur enregistrée avec succès !');
      
      // Reset form
      setSupplierId('');
      setInvoiceNumber('');
      setInvoiceDate(new Date().toISOString().slice(0, 10));
      setHt(0);
      setTva(18);
      setStatus('unpaid');
      setItems([]);
      
      // Les données seront automatiquement mises à jour dans les rapports via le DataContext
    } catch (error) {
      console.error('Erreur détaillée lors de la sauvegarde:', error);
      console.error('Type d\'erreur:', typeof error);
      console.error('Message d\'erreur:', error.message);
      console.error('Stack trace:', error.stack);
      alert(`Erreur lors de la sauvegarde de la facture: ${error.message || error}`);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Nouvelle Facture Fournisseur</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Fournisseur</label>
          <select 
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-400 focus:border-transparent"
            value={supplierId}
            onChange={(e) => setSupplierId(e.target.value)}
          >
            <option value="">Sélectionner un fournisseur</option>
            {suppliersList.map(supplier => (
              <option key={supplier.id} value={supplier.id}>{supplier.raisonSociale}</option>
          ))}
        </select>
      </div>
        
      <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Numéro de Facture</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-400 focus:border-transparent"
            value={invoiceNumber}
            onChange={(e) => setInvoiceNumber(e.target.value)}
            placeholder="Ex: FAC-2025-001"
          />
      </div>
        
      <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
          <input
            type="date"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-400 focus:border-transparent"
            value={invoiceDate}
            onChange={(e) => setInvoiceDate(e.target.value)}
          />
      </div>
        
      <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
          <select
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-400 focus:border-transparent"
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
          >
          <option value="unpaid">Impayée</option>
          <option value="partial">Partielle</option>
          <option value="paid">Payée</option>
        </select>
      </div>
      </div>

      {/* Articles */}
      <div className="mb-6">
        <h4 className="text-md font-semibold text-gray-800 mb-4">Articles</h4>
        
        {/* Ajouter un article */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-400 focus:border-transparent"
              value={newItem.description}
              onChange={(e) => setNewItem({...newItem, description: e.target.value})}
              placeholder="Description de l'article"
              list="supplier-article-suggestions"
            />
            <datalist id="supplier-article-suggestions">
              <option value="Toner" />
              <option value="Câble" />
              <option value="Meuble" />
              <option value="Mobilier de bureau" />
              <option value="Ordinateur" />
              <option value="PC" />
              <option value="Moto" />
              <option value="Voiture" />
              <option value="Imprimante" />
              <option value="Papeterie" />
            </datalist>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quantité</label>
            <input
              type="number"
              min="1"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-400 focus:border-transparent"
              value={newItem.quantity}
              onChange={(e) => setNewItem({...newItem, quantity: Number(e.target.value)})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Prix Unitaire (FCFA)</label>
            <input
              type="number"
              min="0"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-400 focus:border-transparent"
              value={newItem.unitPrice}
              onChange={(e) => setNewItem({...newItem, unitPrice: Number(e.target.value)})}
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={addItem}
              className="w-full bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700 transition-colors duration-200 flex items-center justify-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Ajouter
            </button>
          </div>
        </div>

        {/* Liste des articles */}
        {items.length > 0 && (
          <div className="space-y-2">
            {items.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                <div className="flex-1">
                  <span className="font-medium">{item.description}</span>
                  <span className="text-gray-500 ml-4">Qty: {item.quantity}</span>
                  <span className="text-gray-500 ml-4">Prix: {item.unitPrice.toLocaleString()} FCFA</span>
                  <span className="text-gray-500 ml-4">Total: {(item.quantity * item.unitPrice).toLocaleString()} FCFA</span>
                </div>
                <button
                  onClick={() => removeItem(index)}
                  className="text-red-600 hover:text-red-800 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Totaux */}
      <div className="border-t pt-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-sm text-gray-500">Total HT</div>
            <div className="text-lg font-semibold">{totalHT.toLocaleString()} FCFA</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-500">TVA ({tva}%)</div>
            <div className="text-lg font-semibold">{totalTVA.toLocaleString()} FCFA</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-500">Total TTC</div>
            <div className="text-xl font-bold text-sky-600">{totalTTC.toLocaleString()} FCFA</div>
          </div>
        </div>
      </div>

      {/* Boutons d'action */}
      <div className="flex justify-end gap-4">
        <button
          onClick={() => {
            setSupplierId('');
            setInvoiceNumber('');
            setInvoiceDate(new Date().toISOString().slice(0, 10));
            setHt(0);
            setTva(18);
            setStatus('unpaid');
            setItems([]);
          }}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
        >
          Annuler
        </button>
        <button
          onClick={saveInvoice}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Enregistrer la Facture
        </button>
      </div>
    </div>
  );
};

export default SuppliersModule;