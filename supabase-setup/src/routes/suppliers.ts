import express, { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { asyncHandler, createError } from '../middleware/errorHandler';
import { requirePermission } from '../middleware/auth';

const router = express.Router();

// Récupération de tous les fournisseurs
router.get('/', requirePermission('suppliers.view'), asyncHandler(async (req: Request, res: Response) => {
  const { page = 1, limit = 10, search, statut } = req.query;
  const offset = (Number(page) - 1) * Number(limit);

  let query = supabase
    .from('suppliers')
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

  const { data: suppliers, error, count } = await query
    .range(offset, offset + Number(limit) - 1);

  if (error) {
    throw createError('Erreur lors de la récupération des fournisseurs', 500, 'FETCH_ERROR');
  }

  res.json({
    success: true,
    suppliers,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total: count || 0,
      pages: Math.ceil((count || 0) / Number(limit))
    }
  });
}));

// Récupération d'un fournisseur par ID
router.get('/:id', requirePermission('suppliers.view'), asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const { data: supplier, error } = await supabase
    .from('suppliers')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !supplier) {
    throw createError('Fournisseur non trouvé', 404, 'SUPPLIER_NOT_FOUND');
  }

  res.json({
    success: true,
    supplier
  });
}));

// Création d'un nouveau fournisseur
router.post('/', requirePermission('suppliers.create'), asyncHandler(async (req: Request, res: Response) => {
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
    delai_paiement,
    remise,
    statut = 'actif'
  } = req.body;

  if (!raison_sociale || !nif || !adresse || !ville || !telephone) {
    throw createError('Tous les champs obligatoires doivent être remplis', 400, 'MISSING_FIELDS');
  }

  const { data: supplier, error } = await supabase
    .from('suppliers')
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
      delai_paiement,
      remise,
      statut
    }])
    .select()
    .single();

  if (error) {
    if (error.code === '23505') {
      throw createError('NIF déjà utilisé', 409, 'DUPLICATE_NIF');
    }
    throw createError('Erreur lors de la création du fournisseur', 500, 'CREATE_ERROR');
  }

  res.status(201).json({
    success: true,
    supplier
  });
}));

// Mise à jour d'un fournisseur
router.put('/:id', requirePermission('suppliers.edit'), asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;

  // Supprimer les champs non modifiables
  delete updateData.id;
  delete updateData.created_at;
  updateData.updated_at = new Date().toISOString();

  const { data: supplier, error } = await supabase
    .from('suppliers')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    if (error.code === '23505') {
      throw createError('NIF déjà utilisé', 409, 'DUPLICATE_NIF');
    }
    throw createError('Erreur lors de la mise à jour du fournisseur', 500, 'UPDATE_ERROR');
  }

  if (!supplier) {
    throw createError('Fournisseur non trouvé', 404, 'SUPPLIER_NOT_FOUND');
  }

  res.json({
    success: true,
    supplier
  });
}));

// Suppression d'un fournisseur
router.delete('/:id', requirePermission('suppliers.delete'), asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const { error } = await supabase
    .from('suppliers')
    .delete()
    .eq('id', id);

  if (error) {
    throw createError('Erreur lors de la suppression du fournisseur', 500, 'DELETE_ERROR');
  }

  res.json({
    success: true,
    message: 'Fournisseur supprimé avec succès'
  });
}));

export default router;
