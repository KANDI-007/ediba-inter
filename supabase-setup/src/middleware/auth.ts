import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { supabase } from '../config/supabase';
import { User } from '../types/user';

interface AuthRequest extends Request {
  user?: User;
}

export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ 
        error: 'Token d\'accès requis',
        code: 'MISSING_TOKEN'
      });
    }

    // Vérifier le token avec Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return res.status(403).json({ 
        error: 'Token invalide ou expiré',
        code: 'INVALID_TOKEN'
      });
    }

    // Récupérer les informations utilisateur depuis la base de données
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id, username, role, email, full_name, is_active')
      .eq('id', user.id)
      .single();

    if (userError || !userData) {
      return res.status(403).json({ 
        error: 'Utilisateur non trouvé',
        code: 'USER_NOT_FOUND'
      });
    }

    if (!userData.is_active) {
      return res.status(403).json({ 
        error: 'Compte utilisateur désactivé',
        code: 'ACCOUNT_DISABLED'
      });
    }

    // Ajouter les informations utilisateur à la requête
    req.user = {
      id: userData.id,
      username: userData.username,
      role: userData.role,
      email: userData.email,
      full_name: userData.full_name,
      is_active: userData.is_active
    };

    next();
  } catch (error) {
    console.error('Erreur d\'authentification:', error);
    return res.status(500).json({ 
      error: 'Erreur interne du serveur',
      code: 'INTERNAL_ERROR'
    });
  }
};

export const requireRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Authentification requise',
        code: 'AUTH_REQUIRED'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Permissions insuffisantes',
        code: 'INSUFFICIENT_PERMISSIONS',
        required: roles,
        current: req.user.role
      });
    }

    next();
  };
};

export const requirePermission = (permission: string) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Authentification requise',
        code: 'AUTH_REQUIRED'
      });
    }

    // Définir les permissions par rôle
    const rolePermissions: Record<string, string[]> = {
      admin: [
        'users.manage', 'settings.manage', 'reports.view', 'reports.export',
        'invoices.create', 'invoices.edit', 'invoices.delete', 'invoices.view',
        'clients.create', 'clients.edit', 'clients.delete', 'clients.view',
        'suppliers.create', 'suppliers.edit', 'suppliers.delete', 'suppliers.view',
        'discharges.create', 'discharges.edit', 'discharges.delete', 'discharges.view',
        'payments.manage', 'fiscal.manage', 'chat.view', 'chat.send', 'chat.manage'
      ],
      comptable: [
        'reports.view', 'reports.export', 'invoices.view', 'invoices.edit',
        'clients.view', 'suppliers.view', 'discharges.view', 'discharges.edit',
        'payments.manage', 'fiscal.manage', 'chat.view', 'chat.send'
      ],
      commercial: [
        'invoices.create', 'invoices.edit', 'invoices.view',
        'clients.create', 'clients.edit', 'clients.view',
        'suppliers.create', 'suppliers.edit', 'suppliers.view',
        'discharges.create', 'discharges.edit', 'discharges.view',
        'reports.view', 'chat.view', 'chat.send'
      ],
      lecture: [
        'invoices.view', 'clients.view', 'suppliers.view', 
        'discharges.view', 'reports.view', 'chat.view'
      ]
    };

    const userPermissions = rolePermissions[req.user.role] || [];
    
    if (!userPermissions.includes(permission)) {
      return res.status(403).json({ 
        error: 'Permission insuffisante',
        code: 'INSUFFICIENT_PERMISSION',
        required: permission,
        userPermissions
      });
    }

    next();
  };
};
