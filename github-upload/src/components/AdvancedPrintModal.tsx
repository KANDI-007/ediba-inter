import React, { useState, useRef, useEffect } from 'react';
import { 
  Printer, 
  Download, 
  Eye, 
  Settings, 
  X, 
  FileText,
  Monitor,
  Smartphone,
  Tablet
} from 'lucide-react';
import { 
  generatePDFFromElement, 
  printElement, 
  savePDF, 
  openPDFInNewTab,
  PrintOptions,
  DEFAULT_PRINT_OPTIONS,
  isPrintSupported
} from '../utils/PrintUtils';

interface AdvancedPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  elementRef: React.RefObject<HTMLElement>;
  documentTitle?: string;
  documentType?: string;
}

const AdvancedPrintModal: React.FC<AdvancedPrintModalProps> = ({
  isOpen,
  onClose,
  elementRef,
  documentTitle = 'Document',
  documentType = 'Facture'
}) => {
  const [printOptions, setPrintOptions] = useState<PrintOptions>(DEFAULT_PRINT_OPTIONS);
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [showSettings, setShowSettings] = useState(false);

  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && elementRef.current) {
      // Mettre à jour le preview quand les options changent
      updatePreview();
    }
  }, [isOpen, printOptions, previewMode]);

  const updatePreview = () => {
    if (previewRef.current && elementRef.current) {
      const clonedElement = elementRef.current.cloneNode(true) as HTMLElement;
      previewRef.current.innerHTML = '';
      
      // Appliquer les styles A4 pour les designs proforma dans le preview
      const isProformaDesign = clonedElement.querySelector('.proforma-template') !== null;
      if (isProformaDesign) {
        clonedElement.style.width = '210mm';
        clonedElement.style.maxWidth = '210mm';
        clonedElement.style.margin = '0 auto';
        clonedElement.style.transform = 'scale(0.8)';
        clonedElement.style.transformOrigin = 'top center';
      }
      
      previewRef.current.appendChild(clonedElement);
    }
  };

  const handlePrint = async () => {
    if (!elementRef.current) return;

    setIsGenerating(true);
    try {
      // Détecter si c'est un design proforma et appliquer les styles A4
      const isProformaDesign = elementRef.current.querySelector('.proforma-template') !== null;
      
      if (isProformaDesign) {
        // Appliquer les styles d'impression A4 pour proforma
        const printOptionsProforma = {
          ...printOptions,
          format: 'A4',
          margin: '6mm',
          scale: 1.0,
          pageSize: { width: 210, height: 297, unit: 'mm' }
        };
        await printElement(elementRef.current, printOptionsProforma);
      } else {
        await printElement(elementRef.current, printOptions);
      }
    } catch (error) {
      console.error('Erreur lors de l\'impression:', error);
      alert('Erreur lors de l\'impression. Veuillez réessayer.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGeneratePDF = async () => {
    if (!elementRef.current) return;

    setIsGenerating(true);
    try {
      // Détecter si c'est un design proforma et utiliser le flux DOM (impression système) identique au bouton proforma
      const isProformaDesign = elementRef.current.querySelector('.proforma-template') !== null;

      if (isProformaDesign) {
        // Utiliser l'impression système (l'utilisateur peut choisir "Enregistrer en PDF") pour un rendu A4 natif
        await printElement(elementRef.current, {
          ...printOptions,
          format: 'A4',
          margin: 6,
          scale: 1.0,
        });
      } else {
        const pdf = await generatePDFFromElement(
          elementRef.current, 
          `${documentTitle}_${new Date().toISOString().slice(0, 10)}.pdf`,
          printOptions
        );
        savePDF(pdf, `${documentTitle}_${new Date().toISOString().slice(0, 10)}.pdf`);
      }
    } catch (error) {
      console.error('Erreur lors de la génération PDF:', error);
      alert('Erreur lors de la génération du PDF. Veuillez réessayer.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePreviewPDF = async () => {
    if (!elementRef.current) return;

    setIsGenerating(true);
    try {
      // Pour proforma, ouvrir le flux d'impression système (l'utilisateur peut choisir prévisualisation PDF système)
      const isProformaDesign = elementRef.current.querySelector('.proforma-template') !== null;
      if (isProformaDesign) {
        await printElement(elementRef.current, {
          ...printOptions,
          format: 'A4',
          margin: 6,
          scale: 1.0,
        });
      } else {
        const pdf = await generatePDFFromElement(
          elementRef.current, 
          `${documentTitle}_preview.pdf`,
          printOptions
        );
        openPDFInNewTab(pdf);
      }
    } catch (error) {
      console.error('Erreur lors de la prévisualisation PDF:', error);
      alert('Erreur lors de la prévisualisation. Veuillez réessayer.');
    } finally {
      setIsGenerating(false);
    }
  };

  const getPreviewDimensions = () => {
    const baseWidth = 800;
    const baseHeight = 600;
    
    switch (previewMode) {
      case 'tablet':
        return { width: baseWidth * 0.8, height: baseHeight * 0.8 };
      case 'mobile':
        return { width: baseWidth * 0.4, height: baseHeight * 0.6 };
      default:
        return { width: baseWidth, height: baseHeight };
    }
  };

  if (!isOpen) return null;

  const previewDims = getPreviewDimensions();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl h-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <Printer className="w-6 h-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Impression - {documentType}
              </h2>
              <p className="text-sm text-gray-600">{documentTitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar - Options et contrôles */}
          <div className="w-80 bg-gray-50 border-r flex flex-col">
            {/* Actions principales */}
            <div className="p-4 border-b">
              {/* Indication mode A4 Proforma */}
              {elementRef.current?.querySelector('.proforma-template') && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">Mode A4 Proforma</span>
                  </div>
                  <p className="text-xs text-blue-600 mt-1">
                    Format A4 optimisé avec marges 6mm
                  </p>
                </div>
              )}
              
              <div className="space-y-3">
                <button
                  onClick={handleGeneratePDF}
                  disabled={isGenerating}
                  className="w-full flex items-center justify-center space-x-2 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Download className="w-5 h-5" />
                  <span>Télécharger PDF</span>
                </button>
                
                <button
                  onClick={handlePreviewPDF}
                  disabled={isGenerating}
                  className="w-full flex items-center justify-center space-x-2 bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Eye className="w-5 h-5" />
                  <span>Prévisualiser PDF</span>
                </button>
              </div>
            </div>

            {/* Mode de prévisualisation */}
            <div className="p-4 border-b">
              <h3 className="font-semibold text-gray-900 mb-3">Prévisualisation</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => setPreviewMode('desktop')}
                  className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    previewMode === 'desktop' 
                      ? 'bg-blue-100 text-blue-700 border border-blue-300' 
                      : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <Monitor className="w-4 h-4" />
                  <span className="text-sm">Desktop</span>
                </button>
                <button
                  onClick={() => setPreviewMode('tablet')}
                  className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    previewMode === 'tablet' 
                      ? 'bg-blue-100 text-blue-700 border border-blue-300' 
                      : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <Tablet className="w-4 h-4" />
                  <span className="text-sm">Tablet</span>
                </button>
                <button
                  onClick={() => setPreviewMode('mobile')}
                  className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    previewMode === 'mobile' 
                      ? 'bg-blue-100 text-blue-700 border border-blue-300' 
                      : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                  <span className="text-sm">Mobile</span>
                </button>
              </div>
            </div>

            {/* Options d'impression */}
            <div className="flex-1 p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">Options d'impression</h3>
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="p-1 hover:bg-gray-200 rounded transition-colors"
                >
                  <Settings className="w-4 h-4" />
                </button>
              </div>

              {showSettings && (
                <div className="space-y-4">
                  {/* Format */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Format
                    </label>
                    <select
                      value={printOptions.format}
                      onChange={(e) => setPrintOptions(prev => ({ 
                        ...prev, 
                        format: e.target.value as 'A4' | 'A3' | 'Letter' 
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="A4">A4</option>
                      <option value="A3">A3</option>
                      <option value="Letter">Letter</option>
                    </select>
                  </div>

                  {/* Orientation */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Orientation
                    </label>
                    <select
                      value={printOptions.orientation}
                      onChange={(e) => setPrintOptions(prev => ({ 
                        ...prev, 
                        orientation: e.target.value as 'portrait' | 'landscape' 
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="portrait">Portrait</option>
                      <option value="landscape">Paysage</option>
                    </select>
                  </div>

                  {/* Qualité */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Qualité
                    </label>
                    <select
                      value={printOptions.quality}
                      onChange={(e) => setPrintOptions(prev => ({ 
                        ...prev, 
                        quality: e.target.value as 'low' | 'medium' | 'high' 
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="low">Faible</option>
                      <option value="medium">Moyenne</option>
                      <option value="high">Haute</option>
                    </select>
                  </div>

                  {/* Marge */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Marge (mm)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="50"
                      value={printOptions.margin}
                      onChange={(e) => setPrintOptions(prev => ({ 
                        ...prev, 
                        margin: parseInt(e.target.value) || 0 
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Échelle */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Échelle
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="3"
                      step="0.5"
                      value={printOptions.scale}
                      onChange={(e) => setPrintOptions(prev => ({ 
                        ...prev, 
                        scale: parseFloat(e.target.value) 
                      }))}
                      className="w-full"
                    />
                    <div className="text-xs text-gray-500 text-center">
                      {printOptions.scale}x
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Zone de prévisualisation */}
          <div className="flex-1 flex flex-col">
            <div className="p-4 border-b bg-gray-50">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Aperçu</h3>
                <div className="text-sm text-gray-600">
                  {previewDims.width} × {previewDims.height}px
                </div>
              </div>
            </div>
            
            <div className="flex-1 overflow-auto p-4 bg-gray-100">
              <div 
                className="bg-white shadow-lg mx-auto"
                style={{ 
                  width: previewDims.width, 
                  height: previewDims.height,
                  maxWidth: '100%',
                  maxHeight: '100%'
                }}
              >
                <div 
                  ref={previewRef}
                  className="w-full h-full overflow-auto"
                  style={{ 
                    transform: `scale(${previewMode === 'mobile' ? 0.5 : previewMode === 'tablet' ? 0.7 : 1})`,
                    transformOrigin: 'top left',
                    width: previewMode === 'mobile' ? '200%' : previewMode === 'tablet' ? '143%' : '100%',
                    height: previewMode === 'mobile' ? '200%' : previewMode === 'tablet' ? '143%' : '100%'
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {isPrintSupported() ? (
                <span className="text-green-600">✓ Impression supportée</span>
              ) : (
                <span className="text-red-600">✗ Impression non supportée</span>
              )}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedPrintModal;
