import React from 'react';
import { Download } from 'lucide-react';
import { exportClientInvoiceJournal, exportSupplierInvoiceJournal, InvoiceData, SupplierInvoiceData } from '../utils/ExcelGeneratorSimple';

const ExcelTestComponent: React.FC = () => {
  // Données de test pour le journal des factures clients
  const testClientData: InvoiceData[] = [
    {
      numero: 'F2500001',
      nom: 'ASSEMBLEE NATIONALE',
      objet: 'CONSOMMABLE',
      montantHT: 0,
      tva: 0,
      montantTTC: 0,
      etatPaiement: 'Payé',
      etatExecution: 'PLEIN',
      etatArchive: 'FAIT',
      etatOTR: 'DECLARE',
      date: '9/1/2025'
    },
    {
      numero: 'F2500002',
      nom: 'ASSEMBLEE NATIONALE',
      objet: 'CONSOMMABLE',
      montantHT: 60000,
      tva: 10800,
      montantTTC: 70800,
      etatPaiement: 'Payé',
      etatExecution: 'PLEIN',
      etatArchive: 'FAIT',
      etatOTR: 'DECLARE',
      date: '16/1/2025'
    },
    {
      numero: 'F2500003',
      nom: 'ASSEMBLEE NATIONALE',
      objet: 'CONSOMMABLE',
      montantHT: 670000,
      tva: 120600,
      montantTTC: 790600,
      etatPaiement: 'Payé',
      etatExecution: 'PLEIN',
      etatArchive: 'FAIT',
      etatOTR: 'DECLARE',
      date: '17/1/2025'
    }
  ];

  // Données de test pour le journal des factures fournisseurs
  const testSupplierData: SupplierInvoiceData[] = [
    {
      date: '17/1/2025',
      numeroFacture: 'AF25003291',
      fournisseur: 'CCT-BATIMENT',
      nif: '1000166149',
      objet: 'PRODUIT MECANIQUE',
      montantHT: 15593,
      tva: 2807,
      montantTTC: 18400,
      etatExecution: 'PLEIN',
      etatPaiement: 'TOTAL',
      etatArchive: 'FAIT',
      etatOTR: 'DECLARE',
      autreEtat: 'RIEN',
      periodeDeclaration: 'Janvier'
    },
    {
      date: '28/1/2025',
      numeroFacture: '2473F2025',
      fournisseur: 'STE LE WATT',
      nif: '1000116343',
      objet: 'PRODUITS D\'ELECTRICITE',
      montantHT: 178983,
      tva: 32217,
      montantTTC: 211200,
      etatExecution: 'PLEIN',
      etatPaiement: 'TOTAL',
      etatArchive: 'FAIT',
      etatOTR: 'DECLARE',
      autreEtat: 'RIEN',
      periodeDeclaration: 'Janvier'
    },
    {
      date: '15/1/2025',
      numeroFacture: 'A-619/617',
      fournisseur: 'CHINA MALL',
      nif: '1000123456',
      objet: 'MOBILIER DE BUREAU',
      montantHT: 1555.93,
      tva: 2181,
      montantTTC: 14300,
      etatExecution: 'PLEIN',
      etatPaiement: 'TOTAL',
      etatArchive: 'FAIT',
      etatOTR: 'DECLARE',
      autreEtat: 'RIEN',
      periodeDeclaration: 'Janvier'
    },
    {
      date: '20/1/2025',
      numeroFacture: 'GAL-2025-001',
      fournisseur: 'Galerie Comfortium',
      nif: '1000134567',
      objet: 'ACHATS DIVERSES',
      montantHT: 25000,
      tva: 4500,
      montantTTC: 29500,
      etatExecution: 'PLEIN',
      etatPaiement: 'TOTAL',
      etatArchive: 'FAIT',
      etatOTR: 'DECLARE',
      autreEtat: 'RIEN',
      periodeDeclaration: 'Janvier'
    },
    {
      date: '25/1/2025',
      numeroFacture: 'PAP-2025-002',
      fournisseur: 'PAPETERIE CENTRALE',
      nif: '1000145678',
      objet: 'PRODUIT PAPIER',
      montantHT: 8500,
      tva: 1530,
      montantTTC: 10030,
      etatExecution: 'PLEIN',
      etatPaiement: 'TOTAL',
      etatArchive: 'FAIT',
      etatOTR: 'DECLARE',
      autreEtat: 'RIEN',
      periodeDeclaration: 'Janvier'
    }
  ];

  const handleExportClientJournal = async () => {
    await exportClientInvoiceJournal(testClientData, 'Test_Journal_Factures_Clients.xlsx');
  };

  const handleExportSupplierJournal = async () => {
    await exportSupplierInvoiceJournal(testSupplierData, 'Test_Journal_Factures_Fournisseurs.xlsx');
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Test Export Excel</h2>
      
      <div className="space-y-4">
        <div className="p-4 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">Journal des Factures Clients</h3>
          <p className="text-blue-600 mb-4">
            Export avec formatage fidèle aux images fournies : couleurs, bordures, et styles.
          </p>
          <button
            onClick={handleExportClientJournal}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <Download className="w-4 h-4 mr-2" />
            Exporter Journal Clients
          </button>
        </div>

        <div className="p-4 bg-green-50 rounded-lg">
          <h3 className="text-lg font-semibold text-green-800 mb-2">Journal des Factures Fournisseurs</h3>
          <p className="text-green-600 mb-4">
            Export avec formatage fidèle aux images fournies : couleurs, bordures, et styles.
          </p>
          <button
            onClick={handleExportSupplierJournal}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
          >
            <Download className="w-4 h-4 mr-2" />
            Exporter Journal Fournisseurs
          </button>
        </div>
      </div>

      <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
        <h4 className="text-md font-semibold text-yellow-800 mb-2">Fonctionnalités Implémentées :</h4>
        <ul className="text-yellow-700 space-y-1">
          <li>• Couleurs fidèles aux images (en-têtes gris, données bleu clair, paiements vert)</li>
          <li>• Bordures et formatage des cellules</li>
          <li>• Titre principal avec fond rouge</li>
          <li>• Cellule de déclaration avec bordure épaisse et texte rouge</li>
          <li>• Fusion de cellules pour le titre et la déclaration</li>
          <li>• Styles de police (gras, italique) selon les images</li>
        </ul>
      </div>
    </div>
  );
};

export default ExcelTestComponent;
