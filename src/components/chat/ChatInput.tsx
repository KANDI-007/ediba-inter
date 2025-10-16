import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Paperclip, 
  Smile, 
  Mic, 
  Camera, 
  Image as ImageIcon, 
  FileText, 
  X,
  Plus
} from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';

interface ChatInputProps {
  onSendMessage: (content: string, type?: 'text' | 'image' | 'document' | 'audio' | 'video', file?: File, replyTo?: string) => void;
  onTyping: () => void;
  showEmojiPicker: boolean;
  onToggleEmojiPicker: () => void;
  replyTo?: any;
  onCancelReply?: () => void;
}

const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  onTyping,
  showEmojiPicker,
  onToggleEmojiPicker,
  replyTo,
  onCancelReply
}) => {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    onTyping();
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message.trim(), 'text', undefined, replyTo?.id);
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileSelect = (type: 'image' | 'document' | 'video') => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = type === 'image' 
        ? 'image/*' 
        : type === 'video' 
        ? 'video/*' 
        : '*/*';
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const type = file.type.startsWith('image/') ? 'image' : 
                  file.type.startsWith('video/') ? 'video' : 'document';
      onSendMessage('', type, file);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioFile = new File([audioBlob], 'audio-message.wav', { type: 'audio/wav' });
        onSendMessage('', 'audio', audioFile);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleEmojiClick = (emojiData: any) => {
    setMessage(prev => prev + emojiData.emoji);
    onTyping();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const file = files[0];
      const type = file.type.startsWith('image/') ? 'image' : 
                  file.type.startsWith('video/') ? 'video' : 'document';
      onSendMessage('', type, file);
    }
  };

  const attachmentOptions = [
    { type: 'image', icon: ImageIcon, label: 'Photo', color: 'text-green-600' },
    { type: 'document', icon: FileText, label: 'Document', color: 'text-blue-600' },
    { type: 'video', icon: Camera, label: 'Vidéo', color: 'text-purple-600' }
  ];

  return (
    <div className="relative" style={{ backgroundColor: 'var(--whatsapp-sidebar-bg)' }}>
      {/* Reply Preview */}
      {replyTo && (
        <div className="border-t px-6 py-4" style={{ borderColor: 'var(--whatsapp-border)', backgroundColor: 'var(--whatsapp-hover)' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-1 h-10 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></div>
              <div>
                <div className="text-sm font-bold" style={{ color: 'var(--whatsapp-text-primary)' }}>Réponse à {replyTo.senderName}</div>
                <div className="text-sm truncate max-w-xs" style={{ color: 'var(--whatsapp-text-secondary)' }}>{replyTo.content}</div>
              </div>
            </div>
            <button
              onClick={onCancelReply}
              className="p-2 hover:bg-white hover:bg-opacity-50 rounded-full transition-all duration-200"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div 
        className={`border-t p-6 transition-all duration-200 ${
          isDragging ? 'border-blue-300' : ''
        }`}
        style={{ 
          backgroundColor: 'var(--whatsapp-sidebar-bg)',
          borderColor: isDragging ? 'var(--whatsapp-accent)' : 'var(--whatsapp-border)'
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex items-end space-x-3">
          {/* Attachment Button */}
          <div className="relative">
            <button
              onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
              className="p-3 hover:bg-blue-50 rounded-2xl transition-all duration-200 hover:scale-105"
              title="Pièces jointes"
            >
              <Plus className="w-6 h-6 text-gray-600" />
            </button>

            {/* Attachment Menu */}
            {showAttachmentMenu && (
              <div className="absolute bottom-full left-0 mb-3 bg-white border border-gray-200 rounded-2xl shadow-2xl z-10 overflow-hidden">
                <div className="p-3">
                  {attachmentOptions.map((option) => (
                    <button
                      key={option.type}
                      onClick={() => {
                        handleFileSelect(option.type as any);
                        setShowAttachmentMenu(false);
                      }}
                      className="w-full flex items-center space-x-4 px-4 py-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 rounded-xl transition-all duration-200"
                    >
                      <option.icon className={`w-6 h-6 ${option.color}`} />
                      <span className="text-sm font-medium text-gray-700">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Text Input */}
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Tapez un message..."
              className="w-full px-6 py-4 rounded-3xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent max-h-32 shadow-sm transition-all duration-200 whatsapp-input"
              rows={1}
            />
            
            {/* Drag Overlay */}
            {isDragging && (
              <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-purple-100 bg-opacity-80 border-2 border-dashed border-blue-400 rounded-3xl flex items-center justify-center">
                <div className="text-blue-600 font-bold text-lg">Déposez le fichier ici</div>
              </div>
            )}
          </div>

          {/* Emoji Button */}
          <button
            onClick={onToggleEmojiPicker}
            className="p-3 hover:bg-blue-50 rounded-2xl transition-all duration-200 hover:scale-105"
            title="Emojis"
          >
            <Smile className="w-6 h-6 text-gray-600" />
          </button>

          {/* Voice/Record Button */}
          {isRecording ? (
            <button
              onClick={stopRecording}
              className="p-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-2xl hover:from-red-600 hover:to-pink-700 transition-all duration-200 hover:scale-105 shadow-lg"
              title="Arrêter l'enregistrement"
            >
              <div className="w-6 h-6 bg-white rounded-full"></div>
            </button>
          ) : (
            <button
              onClick={startRecording}
              className="p-3 hover:bg-blue-50 rounded-2xl transition-all duration-200 hover:scale-105"
              title="Message vocal"
            >
              <Mic className="w-6 h-6 text-gray-600" />
            </button>
          )}

          {/* Send Button */}
          <button
            onClick={handleSendMessage}
            disabled={!message.trim()}
            className={`p-3 rounded-2xl transition-all duration-200 hover:scale-105 ${
              message.trim()
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
            title="Envoyer"
          >
            <Send className="w-6 h-6" />
          </button>
        </div>

        {/* Emoji Picker */}
        {showEmojiPicker && (
          <div className="absolute bottom-full right-0 mb-3 z-20">
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
              <EmojiPicker
                onEmojiClick={handleEmojiClick}
                width={320}
                height={400}
                searchDisabled={false}
                skinTonesDisabled={false}
              />
            </div>
          </div>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Click outside to close menus */}
      {(showAttachmentMenu || showEmojiPicker) && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => {
            setShowAttachmentMenu(false);
            onToggleEmojiPicker();
          }}
        />
      )}
    </div>
  );
};

export default ChatInput;
