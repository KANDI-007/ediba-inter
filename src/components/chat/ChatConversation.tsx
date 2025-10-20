import React, { useEffect, useRef, useState } from 'react';
import { 
  Reply, 
  Forward, 
  Copy, 
  Download, 
  Eye, 
  Trash2, 
  Star,
  MoreVertical,
  Check,
  CheckCheck,
  Clock,
  Phone,
  Video,
  Image as ImageIcon,
  FileText,
  Play,
  Pause
} from 'lucide-react';
import { ChatConversation as ChatConversationType, ChatMessage, ChatUser } from '../../contexts/ChatContext';

interface ChatConversationProps {
  conversation: ChatConversationType;
}

const ChatConversation: React.FC<ChatConversationProps> = ({ conversation }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [selectedMessage, setSelectedMessage] = useState<ChatMessage | null>(null);
  const [showMessageMenu, setShowMessageMenu] = useState(false);

  // Messages simulés pour la démonstration
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      senderId: 'other',
      content: 'Salut ! Comment ça va ?',
      type: 'text',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      isRead: true,
      isDelivered: true
    },
    {
      id: '2',
      senderId: 'current',
      content: 'Ça va bien merci ! Et toi ?',
      type: 'text',
      timestamp: new Date(Date.now() - 3500000).toISOString(),
      isRead: true,
      isDelivered: true
    },
    {
      id: '3',
      senderId: 'other',
      content: 'Très bien aussi ! J\'ai une question sur le projet EDIBA INTER...',
      type: 'text',
      timestamp: new Date(Date.now() - 3400000).toISOString(),
      isRead: true,
      isDelivered: true
    },
    {
      id: '4',
      senderId: 'other',
      content: '',
      type: 'image',
      timestamp: new Date(Date.now() - 3300000).toISOString(),
      isRead: true,
      isDelivered: true,
      fileUrl: '/placeholder-image.jpg',
      fileName: 'screenshot.png'
    },
    {
      id: '5',
      senderId: 'current',
      content: 'Ah je vois ! C\'est un excellent point. Je vais regarder ça.',
      type: 'text',
      timestamp: new Date(Date.now() - 3200000).toISOString(),
      isRead: true,
      isDelivered: true
    },
    {
      id: '6',
      senderId: 'other',
      content: 'Parfait ! Merci beaucoup.',
      type: 'text',
      timestamp: new Date(Date.now() - 3100000).toISOString(),
      isRead: false,
      isDelivered: true
    }
  ]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Aujourd\'hui';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Hier';
    } else {
      return date.toLocaleDateString('fr-FR', { 
        weekday: 'long',
        day: 'numeric',
        month: 'long'
      });
    }
  };

  const getMessageStatus = (message: ChatMessage) => {
    if (!message.isDelivered) {
      return <Clock className="w-4 h-4 text-gray-400" />;
    } else if (!message.isRead) {
      return <CheckCheck className="w-4 h-4 text-gray-400" />;
    } else {
      return <CheckCheck className="w-4 h-4 text-blue-500" />;
    }
  };

  const handleMessageAction = (action: string, message: ChatMessage) => {
    switch (action) {
      case 'reply':
        console.log('Répondre à:', message);
        break;
      case 'forward':
        console.log('Transférer:', message);
        break;
      case 'copy':
        navigator.clipboard.writeText(message.content);
        break;
      case 'download':
        if (message.fileUrl) {
          const link = document.createElement('a');
          link.href = message.fileUrl;
          link.download = message.fileName || 'file';
          link.click();
        }
        break;
      case 'delete':
        console.log('Supprimer:', message);
        break;
      case 'star':
        console.log('Marquer comme favori:', message);
        break;
      default:
        break;
    }
    setShowMessageMenu(false);
    setSelectedMessage(null);
  };

  const renderMessage = (message: ChatMessage, index: number) => {
    const isCurrentUser = message.senderId === 'current';
    const prevMessage = messages[index - 1];
    const nextMessage = messages[index + 1];
    const showAvatar = !prevMessage || prevMessage.senderId !== message.senderId;
    const showTime = !nextMessage || nextMessage.senderId !== message.senderId;

    return (
      <div key={message.id} className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-2`}>
        <div className={`flex max-w-xs lg:max-w-md ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}>
          {/* Avatar */}
          {showAvatar && !isCurrentUser && (
            <div className="flex-shrink-0 mr-2">
              <img
                src={conversation.participants.find(p => p.id !== 'current')?.avatar || './default-avatar.png'}
                alt="Avatar"
                className="w-8 h-8 rounded-full object-cover"
              />
            </div>
          )}

          {/* Message Content */}
          <div className={`relative group ${isCurrentUser ? 'ml-2' : 'mr-2'}`}>
            <div
              className={`px-6 py-4 rounded-3xl shadow-lg transition-all duration-200 hover:shadow-xl ${
                isCurrentUser
                  ? 'rounded-br-lg'
                  : 'rounded-bl-lg'
              } ${message.type !== 'text' ? 'p-4' : ''}`}
              style={{
                backgroundColor: isCurrentUser ? 'var(--whatsapp-message-sent)' : 'var(--whatsapp-message-received)',
                color: 'var(--whatsapp-text-primary)',
                border: isCurrentUser ? 'none' : '1px solid var(--whatsapp-border)'
              }}
              onContextMenu={(e) => {
                e.preventDefault();
                setSelectedMessage(message);
                setShowMessageMenu(true);
              }}
            >
              {/* Reply Reference */}
              {message.replyTo && (
                <div className={`text-xs mb-2 p-2 rounded ${
                  isCurrentUser ? 'bg-blue-500' : 'bg-gray-100'
                }`}>
                  <div className="font-medium">Réponse à:</div>
                  <div className="truncate">
                    {messages.find(m => m.id === message.replyTo)?.content || 'Message supprimé'}
                  </div>
                </div>
              )}

              {/* Message Content */}
              {message.type === 'text' && (
                <div className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</div>
              )}

              {message.type === 'image' && (
                <div className="space-y-2">
                  <img
                    src="./placeholder-image.jpg"
                    alt={message.fileName || 'Image'}
                    className="max-w-full h-auto rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => window.open(message.fileUrl, '_blank')}
                  />
                  {message.content && (
                    <div className="text-sm">{message.content}</div>
                  )}
                </div>
              )}

              {message.type === 'document' && (
                <div className="flex items-center space-x-3 p-3 bg-white bg-opacity-20 rounded-lg">
                  <FileText className="w-8 h-8" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{message.fileName}</div>
                    <div className="text-xs opacity-75">
                      {message.fileSize ? `${(message.fileSize / 1024).toFixed(1)} KB` : 'Document'}
                    </div>
                  </div>
                  <Download className="w-5 h-5 cursor-pointer hover:opacity-75" />
                </div>
              )}

              {message.type === 'audio' && (
                <div className="flex items-center space-x-3 p-3 bg-white bg-opacity-20 rounded-lg">
                  <button className="p-2 bg-white bg-opacity-30 rounded-full">
                    <Play className="w-4 h-4" />
                  </button>
                  <div className="flex-1">
                    <div className="text-sm font-medium">Message vocal</div>
                    <div className="text-xs opacity-75">0:15</div>
                  </div>
                </div>
              )}

              {message.type === 'video' && (
                <div className="space-y-2">
                  <div className="relative">
                    <video
                      src={message.fileUrl}
                      className="max-w-full h-auto rounded-lg"
                      controls
                    />
                  </div>
                  {message.content && (
                    <div className="text-sm">{message.content}</div>
                  )}
                </div>
              )}

              {message.type === 'call' && (
                <div className="flex items-center space-x-3 p-3 bg-white bg-opacity-20 rounded-lg">
                  {message.callType === 'video' ? (
                    <Video className="w-6 h-6" />
                  ) : (
                    <Phone className="w-6 h-6" />
                  )}
                  <div className="flex-1">
                    <div className="text-sm font-medium">
                      {message.callType === 'video' ? 'Appel vidéo' : 'Appel vocal'}
                    </div>
                    <div className="text-xs opacity-75">
                      {message.callDuration ? `${message.callDuration}s` : 'Appel terminé'}
                    </div>
                  </div>
                </div>
              )}

              {/* Time and Status */}
              {showTime && (
                <div className={`flex items-center mt-1 space-x-1 ${
                  isCurrentUser ? 'justify-end' : 'justify-start'
                }`}>
                  <span className={`text-xs ${
                    isCurrentUser ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {formatTime(message.timestamp)}
                  </span>
                  {isCurrentUser && getMessageStatus(message)}
                </div>
              )}
            </div>

            {/* Message Menu */}
            {showMessageMenu && selectedMessage?.id === message.id && (
              <div className="absolute top-0 left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <div className="py-1">
                  <button
                    onClick={() => handleMessageAction('reply', message)}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <Reply className="w-4 h-4" />
                    <span>Répondre</span>
                  </button>
                  <button
                    onClick={() => handleMessageAction('forward', message)}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <Forward className="w-4 h-4" />
                    <span>Transférer</span>
                  </button>
                  <button
                    onClick={() => handleMessageAction('copy', message)}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <Copy className="w-4 h-4" />
                    <span>Copier</span>
                  </button>
                  {message.fileUrl && (
                    <button
                      onClick={() => handleMessageAction('download', message)}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center space-x-2"
                    >
                      <Download className="w-4 h-4" />
                      <span>Télécharger</span>
                    </button>
                  )}
                  <button
                    onClick={() => handleMessageAction('star', message)}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <Star className="w-4 h-4" />
                    <span>Favori</span>
                  </button>
                  <button
                    onClick={() => handleMessageAction('delete', message)}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center space-x-2 text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Supprimer</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Grouper les messages par date
  const groupedMessages = messages.reduce((groups, message, index) => {
    const date = new Date(message.timestamp).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push({ ...message, index });
    return groups;
  }, {} as Record<string, (ChatMessage & { index: number })[]>);

  return (
    <div className="flex-1 overflow-y-auto p-6 chat-scroll" style={{ backgroundColor: 'var(--whatsapp-chat-bg)' }}>
      <div className="max-w-4xl mx-auto">
        {Object.entries(groupedMessages).map(([date, dayMessages]) => (
          <div key={date}>
            {/* Date Separator */}
            <div className="flex items-center justify-center my-6">
              <div className="px-6 py-2 rounded-full text-sm font-medium shadow-lg border" style={{ 
                backgroundColor: 'var(--whatsapp-sidebar-bg)', 
                color: 'var(--whatsapp-text-secondary)',
                borderColor: 'var(--whatsapp-border)'
              }}>
                {formatDate(dayMessages[0].timestamp)}
              </div>
            </div>

            {/* Messages for this date */}
            {dayMessages.map((message) => renderMessage(message, message.index))}
          </div>
        ))}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Click outside to close menu */}
      {showMessageMenu && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => {
            setShowMessageMenu(false);
            setSelectedMessage(null);
          }}
        />
      )}
    </div>
  );
};

export default ChatConversation;
