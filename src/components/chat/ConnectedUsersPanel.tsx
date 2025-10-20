import React, { useState } from 'react';
import { 
  Users, 
  Wifi, 
  Monitor, 
  Globe, 
  ChevronDown, 
  ChevronUp,
  Circle,
  Clock
} from 'lucide-react';
import { useUserPresence } from '../../contexts/UserPresenceContext';

const ConnectedUsersPanel: React.FC = () => {
  const { 
    onlineUsers, 
    currentUser, 
    isConnected, 
    getUsersOnSameNetwork, 
    getUsersInDifferentTabs 
  } = useUserPresence();
  
  const [isExpanded, setIsExpanded] = useState(false);

  const usersOnSameNetwork = getUsersOnSameNetwork();
  const usersInDifferentTabs = getUsersInDifferentTabs();
  const otherUsers = onlineUsers.filter(user => user.id !== currentUser?.id);

  const formatLastSeen = (lastSeen: Date) => {
    const now = new Date();
    const diff = now.getTime() - lastSeen.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'À l\'instant';
    if (minutes < 60) return `Il y a ${minutes}min`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `Il y a ${hours}h`;
    const days = Math.floor(hours / 24);
    return `Il y a ${days}j`;
  };

  const getNetworkIcon = (user: any) => {
    if (usersOnSameNetwork.some(u => u.id === user.id)) {
      return <Wifi className="w-4 h-4 text-green-500" />;
    }
    return <Globe className="w-4 h-4 text-blue-500" />;
  };

  const getTabIcon = (user: any) => {
    if (usersInDifferentTabs.some(u => u.id === user.id)) {
      return <Monitor className="w-4 h-4 text-purple-500" />;
    }
    return null;
  };

  if (!isConnected || otherUsers.length === 0) {
    return null;
  }

  return (
    <div className="border-t border-gray-200 bg-gray-50">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <Users className="w-5 h-5 text-gray-600" />
            {otherUsers.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {otherUsers.length}
              </span>
            )}
          </div>
          <div className="text-left">
            <p className="text-sm font-medium text-gray-900">
              Utilisateurs connectés
            </p>
            <p className="text-xs text-gray-500">
              {otherUsers.length} utilisateur{otherUsers.length > 1 ? 's' : ''} en ligne
            </p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-gray-500" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-500" />
        )}
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 space-y-2 max-h-64 overflow-y-auto">
          {/* Utilisateurs sur le même réseau */}
          {usersOnSameNetwork.length > 0 && (
            <div className="mb-3">
              <div className="flex items-center gap-2 mb-2">
                <Wifi className="w-4 h-4 text-green-500" />
                <span className="text-xs font-medium text-gray-700">
                  Même réseau ({usersOnSameNetwork.length})
                </span>
              </div>
              <div className="space-y-1">
                {usersOnSameNetwork.map((user) => (
                  <div key={user.id} className="user-presence">
                    <div className="user-presence-avatar">
                      <img
                        src="./default-avatar.png"
                        alt={user.fullName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="online-status">
                        <div className="user-presence-dot"></div>
                      </div>
                    </div>
                    <div className="user-presence-info">
                      <div className="user-presence-name">{user.fullName}</div>
                      <div className="user-presence-status">
                        <Circle className="w-3 h-3 text-green-500" />
                        <span>En ligne</span>
                        <span className="text-gray-400">•</span>
                        <span>{user.networkInfo?.ip}</span>
                      </div>
                    </div>
                    <div className="tab-indicator">
                      <Wifi className="w-3 h-3" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Utilisateurs dans d'autres onglets */}
          {usersInDifferentTabs.length > 0 && (
            <div className="mb-3">
              <div className="flex items-center gap-2 mb-2">
                <Monitor className="w-4 h-4 text-purple-500" />
                <span className="text-xs font-medium text-gray-700">
                  Autres onglets ({usersInDifferentTabs.length})
                </span>
              </div>
              <div className="space-y-1">
                {usersInDifferentTabs.map((user) => (
                  <div key={user.id} className="user-presence">
                    <div className="user-presence-avatar">
                      <img
                        src="./default-avatar.png"
                        alt={user.fullName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="online-status">
                        <div className="user-presence-dot"></div>
                      </div>
                    </div>
                    <div className="user-presence-info">
                      <div className="user-presence-name">{user.fullName}</div>
                      <div className="user-presence-status">
                        <Circle className="w-3 h-3 text-green-500" />
                        <span>En ligne</span>
                        <span className="text-gray-400">•</span>
                        <span>Onglet {user.networkInfo?.tabId.slice(-4)}</span>
                      </div>
                    </div>
                    <div className="tab-indicator">
                      <Monitor className="w-3 h-3" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Autres utilisateurs connectés */}
          {otherUsers.filter(user => 
            !usersOnSameNetwork.some(u => u.id === user.id) && 
            !usersInDifferentTabs.some(u => u.id === user.id)
          ).length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Globe className="w-4 h-4 text-blue-500" />
                <span className="text-xs font-medium text-gray-700">
                  Autres utilisateurs
                </span>
              </div>
              <div className="space-y-1">
                {otherUsers
                  .filter(user => 
                    !usersOnSameNetwork.some(u => u.id === user.id) && 
                    !usersInDifferentTabs.some(u => u.id === user.id)
                  )
                  .map((user) => (
                    <div key={user.id} className="user-presence">
                      <div className="user-presence-avatar">
                        <img
                          src="./default-avatar.png"
                          alt={user.fullName}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="online-status">
                          <div className="user-presence-dot"></div>
                        </div>
                      </div>
                      <div className="user-presence-info">
                        <div className="user-presence-name">{user.fullName}</div>
                        <div className="user-presence-status">
                          <Circle className="w-3 h-3 text-green-500" />
                          <span>En ligne</span>
                          <span className="text-gray-400">•</span>
                          <span>{formatLastSeen(user.lastSeen)}</span>
                        </div>
                      </div>
                      <div className="tab-indicator">
                        <Globe className="w-3 h-3" />
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ConnectedUsersPanel;
