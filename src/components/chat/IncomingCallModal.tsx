import React, { useState, useEffect } from 'react';
import { Phone, PhoneOff, Video, Mic, MicOff } from 'lucide-react';
import { ChatCall } from '../../contexts/ChatContext';

interface IncomingCallModalProps {
  call: ChatCall;
  onAnswer: () => void;
  onReject: () => void;
}

const IncomingCallModal: React.FC<IncomingCallModalProps> = ({
  call,
  onAnswer,
  onReject
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswer = () => {
    onAnswer();
  };

  const handleReject = () => {
    onReject();
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
        {/* Caller Info */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-3xl font-bold text-white">U</span>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {call.type === 'video' ? 'Appel vidéo entrant' : 'Appel vocal entrant'}
          </h2>
          
          <p className="text-lg text-gray-600 mb-1">Utilisateur</p>
          <p className="text-sm text-gray-500">
            {call.status === 'ringing' ? 'Sonnerie...' : `En appel depuis ${formatDuration(callDuration)}`}
          </p>
        </div>

        {/* Call Type Indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className={`flex items-center space-x-2 px-4 py-2 rounded-full ${
            call.type === 'video' 
              ? 'bg-purple-100 text-purple-700' 
              : 'bg-green-100 text-green-700'
          }`}>
            {call.type === 'video' ? (
              <Video className="w-5 h-5" />
            ) : (
              <Phone className="w-5 h-5" />
            )}
            <span className="font-medium">
              {call.type === 'video' ? 'Appel vidéo' : 'Appel vocal'}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center space-x-4">
          {/* Mute Button */}
          <button
            onClick={toggleMute}
            className={`p-4 rounded-full transition-colors ${
              isMuted 
                ? 'bg-red-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            title={isMuted ? 'Activer le microphone' : 'Désactiver le microphone'}
          >
            {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </button>

          {/* Answer Button */}
          <button
            onClick={handleAnswer}
            className="p-6 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors shadow-lg"
            title="Répondre"
          >
            <Phone className="w-8 h-8" />
          </button>

          {/* Reject Button */}
          <button
            onClick={handleReject}
            className="p-6 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
            title="Refuser"
          >
            <PhoneOff className="w-8 h-8" />
          </button>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            {call.type === 'video' 
              ? 'Cet appel utilisera votre caméra et votre microphone'
              : 'Cet appel utilisera votre microphone'
            }
          </p>
        </div>

        {/* Ring Animation */}
        {call.status === 'ringing' && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-32 h-32 border-4 border-blue-500 rounded-full animate-ping opacity-20"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 border-4 border-blue-500 rounded-full animate-ping opacity-30" style={{ animationDelay: '0.5s' }}></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 border-4 border-blue-500 rounded-full animate-ping opacity-40" style={{ animationDelay: '1s' }}></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IncomingCallModal;
