import React from 'react';
import { 
  FileText, 
  FileImage, 
  File, 
  Download, 
  Archive,
  FileVideo,
  FileAudio
} from 'lucide-react';

interface FileMessageProps {
  file: {
    id: string;
    originalName: string;
    filename: string;
    mimetype: string;
    size: number;
    url: string;
    uploadedAt: string;
  };
  isOwn: boolean;
}

const FileMessage: React.FC<FileMessageProps> = ({ file, isOwn }) => {
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = () => {
    if (file.mimetype.startsWith('image/')) {
      return <FileImage className="w-6 h-6 text-blue-500" />;
    } else if (file.mimetype === 'application/pdf') {
      return <FileText className="w-6 h-6 text-red-500" />;
    } else if (file.mimetype.includes('word') || file.mimetype.includes('excel')) {
      return <File className="w-6 h-6 text-green-500" />;
    } else if (file.mimetype.includes('zip') || file.mimetype.includes('rar')) {
      return <Archive className="w-6 h-6 text-purple-500" />;
    } else if (file.mimetype.startsWith('video/')) {
      return <FileVideo className="w-6 h-6 text-orange-500" />;
    } else if (file.mimetype.startsWith('audio/')) {
      return <FileAudio className="w-6 h-6 text-pink-500" />;
    } else {
      return <File className="w-6 h-6 text-gray-500" />;
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = `http://localhost:3000${file.url}`;
    link.download = file.originalName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePreview = () => {
    if (file.mimetype.startsWith('image/')) {
      window.open(`http://localhost:3000${file.url}`, '_blank');
    } else {
      handleDownload();
    }
  };

  return (
    <div className={`max-w-xs lg:max-w-md ${isOwn ? 'ml-auto' : 'mr-auto'}`}>
      <div className={`p-4 rounded-2xl ${
        isOwn
          ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
          : 'bg-white text-gray-900 shadow-md'
      }`}>
        {/* En-tête du fichier */}
        <div className="flex items-start gap-3 mb-3">
          <div className="flex-shrink-0">
            {getFileIcon()}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className={`font-medium truncate ${
              isOwn ? 'text-white' : 'text-gray-900'
            }`}>
              {file.originalName}
            </h4>
            <p className={`text-sm ${
              isOwn ? 'text-blue-100' : 'text-gray-500'
            }`}>
              {formatFileSize(file.size)}
            </p>
          </div>
        </div>

        {/* Aperçu pour les images */}
        {file.mimetype.startsWith('image/') && (
          <div className="mb-3">
            <img
              src={`http://localhost:3000${file.url}`}
              alt={file.originalName}
              className="w-full h-32 object-cover rounded-lg cursor-pointer"
              onClick={handlePreview}
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between">
          <button
            onClick={handlePreview}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              isOwn
                ? 'bg-white/20 hover:bg-white/30 text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            {file.mimetype.startsWith('image/') ? 'Voir' : 'Ouvrir'}
          </button>
          <button
            onClick={handleDownload}
            className={`p-2 rounded-lg transition-colors ${
              isOwn
                ? 'hover:bg-white/20 text-white'
                : 'hover:bg-gray-100 text-gray-600'
            }`}
            title="Télécharger"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileMessage;
