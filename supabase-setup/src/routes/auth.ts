import express, { Request, Response } from 'express';
import { supabase, supabaseAdmin } from '../config/supabase';
import { asyncHandler, createError } from '../middleware/errorHandler';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Connexion utilisateur
router.post('/login', asyncHandler(async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    throw createError('Nom d\'utilisateur et mot de passe requis', 400, 'MISSING_CREDENTIALS');
  }

  try {
    // Récupérer l'utilisateur depuis la base de données
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('username', username)
      .eq('is_active', true)
      .single();

    if (userError || !userData) {
      throw createError('Identifiants invalides', 401, 'INVALID_CREDENTIALS');
    }

    // Pour la démo, on utilise un mot de passe simple
    // En production, il faudrait utiliser bcrypt pour hasher les mots de passe
    const validPasswords: Record<string, string> = {
      'alayi': 'Alayi7@',
      'esso': 'Esso28@',
      'gloria': 'Gloria127@',
      'paul': 'Paul832@',
      'gym': 'Gym74@',
      'sam': 'Sam384@'
    };

    if (validPasswords[username] !== password) {
      throw createError('Identifiants invalides', 401, 'INVALID_CREDENTIALS');
    }

    // Créer un token JWT simple (en production, utiliser Supabase Auth)
    const token = Buffer.from(JSON.stringify({
      id: userData.id,
      username: userData.username,
      role: userData.role,
      email: userData.email
    })).toString('base64');

    // Mettre à jour la dernière connexion
    await supabaseAdmin
      .from('users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', userData.id);

    res.json({
      success: true,
      token,
      user: {
        id: userData.id,
        username: userData.username,
        fullName: userData.full_name,
        email: userData.email,
        role: userData.role,
        avatar: userData.avatar_url
      }
    });
  } catch (error) {
    console.error('Erreur de connexion:', error);
    throw createError('Erreur de connexion', 500, 'LOGIN_ERROR');
  }
}));

// Déconnexion utilisateur
router.post('/logout', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Déconnexion réussie'
  });
}));

// Vérification du token
router.get('/verify', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
  res.json({
    success: true,
    user: req.user
  });
}));

// Récupération du profil utilisateur
router.get('/profile', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
  const { data: userData, error } = await supabase
    .from('users')
    .select('id, username, email, full_name, role, avatar_url, phone, address, join_date, last_login')
    .eq('id', req.user!.id)
    .single();

  if (error || !userData) {
    throw createError('Profil utilisateur non trouvé', 404, 'USER_NOT_FOUND');
  }

  res.json({
    success: true,
    user: userData
  });
}));

// Mise à jour du profil utilisateur
router.put('/profile', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
  const { full_name, phone, address, avatar_url } = req.body;
  const userId = req.user!.id;

  const updateData: any = {};
  if (full_name) updateData.full_name = full_name;
  if (phone) updateData.phone = phone;
  if (address) updateData.address = address;
  if (avatar_url) updateData.avatar_url = avatar_url;
  updateData.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from('users')
    .update(updateData)
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    throw createError('Erreur lors de la mise à jour du profil', 500, 'UPDATE_ERROR');
  }

  res.json({
    success: true,
    user: data
  });
}));

// Changement de mot de passe
router.put('/change-password', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user!.id;

  if (!currentPassword || !newPassword) {
    throw createError('Mot de passe actuel et nouveau mot de passe requis', 400, 'MISSING_PASSWORDS');
  }

  // Pour la démo, validation simple
  // En production, il faudrait vérifier le mot de passe actuel et hasher le nouveau
  if (newPassword.length < 6) {
    throw createError('Le nouveau mot de passe doit contenir au moins 6 caractères', 400, 'WEAK_PASSWORD');
  }

  res.json({
    success: true,
    message: 'Mot de passe modifié avec succès'
  });
}));

// Récupération de la liste des utilisateurs (admin seulement)
router.get('/users', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
  if (req.user!.role !== 'admin') {
    throw createError('Accès non autorisé', 403, 'FORBIDDEN');
  }

  const { data: users, error } = await supabase
    .from('users')
    .select('id, username, email, full_name, role, is_active, join_date, last_login')
    .order('created_at', { ascending: false });

  if (error) {
    throw createError('Erreur lors de la récupération des utilisateurs', 500, 'FETCH_ERROR');
  }

  res.json({
    success: true,
    users
  });
}));

// Création d'un nouvel utilisateur (admin seulement)
router.post('/users', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
  if (req.user!.role !== 'admin') {
    throw createError('Accès non autorisé', 403, 'FORBIDDEN');
  }

  const { username, email, full_name, role, phone, address } = req.body;

  if (!username || !email || !full_name || !role) {
    throw createError('Tous les champs obligatoires doivent être remplis', 400, 'MISSING_FIELDS');
  }

  const validRoles = ['admin', 'comptable', 'commercial', 'lecture'];
  if (!validRoles.includes(role)) {
    throw createError('Rôle invalide', 400, 'INVALID_ROLE');
  }

  const { data, error } = await supabase
    .from('users')
    .insert([{
      username,
      email,
      full_name,
      role,
      phone,
      address,
      is_active: true
    }])
    .select()
    .single();

  if (error) {
    if (error.code === '23505') {
      throw createError('Nom d\'utilisateur ou email déjà utilisé', 409, 'DUPLICATE_USER');
    }
    throw createError('Erreur lors de la création de l\'utilisateur', 500, 'CREATE_ERROR');
  }

  res.status(201).json({
    success: true,
    user: data
  });
}));

export default router;
