import React from 'react';
import { generatePDFDirect, DocumentData } from '../utils/PDFGenerator';

const PDFTestComponent: React.FC = () => {
  const testDocument: DocumentData = {
    id: 'N° F2500001',
    date: '2024-10-22',
    dueDate: '2024-11-22',
    client: 'DRAEDR SAVANE',
    address: 'Adresse du client',
    city: 'Lomé',
    tva: 18,
    items: [
      {
        description: 'Paquets de rame',
        quantity: 3,
        unitPrice: 15000
      },
      {
        description: 'Stylo à bille bleu Marque UNIMAX',
        quantity: 1,
        unitPrice: 6000
      },
      {
        description: 'Stylo à bille noir Marque UNIMAX',
        quantity: 1,
        unitPrice: 6000
      },
      {
        description: 'Enveloppe A4',
        quantity: 4,
        unitPrice: 2500
      },
      {
        description: 'Enveloppe A5',
        quantity: 3,
        unitPrice: 1250
      },
      {
        description: 'Agrafeuse 24/6',
        quantity: 2,
        unitPrice: 4800
      },
      {
        description: 'Chemise à sangle',
        quantity: 1,
        unitPrice: 10400
      },
      {
        description: 'Paire de ciseau',
        quantity: 2,
        unitPrice: 956
      },
      {
        description: 'Classeur avec perforateur',
        quantity: 5,
        unitPrice: 2160
      },
      {
        description: 'Registre courrier départ',
        quantity: 1,
        unitPrice: 2600
      }
    ],
    paymentTermsDays: 30
  };

  const testDocument2: DocumentData = {
    id: 'N° BL2500001',
    date: '2024-10-22',
    client: 'MINISTÈRE DES ARMÉES',
    address: 'Adresse du ministère',
    city: 'Lomé',
    tva: 18,
    items: [
      {
        description: 'Matériel informatique',
        quantity: 5,
        unitPrice: 50000
      },
      {
        description: 'Formation technique',
        quantity: 2,
        unitPrice: 25000
      }
    ],
    paymentTermsDays: 0
  };

  const handleGeneratePDF = async (type: string) => {
    try {
      const doc = type === 'proforma' ? testDocument : testDocument2;
      const pdf = await generatePDFDirect(doc, type);
      pdf.save(`test-${type}-${new Date().toISOString().slice(0,10)}.pdf`);
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
      alert('Erreur lors de la génération du PDF');
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test du générateur PDF</h1>
      <p className="mb-6">Ce composant permet de tester la génération PDF avec le design de référence.</p>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-2">Facture Proforma</h3>
          <p className="text-sm text-gray-600 mb-3">Test avec les données de l'image de référence</p>
          <button
            onClick={() => handleGeneratePDF('proforma')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 w-full"
          >
            Générer Facture Proforma
          </button>
        </div>
        
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-2">Bon de Livraison</h3>
          <p className="text-sm text-gray-600 mb-3">Test avec un bon de livraison</p>
          <button
            onClick={() => handleGeneratePDF('delivery')}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 w-full"
          >
            Générer Bon de Livraison
          </button>
        </div>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold mb-2">Améliorations apportées :</h3>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>✅ Alignement parfait des colonnes du tableau</li>
          <li>✅ Espacement optimisé entre les sections</li>
          <li>✅ Marges et tailles de police ajustées</li>
          <li>✅ Montants alignés à droite</li>
          <li>✅ Logo EDIBA INTER coloré</li>
          <li>✅ Pied de page avec barre bleue</li>
          <li>✅ Signature alignée à droite</li>
        </ul>
      </div>
    </div>
  );
};

export default PDFTestComponent;
