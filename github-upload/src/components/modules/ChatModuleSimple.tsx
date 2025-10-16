// Module Chat Espace EDIBA avec design personnalisé
import React, { useState, useEffect } from 'react';
import { useChat } from '../../contexts/ChatContextSimple';
import { useAuth } from '../../contexts/AuthContext';
import EspaceEdibaChat from '../EspaceEdibaChat';

const ChatModule: React.FC = () => {
  const { connectToChat } = useChat();
  const { user } = useAuth();
  const [isInitialized, setIsInitialized] = useState(false);

  // Connexion automatique au chat Espace EDIBA
  useEffect(() => {
    if (user && !isInitialized) {
      const chatUser = {
        id: user.id,
        username: user.username,
        fullName: user.fullName || user.username,
        avatar: user.profileImage || user.avatar,
        isOnline: true
      };
      
      console.log('🔄 Connexion à Espace EDIBA pour:', chatUser);
      connectToChat(chatUser);
      setIsInitialized(true);
    }
  }, [user, isInitialized, connectToChat]);

  return (
    <div className="h-full">
      <EspaceEdibaChat />
    </div>
  );
};

export default ChatModule;
