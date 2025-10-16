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

const SuppliersModuleSimple2: React.FC = () => {
  console.log('SuppliersModuleSimple2 - Component rendering');
  
  const [searchTerm, setSearchTerm] = useState('');
  
  // Données statiques pour éviter les problèmes de contexte
  const suppliersList = [
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
    }
  ];

  const filteredSuppliers = suppliersList.filter(supplier =>
    supplier.raisonSociale?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.nif?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <button className="bg-white text-sky-600 px-4 py-2 rounded-lg font-medium hover:bg-sky-50 transition-colors duration-200 flex items-center">
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
              <p className="text-2xl font-bold text-gray-900">0</p>
              <p className="text-gray-600">Réel Simplifié</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center">
            <Download className="w-8 h-8 text-orange-500" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">4%</p>
              <p className="text-gray-600">Remise moyenne</p>
            </div>
          </div>
        </div>
      </div>

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
                    <p className="text-sm text-gray-500">{supplier.nif}</p>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <button className="p-2 text-gray-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors duration-200">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200">
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
                  <span className="font-medium text-gray-900">{supplier.delaiPaiement}</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-gray-500">Remise:</span>
                  <span className="font-medium text-green-600">{supplier.remise}</span>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-xs text-gray-500 mb-2">Produits/Services:</p>
                <div className="flex flex-wrap gap-1">
                  {supplier.produits.map((produit, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                      {produit}
                    </span>
                  ))}
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
    </div>
  );
};

export default SuppliersModuleSimple2;
