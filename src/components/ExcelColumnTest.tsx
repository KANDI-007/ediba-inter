import React from 'react';
import { Download } from 'lucide-react';
import { exportSupplierInvoiceJournal, SupplierInvoiceData } from '../utils/ExcelGeneratorSimple';

const ExcelColumnTest: React.FC = () => {
  // Données de test pour vérifier les colonnes
  const testData: SupplierInvoiceData[] = [
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
    }
  ];

  const handleExport = async () => {
    await exportSupplierInvoiceJournal(testData, 'Test_Colonnes_Fournisseurs.xlsx');
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Test Colonnes Journal Fournisseurs</h2>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Colonnes du Journal Fournisseurs :</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="bg-gray-100 p-2 rounded">1. DATE</div>
          <div className="bg-gray-100 p-2 rounded">2. NUMERO FACTURE</div>
          <div className="bg-gray-100 p-2 rounded">3. FOURNISSEUR</div>
          <div className="bg-gray-100 p-2 rounded">4. NIF</div>
          <div className="bg-gray-100 p-2 rounded">5. OBJET</div>
          <div className="bg-gray-100 p-2 rounded">6. MONTANT HT</div>
          <div className="bg-gray-100 p-2 rounded">7. TVA</div>
          <div className="bg-gray-100 p-2 rounded">8. MONTANT TTC</div>
          <div className="bg-gray-100 p-2 rounded">9. ETAT EXECUTION</div>
          <div className="bg-gray-100 p-2 rounded">10. ETAT PAYEMENT</div>
          <div className="bg-gray-100 p-2 rounded">11. ETAT ARCHIVE</div>
          <div className="bg-gray-100 p-2 rounded">12. ETAT OTR</div>
          <div className="bg-gray-100 p-2 rounded">13. AUTRE ETAT</div>
          <div className="bg-gray-100 p-2 rounded">14. PERIODE DE DECLARATION</div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Formatage Appliqué :</h3>
        <ul className="text-sm space-y-2">
          <li>• <span className="font-semibold">En-têtes :</span> Fond gris foncé (#404040) + Texte blanc en gras</li>
          <li>• <span className="font-semibold">Données :</span> Fond bleu clair (#B0E0E6) + Texte noir</li>
          <li>• <span className="font-semibold">PERIODE DE DECLARATION :</span> Fond bleu foncé (#4682B4) + Texte blanc</li>
          <li>• <span className="font-semibold">Bordures :</span> Fines et noires sur toutes les cellules</li>
        </ul>
      </div>

      <button
        onClick={handleExport}
        className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
      >
        <Download className="w-5 h-5 mr-2" />
        Tester Export avec Colonnes
      </button>
    </div>
  );
};

export default ExcelColumnTest;
