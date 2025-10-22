import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

export interface OnlineUser {
  id: string;
  fullName: string;
  avatar?: string;
  isOnline: boolean;
  lastSeen: Date;
  networkInfo?: {
    ip: string;
    userAgent: string;
    tabId: string;
  };
}

interface UserPresenceContextType {
  onlineUsers: OnlineUser[];
  currentUser: OnlineUser | null;
  isConnected: boolean;
  updatePresence: (isOnline: boolean) => void;
  getUsersOnSameNetwork: () => OnlineUser[];
  getUsersInDifferentTabs: () => OnlineUser[];
}

const UserPresenceContext = createContext<UserPresenceContextType | undefined>(undefined);

export const useUserPresence = () => {
  const context = useContext(UserPresenceContext);
  if (!context) {
    throw new Error('useUserPresence must be used within a UserPresenceProvider');
  }
  return context;
};

interface UserPresenceProviderProps {
  children: React.ReactNode;
  currentUserId: string;
  currentUserName: string;
  currentUserAvatar?: string;
}

export const UserPresenceProvider: React.FC<UserPresenceProviderProps> = ({
  children,
  currentUserId,
  currentUserName,
  currentUserAvatar
}) => {
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);

  // Générer un ID unique pour cet onglet
  const tabId = React.useMemo(() => {
    return `tab_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  // Obtenir l'adresse IP locale (simulation)
  const getLocalIP = useCallback(async () => {
    try {
      // En production, vous devriez utiliser une API pour obtenir l'IP réelle
      // Pour la démo, nous utilisons une IP simulée basée sur l'ID utilisateur
      return `192.168.1.${Math.floor(Math.random() * 254) + 1}`;
    } catch (error) {
      return '192.168.1.100';
    }
  }, []);

  // Initialiser la connexion Socket.IO
  useEffect(() => {
    const newSocket = io('http://localhost:3001', {
      transports: ['websocket', 'polling']
    });

    newSocket.on('connect', async () => {
      setIsConnected(true);
      const localIP = await getLocalIP();
      
      // Envoyer les informations de présence
      newSocket.emit('user-presence', {
        userId: currentUserId,
        fullName: currentUserName,
        avatar: currentUserAvatar,
        isOnline: true,
        networkInfo: {
          ip: localIP,
          userAgent: navigator.userAgent,
          tabId: tabId
        }
      });
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
    });

    newSocket.on('users-online', (users: OnlineUser[]) => {
      setOnlineUsers(users);
    });

    newSocket.on('user-joined', (user: OnlineUser) => {
      setOnlineUsers(prev => {
        const existing = prev.find(u => u.id === user.id);
        if (existing) {
          return prev.map(u => u.id === user.id ? { ...u, ...user } : u);
        }
        return [...prev, user];
      });
    });

    newSocket.on('user-left', (userId: string) => {
      setOnlineUsers(prev => prev.filter(u => u.id !== userId));
    });

    newSocket.on('user-presence-update', (user: OnlineUser) => {
      setOnlineUsers(prev => 
        prev.map(u => u.id === user.id ? { ...u, ...user } : u)
      );
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [currentUserId, currentUserName, currentUserAvatar, tabId, getLocalIP]);

  // Mettre à jour la présence
  const updatePresence = useCallback((isOnline: boolean) => {
    if (socket && isConnected) {
      socket.emit('update-presence', {
        userId: currentUserId,
        isOnline,
        lastSeen: new Date()
      });
    }
  }, [socket, isConnected, currentUserId]);

  // Obtenir les utilisateurs sur le même réseau
  const getUsersOnSameNetwork = useCallback(() => {
    return onlineUsers.filter(user => 
      user.id !== currentUserId && 
      user.networkInfo?.ip && 
      onlineUsers.find(u => u.id === currentUserId)?.networkInfo?.ip === user.networkInfo?.ip
    );
  }, [onlineUsers, currentUserId]);

  // Obtenir les utilisateurs dans d'autres onglets
  const getUsersInDifferentTabs = useCallback(() => {
    return onlineUsers.filter(user => 
      user.id === currentUserId && 
      user.networkInfo?.tabId !== tabId
    );
  }, [onlineUsers, currentUserId, tabId]);

  // Gérer la visibilité de la page
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        updatePresence(false);
      } else {
        updatePresence(true);
      }
    };

    const handleBeforeUnload = () => {
      updatePresence(false);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [updatePresence]);

  // Mettre à jour la présence périodiquement
  useEffect(() => {
    const interval = setInterval(() => {
      updatePresence(true);
    }, 30000); // Toutes les 30 secondes

    return () => clearInterval(interval);
  }, [updatePresence]);

  const value: UserPresenceContextType = {
    onlineUsers,
    currentUser: onlineUsers.find(u => u.id === currentUserId) || null,
    isConnected,
    updatePresence,
    getUsersOnSameNetwork,
    getUsersInDifferentTabs
  };

  return (
    <UserPresenceContext.Provider value={value}>
      {children}
    </UserPresenceContext.Provider>
  );
};
