import React, { useMemo, useRef, useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  Trash2,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  Workflow,
  Palette,
  ArrowLeft
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

import { useData } from '../../contexts/DataContext';
import { useActivityLogger } from '../../contexts/ActivityContext';
import OrderCreationModal from '../OrderCreationModal';
import DocumentWorkflowViewer from '../DocumentWorkflowViewer';
import InvoiceDesignSelector from '../InvoiceDesignSelector';
import InvoiceTemplate from '../InvoiceTemplates';
import WorkflowManager from '../WorkflowManager';
import { generatePDFDirect, generatePDFFromTemplate, printTemplateDirect, DocumentData } from '../../utils/PDFGenerator';
import AdvancedPrintModal from '../AdvancedPrintModal';
import ContractOrderSelectionModal from '../ContractOrderSelectionModal';
import ContractOrderFormModal, { ContractOrderData } from '../ContractOrderFormModal';
import ContractOrderViewModal from '../ContractOrderViewModal';
import DocumentTypeSelector from '../DocumentTypeSelector';
import ArticleSelector from '../ArticleSelector';
import '../../styles/print.css';

const InvoiceModule: React.FC = () => {
  const navigate = useNavigate();
  const { 
    saveDocument, 
    documents, 
    addPayment, 
    validateQuote,
    createOrderFromQuote,
    createDeliveryFromOrder,
    createInvoiceFromDelivery,
    getDocumentWorkflow,
    suppliersList,
    clients,
    articlesDirectory,
    articles,
    articleCategories,
    contractOrders,
    addContractOrder,
    updateContractOrder
  } = useData();
  const { updateDocument, deleteDocument } = useData() as any;
  const { logCreate, logUpdate, logView, logExport } = useActivityLogger();
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewModal, setShowNewModal] = useState(false);
  const [showDocumentTypeSelector, setShowDocumentTypeSelector] = useState(false);
  const [sourceForBL, setSourceForBL] = useState<string | null>(null);
  const [expandedSources, setExpandedSources] = useState<Record<string, boolean>>({});
  const [newDocType, setNewDocType] = useState<'proforma' | 'delivery' | 'invoice' | 'contract' | 'order'>('proforma');
  const [showPayModal, setShowPayModal] = useState<{ id: string; ttc: number } | null>(null);
  const [payment, setPayment] = useState({ date: new Date().toISOString().slice(0,10), amount: 0, note: '' });
  const [expandedPayments, setExpandedPayments] = useState<Record<string, boolean>>({});
  // Workflow intégré
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<any>(null);
  const [showWorkflowViewer, setShowWorkflowViewer] = useState(false);
  const [selectedWorkflowDocument, setSelectedWorkflowDocument] = useState<string | null>(null);
  // Design de facture
  const [showDesignSelector, setShowDesignSelector] = useState(false);
  const [selectedDesign, setSelectedDesign] = useState('proforma');
  const [showPreview, setShowPreview] = useState(false);
  const [showAdvancedPrint, setShowAdvancedPrint] = useState(false);
  const [selectedDocumentForPrint, setSelectedDocumentForPrint] = useState<any>(null);
  const [showArticleSelector, setShowArticleSelector] = useState(false);
  const [currentItemIndex, setCurrentItemIndex] = useState<number | null>(null);
  const templateRef = useRef<HTMLDivElement>(null);
  const printableRef = useRef<HTMLDivElement>(null);
  // Nouveau processus de contrat/lettre de commande
  const [showContractOrderSelection, setShowContractOrderSelection] = useState(false);
  const [showContractOrderForm, setShowContractOrderForm] = useState(false);
  const [selectedContractOrderType, setSelectedContractOrderType] = useState<'contract' | 'order'>('order');
  const [selectedContractOrder, setSelectedContractOrder] = useState<ContractOrderData | null>(null);
  const [showContractOrderView, setShowContractOrderView] = useState(false);
  const [selectedContractOrderForView, setSelectedContractOrderForView] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  // Fonctions de gestion du nouveau processus
  const handleContractOrderSelection = (type: 'contract' | 'order') => {
    setSelectedContractOrderType(type);
    setShowContractOrderSelection(false);
    setShowContractOrderForm(true);
  };

  const handleContractOrderSave = (data: ContractOrderData) => {
    const savedContractOrder = addContractOrder(data);
    setSelectedContractOrder(savedContractOrder);
    setShowContractOrderForm(false);
    // Maintenant on peut créer le document avec la référence
    setForm(prev => ({
      ...prev,
      contractOrderReference: `${data.documentType === 'contract' ? 'CONTRAT' : 'LETTRE DE COMMANDE'} N°${data.documentNumber}`
    }));
  };

  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0,10),
    client: '',
    institution: '',
    address: '',
    city: 'Lomé',
    clientPhone: '',
    tva: 18,
    items: [{ description: '', quantity: 1, unitPrice: 0 } as { description: string; quantity: number; unitPrice: number }],
    paymentTermsDays: 0,
    paymentMethod: 'Non spécifié',
    latePaymentInterest: 'Taux d\'intérêts légal en vigueur',
  });

  // Fonction pour générer automatiquement le numéro de facture
  const generateInvoiceNumber = (type: string, date: string) => {
    const year = new Date(date).getFullYear();
    const docsSameYearType = documents.filter(d => 
      d.type === type && 
      new Date(d.date).getFullYear() === year
    );
    const seqs = docsSameYearType.map(d => parseInt(d.reference.split('-').pop() || '0', 10)).filter(n => !isNaN(n));
    const max = seqs.length ? Math.max(...seqs) : 0;
    const nextSeq = max + 1;
    
    const yearSuffix = String(year).slice(-2);
    const prefix = type === 'proforma' ? 'D' :
                   type === 'delivery' ? 'BL' :
                   type === 'order' ? 'CMD' :
                   type === 'invoice' ? 'F' : 'DOC';
    return `N°${prefix}${yearSuffix}${String(nextSeq).padStart(5, '0')}`;
  };

  // Numéro de facture généré automatiquement
  const autoGeneratedNumber = generateInvoiceNumber(newDocType, form.date);
  const [showClientSuggestions, setShowClientSuggestions] = useState(false);
  const [showArticleSuggestions, setShowArticleSuggestions] = useState(false);


  // Récupérer les clients existants
  const existingClients = useMemo(() => {
    const clientSet = new Set<string>();
    // Ajouter les clients du contexte
    clients.forEach(client => {
      clientSet.add(client.raisonSociale);
    });
    // Ajouter les clients des documents
    documents.forEach(doc => {
      if (doc.client) {
        clientSet.add(doc.client);
      }
    });
    return Array.from(clientSet).sort();
  }, [documents, clients]);

  // Récupérer les articles existants
  const existingArticles = useMemo(() => {
    const articleSet = new Set<string>();
    documents.forEach(doc => {
      doc.items.forEach(item => {
        if (item.description) {
          articleSet.add(item.description);
        }
      });
    });
    // Ajouter les articles des fournisseurs
    suppliersList.forEach(supplier => {
      supplier.articles?.forEach(article => {
        if (article.name) {
          articleSet.add(article.name);
        }
      });
    });
    // Ajouter le répertoire global
    articlesDirectory.forEach((a: any) => {
      if (a.name) articleSet.add(a.name);
    });
    return Array.from(articleSet).sort();
  }, [documents, suppliersList, articlesDirectory]);

  // Conversion du montant TTC en toutes lettres (français, FCFA)
  const numberToFrenchWords = (num: number): string => {
    if (num === 0) return 'zéro';
    const units = ['', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf', 'dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize'];
    const tens = ['', '', 'vingt', 'trente', 'quarante', 'cinquante', 'soixante'];
    const belowHundred = (n: number): string => {
      if (n < 17) return units[n];
      if (n < 20) return 'dix-' + units[n - 10];
      if (n < 70) {
        const d = Math.floor(n / 10);
        const r = n % 10;
        if (r === 1 && d !== 8) return tens[d] + '-et-un';
        return tens[d] + (r ? '-' + units[r] : '');
      }
      if (n < 80) return 'soixante-' + belowHundred(n - 60);
      if (n < 100) return 'quatre-vingt' + (n === 80 ? 's' : '-' + belowHundred(n - 80));
      return '';
    };
    const belowThousand = (n: number): string => {
      if (n < 100) return belowHundred(n);
      const h = Math.floor(n / 100);
      const r = n % 100;
      const hPart = h === 1 ? 'cent' : units[h] + ' cent' + (r === 0 ? 's' : '');
      return hPart + (r ? ' ' + belowHundred(r) : '');
    };
    const scale = (n: number, word: string): string => (n ? (n === 1 ? word : numberToFrenchWords(n) + ' ' + word + 's') : '');
    const billions = Math.floor(num / 1_000_000_000);
    const millions = Math.floor((num % 1_000_000_000) / 1_000_000);
    const thousands = Math.floor((num % 1_000_000) / 1000);
    const rest = num % 1000;
    const parts: string[] = [];
    if (billions) parts.push(scale(billions, 'milliard'));
    if (millions) parts.push(scale(millions, 'million'));
    if (thousands) parts.push(thousands === 1 ? 'mille' : belowThousand(thousands) + ' mille');
    if (rest) parts.push(belowThousand(rest));
    return parts.join(' ').replace(/\s+/g, ' ').trim();
  };
  const amountToWordsFCFA = (amount: number): string => {
    const rounded = Math.round(amount);
    return numberToFrenchWords(rounded) + ' francs CFA';
  };

  const formatFrenchLongDate = (iso: string): string => {
    try {
      const d = new Date(iso);
      const months = ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];
      return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
    } catch {
      return iso;
    }
  };

  const invoices = documents.map(d => ({
    id: d.id,
    type: d.type,
    client: d.client,
    amount: d.items.reduce((s, it) => s + it.quantity * it.unitPrice, 0) * (1 + d.tva/100),
    status: d.status,
    date: d.date,
    dueDate: d.date,
  }));

  const linkedBLCount: Record<string, number> = useMemo(() => {
    const map: Record<string, number> = {};
    documents.forEach(d => {
      if (d.type === 'delivery' && d.sourceId) {
        map[d.sourceId] = (map[d.sourceId] || 0) + 1;
      }
    });
    return map;
  }, [documents]);

  const blBySource: Record<string, { id: string; date: string; amount: number }[]> = useMemo(() => {
    const map: Record<string, { id: string; date: string; amount: number }[]> = {};
    documents.forEach(d => {
      if (d.type === 'delivery' && d.sourceId) {
        const amount = d.items.reduce((s, it) => s + it.quantity * it.unitPrice, 0) * (1 + d.tva/100);
        (map[d.sourceId] ||= []).push({ id: d.id, date: d.date, amount });
      }
    });
    return map;
  }, [documents]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'partial':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'overdue':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'validated':
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid':
        return 'Payée';
      case 'partial':
        return 'Partiel';
      case 'overdue':
        return 'En retard';
      case 'validated':
        return 'Validé';
      default:
        return 'En attente';
    }
  };

  // Fonctions de workflow intégré
  const handleValidateQuote = (quoteId: string) => {
    try {
      validateQuote(quoteId);
      logUpdate('Facturation', `Devis ${quoteId}`, quoteId);
      alert('Devis validé avec succès !');
    } catch (error) {
      alert('Erreur lors de la validation du devis');
    }
  };

  const handleCreateOrder = (quoteId: string) => {
    const quote = documents.find(d => d.id === quoteId);
    if (quote) {
      setSelectedQuote(quote);
      setShowOrderModal(true);
    }
  };

  const handleOrderCreated = (orderNumber: string, contractTerms: any) => {
    try {
      const order = createOrderFromQuote(selectedQuote.id, orderNumber, contractTerms);
      logCreate('Facturation', `Commande ${orderNumber}`, order.id);
      setShowOrderModal(false);
      setSelectedQuote(null);
      alert('Commande créée avec succès !');
    } catch (error) {
      alert('Erreur lors de la création de la commande');
    }
  };

  const handleCreateDelivery = (orderId: string) => {
    try {
      const delivery = createDeliveryFromOrder(orderId);
      logCreate('Facturation', `Bon de livraison ${delivery.id}`, delivery.id);
      alert('Bon de livraison créé avec succès !');
    } catch (error) {
      alert('Erreur lors de la création du bon de livraison');
    }
  };

  const handleCreateInvoice = (deliveryId: string) => {
    try {
      const invoice = createInvoiceFromDelivery(deliveryId);
      logCreate('Facturation', `Facture ${invoice.id}`, invoice.id);
      alert('Facture créée avec succès !');
    } catch (error) {
      alert('Erreur lors de la création de la facture');
    }
  };

  const handleViewWorkflow = (documentId: string) => {
    setSelectedWorkflowDocument(documentId);
    setShowWorkflowViewer(true);
  };

  // Fonction de suppression d'une facture
  const handleDeleteInvoice = (invoiceId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette facture ?')) {
      try {
        deleteDocument(invoiceId);
        logUpdate('Facturation', `Facture ${invoiceId} supprimée`, invoiceId);
        alert('Facture supprimée avec succès !');
      } catch (error) {
        alert('Erreur lors de la suppression de la facture');
      }
    }
  };

  // Gestion de la sélection d'articles
  const handleArticleSelect = (article: any) => {
    if (currentItemIndex !== null) {
      const items = [...form.items];
      items[currentItemIndex] = {
        ...items[currentItemIndex],
        description: article.name,
        unitPrice: article.unitPrice || 0
      };
      setForm({ ...form, items });
      setCurrentItemIndex(null);
    }
  };

  const openArticleSelector = (itemIndex: number) => {
    setCurrentItemIndex(itemIndex);
    setShowArticleSelector(true);
  };

  const getWorkflowActions = (document: any) => {
    const actions = [];
    
    if (document.type === 'proforma' && document.workflowStatus !== 'validated') {
      actions.push(
        <button
          key="validate"
          onClick={() => handleValidateQuote(document.id)}
          className="text-xs px-2 py-1 rounded-md hover:bg-green-50 text-green-700"
        >
          Valider
        </button>
      );
    }
    
    if (document.type === 'proforma' && document.workflowStatus === 'validated') {
      actions.push(
        <button
          key="create-order"
          onClick={() => handleCreateOrder(document.id)}
          className="text-xs px-2 py-1 rounded-md hover:bg-blue-50 text-blue-700"
        >
          Créer commande
        </button>
      );
    }
    
    if (document.type === 'order' && document.workflowStatus === 'ordered') {
      actions.push(
        <button
          key="create-delivery"
          onClick={() => handleCreateDelivery(document.id)}
          className="text-xs px-2 py-1 rounded-md hover:bg-purple-50 text-purple-700"
        >
          Créer BL
        </button>
      );
    }
    
    // Permettre la création de facture pour tous les bons de livraison, 
    // qu'ils soient créés à partir de contrats/lettres de commande ou de commandes normales
    if (document.type === 'delivery' && (document.workflowStatus === 'delivered' || document.contractOrderReference)) {
      actions.push(
        <button
          key="create-invoice"
          onClick={() => handleCreateInvoice(document.id)}
          className="text-xs px-2 py-1 rounded-md hover:bg-orange-50 text-orange-700"
        >
          Créer facture
        </button>
      );
    }
    
    // Bouton pour voir le workflow
    if (document.parentDocumentId || document.childDocuments?.length > 0) {
      actions.push(
        <button
          key="workflow"
          onClick={() => handleViewWorkflow(document.id)}
          className="text-xs px-2 py-1 rounded-md hover:bg-gray-50 text-gray-700"
        >
          <Workflow className="w-3 h-3 inline mr-1" />
          Workflow
        </button>
      );
    }
    
    return actions;
  };

  // Fonction pour gérer les actions des contrats et lettres de commande
  const getContractOrderActions = (contractOrder: any) => {
    const actions = [];
    
    if (contractOrder.documentType === 'contract' || contractOrder.documentType === 'order') {
      actions.push(
        <button
          key="create-delivery-from-contract"
          onClick={() => {
            setNewDocType('delivery');
            setSourceForBL(contractOrder.id);
            setForm({
              ...form,
              institution: contractOrder.awardee,
              address: '',
              city: 'Lomé',
              tva: 18,
              items: [{ description: contractOrder.subject, quantity: 1, unitPrice: contractOrder.amount }],
              contractOrderReference: `${contractOrder.documentType === 'contract' ? 'CONTRAT' : 'LETTRE DE COMMANDE'} N°${contractOrder.documentNumber}`,
            });
            setShowNewModal(true);
          }}
          className="text-xs px-2 py-1 rounded-md hover:bg-purple-50 text-purple-700"
        >
          Créer BL
        </button>
      );
    }
    
    return actions;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'partial':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'validated':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'proforma':
        return 'Devis';
      case 'order':
        return 'Commande';
      case 'delivery':
        return 'Bon de livraison';
      case 'invoice':
        return 'Facture';
      default:
        return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'proforma':
        return 'bg-purple-100 text-purple-800';
      case 'order':
        return 'bg-blue-100 text-blue-800';
      case 'delivery':
        return 'bg-orange-100 text-orange-800';
      case 'invoice':
        return 'bg-green-100 text-green-800';
      case 'contract':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const tabs = [
    { id: 'all', name: 'Tous', count: invoices.length + contractOrders.length },
    { id: 'proforma', name: 'Devis', count: invoices.filter(i => i.type === 'proforma').length },
    { id: 'order', name: 'Commandes', count: invoices.filter(i => i.type === 'order').length },
    { id: 'delivery', name: 'Bons de livraison', count: invoices.filter(i => i.type === 'delivery').length },
    { id: 'invoice', name: 'Factures', count: invoices.filter(i => i.type === 'invoice').length },
    { id: 'contract', name: 'Contrats', count: contractOrders.filter(co => co.documentType === 'contract').length },
    { id: 'contract-order', name: 'Lettres de Commande', count: contractOrders.filter(co => co.documentType === 'order').length },
  ];

  // Créer une liste unifiée des documents et contrats/lettres de commande
  const allDocuments = [
    ...invoices.map(invoice => ({
      ...invoice,
      isContractOrder: false,
      contractOrderData: null
    })),
    ...contractOrders.map(contractOrder => ({
      id: contractOrder.id,
      type: contractOrder.documentType,
      client: contractOrder.awardee,
      amount: contractOrder.amount,
      status: 'validated' as const,
      date: contractOrder.date,
      dueDate: contractOrder.date,
      isContractOrder: true,
      contractOrderData: contractOrder
    }))
  ];

  const filteredInvoices = allDocuments.filter(document => {
    const matchesTab = activeTab === 'all' || 
                      document.type === activeTab || 
                      (activeTab === 'contract' && document.isContractOrder && document.contractOrderData?.documentType === 'contract') ||
                      (activeTab === 'contract-order' && document.isContractOrder && document.contractOrderData?.documentType === 'order');
    const matchesSearch = document.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         document.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="bg-gradient-to-r from-brand-blue to-brand-green rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          {/* Section Navigation et Titre */}
          <div className="flex items-center space-x-6">
            {/* Bouton de navigation */}
            <Link 
              to="/dashboard" 
              className="group p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-300 flex items-center backdrop-blur-sm border border-white/20"
              title="Retour au tableau de bord"
            >
              <ArrowLeft className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
            </Link>
            
            {/* Informations du module */}
            <div className="flex flex-col">
              <div className="flex items-center space-x-3 mb-1">
                <div className="w-2 h-2 bg-white/60 rounded-full"></div>
                <h1 className="text-3xl font-bold tracking-tight">Module Facturation</h1>
              </div>
              <p className="text-white/90 text-lg font-medium">Gestion complète des documents commerciaux</p>
              <div className="flex items-center space-x-4 mt-2 text-sm text-white/70">
                <span className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-2"></div>
                  Devis • Commandes • Livraisons • Factures
                </span>
              </div>
            </div>
          </div>
          
          {/* Section Actions Principales */}
          <div className="flex items-center space-x-3">
            {/* Bouton Nouveau Document - Style Premium */}
            <button 
              onClick={() => setShowDocumentTypeSelector(true)} 
              className="group bg-white text-brand-blue px-6 py-3 rounded-xl font-semibold hover:bg-cyan-50 hover:shadow-lg transition-all duration-300 flex items-center space-x-2 border border-white/20 shadow-md"
            >
              <div className="p-1 bg-brand-blue/10 rounded-lg group-hover:bg-brand-blue/20 transition-colors duration-200">
                <Plus className="w-4 h-4" />
              </div>
              <span>Nouveau Document</span>
            </button>
            
            {/* Indicateur de statut */}
            <div className="flex items-center space-x-2 px-4 py-2 bg-white/10 rounded-lg backdrop-blur-sm border border-white/20">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-white/90">Système actif</span>
            </div>
          </div>
        </div>
      </div>

      {/* Onglets */}
      <div className="bg-white shadow-sm rounded-lg">
        <div className="border-b border-gray-200">
          <div className="flex items-center justify-between px-6">
            {/* Onglets principaux */}
            <nav className="-mb-px flex space-x-8">
              {tabs.filter(tab => !['contract', 'contract-order'].includes(tab.id)).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-sky-500 text-sky-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.name}
                  <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                    activeTab === tab.id ? 'bg-sky-100 text-sky-600' : 'bg-gray-100 text-gray-900'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </nav>
            
            {/* Onglets Contrats et Lettres de Commande - Style isolé */}
            <div className="flex items-center space-x-1 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-1 border border-indigo-200">
              {tabs.filter(tab => ['contract', 'contract-order'].includes(tab.id)).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-4 rounded-md font-medium text-sm whitespace-nowrap transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-indigo-700 hover:bg-indigo-100 hover:text-indigo-800'
                  }`}
                >
                  {tab.name}
                  <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                    activeTab === tab.id 
                      ? 'bg-white/20 text-white' 
                      : 'bg-indigo-200 text-indigo-800'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Barre de recherche et filtres */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Rechercher par client ou numéro..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-400 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              {/* Boutons de vue */}
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                <button 
                  onClick={() => setViewMode('cards')}
                  className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                    viewMode === 'cards' 
                      ? 'bg-sky-600 text-white' 
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Cartes
                </button>
                <button 
                  onClick={() => setViewMode('table')}
                  className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                    viewMode === 'table' 
                      ? 'bg-sky-600 text-white' 
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Tableau
                </button>
              </div>
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

        {/* Vue Tableau */}
        {viewMode === 'table' && (
          <div className="overflow-x-auto mt-4">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Numéro
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    NIF
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Montant HT
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Montant TTC
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    État exécution
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    État de paiement
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {invoice.documentNumber || invoice.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {invoice.client}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {(() => {
                        const clientData = clients.find(c => c.raisonSociale === invoice.client);
                        return clientData?.nif || 'N/A';
                      })()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(invoice.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {invoice.amountHT?.toFixed(2) || '0.00'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {invoice.amountTTC?.toFixed(2) || '0.00'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                        {getStatusText(invoice.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                        {invoice.paymentStatus || 'Non payé'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setSelectedDocument(invoice);
                            setShowViewModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedDocument(invoice);
                            setShowEditModal(true);
                          }}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteInvoice(invoice.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Vue Cartes */}
        {viewMode === 'cards' && (
        <div className="divide-y divide-gray-200">
          {filteredInvoices.map((invoice) => (
            <div key={invoice.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <h3 className="text-sm font-medium text-gray-900">{invoice.id}</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(invoice.type)}`}>
                      {invoice.isContractOrder ? 
                        (invoice.contractOrderData?.documentType === 'contract' ? 'Contrat' : 'Lettre de Commande') : 
                        getTypeText(invoice.type)
                      }
                    </span>
                    <div className="flex items-center">
                      {getStatusIcon(invoice.status)}
                      <span className={`ml-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                        {getStatusText(invoice.status)}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{invoice.client}</p>
                  {/* Affichage du NIF du client */}
                  {(() => {
                    const clientData = clients.find(c => c.raisonSociale === invoice.client);
                    return clientData?.nif ? (
                      <p className="text-xs text-gray-500 mb-1">NIF: {clientData.nif}</p>
                    ) : null;
                  })()}
                  {invoice.isContractOrder && invoice.contractOrderData && (
                    <div className="text-xs text-gray-500 mb-1">
                      <div>N°: {invoice.contractOrderData.documentNumber}</div>
                      <div>Objet: {invoice.contractOrderData.subject}</div>
                    </div>
                  )}
                  <div className="flex items-center text-xs text-gray-500 space-x-4">
                    <span>Date: {invoice.date}</span>
                    <span>Échéance: {invoice.dueDate}</span>
                  </div>
                  {(invoice.type === 'proforma' || invoice.type === 'contract' || (invoice.isContractOrder && invoice.contractOrderData)) && (
                    <div className="mt-2 flex items-center gap-2">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-700">BL: {linkedBLCount[invoice.id] || 0}</span>
                      <button
                        className="text-xs px-2 py-1 rounded-md bg-sky-600 text-white hover:bg-sky-700"
                        onClick={() => {
                          if (invoice.isContractOrder && invoice.contractOrderData) {
                            // Créer un BL à partir d'un contrat/lettre de commande
                            setNewDocType('delivery');
                            setSourceForBL(invoice.id);
                            setForm({
                              ...form,
                              institution: invoice.contractOrderData.awardee,
                              address: '',
                              city: 'Lomé',
                              tva: 18,
                              items: [{ description: invoice.contractOrderData.subject, quantity: 1, unitPrice: invoice.contractOrderData.amount }],
                              contractOrderReference: `${invoice.contractOrderData.documentType === 'contract' ? 'CONTRAT' : 'LETTRE DE COMMANDE'} N°${invoice.contractOrderData.documentNumber}`,
                            });
                            setShowNewModal(true);
                          } else {
                            const src = documents.find(d => d.id === invoice.id);
                            if (!src) return;
                            setNewDocType('delivery');
                            setSourceForBL(src.id);
                            setForm({
                              ...form,
                              institution: src.client,
                              address: src.address || '',
                              city: src.city || form.city,
                              items: src.items.map(it => ({ ...it })),
                              contractOrderReference: src.contractOrderReference,
                            });
                            setShowNewModal(true);
                          }
                        }}
                      >
                        Nouveau BL
                      </button>
                      {!!(blBySource[invoice.id]?.length) && (
                        <button
                          className="text-xs px-2 py-1 rounded-md border text-gray-700 hover:bg-gray-50"
                          onClick={() => setExpandedSources(s => ({ ...s, [invoice.id]: !s[invoice.id] }))}
                        >
                          {expandedSources[invoice.id] ? 'Masquer BL' : 'Voir BL'}
                        </button>
                      )}
                    </div>
                  )}
                  {invoice.type !== 'proforma' && invoice.type !== 'contract' && (
                    <div className="mt-2 text-xs text-gray-500">Lié à: document source</div>
                  )}
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900">
                      {invoice.amount.toLocaleString('fr-FR')} FCFA
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button 
                      title="Voir" 
                      className="p-2 text-gray-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors duration-200" 
                      onClick={() => {
                        if (invoice.isContractOrder && invoice.contractOrderData) {
                          // Afficher les détails du contrat/lettre de commande dans le modal
                          setSelectedContractOrderForView(invoice.contractOrderData);
                          setShowContractOrderView(true);
                        } else {
                          const doc = documents.find(d => d.id === invoice.id);
                          if (doc) {
                            logView('Facturation', `${getTypeText(doc.type)} ${doc.id}`);
                            setForm({
                              date: doc.date,
                              client: doc.client,
                              institution: doc.client,
                              address: doc.address || '',
                              city: doc.city || '',
                              tva: doc.tva,
                              items: doc.items,
                              paymentTermsDays: doc.paymentTermsDays || 30,
                              paymentMethod: doc.paymentMethod || 'Non spécifié',
                              latePaymentInterest: doc.latePaymentInterest || 'Taux d\'intérêts légal en vigueur',
                              contractOrderReference: doc.contractOrderReference
                            });
                            setNewDocType(doc.type);
                            setShowNewModal(true);
                          }
                        }
                      }}
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    {/* Actions de workflow */}
                    {invoice.isContractOrder && invoice.contractOrderData ? 
                      getContractOrderActions(invoice.contractOrderData) : 
                      getWorkflowActions(documents.find(d => d.id === invoice.id))
                    }
                    
                    {/* Workflow Manager */}
                    <button
                      title="Gérer le workflow"
                      className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors duration-200"
                      onClick={() => {
                        const doc = documents.find(d => d.id === invoice.id);
                        if (doc) {
                          setSelectedWorkflowDocument(doc.id);
                          setShowWorkflowViewer(true);
                        }
                      }}
                    >
                      <Workflow className="w-4 h-4" />
                    </button>
                    {invoice.type === 'delivery' && (
                      <select
                        title="Statut BL"
                        className="text-xs border rounded-md px-2 py-1 text-gray-700"
                        value={documents.find(d => d.id === invoice.id)?.status || 'pending'}
                        onChange={(e) => updateDocument(invoice.id, { status: e.target.value })}
                      >
                        <option value="pending">En cours</option>
                        <option value="partial">Partiel</option>
                        <option value="paid">Total</option>
                      </select>
                    )}
                    {invoice.type === 'order' && (
                      <select
                        title="Statut Commande"
                        className="text-xs border rounded-md px-2 py-1 text-gray-700"
                        value={documents.find(d => d.id === invoice.id)?.workflowStatus || 'ordered'}
                        onChange={(e) => updateDocument(invoice.id, { workflowStatus: e.target.value })}
                      >
                        <option value="ordered">Commandée</option>
                        <option value="in_progress">En cours</option>
                        <option value="delivered">Livrée</option>
                        <option value="completed">Terminée</option>
                        <option value="cancelled">Annulée</option>
                      </select>
                    )}
                    {invoice.type === 'invoice' && (
                      <button title="Enregistrer un paiement" className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200" onClick={() => {
                        const doc = documents.find(d => d.id === invoice.id);
                        if (!doc) return;
                        const totalHT = doc.items.reduce((s, it) => s + it.quantity * it.unitPrice, 0);
                        const tva = Math.round((totalHT * doc.tva) / 100);
                        const ttc = totalHT + tva;
                        setPayment({ date: new Date().toISOString().slice(0,10), amount: 0, note: '' });
                        setShowPayModal({ id: doc.id, ttc });
                      }}>
                        <Edit className="w-4 h-4" />
                      </button>
                    )}
                    <button 
                      title="Modifier" 
                      className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200" 
                      onClick={() => {
                        const doc = documents.find(d => d.id === invoice.id);
                        if (doc) {
                          setForm({
                            date: doc.date,
                            client: doc.client,
                            institution: doc.client,
                            address: doc.address || '',
                            city: doc.city || '',
                            tva: doc.tva,
                            items: doc.items,
                            paymentTermsDays: doc.paymentTermsDays || 30,
                            paymentMethod: doc.paymentMethod || 'Non spécifié',
                            latePaymentInterest: doc.latePaymentInterest || 'Taux d\'intérêts légal en vigueur'
                          });
                          setNewDocType(doc.type);
                          setShowNewModal(true);
                        }
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      title="Impression avancée"
                      className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors duration-200"
                      onClick={() => {
                        const doc = documents.find(d => d.id === invoice.id);
                        if (doc) {
                          setSelectedDocumentForPrint(doc);
                          setForm({
                            date: doc.date,
                            client: doc.client,
                            institution: doc.client,
                            address: doc.address || '',
                            city: doc.city || '',
                            tva: doc.tva,
                            items: doc.items,
                            paymentTermsDays: doc.paymentTermsDays || 30,
                            paymentMethod: doc.paymentMethod || 'Non spécifié',
                            latePaymentInterest: doc.latePaymentInterest || 'Taux d\'intérêts légal en vigueur'
                          });
                          setNewDocType(doc.type);
                          setShowAdvancedPrint(true);
                        }
                      }}
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button 
                      title="Supprimer"
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                      onClick={() => {
                        if (confirm('Êtes-vous sûr de vouloir supprimer ce document ?')) {
                          try {
                            deleteDocument(invoice.id);
                            logDelete('Documents', `Document ${invoice.id}`, invoice.id);
                            alert('Document supprimé avec succès !');
                          } catch (error) {
                            alert('Erreur lors de la suppression du document');
                          }
                        }
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              {invoice.type === 'invoice' && (
                <div className="mt-2">
                  <button className="text-xs px-2 py-1 rounded-md border text-gray-700 hover:bg-gray-50" onClick={() => setExpandedPayments(s => ({ ...s, [invoice.id]: !s[invoice.id] }))}>
                    {expandedPayments[invoice.id] ? 'Masquer paiements' : 'Voir paiements'}
                  </button>
                </div>
              )}
              {expandedSources[invoice.id] && blBySource[invoice.id] && (
                <div className="mt-3 rounded-md border bg-gray-50 p-3">
                  <div className="text-xs text-gray-600 mb-2">Bons de Livraison liés</div>
                  <div className="space-y-2">
                    {blBySource[invoice.id].map((bl) => (
                      <div key={bl.id} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-3">
                          <span className="font-medium text-gray-900">{bl.id}</span>
                          <span className="text-gray-500">{bl.date}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-gray-900 font-medium">{bl.amount.toLocaleString('fr-FR')} FCFA</span>
                          <button 
                            className="text-xs px-2 py-1 rounded-md hover:bg-sky-50 text-sky-700"
                            onClick={() => {
                              const doc = documents.find(d => d.id === bl.id);
                              if (doc) {
                                setForm({
                                  date: doc.date,
                                  client: doc.client,
                                  institution: doc.client,
                                  address: doc.address || '',
                                  city: doc.city || '',
                                  tva: doc.tva,
                                  items: doc.items,
                                  paymentTermsDays: doc.paymentTermsDays || 30,
                                  paymentMethod: doc.paymentMethod || 'Non spécifié',
                                  latePaymentInterest: doc.latePaymentInterest || 'Taux d\'intérêts légal en vigueur'
                                });
                                setNewDocType(doc.type);
                                setShowNewModal(true);
                              }
                            }}
                          >
                            Voir
                          </button>
                          <button 
                            className="text-xs px-2 py-1 rounded-md hover:bg-green-50 text-green-700"
                            onClick={async () => {
                              try {
                                const doc = documents.find(d => d.id === bl.id);
                                if (doc) {
                                  const documentData: DocumentData = {
                                    id: doc.id,
                                    date: doc.date,
                                    dueDate: doc.dueDate,
                                    client: doc.client,
                                    address: doc.address,
                                    city: doc.city,
                                    tva: doc.tva,
                                    items: doc.items,
                                    paymentTermsDays: doc.paymentTermsDays,
                                    payments: doc.payments
                                  };
                                  const pdf = await generatePDFDirect(documentData, doc.type);
                                  pdf.save(`${doc.type}-${doc.id}.pdf`);
                                  logExport('Facturation', 'PDF');
                                }
                              } catch (error) {
                                console.error('Erreur lors de la génération du PDF:', error);
                                alert('Erreur lors de la génération du PDF');
                              }
                            }}
                          >
                            PDF
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {invoice.type === 'invoice' && expandedPayments[invoice.id] && (
                <div className="mt-3 rounded-md border bg-gray-50 p-3">
                  {(() => {
                    const doc = documents.find(d => d.id === invoice.id);
                    if (!doc) return null;
                    const totalHT = doc.items.reduce((s, it) => s + it.quantity * it.unitPrice, 0);
                    const tva = Math.round((totalHT * doc.tva) / 100);
                    const ttc = totalHT + tva;
                    const paid = (doc.payments || []).reduce((s, p) => s + p.amount, 0);
                    const remaining = Math.max(ttc - paid, 0);
                    return (
                      <>
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-gray-600">Historique des paiements</span>
                          <span className="text-gray-700">Reste dû: <span className="font-semibold">{remaining.toLocaleString('fr-FR')} FCFA</span></span>
                        </div>
                        <div className="space-y-2">
                          {(doc.payments || []).map((p, idx) => (
                            <div key={idx} className="flex items-center justify-between text-sm">
                              <div className="text-gray-700">{p.date} — {p.note || 'Paiement'}</div>
                              <div className="font-medium text-green-700">+ {p.amount.toLocaleString('fr-FR')} FCFA</div>
                            </div>
                          ))}
                          {(doc.payments || []).length === 0 && (
                            <div className="text-xs text-gray-500">Aucun paiement enregistré.</div>
                          )}
                        </div>
                      </>
                    );
                  })()}
                </div>
              )}
            </div>
          ))}
        </div>
        )}

        {filteredInvoices.length === 0 && (
          <div className="p-12 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun document trouvé</h3>
            <p className="text-gray-500">Aucun document ne correspond à vos critères de recherche.</p>
          </div>
        )}
      </div>

      {/* Modal Nouveau Document */}
      {showNewModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-xl shadow-2xl overflow-hidden flex flex-col">
            <div className="px-6 py-4 bg-gradient-to-r from-sky-400 to-green-400 text-white">
              <h3 className="text-lg font-semibold">Nouveau document</h3>
            </div>
            <div className="p-6 space-y-4 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm text-gray-600">Type</label>
                  <select 
                    value={newDocType} 
                    onChange={(e) => {
                      const value = e.target.value as any;
                      if (value === 'contract' || value === 'order') {
                        setNewDocType(value);
                        setShowContractOrderSelection(true);
                      } else {
                        setNewDocType(value);
                      }
                    }} 
                    className="mt-1 w-full border rounded-lg px-3 py-2"
                  >
                    <option value="proforma">Devis / Proforma</option>
                    <option value="order">Commande</option>
                    <option value="delivery">Bon de livraison</option>
                    <option value="invoice">Facture</option>
                    <option value="contract">Contrat / Lettre de Commande</option>
                  </select>
                </div>
                {/* Référence supprimée: numérotation automatique */}
                <div>
                  <label className="text-sm text-gray-600">Date</label>
                  <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="mt-1 w-full border rounded-lg px-3 py-2" />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Numéro généré automatiquement</label>
                  <div className="mt-1 w-full border rounded-lg px-3 py-2 bg-gray-50 text-gray-700 font-semibold">
                    {autoGeneratedNumber}
                  </div>
                </div>
                <div className="md:col-span-2 relative">
                  <label className="text-sm text-gray-600">Institution / Client</label>
                  <input 
                    value={form.institution} 
                    onChange={(e) => {
                      setForm({ ...form, institution: e.target.value });
                      setShowClientSuggestions(e.target.value.length > 0);
                    }}
                    onFocus={() => setShowClientSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowClientSuggestions(false), 200)}
                    className="mt-1 w-full border rounded-lg px-3 py-2" 
                    placeholder="Ex: Ministère des Armées / CABINET" 
                  />
                  {showClientSuggestions && existingClients.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                      {existingClients
                        .filter(client => client.toLowerCase().includes(form.institution.toLowerCase()))
                        .map((client, index) => (
                          <div
                            key={index}
                            className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                            onClick={() => {
                              const clientData = clients.find(c => c.raisonSociale === client);
                              setForm({ 
                                ...form, 
                                institution: client,
                                clientPhone: clientData?.telephone || '',
                                address: clientData?.adresse || form.address,
                                city: clientData?.ville || form.city
                              });
                              setShowClientSuggestions(false);
                            }}
                          >
                            {client}
                          </div>
                        ))}
                    </div>
                  )}
                </div>
                <div>
                  <label className="text-sm text-gray-600">Ville</label>
                  <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="mt-1 w-full border rounded-lg px-3 py-2" />
                </div>
                <div className="md:col-span-3 relative">
                  <label className="text-sm text-gray-600">Adresse</label>
                  <input 
                    value={form.address} 
                    onChange={(e) => setForm({ ...form, address: e.target.value })} 
                    className="mt-1 w-full border rounded-lg px-3 py-2" 
                    placeholder="Adresse du client (optionnel)" 
                  />
                  {form.institution && clients.find(c => c.raisonSociale === form.institution) && (
                    <div className="mt-1 text-xs text-gray-500">
                      Adresse suggérée: {clients.find(c => c.raisonSociale === form.institution)?.adresse}
                      <button 
                        type="button"
                        onClick={() => {
                          const client = clients.find(c => c.raisonSociale === form.institution);
                          if (client) {
                            setForm({ ...form, address: client.adresse, city: client.ville, clientPhone: client.telephone });
                          }
                        }}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        Utiliser
                      </button>
                    </div>
                  )}
                </div>
                <div>
                  <label className="text-sm text-gray-600">Téléphone Client</label>
                  <input 
                    value={form.clientPhone} 
                    onChange={(e) => setForm({ ...form, clientPhone: e.target.value })} 
                    className="mt-1 w-full border rounded-lg px-3 py-2" 
                    placeholder="Ex: +228 90 12 34 56" 
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Conditions de paiement</label>
                  <select className="mt-1 w-full border rounded-lg px-3 py-2" value={form.paymentTermsDays} onChange={(e) => setForm({ ...form, paymentTermsDays: Number(e.target.value) })}>
                    <option value={-1}>Voir détail ci après</option>
                    <option value={0}>À réception</option>
                    <option value={-2}>Fin de mois</option>
                    <option value={10}>10 jours</option>
                    <option value={30}>30 jours</option>
                    <option value={-3}>30 jours fin de mois</option>
                    <option value={45}>45 jours</option>
                    <option value={-4}>45 jours fin de mois</option>
                    <option value={60}>60 jours</option>
                    <option value={-5}>60 jours fin de mois</option>
                    <option value={75}>75 jours</option>
                    <option value={-6}>75 jours fin de mois</option>
                    <option value={90}>90 jours</option>
                    <option value={-7}>90 jours fin de mois</option>
                    <option value={105}>105 jours</option>
                    <option value={-8}>105 jours fin de mois</option>
                    <option value={120}>120 jours</option>
                    <option value={-9}>120 jours fin de mois</option>
                  </select>
                </div>
              </div>

              {/* Nouvelle ligne pour Mode de paiement et Intérêts de retard */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="text-sm text-gray-600">Mode de paiement</label>
                  <select className="mt-1 w-full border rounded-lg px-3 py-2" value={form.paymentMethod} onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}>
                    <option value="Non spécifié">Non spécifié</option>
                    <option value="Espèces">Espèces</option>
                    <option value="Chèque">Chèque</option>
                    <option value="Virement bancaire">Virement bancaire</option>
                    <option value="Carte bancaire">Carte bancaire</option>
                    <option value="PayPal">PayPal</option>
                    <option value="Prélèvement">Prélèvement</option>
                    <option value="Lettre de change">Lettre de change</option>
                    <option value="Lettre de change relevé">Lettre de change relevé</option>
                    <option value="Lettre de change sans acceptation">Lettre de change sans acceptation</option>
                    <option value="Billet à ordre">Billet à ordre</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Intérêts de retard</label>
                  <select className="mt-1 w-full border rounded-lg px-3 py-2" value={form.latePaymentInterest} onChange={(e) => setForm({ ...form, latePaymentInterest: e.target.value })}>
                    <option value="Taux d'intérêts légal en vigueur">Taux d'intérêts légal en vigueur</option>
                    <option value="Pas d'intérêts de retard">Pas d'intérêts de retard</option>
                    <option value="1% par mois">1% par mois</option>
                    <option value="1,5% par mois">1,5% par mois</option>
                    <option value="2% par mois">2% par mois</option>
                    <option value="A préciser">A préciser</option>
                  </select>
                </div>
              </div>

              {/* Lignes d'articles */}
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">Articles</h4>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => setForm({ ...form, items: [...form.items, { description: '', quantity: 1, unitPrice: 0, receivedQuantity: 0 }] })} 
                      className="px-3 py-1 text-sm rounded-lg bg-gray-600 text-white hover:bg-gray-700"
                    >
                      Ajouter ligne
                    </button>
                    <button 
                      onClick={() => {
                        setForm({ ...form, items: [...form.items, { description: '', quantity: 1, unitPrice: 0, receivedQuantity: 0 }] });
                        openArticleSelector(form.items.length);
                      }} 
                      className="px-3 py-1 text-sm rounded-lg bg-brand-blue text-white hover:bg-blue-700"
                    >
                      Choisir article
                    </button>
                  </div>
                </div>
                {newDocType === 'delivery' && (
                  <div className="grid grid-cols-12 gap-2 text-xs text-gray-600 mb-1 px-1">
                    <div className="col-span-6">Article</div>
                    <div className="col-span-2 text-center">Qte reçu</div>
                    <div className="col-span-2 text-center">Qte cmde</div>
                    <div className="col-span-2 text-right">PU (FCFA)</div>
                  </div>
                )}
                <div className="space-y-2">
                  {form.items.map((it, idx) => (
                    <div key={idx} className="grid grid-cols-12 gap-2 relative">
                      <div className="col-span-6 relative">
                        <div className="flex">
                          <input 
                            className="flex-1 border rounded-l-lg px-3 py-2" 
                            placeholder={newDocType === 'delivery' ? `Article #${idx+1}` : `Désignation #${idx+1}`} 
                            value={it.description} 
                            onChange={(e) => {
                          const items = [...form.items];
                          items[idx].description = e.target.value;
                          setForm({ ...form, items });
                              setCurrentItemIndex(idx);
                              setShowArticleSuggestions(e.target.value.length > 0);
                            }}
                            onFocus={() => {
                              setCurrentItemIndex(idx);
                              setShowArticleSuggestions(true);
                            }}
                            onBlur={() => setTimeout(() => setShowArticleSuggestions(false), 200)}
                          />
                          <button
                            type="button"
                            onClick={() => openArticleSelector(idx)}
                            className="px-3 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition-colors"
                            title="Choisir depuis le répertoire"
                          >
                            📦
                          </button>
                        </div>
                        {showArticleSuggestions && currentItemIndex === idx && existingArticles.length > 0 && (
                          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                            {existingArticles
                              .filter(article => article.toLowerCase().includes(it.description.toLowerCase()))
                              .map((article, articleIndex) => (
                                <div
                                  key={articleIndex}
                                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                                  onClick={() => {
                                    const items = [...form.items];
                                    items[idx].description = article;
                                    // Renseigner le prix unitaire si l'article existe dans le répertoire global
                                    const fromDir = (articlesDirectory as any[]).find(a => a.name === article);
                                    if (fromDir && typeof fromDir.unitPrice === 'number') {
                                      items[idx].unitPrice = fromDir.unitPrice;
                                    }
                                    setForm({ ...form, items });
                                    setShowArticleSuggestions(false);
                                  }}
                                >
                                  {article}
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                      <input type="number" min={1} className="col-span-2 border rounded-lg px-3 py-2" placeholder={newDocType === 'delivery' ? 'Qte reçu' : 'Qté'} value={it.quantity} onChange={(e) => {
                        const items = [...form.items];
                        items[idx].quantity = Number(e.target.value);
                        setForm({ ...form, items });
                      }} />
                      {newDocType === 'delivery' && (
                        <input
                          type="number"
                          min={0}
                          className="col-span-2 border rounded-lg px-3 py-2"
                          placeholder="Qte cmde"
                          value={(it as any).receivedQuantity ?? 0}
                          onChange={(e) => {
                            const items = [...form.items];
                            (items[idx] as any).receivedQuantity = Number(e.target.value);
                            setForm({ ...form, items });
                          }}
                          title="Qte cmde (BL)"
                        />
                      )}
                      <input type="number" min={0} className={`${newDocType === 'delivery' ? 'col-span-1' : 'col-span-3'} border rounded-lg px-3 py-2`} placeholder="PU (FCFA)" value={it.unitPrice} onChange={(e) => {
                        const items = [...form.items];
                        items[idx].unitPrice = Number(e.target.value);
                        setForm({ ...form, items });
                      }} />
                      <button onClick={() => setForm({ ...form, items: form.items.filter((_, i) => i !== idx) })} className="col-span-1 text-red-600">×</button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Aperçu imprimable (A4) */}
              <div ref={printableRef} className="mt-6 bg-white border rounded-lg p-0">
                <div className="mx-auto" style={{ width: '794px' }}>
                  <InvoiceTemplate form={{ ...form, type: newDocType, autoGeneratedNumber }} design={selectedDesign} />
                </div>
              </div>
            </div>
            <div className="px-6 py-4 flex justify-between gap-2 items-center bg-gray-50">
              <button
                onClick={() => {
                  const totalHT = form.items.reduce((s, it) => s + it.quantity * it.unitPrice, 0);
                  if (!form.institution || totalHT <= 0) { alert('Renseignez l\'institution et au moins une ligne valide.'); return; }
                  const d = new Date(form.date); d.setDate(d.getDate() + (form.paymentTermsDays || 0));
                  const dueDate = d.toISOString().slice(0,10);
                  const saved = saveDocument({
                    type: newDocType,
                    date: form.date,
                    dueDate,
                    client: form.institution,
                    address: form.address,
                    city: form.city,
                    tva: form.tva,
                    items: form.items,
                    status: 'pending',
                    workflowStatus: newDocType === 'delivery' ? 'delivered' : 
                                   newDocType === 'proforma' ? 'draft' : 
                                   newDocType === 'invoice' ? 'completed' : 'draft',
                    sourceId: newDocType === 'delivery' ? (sourceForBL || undefined) : undefined,
                    paymentTermsDays: form.paymentTermsDays,
                    paymentMethod: form.paymentMethod,
                    latePaymentInterest: form.latePaymentInterest,
                    contractOrderReference: form.contractOrderReference,
                  });
                  logCreate('Facturation', `${getTypeText(newDocType)} ${saved.id}`, saved.id);
                  setShowNewModal(false);
                  setSourceForBL(null);
                  alert(`Document enregistré: ${saved.id}`);
                }}
                className="px-4 py-2 rounded-lg bg-sky-600 text-white hover:bg-sky-700"
              >
                Enregistrer
              </button>
              <button onClick={() => setShowNewModal(false)} className="px-4 py-2 rounded-lg border">Annuler</button>
              <button
                onClick={() => setShowDesignSelector(true)}
                className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 flex items-center mr-2"
              >
                <Palette className="w-4 h-4 mr-2" />
                Changer le design
              </button>
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 flex items-center mr-2"
              >
                <Eye className="w-4 h-4 mr-2" />
                {showPreview ? 'Masquer' : 'Aperçu'} design
              </button>
              <button
                onClick={() => setShowAdvancedPrint(true)}
                className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 flex items-center mr-2"
              >
                <Download className="w-4 h-4 mr-2" />
                Impression avancée
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sélecteur d'articles */}
      <ArticleSelector
        isOpen={showArticleSelector}
        onClose={() => {
          setShowArticleSelector(false);
          setCurrentItemIndex(null);
        }}
        onArticleSelect={handleArticleSelect}
        articles={articles || []}
        articleCategories={articleCategories || []}
      />

      {/* Modal Paiement */}
      {showPayModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden">
            <div className="px-6 py-4 bg-gradient-to-r from-green-400 to-emerald-500 text-white">
              <h3 className="text-lg font-semibold">Enregistrer un paiement</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="text-sm text-gray-600">Montant TTC dû: <span className="font-semibold text-gray-900">{showPayModal.ttc.toLocaleString('fr-FR')} FCFA</span></div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Date</label>
                <input type="date" value={payment.date} onChange={(e) => setPayment(p => ({ ...p, date: e.target.value }))} className="w-full border rounded-lg px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Montant (FCFA)</label>
                <input type="number" min={0} value={payment.amount} onChange={(e) => setPayment(p => ({ ...p, amount: Number(e.target.value) }))} className="w-full border rounded-lg px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Note</label>
                <input value={payment.note} onChange={(e) => setPayment(p => ({ ...p, note: e.target.value }))} className="w-full border rounded-lg px-3 py-2" placeholder="Référence, mode de paiement..." />
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 flex justify-end gap-2">
              <button className="px-4 py-2 rounded-lg border" onClick={() => setShowPayModal(null)}>Annuler</button>
              <button className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700" onClick={() => {
                if (payment.amount <= 0) { alert('Montant invalide'); return; }
                if (!showPayModal) return;
                addPayment(showPayModal.id, { ...payment });
                setShowPayModal(null);
              }}>Enregistrer</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de création de commande */}
      {showOrderModal && selectedQuote && (
        <OrderCreationModal
          isOpen={showOrderModal}
          onClose={() => {
            setShowOrderModal(false);
            setSelectedQuote(null);
          }}
          quote={selectedQuote}
          onCreateOrder={handleOrderCreated}
        />
      )}

      {/* Modal de visualisation du workflow */}
      {showWorkflowViewer && selectedWorkflowDocument && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-xl shadow-2xl overflow-hidden flex flex-col">
            <div className="px-6 py-4 bg-gradient-to-r from-purple-500 to-blue-600 text-white">
              <h3 className="text-lg font-semibold">Workflow du processus</h3>
              <p className="text-purple-100 text-sm">Suivi complet du processus de commande</p>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              {selectedWorkflowDocument && (
                <WorkflowManager
                  document={documents.find(d => d.id === selectedWorkflowDocument)!}
                  onWorkflowUpdate={() => {
                    // Rafraîchir la liste des documents
                    setShowWorkflowViewer(false);
                    setSelectedWorkflowDocument(null);
                  }}
                />
              )}
              <div className="mt-6">
                <DocumentWorkflowViewer
                  documents={getDocumentWorkflow(selectedWorkflowDocument)}
                  onViewDocument={(documentId) => {
                    // Ici on pourrait ouvrir un modal de détails du document
                    alert(`Voir le document ${documentId}`);
                  }}
                />
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 flex justify-end">
              <button
                onClick={() => {
                  setShowWorkflowViewer(false);
                  setSelectedWorkflowDocument(null);
                }}
                className="px-4 py-2 rounded-lg bg-gray-600 text-white hover:bg-gray-700"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Aperçu du design */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-6xl max-h-[90vh] rounded-xl shadow-2xl overflow-hidden flex flex-col">
            <div className="px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Aperçu du design - {selectedDesign}</h3>
                <button
                  onClick={() => setShowPreview(false)}
                  className="text-white/80 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto flex-1 bg-gray-50">
              <div ref={printableRef}>
                <InvoiceTemplate form={form} design={selectedDesign} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sélecteur de design */}
      {showDesignSelector && (
        <InvoiceDesignSelector
          selectedDesign={selectedDesign}
          onSelectDesign={(design) => {
            setSelectedDesign(design);
            setShowDesignSelector(false);
          }}
          onClose={() => setShowDesignSelector(false)}
        />
      )}

      {/* Modal d'impression avancée */}
      {showAdvancedPrint && (
        <AdvancedPrintModal
          isOpen={showAdvancedPrint}
          onClose={() => setShowAdvancedPrint(false)}
          elementRef={printableRef}
          documentTitle={`${newDocType}-${form.institution || 'Document'}`}
          documentType={newDocType === 'proforma' ? 'Facture Proforma' : 
                      newDocType === 'order' ? 'Commande' :
                      newDocType === 'delivery' ? 'Bon de Livraison' : 
                      newDocType === 'invoice' ? 'Facture' : 'Document'}
        />
      )}

      {/* Modal de sélection contrat/lettre de commande */}
      <ContractOrderSelectionModal
        isOpen={showContractOrderSelection}
        onClose={() => setShowContractOrderSelection(false)}
        onSelectContract={() => handleContractOrderSelection('contract')}
        onSelectOrder={() => handleContractOrderSelection('order')}
      />

      {/* Modal de formulaire contrat/lettre de commande */}
      <ContractOrderFormModal
        isOpen={showContractOrderForm}
        onClose={() => setShowContractOrderForm(false)}
        onSave={handleContractOrderSave}
        type={selectedContractOrderType}
      />

      {/* Modal de visualisation/édition des contrats et lettres de commande */}
      <ContractOrderViewModal
        isOpen={showContractOrderView}
        onClose={() => {
          setShowContractOrderView(false);
          setSelectedContractOrderForView(null);
        }}
        contractOrder={selectedContractOrderForView}
        onUpdate={(id, data) => {
          updateContractOrder(id, data);
          setShowContractOrderView(false);
          setSelectedContractOrderForView(null);
        }}
      />

      {/* Sélecteur de type de document */}
      <DocumentTypeSelector
        isOpen={showDocumentTypeSelector}
        onClose={() => setShowDocumentTypeSelector(false)}
        onSelect={(type) => {
          setShowDocumentTypeSelector(false);
          setNewDocType(type as any);
          setSourceForBL(null);
          setShowNewModal(true);
        }}
      />
    </div>
  );
};

export default InvoiceModule;