import React, { useState, useEffect, useRef } from 'react';
import { 
  PhoneOff, 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Volume2, 
  VolumeX, 
  Minimize2, 
  Maximize2,
  Settings,
  Users,
  MessageCircle,
  MoreVertical
} from 'lucide-react';
import { ChatCall } from '../../contexts/ChatContext';

interface CallInterfaceProps {
  call: ChatCall;
  onEndCall: () => void;
  onMinimize: () => void;
  onFullscreen: () => void;
  isMinimized: boolean;
  isFullscreen: boolean;
}

const CallInterface: React.FC<CallInterfaceProps> = ({
  call,
  onEndCall,
  onMinimize,
  onFullscreen,
  isMinimized,
  isFullscreen
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const [showParticipants, setShowParticipants] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const callTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Démarrer le timer d'appel
    callTimerRef.current = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);

    // Simuler l'initialisation de la vidéo/audio
    initializeMedia();

    return () => {
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current);
      }
    };
  }, []);

  const initializeMedia = async () => {
    try {
      // Simuler l'accès à la caméra et au microphone
      if (localVideoRef.current) {
        // En réalité, vous devriez utiliser getUserMedia ici
        console.log('Initialisation de la vidéo locale');
      }
    } catch (error) {
      console.error('Erreur lors de l\'initialisation des médias:', error);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    // Ici, vous devriez contrôler le microphone
  };

  const toggleVideo = () => {
    setIsVideoOff(!isVideoOff);
    // Ici, vous devriez contrôler la caméra
  };

  const toggleSpeaker = () => {
    setIsSpeakerOn(!isSpeakerOn);
    // Ici, vous devriez contrôler le haut-parleur
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg border border-gray-200 p-3 z-50">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
              {call.type === 'video' ? (
                <Video className="w-5 h-5 text-white" />
              ) : (
                <Mic className="w-5 h-5 text-white" />
              )}
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900">
              {call.type === 'video' ? 'Appel vidéo' : 'Appel vocal'}
            </div>
            <div className="text-xs text-gray-500">{formatDuration(callDuration)}</div>
          </div>
          <div className="flex space-x-1">
            <button
              onClick={onMinimize}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <Maximize2 className="w-4 h-4 text-gray-600" />
            </button>
            <button
              onClick={onEndCall}
              className="p-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
              <PhoneOff className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`fixed inset-0 bg-gray-900 flex flex-col ${isFullscreen ? 'z-50' : 'z-40'}`}>
      {/* Header */}
      <div className="bg-black bg-opacity-50 text-white p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="text-lg font-semibold">
            {call.type === 'video' ? 'Appel vidéo' : 'Appel vocal'}
          </div>
          <div className="text-sm text-gray-300">
            {formatDuration(callDuration)}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowParticipants(!showParticipants)}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
            title="Participants"
          >
            <Users className="w-5 h-5" />
          </button>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
            title="Paramètres"
          >
            <Settings className="w-5 h-5" />
          </button>
          <button
            onClick={onMinimize}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
            title="Réduire"
          >
            <Minimize2 className="w-5 h-5" />
          </button>
          <button
            onClick={onFullscreen}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
            title="Plein écran"
          >
            <Maximize2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Video Area */}
      <div className="flex-1 relative">
        {/* Remote Video */}
        <div className="absolute inset-0">
          <video
            ref={remoteVideoRef}
            className="w-full h-full object-cover"
            autoPlay
            playsInline
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
        </div>

        {/* Local Video */}
        {call.type === 'video' && !isVideoOff && (
          <div className="absolute top-4 right-4 w-48 h-36 bg-gray-800 rounded-lg overflow-hidden">
            <video
              ref={localVideoRef}
              className="w-full h-full object-cover"
              autoPlay
              playsInline
              muted
            />
          </div>
        )}

        {/* User Info Overlay */}
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-center text-white">
          <div className="w-20 h-20 bg-gray-600 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-2xl font-bold">U</span>
          </div>
          <div className="text-xl font-semibold mb-1">Utilisateur</div>
          <div className="text-sm text-gray-300">
            {call.status === 'ringing' ? 'Sonnerie...' : 'En appel'}
          </div>
        </div>

        {/* Participants Panel */}
        {showParticipants && (
          <div className="absolute top-16 right-4 w-64 bg-black bg-opacity-75 rounded-lg p-4">
            <h3 className="text-white font-semibold mb-3">Participants</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-3 text-white">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold">M</span>
                </div>
                <div>
                  <div className="text-sm font-medium">Vous</div>
                  <div className="text-xs text-gray-300">En ligne</div>
                </div>
              </div>
              <div className="flex items-center space-x-3 text-white">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold">U</span>
                </div>
                <div>
                  <div className="text-sm font-medium">Utilisateur</div>
                  <div className="text-xs text-gray-300">En ligne</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Settings Panel */}
        {showSettings && (
          <div className="absolute top-16 right-4 w-64 bg-black bg-opacity-75 rounded-lg p-4">
            <h3 className="text-white font-semibold mb-3">Paramètres</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-white">
                <span className="text-sm">Microphone</span>
                <button
                  onClick={toggleMute}
                  className={`p-2 rounded-full ${
                    isMuted ? 'bg-red-500' : 'bg-gray-600'
                  }`}
                >
                  {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
              </div>
              <div className="flex items-center justify-between text-white">
                <span className="text-sm">Caméra</span>
                <button
                  onClick={toggleVideo}
                  className={`p-2 rounded-full ${
                    isVideoOff ? 'bg-red-500' : 'bg-gray-600'
                  }`}
                >
                  {isVideoOff ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4" />}
                </button>
              </div>
              <div className="flex items-center justify-between text-white">
                <span className="text-sm">Haut-parleur</span>
                <button
                  onClick={toggleSpeaker}
                  className={`p-2 rounded-full ${
                    isSpeakerOn ? 'bg-green-500' : 'bg-gray-600'
                  }`}
                >
                  {isSpeakerOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="bg-black bg-opacity-50 p-6">
        <div className="flex items-center justify-center space-x-4">
          {/* Mute Button */}
          <button
            onClick={toggleMute}
            className={`p-4 rounded-full transition-colors ${
              isMuted 
                ? 'bg-red-500 text-white' 
                : 'bg-gray-600 text-white hover:bg-gray-500'
            }`}
            title={isMuted ? 'Activer le microphone' : 'Désactiver le microphone'}
          >
            {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </button>

          {/* Video Button (only for video calls) */}
          {call.type === 'video' && (
            <button
              onClick={toggleVideo}
              className={`p-4 rounded-full transition-colors ${
                isVideoOff 
                  ? 'bg-red-500 text-white' 
                  : 'bg-gray-600 text-white hover:bg-gray-500'
              }`}
              title={isVideoOff ? 'Activer la caméra' : 'Désactiver la caméra'}
            >
              {isVideoOff ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6" />}
            </button>
          )}

          {/* Speaker Button */}
          <button
            onClick={toggleSpeaker}
            className={`p-4 rounded-full transition-colors ${
              isSpeakerOn 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-600 text-white hover:bg-gray-500'
            }`}
            title={isSpeakerOn ? 'Désactiver le haut-parleur' : 'Activer le haut-parleur'}
          >
            {isSpeakerOn ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
          </button>

          {/* End Call Button */}
          <button
            onClick={onEndCall}
            className="p-4 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            title="Terminer l'appel"
          >
            <PhoneOff className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Click outside to close panels */}
      {(showParticipants || showSettings) && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => {
            setShowParticipants(false);
            setShowSettings(false);
          }}
        />
      )}
    </div>
  );
};

export default CallInterface;
