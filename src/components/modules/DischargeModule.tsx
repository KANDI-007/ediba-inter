import React, { useState, useMemo, useRef } from 'react';
import { Plus, Search, Filter, Download, Eye, Edit, Trash2, FileCheck, User, Calendar, MapPin, FileSignature as Signature, CheckCircle, Clock, AlertCircle, ArrowLeft, Printer } from 'lucide-react';
import { Link } from 'react-router-dom';
import SignaturePad from '../SignaturePad';
import AdvancedPrintModal from '../AdvancedPrintModal';
import { useActivityLogger } from '../../contexts/ActivityContext';
import { useData } from '../../contexts/DataContext';
import '../../styles/decharge.css';

const DischargeModule: React.FC = () => {
  const { logCreate, logUpdate, logView, logDelete, logExport } = useActivityLogger();
  const { suppliersList, documents, discharges, addDischarge, updateDischarge, deleteDischarge } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPrestataireSuggestions, setShowPrestataireSuggestions] = useState(false);
  const [prestataireType, setPrestataireType] = useState<'fournisseur' | 'client'>('fournisseur');
  const [signFor, setSignFor] = useState<string | null>(null);
  const [showSignaturePad, setShowSignaturePad] = useState(false);
  const [signatureData, setSignatureData] = useState<Record<string, string>>({});
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDischarge, setSelectedDischarge] = useState<any>(null);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const dischargeFormRef = useRef<HTMLDivElement>(null);
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

  // Initialiser la date actuelle au chargement
  React.useEffect(() => {
    const today = new Date();
    setFormData(prev => ({
      ...prev,
      jour: today.getDate().toString().padStart(2, '0'),
      mois: (today.getMonth() + 1).toString().padStart(2, '0'),
      annee: today.getFullYear().toString().slice(-2)
    }));
  }, []);

  const [newDischarge, setNewDischarge] = useState({
    prestataire: '',
    service: '',
    montant: 0,
    datePrestation: new Date().toISOString().slice(0, 10), // Date du jour automatique
    lieu: '',
    telephone: '',
    cni: ''
  });

  // Récupérer les fournisseurs et clients existants
  const existingPrestataires = useMemo(() => {
    const fournisseurs = suppliersList.map(s => s.raisonSociale);
    const clients = Array.from(new Set(documents.map(d => d.client).filter(Boolean)));
    return { fournisseurs, clients };
  }, [suppliersList, documents]);

  // Fonctions de gestion
  const handleAddDischarge = () => {
    if (!newDischarge.prestataire || !newDischarge.service || newDischarge.montant <= 0) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      const discharge = addDischarge({
        ...newDischarge,
        statut: 'pending' as const
      });
      
      // Remplir automatiquement le formulaire avec les données
      const today = new Date();
      setFormData({
        signataire: newDischarge.prestataire,
        expediteur: 'EDIBA INTER',
        montant: newDischarge.montant.toLocaleString() + ' FCFA',
        objet: newDischarge.service,
        objetLigne2: `Prestation effectuée le ${newDischarge.datePrestation} à ${newDischarge.lieu}`,
        jour: today.getDate().toString().padStart(2, '0'),
        mois: (today.getMonth() + 1).toString().padStart(2, '0'),
        annee: today.getFullYear().toString().slice(-2),
        signature: ''
      });
      
      logCreate('Décharges', `Décharge ${discharge.id}`, discharge.id);
      setNewDischarge({
        prestataire: '',
        service: '',
        montant: 0,
        datePrestation: new Date().toISOString().slice(0, 10),
        lieu: '',
        telephone: '',
        cni: ''
      });
      setShowAddModal(false);
      alert('Décharge créée avec succès ! Le formulaire a été rempli automatiquement.');
    } catch (error) {
      alert('Erreur lors de la création de la décharge');
    }
  };

  const handleViewDischarge = (discharge: any) => {
    logView('Décharges', `Décharge ${discharge.id}`);
    setSelectedDischarge(discharge);
    setShowViewModal(true);
  };

  const handleEditDischarge = (discharge: any) => {
    setSelectedDischarge(discharge);
    setNewDischarge({
      prestataire: discharge.prestataire,
      service: discharge.service,
      montant: discharge.montant,
      datePrestation: discharge.datePrestation,
      lieu: discharge.lieu,
      telephone: discharge.telephone,
      cni: discharge.cni
    });
    setShowEditModal(true);
  };

  const handleUpdateDischarge = () => {
    if (!selectedDischarge) return;

    try {
      updateDischarge(selectedDischarge.id, selectedDischarge);
      logUpdate('Décharges', `Décharge ${selectedDischarge.id}`, selectedDischarge.id);
      setShowEditModal(false);
      setSelectedDischarge(null);
      alert('Décharge mise à jour avec succès !');
    } catch (error) {
      alert('Erreur lors de la mise à jour de la décharge');
    }
  };

  const handleDeleteDischarge = (dischargeId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette décharge ?')) {
      try {
        deleteDischarge(dischargeId);
        logDelete('Décharges', `Décharge ${dischargeId}`, dischargeId);
        alert('Décharge supprimée avec succès !');
      } catch (error) {
        alert('Erreur lors de la suppression de la décharge');
      }
    }
  };

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

  const filteredDischarges = discharges.filter(discharge =>
    discharge.prestataire.toLowerCase().includes(searchTerm.toLowerCase()) ||
    discharge.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    discharge.service.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = [
    {
      name: 'Décharges ce mois',
      value: discharges.length.toString(),
      icon: FileCheck,
      color: 'from-sky-400 to-sky-500'
    },
    {
      name: 'Montant total',
      value: `${(discharges.reduce((sum, d) => sum + d.montant, 0) / 1000).toFixed(0)}K FCFA`,
      icon: Download,
      color: 'from-green-400 to-green-500'
    },
    {
      name: 'Signées',
      value: discharges.filter(d => d.statut === 'signed').length.toString(),
      icon: CheckCircle,
      color: 'from-green-400 to-green-500'
    },
    {
      name: 'En attente',
      value: discharges.filter(d => d.statut === 'pending').length.toString(),
      icon: Clock,
      color: 'from-yellow-400 to-yellow-500'
    }
  ];

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="bg-gradient-to-r from-sky-400 to-green-400 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link 
              to="/dashboard" 
              className="mr-4 p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors duration-200 flex items-center"
              title="Retour au tableau de bord"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold mb-2">Module Décharges</h1>
              <p className="text-sky-100">Gestion des décharges pour prestataires</p>
            </div>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-white text-sky-600 px-4 py-2 rounded-lg font-medium hover:bg-sky-50 transition-colors duration-200 flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle décharge
          </button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center">
              <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-gray-600">{stat.name}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Barre de recherche et actions */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Rechercher par prestataire, numéro ou service..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-400 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
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

      {/* Liste des décharges */}
      <div className="bg-white shadow-sm rounded-lg">
        <div className="divide-y divide-gray-200">
          {filteredDischarges.map((discharge) => (
            <div key={discharge.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <FileCheck className="w-5 h-5 text-gray-400" />
                    <h3 className="text-lg font-semibold text-gray-900">{discharge.id}</h3>
                    <div className="flex items-center">
                      {getStatusIcon(discharge.statut)}
                      <span className={`ml-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(discharge.statut)}`}>
                        {getStatusText(discharge.statut)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <User className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="font-medium">{discharge.prestataire}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="w-4 h-4 mr-2 text-gray-400">📱</span>
                        <span>{discharge.telephone}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="w-4 h-4 mr-2 text-gray-400">🆔</span>
                        <span>{discharge.cni}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        <span>Prestation: {discharge.datePrestation}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="truncate">{discharge.lieu}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="w-4 h-4 mr-2 text-gray-400">📅</span>
                        <span>Créée: {discharge.dateCreation}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-lg mb-3">
                    <p className="text-sm text-gray-600 mb-1">Service:</p>
                    <p className="font-medium text-gray-900">{discharge.service}</p>
                  </div>
                </div>

                <div className="ml-6 text-right">
                  <div className="mb-4">
                    <p className="text-2xl font-bold text-gray-900">
                      {discharge.montant.toLocaleString()} FCFA
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => handleViewDischarge(discharge)}
                      className="p-2 text-gray-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors duration-200" 
                      title="Voir"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleEditDischarge(discharge)}
                      className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200" 
                      title="Modifier"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors duration-200" 
                      title="Signature" 
                      onClick={() => {
                        setSignFor(discharge.id);
                        setShowSignaturePad(true);
                      }}
                    >
                      <Signature className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200" title="Télécharger PDF" onClick={async () => {
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
                    }}>
                      <Download className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteDischarge(discharge.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200" 
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredDischarges.length === 0 && (
          <div className="p-12 text-center">
            <FileCheck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune décharge trouvée</h3>
            <p className="text-gray-500">Aucune décharge ne correspond à vos critères de recherche.</p>
          </div>
        )}
      </div>

      {/* Formulaire de décharge conforme à l'image */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Formulaire de Décharge</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle Décharge
            </button>
            <button
              onClick={() => setShowPrintModal(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <Printer className="w-4 h-4 mr-2" />
              Impression Avancée
            </button>
          </div>
        </div>

        {/* Champs d'édition du formulaire */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Édition du Formulaire</h3>
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
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Objet (ligne 1)</label>
              <input
                type="text"
                value={formData.objet}
                onChange={(e) => setFormData({...formData, objet: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Description de l'objet"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Objet (ligne 2)</label>
              <input
                type="text"
                value={formData.objetLigne2}
                onChange={(e) => setFormData({...formData, objetLigne2: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Informations complémentaires"
              />
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
            <div className="md:col-span-2 flex gap-2">
              <button
                onClick={() => {
                  const today = new Date();
                  setFormData({
                    signataire: '',
                    expediteur: 'EDIBA INTER',
                    montant: '',
                    objet: '',
                    objetLigne2: '',
                    jour: today.getDate().toString().padStart(2, '0'),
                    mois: (today.getMonth() + 1).toString().padStart(2, '0'),
                    annee: today.getFullYear().toString().slice(-2),
                    signature: ''
                  });
                }}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
              >
                Réinitialiser
              </button>
              <button
                onClick={() => {
                  const today = new Date();
                  setFormData(prev => ({
                    ...prev,
                    jour: today.getDate().toString().padStart(2, '0'),
                    mois: (today.getMonth() + 1).toString().padStart(2, '0'),
                    annee: today.getFullYear().toString().slice(-2)
                  }));
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Date Actuelle
              </button>
            </div>
          </div>
        </div>

        {/* Formulaire conforme à l'image */}
        <div ref={dischargeFormRef} className="decharge-form-container">
          <div className="decharge-form">
            {/* En-tête avec logo et informations EDIBA */}
            <div className="decharge-header">
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                marginBottom: '10px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <img 
                    src="./factureimage/header.jpg" 
                    alt="Logo EDIBA INTER" 
                    style={{ 
                      height: '60px', 
                      marginRight: '15px',
                      objectFit: 'contain'
                    }}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                  <div>
                    <div style={{ 
                      fontSize: '18px', 
                      fontWeight: 'bold', 
                      color: '#2C5AA0',
                      marginBottom: '5px'
                    }}>
                      EDIBA INTER
                    </div>
                    <div style={{ 
                      fontSize: '12px', 
                      color: '#666',
                      lineHeight: '1.3'
                    }}>
                      Prestation de services et conception de solutions informatiques<br/>
                      audit et consultation assistance vente de matériel informatiques<br/>
                      et de mobiliers de bureaux, service de médiumériques<br/>
                      formation prestations diverses
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ 
                height: '2px', 
                background: 'linear-gradient(to right, #4A90E2, #7ED321)',
                marginBottom: '10px'
              }}></div>
            </div>

            {/* Titre du document */}
            <div className="decharge-title">
              FICHE DE DECHARGE
            </div>

            {/* Contenu du formulaire */}
            <div style={{ marginBottom: '20px' }}>
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

              <div className="decharge-field">
                <span className="decharge-field-label">Objet :</span>
                <div className="decharge-object-lines">
                  {formData.objet || '________________________________________________'}
                </div>
                <div className="decharge-object-lines">
                  {formData.objetLigne2 || '________________________________________________'}
                </div>
              </div>
            </div>

            {/* Date et signature */}
            <div className="decharge-signature-section">
              <div style={{ marginBottom: '10px' }}>
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
              <div style={{ marginTop: '20px' }}>
                <div>Signature et numéro du receveur</div>
                <div className="decharge-signature-line">
                  {formData.signature || '________________________________'}
                </div>
              </div>
            </div>

            {/* Pied de page avec image */}
            <div className="decharge-footer">
              <img 
                src="./factureimage/footer.jpg" 
                alt="Footer EDIBA INTER" 
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
              <div className="decharge-footer-text">
                Adresse : Total, 331 Rue AGP, Tel : +228 92 60 05 42/95 39 10 70 ; Email : edibainter@gmail.com
              </div>
            </div>
          </div>
        </div>
      </div>
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
            alert('Signature enregistrée avec succès');
            console.log('Signature data:', signatureData);
          }
        }}
        title={`Signature électronique - ${signFor || ''}`}
        signatoryName={signFor ? discharges.find(d => d.id === signFor)?.prestataire : ''}
      />

      {/* Modal d'ajout de décharge */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-xl shadow-2xl overflow-hidden flex flex-col">
            <div className="px-6 py-4 bg-gradient-to-r from-sky-400 to-green-400 text-white">
              <h3 className="text-lg font-semibold">Nouvelle décharge</h3>
            </div>
            <div className="p-6 space-y-4 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type de prestataire</label>
                  <select
                    value={prestataireType}
                    onChange={(e) => setPrestataireType(e.target.value as 'fournisseur' | 'client')}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  >
                    <option value="fournisseur">Fournisseur</option>
                    <option value="client">Client</option>
                  </select>
                </div>
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prestataire *</label>
                  <input
                    type="text"
                    value={newDischarge.prestataire}
                    onChange={(e) => {
                      setNewDischarge({ ...newDischarge, prestataire: e.target.value });
                      setShowPrestataireSuggestions(e.target.value.length > 0);
                    }}
                    onFocus={() => setShowPrestataireSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowPrestataireSuggestions(false), 200)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    placeholder={`Nom du ${prestataireType}`}
                  />
                  {showPrestataireSuggestions && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                      {(prestataireType === 'fournisseur' ? existingPrestataires.fournisseurs : existingPrestataires.clients)
                        .filter(name => name.toLowerCase().includes(newDischarge.prestataire.toLowerCase()))
                        .map((name, index) => (
                          <div
                            key={index}
                            className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                            onClick={() => {
                              setNewDischarge({ ...newDischarge, prestataire: name });
                              setShowPrestataireSuggestions(false);
                            }}
                          >
                            {name}
                          </div>
                        ))}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                  <input
                    type="text"
                    value={newDischarge.telephone}
                    onChange={(e) => setNewDischarge({ ...newDischarge, telephone: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    placeholder="+226 XX XX XX XX"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">CNI</label>
                  <input
                    type="text"
                    value={newDischarge.cni}
                    onChange={(e) => setNewDischarge({ ...newDischarge, cni: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    placeholder="Numéro CNI"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Montant *</label>
                  <input
                    type="number"
                    value={newDischarge.montant}
                    onChange={(e) => setNewDischarge({ ...newDischarge, montant: Number(e.target.value) })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    placeholder="Montant en FCFA"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date de prestation</label>
                  <input
                    type="date"
                    value={newDischarge.datePrestation}
                    onChange={(e) => setNewDischarge({ ...newDischarge, datePrestation: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Lieu</label>
                  <input
                    type="text"
                    value={newDischarge.lieu}
                    onChange={(e) => setNewDischarge({ ...newDischarge, lieu: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    placeholder="Lieu de la prestation"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Service *</label>
                <textarea
                  value={newDischarge.service}
                  onChange={(e) => setNewDischarge({ ...newDischarge, service: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  rows={3}
                  placeholder="Description du service"
                />
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={handleAddDischarge}
                className="px-4 py-2 rounded-lg bg-sky-600 text-white hover:bg-sky-700"
              >
                Créer la décharge
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de visualisation */}
      {showViewModal && selectedDischarge && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-xl shadow-2xl overflow-hidden flex flex-col">
            <div className="px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
              <h3 className="text-lg font-semibold">Détails de la décharge</h3>
            </div>
            <div className="p-6 space-y-4 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Numéro</label>
                  <p className="text-lg font-semibold text-gray-900">{selectedDischarge.id}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedDischarge.statut)}`}>
                    {getStatusIcon(selectedDischarge.statut)}
                    <span className="ml-1">{getStatusText(selectedDischarge.statut)}</span>
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prestataire</label>
                  <p className="text-gray-900">{selectedDischarge.prestataire}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                  <p className="text-gray-900">{selectedDischarge.telephone}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CNI</label>
                  <p className="text-gray-900">{selectedDischarge.cni}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Montant</label>
                  <p className="text-xl font-bold text-green-600">{selectedDischarge.montant.toLocaleString()} FCFA</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date de prestation</label>
                  <p className="text-gray-900">{selectedDischarge.datePrestation}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date de création</label>
                  <p className="text-gray-900">{selectedDischarge.dateCreation}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lieu</label>
                  <p className="text-gray-900">{selectedDischarge.lieu}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Service</label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedDischarge.service}</p>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 flex justify-end">
              <button
                onClick={() => setShowViewModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-600 text-white hover:bg-gray-700"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de modification */}
      {showEditModal && selectedDischarge && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-xl shadow-2xl overflow-hidden flex flex-col">
            <div className="px-6 py-4 bg-gradient-to-r from-green-500 to-blue-600 text-white">
              <h3 className="text-lg font-semibold">Modifier la décharge</h3>
            </div>
            <div className="p-6 space-y-4 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prestataire *</label>
                  <input
                    type="text"
                    value={newDischarge.prestataire}
                    onChange={(e) => setNewDischarge({ ...newDischarge, prestataire: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                  <input
                    type="text"
                    value={newDischarge.telephone}
                    onChange={(e) => setNewDischarge({ ...newDischarge, telephone: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">CNI</label>
                  <input
                    type="text"
                    value={newDischarge.cni}
                    onChange={(e) => setNewDischarge({ ...newDischarge, cni: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Montant *</label>
                  <input
                    type="number"
                    value={newDischarge.montant}
                    onChange={(e) => setNewDischarge({ ...newDischarge, montant: Number(e.target.value) })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date de prestation</label>
                  <input
                    type="date"
                    value={newDischarge.datePrestation}
                    onChange={(e) => setNewDischarge({ ...newDischarge, datePrestation: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Lieu</label>
                  <input
                    type="text"
                    value={newDischarge.lieu}
                    onChange={(e) => setNewDischarge({ ...newDischarge, lieu: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Service *</label>
                <textarea
                  value={newDischarge.service}
                  onChange={(e) => setNewDischarge({ ...newDischarge, service: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  rows={3}
                />
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={handleUpdateDischarge}
                className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
              >
                Mettre à jour
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal d'impression avancée */}
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

export default DischargeModule;
