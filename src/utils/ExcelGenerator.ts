// Import dynamique pour éviter les problèmes de résolution avec Vite
let XLSX: any = null;

const loadXLSX = async () => {
  if (!XLSX) {
    XLSX = await import('xlsx');
  }
  return XLSX;
};

// Types pour les données des journaux
export interface InvoiceData {
  numero: string;
  nom: string;
  objet: string;
  montantHT: number;
  tva: number;
  montantTTC: number;
  etatPaiement: string;
  etatExecution: string;
  etatArchive: string;
  etatOTR: string;
  date: string;
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

// Couleurs basées sur les images fournies
const COLORS = {
  // Couleurs des en-têtes (gris foncé avec texte blanc)
  headerBg: 'FF404040',
  headerText: 'FFFFFFFF',
  
  // Couleurs des cellules de données (bleu clair)
  dataBg: 'FFB0E0E6',
  dataText: 'FF000000',
  
  // Couleurs des cellules de paiement (vert clair)
  paymentBg: 'FF90EE90',
  paymentText: 'FF000000',
  
  // Couleurs du titre principal (rouge foncé avec texte blanc)
  titleBg: 'FF8B0000',
  titleText: 'FFFFFFFF',
  
  // Couleurs de la cellule de déclaration (bleu avec texte rouge)
  declarationBg: 'FF4169E1',
  declarationText: 'FFFF0000',
  
  // Couleurs des bordures
  border: 'FF000000',
  thickBorder: 'FF000000'
};

// Styles pour les cellules
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

const createThickBorderStyle = (bgColor: string, textColor: string, bold = false, italic = false) => ({
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
    top: { style: 'thick', color: { rgb: COLORS.thickBorder } },
    bottom: { style: 'thick', color: { rgb: COLORS.thickBorder } },
    left: { style: 'thick', color: { rgb: COLORS.thickBorder } },
    right: { style: 'thick', color: { rgb: COLORS.thickBorder } }
  },
  alignment: {
    horizontal: 'center',
    vertical: 'center'
  }
});

export class ExcelGenerator {
  private workbook: any;

  constructor() {
    // Le workbook sera initialisé dans les méthodes
  }

  // Générer le journal des factures clients
  async generateClientInvoiceJournal(data: InvoiceData[], filename: string = 'Journal_Factures_Clients.xlsx') {
    const xlsx = await loadXLSX();
    this.workbook = xlsx.utils.book_new();
    const worksheet = xlsx.utils.aoa_to_sheet([]);
    
    // Titre principal (ligne 2, colonnes E-H)
    this.setCellValue(worksheet, 'E2', 'JOURNAL DES FACTURES CLIENTS');
    this.setCellStyle(worksheet, 'E2', createCellStyle(COLORS.titleBg, COLORS.titleText, true));
    this.mergeCells(worksheet, 'E2:H2');

    // En-têtes (ligne 5)
    const headers = ['NUMERO', 'NOM', 'OBJET', 'MONTANT HT', 'TVA', 'MONTANT TTC', 'ETAT DE PAYEMENT', 'ETAT EXCECUTION', 'ETAT ARCHIVE', 'ETAT OTR', 'DATE'];
    headers.forEach((header, index) => {
      const cellRef = xlsx.utils.encode_cell({ r: 4, c: index + 1 }); // Ligne 5 (index 4)
      this.setCellValue(worksheet, cellRef, header);
      this.setCellStyle(worksheet, cellRef, createCellStyle(COLORS.headerBg, COLORS.headerText, true));
    });

    // Données (lignes 6+)
    data.forEach((invoice, rowIndex) => {
      const dataRow = 5 + rowIndex; // Commence à la ligne 6
      const rowData = [
        invoice.numero,
        invoice.nom,
        invoice.objet,
        invoice.montantHT,
        invoice.tva,
        invoice.montantTTC,
        invoice.etatPaiement,
        invoice.etatExecution,
        invoice.etatArchive,
        invoice.etatOTR,
        invoice.date
      ];

      rowData.forEach((value, colIndex) => {
        const cellRef = xlsx.utils.encode_cell({ r: dataRow, c: colIndex + 1 });
        this.setCellValue(worksheet, cellRef, value);
        
        // Style spécial pour la colonne ETAT DE PAYEMENT (vert clair)
        if (colIndex === 6) { // ETAT DE PAYEMENT
          this.setCellStyle(worksheet, cellRef, createCellStyle(COLORS.paymentBg, COLORS.paymentText));
        } else {
          this.setCellStyle(worksheet, cellRef, createCellStyle(COLORS.dataBg, COLORS.dataText));
        }
      });
    });

    // Cellule de déclaration (colonne M, lignes 6-8)
    const declarationRow = 5; // Ligne 6
    const declarationCol = 12; // Colonne M
    const declarationCellRef = xlsx.utils.encode_cell({ r: declarationRow, c: declarationCol });
    this.setCellValue(worksheet, declarationCellRef, 'Déclaré pour Janvier');
    this.setCellStyle(worksheet, declarationCellRef, createThickBorderStyle(COLORS.declarationBg, COLORS.declarationText, true, true));
    this.mergeCells(worksheet, `${declarationCellRef}:${xlsx.utils.encode_cell({ r: declarationRow + 2, c: declarationCol })}`);

    // Configuration des colonnes
    worksheet['!cols'] = headers.map(() => ({ wch: 15 }));
    worksheet['!rows'] = [{ hpt: 20 }];

    this.workbook.Sheets['Journal Factures Clients'] = worksheet;
    this.workbook.SheetNames.push('Journal Factures Clients');

    this.downloadFile(filename, xlsx);
  }

  // Générer le journal des factures fournisseurs
  async generateSupplierInvoiceJournal(data: SupplierInvoiceData[], filename: string = 'Journal_Factures_Fournisseurs.xlsx') {
    const xlsx = await loadXLSX();
    this.workbook = xlsx.utils.book_new();
    const worksheet = xlsx.utils.aoa_to_sheet([]);
    
    // Titre principal (ligne 2, colonnes E-H)
    this.setCellValue(worksheet, 'E2', 'JOURNAL DES FACTURES FOURNISSEURS');
    this.setCellStyle(worksheet, 'E2', createCellStyle(COLORS.titleBg, COLORS.titleText, true));
    this.mergeCells(worksheet, 'E2:H2');

    // En-têtes (ligne 5)
    const headers = [
      'DATE', 'NUMERO FACTURE', 'FOURNISSEUR', 'NIF', 'OBJET', 
      'MONTANT H T', 'TVA', 'MONTANT TTC', 'ETAT EXCECUTION', 
      'ETAT PAYEMENT', 'ETAT ARCHIVE', 'ETAT OTR', 'AUTRE ETAT', 'PERIODE DE DECLARATION'
    ];
    
    headers.forEach((header, index) => {
      const cellRef = xlsx.utils.encode_cell({ r: 4, c: index }); // Ligne 5 (index 4)
      this.setCellValue(worksheet, cellRef, header);
      this.setCellStyle(worksheet, cellRef, createCellStyle(COLORS.headerBg, COLORS.headerText, true));
    });

    // Données (lignes 6+)
    data.forEach((invoice, rowIndex) => {
      const dataRow = 5 + rowIndex; // Commence à la ligne 6
      const rowData = [
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
      ];

      rowData.forEach((value, colIndex) => {
        const cellRef = xlsx.utils.encode_cell({ r: dataRow, c: colIndex });
        this.setCellValue(worksheet, cellRef, value);
        
        // Style spécial pour la colonne ETAT PAYEMENT (vert clair)
        if (colIndex === 9) { // ETAT PAYEMENT
          this.setCellStyle(worksheet, cellRef, createCellStyle(COLORS.paymentBg, COLORS.paymentText));
        } else {
          this.setCellStyle(worksheet, cellRef, createCellStyle(COLORS.dataBg, COLORS.dataText));
        }
      });
    });

    // Cellule de déclaration (colonne N, lignes 6-18)
    const declarationRow = 5; // Ligne 6
    const declarationCol = 13; // Colonne N
    const declarationCellRef = xlsx.utils.encode_cell({ r: declarationRow, c: declarationCol });
    this.setCellValue(worksheet, declarationCellRef, 'Dédaré pour Janvier');
    this.setCellStyle(worksheet, declarationCellRef, createThickBorderStyle(COLORS.declarationBg, COLORS.declarationText, true, true));
    this.mergeCells(worksheet, `${declarationCellRef}:${xlsx.utils.encode_cell({ r: declarationRow + 12, c: declarationCol })}`);

    // Configuration des colonnes
    worksheet['!cols'] = headers.map(() => ({ wch: 15 }));
    worksheet['!rows'] = [{ hpt: 20 }];

    this.workbook.Sheets['Journal Factures Fournisseurs'] = worksheet;
    this.workbook.SheetNames.push('Journal Factures Fournisseurs');

    this.downloadFile(filename, xlsx);
  }

  // Méthodes utilitaires
  private setCellValue(worksheet: any, cellRef: string, value: any) {
    if (!worksheet[cellRef]) {
      worksheet[cellRef] = { v: value };
    } else {
      worksheet[cellRef].v = value;
    }
  }

  private setCellStyle(worksheet: any, cellRef: string, style: any) {
    if (!worksheet[cellRef]) {
      worksheet[cellRef] = { v: '', s: style };
    } else {
      worksheet[cellRef].s = style;
    }
  }

  private mergeCells(worksheet: any, range: string) {
    if (!worksheet['!merges']) {
      worksheet['!merges'] = [];
    }
    // Note: decode_range sera géré par l'import dynamique
    const [start, end] = range.split(':');
    const startCell = this.parseCellRef(start);
    const endCell = this.parseCellRef(end);
    worksheet['!merges'].push({
      s: { r: startCell.r, c: startCell.c },
      e: { r: endCell.r, c: endCell.c }
    });
  }

  private parseCellRef(cellRef: string) {
    const match = cellRef.match(/([A-Z]+)(\d+)/);
    if (!match) return { r: 0, c: 0 };
    const col = match[1];
    const row = parseInt(match[2]) - 1;
    let colNum = 0;
    for (let i = 0; i < col.length; i++) {
      colNum = colNum * 26 + (col.charCodeAt(i) - 64);
    }
    return { r: row, c: colNum - 1 };
  }

  private downloadFile(filename: string, xlsx: any) {
    const wbout = xlsx.write(this.workbook, { 
      bookType: 'xlsx', 
      type: 'array',
      cellStyles: true 
    });
    
    const blob = new Blob([wbout], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename.endsWith('.xlsx') ? filename : `${filename}.xlsx`;
    a.click();
    URL.revokeObjectURL(url);
  }
}

// Fonctions d'export directes
export const exportClientInvoiceJournal = async (data: InvoiceData[], filename?: string) => {
  const generator = new ExcelGenerator();
  await generator.generateClientInvoiceJournal(data, filename);
};

export const exportSupplierInvoiceJournal = async (data: SupplierInvoiceData[], filename?: string) => {
  const generator = new ExcelGenerator();
  await generator.generateSupplierInvoiceJournal(data, filename);
};
