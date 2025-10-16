import express, { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { asyncHandler, createError } from '../middleware/errorHandler';
import { requirePermission } from '../middleware/auth';

const router = express.Router();

// Rapport des ventes par période
router.get('/sales', requirePermission('reports.view'), asyncHandler(async (req: Request, res: Response) => {
  const { start_date, end_date, type = 'invoice' } = req.query;

  let query = supabase
    .from('documents')
    .select(`
      id,
      type,
      reference,
      date_creation,
      total_ht,
      total_ttc,
      statut,
      clients (
        raison_sociale
      )
    `)
    .eq('type', type);

  if (start_date) {
    query = query.gte('date_creation', start_date);
  }
  if (end_date) {
    query = query.lte('date_creation', end_date);
  }

  const { data: sales, error } = await query.order('date_creation', { ascending: false });

  if (error) {
    throw createError('Erreur lors de la récupération des ventes', 500, 'FETCH_ERROR');
  }

  // Calculer les totaux
  const totalHT = sales?.reduce((sum, sale) => sum + (sale.total_ht || 0), 0) || 0;
  const totalTTC = sales?.reduce((sum, sale) => sum + (sale.total_ttc || 0), 0) || 0;
  const totalTVA = totalTTC - totalHT;

  res.json({
    success: true,
    sales,
    summary: {
      total_ht: totalHT,
      total_ttc: totalTTC,
      total_tva: totalTVA,
      count: sales?.length || 0
    }
  });
}));

// Rapport des clients
router.get('/clients', requirePermission('reports.view'), asyncHandler(async (req: Request, res: Response) => {
  const { data: clients, error } = await supabase
    .from('clients')
    .select(`
      id,
      raison_sociale,
      nom_commercial,
      total_facture,
      total_encaissement,
      solde_impaye,
      nombre_factures,
      created_at
    `)
    .order('total_facture', { ascending: false });

  if (error) {
    throw createError('Erreur lors de la récupération des clients', 500, 'FETCH_ERROR');
  }

  // Calculer les totaux
  const totalFacture = clients?.reduce((sum, client) => sum + (client.total_facture || 0), 0) || 0;
  const totalEncaissement = clients?.reduce((sum, client) => sum + (client.total_encaissement || 0), 0) || 0;
  const totalImpaye = clients?.reduce((sum, client) => sum + (client.solde_impaye || 0), 0) || 0;

  res.json({
    success: true,
    clients,
    summary: {
      total_facture: totalFacture,
      total_encaissement: totalEncaissement,
      total_impaye: totalImpaye,
      count: clients?.length || 0
    }
  });
}));

// Rapport des articles les plus vendus
router.get('/top-articles', requirePermission('reports.view'), asyncHandler(async (req: Request, res: Response) => {
  const { limit = 10 } = req.query;

  const { data: articles, error } = await supabase
    .from('line_items')
    .select(`
      description,
      quantity,
      unit_price,
      total_ht,
      documents (
        type,
        date_creation
      )
    `)
    .eq('documents.type', 'invoice')
    .order('quantity', { ascending: false })
    .limit(Number(limit));

  if (error) {
    throw createError('Erreur lors de la récupération des articles', 500, 'FETCH_ERROR');
  }

  // Grouper par description et calculer les totaux
  const groupedArticles = articles?.reduce((acc: any, item) => {
    const key = item.description;
    if (!acc[key]) {
      acc[key] = {
        description: item.description,
        total_quantity: 0,
        total_amount: 0,
        count: 0
      };
    }
    acc[key].total_quantity += item.quantity || 0;
    acc[key].total_amount += item.total_ht || 0;
    acc[key].count += 1;
    return acc;
  }, {});

  const topArticles = Object.values(groupedArticles || {}).sort((a: any, b: any) => b.total_quantity - a.total_quantity);

  res.json({
    success: true,
    articles: topArticles
  });
}));

// Rapport financier global
router.get('/financial', requirePermission('reports.view'), asyncHandler(async (req: Request, res: Response) => {
  const { start_date, end_date } = req.query;

  // Récupérer les factures
  let invoicesQuery = supabase
    .from('documents')
    .select('total_ht, total_ttc, date_creation')
    .eq('type', 'invoice');

  if (start_date) {
    invoicesQuery = invoicesQuery.gte('date_creation', start_date);
  }
  if (end_date) {
    invoicesQuery = invoicesQuery.lte('date_creation', end_date);
  }

  const { data: invoices, error: invoicesError } = await invoicesQuery;

  if (invoicesError) {
    throw createError('Erreur lors de la récupération des factures', 500, 'FETCH_ERROR');
  }

  // Récupérer les paiements
  let paymentsQuery = supabase
    .from('payments')
    .select('amount, payment_date');

  if (start_date) {
    paymentsQuery = paymentsQuery.gte('payment_date', start_date);
  }
  if (end_date) {
    paymentsQuery = paymentsQuery.lte('payment_date', end_date);
  }

  const { data: payments, error: paymentsError } = await paymentsQuery;

  if (paymentsError) {
    throw createError('Erreur lors de la récupération des paiements', 500, 'FETCH_ERROR');
  }

  // Calculer les totaux
  const totalFacturesHT = invoices?.reduce((sum, inv) => sum + (inv.total_ht || 0), 0) || 0;
  const totalFacturesTTC = invoices?.reduce((sum, inv) => sum + (inv.total_ttc || 0), 0) || 0;
  const totalPaiements = payments?.reduce((sum, pay) => sum + (pay.amount || 0), 0) || 0;
  const totalTVA = totalFacturesTTC - totalFacturesHT;
  const soldeImpaye = totalFacturesTTC - totalPaiements;

  res.json({
    success: true,
    financial: {
      total_factures_ht: totalFacturesHT,
      total_factures_ttc: totalFacturesTTC,
      total_tva: totalTVA,
      total_paiements: totalPaiements,
      solde_impaye: soldeImpaye,
      nombre_factures: invoices?.length || 0,
      nombre_paiements: payments?.length || 0
    }
  });
}));

// Rapport des activités utilisateurs
router.get('/activities', requirePermission('reports.view'), asyncHandler(async (req: Request, res: Response) => {
  const { start_date, end_date, user_id } = req.query;
  const { page = 1, limit = 50 } = req.query;
  const offset = (Number(page) - 1) * Number(limit);

  let query = supabase
    .from('activities')
    .select(`
      *,
      users (
        id,
        username,
        full_name
      )
    `, { count: 'exact' })
    .order('created_at', { ascending: false });

  if (start_date) {
    query = query.gte('created_at', start_date);
  }
  if (end_date) {
    query = query.lte('created_at', end_date);
  }
  if (user_id) {
    query = query.eq('user_id', user_id);
  }

  const { data: activities, error, count } = await query
    .range(offset, offset + Number(limit) - 1);

  if (error) {
    throw createError('Erreur lors de la récupération des activités', 500, 'FETCH_ERROR');
  }

  res.json({
    success: true,
    activities,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total: count || 0,
      pages: Math.ceil((count || 0) / Number(limit))
    }
  });
}));

export default router;
