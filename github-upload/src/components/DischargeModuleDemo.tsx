import React, { useState } from 'react';
import { 
  FileCheck, 
  User, 
  Calendar, 
  MapPin, 
  Phone, 
  CreditCard, 
  Eye, 
  Edit, 
  Trash2, 
  Download, 
  FileSignature as Signature,
  CheckCircle,
  Clock,
  AlertCircle,
  Plus,
  Search,
  Filter,
  Grid3X3,
  List,
  TrendingUp,
  Activity,
  DollarSign,
  FileText
} from 'lucide-react';

const DischargeModuleDemo: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');

  const demoDischarges = [
    {
      id: 'DCH-2024-001',
      prestataire: 'Jean Dupont',
      service: 'Maintenance informatique et réparation d\'équipements',
      montant: 150000,
      datePrestation: '2024-01-15',
      lieu: 'Lomé, Togo',
      telephone: '+228 90 12 34 56',
      cni: '1234567890',
      statut: 'signed',
      dateCreation: '2024-01-15'
    },
    {
      id: 'DCH-2024-002',
      prestataire: 'Marie Martin',
      service: 'Formation en informatique pour le personnel',
      montant: 250000,
      datePrestation: '2024-01-20',
      lieu: 'Lomé, Togo',
      telephone: '+228 90 23 45 67',
      cni: '0987654321',
      statut: 'pending',
      dateCreation: '2024-01-20'
    },
    {
      id: 'DCH-2024-003',
      prestataire: 'Pierre Durand',
      service: 'Installation de réseau et configuration serveur',
      montant: 300000,
      datePrestation: '2024-01-25',
      lieu: 'Lomé, Togo',
      telephone: '+228 90 34 56 78',
      cni: '1122334455',
      statut: 'completed',
      dateCreation: '2024-01-25'
    },
    {
      id: 'DCH-2024-004',
      prestataire: 'Sophie Laurent',
      service: 'Développement d\'application web personnalisée',
      montant: 500000,
      datePrestation: '2024-01-30',
      lieu: 'Lomé, Togo',
      telephone: '+228 90 45 67 89',
      cni: '5566778899',
      statut: 'overdue',
      dateCreation: '2024-01-30'
    }
  ];

  const stats = [
    {
      title: 'Décharges ce mois',
      value: 4,
      icon: FileCheck,
      color: 'from-blue-500 to-blue-600',
      trend: { value: 12, isPositive: true },
      description: 'Nouvelles décharges'
    },
    {
      title: 'Montant total',
      value: '1.2M FCFA',
      icon: DollarSign,
      color: 'from-green-500 to-green-600',
      trend: { value: 8, isPositive: true },
      description: 'Valeur totale'
    },
    {
      title: 'Signées',
      value: 1,
      icon: CheckCircle,
      color: 'from-emerald-500 to-emerald-600',
      trend: { value: 15, isPositive: true },
      description: 'Décharges signées'
    },
    {
      title: 'En attente',
      value: 3,
      icon: Clock,
      color: 'from-yellow-500 to-yellow-600',
      trend: { value: -5, isPositive: false },
      description: 'En attente de signature'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'signed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'completed':
        return <FileCheck className="w-4 h-4 text-blue-500" />;
      case 'overdue':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'signed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'signed':
        return 'Signée';
      case 'pending':
        return 'En attente';
      case 'completed':
        return 'Terminée';
      case 'overdue':
        return 'En retard';
      default:
        return 'En attente';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-6">
              <div className="w-14 h-14 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <FileCheck className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Module Décharges - Démonstration</h1>
                <p className="text-sm text-gray-600">Interface moderne et magnifique</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300 group">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                {stat.trend && (
                  <div className={`flex items-center text-sm ${stat.trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    <span className={`w-2 h-2 rounded-full mr-1 ${stat.trend.isPositive ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    {stat.trend.isPositive ? '+' : ''}{stat.trend.value}%
                  </div>
                )}
              </div>
              
              <div className="space-y-1">
                <p className="text-3xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                  {stat.value}
                </p>
                <p className="text-sm text-gray-600 font-medium">{stat.title}</p>
                {stat.description && (
                  <p className="text-xs text-gray-500">{stat.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Search and Actions */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Rechercher par prestataire, numéro ou service..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 px-4 py-4 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all duration-200 shadow-sm">
                <Filter className="w-4 h-4" />
                <span>Filtres</span>
              </button>
              
              <button className="flex items-center space-x-2 px-4 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg">
                <Download className="w-4 h-4" />
                <span>Exporter</span>
              </button>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-3 rounded-xl transition-all duration-200 ${
                    viewMode === 'grid'
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                      : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600 hover:from-gray-200 hover:to-gray-300'
                  }`}
                >
                  <Grid3X3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-3 rounded-xl transition-all duration-200 ${
                    viewMode === 'list'
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                      : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600 hover:from-gray-200 hover:to-gray-300'
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
              
              <button className="flex items-center space-x-2 px-6 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                <Plus className="w-5 h-5" />
                <span className="font-semibold">Nouvelle décharge</span>
              </button>
            </div>
          </div>
        </div>

        {/* Discharges Grid */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50">
          <div className={`p-6 ${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'}`}>
            {demoDischarges.map((discharge) => (
              <div key={discharge.id} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300 group">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                      <FileCheck className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                        {discharge.id}
                      </h3>
                      <p className="text-sm text-gray-500">Décharge</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(discharge.statut)}
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(discharge.statut)}`}>
                      {getStatusText(discharge.statut)}
                    </span>
                  </div>
                </div>

                {/* Prestataire Info */}
                <div className="mb-4">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-100 to-green-200 rounded-lg flex items-center justify-center">
                      <User className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{discharge.prestataire}</p>
                      <p className="text-sm text-gray-500">Prestataire</p>
                    </div>
                  </div>
                </div>

                {/* Service */}
                <div className="mb-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-gray-600 mb-1">Service</p>
                    <p className="font-medium text-gray-900 text-sm line-clamp-2">{discharge.service}</p>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                    <span>Prestation: {discharge.datePrestation}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="truncate">{discharge.lieu}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="w-4 h-4 mr-2 text-gray-400" />
                    <span>{discharge.telephone}</span>
                  </div>
                </div>

                {/* Montant */}
                <div className="mb-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <CreditCard className="w-4 h-4 text-green-600 mr-2" />
                      <span className="text-sm text-gray-600">Montant</span>
                    </div>
                    <span className="text-lg font-bold text-green-600">
                      {discharge.montant.toLocaleString()} FCFA
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-1">
                    <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-200">
                      <Signature className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200">
                      <Download className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Features Showcase */}
        <div className="mt-8 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl p-8 text-white">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Interface Moderne et Magnifique</h3>
            <p className="text-lg mb-6 opacity-90">
              Le module des décharges offre maintenant une expérience utilisateur exceptionnelle avec un design
              moderne, élégant et magnifique qui répond aux standards les plus élevés.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div className="flex items-center justify-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                Design moderne
              </div>
              <div className="flex items-center justify-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                Interface élégante
              </div>
              <div className="flex items-center justify-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                Magnifique
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DischargeModuleDemo;
