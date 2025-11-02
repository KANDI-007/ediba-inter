import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';

/**
 * Données du document à imprimer.
 */
interface ArticleData {
  designation: string;
  unite: string;
  qte: number;
  prixUnitaire: number;
}

interface DocumentData {
  number: string;         // Numéro de la facture
  date: string;           // Date de facturation (ex. "22 Octobre 2024")
  clientName: string;     // Nom du client
  clientCity: string;     // Ville du client
  items: ArticleData[];   // Liste des articles
  tvaRate: number;        // Taux de TVA en pourcentage (ex. 18)
}

/**
 * Convertit un nombre entier en toutes lettres (français, sans majuscule de début).
 * Par exemple, 124445 → "cent vingt-quatre mille quatre cent quarante-cinq".
 */
function numberToWordsFR(n: number): string {
  if (n === 0) {
    return 'zéro';
  }
  const unites = ['','un','deux','trois','quatre','cinq','six','sept','huit','neuf',
                  'dix','onze','douze','treize','quatorze','quinze','seize',
                  'dix-sept','dix-huit','dix-neuf'];
  const dizaines = ['','dix','vingt','trente','quarante','cinquante','soixante','',
                    'quatre-vingt',''];
  // Convertit un nombre < 1000 en lettres
  function threeDigitsToWords(num: number): string {
    let str = '';
    if (num >= 100) {
      const centaines = Math.floor(num / 100);
      str += (centaines > 1 ? unites[centaines] + ' ' : '') + 'cent';
      num = num % 100;
      if (num > 0) str += ' ';
    }
    if (num < 20) {
      str += unites[num];
    } else {
      let d = Math.floor(num / 10);
      let u = num % 10;
      if (d === 7 || d === 9) {
        // 70 à 79 (soixante-dix..dix-neuf) et 90 à 99 (quatre-vingt-dix..dix-neuf)
        str += dizaines[d - 1] + (d === 9 ? ' ' : '-') + unites[10 + u];
      } else {
        str += dizaines[d] + (u > 0 && d !== 8 ? '-' : '');
        if (d === 8 && u === 0) {
          // exactly 80: "quatre-vingts"
          str += 's';
        }
        str += (u > 0 ? unites[u] : '');
      }
    }
    return str;
  }
  let result = '';
  // MIllions, milliers, reste
  const millions = Math.floor(n / 1000000);
  if (millions > 0) {
    result += threeDigitsToWords(millions) + ' million' + (millions > 1 ? 's ' : ' ');
  }
  const milliers = Math.floor((n % 1000000) / 1000);
  if (milliers > 0) {
    // Pas de "un" devant "mille"
    result += (milliers > 1 ? threeDigitsToWords(milliers) + ' ' : '') + 'mille ';
  }
  const reste = n % 1000;
  if (reste > 0) {
    result += threeDigitsToWords(reste);
  }
  return result.trim();
}

/**
 * Génère le PDF de la facture/proforma pour EDIBA INTER.
 */
export function generatePDFDirect(document: DocumentData, type: string): jsPDF {
  // Création du PDF A4 portrait (unités en mm):contentReference[oaicite:12]{index=12}.
  const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;

  // **En-tête** : nom de l'entreprise et coordonnées
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('EDIBA INTER SARL U', margin, 30);              // Nom société
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Adresse : Rue 331 AGP, Totsi, Lomé', margin, 36);
  doc.text('Tél. : +228 93391870', margin, 42);
  doc.text('Email : edibainter@gmail.com', margin, 48);

  // Date et numéro de document à droite
  const rightX = pageWidth - margin;
  doc.text(`Lomé, le ${document.date}`, rightX, 30, { align: 'right' });
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(`${type} N° ${document.number}`, pageWidth/2, 54, { align: 'center' });
  
  // Client et ville
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(`Client : ${document.clientName}`, margin, 64);
  doc.text(`Ville : ${document.clientCity}`, margin, 70);

  // **Tableau des articles** (avec jspdf-autotable):contentReference[oaicite:13]{index=13}.
  // Préparation des données
  const rows = document.items.map((item, index) => {
    const montant = item.qte * item.prixUnitaire;
    return [
      (index + 1).toString(),
      item.designation,
      item.unite,
      item.qte.toString(),
      item.prixUnitaire.toLocaleString('fr-FR'),
      montant.toLocaleString('fr-FR')
    ];
  });
  // Définit Y de départ du tableau (sous l'entête)
  const tableStartY = 80;
  // Génère le tableau avec colonnes et styles
  doc.setFontSize(10);
  (autoTable as any)(doc, {
    startY: tableStartY,
    head: [['N°','Désignation','Unité','Qté','Prix Unitaire','Montant']],
    body: rows,
    theme: 'grid',
    styles: { font: 'helvetica', fontSize: 10 },
    headStyles: { fontStyle: 'bold', fillColor: [230, 230, 230] },
    columnStyles: {
      0: { halign: 'center', cellWidth: 10 },
      3: { halign: 'right' },
      4: { halign: 'right' },
      5: { halign: 'right' }
    }
  });

  // Récupère la position Y finale du tableau pour y placer les totaux:contentReference[oaicite:14]{index=14}.
  // (en TS on doit caster car lastAutoTable n'est pas déclaré dans les types)
  const finalY = ((doc as any).lastAutoTable?.finalY || tableStartY) + 10;

  // **Calculs des totaux** (HT, TVA, TTC) et affichage
  const totalHT = document.items
    .reduce((sum, item) => sum + item.qte * item.prixUnitaire, 0);
  const tvaAmount = Math.round(totalHT * document.tvaRate / 100);
  const totalTTC = totalHT + tvaAmount;
  doc.setFont('helvetica', 'bold');
  doc.text('TOTAL HT', margin, finalY);
  doc.text(totalHT.toLocaleString('fr-FR'), rightX, finalY, { align: 'right' });
  doc.text(`TVA (${document.tvaRate}%)`, margin, finalY + 7);
  doc.text(tvaAmount.toLocaleString('fr-FR'), rightX, finalY + 7, { align: 'right' });
  doc.text('TOTAL TTC', margin, finalY + 14);
  doc.text(totalTTC.toLocaleString('fr-FR'), rightX, finalY + 14, { align: 'right' });

  // **Montant en toutes lettres** (en français, FCFA):contentReference[oaicite:15]{index=15}.
  const montantLettres = numberToWordsFR(totalTTC);
  const textLettres = `Arrêté la présente ${type.toLowerCase()} à la somme de : `
    + `${montantLettres} FCFA TTC.`;
  const splitText = doc.splitTextToSize(textLettres, pageWidth - 2 * margin);
  doc.setFont('helvetica', 'normal');
  doc.text(splitText, margin, finalY + 25);

  // **Signature de la directrice** (nom en bas à droite)
  doc.text('La Directrice', margin, finalY + 45);
  doc.text('ALAYI ABIDE', rightX, finalY + 45, { align: 'right' });

  // **Pied de page** : bandeau bleu avec coordonnées en blanc
  const pageHeight = doc.internal.pageSize.getHeight();
  const footerHeight = 12;
  doc.setFillColor(10, 36, 99);  // bleu foncé
  doc.rect(0, pageHeight - footerHeight, pageWidth, footerHeight, 'F');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  const footerText = 'EDIBA INTER SARL U – Rue 331 AGP, Totsi, Lomé – Tél. +228 93391870 – edibainter@gmail.com';
  doc.text(footerText, margin, pageHeight - 4);

  // Retourne le document PDF finalisé
  return doc;
}

/**
 * Génère un PDF à partir d'un template React rendu
 */
export async function generatePDFFromTemplate(
  templateElement: HTMLElement, 
  filename: string = 'document.pdf'
): Promise<jsPDF> {
  try {
    // Sauvegarder la position de scroll originale
    const originalScrollTop = templateElement.scrollTop;
    const originalScrollLeft = templateElement.scrollLeft;
    
    // Forcer le scroll en haut pour capturer tout depuis le début
    templateElement.scrollTop = 0;
    templateElement.scrollLeft = 0;
    
    // Attendre que le DOM soit complètement rendu
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // S'assurer que tous les éléments sont visibles (désactiver overflow hidden temporairement)
    const originalOverflow = templateElement.style.overflow;
    const originalOverflowY = templateElement.style.overflowY;
    templateElement.style.overflow = 'visible';
    templateElement.style.overflowY = 'visible';
    
    // Obtenir les dimensions réelles du contenu
    const contentWidth = templateElement.scrollWidth || templateElement.offsetWidth;
    const contentHeight = templateElement.scrollHeight || templateElement.offsetHeight;
    
    // Capture le template avec html2canvas - configuration optimisée
    const canvas = await html2canvas(templateElement, {
      scale: 2, // Améliore la qualité
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: contentWidth,
      height: contentHeight,
      windowWidth: contentWidth,
      windowHeight: contentHeight,
      scrollX: 0,
      scrollY: 0,
      logging: false, // Désactiver les logs pour performance
      onclone: (clonedDoc) => {
        // S'assurer que tous les éléments sont visibles dans le clone
        const clonedElement = clonedDoc.querySelector('[data-invoice-template]') || 
                             clonedDoc.body.querySelector('div.print-container') ||
                             clonedDoc.body.querySelector('div');
        if (clonedElement) {
          (clonedElement as HTMLElement).style.overflow = 'visible';
          (clonedElement as HTMLElement).style.overflowY = 'visible';
          (clonedElement as HTMLElement).style.height = 'auto';
          (clonedElement as HTMLElement).style.maxHeight = 'none';
        }
        
        // S'assurer que les sections totaux sont visibles
        const totalsElements = clonedDoc.querySelectorAll('.invoice-totals, .print-no-break');
        totalsElements.forEach((el: Element) => {
          (el as HTMLElement).style.display = 'block';
          (el as HTMLElement).style.visibility = 'visible';
          (el as HTMLElement).style.opacity = '1';
          (el as HTMLElement).style.position = 'relative';
          (el as HTMLElement).style.height = 'auto';
        });
      }
    });
    
    // Restaurer les styles originaux
    templateElement.style.overflow = originalOverflow;
    templateElement.style.overflowY = originalOverflowY;
    templateElement.scrollTop = originalScrollTop;
    templateElement.scrollLeft = originalScrollLeft;

    // Crée le PDF
    const imgData = canvas.toDataURL('image/png', 1.0);
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Calcule les dimensions pour ajuster l'image au format A4
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    
    // Calculer le ratio pour que l'image tienne sur la page
    const widthRatio = pdfWidth / imgWidth;
    const heightRatio = pdfHeight / imgHeight;
    const ratio = Math.min(widthRatio, heightRatio);
    
    const finalWidth = imgWidth * ratio;
    const finalHeight = imgHeight * ratio;
    
    // Si l'image est plus haute qu'une page, découper en plusieurs pages
    if (finalHeight > pdfHeight) {
      let heightLeft = imgHeight;
      let position = 0;
      
      // Ajouter la première page
      pdf.addImage(imgData, 'PNG', 0, 0, finalWidth, finalHeight);
      heightLeft -= pdfHeight / ratio;
      
      // Ajouter les pages suivantes si nécessaire
      while (heightLeft > 0) {
        position = (imgHeight - heightLeft) * ratio;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, -position, finalWidth, imgHeight * ratio);
        heightLeft -= pdfHeight / ratio;
      }
    } else {
      // Centre l'image sur la page si elle tient sur une page
      const x = (pdfWidth - finalWidth) / 2;
      const y = (pdfHeight - finalHeight) / 2;
      pdf.addImage(imgData, 'PNG', x, y, finalWidth, finalHeight);
    }

    return pdf;
  } catch (error) {
    console.error('Erreur lors de la génération du PDF:', error);
    throw error;
  }
}

/**
 * Génère un PDF à partir d'un template React avec impression directe
 */
export async function printTemplateDirect(
  templateElement: HTMLElement
): Promise<void> {
  try {
    // Capture le template avec html2canvas
    const canvas = await html2canvas(templateElement, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: templateElement.scrollWidth,
      height: templateElement.scrollHeight
    });

    // Crée le PDF
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Calcule les dimensions pour ajuster l'image au format A4
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    
    // Calcule le ratio pour ajuster l'image
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    const finalWidth = imgWidth * ratio;
    const finalHeight = imgHeight * ratio;

    // Centre l'image sur la page
    const x = (pdfWidth - finalWidth) / 2;
    const y = (pdfHeight - finalHeight) / 2;

    // Ajoute l'image au PDF
    pdf.addImage(imgData, 'PNG', x, y, finalWidth, finalHeight);

    // Ouvre le PDF pour impression
    pdf.autoPrint();
    window.open(pdf.output('bloburl'), '_blank');
  } catch (error) {
    console.error('Erreur lors de l\'impression:', error);
    throw error;
  }
}
