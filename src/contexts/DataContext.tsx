import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type DocumentType = 'proforma' | 'delivery' | 'invoice' | 'contract' | 'order';

export interface LineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  // Pour les BL: quantité réellement reçue (indépendante de la quantité commandée)
  receivedQuantity?: number;
}

export interface CustomerDocument {
  id: string; // human number e.g. FACTURE PROFORMA N°2025-0001
  type: DocumentType;
  reference: string; // raw numeric ref
  date: string; // ISO yyyy-mm-dd
  dueDate?: string; // ISO due date
  client: string;
  address?: string;
  city?: string;
  tva: number; // percent
  items: LineItem[];
  status: 'validated' | 'paid' | 'partial' | 'overdue' | 'pending';
  sourceId?: string; // link to contract/proforma for BL or invoice
  payments?: { date: string; amount: number; note?: string }[];
  paymentTermsDays?: number; // e.g., 15, 30, 0 (comptant)
  // Workflow intégré
  workflowStatus?: 'draft' | 'validated' | 'ordered' | 'delivered' | 'invoiced' | 'completed';
  parentDocumentId?: string; // Document parent dans le workflow
  childDocuments?: string[]; // Documents enfants créés
  orderNumber?: string; // Numéro de commande attribué
  contractTerms?: {
    deliveryDate?: string;
    warrantyPeriod?: string;
    specialConditions?: string;
    paymentSchedule?: { date: string; amount: number; description: string }[];
  };
  // Nouveau: Référence à la lettre de commande ou contrat
  contractOrderReference?: string; // LETTRE DE COMMANDE N° ou CONTRAT N°
}

export interface SupplierInvoice {
  id: string;
  invoiceNumber?: string;
  supplierName: string;
  nif?: string;
  date: string;
  ht: number;
  tva: number;
  ttc: number;
  status: 'paid' | 'partial' | 'unpaid';
}

export interface SupplierArticle {
  id: string;
  name: string;
  unitPrice: number;
  taxRate: number; // percent
}

export interface SupplierEntity {
  id: string;
  raisonSociale: string;
  nif: string;
  rccm?: string;
  adresse?: string;
  telephone?: string;
  email?: string;
  regimeFiscal?: string;
  produits?: string[]; // legacy
  articles?: SupplierArticle[];
  delaiPaiement?: string; // e.g., '30 jours'
  remise?: string; // e.g., '5%'
}

export interface Client {
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

export interface Discharge {
  id: string;
  prestataire: string;
  service: string;
  montant: number;
  dateCreation: string;
  datePrestation: string;
  lieu: string;
  statut: 'pending' | 'signed' | 'completed' | 'overdue';
  telephone: string;
  cni: string;
  signature?: string; // Base64 signature data
  signedBy?: string; // Nom de la personne qui a signé
  signedAt?: string; // Date de signature
}

export interface ContractOrder {
  id: string;
  documentType: 'contract' | 'order';
  documentNumber: string;
  date: string;
  authorizingReference: string;
  awardee: string;
  taxId: string;
  amount: number;
  amountInWords: string;
  warrantyPeriod: number;
  warrantyRetention: number;
  performanceGuarantee: string;
  bankAccount: string;
  bankName: string;
  budgetAllocation: string;
  depositAccount: string;
  depositAccountTitle: string;
  subject: string;
  lotDescription: string;
  executionPeriod: number;
  issuingAuthority: string;
  country: string;
  motto: string;
  dateCreation: string;
}

export interface ArticleCategory {
  id: string;
  name: string;
  description?: string;
  icon: string;
  color: string;
  parentId?: string; // Pour les sous-catégories
  dateCreation: string;
}

export interface ArticleLot {
  id: string;
  name: string;
  description?: string;
  color: string;
  icon: string;
  categoryId: string; // Référence vers ArticleCategory
  dateCreation: string;
}

export interface Article {
  id: string;
  name: string;
  description?: string;
  unitPrice?: number;
  lotId?: string;
  categoryId?: string; // Référence vers ArticleCategory
  sku?: string;
  supplier?: string;
  stock?: number;
  minStock?: number;
  maxStock?: number;
  unit?: string;
  weight?: number;
  dimensions?: string;
  notes?: string;
  // Nouveaux attributs pour la classification
  brand?: string;
  model?: string;
  material?: string;
  color?: string;
  size?: string;
  dateCreation: string;
  lastUpdated: string;
}

export interface DataState {
  documents: CustomerDocument[];
  suppliers: SupplierInvoice[]; // kept for backward compatibility
  suppliersList: SupplierEntity[];
  supplierInvoices: SupplierInvoice[];
  clients: Client[];
  discharges: Discharge[];
  contractOrders: ContractOrder[];
  // Répertoire d'articles global
  articlesDirectory: { id: string; name: string; description?: string; unitPrice?: number }[];
  // Nouveau système d'articles avec catégories hiérarchiques
  articleCategories: ArticleCategory[];
  articleLots: ArticleLot[];
  articles: Article[];
  saveDocument: (doc: Omit<CustomerDocument, 'id' | 'reference'>) => CustomerDocument;
  addPayment: (docId: string, payment: { date: string; amount: number; note?: string }) => void;
  addSupplier: (s: Omit<SupplierEntity, 'id'>) => SupplierEntity;
  updateSupplier: (id: string, s: Partial<SupplierEntity>) => void;
  deleteSupplier: (id: string) => void;
  addSupplierInvoice: (inv: Omit<SupplierInvoice, 'id'>) => SupplierInvoice;
  updateDocument: (id: string, partial: Partial<CustomerDocument>) => void;
  addSupplierArticle: (supplierId: string, article: Omit<SupplierArticle, 'id'>) => SupplierArticle;
  updateSupplierArticle: (supplierId: string, articleId: string, partial: Partial<SupplierArticle>) => void;
  deleteSupplierArticle: (supplierId: string, articleId: string) => void;
  // CRUD Répertoire d'articles
  addArticle: (article: { name: string; description?: string; unitPrice?: number }) => { id: string; name: string; description?: string; unitPrice?: number };
  updateArticle: (id: string, partial: { name?: string; description?: string; unitPrice?: number }) => void;
  deleteArticle: (id: string) => void;
  // CRUD Catégories d'articles
  addArticleCategory: (category: Omit<ArticleCategory, 'id' | 'dateCreation'>) => ArticleCategory;
  updateArticleCategory: (id: string, partial: Partial<Omit<ArticleCategory, 'id' | 'dateCreation'>>) => void;
  deleteArticleCategory: (id: string) => void;
  // CRUD Lots d'articles
  addArticleLot: (lot: Omit<ArticleLot, 'id' | 'dateCreation'>) => ArticleLot;
  updateArticleLot: (id: string, partial: Partial<Omit<ArticleLot, 'id' | 'dateCreation'>>) => void;
  deleteArticleLot: (id: string) => void;
  // CRUD Articles avancés
  addAdvancedArticle: (article: Omit<Article, 'id' | 'dateCreation' | 'lastUpdated'>) => Article;
  updateAdvancedArticle: (id: string, partial: Partial<Omit<Article, 'id' | 'dateCreation' | 'lastUpdated'>>) => void;
  deleteAdvancedArticle: (id: string) => void;
  // Gestion des clients
  addClient: (client: Omit<Client, 'id' | 'dateCreation' | 'totalFacture' | 'totalEncaissement' | 'soldeImpaye' | 'nombreFactures'>) => Client;
  updateClient: (id: string, client: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  addDischarge: (discharge: Omit<Discharge, 'id' | 'dateCreation'>) => Discharge;
  updateDischarge: (id: string, discharge: Partial<Discharge>) => void;
  deleteDischarge: (id: string) => void;
  // Gestion des contrats et lettres de commande
  addContractOrder: (contractOrder: Omit<ContractOrder, 'id' | 'dateCreation'>) => ContractOrder;
  updateContractOrder: (id: string, contractOrder: Partial<ContractOrder>) => void;
  deleteContractOrder: (id: string) => void;
  // Workflow intégré
  validateQuote: (quoteId: string) => CustomerDocument;
  createOrderFromQuote: (quoteId: string, orderNumber: string, contractTerms?: CustomerDocument['contractTerms']) => CustomerDocument;
  createDeliveryFromOrder: (orderId: string) => CustomerDocument;
  createInvoiceFromDelivery: (deliveryId: string) => CustomerDocument;
  getDocumentWorkflow: (documentId: string) => CustomerDocument[];
  updateDocumentWorkflow: (documentId: string, workflowStatus: CustomerDocument['workflowStatus']) => void;
}

const STORAGE_KEY = 'ediba.data.v1';

function formatNumberNew(type: DocumentType, year: number, seq: number) {
  // Format attendu:
  // - Année sur 2 chiffres
  // - Séquence sur 5 chiffres
  // - Préfixes: proforma -> D, delivery -> BL, order -> CMD, invoice -> F
  const yearSuffix = String(year).slice(-2);
  const prefix = type === 'proforma' ? 'D' :
                 type === 'delivery' ? 'BL' :
                 type === 'order' ? 'CMD' :
                 type === 'invoice' ? 'F' : 'DOC';
  return `N°${prefix}${yearSuffix}${String(seq).padStart(5, '0')}`;
}

function nextSequence(existing: CustomerDocument[], type: DocumentType, year: number) {
  const docsSameYearType = existing.filter(d => d.type === type && d.date.startsWith(String(year)));
  const seqs = docsSameYearType.map(d => parseInt(d.reference.split('-').pop() || '0', 10)).filter(n => !isNaN(n));
  const max = seqs.length ? Math.max(...seqs) : 0;
  return max + 1;
}

interface DataContextValue extends DataState {}

const DataContext = createContext<DataContextValue | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<DataState>({
    documents: [],
    suppliers: [],
    suppliersList: [],
    supplierInvoices: [],
    clients: [],
    discharges: [],
    contractOrders: [],
    articlesDirectory: [],
    articleCategories: [],
    articleLots: [],
    articles: [],
    saveDocument: () => { console.warn('saveDocument not implemented'); return {} as any; },
    addPayment: () => { console.warn('addPayment not implemented'); },
    addSupplier: () => { console.warn('addSupplier not implemented'); return {} as any; },
    updateSupplier: () => { console.warn('updateSupplier not implemented'); },
    deleteSupplier: () => { console.warn('deleteSupplier not implemented'); },
    addSupplierInvoice: () => { console.warn('addSupplierInvoice not implemented'); return {} as any; },
    updateDocument: () => { console.warn('updateDocument not implemented'); },
    addSupplierArticle: () => { console.warn('addSupplierArticle not implemented'); return {} as any; },
    updateSupplierArticle: () => { console.warn('updateSupplierArticle not implemented'); },
    deleteSupplierArticle: () => { console.warn('deleteSupplierArticle not implemented'); },
    addArticle: () => { console.warn('addArticle not implemented'); return {} as any; },
    updateArticle: () => { console.warn('updateArticle not implemented'); },
    deleteArticle: () => { console.warn('deleteArticle not implemented'); },
    addArticleCategory: () => { console.warn('addArticleCategory not implemented'); return {} as any; },
    updateArticleCategory: () => { console.warn('updateArticleCategory not implemented'); },
    deleteArticleCategory: () => { console.warn('deleteArticleCategory not implemented'); },
    addArticleLot: () => { console.warn('addArticleLot not implemented'); return {} as any; },
    updateArticleLot: () => { console.warn('updateArticleLot not implemented'); },
    deleteArticleLot: () => { console.warn('deleteArticleLot not implemented'); },
    addAdvancedArticle: () => { console.warn('addAdvancedArticle not implemented'); return {} as any; },
    updateAdvancedArticle: () => { console.warn('updateAdvancedArticle not implemented'); },
    deleteAdvancedArticle: () => { console.warn('deleteAdvancedArticle not implemented'); },
    addClient: () => { console.warn('addClient not implemented'); return {} as any; },
    updateClient: () => { console.warn('updateClient not implemented'); },
    deleteClient: () => { console.warn('deleteClient not implemented'); },
    addDischarge: () => { console.warn('addDischarge not implemented'); return {} as any; },
    updateDischarge: () => { console.warn('updateDischarge not implemented'); },
    deleteDischarge: () => { console.warn('deleteDischarge not implemented'); },
    addContractOrder: () => { console.warn('addContractOrder not implemented'); return {} as any; },
    updateContractOrder: () => { console.warn('updateContractOrder not implemented'); },
    deleteContractOrder: () => { console.warn('deleteContractOrder not implemented'); },
    validateQuote: () => { console.warn('validateQuote not implemented'); return {} as any; },
    createOrderFromQuote: () => { console.warn('createOrderFromQuote not implemented'); return {} as any; },
    createDeliveryFromOrder: () => { console.warn('createDeliveryFromOrder not implemented'); return {} as any; },
    createInvoiceFromDelivery: () => { console.warn('createInvoiceFromDelivery not implemented'); return {} as any; },
    getDocumentWorkflow: () => { console.warn('getDocumentWorkflow not implemented'); return []; },
    updateDocumentWorkflow: () => { console.warn('updateDocumentWorkflow not implemented'); },
  });

  // Sauvegarder les données dans localStorage
  useEffect(() => {
    const toStore = {
      documents: state.documents,
      suppliersList: state.suppliersList,
      supplierInvoices: state.supplierInvoices,
      clients: state.clients,
      discharges: state.discharges,
      contractOrders: state.contractOrders,
      articlesDirectory: state.articlesDirectory,
      articleCategories: state.articleCategories,
      articleLots: state.articleLots,
      articles: state.articles
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
  }, [state.documents, state.suppliersList, state.supplierInvoices, state.clients, state.discharges, state.contractOrders, state.articlesDirectory, state.articleCategories, state.articleLots, state.articles]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      
      // Fournisseurs fréquents par défaut
      const frequentSuppliers = [
        { raisonSociale: 'Ste L WATT', nif: 'NIF-LW-001', rccm: 'RCCM-LW-001', adresse: 'Lomé', telephone: '+228 22 21 20 01', email: 'contact@lwatt.tg', regimeFiscal: 'Réel Normal', produits: ['Matériel électrique'] },
        { raisonSociale: 'CCT-BATIMENT', nif: 'NIF-CCT-001', rccm: 'RCCM-CCT-001', adresse: 'Lomé', telephone: '+228 22 21 20 02', email: 'contact@cct-batiment.tg', regimeFiscal: 'Réel Normal', produits: ['Matériaux de construction'] },
        { raisonSociale: 'LUMCHRIST-AMOFIA SARL', nif: 'NIF-LA-001', rccm: 'RCCM-LA-001', adresse: 'Lomé', telephone: '+228 22 21 20 03', email: 'contact@lumchrist.tg', regimeFiscal: 'Réel Normal', produits: ['Éclairage'] },
        { raisonSociale: 'CHINA MALL', nif: 'NIF-CM-001', rccm: 'RCCM-CM-001', adresse: 'Lomé', telephone: '+228 22 21 20 04', email: 'contact@chinamall.tg', regimeFiscal: 'Réel Normal', produits: ['Divers'] },
        { raisonSociale: 'Galerie Confortium', nif: 'NIF-GC-001', rccm: 'RCCM-GC-001', adresse: 'Lomé', telephone: '+228 22 21 20 05', email: 'contact@confortium.tg', regimeFiscal: 'Réel Normal', produits: ['Mobilier'] },
        { raisonSociale: 'Ets AMERICAIN', nif: 'NIF-EA-001', rccm: 'RCCM-EA-001', adresse: 'Lomé', telephone: '+228 22 21 20 06', email: 'contact@americain.tg', regimeFiscal: 'Réel Normal', produits: ['Divers'] },
        { raisonSociale: 'DONSEN-ALU', nif: 'NIF-DA-001', rccm: 'RCCM-DA-001', adresse: 'Lomé', telephone: '+228 22 21 20 07', email: 'contact@donsen-alu.tg', regimeFiscal: 'Réel Normal', produits: ['Aluminium'] },
        { raisonSociale: 'SOCIETE SOTIMEX SARL', nif: 'NIF-SS-001', rccm: 'RCCM-SS-001', adresse: 'Lomé', telephone: '+228 22 21 20 08', email: 'contact@sotimex.tg', regimeFiscal: 'Réel Normal', produits: ['Import-Export'] },
        { raisonSociale: 'CHAMPION', nif: 'NIF-CH-001', rccm: 'RCCM-CH-001', adresse: 'Lomé', telephone: '+228 22 21 20 09', email: 'contact@champion.tg', regimeFiscal: 'Réel Normal', produits: ['Divers'] },
        { raisonSociale: 'Ste Papeterie Centrale', nif: 'NIF-SPC-001', rccm: 'RCCM-SPC-001', adresse: 'Lomé', telephone: '+228 22 21 20 10', email: 'contact@papeterie.tg', regimeFiscal: 'Réel Normal', produits: ['Papeterie'] },
        { raisonSociale: 'LIGHT CONSEILS SARL U', nif: 'NIF-LC-001', rccm: 'RCCM-LC-001', adresse: 'Lomé', telephone: '+228 22 21 20 11', email: 'contact@lightconseils.tg', regimeFiscal: 'Réel Normal', produits: ['Conseils'] },
        { raisonSociale: 'ATLAS Services', nif: 'NIF-AS-001', rccm: 'RCCM-AS-001', adresse: 'Lomé', telephone: '+228 22 21 20 12', email: 'contact@atlas.tg', regimeFiscal: 'Réel Normal', produits: ['Services'] },
        { raisonSociale: 'Kilimandjaro Services', nif: 'NIF-KS-001', rccm: 'RCCM-KS-001', adresse: 'Lomé', telephone: '+228 22 21 20 13', email: 'contact@kilimandjaro.tg', regimeFiscal: 'Réel Normal', produits: ['Services'] },
        { raisonSociale: 'ORCA SARL', nif: 'NIF-OR-001', rccm: 'RCCM-OR-001', adresse: 'Lomé', telephone: '+228 22 21 20 14', email: 'contact@orca.tg', regimeFiscal: 'Réel Normal', produits: ['Divers'] },
        { raisonSociale: 'ZIP Auto', nif: 'NIF-ZA-001', rccm: 'RCCM-ZA-001', adresse: 'Lomé', telephone: '+228 22 21 20 15', email: 'contact@zipauto.tg', regimeFiscal: 'Réel Normal', produits: ['Automobile'] },
        { raisonSociale: 'Vlisco African Company To', nif: 'NIF-VA-001', rccm: 'RCCM-VA-001', adresse: 'Lomé', telephone: '+228 22 21 20 16', email: 'contact@vlisco.tg', regimeFiscal: 'Réel Normal', produits: ['Textile'] },
        { raisonSociale: 'SGIT', nif: 'NIF-SG-001', rccm: 'RCCM-SG-001', adresse: 'Lomé', telephone: '+228 22 21 20 17', email: 'contact@sgit.tg', regimeFiscal: 'Réel Normal', produits: ['Technologie'] },
        { raisonSociale: 'Ste Plural Sarl u', nif: 'NIF-SP-001', rccm: 'RCCM-SP-001', adresse: 'Lomé', telephone: '+228 22 21 20 18', email: 'contact@plural.tg', regimeFiscal: 'Réel Normal', produits: ['Divers'] },
        { raisonSociale: 'SPCG PRO BURO', nif: 'NIF-SB-001', rccm: 'RCCM-SB-001', adresse: 'Lomé', telephone: '+228 22 21 20 19', email: 'contact@spcg.tg', regimeFiscal: 'Réel Normal', produits: ['Bureau'] },
        { raisonSociale: 'TECHNO', nif: 'NIF-TE-001', rccm: 'RCCM-TE-001', adresse: 'Lomé', telephone: '+228 22 21 20 20', email: 'contact@techno.tg', regimeFiscal: 'Réel Normal', produits: ['Technologie'] },
        { raisonSociale: 'CO-TO AUTO SA', nif: 'NIF-CA-001', rccm: 'RCCM-CA-001', adresse: 'Lomé', telephone: '+228 22 21 20 21', email: 'contact@coto.tg', regimeFiscal: 'Réel Normal', produits: ['Automobile'] }
      ];
      
      // Clients par défaut
      const defaultClients: Client[] = [
        {
          id: 'CLI-001',
          raisonSociale: 'Assemblée Nationale',
          nomCommercial: 'AN',
          nif: 'NIF-AN-001',
          rccm: 'RCCM-AN-001',
          adresse: 'Boulevard du Mono, Lomé',
          ville: 'Lomé',
          telephone: '90 00 76 70 / 90 36 03 96',
          email: 'contact@assemblee-nationale.tg',
          contactPrincipal: 'Secrétaire Général',
          secteurActivite: 'Institution Publique',
          regimeFiscal: 'Réel Normal' as const,
          delaiPaiement: 30,
          remise: 0,
          limiteCredit: 0,
          statut: 'actif' as const,
          dateCreation: new Date().toISOString().slice(0, 10),
          totalFacture: 0,
          totalEncaissement: 0,
          soldeImpaye: 0,
          nombreFactures: 0
        },
        {
          id: 'CLI-002',
          raisonSociale: 'Togo Cellulaire',
          nomCommercial: 'Togocel',
          nif: 'NIF-TC-002',
          rccm: 'RCCM-TC-002',
          adresse: 'Lomé, Togo',
          ville: 'Lomé',
          telephone: '90 01 96 01 / 70 45 00 33',
          email: 'contact@togocel.tg',
          contactPrincipal: 'Direction',
          secteurActivite: 'Télécommunications',
          regimeFiscal: 'Réel Normal' as const,
          delaiPaiement: 30,
          remise: 0,
          limiteCredit: 0,
          statut: 'actif' as const,
          dateCreation: new Date().toISOString().slice(0, 10),
          totalFacture: 0,
          totalEncaissement: 0,
          soldeImpaye: 0,
          nombreFactures: 0
        },
        {
          id: 'CLI-003',
          raisonSociale: 'Ministère de l\'Administration Territoriale',
          nomCommercial: 'MAT',
          nif: 'NIF-MAT-003',
          rccm: 'RCCM-MAT-003',
          adresse: 'Lomé, Togo',
          ville: 'Lomé',
          telephone: '—',
          email: 'contact@mat.tg',
          contactPrincipal: 'Ministre',
          secteurActivite: 'Institution Publique',
          regimeFiscal: 'Réel Normal' as const,
          delaiPaiement: 30,
          remise: 0,
          limiteCredit: 0,
          statut: 'actif' as const,
          dateCreation: new Date().toISOString().slice(0, 10),
          totalFacture: 0,
          totalEncaissement: 0,
          soldeImpaye: 0,
          nombreFactures: 0
        },
        {
          id: 'CLI-004',
          raisonSociale: 'CMA CGM',
          nomCommercial: 'CMA CGM',
          nif: 'NIF-CMA-004',
          rccm: 'RCCM-CMA-004',
          adresse: 'Port de Lomé, Togo',
          ville: 'Lomé',
          telephone: '—',
          email: 'contact@cmacgm.com',
          contactPrincipal: 'Direction',
          secteurActivite: 'Transport Maritime',
          regimeFiscal: 'Réel Normal' as const,
          delaiPaiement: 30,
          remise: 0,
          limiteCredit: 0,
          statut: 'actif' as const,
          dateCreation: new Date().toISOString().slice(0, 10),
          totalFacture: 0,
          totalEncaissement: 0,
          soldeImpaye: 0,
          nombreFactures: 0
        },
        {
          id: 'CLI-005',
          raisonSociale: 'DRI-UL',
          nomCommercial: 'DRI-UL',
          nif: 'NIF-DRI-005',
          rccm: 'RCCM-DRI-005',
          adresse: 'Université de Lomé, Togo',
          ville: 'Lomé',
          telephone: '90 24 24 75',
          email: 'contact@dri-ul.tg',
          contactPrincipal: 'Direction',
          secteurActivite: 'Éducation',
          regimeFiscal: 'Réel Normal' as const,
          delaiPaiement: 30,
          remise: 0,
          limiteCredit: 0,
          statut: 'actif' as const,
          dateCreation: new Date().toISOString().slice(0, 10),
          totalFacture: 0,
          totalEncaissement: 0,
          soldeImpaye: 0,
          nombreFactures: 0
        },
        {
          id: 'CLI-006',
          raisonSociale: 'SOS Village d\'Enfants',
          nomCommercial: 'SOS Village',
          nif: 'NIF-SOS-006',
          rccm: 'RCCM-SOS-006',
          adresse: 'Lomé, Togo',
          ville: 'Lomé',
          telephone: '91 71 21 24',
          email: 'contact@sos-village.tg',
          contactPrincipal: 'Direction',
          secteurActivite: 'ONG',
          regimeFiscal: 'Réel Normal' as const,
          delaiPaiement: 30,
          remise: 0,
          limiteCredit: 0,
          statut: 'actif' as const,
          dateCreation: new Date().toISOString().slice(0, 10),
          totalFacture: 0,
          totalEncaissement: 0,
          soldeImpaye: 0,
          nombreFactures: 0
        },
        {
          id: 'CLI-007',
          raisonSociale: 'Ministère des Armées',
          nomCommercial: 'MINARM',
          nif: 'NIF-MINARM-007',
          rccm: 'RCCM-MINARM-007',
          adresse: 'Lomé, Togo',
          ville: 'Lomé',
          telephone: '—',
          email: 'contact@minarm.tg',
          contactPrincipal: 'Ministre',
          secteurActivite: 'Institution Publique',
          regimeFiscal: 'Réel Normal' as const,
          delaiPaiement: 30,
          remise: 0,
          limiteCredit: 0,
          statut: 'actif' as const,
          dateCreation: new Date().toISOString().slice(0, 10),
          totalFacture: 0,
          totalEncaissement: 0,
          soldeImpaye: 0,
          nombreFactures: 0
        },
        {
          id: 'CLI-008',
          raisonSociale: 'HAPLUCIA',
          nomCommercial: 'HAPLUCIA',
          nif: 'NIF-HAP-008',
          rccm: 'RCCM-HAP-008',
          adresse: 'Lomé, Togo',
          ville: 'Lomé',
          telephone: '90 70 75 04',
          email: 'contact@haplucia.tg',
          contactPrincipal: 'Direction',
          secteurActivite: 'Entreprise Privée',
          regimeFiscal: 'Réel Normal' as const,
          delaiPaiement: 30,
          remise: 0,
          limiteCredit: 0,
          statut: 'actif' as const,
          dateCreation: new Date().toISOString().slice(0, 10),
          totalFacture: 0,
          totalEncaissement: 0,
          soldeImpaye: 0,
          nombreFactures: 0
        },
        {
          id: 'CLI-009',
          raisonSociale: 'SNPT',
          nomCommercial: 'SNPT',
          nif: 'NIF-SNPT-009',
          rccm: 'RCCM-SNPT-009',
          adresse: 'Lomé, Togo',
          ville: 'Lomé',
          telephone: '—',
          email: 'contact@snpt.tg',
          contactPrincipal: 'Direction',
          secteurActivite: 'Transport',
          regimeFiscal: 'Réel Normal' as const,
          delaiPaiement: 30,
          remise: 0,
          limiteCredit: 0,
          statut: 'actif' as const,
          dateCreation: new Date().toISOString().slice(0, 10),
          totalFacture: 0,
          totalEncaissement: 0,
          soldeImpaye: 0,
          nombreFactures: 0
        },
        {
          id: 'CLI-010',
          raisonSociale: 'Sénat du Togo',
          nomCommercial: 'Sénat',
          nif: 'NIF-SENAT-010',
          rccm: 'RCCM-SENAT-010',
          adresse: 'Lomé, Togo',
          ville: 'Lomé',
          telephone: '—',
          email: 'contact@senat.tg',
          contactPrincipal: 'Président',
          secteurActivite: 'Institution Publique',
          regimeFiscal: 'Réel Normal' as const,
          delaiPaiement: 30,
          remise: 0,
          limiteCredit: 0,
          statut: 'actif' as const,
          dateCreation: new Date().toISOString().slice(0, 10),
          totalFacture: 0,
          totalEncaissement: 0,
          soldeImpaye: 0,
          nombreFactures: 0
        },
        {
          id: 'CLI-011',
          raisonSociale: 'GIZ',
          nomCommercial: 'GIZ',
          nif: 'NIF-GIZ-011',
          rccm: 'RCCM-GIZ-011',
          adresse: 'Lomé, Togo',
          ville: 'Lomé',
          telephone: '—',
          email: 'contact@giz.de',
          contactPrincipal: 'Direction',
          secteurActivite: 'Coopération Internationale',
          regimeFiscal: 'Réel Normal' as const,
          delaiPaiement: 30,
          remise: 0,
          limiteCredit: 0,
          statut: 'actif' as const,
          dateCreation: new Date().toISOString().slice(0, 10),
          totalFacture: 0,
          totalEncaissement: 0,
          soldeImpaye: 0,
          nombreFactures: 0
        },
        {
          id: 'CLI-012',
          raisonSociale: 'Ministère du Désenclavement et des Pistes Rurales',
          nomCommercial: 'MDPR',
          nif: 'NIF-MDPR-012',
          rccm: 'RCCM-MDPR-012',
          adresse: 'Lomé, Togo',
          ville: 'Lomé',
          telephone: '—',
          email: 'contact@mdpr.tg',
          contactPrincipal: 'Ministre',
          secteurActivite: 'Institution Publique',
          regimeFiscal: 'Réel Normal' as const,
          delaiPaiement: 30,
          remise: 0,
          limiteCredit: 0,
          statut: 'actif' as const,
          dateCreation: new Date().toISOString().slice(0, 10),
          totalFacture: 0,
          totalEncaissement: 0,
          soldeImpaye: 0,
          nombreFactures: 0
        },
        {
          id: 'CLI-013',
          raisonSociale: 'HAUQUE',
          nomCommercial: 'HAUQUE',
          nif: 'NIF-HAUQUE-013',
          rccm: 'RCCM-HAUQUE-013',
          adresse: 'Lomé, Togo',
          ville: 'Lomé',
          telephone: '90 34 49 70',
          email: 'contact@hauque.tg',
          contactPrincipal: 'Direction',
          secteurActivite: 'Entreprise Privée',
          regimeFiscal: 'Réel Normal' as const,
          delaiPaiement: 30,
          remise: 0,
          limiteCredit: 0,
          statut: 'actif' as const,
          dateCreation: new Date().toISOString().slice(0, 10),
          totalFacture: 0,
          totalEncaissement: 0,
          soldeImpaye: 0,
          nombreFactures: 0
        },
        {
          id: 'CLI-014',
          raisonSociale: 'Ministère de l\'Agriculture, de l\'Élevage et du Développement Rural (MAEDR)',
          nomCommercial: 'MAEDR',
          nif: 'NIF-MAEDR-014',
          rccm: 'RCCM-MAEDR-014',
          adresse: 'Lomé, Togo',
          ville: 'Lomé',
          telephone: '—',
          email: 'contact@maedr.tg',
          contactPrincipal: 'Ministre',
          secteurActivite: 'Institution Publique',
          regimeFiscal: 'Réel Normal' as const,
          delaiPaiement: 30,
          remise: 0,
          limiteCredit: 0,
          statut: 'actif' as const,
          dateCreation: new Date().toISOString().slice(0, 10),
          totalFacture: 0,
          totalEncaissement: 0,
          soldeImpaye: 0,
          nombreFactures: 0
        },
        {
          id: 'CLI-015',
          raisonSociale: 'Ministère de l\'Hydraulique Villageoise et du Développement Rural (MAHVDR)',
          nomCommercial: 'MAHVDR',
          nif: 'NIF-MAHVDR-015',
          rccm: 'RCCM-MAHVDR-015',
          adresse: 'Lomé, Togo',
          ville: 'Lomé',
          telephone: '—',
          email: 'contact@mahvdr.tg',
          contactPrincipal: 'Ministre',
          secteurActivite: 'Institution Publique',
          regimeFiscal: 'Réel Normal' as const,
          delaiPaiement: 30,
          remise: 0,
          limiteCredit: 0,
          statut: 'actif' as const,
          dateCreation: new Date().toISOString().slice(0, 10),
          totalFacture: 0,
          totalEncaissement: 0,
          soldeImpaye: 0,
          nombreFactures: 0
        },
        {
          id: 'CLI-016',
          raisonSociale: 'Ministère de la Justice',
          nomCommercial: 'MINJUST',
          nif: 'NIF-MINJUST-016',
          rccm: 'RCCM-MINJUST-016',
          adresse: 'Lomé, Togo',
          ville: 'Lomé',
          telephone: '—',
          email: 'contact@minjust.tg',
          contactPrincipal: 'Ministre',
          secteurActivite: 'Institution Publique',
          regimeFiscal: 'Réel Normal' as const,
          delaiPaiement: 30,
          remise: 0,
          limiteCredit: 0,
          statut: 'actif' as const,
          dateCreation: new Date().toISOString().slice(0, 10),
          totalFacture: 0,
          totalEncaissement: 0,
          soldeImpaye: 0,
          nombreFactures: 0
        },
        {
          id: 'CLI-017',
          raisonSociale: 'Ministère de la Santé',
          nomCommercial: 'MINSANTE',
          nif: 'NIF-MINSANTE-017',
          rccm: 'RCCM-MINSANTE-017',
          adresse: 'Lomé, Togo',
          ville: 'Lomé',
          telephone: '—',
          email: 'contact@minsante.tg',
          contactPrincipal: 'Ministre',
          secteurActivite: 'Institution Publique',
          regimeFiscal: 'Réel Normal' as const,
          delaiPaiement: 30,
          remise: 0,
          limiteCredit: 0,
          statut: 'actif' as const,
          dateCreation: new Date().toISOString().slice(0, 10),
          totalFacture: 0,
          totalEncaissement: 0,
          soldeImpaye: 0,
          nombreFactures: 0
        },
        {
          id: 'CLI-018',
          raisonSociale: 'Ariana Maintenance',
          nomCommercial: 'Ariana Maintenance',
          nif: 'NIF-ARIANA-018',
          rccm: 'RCCM-ARIANA-018',
          adresse: 'Lomé, Togo',
          ville: 'Lomé',
          telephone: '—',
          email: 'contact@ariana.tg',
          contactPrincipal: 'Direction',
          secteurActivite: 'Maintenance',
          regimeFiscal: 'Réel Normal' as const,
          delaiPaiement: 30,
          remise: 0,
          limiteCredit: 0,
          statut: 'actif' as const,
          dateCreation: new Date().toISOString().slice(0, 10),
          totalFacture: 0,
          totalEncaissement: 0,
          soldeImpaye: 0,
          nombreFactures: 0
        },
        {
          id: 'CLI-019',
          raisonSociale: 'Agence de Transformation Agricole (ATA)',
          nomCommercial: 'ATA',
          nif: 'NIF-ATA-019',
          rccm: 'RCCM-ATA-019',
          adresse: 'Lomé, Togo',
          ville: 'Lomé',
          telephone: '92 44 86 99 / 70 90 34 21',
          email: 'contact@ata.tg',
          contactPrincipal: 'Direction',
          secteurActivite: 'Agriculture',
          regimeFiscal: 'Réel Normal' as const,
          delaiPaiement: 30,
          remise: 0,
          limiteCredit: 0,
          statut: 'actif' as const,
          dateCreation: new Date().toISOString().slice(0, 10),
          totalFacture: 0,
          totalEncaissement: 0,
          soldeImpaye: 0,
          nombreFactures: 0
        },
        {
          id: 'CLI-020',
          raisonSociale: 'CEB (Communauté Électrique du Bénin)',
          nomCommercial: 'CEB',
          nif: 'NIF-CEB-020',
          rccm: 'RCCM-CEB-020',
          adresse: 'Lomé, Togo',
          ville: 'Lomé',
          telephone: '—',
          email: 'approvisionnement@cebnet.org / ywade@cebnet.org',
          contactPrincipal: 'Direction',
          secteurActivite: 'Énergie',
          regimeFiscal: 'Réel Normal' as const,
          delaiPaiement: 30,
          remise: 0,
          limiteCredit: 0,
          statut: 'actif' as const,
          dateCreation: new Date().toISOString().slice(0, 10),
          totalFacture: 0,
          totalEncaissement: 0,
          soldeImpaye: 0,
          nombreFactures: 0
        },
        {
          id: 'CLI-021',
          raisonSociale: 'ETS Kombaté',
          nomCommercial: 'ETS Kombaté',
          nif: 'NIF-KOMBATE-021',
          rccm: 'RCCM-KOMBATE-021',
          adresse: 'Lomé, Togo',
          ville: 'Lomé',
          telephone: '90 10 58 47',
          email: 'contact@kombate.tg',
          contactPrincipal: 'Direction',
          secteurActivite: 'Entreprise Privée',
          regimeFiscal: 'Réel Normal' as const,
          delaiPaiement: 30,
          remise: 0,
          limiteCredit: 0,
          statut: 'actif' as const,
          dateCreation: new Date().toISOString().slice(0, 10),
          totalFacture: 0,
          totalEncaissement: 0,
          soldeImpaye: 0,
          nombreFactures: 0
        },
        {
          id: 'CLI-022',
          raisonSociale: 'Plan Togo',
          nomCommercial: 'Plan Togo',
          nif: 'NIF-PLAN-022',
          rccm: 'RCCM-PLAN-022',
          adresse: 'Lomé, Togo',
          ville: 'Lomé',
          telephone: '91 90 01 11',
          email: 'contact@plan-togo.org',
          contactPrincipal: 'Direction',
          secteurActivite: 'ONG',
          regimeFiscal: 'Réel Normal' as const,
          delaiPaiement: 30,
          remise: 0,
          limiteCredit: 0,
          statut: 'actif' as const,
          dateCreation: new Date().toISOString().slice(0, 10),
          totalFacture: 0,
          totalEncaissement: 0,
          soldeImpaye: 0,
          nombreFactures: 0
        },
        {
          id: 'CLI-023',
          raisonSociale: 'ONG Espoir',
          nomCommercial: 'ONG Espoir',
          nif: 'NIF-ESPOIR-023',
          rccm: 'RCCM-ESPOIR-023',
          adresse: 'Lomé, Togo',
          ville: 'Lomé',
          telephone: '22 21 66 45',
          email: 'contact@espoir.tg',
          contactPrincipal: 'Direction',
          secteurActivite: 'ONG',
          regimeFiscal: 'Réel Normal' as const,
          delaiPaiement: 30,
          remise: 0,
          limiteCredit: 0,
          statut: 'actif' as const,
          dateCreation: new Date().toISOString().slice(0, 10),
          totalFacture: 0,
          totalEncaissement: 0,
          soldeImpaye: 0,
          nombreFactures: 0
        },
        {
          id: 'CLI-024',
          raisonSociale: 'La Poste',
          nomCommercial: 'La Poste',
          nif: 'NIF-POSTE-024',
          rccm: 'RCCM-POSTE-024',
          adresse: 'Lomé, Togo',
          ville: 'Lomé',
          telephone: '90 29 74 28',
          email: 'contact@laposte.tg',
          contactPrincipal: 'Direction',
          secteurActivite: 'Poste',
          regimeFiscal: 'Réel Normal' as const,
          delaiPaiement: 30,
          remise: 0,
          limiteCredit: 0,
          statut: 'actif' as const,
          dateCreation: new Date().toISOString().slice(0, 10),
          totalFacture: 0,
          totalEncaissement: 0,
          soldeImpaye: 0,
          nombreFactures: 0
        },
        {
          id: 'CLI-025',
          raisonSociale: 'Port Autonome de Lomé',
          nomCommercial: 'PAL',
          nif: 'NIF-PAL-025',
          rccm: 'RCCM-PAL-025',
          adresse: 'Port de Lomé, Togo',
          ville: 'Lomé',
          telephone: '—',
          email: 'contact@pal.tg',
          contactPrincipal: 'Direction',
          secteurActivite: 'Port',
          regimeFiscal: 'Réel Normal' as const,
          delaiPaiement: 30,
          remise: 0,
          limiteCredit: 0,
          statut: 'actif' as const,
          dateCreation: new Date().toISOString().slice(0, 10),
          totalFacture: 0,
          totalEncaissement: 0,
          soldeImpaye: 0,
          nombreFactures: 0
        },
        {
          id: 'CLI-026',
          raisonSociale: 'UGP-AK',
          nomCommercial: 'UGP-AK',
          nif: 'NIF-UGP-026',
          rccm: 'RCCM-UGP-026',
          adresse: 'Lomé, Togo',
          ville: 'Lomé',
          telephone: '92 25 63 89',
          email: 'contact@ugp-ak.tg',
          contactPrincipal: 'Direction',
          secteurActivite: 'Entreprise Privée',
          regimeFiscal: 'Réel Normal' as const,
          delaiPaiement: 30,
          remise: 0,
          limiteCredit: 0,
          statut: 'actif' as const,
          dateCreation: new Date().toISOString().slice(0, 10),
          totalFacture: 0,
          totalEncaissement: 0,
          soldeImpaye: 0,
          nombreFactures: 0
        }
      ];

      // Catégories d'articles par défaut
      const defaultCategories: ArticleCategory[] = [
        // Catégories principales
        {
          id: 'CAT-AMEUBLEMENT',
          name: '🪑 Ameublement',
          description: 'Tous les articles liés à l\'ameublement et à la décoration',
          icon: '🪑',
          color: 'bg-amber-100 text-amber-800',
          dateCreation: new Date().toISOString()
        },
        {
          id: 'CAT-INFORMATIQUE',
          name: '💻 Informatique',
          description: 'Matériel informatique et consommables',
          icon: '💻',
          color: 'bg-blue-100 text-blue-800',
          dateCreation: new Date().toISOString()
        },
        {
          id: 'CAT-FOURNITURES',
          name: '🗂️ Fournitures de bureau',
          description: 'Fournitures et accessoires de bureau',
          icon: '🗂️',
          color: 'bg-green-100 text-green-800',
          dateCreation: new Date().toISOString()
        },
        // Sous-catégories Ameublement
        {
          id: 'CAT-TISSUS',
          name: 'Tissus et revêtements',
          description: 'Tissus d\'ameublement, revêtements muraux',
          icon: '🎨',
          color: 'bg-pink-100 text-pink-800',
          parentId: 'CAT-AMEUBLEMENT',
          dateCreation: new Date().toISOString()
        },
        {
          id: 'CAT-BOIS',
          name: 'Bois et dérivés',
          description: 'Bois massif, panneaux, placages',
          icon: '🌳',
          color: 'bg-yellow-100 text-yellow-800',
          parentId: 'CAT-AMEUBLEMENT',
          dateCreation: new Date().toISOString()
        },
        {
          id: 'CAT-ACCESSOIRES',
          name: 'Accessoires et quincaillerie',
          description: 'Charnières, poignées, systèmes de fixation',
          icon: '🔧',
          color: 'bg-gray-100 text-gray-800',
          parentId: 'CAT-AMEUBLEMENT',
          dateCreation: new Date().toISOString()
        },
        {
          id: 'CAT-DECORATION',
          name: 'Éléments de décoration',
          description: 'Textiles déco, décorations murales, objets de table',
          icon: '✨',
          color: 'bg-purple-100 text-purple-800',
          parentId: 'CAT-AMEUBLEMENT',
          dateCreation: new Date().toISOString()
        },
        {
          id: 'CAT-TAPISSIER',
          name: 'Matériels tapissiers',
          description: 'Mousses, garnissage, outils de tapissier',
          icon: '🛠️',
          color: 'bg-orange-100 text-orange-800',
          parentId: 'CAT-AMEUBLEMENT',
          dateCreation: new Date().toISOString()
        },
        // Sous-catégories Informatique
        {
          id: 'CAT-CONSOMMABLES',
          name: 'Consommables (cartouches & toners)',
          description: 'Cartouches HP, Canon, Lenovo, toners',
          icon: '🖨️',
          color: 'bg-red-100 text-red-800',
          parentId: 'CAT-INFORMATIQUE',
          dateCreation: new Date().toISOString()
        },
        {
          id: 'CAT-MATERIEL',
          name: 'Matériel informatique & accessoires',
          description: 'Antivirus, multiprises, clés USB, disques durs',
          icon: '💾',
          color: 'bg-indigo-100 text-indigo-800',
          parentId: 'CAT-INFORMATIQUE',
          dateCreation: new Date().toISOString()
        },
        // Sous-catégories Fournitures de bureau
        {
          id: 'CAT-PAPETERIE',
          name: 'Papeterie',
          description: 'Rames de papier, cahiers, registres',
          icon: '📄',
          color: 'bg-white text-gray-800',
          parentId: 'CAT-FOURNITURES',
          dateCreation: new Date().toISOString()
        },
        {
          id: 'CAT-CLASSEMENT',
          name: 'Classement et archivage',
          description: 'Chemises, sous-chemises, systèmes de classement',
          icon: '📁',
          color: 'bg-teal-100 text-teal-800',
          parentId: 'CAT-FOURNITURES',
          dateCreation: new Date().toISOString()
        },
        {
          id: 'CAT-ENVELOPPES',
          name: 'Enveloppes',
          description: 'Enveloppes de toutes tailles et couleurs',
          icon: '✉️',
          color: 'bg-cyan-100 text-cyan-800',
          parentId: 'CAT-FOURNITURES',
          dateCreation: new Date().toISOString()
        },
        {
          id: 'CAT-ECRITURE',
          name: 'Écriture et correction',
          description: 'Stylos, feutres, correcteurs',
          icon: '✏️',
          color: 'bg-rose-100 text-rose-800',
          parentId: 'CAT-FOURNITURES',
          dateCreation: new Date().toISOString()
        },
        {
          id: 'CAT-QUINCAILLERIE',
          name: 'Petite quincaillerie de bureau',
          description: 'Agrafes, porte Bic, accessoires de bureau',
          icon: '📎',
          color: 'bg-slate-100 text-slate-800',
          parentId: 'CAT-FOURNITURES',
          dateCreation: new Date().toISOString()
        }
      ];

      // Articles d'exemple par catégorie
      const defaultArticles: Article[] = [
        // Articles Ameublement - Tissus et revêtements
        {
          id: 'ART-TISSUS-001',
          name: 'Tissu coton blanc 150cm',
          description: 'Tissu coton blanc pour ameublement, largeur 150cm',
          unitPrice: 2500,
          categoryId: 'CAT-TISSUS',
          sku: 'TISS-COT-150',
          material: 'Coton',
          color: 'Blanc',
          unit: 'mètre',
          dateCreation: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'ART-TISSUS-002',
          name: 'Velours bleu marine',
          description: 'Velours bleu marine pour fauteuils et canapés',
          unitPrice: 4500,
          categoryId: 'CAT-TISSUS',
          sku: 'VEL-BLEU-001',
          material: 'Velours',
          color: 'Bleu marine',
          unit: 'mètre',
          dateCreation: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'ART-TISSUS-003',
          name: 'Cuir synthétique noir',
          description: 'Cuir synthétique noir pour mobilier moderne',
          unitPrice: 6500,
          categoryId: 'CAT-TISSUS',
          sku: 'CUIR-SYN-001',
          material: 'Cuir synthétique',
          color: 'Noir',
          unit: 'mètre',
          dateCreation: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        },
        // Articles Ameublement - Bois et dérivés
        {
          id: 'ART-BOIS-001',
          name: 'Panneau MDF 18mm',
          description: 'Panneau MDF 18mm pour fabrication de meubles',
          unitPrice: 12000,
          categoryId: 'CAT-BOIS',
          sku: 'MDF-18-001',
          material: 'MDF',
          color: 'Naturel',
          unit: 'm²',
          dimensions: '122x244cm',
          dateCreation: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'ART-BOIS-002',
          name: 'Chêne massif 25mm',
          description: 'Planche chêne massif 25mm pour table et bureau',
          unitPrice: 35000,
          categoryId: 'CAT-BOIS',
          sku: 'CHENE-25-001',
          material: 'Chêne massif',
          color: 'Chêne naturel',
          unit: 'm²',
          dimensions: '20x200cm',
          dateCreation: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        },
        // Articles Informatique - Consommables
        {
          id: 'ART-CONSO-001',
          name: 'Cartouche HP 207A',
          description: 'Cartouche d\'encre HP 207A pour imprimante LaserJet',
          unitPrice: 25000,
          categoryId: 'CAT-CONSOMMABLES',
          sku: 'HP-207A',
          brand: 'HP',
          model: '207A',
          color: 'Noir',
          unit: 'pièce',
          dateCreation: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'ART-CONSO-002',
          name: 'Toner Canon CEXV 32',
          description: 'Toner Canon CEXV 32 pour imprimante multifonction',
          unitPrice: 18000,
          categoryId: 'CAT-CONSOMMABLES',
          sku: 'CAN-CEXV32',
          brand: 'Canon',
          model: 'CEXV 32',
          color: 'Cyan',
          unit: 'pièce',
          dateCreation: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'ART-CONSO-003',
          name: 'Toner Lenovo LT 245H',
          description: 'Toner Lenovo LT 245H pour imprimante laser',
          unitPrice: 22000,
          categoryId: 'CAT-CONSOMMABLES',
          sku: 'LEN-LT245H',
          brand: 'Lenovo',
          model: 'LT 245H',
          color: 'Noir',
          unit: 'pièce',
          dateCreation: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        },
        // Articles Informatique - Matériel
        {
          id: 'ART-MAT-001',
          name: 'Antivirus Kaspersky 4 postes',
          description: 'Licence antivirus Kaspersky pour 4 postes',
          unitPrice: 45000,
          categoryId: 'CAT-MATERIEL',
          sku: 'KAS-4P-001',
          brand: 'Kaspersky',
          model: 'Internet Security',
          unit: 'licence',
          dateCreation: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'ART-MAT-002',
          name: 'Clé USB 32Go',
          description: 'Clé USB 32Go haute vitesse',
          unitPrice: 8000,
          categoryId: 'CAT-MATERIEL',
          sku: 'USB-32G-001',
          brand: 'SanDisk',
          model: 'Ultra',
          unit: 'pièce',
          dateCreation: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'ART-MAT-003',
          name: 'Disque dur externe 1To',
          description: 'Disque dur externe 1To USB 3.0',
          unitPrice: 35000,
          categoryId: 'CAT-MATERIEL',
          sku: 'HDD-1T-001',
          brand: 'Seagate',
          model: 'Backup Plus',
          unit: 'pièce',
          dateCreation: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        },
        // Articles Fournitures de bureau - Papeterie
        {
          id: 'ART-PAP-001',
          name: 'Rame papier Paperline 80g',
          description: 'Rame de papier blanc 80g, 500 feuilles',
          unitPrice: 2500,
          categoryId: 'CAT-PAPETERIE',
          sku: 'PAP-80G-001',
          brand: 'Paperline',
          color: 'Blanc',
          unit: 'rame',
          dateCreation: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'ART-PAP-002',
          name: 'Cahier de transmission 200 pages',
          description: 'Cahier de transmission 200 pages, format A4',
          unitPrice: 1500,
          categoryId: 'CAT-PAPETERIE',
          sku: 'CAH-200-001',
          brand: 'Clairefontaine',
          color: 'Blanc',
          unit: 'pièce',
          dateCreation: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        },
        // Articles Fournitures de bureau - Écriture
        {
          id: 'ART-ECR-001',
          name: 'Stylo Luxor Focus bleu',
          description: 'Stylo bille Luxor Focus, encre bleue',
          unitPrice: 500,
          categoryId: 'CAT-ECRITURE',
          sku: 'STY-LUX-BLEU',
          brand: 'Luxor',
          model: 'Focus',
          color: 'Bleu',
          unit: 'pièce',
          dateCreation: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'ART-ECR-002',
          name: 'Stylo Schneider rouge',
          description: 'Stylo bille Schneider, encre rouge',
          unitPrice: 450,
          categoryId: 'CAT-ECRITURE',
          sku: 'STY-SCH-ROUGE',
          brand: 'Schneider',
          color: 'Rouge',
          unit: 'pièce',
          dateCreation: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'ART-ECR-003',
          name: 'Correcteur PENN fluid',
          description: 'Correcteur liquide PENN, 20ml',
          unitPrice: 1200,
          categoryId: 'CAT-ECRITURE',
          sku: 'COR-PENN-001',
          brand: 'PENN',
          model: 'Fluid',
          color: 'Blanc',
          unit: 'pièce',
          dateCreation: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        },
        // Articles Fournitures de bureau - Enveloppes
        {
          id: 'ART-ENV-001',
          name: 'Enveloppe A4 kaki',
          description: 'Enveloppe A4 couleur kaki, 100 unités',
          unitPrice: 3000,
          categoryId: 'CAT-ENVELOPPES',
          sku: 'ENV-A4-KAKI',
          color: 'Kaki',
          size: 'A4',
          unit: 'paquet',
          dateCreation: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'ART-ENV-002',
          name: 'Enveloppe A5 kaki',
          description: 'Enveloppe A5 couleur kaki, 100 unités',
          unitPrice: 2000,
          categoryId: 'CAT-ENVELOPPES',
          sku: 'ENV-A5-KAKI',
          color: 'Kaki',
          size: 'A5',
          unit: 'paquet',
          dateCreation: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        },
        // Articles Fournitures de bureau - Quincaillerie
        {
          id: 'ART-QUIN-001',
          name: 'Agrafes 24/6',
          description: 'Boîte d\'agrafes 24/6, 1000 unités',
          unitPrice: 1500,
          categoryId: 'CAT-QUINCAILLERIE',
          sku: 'AGR-24-6-001',
          unit: 'boîte',
          dateCreation: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'ART-QUIN-002',
          name: 'Porte Bic grillagé noir',
          description: 'Porte Bic grillagé couleur noire',
          unitPrice: 800,
          categoryId: 'CAT-QUINCAILLERIE',
          sku: 'PB-GRILL-NOIR',
          color: 'Noir',
          unit: 'pièce',
          dateCreation: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        },
        // Articles Ameublement - Tissus et revêtements (complet)
        {
          id: 'ART-TISSUS-004',
          name: 'Tissu lin naturel',
          description: 'Tissu lin naturel pour ameublement, largeur 150cm',
          unitPrice: 3500,
          categoryId: 'CAT-TISSUS',
          sku: 'TISS-LIN-150',
          material: 'Lin',
          color: 'Naturel',
          unit: 'mètre',
          dateCreation: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'ART-TISSUS-005',
          name: 'Soie rouge bordeaux',
          description: 'Tissu soie rouge bordeaux pour rideaux et coussins',
          unitPrice: 8500,
          categoryId: 'CAT-TISSUS',
          sku: 'SOIE-ROUGE-001',
          material: 'Soie',
          color: 'Rouge bordeaux',
          unit: 'mètre',
          dateCreation: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'ART-TISSUS-006',
          name: 'Polyester gris anthracite',
          description: 'Tissu polyester gris anthracite, résistant',
          unitPrice: 1800,
          categoryId: 'CAT-TISSUS',
          sku: 'POLY-GRIS-001',
          material: 'Polyester',
          color: 'Gris anthracite',
          unit: 'mètre',
          dateCreation: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'ART-TISSUS-007',
          name: 'Vinyle noir brillant',
          description: 'Vinyle noir brillant pour mobilier moderne',
          unitPrice: 4200,
          categoryId: 'CAT-TISSUS',
          sku: 'VINYL-NOIR-001',
          material: 'Vinyle',
          color: 'Noir brillant',
          unit: 'mètre',
          dateCreation: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'ART-TISSUS-008',
          name: 'Skaï beige',
          description: 'Skaï beige pour fauteuils et canapés',
          unitPrice: 3200,
          categoryId: 'CAT-TISSUS',
          sku: 'SKAI-BEIGE-001',
          material: 'Skaï',
          color: 'Beige',
          unit: 'mètre',
          dateCreation: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'ART-TISSUS-009',
          name: 'Papier peint fleuri',
          description: 'Papier peint à motif floral, rouleau 10m',
          unitPrice: 4500,
          categoryId: 'CAT-TISSUS',
          sku: 'PP-FLEURI-001',
          material: 'Papier peint',
          color: 'Multicolore',
          unit: 'rouleau',
          dateCreation: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'ART-TISSUS-010',
          name: 'Tissu mural géométrique',
          description: 'Tissu mural à motif géométrique moderne',
          unitPrice: 6500,
          categoryId: 'CAT-TISSUS',
          sku: 'TM-GEO-001',
          material: 'Tissu mural',
          color: 'Gris et blanc',
          unit: 'mètre',
          dateCreation: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'ART-TISSUS-011',
          name: 'Lambris textile acoustique',
          description: 'Lambris textile acoustique pour isolation phonique',
          unitPrice: 12000,
          categoryId: 'CAT-TISSUS',
          sku: 'LAMB-ACOU-001',
          material: 'Lambris textile',
          color: 'Gris foncé',
          unit: 'm²',
          dateCreation: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        },
        // Articles Ameublement - Bois et dérivés (complet)
        {
          id: 'ART-BOIS-003',
          name: 'Hêtre massif 30mm',
          description: 'Planche hêtre massif 30mm pour mobilier haut de gamme',
          unitPrice: 28000,
          categoryId: 'CAT-BOIS',
          sku: 'HETRE-30-001',
          material: 'Hêtre massif',
          color: 'Hêtre clair',
          unit: 'm²',
          dimensions: '25x200cm',
          dateCreation: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'ART-BOIS-004',
          name: 'Acajou massif 20mm',
          description: 'Planche acajou massif 20mm pour meubles de luxe',
          unitPrice: 45000,
          categoryId: 'CAT-BOIS',
          sku: 'ACAJOU-20-001',
          material: 'Acajou massif',
          color: 'Acajou rouge',
          unit: 'm²',
          dimensions: '20x150cm',
          dateCreation: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'ART-BOIS-005',
          name: 'Teck massif 25mm',
          description: 'Planche teck massif 25mm pour mobilier extérieur',
          unitPrice: 55000,
          categoryId: 'CAT-BOIS',
          sku: 'TECK-25-001',
          material: 'Teck massif',
          color: 'Teck doré',
          unit: 'm²',
          dimensions: '25x200cm',
          dateCreation: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'ART-BOIS-006',
          name: 'Pin massif 18mm',
          description: 'Planche pin massif 18mm pour mobilier rustique',
          unitPrice: 15000,
          categoryId: 'CAT-BOIS',
          sku: 'PIN-18-001',
          material: 'Pin massif',
          color: 'Pin clair',
          unit: 'm²',
          dimensions: '18x200cm',
          dateCreation: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'ART-BOIS-007',
          name: 'Noyer massif 22mm',
          description: 'Planche noyer massif 22mm pour mobilier classique',
          unitPrice: 38000,
          categoryId: 'CAT-BOIS',
          sku: 'NOYER-22-001',
          material: 'Noyer massif',
          color: 'Noyer foncé',
          unit: 'm²',
          dimensions: '22x180cm',
          dateCreation: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'ART-BOIS-008',
          name: 'Contreplaqué 15mm',
          description: 'Panneau contreplaqué 15mm pour construction',
          unitPrice: 8500,
          categoryId: 'CAT-BOIS',
          sku: 'CP-15-001',
          material: 'Contreplaqué',
          color: 'Naturel',
          unit: 'm²',
          dimensions: '122x244cm',
          dateCreation: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'ART-BOIS-009',
          name: 'Aggloméré 18mm',
          description: 'Panneau aggloméré 18mm pour meubles standards',
          unitPrice: 6500,
          categoryId: 'CAT-BOIS',
          sku: 'AGG-18-001',
          material: 'Aggloméré',
          color: 'Naturel',
          unit: 'm²',
          dimensions: '122x244cm',
          dateCreation: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'ART-BOIS-010',
          name: 'OSB 12mm',
          description: 'Panneau OSB 12mm pour construction et aménagement',
          unitPrice: 4500,
          categoryId: 'CAT-BOIS',
          sku: 'OSB-12-001',
          material: 'OSB',
          color: 'Naturel',
          unit: 'm²',
          dimensions: '122x244cm',
          dateCreation: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'ART-BOIS-011',
          name: 'Placage chêne',
          description: 'Placage chêne naturel pour finition de meubles',
          unitPrice: 2500,
          categoryId: 'CAT-BOIS',
          sku: 'PLAC-CHENE-001',
          material: 'Placage chêne',
          color: 'Chêne naturel',
          unit: 'm²',
          dateCreation: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'ART-BOIS-012',
          name: 'Placage wengé',
          description: 'Placage wengé exotique pour meubles design',
          unitPrice: 3500,
          categoryId: 'CAT-BOIS',
          sku: 'PLAC-WENGE-001',
          material: 'Placage wengé',
          color: 'Wengé foncé',
          unit: 'm²',
          dateCreation: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'ART-BOIS-013',
          name: 'Placage merisier',
          description: 'Placage merisier pour finition de meubles classiques',
          unitPrice: 2800,
          categoryId: 'CAT-BOIS',
          sku: 'PLAC-MERISIER-001',
          material: 'Placage merisier',
          color: 'Merisier rosé',
          unit: 'm²',
          dateCreation: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'ART-BOIS-014',
          name: 'Placage érable',
          description: 'Placage érable clair pour finition moderne',
          unitPrice: 2200,
          categoryId: 'CAT-BOIS',
          sku: 'PLAC-ERABLE-001',
          material: 'Placage érable',
          color: 'Érable clair',
          unit: 'm²',
          dateCreation: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'ART-BOIS-015',
          name: 'Placage noyer',
          description: 'Placage noyer pour finition de meubles haut de gamme',
          unitPrice: 3200,
          categoryId: 'CAT-BOIS',
          sku: 'PLAC-NOYER-001',
          material: 'Placage noyer',
          color: 'Noyer foncé',
          unit: 'm²',
          dateCreation: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'ART-BOIS-016',
          name: 'Bambou naturel',
          description: 'Lattes de bambou naturel pour décoration et construction',
          unitPrice: 1800,
          categoryId: 'CAT-BOIS',
          sku: 'BAMBOU-001',
          material: 'Bambou',
          color: 'Bambou naturel',
          unit: 'mètre',
          dimensions: '2x10cm',
          dateCreation: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'ART-BOIS-017',
          name: 'Rotin naturel',
          description: 'Rotin naturel pour mobilier et décoration',
          unitPrice: 1200,
          categoryId: 'CAT-BOIS',
          sku: 'ROTIN-001',
          material: 'Rotin',
          color: 'Rotin naturel',
          unit: 'mètre',
          dateCreation: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'ART-BOIS-018',
          name: 'Osier tressé',
          description: 'Osier tressé pour paniers et décoration',
          unitPrice: 800,
          categoryId: 'CAT-BOIS',
          sku: 'OSIER-001',
          material: 'Osier',
          color: 'Osier naturel',
          unit: 'mètre',
          dateCreation: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'ART-BOIS-019',
          name: 'Lattes décoratives',
          description: 'Lattes décoratives en pin pour claustra et séparation',
          unitPrice: 1500,
          categoryId: 'CAT-BOIS',
          sku: 'LATTES-DEC-001',
          material: 'Pin',
          color: 'Pin naturel',
          unit: 'mètre',
          dimensions: '2x5cm',
          dateCreation: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'ART-BOIS-020',
          name: 'Panneaux acoustiques',
          description: 'Panneaux acoustiques en bois pour isolation phonique',
          unitPrice: 8500,
          categoryId: 'CAT-BOIS',
          sku: 'PAN-ACOU-001',
          material: 'Bois traité',
          color: 'Naturel',
          unit: 'm²',
          dimensions: '60x60cm',
          dateCreation: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        },
        // Articles Ameublement - Accessoires et quincaillerie (complet)
        {
          id: 'ART-ACCESS-001',
          name: 'Charnières invisibles 35mm',
          description: 'Charnières invisibles 35mm pour portes de meubles',
          unitPrice: 2500,
          categoryId: 'CAT-ACCESSOIRES',
          sku: 'CHARN-35-001',
          material: 'Métal',
          color: 'Argent',
          unit: 'paire',
          dateCreation: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'ART-ACCESS-002',
          name: 'Coulisses à billes 50cm',
          description: 'Coulisses à billes télescopiques 50cm pour tiroirs',
          unitPrice: 4500,
          categoryId: 'CAT-ACCESSOIRES',
          sku: 'COUL-50-001',
          material: 'Métal et plastique',
          color: 'Gris',
          unit: 'paire',
          dateCreation: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'ART-ACCESS-003',
          name: 'Amortisseurs de tiroir',
          description: 'Amortisseurs de tiroir pour fermeture douce',
          unitPrice: 800,
          categoryId: 'CAT-ACCESSOIRES',
          sku: 'AMORT-TIR-001',
          material: 'Plastique',
          color: 'Blanc',
          unit: 'pièce',
          dateCreation: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'ART-ACCESS-004',
          name: 'Poignées bois chêne',
          description: 'Poignées en bois de chêne pour meubles classiques',
          unitPrice: 1200,
          categoryId: 'CAT-ACCESSOIRES',
          sku: 'POIG-CHENE-001',
          material: 'Bois de chêne',
          color: 'Chêne naturel',
          unit: 'pièce',
          dateCreation: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'ART-ACCESS-005',
          name: 'Poignées cuir marron',
          description: 'Poignées en cuir marron pour meubles de luxe',
          unitPrice: 1800,
          categoryId: 'CAT-ACCESSOIRES',
          sku: 'POIG-CUIR-001',
          material: 'Cuir',
          color: 'Marron',
          unit: 'pièce',
          dateCreation: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'ART-ACCESS-006',
          name: 'Pieds réglables métal',
          description: 'Pieds réglables en métal pour meubles',
          unitPrice: 1500,
          categoryId: 'CAT-ACCESSOIRES',
          sku: 'PIEDS-REG-001',
          material: 'Métal',
          color: 'Chrome',
          unit: 'pièce',
          dateCreation: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'ART-ACCESS-007',
          name: 'Pieds plastique blanc',
          description: 'Pieds en plastique blanc pour meubles légers',
          unitPrice: 600,
          categoryId: 'CAT-ACCESSOIRES',
          sku: 'PIEDS-PLAST-001',
          material: 'Plastique',
          color: 'Blanc',
          unit: 'pièce',
          dateCreation: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'ART-ACCESS-008',
          name: 'Ferrures décoratives bronze',
          description: 'Ferrures décoratives en bronze pour meubles anciens',
          unitPrice: 3500,
          categoryId: 'CAT-ACCESSOIRES',
          sku: 'FERR-BRONZE-001',
          material: 'Bronze',
          color: 'Bronze',
          unit: 'pièce',
          dateCreation: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'ART-ACCESS-009',
          name: 'Vis à bois 4x50mm',
          description: 'Vis à bois 4x50mm, boîte de 100',
          unitPrice: 2500,
          categoryId: 'CAT-ACCESSOIRES',
          sku: 'VIS-4-50-001',
          material: 'Acier',
          color: 'Zingué',
          unit: 'boîte',
          dateCreation: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'ART-ACCESS-010',
          name: 'Chevilles 8mm',
          description: 'Chevilles 8mm pour fixation murale, boîte de 50',
          unitPrice: 1800,
          categoryId: 'CAT-ACCESSOIRES',
          sku: 'CHEV-8-001',
          material: 'Plastique',
          color: 'Blanc',
          unit: 'boîte',
          dateCreation: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'ART-ACCESS-011',
          name: 'Colle bois blanche',
          description: 'Colle bois blanche 500ml',
          unitPrice: 1200,
          categoryId: 'CAT-ACCESSOIRES',
          sku: 'COLLE-BOIS-001',
          material: 'Colle',
          color: 'Blanc',
          unit: 'bouteille',
          dateCreation: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'ART-ACCESS-012',
          name: 'Agrafes 6mm',
          description: 'Agrafes 6mm pour agrafeuse, boîte de 1000',
          unitPrice: 800,
          categoryId: 'CAT-ACCESSOIRES',
          sku: 'AGR-6-001',
          material: 'Acier',
          color: 'Galvanisé',
          unit: 'boîte',
          dateCreation: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        },
        // Articles Ameublement - Éléments de décoration (complet)
        {
          id: 'ART-DECO-001',
          name: 'Coussins décoratifs 40x40cm',
          description: 'Coussins décoratifs en coton, 40x40cm',
          unitPrice: 3500,
          categoryId: 'CAT-DECORATION',
          sku: 'COUSS-40-001',
          material: 'Coton',
          color: 'Multicolore',
          unit: 'pièce',
          dateCreation: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'ART-DECO-002',
          name: 'Nappes coton 150x150cm',
          description: 'Nappes en coton 150x150cm pour table',
          unitPrice: 4500,
          categoryId: 'CAT-DECORATION',
          sku: 'NAPPE-150-001',
          material: 'Coton',
          color: 'Blanc',
          unit: 'pièce',
          dateCreation: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'ART-DECO-003',
          name: 'Tapis laine 200x300cm',
          description: 'Tapis en laine 200x300cm, motif persan',
          unitPrice: 85000,
          categoryId: 'CAT-DECORATION',
          sku: 'TAPIS-200-001',
          material: 'Laine',
          color: 'Rouge et or',
          unit: 'pièce',
          dateCreation: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'ART-DECO-004',
          name: 'Miroir ovale 60cm',
          description: 'Miroir ovale 60cm avec cadre doré',
          unitPrice: 25000,
          categoryId: 'CAT-DECORATION',
          sku: 'MIRR-OVAL-001',
          material: 'Verre et métal',
          color: 'Doré',
          unit: 'pièce',
          dateCreation: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'ART-DECO-005',
          name: 'Tableau moderne 50x70cm',
          description: 'Tableau moderne abstrait 50x70cm',
          unitPrice: 15000,
          categoryId: 'CAT-DECORATION',
          sku: 'TABL-MOD-001',
          material: 'Toile et peinture',
          color: 'Multicolore',
          unit: 'pièce',
          dateCreation: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'ART-DECO-006',
          name: 'Cadres photo 15x20cm',
          description: 'Cadres photo 15x20cm, lot de 4',
          unitPrice: 3500,
          categoryId: 'CAT-DECORATION',
          sku: 'CADR-15-20-001',
          material: 'Bois',
          color: 'Chêne',
          unit: 'lot',
          dateCreation: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'ART-DECO-007',
          name: 'Horloge murale 40cm',
          description: 'Horloge murale 40cm, style vintage',
          unitPrice: 8500,
          categoryId: 'CAT-DECORATION',
          sku: 'HORL-40-001',
          material: 'Métal et verre',
          color: 'Noir',
          unit: 'pièce',
          dateCreation: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'ART-DECO-008',
          name: 'Vases céramique 25cm',
          description: 'Vases en céramique 25cm de haut, lot de 3',
          unitPrice: 12000,
          categoryId: 'CAT-DECORATION',
          sku: 'VASE-CER-001',
          material: 'Céramique',
          color: 'Blanc',
          unit: 'lot',
          dateCreation: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'ART-DECO-009',
          name: 'Paniers osier 30cm',
          description: 'Paniers en osier 30cm de diamètre',
          unitPrice: 4500,
          categoryId: 'CAT-DECORATION',
          sku: 'PAN-OSIER-001',
          material: 'Osier',
          color: 'Naturel',
          unit: 'pièce',
          dateCreation: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'ART-DECO-010',
          name: 'Corbeilles tissu 20cm',
          description: 'Corbeilles en tissu 20cm, lot de 2',
          unitPrice: 3500,
          categoryId: 'CAT-DECORATION',
          sku: 'CORB-TISS-001',
          material: 'Tissu',
          color: 'Gris',
          unit: 'lot',
          dateCreation: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'ART-DECO-011',
          name: 'Fleurs artificielles roses',
          description: 'Bouquet de fleurs artificielles roses',
          unitPrice: 2500,
          categoryId: 'CAT-DECORATION',
          sku: 'FLEUR-ART-001',
          material: 'Plastique',
          color: 'Rose',
          unit: 'bouquet',
          dateCreation: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'ART-DECO-012',
          name: 'Pots terre cuite 15cm',
          description: 'Pots en terre cuite 15cm de diamètre, lot de 6',
          unitPrice: 1800,
          categoryId: 'CAT-DECORATION',
          sku: 'POT-TERRE-001',
          material: 'Terre cuite',
          color: 'Terre',
          unit: 'lot',
          dateCreation: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'ART-DECO-013',
          name: 'Terrarium verre 25cm',
          description: 'Terrarium en verre 25cm pour plantes',
          unitPrice: 8500,
          categoryId: 'CAT-DECORATION',
          sku: 'TERR-VERRE-001',
          material: 'Verre',
          color: 'Transparent',
          unit: 'pièce',
          dateCreation: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'ART-DECO-014',
          name: 'Tringles rideaux 200cm',
          description: 'Tringles pour rideaux 200cm, métal chromé',
          unitPrice: 4500,
          categoryId: 'CAT-DECORATION',
          sku: 'TRING-200-001',
          material: 'Métal',
          color: 'Chrome',
          unit: 'pièce',
          dateCreation: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'ART-DECO-015',
          name: 'Embouts tringle dorés',
          description: 'Embouts pour tringles dorés, paire',
          unitPrice: 1200,
          categoryId: 'CAT-DECORATION',
          sku: 'EMB-DOR-001',
          material: 'Métal',
          color: 'Doré',
          unit: 'paire',
          dateCreation: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'ART-DECO-016',
          name: 'Embrasses rideaux',
          description: 'Embrasses pour rideaux en tissu, lot de 4',
          unitPrice: 2500,
          categoryId: 'CAT-DECORATION',
          sku: 'EMBR-TISS-001',
          material: 'Tissu',
          color: 'Beige',
          unit: 'lot',
          dateCreation: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        },
        // Articles Ameublement - Matériels tapissiers (complet)
        {
          id: 'ART-TAPIS-001',
          name: 'Mousse polyuréthane 5cm',
          description: 'Mousse polyuréthane 5cm d\'épaisseur, 100x200cm',
          unitPrice: 8500,
          categoryId: 'CAT-TAPISSIER',
          sku: 'MOUSSE-5-001',
          material: 'Polyuréthane',
          color: 'Blanc',
          unit: 'm²',
          dateCreation: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'ART-TAPIS-002',
          name: 'Ouate de coton 2cm',
          description: 'Ouate de coton 2cm d\'épaisseur, 100x200cm',
          unitPrice: 3500,
          categoryId: 'CAT-TAPISSIER',
          sku: 'OUATE-2-001',
          material: 'Coton',
          color: 'Blanc',
          unit: 'm²',
          dateCreation: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'ART-TAPIS-003',
          name: 'Crin végétal 3cm',
          description: 'Crin végétal 3cm d\'épaisseur, 100x200cm',
          unitPrice: 12000,
          categoryId: 'CAT-TAPISSIER',
          sku: 'CRIN-3-001',
          material: 'Crin végétal',
          color: 'Naturel',
          unit: 'm²',
          dateCreation: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'ART-TAPIS-004',
          name: 'Sangles élastiques 5cm',
          description: 'Sangles élastiques 5cm de large, 10m',
          unitPrice: 2500,
          categoryId: 'CAT-TAPISSIER',
          sku: 'SANG-ELAS-001',
          material: 'Élastique',
          color: 'Blanc',
          unit: 'mètre',
          dateCreation: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'ART-TAPIS-005',
          name: 'Ressorts hélicoïdaux 15cm',
          description: 'Ressorts hélicoïdaux 15cm de diamètre, lot de 10',
          unitPrice: 4500,
          categoryId: 'CAT-TAPISSIER',
          sku: 'RESS-HEL-001',
          material: 'Acier',
          color: 'Galvanisé',
          unit: 'lot',
          dateCreation: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'ART-TAPIS-006',
          name: 'Clous décoratifs dorés',
          description: 'Clous décoratifs dorés 8mm, boîte de 100',
          unitPrice: 1800,
          categoryId: 'CAT-TAPISSIER',
          sku: 'CLOU-DOR-001',
          material: 'Métal',
          color: 'Doré',
          unit: 'boîte',
          dateCreation: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'ART-TAPIS-007',
          name: 'Galons décoratifs 2cm',
          description: 'Galons décoratifs 2cm de large, 10m',
          unitPrice: 1200,
          categoryId: 'CAT-TAPISSIER',
          sku: 'GALON-2-001',
          material: 'Tissu',
          color: 'Or',
          unit: 'mètre',
          dateCreation: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'ART-TAPIS-008',
          name: 'Fils à coudre 100m',
          description: 'Fils à coudre polyester 100m, assortiment couleurs',
          unitPrice: 800,
          categoryId: 'CAT-TAPISSIER',
          sku: 'FIL-COUD-001',
          material: 'Polyester',
          color: 'Assortiment',
          unit: 'bobine',
          dateCreation: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'ART-TAPIS-009',
          name: 'Aiguilles tapissier 15cm',
          description: 'Aiguilles tapissier 15cm, lot de 5',
          unitPrice: 1200,
          categoryId: 'CAT-TAPISSIER',
          sku: 'AIG-TAP-001',
          material: 'Acier',
          color: 'Argent',
          unit: 'lot',
          dateCreation: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'ART-TAPIS-010',
          name: 'Colle contact 500ml',
          description: 'Colle contact pour tapissier 500ml',
          unitPrice: 2500,
          categoryId: 'CAT-TAPISSIER',
          sku: 'COLLE-CONT-001',
          material: 'Colle',
          color: 'Transparent',
          unit: 'bouteille',
          dateCreation: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'ART-TAPIS-011',
          name: 'Adhésif double face 2cm',
          description: 'Adhésif double face 2cm de large, 10m',
          unitPrice: 800,
          categoryId: 'CAT-TAPISSIER',
          sku: 'ADH-DOUBLE-001',
          material: 'Adhésif',
          color: 'Transparent',
          unit: 'rouleau',
          dateCreation: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        }
      ];
      
      if (raw) {
        const parsed = JSON.parse(raw);
        
        // Ajouter les fournisseurs fréquents avec des IDs uniques
        const suppliersWithIds = frequentSuppliers.map((supplier, index) => ({
          ...supplier,
          id: `SUP-${String(index + 1).padStart(3, '0')}`,
          articles: []
        }));
        
        // Fusionner les fournisseurs existants avec les fournisseurs fréquents
        const existingSuppliers = (parsed.suppliersList || []).map((s: any) => ({ 
          ...s, 
          articles: s.articles || (s.produits ? s.produits.map((p: string, idx: number) => ({ id: `LEG-${idx}`, name: p, unitPrice: 0, taxRate: 18 })) : []) 
        }));
        
        // Vérifier si les fournisseurs fréquents existent déjà
        const existingSupplierNames = existingSuppliers.map((s: any) => s.raisonSociale);
        const newSuppliers = suppliersWithIds.filter(s => !existingSupplierNames.includes(s.raisonSociale));
        
        // Vérifier si les clients par défaut existent déjà
        const existingClients = parsed.clients || [];
        const hasDefaultClients = existingClients.some((c: any) => c.raisonSociale === 'Assemblée Nationale');
        
        // Vérifier si les catégories par défaut existent déjà
        const existingCategories = parsed.articleCategories || [];
        const hasDefaultCategories = existingCategories.some((cat: any) => cat.id === 'CAT-AMEUBLEMENT');
        const finalCategories = hasDefaultCategories ? existingCategories : [...defaultCategories, ...existingCategories];

        // Vérifier si les articles par défaut existent déjà
        const existingArticles = parsed.articles || [];
        const hasDefaultArticles = existingArticles.some((art: any) => art.id === 'ART-TISSUS-001');
        const finalArticles = hasDefaultArticles ? existingArticles : [...defaultArticles, ...existingArticles];

        setState(prev => ({ 
          ...prev, 
          ...parsed, 
          suppliersList: [...existingSuppliers, ...newSuppliers] as SupplierEntity[],
          supplierInvoices: parsed.supplierInvoices || parsed.suppliers || [],
          clients: hasDefaultClients ? existingClients : [...defaultClients, ...existingClients],
          discharges: parsed.discharges || [],
          contractOrders: parsed.contractOrders || [],
          articlesDirectory: (parsed.articlesDirectory && parsed.articlesDirectory.length > 0) ? parsed.articlesDirectory : [
            { id: 'ART-DIR-1', name: 'Toner' },
            { id: 'ART-DIR-2', name: 'PC' },
            { id: 'ART-DIR-3', name: 'Lenovo-Y260' },
            { id: 'ART-DIR-4', name: 'Mobilier de bureau' },
            { id: 'ART-DIR-5', name: 'Câble' }
          ],
          articleCategories: finalCategories,
          articleLots: parsed.articleLots || [],
          articles: finalArticles
        }));
      } else {
        // Ajouter les fournisseurs fréquents avec des IDs uniques
        const suppliersWithIds = frequentSuppliers.map((supplier, index) => ({
          ...supplier,
          id: `SUP-${String(index + 1).padStart(3, '0')}`,
          articles: []
        }));
        
        setState(prev => ({ 
          ...prev, 
          suppliersList: suppliersWithIds,
          clients: defaultClients,
          articlesDirectory: [
            { id: 'ART-DIR-1', name: 'Toner' },
            { id: 'ART-DIR-2', name: 'PC' },
            { id: 'ART-DIR-3', name: 'Lenovo-Y260' },
            { id: 'ART-DIR-4', name: 'Mobilier de bureau' },
            { id: 'ART-DIR-5', name: 'Câble' }
          ],
          articleCategories: defaultCategories,
          articleLots: [],
          articles: defaultArticles
        }));
      }
    } catch (_) {}
  }, []);

  useEffect(() => {
    const toStore = { documents: state.documents, suppliers: state.supplierInvoices, suppliersList: state.suppliersList, supplierInvoices: state.supplierInvoices, clients: state.clients, discharges: state.discharges, contractOrders: state.contractOrders, articlesDirectory: state.articlesDirectory, articleCategories: state.articleCategories, articleLots: state.articleLots, articles: state.articles };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
  }, [state.documents, state.suppliersList, state.supplierInvoices, state.clients, state.discharges, state.contractOrders, state.articlesDirectory, state.articleCategories, state.articleLots, state.articles]);

  const api = useMemo<DataContextValue>(() => ({
    documents: state.documents,
    suppliers: state.supplierInvoices,
    suppliersList: state.suppliersList,
    supplierInvoices: state.supplierInvoices,
    clients: state.clients,
    discharges: state.discharges,
    contractOrders: state.contractOrders,
    articlesDirectory: state.articlesDirectory,
    articleCategories: state.articleCategories,
    articleLots: state.articleLots,
    articles: state.articles,
    saveDocument: (docInput) => {
      const year = new Date(docInput.date).getFullYear();
      const seq = nextSequence(state.documents, docInput.type, year);
      const reference = `${year}-${String(seq).padStart(4, '0')}`;
      const id = formatNumberNew(docInput.type, year, seq);
      const doc: CustomerDocument = { ...docInput, id, reference, payments: [] };
      setState(s => ({ ...s, documents: [doc, ...s.documents] }));
      
      return doc;
    },
    addPayment: (docId, payment) => {
      setState(s => {
        const docs = s.documents.map(d => {
          if (d.id !== docId) return d;
          const payments = [...(d.payments || []), payment];
          const totalHT = d.items.reduce((sum, it) => sum + it.quantity * it.unitPrice, 0);
          const tva = Math.round((totalHT * d.tva) / 100);
          const ttc = totalHT + tva;
          const paid = payments.reduce((sum, p) => sum + p.amount, 0);
          
          // Gestion du reliquat : si le montant payé dépasse le montant dû
          let finalPayment = payment;
          if (paid > ttc) {
            // Le montant payé dépasse le montant dû, on ajuste le paiement
            const excess = paid - ttc;
            finalPayment = { ...payment, amount: payment.amount - excess };
            // Ajouter le reliquat comme un paiement séparé
            const reliquatPayment = { 
              date: payment.date, 
              amount: excess, 
              note: `Reliquat - ${payment.note || 'Paiement'}` 
            };
            payments[payments.length - 1] = finalPayment;
            payments.push(reliquatPayment);
          }
          
          const status: CustomerDocument['status'] = paid >= ttc ? 'paid' : (paid > 0 ? 'partial' : d.status);
          return { ...d, payments, status };
        });
        return { ...s, documents: docs };
      });
    },
    addSupplier: (s) => {
      const id = `SUP-${Date.now()}`;
      const entity: SupplierEntity = { id, produits: [], articles: s.articles || [], ...s } as SupplierEntity;
      setState(st => ({ ...st, suppliersList: [entity, ...st.suppliersList] }));
      return entity;
    },
    updateSupplier: (id, partial) => {
      setState(st => ({ ...st, suppliersList: st.suppliersList.map(s => s.id === id ? { ...s, ...partial } : s) }));
    },
    deleteSupplier: (id) => {
      setState(st => ({ ...st, suppliersList: st.suppliersList.filter(s => s.id !== id) }));
    },
    addSupplierInvoice: (invInput) => {
      const id = `SINV-${Date.now()}`;
      const inv: SupplierInvoice = { id, ...invInput };
      setState(st => ({ ...st, supplierInvoices: [inv, ...st.supplierInvoices] }));
      
      return inv;
    },
    updateDocument: (id, partial) => {
      setState(st => ({ ...st, documents: st.documents.map(d => d.id === id ? { ...d, ...partial } : d) }));
    },
    addSupplierArticle: (supplierId, articleInput) => {
      const article: SupplierArticle = { id: `ART-${Date.now()}`, ...articleInput };
      setState(st => ({ ...st, suppliersList: st.suppliersList.map(s => s.id === supplierId ? { ...s, articles: [...(s.articles || []), article] } : s) }));
      return article;
    },
    updateSupplierArticle: (supplierId, articleId, partial) => {
      setState(st => ({ ...st, suppliersList: st.suppliersList.map(s => s.id === supplierId ? { ...s, articles: (s.articles || []).map(a => a.id === articleId ? { ...a, ...partial } : a) } : s) }));
    },
    deleteSupplierArticle: (supplierId, articleId) => {
      setState(st => ({ ...st, suppliersList: st.suppliersList.map(s => s.id === supplierId ? { ...s, articles: (s.articles || []).filter(a => a.id !== articleId) } : s) }));
    },
    // Répertoire d'articles global
    addArticle: (articleInput) => {
      const article = { id: `ADIR-${Date.now()}`, ...articleInput };
      setState(st => ({ ...st, articlesDirectory: [article, ...st.articlesDirectory] }));
      return article;
    },
    updateArticle: (id, partial) => {
      setState(st => ({ ...st, articlesDirectory: st.articlesDirectory.map(a => a.id === id ? { ...a, ...partial } : a) }));
    },
    deleteArticle: (id) => {
      setState(st => ({ ...st, articlesDirectory: st.articlesDirectory.filter(a => a.id !== id) }));
    },
    // CRUD Catégories d'articles
    addArticleCategory: (categoryInput) => {
      const category: ArticleCategory = { 
        id: `CAT-${Date.now()}`, 
        dateCreation: new Date().toISOString(),
        ...categoryInput 
      };
      setState(st => ({ ...st, articleCategories: [category, ...st.articleCategories] }));
      return category;
    },
    updateArticleCategory: (id, partial) => {
      setState(st => ({ ...st, articleCategories: st.articleCategories.map(c => c.id === id ? { ...c, ...partial } : c) }));
    },
    deleteArticleCategory: (id) => {
      setState(st => ({ 
        ...st, 
        articleCategories: st.articleCategories.filter(c => c.id !== id),
        // Mettre à jour les lots et articles qui référencent cette catégorie
        articleLots: st.articleLots.map(l => l.categoryId === id ? { ...l, categoryId: 'CAT-UNKNOWN' } : l),
        articles: st.articles.map(a => a.categoryId === id ? { ...a, categoryId: 'CAT-UNKNOWN' } : a)
      }));
    },
    // CRUD Lots d'articles
    addArticleLot: (lotInput) => {
      const lot: ArticleLot = { 
        id: `LOT-${Date.now()}`, 
        dateCreation: new Date().toISOString(),
        ...lotInput 
      };
      setState(st => ({ ...st, articleLots: [lot, ...st.articleLots] }));
      return lot;
    },
    updateArticleLot: (id, partial) => {
      setState(st => ({ ...st, articleLots: st.articleLots.map(l => l.id === id ? { ...l, ...partial } : l) }));
    },
    deleteArticleLot: (id) => {
      setState(st => ({ 
        ...st, 
        articleLots: st.articleLots.filter(l => l.id !== id),
        articles: st.articles.map(a => a.lotId === id ? { ...a, lotId: undefined } : a)
      }));
    },
    // CRUD Articles avancés
    addAdvancedArticle: (articleInput) => {
      const article: Article = { 
        id: `ART-${Date.now()}`, 
        dateCreation: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        ...articleInput 
      };
      setState(st => ({ ...st, articles: [article, ...st.articles] }));
      return article;
    },
    updateAdvancedArticle: (id, partial) => {
      setState(st => ({ 
        ...st, 
        articles: st.articles.map(a => a.id === id ? { ...a, ...partial, lastUpdated: new Date().toISOString() } : a) 
      }));
    },
    deleteAdvancedArticle: (id) => {
      setState(st => ({ ...st, articles: st.articles.filter(a => a.id !== id) }));
    },
    // Workflow intégré
    validateQuote: (quoteId) => {
      const quote = state.documents.find(d => d.id === quoteId);
      if (!quote || quote.type !== 'proforma') {
        throw new Error('Document non trouvé ou n\'est pas un devis');
      }
      const updatedQuote = { ...quote, workflowStatus: 'validated' as const, status: 'validated' as const };
      setState(st => ({ ...st, documents: st.documents.map(d => d.id === quoteId ? updatedQuote : d) }));
      return updatedQuote;
    },
    createOrderFromQuote: (quoteId, orderNumber, contractTerms) => {
      const quote = state.documents.find(d => d.id === quoteId);
      if (!quote || quote.type !== 'proforma') {
        throw new Error('Devis non trouvé');
      }
      
      const year = new Date().getFullYear();
      const seq = nextSequence(state.documents, 'order', year);
      const reference = `${year}-${String(seq).padStart(4, '0')}`;
      const id = formatNumberNew('order', year, seq);
      
      const order: CustomerDocument = {
        ...quote,
        id,
        reference,
        type: 'order',
        orderNumber,
        contractTerms,
        workflowStatus: 'ordered',
        status: 'pending',
        parentDocumentId: quoteId,
        childDocuments: [],
        payments: []
      };
      
      // Mettre à jour le devis parent
      const updatedQuote = { 
        ...quote, 
        childDocuments: [...(quote.childDocuments || []), id],
        workflowStatus: 'ordered' as const
      };
      
      setState(st => ({ 
        ...st, 
        documents: [order, ...st.documents.map(d => d.id === quoteId ? updatedQuote : d)]
      }));
      
      return order;
    },
    createDeliveryFromOrder: (orderId) => {
      const order = state.documents.find(d => d.id === orderId);
      if (!order || order.type !== 'order') {
        throw new Error('Commande non trouvée');
      }
      
      const year = new Date().getFullYear();
      const seq = nextSequence(state.documents, 'delivery', year);
      const reference = `${year}-${String(seq).padStart(4, '0')}`;
      const id = formatNumberNew('delivery', year, seq);
      
      const delivery: CustomerDocument = {
        ...order,
        id,
        reference,
        type: 'delivery',
        workflowStatus: 'delivered',
        status: 'pending',
        parentDocumentId: orderId,
        childDocuments: [],
        payments: []
      };
      
      // Mettre à jour la commande parent
      const updatedOrder = { 
        ...order, 
        childDocuments: [...(order.childDocuments || []), id],
        workflowStatus: 'delivered' as const
      };
      
      setState(st => ({ 
        ...st, 
        documents: [delivery, ...st.documents.map(d => d.id === orderId ? updatedOrder : d)]
      }));
      
      return delivery;
    },
    createInvoiceFromDelivery: (deliveryId) => {
      const delivery = state.documents.find(d => d.id === deliveryId);
      if (!delivery || delivery.type !== 'delivery') {
        throw new Error('Bon de livraison non trouvé');
      }
      
      const year = new Date().getFullYear();
      const seq = nextSequence(state.documents, 'invoice', year);
      const reference = `${year}-${String(seq).padStart(4, '0')}`;
      const id = formatNumberNew('invoice', year, seq);
      
      const invoice: CustomerDocument = {
        ...delivery,
        id,
        reference,
        type: 'invoice',
        workflowStatus: 'completed',
        status: 'pending',
        parentDocumentId: deliveryId,
        childDocuments: [],
        payments: []
      };
      
      // Mettre à jour le BL parent
      const updatedDelivery = { 
        ...delivery, 
        childDocuments: [...(delivery.childDocuments || []), id],
        workflowStatus: 'completed' as const
      };
      
      setState(st => ({ 
        ...st, 
        documents: [invoice, ...st.documents.map(d => d.id === deliveryId ? updatedDelivery : d)]
      }));
      
      return invoice;
    },
    getDocumentWorkflow: (documentId) => {
      const document = state.documents.find(d => d.id === documentId);
      if (!document) return [];
      
      const workflow: CustomerDocument[] = [];
      
      // Remonter jusqu'au document racine
      let current = document;
      while (current.parentDocumentId) {
        const parent = state.documents.find(d => d.id === current.parentDocumentId);
        if (parent) {
          workflow.unshift(parent);
          current = parent;
        } else {
          break;
        }
      }
      
      // Ajouter le document actuel
      workflow.push(document);
      
      // Descendre vers les documents enfants
      const addChildren = (doc: CustomerDocument) => {
        if (doc.childDocuments) {
          doc.childDocuments.forEach(childId => {
            const child = state.documents.find(d => d.id === childId);
            if (child) {
              workflow.push(child);
              addChildren(child);
            }
          });
        }
      };
      
      addChildren(document);
      
      return workflow;
    },
    updateDocumentWorkflow: (documentId, workflowStatus) => {
      setState(st => ({ 
        ...st, 
        documents: st.documents.map(d => d.id === documentId ? { ...d, workflowStatus } : d)
      }));
    },
    // Gestion des clients
    addClient: (clientInput) => {
      const id = `CLI-${Date.now()}`;
      const client: Client = {
        ...clientInput,
        id,
        dateCreation: new Date().toISOString().slice(0, 10),
        totalFacture: 0,
        totalEncaissement: 0,
        soldeImpaye: 0,
        nombreFactures: 0
      };
      setState(st => ({ ...st, clients: [client, ...st.clients] }));
      
      return client;
    },
    updateClient: (id, partial) => {
      setState(st => ({ 
        ...st, 
        clients: st.clients.map(c => c.id === id ? { ...c, ...partial } : c) 
      }));
    },
    deleteClient: (id) => {
      setState(st => ({
        ...st,
        clients: st.clients.filter(c => c.id !== id)
      }));
    },
    // Gestion des décharges
    addDischarge: (dischargeInput) => {
      const id = `DECHARGE N°${String(state.discharges.length + 1).padStart(3, '0')}`;
      const discharge: Discharge = {
        ...dischargeInput,
        id,
        dateCreation: new Date().toISOString().slice(0, 10)
      };
      setState(st => ({ ...st, discharges: [discharge, ...st.discharges] }));
      return discharge;
    },
    updateDischarge: (id, partial) => {
      setState(st => ({
        ...st,
        discharges: st.discharges.map(d => d.id === id ? { ...d, ...partial } : d)
      }));
    },
    deleteDischarge: (id) => {
      setState(st => ({
        ...st,
        discharges: st.discharges.filter(d => d.id !== id)
      }));
    },
    // Gestion des contrats et lettres de commande
    addContractOrder: (contractOrderInput) => {
      const id = `${contractOrderInput.documentType.toUpperCase()}-${String(state.contractOrders.length + 1).padStart(3, '0')}`;
      const contractOrder: ContractOrder = {
        ...contractOrderInput,
        id,
        dateCreation: new Date().toISOString().slice(0, 10)
      };
      setState(st => ({ ...st, contractOrders: [contractOrder, ...st.contractOrders] }));
      return contractOrder;
    },
    updateContractOrder: (id, partial) => {
      setState(st => ({
        ...st,
        contractOrders: st.contractOrders.map(co => co.id === id ? { ...co, ...partial } : co)
      }));
    },
    deleteContractOrder: (id) => {
      setState(st => ({
        ...st,
        contractOrders: st.contractOrders.filter(co => co.id !== id)
      }));
    }
  }), [state.documents, state.suppliersList, state.supplierInvoices, state.clients, state.discharges, state.contractOrders, state.articlesDirectory, state.articleCategories, state.articleLots, state.articles]);

  return <DataContext.Provider value={api}>{children}</DataContext.Provider>;
};

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}


