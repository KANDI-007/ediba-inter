import express, { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { asyncHandler, createError } from '../middleware/errorHandler';
import { requirePermission } from '../middleware/auth';

const router = express.Router();

// Récupération de tous les clients
router.get('/', requirePermission('clients.view'), asyncHandler(async (req: Request, res: Response) => {
  const { page = 1, limit = 10, search, statut } = req.query;
  const offset = (Number(page) - 1) * Number(limit);

  let query = supabase
    .from('clients')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false });

  // Filtre par recherche
  if (search) {
    query = query.or(`raison_sociale.ilike.%${search}%,nom_commercial.ilike.%${search}%,nif.ilike.%${search}%`);
  }

  // Filtre par statut
  if (statut) {
    query = query.eq('statut', statut);
  }

  // Pagination
  query = query.range(offset, offset + Number(limit) - 1);

  const { data: clients, error, count } = await query;

  if (error) {
    throw createError('Erreur lors de la récupération des clients', 500, 'FETCH_ERROR');
  }

  res.json({
    success: true,
    clients,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total: count || 0,
      pages: Math.ceil((count || 0) / Number(limit))
    }
  });
}));

// Récupération d'un client par ID
router.get('/:id', requirePermission('clients.view'), asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const { data: client, error } = await supabase
    .from('clients')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !client) {
    throw createError('Client non trouvé', 404, 'CLIENT_NOT_FOUND');
  }

  res.json({
    success: true,
    client
  });
}));

// Création d'un nouveau client
router.post('/', requirePermission('clients.create'), asyncHandler(async (req: Request, res: Response) => {
  const {
    raison_sociale,
    nom_commercial,
    nif,
    rccm,
    adresse,
    ville,
    telephone,
    email,
    contact_principal,
    secteur_activite,
    regime_fiscal,
    delai_paiement,
    remise,
    limite_credit,
    statut
  } = req.body;

  // Validation des champs obligatoires
  if (!raison_sociale || !nif || !adresse || !ville || !telephone) {
    throw createError('Les champs obligatoires doivent être remplis', 400, 'MISSING_FIELDS');
  }

  const { data: client, error } = await supabase
    .from('clients')
    .insert([{
      raison_sociale,
      nom_commercial,
      nif,
      rccm,
      adresse,
      ville,
      telephone,
      email,
      contact_principal,
      secteur_activite,
      regime_fiscal: regime_fiscal || 'Réel Normal',
      delai_paiement: delai_paiement || 30,
      remise: remise || 0,
      limite_credit: limite_credit || 0,
      statut: statut || 'actif'
    }])
    .select()
    .single();

  if (error) {
    if (error.code === '23505') {
      throw createError('Un client avec ce NIF existe déjà', 409, 'DUPLICATE_NIF');
    }
    throw createError('Erreur lors de la création du client', 500, 'CREATE_ERROR');
  }

  res.status(201).json({
    success: true,
    client
  });
}));

// Mise à jour d'un client
router.put('/:id', requirePermission('clients.edit'), asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = { ...req.body, updated_at: new Date().toISOString() };

  const { data: client, error } = await supabase
    .from('clients')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      throw createError('Client non trouvé', 404, 'CLIENT_NOT_FOUND');
    }
    if (error.code === '23505') {
      throw createError('Un client avec ce NIF existe déjà', 409, 'DUPLICATE_NIF');
    }
    throw createError('Erreur lors de la mise à jour du client', 500, 'UPDATE_ERROR');
  }

  res.json({
    success: true,
    client
  });
}));

// Suppression d'un client
router.delete('/:id', requirePermission('clients.delete'), asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  // Vérifier s'il y a des documents liés à ce client
  const { data: documents, error: documentsError } = await supabase
    .from('documents')
    .select('id')
    .eq('client_id', id)
    .limit(1);

  if (documentsError) {
    throw createError('Erreur lors de la vérification des documents', 500, 'CHECK_ERROR');
  }

  if (documents && documents.length > 0) {
    throw createError('Impossible de supprimer ce client car il a des documents associés', 409, 'HAS_DOCUMENTS');
  }

  const { error } = await supabase
    .from('clients')
    .delete()
    .eq('id', id);

  if (error) {
    throw createError('Erreur lors de la suppression du client', 500, 'DELETE_ERROR');
  }

  res.json({
    success: true,
    message: 'Client supprimé avec succès'
  });
}));

// Statistiques des clients
router.get('/stats/overview', requirePermission('clients.view'), asyncHandler(async (req: Request, res: Response) => {
  const { data: stats, error } = await supabase
    .from('clients')
    .select(`
      statut,
      total_facture,
      total_encaissement,
      solde_impaye,
      nombre_factures
    `);

  if (error) {
    throw createError('Erreur lors de la récupération des statistiques', 500, 'STATS_ERROR');
  }

  const overview = {
    total: stats.length,
    actifs: stats.filter(c => c.statut === 'actif').length,
    inactifs: stats.filter(c => c.statut === 'inactif').length,
    suspendus: stats.filter(c => c.statut === 'suspendu').length,
    totalFacture: stats.reduce((sum, c) => sum + (c.total_facture || 0), 0),
    totalEncaissement: stats.reduce((sum, c) => sum + (c.total_encaissement || 0), 0),
    soldeImpaye: stats.reduce((sum, c) => sum + (c.solde_impaye || 0), 0),
    nombreFactures: stats.reduce((sum, c) => sum + (c.nombre_factures || 0), 0)
  };

  res.json({
    success: true,
    stats: overview
  });
}));

// Top clients par chiffre d'affaires
router.get('/stats/top-clients', requirePermission('clients.view'), asyncHandler(async (req: Request, res: Response) => {
  const { limit = 5 } = req.query;

  const { data: topClients, error } = await supabase
    .from('clients')
    .select('id, raison_sociale, total_facture, nombre_factures')
    .order('total_facture', { ascending: false })
    .limit(Number(limit));

  if (error) {
    throw createError('Erreur lors de la récupération du top clients', 500, 'TOP_CLIENTS_ERROR');
  }

  res.json({
    success: true,
    topClients
  });
}));

export default router;
