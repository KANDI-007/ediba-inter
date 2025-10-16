import React, { useState, useMemo, useRef } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  Trash2, 
  FileCheck, 
  User, 
  Calendar, 
  MapPin, 
  FileSignature as Signature, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  ArrowLeft, 
  Printer,
  TrendingUp,
  Activity,
  DollarSign,
  FileText,
  Settings,
  BarChart3,
  Users,
  Building2,
  CreditCard,
  Shield,
  Zap,
  Target,
  BookOpen,
  Archive,
  RefreshCw,
  ChevronDown,
  ChevronRight,
  MoreVertical,
  Copy,
  Share2,
  Star,
  Flag,
  Upload,
  List,
  Grid3X3
} from 'lucide-react';
import { Link } from 'react-router-dom';
import SignaturePad from '../SignaturePad';
import AdvancedPrintModal from '../AdvancedPrintModal';
import DischargeStatsCard from '../DischargeStatsCard';
import DischargeCard from '../DischargeCard';
import DischargeSearchBar from '../DischargeSearchBar';
import DischargeModal from '../DischargeModal';
import DischargeViewModal from '../DischargeViewModal';
import { useActivityLogger } from '../../contexts/ActivityContext';
import { useData } from '../../contexts/DataContext';
import '../../styles/decharge.css';

const DischargeModuleModern: React.FC = () => {
  const { logCreate, logUpdate, logView, logDelete, logExport } = useActivityLogger();
  const { suppliersList, documents, discharges, addDischarge, updateDischarge, deleteDischarge } = useData();
  
  // States
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedDischarge, setSelectedDischarge] = useState<any>(null);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [showSignaturePad, setShowSignaturePad] = useState(false);
  const [signFor, setSignFor] = useState<string | null>(null);
  const [signatureData, setSignatureData] = useState<Record<string, string>>({});
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'create' | 'manage' | 'reports'>('overview');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedDateRange, setSelectedDateRange] = useState<string>('all');
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['stats', 'recent']));
  
  const dischargeFormRef = useRef<HTMLDivElement>(null);
  
  // Form data for discharge form
  const [formData, setFormData] = useState({
    signataire: '',
    expediteur: 'EDIBA INTER',
    montant: '',
    objet: '',
    objetLigne2: '',
    jour: '',
    mois: '',
    annee: '',
    signature: ''
  });

  // Initialize current date
  React.useEffect(() => {
    const today = new Date();
    setFormData(prev => ({
      ...prev,
      jour: today.getDate().toString().padStart(2, '0'),
      mois: (today.getMonth() + 1).toString().padStart(2, '0'),
      annee: today.getFullYear().toString().slice(-2)
    }));
  }, []);

  // Filter discharges with enhanced filtering
  const filteredDischarges = useMemo(() => {
    let filtered = discharges;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(discharge =>
        discharge.prestataire.toLowerCase().includes(searchTerm.toLowerCase()) ||
        discharge.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        discharge.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
        discharge.lieu?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(discharge => discharge.statut === selectedStatus);
    }

    // Date range filter
    if (selectedDateRange !== 'all') {
      const now = new Date();
      filtered = filtered.filter(discharge => {
        const dischargeDate = new Date(discharge.dateCreation);
        switch (selectedDateRange) {
          case 'today':
            return dischargeDate.toDateString() === now.toDateString();
          case 'week':
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            return dischargeDate >= weekAgo;
          case 'month':
            return dischargeDate.getMonth() === now.getMonth() && dischargeDate.getFullYear() === now.getFullYear();
          case 'year':
            return dischargeDate.getFullYear() === now.getFullYear();
          default:
            return true;
        }
      });
    }

    return filtered;
  }, [discharges, searchTerm, selectedStatus, selectedDateRange]);

  // Handler functions
  const handleExportAll = () => {
    logExport('Décharges', 'Excel');
    // Implementation for export all
  };

  const handlePrintDischarge = () => {
    // Validation du champ objet
    if (!formData.objet || formData.objet.trim() === '') {
      alert('⚠️ Veuillez remplir l\'objet de la décharge avant d\'imprimer.');
      return;
    }
    
    if (dischargeFormRef.current) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        const printContent = dischargeFormRef.current.innerHTML;
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Fiche de Décharge - EDIBA INTER</title>
              <meta charset="utf-8">
              <style>
                @import url('${window.location.origin}/src/styles/decharge.css');
                @import url('${window.location.origin}/src/styles/print.css');
                body { margin: 0; padding: 0; }
                .decharge-form-container { 
                  width: 210mm; 
                  min-height: 297mm; 
                  margin: 0 auto; 
                  padding: 6mm;
                  box-sizing: border-box;
                }
                .decharge-form { 
                  padding: 0; 
                  margin: 0; 
                  width: 100%; 
                  height: 100%;
                  display: flex;
                  flex-direction: column;
                }
                .decharge-content { 
                  flex: 1; 
                  display: flex; 
                  flex-direction: column; 
                  justify-content: space-between; 
                }
                .decharge-footer { 
                  margin-top: auto; 
                  flex-shrink: 0; 
                }
                @media print {
                  .decharge-form-container { 
                    width: 100%; 
                    max-width: none; 
                    margin: 0; 
                    padding: 0; 
                  }
                  .decharge-form { 
                    padding: 6mm; 
                    box-sizing: border-box;
                  }
                }
              </style>
            </head>
            <body>
              ${printContent}
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
        }, 500);
      }
    }
  };

  // Quick actions data
  const quickActions = [
    {
      id: 'create',
      title: 'Nouvelle Décharge',
      description: 'Créer une nouvelle décharge',
      icon: Plus,
      color: 'from-blue-500 to-blue-600',
      action: () => setShowAddModal(true)
    },
    {
      id: 'template',
      title: 'Modèles',
      description: 'Utiliser un modèle existant',
      icon: FileText,
      color: 'from-purple-500 to-purple-600',
      action: () => setShowQuickActions(true)
    },
    {
      id: 'bulk',
      title: 'Import Multiple',
      description: 'Importer plusieurs décharges',
      icon: Upload,
      color: 'from-green-500 to-green-600',
      action: () => console.log('Bulk import')
    },
    {
      id: 'export',
      title: 'Exporter',
      description: 'Exporter les données',
      icon: Download,
      color: 'from-orange-500 to-orange-600',
      action: handleExportAll
    }
  ];

  // Recent activities
  const recentActivities = useMemo(() => {
    return discharges
      .sort((a, b) => new Date(b.dateCreation).getTime() - new Date(a.dateCreation).getTime())
      .slice(0, 5)
      .map(discharge => ({
        id: discharge.id,
        title: `Décharge ${discharge.id}`,
        description: `${discharge.prestataire} - ${discharge.montant.toLocaleString()} FCFA`,
        status: discharge.statut,
        date: discharge.dateCreation,
        amount: discharge.montant
      }));
  }, [discharges]);

  // Statistics
  const stats = useMemo(() => {
    const totalAmount = discharges.reduce((sum, d) => sum + d.montant, 0);
    const signedCount = discharges.filter(d => d.statut === 'signed').length;
    const pendingCount = discharges.filter(d => d.statut === 'pending').length;
    const thisMonthCount = discharges.filter(d => {
      const dischargeDate = new Date(d.dateCreation);
      const now = new Date();
      return dischargeDate.getMonth() === now.getMonth() && dischargeDate.getFullYear() === now.getFullYear();
    }).length;

    return [
      {
        title: 'Décharges ce mois',
        value: thisMonthCount,
        icon: FileCheck,
        color: 'from-blue-500 to-blue-600',
        trend: { value: 12, isPositive: true },
        description: 'Nouvelles décharges'
      },
      {
        title: 'Montant total',
        value: `${(totalAmount / 1000).toFixed(0)}K FCFA`,
        icon: DollarSign,
        color: 'from-green-500 to-green-600',
        trend: { value: 8, isPositive: true },
        description: 'Valeur totale'
      },
      {
        title: 'Signées',
        value: signedCount,
        icon: CheckCircle,
        color: 'from-emerald-500 to-emerald-600',
        trend: { value: 15, isPositive: true },
        description: 'Décharges signées'
      },
      {
        title: 'En attente',
        value: pendingCount,
        icon: Clock,
        color: 'from-yellow-500 to-yellow-600',
        trend: { value: -5, isPositive: false },
        description: 'En attente de signature'
      }
    ];
  }, [discharges]);

  // Handlers
  const handleAddDischarge = (dischargeData: any) => {
    try {
      const discharge = addDischarge({
        ...dischargeData,
        statut: 'pending' as const
      });
      
      // Auto-fill form with discharge data
      const today = new Date();
      setFormData({
        signataire: dischargeData.prestataire,
        expediteur: 'EDIBA INTER',
        montant: dischargeData.montant.toLocaleString() + ' FCFA',
        objet: dischargeData.service,
        objetLigne2: `Prestation effectuée le ${dischargeData.datePrestation} à ${dischargeData.lieu}`,
        jour: today.getDate().toString().padStart(2, '0'),
        mois: (today.getMonth() + 1).toString().padStart(2, '0'),
        annee: today.getFullYear().toString().slice(-2),
        signature: ''
      });
      
      logCreate('Décharges', `Décharge ${discharge.id}`, discharge.id);
      setShowAddModal(false);
    } catch (error) {
      console.error('Erreur lors de la création de la décharge:', error);
    }
  };

  const handleEditDischarge = (dischargeData: any) => {
    if (!selectedDischarge) return;

    try {
      updateDischarge(selectedDischarge.id, {
        ...selectedDischarge,
        ...dischargeData
      });
      logUpdate('Décharges', `Décharge ${selectedDischarge.id}`, selectedDischarge.id);
      setShowEditModal(false);
      setSelectedDischarge(null);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la décharge:', error);
    }
  };

  const handleViewDischarge = (discharge: any) => {
    logView('Décharges', `Décharge ${discharge.id}`);
    setSelectedDischarge(discharge);
    setShowViewModal(true);
  };

  const handleEditClick = (discharge: any) => {
    setSelectedDischarge(discharge);
    setShowEditModal(true);
  };

  const handleDeleteDischarge = (dischargeId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette décharge ?')) {
      try {
        deleteDischarge(dischargeId);
        logDelete('Décharges', `Décharge ${dischargeId}`, dischargeId);
      } catch (error) {
        console.error('Erreur lors de la suppression de la décharge:', error);
      }
    }
  };

  const handleSignDischarge = (dischargeId: string) => {
    setSignFor(dischargeId);
    setShowSignaturePad(true);
  };

  const handleDownloadDischarge = async (discharge: any) => {
    try {
      const { jsPDF } = await import('jspdf');
      const html2canvas = (await import('html2canvas')).default;
      const container = document.createElement('div');
      container.style.width = '560px';
      container.style.padding = '16px';
      container.style.background = 'white';
      container.innerHTML = `
        <div style="font-family: Arial, sans-serif; font-size: 12px; color: #111;">
          <h3 style="text-align:center; margin:0 0 8px;">DECHARGE ${discharge.id}</h3>
          <div><strong>Prestataire:</strong> ${discharge.prestataire}</div>
          <div><strong>Service:</strong> ${discharge.service}</div>
          <div><strong>Montant:</strong> ${discharge.montant.toLocaleString()} FCFA</div>
          <div><strong>Date prestation:</strong> ${discharge.datePrestation}</div>
          <div><strong>Lieu:</strong> ${discharge.lieu}</div>
          <div style="margin-top:24px;">Signature prestataire: __________________________</div>
        </div>`;
      document.body.appendChild(container);
      const canvas = await html2canvas(container, { scale: 2, backgroundColor: '#ffffff' });
      document.body.removeChild(container);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p','pt','a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 56;
      const imgWidth = pageWidth - margin*2;
      const imgHeight = canvas.height * (imgWidth / canvas.width);
      pdf.addImage(imgData, 'PNG', margin, margin, imgWidth, imgHeight);
      pdf.save(`${discharge.id}.pdf`);
      logExport('Décharges', 'PDF');
    } catch (error) {
      console.error('Erreur lors de l\'export PDF:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Enhanced Header */}
      <div className="bg-white/90 backdrop-blur-md shadow-lg border-b border-gray-200/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-6">
              <Link 
                to="/dashboard" 
                className="p-3 rounded-xl bg-gradient-to-r from-blue-100 to-purple-100 hover:from-blue-200 hover:to-purple-200 transition-all duration-200 flex items-center group"
                title="Retour au tableau de bord"
              >
                <ArrowLeft className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" />
              </Link>
              
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl group hover:scale-105 transition-transform">
                <FileCheck className="w-9 h-9 text-white" />
              </div>
              
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Module Décharges</h1>
                <p className="text-sm text-gray-600 flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Gestion professionnelle des décharges pour prestataires
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowQuickActions(!showQuickActions)}
                className="p-3 text-gray-400 hover:text-gray-600 transition-colors duration-200 bg-gray-100 rounded-xl hover:bg-gray-200 group"
                title="Actions rapides"
              >
                <Zap className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </button>
              <button
                onClick={() => setShowPrintModal(true)}
                className="p-3 text-gray-400 hover:text-gray-600 transition-colors duration-200 bg-gray-100 rounded-xl hover:bg-gray-200 group"
                title="Impression avancée"
              >
                <Printer className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </button>
              <button
                onClick={() => window.location.reload()}
                className="p-3 text-gray-400 hover:text-gray-600 transition-colors duration-200 bg-gray-100 rounded-xl hover:bg-gray-200 group"
                title="Actualiser"
              >
                <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Actions Panel */}
        {showQuickActions && (
          <div className="mb-8 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Actions Rapides</h2>
              <button
                onClick={() => setShowQuickActions(false)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action) => (
                <button
                  key={action.id}
                  onClick={action.action}
                  className={`p-6 rounded-xl bg-gradient-to-r ${action.color} text-white hover:scale-105 transition-all duration-200 group`}
                >
                  <action.icon className="w-8 h-8 mb-3 group-hover:scale-110 transition-transform" />
                  <h3 className="font-semibold text-lg mb-1">{action.title}</h3>
                  <p className="text-sm opacity-90">{action.description}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="mb-8 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-2">
          <div className="flex space-x-1">
            {[
              { id: 'overview', label: 'Vue d\'ensemble', icon: BarChart3 },
              { id: 'create', label: 'Créer', icon: Plus },
              { id: 'manage', label: 'Gérer', icon: Settings },
              { id: 'reports', label: 'Rapports', icon: FileText }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Statistics - Only show in overview tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <DischargeStatsCard
                key={index}
                title={stat.title}
                value={stat.value}
                icon={stat.icon}
                color={stat.color}
                trend={stat.trend}
                description={stat.description}
              />
            ))}
          </div>
        )}

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <>
            {/* Recent Activities */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              <div className="lg:col-span-2 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Décharges Récentes</h2>
                  <button
                    onClick={() => setActiveTab('manage')}
                    className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
                  >
                    Voir tout
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className={`w-3 h-3 rounded-full ${
                          activity.status === 'signed' ? 'bg-green-500' : 
                          activity.status === 'pending' ? 'bg-yellow-500' : 'bg-gray-400'
                        }`} />
                        <div>
                          <h3 className="font-semibold text-gray-900">{activity.title}</h3>
                          <p className="text-sm text-gray-600">{activity.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{activity.amount.toLocaleString()} FCFA</p>
                        <p className="text-sm text-gray-500">{new Date(activity.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Filtres Rapides</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">Tous les statuts</option>
                      <option value="pending">En attente</option>
                      <option value="signed">Signées</option>
                      <option value="cancelled">Annulées</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Période</label>
                    <select
                      value={selectedDateRange}
                      onChange={(e) => setSelectedDateRange(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">Toutes les périodes</option>
                      <option value="today">Aujourd'hui</option>
                      <option value="week">Cette semaine</option>
                      <option value="month">Ce mois</option>
                      <option value="year">Cette année</option>
                    </select>
                  </div>
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedStatus('all');
                      setSelectedDateRange('all');
                    }}
                    className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Réinitialiser
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'create' && (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Plus className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Créer une Nouvelle Décharge</h2>
              <p className="text-gray-600">Choisissez comment vous souhaitez créer votre décharge</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <button
                onClick={() => setShowAddModal(true)}
                className="p-6 border-2 border-dashed border-gray-300 rounded-2xl hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 group"
              >
                <FileCheck className="w-12 h-12 text-gray-400 group-hover:text-blue-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Nouvelle Décharge</h3>
                <p className="text-gray-600">Créer une décharge à partir de zéro</p>
              </button>
              
              <button
                onClick={() => console.log('Template')}
                className="p-6 border-2 border-dashed border-gray-300 rounded-2xl hover:border-purple-500 hover:bg-purple-50 transition-all duration-200 group"
              >
                <FileText className="w-12 h-12 text-gray-400 group-hover:text-purple-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Modèle</h3>
                <p className="text-gray-600">Utiliser un modèle existant</p>
              </button>
              
              <button
                onClick={() => console.log('Import')}
                className="p-6 border-2 border-dashed border-gray-300 rounded-2xl hover:border-green-500 hover:bg-green-50 transition-all duration-200 group"
              >
                <Upload className="w-12 h-12 text-gray-400 group-hover:text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Importer</h3>
                <p className="text-gray-600">Importer depuis un fichier</p>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'manage' && (
          <>
            {/* Enhanced Search and Filters */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6 mb-8">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Rechercher par prestataire, ID, service..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                      showFilters 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Filter className="w-5 h-5 inline mr-2" />
                    Filtres
                  </button>
                  <button
                    onClick={handleExportAll}
                    className="px-4 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors font-medium"
                  >
                    <Download className="w-5 h-5 inline mr-2" />
                    Exporter
                  </button>
                  <button
                    onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                    className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    {viewMode === 'grid' ? <List className="w-5 h-5" /> : <Grid3X3 className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Discharges List */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50">
              {filteredDischarges.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <FileCheck className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune décharge trouvée</h3>
                  <p className="text-gray-500 mb-6">Aucune décharge ne correspond à vos critères de recherche.</p>
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium"
                  >
                    Créer la première décharge
                  </button>
                </div>
              ) : (
                <div className={`p-6 ${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'}`}>
                  {filteredDischarges.map((discharge) => (
                    <DischargeCard
                      key={discharge.id}
                      discharge={discharge}
                      onView={handleViewDischarge}
                      onEdit={handleEditClick}
                      onDelete={handleDeleteDischarge}
                      onSign={handleSignDischarge}
                      onDownload={handleDownloadDischarge}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === 'reports' && (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Rapports et Analyses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl text-white">
                <BarChart3 className="w-8 h-8 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Rapport Mensuel</h3>
                <p className="text-blue-100">Analyse des décharges du mois</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-green-500 to-green-600 rounded-xl text-white">
                <TrendingUp className="w-8 h-8 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Tendances</h3>
                <p className="text-green-100">Évolution des montants</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl text-white">
                <Users className="w-8 h-8 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Prestataires</h3>
                <p className="text-purple-100">Analyse par prestataire</p>
              </div>
            </div>
          </div>
        )}

        {/* Discharge Form - Only show in create tab */}
        {activeTab === 'create' && (
          <div className="mt-8 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Formulaire de Décharge</h2>
              <div className="flex gap-2">
                <button
                  onClick={handlePrintDischarge}
                  className="flex items-center space-x-2 px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 font-medium"
                >
                  <Printer className="w-4 h-4" />
                  <span>Imprimer Décharge</span>
                </button>
                <button
                  onClick={() => setShowPrintModal(true)}
                  className="flex items-center space-x-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium"
                >
                  <Printer className="w-4 h-4" />
                  <span>Impression Avancée</span>
                </button>
              </div>
            </div>

          {/* Form fields */}
          <div className="mb-6 p-4 bg-gray-50 rounded-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Édition du Formulaire</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Signataire</label>
                <input
                  type="text"
                  value={formData.signataire}
                  onChange={(e) => setFormData({...formData, signataire: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nom du signataire"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Expéditeur</label>
                <input
                  type="text"
                  value={formData.expediteur}
                  onChange={(e) => setFormData({...formData, expediteur: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nom de l'expéditeur"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Montant</label>
                <input
                  type="text"
                  value={formData.montant}
                  onChange={(e) => setFormData({...formData, montant: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Montant en FCFA"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date (JJ/MM/AA)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.jour}
                    onChange={(e) => setFormData({...formData, jour: e.target.value})}
                    className="w-16 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="JJ"
                    maxLength={2}
                  />
                  <span className="flex items-center">/</span>
                  <input
                    type="text"
                    value={formData.mois}
                    onChange={(e) => setFormData({...formData, mois: e.target.value})}
                    className="w-16 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="MM"
                    maxLength={2}
                  />
                  <span className="flex items-center">/20</span>
                  <input
                    type="text"
                    value={formData.annee}
                    onChange={(e) => setFormData({...formData, annee: e.target.value})}
                    className="w-16 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="AA"
                    maxLength={2}
                  />
                </div>
              </div>
              {/* Section Objet - Mise en évidence */}
              <div className="md:col-span-2 bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                <div className="flex items-center mb-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                  <label className="text-lg font-bold text-blue-900">📋 OBJET DE LA DÉCHARGE</label>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Description principale *
                    </label>
                    <textarea
                      value={formData.objet}
                      onChange={(e) => setFormData({...formData, objet: e.target.value})}
                      className={`w-full border-2 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 resize-none ${
                        !formData.objet || formData.objet.trim() === '' 
                          ? 'border-red-300 bg-red-50' 
                          : 'border-blue-300 bg-white'
                      }`}
                      placeholder="Décrivez l'objet de la décharge (ex: Livraison de matériel informatique, Prestation de service, etc.)"
                      rows={2}
                      style={{ minHeight: '60px' }}
                      required
                    />
                    {(!formData.objet || formData.objet.trim() === '') && (
                      <div className="text-red-600 text-sm mt-1 flex items-center">
                        <span className="mr-1">⚠️</span>
                        Ce champ est obligatoire pour l'impression
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Détails complémentaires
                    </label>
                    <textarea
                      value={formData.objetLigne2}
                      onChange={(e) => setFormData({...formData, objetLigne2: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                      placeholder="Informations supplémentaires (optionnel)"
                      rows={2}
                      style={{ minHeight: '60px' }}
                    />
                  </div>
                </div>
                <div className="mt-2 text-xs text-blue-600">
                  💡 <strong>Conseil :</strong> Soyez précis dans la description pour une meilleure traçabilité
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Signature</label>
                <input
                  type="text"
                  value={formData.signature}
                  onChange={(e) => setFormData({...formData, signature: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nom du signataire"
                />
              </div>
            </div>
          </div>

          {/* Discharge Form Preview - Design professionnel A4 */}
          <div ref={dischargeFormRef} className="decharge-form-container">
            <div className="decharge-form">
              {/* En-tête professionnel avec image */}
              <div className="decharge-header">
                <img 
                  src="/factureimage/header.jpg.jpg" 
                  alt="En-tête EDIBA INTER" 
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
                <div className="decharge-header-info">
                  <div className="decharge-company-info">
                    <div className="decharge-company-name">EDIBA INTER SARL U</div>
                    <div className="decharge-company-details">
                      Prestation de services et conception de solutions informatiques<br/>
                      Audit et consultation - Vente de matériel informatique<br/>
                      et de mobiliers de bureaux - Service de médiumériques<br/>
                      Formation - Prestations diverses<br/>
                      <strong>Adresse :</strong> Agbalépedo, Rue 335 AGP, Lomé<br/>
                      <strong>Tél :</strong> +228 92 60 05 42 / 93 39 18 70<br/>
                      <strong>Email :</strong> edibainter@gmail.com
                    </div>
                  </div>
                  <div className="decharge-document-info">
                    <div><strong>Date de création :</strong> 20 Août 2021</div>
                    <div><strong>Statut Juridique :</strong> SARL U</div>
                    <div><strong>Régime fiscal :</strong> Réel avec TVA</div>
                    <div><strong>NIF :</strong> 1001694526</div>
                  </div>
                </div>
              </div>

              {/* Titre du document */}
              <div className="decharge-document-title">
                FICHE DE DÉCHARGE
              </div>

              {/* Contenu principal */}
              <div className="decharge-content">
                <div>
                  <div className="decharge-field">
                    <span className="decharge-field-label">Je soussigné Monsieur/Madame</span>
                    <span className="decharge-field-line">
                      {formData.signataire || '_________________________'}
                    </span>
                  </div>

                  <div className="decharge-field">
                    <span className="decharge-field-label">Reconnais avoir reçu de</span>
                    <span className="decharge-field-line">
                      {formData.expediteur || '_________________________'}
                    </span>
                  </div>

                  <div className="decharge-field">
                    <span className="decharge-field-label">Une somme de</span>
                    <span className="decharge-field-line">
                      {formData.montant || '_________________________'}
                    </span>
                  </div>

                  {/* Section Objet mise en évidence */}
                  <div className="decharge-objet-section">
                    <div className="decharge-objet-title">OBJET DE LA DÉCHARGE</div>
                    <div className="decharge-objet-content">
                      {formData.objet || 'Décrivez ici l\'objet de la décharge (ex: Livraison de matériel informatique, Prestation de service, etc.)'}
                    </div>
                    {formData.objetLigne2 && (
                      <div className="decharge-objet-details">
                        {formData.objetLigne2}
                      </div>
                    )}
                  </div>
                </div>

                {/* Date et signature */}
                <div className="decharge-signature-section">
                  <div style={{ marginBottom: '10pt' }}>
                    <span>Fait à Lomé le</span>
                    <span className="decharge-date-line">
                      {formData.jour || '__'}
                    </span>
                    <span>/</span>
                    <span className="decharge-date-line">
                      {formData.mois || '__'}
                    </span>
                    <span>/20</span>
                    <span className="decharge-date-line">
                      {formData.annee || '__'}
                    </span>
                  </div>
                  <div style={{ marginTop: '20pt' }}>
                    <div>Signature et numéro du receveur</div>
                    <div className="decharge-signature-line">
                      {formData.signature || '________________________________'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Pied de page professionnel avec image */}
              <div className="decharge-footer">
                <img 
                  src="/factureimage/footer.jpg.jpg" 
                  alt="Pied de page EDIBA INTER" 
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
                <div className="decharge-footer-text">
                  Adresse : Agbalépedo, Rue 335 AGP, Lomé | Tél : +228 92 60 05 42/93 39 18 70 | Email : edibainter@gmail.com
                </div>
              </div>
            </div>
          </div>
        </div>
        )}
      </div>

      {/* Modals */}
      <DischargeModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleAddDischarge}
        title="Nouvelle décharge"
        suppliersList={suppliersList}
        documents={documents}
      />

      <DischargeModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSave={handleEditDischarge}
        discharge={selectedDischarge}
        title="Modifier la décharge"
        suppliersList={suppliersList}
        documents={documents}
      />

      <DischargeViewModal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        discharge={selectedDischarge}
        onEdit={handleEditClick}
        onDownload={handleDownloadDischarge}
      />

      {/* Signature Pad */}
      <SignaturePad
        isOpen={showSignaturePad}
        onClose={() => {
          setShowSignaturePad(false);
          setSignFor(null);
        }}
        onSave={(signature) => {
          if (signFor) {
            setSignatureData(prev => ({
              ...prev,
              [signFor]: signature
            }));
            console.log('Signature data:', signatureData);
          }
        }}
        title={`Signature électronique - ${signFor || ''}`}
        signatoryName={signFor ? discharges.find(d => d.id === signFor)?.prestataire : ''}
      />

      {/* Advanced Print Modal */}
      <AdvancedPrintModal
        isOpen={showPrintModal}
        onClose={() => setShowPrintModal(false)}
        elementRef={dischargeFormRef}
        documentTitle="Fiche de Décharge"
        documentType="Décharge"
      />
    </div>
  );
};

export default DischargeModuleModern;
