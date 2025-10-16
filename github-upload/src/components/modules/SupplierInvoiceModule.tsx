import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Download, 
  Eye, 
  Edit, 
  Trash2,
  Calculator,
  FileText,
  DollarSign,
  Percent
} from 'lucide-react';
import { useData } from '../../contexts/DataContext';

interface SupplierInvoice {
  id: string;
  numero: string;
  fournisseur: string;
  date: string;
  montantHT: number;
  tva: number;
  montantTTC: number;
  statut: 'unpaid' | 'partial' | 'paid';
  produits: Array<{
    nom: string;
    quantite: number;
    prixUnitaire: number;
    montant: number;
  }>;
}

const SupplierInvoiceModule: React.FC = () => {
  const { suppliersList, addSupplierInvoice, supplierInvoices } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [form, setForm] = useState({
    numero: '',
    fournisseur: '',
    date: new Date().toISOString().slice(0,10),
    montantHT: 0,
    tva: 18,
    statut: 'unpaid' as const,
    produits: [{ nom: '', quantite: 1, prixUnitaire: 0, montant: 0 }]
  });

  const filteredInvoices = supplierInvoices.filter(invoice =>
    invoice.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.nif.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculer le montant TTC automatiquement
  const montantTTC = useMemo(() => {
    const tvaAmount = (form.montantHT * form.tva) / 100;
    return form.montantHT + tvaAmount;
  }, [form.montantHT, form.tva]);

  // Calculer le montant HT à partir des produits
  const montantHTFromProducts = useMemo(() => {
    return form.produits.reduce((total, produit) => {
      const montant = produit.quantite * produit.prixUnitaire;
      return total + montant;
    }, 0);
  }, [form.produits]);

  // Mettre à jour le montant HT quand les produits changent
  React.useEffect(() => {
    setForm(prev => ({ ...prev, montantHT: montantHTFromProducts }));
  }, [montantHTFromProducts]);

  const handleProductChange = (index: number, field: string, value: string | number) => {
    const newProduits = [...form.produits];
    newProduits[index] = { ...newProduits[index], [field]: value };
    
    // Recalculer le montant pour ce produit
    if (field === 'quantite' || field === 'prixUnitaire') {
      const quantite = field === 'quantite' ? value as number : newProduits[index].quantite;
      const prixUnitaire = field === 'prixUnitaire' ? value as number : newProduits[index].prixUnitaire;
      newProduits[index].montant = quantite * prixUnitaire;
    }
    
    setForm({ ...form, produits: newProduits });
  };

  const addProduct = () => {
    setForm({
      ...form,
      produits: [...form.produits, { nom: '', quantite: 1, prixUnitaire: 0, montant: 0 }]
    });
  };

  const removeProduct = (index: number) => {
    if (form.produits.length > 1) {
      setForm({
        ...form,
        produits: form.produits.filter((_, i) => i !== index)
      });
    }
  };

  const handleSubmit = () => {
    if (!form.numero || !form.fournisseur) {
      alert('Veuillez remplir le numéro de facture et sélectionner un fournisseur');
      return;
    }

    const invoiceData = {
      supplierName: form.fournisseur,
      nif: suppliersList.find(s => s.raisonSociale === form.fournisseur)?.nif || '',
      date: form.date,
      ht: form.montantHT,
      tva: (form.montantHT * form.tva) / 100,
      ttc: montantTTC,
      status: form.statut,
      numero: form.numero,
      produits: form.produits
    };

    addSupplierInvoice(invoiceData);
    setShowAddModal(false);
    setForm({
      numero: '',
      fournisseur: '',
      date: new Date().toISOString().slice(0,10),
      montantHT: 0,
      tva: 18,
      statut: 'unpaid',
      produits: [{ nom: '', quantite: 1, prixUnitaire: 0, montant: 0 }]
    });
    alert('Facture fournisseur enregistrée avec succès');
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="bg-gradient-to-r from-sky-500 to-green-500 text-white p-6 rounded-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Factures Fournisseurs</h1>
            <p className="text-sky-100">Gestion des factures fournisseurs avec calculs automatiques</p>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-white text-sky-600 px-4 py-2 rounded-lg font-medium hover:bg-sky-50 transition-colors duration-200 flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle facture
          </button>
        </div>
      </div>

      {/* Recherche */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Rechercher par fournisseur ou NIF..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Liste des factures */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Numéro</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fournisseur</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant HT</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TVA</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant TTC</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInvoices.map((invoice, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {invoice.numero || `FAC-${index + 1}`}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {invoice.supplierName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(invoice.date).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {invoice.ht.toLocaleString('fr-FR')} FCFA
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {invoice.tva.toLocaleString('fr-FR')} FCFA
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {invoice.ttc.toLocaleString('fr-FR')} FCFA
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                      invoice.status === 'partial' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {invoice.status === 'paid' ? 'Payée' :
                       invoice.status === 'partial' ? 'Partielle' : 'Impayée'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-sky-600 hover:text-sky-900">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="text-indigo-600 hover:text-indigo-900">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal d'ajout/modification */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-4xl rounded-xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 bg-gradient-to-r from-sky-400 to-green-400 text-white">
              <h3 className="text-lg font-semibold">Nouvelle Facture Fournisseur</h3>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Informations de base */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm text-gray-600">Numéro de facture *</label>
                  <input 
                    className="mt-1 w-full border rounded-lg px-3 py-2" 
                    value={form.numero} 
                    onChange={(e) => setForm({ ...form, numero: e.target.value })} 
                    placeholder="Ex: FAC-2025-001"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Fournisseur *</label>
                  <select 
                    className="mt-1 w-full border rounded-lg px-3 py-2" 
                    value={form.fournisseur} 
                    onChange={(e) => setForm({ ...form, fournisseur: e.target.value })}
                  >
                    <option value="">Sélectionner un fournisseur</option>
                    {suppliersList.map((supplier, index) => (
                      <option key={index} value={supplier.raisonSociale}>
                        {supplier.raisonSociale}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Date</label>
                  <input 
                    type="date"
                    className="mt-1 w-full border rounded-lg px-3 py-2" 
                    value={form.date} 
                    onChange={(e) => setForm({ ...form, date: e.target.value })} 
                  />
                </div>
              </div>

              {/* Produits */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-lg font-semibold">Produits</h4>
                  <button 
                    onClick={addProduct}
                    className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    <Plus className="h-4 w-4" />
                    Ajouter un produit
                  </button>
                </div>
                
                <div className="space-y-4">
                  {form.produits.map((produit, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border rounded-lg">
                      <div>
                        <label className="text-sm text-gray-600">Nom du produit</label>
                        <input 
                          className="mt-1 w-full border rounded-lg px-3 py-2" 
                          value={produit.nom} 
                          onChange={(e) => handleProductChange(index, 'nom', e.target.value)} 
                          placeholder="Nom du produit"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-600">Quantité</label>
                        <input 
                          type="number"
                          min="0"
                          className="mt-1 w-full border rounded-lg px-3 py-2" 
                          value={produit.quantite} 
                          onChange={(e) => handleProductChange(index, 'quantite', Number(e.target.value))} 
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-600">Prix unitaire</label>
                        <input 
                          type="number"
                          min="0"
                          className="mt-1 w-full border rounded-lg px-3 py-2" 
                          value={produit.prixUnitaire} 
                          onChange={(e) => handleProductChange(index, 'prixUnitaire', Number(e.target.value))} 
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-600">Montant</label>
                        <input 
                          type="number"
                          className="mt-1 w-full border rounded-lg px-3 py-2 bg-gray-50" 
                          value={produit.montant} 
                          readOnly
                        />
                      </div>
                      <div className="flex items-end">
                        <button 
                          onClick={() => removeProduct(index)}
                          disabled={form.produits.length === 1}
                          className="w-full px-3 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Trash2 className="h-4 w-4 mx-auto" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Calculs automatiques */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <label className="text-sm text-gray-600">Montant HT</label>
                  <input 
                    type="number"
                    className="mt-1 w-full border rounded-lg px-3 py-2 bg-white" 
                    value={form.montantHT} 
                    readOnly
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">TVA %</label>
                  <input 
                    type="number"
                    min="0"
                    max="100"
                    className="mt-1 w-full border rounded-lg px-3 py-2" 
                    value={form.tva} 
                    onChange={(e) => setForm({ ...form, tva: Number(e.target.value) })} 
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Montant TTC</label>
                  <input 
                    type="number"
                    className="mt-1 w-full border rounded-lg px-3 py-2 bg-white font-semibold" 
                    value={montantTTC} 
                    readOnly
                  />
                </div>
              </div>

              {/* Statut */}
              <div>
                <label className="text-sm text-gray-600">Statut</label>
                <select 
                  className="mt-1 w-full border rounded-lg px-3 py-2" 
                  value={form.statut} 
                  onChange={(e) => setForm({ ...form, statut: e.target.value as any })}
                >
                  <option value="unpaid">Impayée</option>
                  <option value="partial">Partielle</option>
                  <option value="paid">Payée</option>
                </select>
              </div>
            </div>
            
            <div className="px-6 py-4 bg-gray-50 flex justify-end gap-2">
              <button 
                className="px-4 py-2 rounded-lg border" 
                onClick={() => setShowAddModal(false)}
              >
                Annuler
              </button>
              <button 
                className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700" 
                onClick={handleSubmit}
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupplierInvoiceModule;
