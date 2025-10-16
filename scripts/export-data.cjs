// Script d'exportation des données de l'application EDIBA INTER
// Ce script exporte toutes les données du LocalStorage vers un fichier JSON

const fs = require('fs');
const path = require('path');

// Fonction pour simuler l'accès au LocalStorage (à adapter selon votre contexte)
function exportLocalStorageData() {
  console.log('🔄 Exportation des données de l\'application...');
  
  // Structure des données à exporter
  const exportData = {
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    data: {
      users: [],
      clients: [],
      suppliers: [],
      articles: [],
      articleCategories: [],
      documents: [],
      lineItems: [],
      payments: [],
      discharges: [],
      conversations: [],
      messages: [],
      activities: [],
      notifications: []
    }
  };

  // Instructions pour l'utilisateur
  console.log(`
📋 INSTRUCTIONS POUR L'EXPORTATION :

1. Ouvrez votre application EDIBA INTER dans le navigateur
2. Ouvrez la console du navigateur (F12)
3. Copiez et exécutez le code suivant :

// Code à exécuter dans la console du navigateur
const exportData = {
  timestamp: new Date().toISOString(),
  version: '1.0.0',
  data: {
    users: JSON.parse(localStorage.getItem('users') || '[]'),
    clients: JSON.parse(localStorage.getItem('clients') || '[]'),
    suppliers: JSON.parse(localStorage.getItem('suppliers') || '[]'),
    articles: JSON.parse(localStorage.getItem('articles') || '[]'),
    articleCategories: JSON.parse(localStorage.getItem('articleCategories') || '[]'),
    documents: JSON.parse(localStorage.getItem('documents') || '[]'),
    lineItems: JSON.parse(localStorage.getItem('lineItems') || '[]'),
    payments: JSON.parse(localStorage.getItem('payments') || '[]'),
    discharges: JSON.parse(localStorage.getItem('discharges') || '[]'),
    conversations: JSON.parse(localStorage.getItem('conversations') || '[]'),
    messages: JSON.parse(localStorage.getItem('messages') || '[]'),
    activities: JSON.parse(localStorage.getItem('activities') || '[]'),
    notifications: JSON.parse(localStorage.getItem('notifications') || '[]')
  }
};

// Télécharger le fichier
const dataStr = JSON.stringify(exportData, null, 2);
const dataBlob = new Blob([dataStr], {type: 'application/json'});
const url = URL.createObjectURL(dataBlob);
const link = document.createElement('a');
link.href = url;
link.download = 'ediba-inter-export-' + new Date().toISOString().split('T')[0] + '.json';
document.body.appendChild(link);
link.click();
document.body.removeChild(link);
URL.revokeObjectURL(url);

console.log('✅ Données exportées avec succès !');
  `);

  return exportData;
}

// Fonction pour créer un fichier d'exemple
function createExampleExport() {
  const exampleData = {
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    data: {
      users: [
        {
          id: 'user-1',
          username: 'alayi',
          email: 'alayi@edibainter.com',
          fullName: 'ALAYI Abide',
          role: 'admin',
          avatar: null,
          phone: '+228 12 34 56 78',
          address: 'Lomé, Togo',
          joinDate: '2024-01-01',
          lastLogin: null,
          isActive: true
        }
      ],
      clients: [
        {
          id: 'client-1',
          raisonSociale: 'SOCIETE GENERALE DU TOGO',
          nomCommercial: 'SGT',
          nif: 'NIF001',
          rccm: 'RCCM001',
          adresse: 'Avenue de la Paix, Lomé',
          ville: 'Lomé',
          telephone: '+228 22 21 20 00',
          email: 'contact@sgt.tg',
          contactPrincipal: 'Jean KOUASSI',
          secteurActivite: 'Banque',
          regimeFiscal: 'Réel Normal',
          delaiPaiement: 30,
          remise: 5.00,
          limiteCredit: 10000000.00,
          statut: 'actif',
          dateCreation: '2024-01-01',
          derniereFacture: null,
          totalFacture: 0,
          totalEncaissement: 0,
          soldeImpaye: 0,
          nombreFactures: 0
        }
      ],
      articles: [
        {
          id: 'article-1',
          name: 'Bureau en bois massif',
          description: 'Bureau professionnel en bois massif',
          sku: 'BUR-001',
          unitPrice: 150000.00,
          categoryId: 'cat-1',
          stock: 5,
          minStock: 2,
          maxStock: 10,
          unit: 'pièce',
          weight: null,
          dimensions: '120x60x75',
          brand: 'IKEA',
          model: 'HEMNES',
          material: 'Bois massif',
          color: 'Chêne',
          size: '120x60x75',
          notes: null
        }
      ],
      articleCategories: [
        {
          id: 'cat-1',
          name: 'Ameublement',
          description: 'Mobilier et ameublement',
          parentId: null
        }
      ],
      documents: [],
      lineItems: [],
      payments: [],
      discharges: [],
      conversations: [],
      messages: [],
      activities: [],
      notifications: []
    }
  };

  const outputPath = path.join(__dirname, '..', 'data-export-example.json');
  fs.writeFileSync(outputPath, JSON.stringify(exampleData, null, 2));
  
  console.log('✅ Fichier d\'exemple créé : data-export-example.json');
  return exampleData;
}

// Exécution
if (require.main === module) {
  console.log('🚀 Script d\'exportation des données EDIBA INTER');
  console.log('================================================');
  
  // Créer un fichier d'exemple
  createExampleExport();
  
  // Afficher les instructions
  exportLocalStorageData();
  
  console.log(`
📁 Fichiers créés :
- data-export-example.json (exemple de structure)

📋 Prochaines étapes :
1. Exécutez le code JavaScript dans votre navigateur
2. Sauvegardez le fichier JSON généré
3. Placez-le dans le dossier 'data/' du projet
4. Exécutez le script de migration : npm run migrate-data
  `);
}

module.exports = { exportLocalStorageData, createExampleExport };
