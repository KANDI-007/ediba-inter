// Types pour les données des journaux
export interface InvoiceData {
  numero: string;
  nom: string;
  nif: string;
  objet: string;
  montantHT: number;
  tva: number;
  montantTTC: number;
  etatExecution: string;
  etatPaiement: string;
  etatArchive: string;
  etatOtr: string;
  date: string;
  periodeDeclaration: string;
}

export interface SupplierInvoiceData {
  date: string;
  numeroFacture: string;
  fournisseur: string;
  nif: string;
  objet: string;
  montantHT: number;
  tva: number;
  montantTTC: number;
  etatExecution: string;
  etatPaiement: string;
  etatArchive: string;
  etatOTR: string;
  autreEtat: string;
  periodeDeclaration: string;
}

// Fonction pour charger XLSX depuis CDN
const loadXLSX = async () => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('XLSX can only be loaded in browser environment'));
      return;
    }

    // Vérifier si XLSX est déjà chargé
    if ((window as any).XLSX) {
      resolve((window as any).XLSX);
      return;
    }

    // Charger depuis CDN
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js';
    script.onload = () => {
      resolve((window as any).XLSX);
    };
    script.onerror = () => {
      reject(new Error('Failed to load XLSX library'));
    };
    document.head.appendChild(script);
  });
};

// Couleurs basées sur les images fournies
const COLORS = {
  headerBg: 'FF404040',        // Gris foncé pour les en-têtes
  headerText: 'FFFFFFFF',      // Blanc pour les en-têtes
  dataBg: 'FFB0E0E6',          // Bleu clair pour les données
  dataText: 'FF000000',        // Noir pour les données
  paymentBg: 'FF90EE90',       // Vert clair pour les paiements
  paymentText: 'FF000000',     // Noir pour les paiements
  titleBg: 'FF8B0000',         // Rouge foncé pour le titre
  titleText: 'FFFFFFFF',       // Blanc pour le titre
  declarationBg: 'FF4682B4',   // Bleu plus foncé pour la déclaration
  declarationText: 'FFFFFFFF', // Blanc pour la déclaration
  border: 'FF000000'           // Noir pour les bordures
};

// Fonction pour créer un style de cellule
const createCellStyle = (bgColor: string, textColor: string, bold = false, italic = false) => ({
  fill: {
    fgColor: { rgb: bgColor }
  },
  font: {
    color: { rgb: textColor },
    bold,
    italic,
    size: 11
  },
  border: {
    top: { style: 'thin', color: { rgb: COLORS.border } },
    bottom: { style: 'thin', color: { rgb: COLORS.border } },
    left: { style: 'thin', color: { rgb: COLORS.border } },
    right: { style: 'thin', color: { rgb: COLORS.border } }
  },
  alignment: {
    horizontal: 'center',
    vertical: 'center'
  }
});

// Fonction pour exporter le journal des factures clients
export const exportClientInvoiceJournal = async (data: InvoiceData[], filename: string = 'Journal_Factures_Clients.xlsx') => {
  try {
    const XLSX = await loadXLSX() as any;
    const workbook = XLSX.utils.book_new();
    
    // Créer les données pour le tableau
    const headers = ['NUMERO', 'NOM', 'NIF', 'OBJET', 'MONTANT HT', 'TVA', 'MONTANT TTC', 'ETAT EXECUTION', 'ETAT DE PAYEMENT', 'ETAT ARCHIVE', 'ETAT OTR', 'DATE', 'PERIODE DECLARATION'];
    
    // Préparer les données
    const worksheetData = [
      // Ligne vide
      [],
      // Titre principal
      ['', '', '', '', '', 'JOURNAL DES FACTURES CLIENTS', '', '', '', '', '', '', ''],
      // Lignes vides
      [],
      [],
      // En-têtes
      headers,
      // Données
      ...data.map(invoice => [
        invoice.numero,
        invoice.nom,
        invoice.nif || '',
        invoice.objet,
        invoice.montantHT,
        invoice.tva,
        invoice.montantTTC,
        invoice.etatExecution,
        invoice.etatPaiement,
        invoice.etatArchive,
        invoice.etatOtr,
        invoice.date,
        invoice.periodeDeclaration || ''
      ])
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    
    // Appliquer les styles
    const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1:A1');
    
    // Style pour le titre (ligne 2, colonnes E-H)
    for (let col = 4; col <= 7; col++) {
      const cellRef = XLSX.utils.encode_cell({ r: 1, c: col });
      if (!worksheet[cellRef]) worksheet[cellRef] = { v: '' };
      worksheet[cellRef].s = createCellStyle(COLORS.titleBg, COLORS.titleText, true);
    }
    
    // Style pour les en-têtes (ligne 5)
    for (let col = 0; col < headers.length; col++) {
      const cellRef = XLSX.utils.encode_cell({ r: 4, c: col });
      if (!worksheet[cellRef]) worksheet[cellRef] = { v: '' };
      worksheet[cellRef].s = createCellStyle(COLORS.headerBg, COLORS.headerText, true);
    }
    
    // Style pour les données
    for (let row = 5; row < 5 + data.length; row++) {
      for (let col = 0; col < headers.length; col++) {
        const cellRef = XLSX.utils.encode_cell({ r: row, c: col });
        if (!worksheet[cellRef]) worksheet[cellRef] = { v: '' };
        
        // Style spécial pour la colonne ETAT DE PAYEMENT (vert clair)
        if (col === 8) { // ETAT DE PAYEMENT (nouvelle position après ETAT EXECUTION)
          worksheet[cellRef].s = createCellStyle(COLORS.paymentBg, COLORS.paymentText);
        } else {
          worksheet[cellRef].s = createCellStyle(COLORS.dataBg, COLORS.dataText);
        }
      }
    }
    
    // Fusionner les cellules pour le titre
    if (!worksheet['!merges']) worksheet['!merges'] = [];
    worksheet['!merges'].push({ s: { r: 1, c: 4 }, e: { r: 1, c: 7 } });
    
    // Configuration des colonnes
    worksheet['!cols'] = headers.map(() => ({ wch: 15 }));
    worksheet['!rows'] = [{ hpt: 20 }];
    
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Journal Factures Clients');
    
    // Télécharger le fichier
    const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename.endsWith('.xlsx') ? filename : `${filename}.xlsx`;
    a.click();
    URL.revokeObjectURL(url);
    
  } catch (error) {
    console.error('Erreur lors de l\'export Excel:', error);
    alert('Erreur lors de l\'export Excel. Veuillez réessayer.');
  }
};

// Fonction pour exporter le journal des factures fournisseurs
export const exportSupplierInvoiceJournal = async (data: SupplierInvoiceData[], filename: string = 'Journal_Factures_Fournisseurs.xlsx') => {
  try {
    const XLSX = await loadXLSX() as any;
    const workbook = XLSX.utils.book_new();
    
    // Créer les données pour le tableau
    const headers = [
      'DATE', 'NUMERO FACTURE', 'FOURNISSEUR', 'NIF', 'OBJET', 
      'MONTANT H T', 'TVA', 'MONTANT TTC', 'ETAT EXCECUTION', 
      'ETAT PAYEMENT', 'ETAT ARCHIVE', 'ETAT OTR', 'AUTRE ETAT', 'PERIODE DE DECLARATION'
    ];
    
    // Préparer les données
    const worksheetData = [
      // Ligne vide
      [],
      // Titre principal (centré sur les colonnes E-H)
      ['', '', '', '', 'JOURNAL DES FACTURES FOURNISSEURS', '', '', ''],
      // Lignes vides
      [],
      [],
      // En-têtes
      headers,
      // Données
      ...data.map(invoice => [
        invoice.date,
        invoice.numeroFacture,
        invoice.fournisseur,
        invoice.nif,
        invoice.objet,
        invoice.montantHT,
        invoice.tva,
        invoice.montantTTC,
        invoice.etatExecution,
        invoice.etatPaiement,
        invoice.etatArchive,
        invoice.etatOTR,
        invoice.autreEtat,
        invoice.periodeDeclaration
      ])
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    
    // Appliquer les styles
    const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1:A1');
    
    // Style pour le titre (ligne 2, colonnes E-H)
    for (let col = 4; col <= 7; col++) {
      const cellRef = XLSX.utils.encode_cell({ r: 1, c: col });
      if (!worksheet[cellRef]) worksheet[cellRef] = { v: '' };
      worksheet[cellRef].s = createCellStyle(COLORS.titleBg, COLORS.titleText, true);
    }
    
    // Style pour les en-têtes (ligne 5)
    for (let col = 0; col < headers.length; col++) {
      const cellRef = XLSX.utils.encode_cell({ r: 4, c: col });
      if (!worksheet[cellRef]) worksheet[cellRef] = { v: '' };
      worksheet[cellRef].s = createCellStyle(COLORS.headerBg, COLORS.headerText, true);
    }
    
    // Style pour les données
    for (let row = 5; row < 5 + data.length; row++) {
      for (let col = 0; col < headers.length; col++) {
        const cellRef = XLSX.utils.encode_cell({ r: row, c: col });
        if (!worksheet[cellRef]) worksheet[cellRef] = { v: '' };
        
        // Style spécial pour la colonne PERIODE DE DECLARATION (bleu foncé avec texte blanc)
        if (col === headers.length - 1) { // Dernière colonne
          worksheet[cellRef].s = createCellStyle(COLORS.declarationBg, COLORS.declarationText);
        } else {
          worksheet[cellRef].s = createCellStyle(COLORS.dataBg, COLORS.dataText);
        }
      }
    }
    
    // Fusionner les cellules pour le titre
    if (!worksheet['!merges']) worksheet['!merges'] = [];
    worksheet['!merges'].push({ s: { r: 1, c: 4 }, e: { r: 1, c: 7 } });
    
    // Configuration des colonnes
    worksheet['!cols'] = headers.map(() => ({ wch: 15 }));
    worksheet['!rows'] = [{ hpt: 20 }];
    
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Journal Factures Fournisseurs');
    
    // Télécharger le fichier
    const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename.endsWith('.xlsx') ? filename : `${filename}.xlsx`;
    a.click();
    URL.revokeObjectURL(url);
    
  } catch (error) {
    console.error('Erreur lors de l\'export Excel:', error);
    alert('Erreur lors de l\'export Excel. Veuillez réessayer.');
  }
};
