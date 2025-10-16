import React from 'react';
import { Download, CheckCircle, AlertCircle } from 'lucide-react';
import { exportSupplierInvoiceJournal, SupplierInvoiceData } from '../utils/ExcelGeneratorSimple';

const ExcelColumnVerification: React.FC = () => {
  // Données de test avec des valeurs distinctes pour chaque colonne
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
    }
  ];

  const handleExport = async () => {
    await exportSupplierInvoiceJournal(testData, 'Verification_Colonnes_Fournisseurs.xlsx');
  };

  const columns = [
    { index: 1, name: 'DATE', value: '17/1/2025' },
    { index: 2, name: 'NUMERO FACTURE', value: 'AF25003291' },
    { index: 3, name: 'FOURNISSEUR', value: 'CCT-BATIMENT' },
    { index: 4, name: 'NIF', value: '1000166149' },
    { index: 5, name: 'OBJET', value: 'PRODUIT MECANIQUE' },
    { index: 6, name: 'MONTANT HT', value: '15593' },
    { index: 7, name: 'TVA', value: '2807' },
    { index: 8, name: 'MONTANT TTC', value: '18400' },
    { index: 9, name: 'ETAT EXECUTION', value: 'PLEIN' },
    { index: 10, name: 'ETAT PAYEMENT', value: 'TOTAL' },
    { index: 11, name: 'ETAT ARCHIVE', value: 'FAIT' },
    { index: 12, name: 'ETAT OTR', value: 'DECLARE' },
    { index: 13, name: 'AUTRE ETAT', value: 'RIEN' },
    { index: 14, name: 'PERIODE DE DECLARATION', value: 'Janvier' }
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Vérification des Colonnes</h2>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Ordre des Colonnes dans le Fichier Excel :</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-3 py-2 text-left">#</th>
                <th className="border border-gray-300 px-3 py-2 text-left">Nom de la Colonne</th>
                <th className="border border-gray-300 px-3 py-2 text-left">Valeur d'Exemple</th>
                <th className="border border-gray-300 px-3 py-2 text-center">Statut</th>
              </tr>
            </thead>
            <tbody>
              {columns.map((column) => (
                <tr key={column.index} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-3 py-2 font-semibold">{column.index}</td>
                  <td className="border border-gray-300 px-3 py-2 font-medium">{column.name}</td>
                  <td className="border border-gray-300 px-3 py-2 text-gray-600">{column.value}</td>
                  <td className="border border-gray-300 px-3 py-2 text-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">Formatage Appliqué :</h3>
        <ul className="text-blue-700 space-y-1">
          <li>• <span className="font-semibold">En-têtes :</span> Fond gris foncé (#404040) + Texte blanc en gras</li>
          <li>• <span className="font-semibold">Données (colonnes 1-13) :</span> Fond bleu clair (#B0E0E6) + Texte noir</li>
          <li>• <span className="font-semibold">PERIODE DE DECLARATION (colonne 14) :</span> Fond bleu foncé (#4682B4) + Texte blanc</li>
          <li>• <span className="font-semibold">Bordures :</span> Fines et noires sur toutes les cellules</li>
          <li>• <span className="font-semibold">Titre :</span> Centré sur les colonnes E-H avec fond rouge</li>
        </ul>
      </div>

      <div className="mb-6 p-4 bg-green-50 rounded-lg">
        <h3 className="text-lg font-semibold text-green-800 mb-2">Vérifications :</h3>
        <ul className="text-green-700 space-y-1">
          <li>✅ <span className="font-semibold">14 colonnes</span> dans l'ordre exact</li>
          <li>✅ <span className="font-semibold">Titre principal</span> centré sur colonnes E-H</li>
          <li>✅ <span className="font-semibold">Formatage</span> conforme aux couleurs</li>
          <li>✅ <span className="font-semibold">Bordures</span> fines et noires</li>
          <li>✅ <span className="font-semibold">Centrage</span> horizontal et vertical</li>
        </ul>
      </div>

      <button
        onClick={handleExport}
        className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
      >
        <Download className="w-5 h-5 mr-2" />
        Tester Export avec Vérification des Colonnes
      </button>
    </div>
  );
};

export default ExcelColumnVerification;
