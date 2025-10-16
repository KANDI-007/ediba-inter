import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Phone, PhoneOff, Volume2, VolumeX, X } from 'lucide-react';

interface CallModalProps {
  isOpen: boolean;
  onClose: () => void;
  callData?: {
    callerId: string;
    callerName: string;
    callType: 'audio' | 'video';
    callId: string;
  };
  isIncoming?: boolean;
  onAnswer?: (answer: boolean) => void;
  onEndCall?: () => void;
}

const CallModal: React.FC<CallModalProps> = ({ 
  isOpen, 
  onClose, 
  callData, 
  isIncoming = false,
  onAnswer,
  onEndCall 
}) => {
  const { user } = useAuth();
  const [isRinging, setIsRinging] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const beepIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const durationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Sons d'appel
  const playCallSound = (type: 'ring' | 'beep' | 'end') => {
    try {
      // Créer des sons synthétiques avec gestion d'erreur
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      if (type === 'ring') {
        // Son de sonnerie plus audible
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.2);
        
        gainNode.gain.setValueAtTime(0.5, audioContext.currentTime); // Volume plus fort
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.4);
      } else if (type === 'beep') {
        // Bip d'appel plus distinctif
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(1200, audioContext.currentTime); // Fréquence plus haute
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.15);
      } else if (type === 'end') {
        // Son de fin d'appel
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
      }
    } catch (error) {
      console.error('❌ Erreur lors de la lecture du son:', error);
      // Fallback: utiliser une notification visuelle
      if (type === 'beep') {
        // Flash de l'écran ou notification visuelle
        document.body.style.backgroundColor = '#ff6b6b';
        setTimeout(() => {
          document.body.style.backgroundColor = '';
        }, 100);
      }
    }
  };

  // Démarrer les bips périodiques
  const startBeeping = () => {
    if (beepIntervalRef.current) return;
    
    beepIntervalRef.current = setInterval(() => {
      if (!isMuted) {
        playCallSound('beep');
        
        // Notification visuelle supplémentaire
        if (isIncoming) {
          // Flash de l'écran pour attirer l'attention
          document.body.style.backgroundColor = '#ff6b6b';
          setTimeout(() => {
            document.body.style.backgroundColor = '';
          }, 200);
        }
      }
    }, 2000); // Bip toutes les 2 secondes
  };

  // Arrêter les bips
  const stopBeeping = () => {
    if (beepIntervalRef.current) {
      clearInterval(beepIntervalRef.current);
      beepIntervalRef.current = null;
    }
  };

  // Démarrer le chronomètre
  const startDurationTimer = () => {
    if (durationIntervalRef.current) return;
    
    durationIntervalRef.current = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
  };

  // Arrêter le chronomètre
  const stopDurationTimer = () => {
    if (durationIntervalRef.current) {
      clearInterval(durationIntervalRef.current);
      durationIntervalRef.current = null;
    }
  };

  // Formatage du temps
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Gestion des réponses d'appel
  const handleAnswer = (answer: boolean) => {
    if (onAnswer) {
      onAnswer(answer);
    }
    
    if (answer) {
      setIsRinging(false);
      stopBeeping();
      startDurationTimer();
      playCallSound('end');
    } else {
      handleEndCall();
    }
  };

  // Gestion de la fin d'appel
  const handleEndCall = () => {
    setIsRinging(false);
    stopBeeping();
    stopDurationTimer();
    playCallSound('end');
    
    if (onEndCall) {
      onEndCall();
    }
    
    onClose();
  };

  // Demander les autorisations audio
  const requestAudioPermissions = async () => {
    try {
      // Demander l'autorisation pour l'audio
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log('✅ Autorisations audio accordées');
      
      // Arrêter le stream immédiatement car on n'en a pas besoin pour les sons
      stream.getTracks().forEach(track => track.stop());
      
      return true;
    } catch (error) {
      console.error('❌ Autorisations audio refusées:', error);
      return false;
    }
  };

  // Effets
  useEffect(() => {
    if (isOpen && callData) {
      // Demander les autorisations audio avant de jouer les sons
      requestAudioPermissions().then(hasPermission => {
        if (hasPermission || isIncoming) {
          if (isIncoming) {
            setIsRinging(true);
            playCallSound('ring');
            startBeeping();
          } else {
            setIsRinging(true);
            playCallSound('ring');
            startBeeping();
          }
        } else {
          console.log('⚠️ Autorisations audio refusées, utilisation de notifications visuelles');
          // Utiliser des notifications visuelles comme fallback
          setIsRinging(true);
          startBeeping();
        }
      });
    }

    return () => {
      stopBeeping();
      stopDurationTimer();
    };
  }, [isOpen, callData, isIncoming]);

  // Nettoyage
  useEffect(() => {
    return () => {
      stopBeeping();
      stopDurationTimer();
    };
  }, []);

  if (!isOpen || !callData) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white ediba-card p-8 w-full max-w-md relative">
        <button 
          onClick={handleEndCall} 
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="w-6 h-6" />
        </button>

        {/* En-tête de l'appel */}
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
            {callData.callerName.charAt(0).toUpperCase()}
          </div>
          <h2 className="text-2xl font-bold text-ediba-primary mb-2">
            {isIncoming ? 'Appel entrant' : 'Appel sortant'}
          </h2>
          <p className="text-lg text-ediba-text">
            {callData.callerName}
          </p>
          <p className="text-sm text-ediba-text-light">
            {callData.callType === 'audio' ? 'Appel vocal' : 'Appel vidéo'}
          </p>
        </div>

        {/* Statut de l'appel */}
        <div className="text-center mb-6">
          {isRinging ? (
            <div className="flex items-center justify-center gap-2 text-ediba-text-light">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-sm">
                {isIncoming ? 'Sonnerie...' : 'Appel en cours...'}
              </span>
              {isIncoming && (
                <div className="ml-2 text-red-500 animate-bounce">
                  🔊
                </div>
              )}
            </div>
          ) : (
            <div className="text-ediba-text">
              <p className="text-lg font-semibold">{formatDuration(callDuration)}</p>
              <p className="text-sm text-ediba-text-light">Appel en cours</p>
            </div>
          )}
        </div>

        {/* Contrôles d'appel */}
        <div className="flex justify-center gap-4 mb-6">
          {isIncoming && isRinging ? (
            // Boutons pour appel entrant
            <>
              <button
                onClick={() => handleAnswer(false)}
                className="w-12 h-12 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors"
              >
                <PhoneOff className="w-6 h-6" />
              </button>
              <button
                onClick={() => handleAnswer(true)}
                className="w-12 h-12 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center transition-colors"
              >
                <Phone className="w-6 h-6" />
              </button>
            </>
          ) : (
            // Boutons pour appel en cours
            <>
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                  isMuted ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
              >
                {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
              </button>
              <button
                onClick={handleEndCall}
                className="w-12 h-12 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors"
              >
                <PhoneOff className="w-6 h-6" />
              </button>
            </>
          )}
        </div>

        {/* Message d'information */}
        <div className="text-center text-sm text-ediba-text-light">
          {isIncoming && isRinging ? (
            <p>🔊 Des bips sonores sont émis pour vous alerter</p>
          ) : (
            <p>Appel en cours - Utilisez les contrôles ci-dessus</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CallModal;
