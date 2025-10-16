import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useActivityOptional } from './ActivityContext';

export type UserRole = 'admin' | 'comptable' | 'commercial' | 'lecture';

export interface User {
  id: string;
  username: string;
  role: UserRole;
  permissions: string[];
  fullName: string;
  email: string;
  lastLogin?: string;
  avatar?: string;
  profileImage?: string;
  phone?: string;
  address?: string;
  joinDate?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  error: string | null;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: UserRole) => boolean;
  // User management
  users: { username: string; password: string; user: User }[];
  addUser: (u: { username: string; password: string; role: UserRole; fullName: string; email: string }) => void;
  deleteUser: (username: string) => void;
  // Profile management
  updateUserProfile: (updatedUser: Partial<User>) => void;
  updateUserProfileImage: (imageData: string) => void;
  updateUser: (updatedUser: User) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const activityCtx = useActivityOptional();
  const [users, setUsers] = useState<{ username: string; password: string; user: User }[]>([]);

  // Définition des rôles et permissions
  const rolePermissions: Record<UserRole, string[]> = {
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

  const defaultUserDatabase: Record<string, { password: string; user: User }> = {
    'Alayi': {
      password: 'Alayi7@',
      user: {
        id: '1',
        username: 'Alayi',
        role: 'admin',
        permissions: rolePermissions.admin,
        fullName: 'Mme ALAYI Abide',
        email: 'alayi@edibainter.com',
        lastLogin: new Date().toISOString(),
        joinDate: '2024-01-01',
        phone: '+228 90 12 34 56',
        address: 'Lomé, Togo - Total, 331 Rue AGP'
      }
    },
    'Esso': {
      password: 'Esso28@',
      user: {
        id: '2',
        username: 'Esso',
        role: 'comptable',
        permissions: rolePermissions.comptable,
        fullName: 'M. ESSO Comptable',
        email: 'esso@edibainter.com',
        lastLogin: new Date().toISOString(),
        joinDate: '2024-01-15',
        phone: '+228 90 23 45 67',
        address: 'Lomé, Togo - Centre ville'
      }
    },
    'Gloria': {
      password: 'Gloria127@',
      user: {
        id: '3',
        username: 'Gloria',
        role: 'commercial',
        permissions: rolePermissions.commercial,
        fullName: 'Mme GLORIA Commerciale',
        email: 'gloria@edibainter.com',
        lastLogin: new Date().toISOString(),
        joinDate: '2024-02-01',
        phone: '+228 90 34 56 78',
        address: 'Lomé, Togo - Tokoin'
      }
    },
    'Paul': {
      password: 'Paul832@',
      user: {
        id: '4',
        username: 'Paul',
        role: 'commercial',
        permissions: rolePermissions.commercial,
        fullName: 'M. PAUL Commercial',
        email: 'paul@edibainter.com',
        lastLogin: new Date().toISOString(),
        joinDate: '2024-02-15',
        phone: '+228 90 45 67 89',
        address: 'Lomé, Togo - Bè'
      }
    },
    'Gym': {
      password: 'Gym74@',
      user: {
        id: '5',
        username: 'Gym',
        role: 'lecture',
        permissions: rolePermissions.lecture,
        fullName: 'M. GYM Lecteur',
        email: 'gym@edibainter.com',
        lastLogin: new Date().toISOString(),
        joinDate: '2024-03-01',
        phone: '+228 90 56 78 90',
        address: 'Lomé, Togo - Agoè'
      }
    },
    'Sam': {
      password: 'Sam384@',
      user: {
        id: '6',
        username: 'Sam',
        role: 'comptable',
        permissions: rolePermissions.comptable,
        fullName: 'M. SAM Comptable',
        email: 'sam@edibainter.com',
        lastLogin: new Date().toISOString(),
        joinDate: '2024-03-15',
        phone: '+228 90 67 89 01',
        address: 'Lomé, Togo - Nyékonakpoé'
      }
    }
  };

  const login = async (username: string, password: string) => {
    const db = users.length ? users.reduce((map, entry) => { (map as any)[entry.username] = { password: entry.password, user: entry.user }; return map; }, {} as Record<string, { password: string; user: User }>) : defaultUserDatabase;
    const userData = (db as any)[username];
    if (!userData || userData.password !== password) {
      setError("Nom d'utilisateur ou mot de passe incorrect");
      setIsAuthenticated(false);
      setUser(null);
      activityCtx?.logActivity('Connexion', 'Authentification', `Échec de connexion pour ${username}`, undefined, false);
      return;
    }
    setError(null);
    setIsAuthenticated(true);
    setUser(userData.user);
    
    // Log de la connexion réussie
    activityCtx?.logActivity('Connexion', 'Authentification', `Connexion réussie pour ${userData.user.fullName}`, undefined, true);
    
    // Sauvegarder la session dans sessionStorage (spécifique à chaque onglet)
    sessionStorage.setItem('ediba.user.session', JSON.stringify({
      user: userData.user,
      loginTime: new Date().toISOString()
    }));
  };

  const logout = () => {
    if (user) {
      activityCtx?.logActivity('Déconnexion', 'Authentification', `Déconnexion de ${user.fullName}`, undefined, true);
    }
    setIsAuthenticated(false);
    setUser(null);
    setError(null);
    sessionStorage.removeItem('ediba.user.session');
  };

  const hasPermission = (permission: string): boolean => {
    return user?.permissions.includes(permission) || false;
  };

  const hasRole = (role: UserRole): boolean => {
    return user?.role === role || false;
  };

  // Vérifier la session au chargement
  React.useEffect(() => {
    const session = sessionStorage.getItem('ediba.user.session');
    const storedUsers = localStorage.getItem('ediba.users');
    try {
      const parsed: { username: string; password: string; user: User }[] = storedUsers ? JSON.parse(storedUsers) : [];
      // Merge defaults with stored; stored overrides if same username
      const byUsername: Record<string, { username: string; password: string; user: User }> = {};
      // put stored first to keep any edits
      parsed.forEach(u => { byUsername[u.username] = u; });
      Object.entries(defaultUserDatabase).forEach(([username, data]) => {
        if (!byUsername[username]) {
          byUsername[username] = { username, password: (data as any).password, user: (data as any).user };
        }
      });
      const merged = Object.values(byUsername);
      setUsers(merged);
      localStorage.setItem('ediba.users', JSON.stringify(merged));
    } catch {
      // Fallback: seed defaults
      const seeded = Object.entries(defaultUserDatabase).map(([username, data]) => ({ username, password: (data as any).password, user: (data as any).user }));
      setUsers(seeded);
      localStorage.setItem('ediba.users', JSON.stringify(seeded));
    }
    if (session) {
      try {
        const { user: sessionUser } = JSON.parse(session);
        setUser(sessionUser);
        setIsAuthenticated(true);
      } catch (error) {
        sessionStorage.removeItem('ediba.user.session');
      }
    }
  }, []);

  // Persist users on change
  React.useEffect(() => {
    localStorage.setItem('ediba.users', JSON.stringify(users));
  }, [users]);

  const addUser: AuthContextType['addUser'] = (u) => {
    const newUser: { username: string; password: string; user: User } = {
      username: u.username,
      password: u.password,
      user: {
        username: u.username,
        role: u.role,
        permissions: rolePermissions[u.role],
        fullName: u.fullName,
        email: u.email,
        lastLogin: undefined
      }
    };
    setUsers(prev => [newUser, ...prev.filter(e => e.username !== u.username)]);
    activityCtx?.logActivity('Gestion utilisateurs', 'Création', `Utilisateur ajouté: ${u.username}`);
  };

  const deleteUser: AuthContextType['deleteUser'] = (username) => {
    setUsers(prev => prev.filter(e => e.username !== username));
    activityCtx?.logActivity('Gestion utilisateurs', 'Suppression', `Utilisateur supprimé: ${username}`);
  };

  const updateUserProfile: AuthContextType['updateUserProfile'] = (updatedUser) => {
    if (!user) return;
    
    const updatedUserData = { ...user, ...updatedUser };
    setUser(updatedUserData);
    
    // Mettre à jour dans la liste des utilisateurs
    setUsers(prev => prev.map(u => 
      u.username === user.username 
        ? { ...u, user: updatedUserData }
        : u
    ));
    
    // Sauvegarder la session mise à jour dans sessionStorage
    sessionStorage.setItem('ediba.user.session', JSON.stringify({ user: updatedUserData }));
    
    activityCtx?.logActivity('Profil utilisateur', 'Modification', `Profil mis à jour: ${user.username}`);
  };

  const updateUserProfileImage: AuthContextType['updateUserProfileImage'] = (imageData) => {
    if (!user) return;
    
    updateUserProfile({ profileImage: imageData });
    activityCtx?.logActivity('Profil utilisateur', 'Modification', `Photo de profil mise à jour: ${user.username}`);
  };

  const updateUser: AuthContextType['updateUser'] = async (updatedUserData) => {
    if (!user) return;
    
    try {
      // Mettre à jour l'utilisateur actuel
      setUser(updatedUserData);
      
      // Mettre à jour dans la liste des utilisateurs
      setUsers(prev => prev.map(u => 
        u.username === user.username 
          ? { ...u, user: updatedUserData }
          : u
      ));
      
      // Sauvegarder la session mise à jour dans sessionStorage
      sessionStorage.setItem('ediba.user.session', JSON.stringify({ user: updatedUserData }));
      
      // Logger l'activité
      activityCtx?.logActivity('Profil utilisateur', 'Modification', `Profil complet mis à jour: ${user.username}`);
      
      console.log('✅ Profil utilisateur mis à jour:', updatedUserData);
    } catch (error) {
      console.error('❌ Erreur mise à jour profil:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      login, 
      logout, 
      error, 
      hasPermission, 
      hasRole,
      users,
      addUser,
      deleteUser,
      updateUserProfile,
      updateUserProfileImage,
      updateUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};