import express, { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { asyncHandler, createError } from '../middleware/errorHandler';
import { requirePermission } from '../middleware/auth';

const router = express.Router();

// Récupération de tous les documents
router.get('/', requirePermission('documents.view'), asyncHandler(async (req: Request, res: Response) => {
  const { page = 1, limit = 10, type, statut, client_id } = req.query;
  const offset = (Number(page) - 1) * Number(limit);

  let query = supabase
    .from('documents')
    .select(`
      *,
      clients (
        id,
        raison_sociale,
        nom_commercial
      )
    `, { count: 'exact' })
    .order('created_at', { ascending: false });

  // Filtres
  if (type) {
    query = query.eq('type', type);
  }
  if (statut) {
    query = query.eq('statut', statut);
  }
  if (client_id) {
    query = query.eq('client_id', client_id);
  }

  const { data: documents, error, count } = await query
    .range(offset, offset + Number(limit) - 1);

  if (error) {
    throw createError('Erreur lors de la récupération des documents', 500, 'FETCH_ERROR');
  }

  res.json({
    success: true,
    documents,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total: count || 0,
      pages: Math.ceil((count || 0) / Number(limit))
    }
  });
}));

// Récupération d'un document par ID
router.get('/:id', requirePermission('documents.view'), asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const { data: document, error } = await supabase
    .from('documents')
    .select(`
      *,
      clients (
        id,
        raison_sociale,
        nom_commercial,
        adresse,
        ville,
        telephone,
        email
      ),
      line_items (
        id,
        description,
        quantity,
        unit_price,
        total_ht,
        received_quantity
      )
    `)
    .eq('id', id)
    .single();

  if (error || !document) {
    throw createError('Document non trouvé', 404, 'DOCUMENT_NOT_FOUND');
  }

  res.json({
    success: true,
    document
  });
}));

// Création d'un nouveau document
router.post('/', requirePermission('documents.create'), asyncHandler(async (req: Request, res: Response) => {
  const {
    type,
    reference,
    client_id,
    date_creation,
    date_echeance,
    tva = 18.5,
    statut = 'pending',
    workflow_status = 'draft',
    parent_document_id,
    order_number,
    contract_order_reference,
    objet = 'CONSOMMABLE',
    total_ht = 0,
    total_ttc = 0,
    line_items = []
  } = req.body;

  if (!type || !reference || !client_id || !date_creation) {
    throw createError('Type, référence, client et date de création sont obligatoires', 400, 'MISSING_FIELDS');
  }

  // Créer le document
  const { data: document, error: docError } = await supabase
    .from('documents')
    .insert([{
      type,
      reference,
      client_id,
      date_creation,
      date_echeance,
      tva,
      statut,
      workflow_status,
      parent_document_id,
      order_number,
      contract_order_reference,
      objet,
      total_ht,
      total_ttc
    }])
    .select()
    .single();

  if (docError) {
    if (docError.code === '23505') {
      throw createError('Référence déjà utilisée', 409, 'DUPLICATE_REFERENCE');
    }
    throw createError('Erreur lors de la création du document', 500, 'CREATE_ERROR');
  }

  // Créer les lignes de document
  if (line_items && line_items.length > 0) {
    const lineItemsData = line_items.map((item: any) => ({
      document_id: document.id,
      description: item.description,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total_ht: item.total_ht,
      received_quantity: item.received_quantity || 0
    }));

    const { error: itemsError } = await supabase
      .from('line_items')
      .insert(lineItemsData);

    if (itemsError) {
      throw createError('Erreur lors de la création des lignes de document', 500, 'CREATE_ITEMS_ERROR');
    }
  }

  res.status(201).json({
    success: true,
    document
  });
}));

// Mise à jour d'un document
router.put('/:id', requirePermission('documents.edit'), asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;

  // Supprimer les champs non modifiables
  delete updateData.id;
  delete updateData.created_at;
  updateData.updated_at = new Date().toISOString();

  const { data: document, error } = await supabase
    .from('documents')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    if (error.code === '23505') {
      throw createError('Référence déjà utilisée', 409, 'DUPLICATE_REFERENCE');
    }
    throw createError('Erreur lors de la mise à jour du document', 500, 'UPDATE_ERROR');
  }

  if (!document) {
    throw createError('Document non trouvé', 404, 'DOCUMENT_NOT_FOUND');
  }

  res.json({
    success: true,
    document
  });
}));

// Suppression d'un document
router.delete('/:id', requirePermission('documents.delete'), asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const { error } = await supabase
    .from('documents')
    .delete()
    .eq('id', id);

  if (error) {
    throw createError('Erreur lors de la suppression du document', 500, 'DELETE_ERROR');
  }

  res.json({
    success: true,
    message: 'Document supprimé avec succès'
  });
}));

export default router;
