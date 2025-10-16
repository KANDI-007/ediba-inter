import express, { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { asyncHandler, createError } from '../middleware/errorHandler';
import { requirePermission } from '../middleware/auth';

const router = express.Router();

// Récupération de tous les articles
router.get('/', requirePermission('articles.view'), asyncHandler(async (req: Request, res: Response) => {
  const { page = 1, limit = 10, search, category_id } = req.query;
  const offset = (Number(page) - 1) * Number(limit);

  let query = supabase
    .from('articles')
    .select(`
      *,
      article_categories (
        id,
        name,
        parent_id
      )
    `, { count: 'exact' })
    .order('created_at', { ascending: false });

  // Filtre par recherche
  if (search) {
    query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%,sku.ilike.%${search}%`);
  }

  // Filtre par catégorie
  if (category_id) {
    query = query.eq('category_id', category_id);
  }

  const { data: articles, error, count } = await query
    .range(offset, offset + Number(limit) - 1);

  if (error) {
    throw createError('Erreur lors de la récupération des articles', 500, 'FETCH_ERROR');
  }

  res.json({
    success: true,
    articles,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total: count || 0,
      pages: Math.ceil((count || 0) / Number(limit))
    }
  });
}));

// Récupération d'un article par ID
router.get('/:id', requirePermission('articles.view'), asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const { data: article, error } = await supabase
    .from('articles')
    .select(`
      *,
      article_categories (
        id,
        name,
        parent_id
      )
    `)
    .eq('id', id)
    .single();

  if (error || !article) {
    throw createError('Article non trouvé', 404, 'ARTICLE_NOT_FOUND');
  }

  res.json({
    success: true,
    article
  });
}));

// Création d'un nouvel article
router.post('/', requirePermission('articles.create'), asyncHandler(async (req: Request, res: Response) => {
  const {
    name,
    description,
    sku,
    unit_price,
    category_id,
    stock = 0,
    min_stock = 0,
    max_stock = 0,
    unit = 'pièce',
    weight,
    dimensions,
    brand,
    model,
    material,
    color,
    size,
    notes
  } = req.body;

  if (!name || !unit_price || !category_id) {
    throw createError('Nom, prix unitaire et catégorie sont obligatoires', 400, 'MISSING_FIELDS');
  }

  const { data: article, error } = await supabase
    .from('articles')
    .insert([{
      name,
      description,
      sku,
      unit_price,
      category_id,
      stock,
      min_stock,
      max_stock,
      unit,
      weight,
      dimensions,
      brand,
      model,
      material,
      color,
      size,
      notes
    }])
    .select(`
      *,
      article_categories (
        id,
        name,
        parent_id
      )
    `)
    .single();

  if (error) {
    if (error.code === '23505') {
      throw createError('SKU déjà utilisé', 409, 'DUPLICATE_SKU');
    }
    throw createError('Erreur lors de la création de l\'article', 500, 'CREATE_ERROR');
  }

  res.status(201).json({
    success: true,
    article
  });
}));

// Mise à jour d'un article
router.put('/:id', requirePermission('articles.edit'), asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;

  // Supprimer les champs non modifiables
  delete updateData.id;
  delete updateData.created_at;
  updateData.updated_at = new Date().toISOString();

  const { data: article, error } = await supabase
    .from('articles')
    .update(updateData)
    .eq('id', id)
    .select(`
      *,
      article_categories (
        id,
        name,
        parent_id
      )
    `)
    .single();

  if (error) {
    if (error.code === '23505') {
      throw createError('SKU déjà utilisé', 409, 'DUPLICATE_SKU');
    }
    throw createError('Erreur lors de la mise à jour de l\'article', 500, 'UPDATE_ERROR');
  }

  if (!article) {
    throw createError('Article non trouvé', 404, 'ARTICLE_NOT_FOUND');
  }

  res.json({
    success: true,
    article
  });
}));

// Suppression d'un article
router.delete('/:id', requirePermission('articles.delete'), asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const { error } = await supabase
    .from('articles')
    .delete()
    .eq('id', id);

  if (error) {
    throw createError('Erreur lors de la suppression de l\'article', 500, 'DELETE_ERROR');
  }

  res.json({
    success: true,
    message: 'Article supprimé avec succès'
  });
}));

// Récupération des catégories d'articles
router.get('/categories/all', requirePermission('articles.view'), asyncHandler(async (req: Request, res: Response) => {
  const { data: categories, error } = await supabase
    .from('article_categories')
    .select('*')
    .order('name');

  if (error) {
    throw createError('Erreur lors de la récupération des catégories', 500, 'FETCH_ERROR');
  }

  res.json({
    success: true,
    categories
  });
}));

export default router;
