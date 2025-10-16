import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

/**
 * Options d'impression pour les factures
 */
export interface PrintOptions {
  format: 'A4' | 'A3' | 'Letter';
  orientation: 'portrait' | 'landscape';
  quality: 'low' | 'medium' | 'high';
  margin: number;
  scale: number;
  includeBackground: boolean;
}

/**
 * Configuration par défaut pour l'impression
 */
export const DEFAULT_PRINT_OPTIONS: PrintOptions = {
  format: 'A4',
  orientation: 'portrait',
  quality: 'high',
  margin: 20,
  scale: 2,
  includeBackground: true
};

/**
 * Capture un élément HTML et le convertit en image haute qualité
 */
export async function captureElement(
  element: HTMLElement,
  options: Partial<PrintOptions> = {}
): Promise<HTMLCanvasElement> {
  const config = { ...DEFAULT_PRINT_OPTIONS, ...options };
  
  const canvas = await html2canvas(element, {
    scale: config.scale,
    useCORS: true,
    allowTaint: true,
    backgroundColor: config.includeBackground ? '#ffffff' : null,
    logging: false,
    width: element.scrollWidth,
    height: element.scrollHeight,
    scrollX: 0,
    scrollY: 0,
    windowWidth: element.scrollWidth,
    windowHeight: element.scrollHeight
  });

  return canvas;
}

/**
 * Génère un PDF à partir d'un élément HTML avec options avancées
 */
export async function generatePDFFromElement(
  element: HTMLElement,
  filename: string = 'document.pdf',
  options: Partial<PrintOptions> = {}
): Promise<jsPDF> {
  const config = { ...DEFAULT_PRINT_OPTIONS, ...options };
  
  // Capture l'élément
  const canvas = await captureElement(element, config);
  
  // Créer le PDF
  const pdf = new jsPDF({
    orientation: config.orientation,
    unit: 'mm',
    format: config.format
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = config.margin;
  const contentWidth = pageWidth - (2 * margin);
  const contentHeight = pageHeight - (2 * margin);

  // Calculer les dimensions de l'image
  const imgWidth = canvas.width;
  const imgHeight = canvas.height;
  const ratio = imgWidth / imgHeight;

  let finalWidth = contentWidth;
  let finalHeight = contentWidth / ratio;

  // Ajuster si l'image est trop haute
  if (finalHeight > contentHeight) {
    finalHeight = contentHeight;
    finalWidth = contentHeight * ratio;
  }

  // Centrer l'image
  const x = margin + (contentWidth - finalWidth) / 2;
  const y = margin + (contentHeight - finalHeight) / 2;

  // Ajouter l'image au PDF
  const imgData = canvas.toDataURL('image/png', 1.0);
  pdf.addImage(imgData, 'PNG', x, y, finalWidth, finalHeight);

  return pdf;
}

/**
 * Imprime directement un élément HTML
 */
export async function printElement(
  element: HTMLElement,
  options: Partial<PrintOptions> = {}
): Promise<void> {
  const config = { ...DEFAULT_PRINT_OPTIONS, ...options };
  
  // Créer une nouvelle fenêtre pour l'impression
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    throw new Error('Impossible d\'ouvrir la fenêtre d\'impression');
  }

  // Cloner l'élément et ses styles
  const clonedElement = element.cloneNode(true) as HTMLElement;
  
  // Créer le contenu HTML complet
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Impression - EDIBA INTER</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: Arial, sans-serif;
            font-size: 12pt;
            line-height: 1.4;
            color: #000;
            background: #fff;
          }
          
          @page {
            size: ${config.format} ${config.orientation};
            margin: ${config.margin}mm;
          }
          
          @media print {
            body {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            
            .print-container {
              page-break-inside: avoid;
              break-inside: avoid;
            }
            
            .print-page {
              page-break-after: always;
              break-after: page;
            }
            
            .print-no-break {
              page-break-inside: avoid;
              break-inside: avoid;
            }
            
            .print-table {
              page-break-inside: avoid;
              break-inside: avoid;
            }
            
            .print-table tr {
              page-break-inside: avoid;
              break-inside: avoid;
            }
            
            .print-table td {
              page-break-inside: avoid;
              break-inside: avoid;
            }
            
            .print-header {
              page-break-after: avoid;
              break-after: avoid;
            }
            
            .print-footer {
              page-break-before: avoid;
              break-before: avoid;
            }
            
            .no-print {
              display: none !important;
            }
          }
        </style>
      </head>
      <body>
        ${clonedElement.outerHTML}
      </body>
    </html>
  `;

  // Écrire le contenu dans la fenêtre
  printWindow.document.write(htmlContent);
  printWindow.document.close();

  // Attendre que le contenu soit chargé
  printWindow.onload = () => {
    // Imprimer
    printWindow.print();
    
    // Fermer la fenêtre après impression
    printWindow.onafterprint = () => {
      printWindow.close();
    };
  };
}

/**
 * Sauvegarde un PDF généré
 */
export function savePDF(pdf: jsPDF, filename: string): void {
  pdf.save(filename);
}

/**
 * Ouvre un PDF dans un nouvel onglet
 */
export function openPDFInNewTab(pdf: jsPDF): void {
  const pdfBlob = pdf.output('blob');
  const pdfUrl = URL.createObjectURL(pdfBlob);
  window.open(pdfUrl, '_blank');
  
  // Nettoyer l'URL après un délai
  setTimeout(() => {
    URL.revokeObjectURL(pdfUrl);
  }, 1000);
}

/**
 * Vérifie si l'impression est supportée
 */
export function isPrintSupported(): boolean {
  return typeof window !== 'undefined' && 
         typeof window.print === 'function' &&
         typeof html2canvas !== 'undefined' &&
         typeof jsPDF !== 'undefined';
}

/**
 * Obtient les dimensions optimales pour l'impression
 */
export function getOptimalPrintDimensions(format: 'A4' | 'A3' | 'Letter'): { width: number; height: number } {
  const dimensions = {
    A4: { width: 210, height: 297 },
    A3: { width: 297, height: 420 },
    Letter: { width: 216, height: 279 }
  };
  
  return dimensions[format];
}
