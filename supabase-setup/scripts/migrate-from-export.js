// Script de migration des données exportées vers Supabase
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Configuration Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables d\'environnement Supabase manquantes');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Fonction pour migrer les utilisateurs
async function migrateUsers(users) {
  console.log(`🔄 Migration de ${users.length} utilisateurs...`);
  
  for (const user of users) {
    try {
      const { data, error } = await supabase
        .from('users')
        .upsert([{
          id: user.id,
          username: user.username,
          email: user.email,
          full_name: user.fullName || user.full_name,
          role: user.role,
          avatar_url: user.avatar || user.avatar_url,
          phone: user.phone,
          address: user.address,
          join_date: user.joinDate || user.join_date,
          last_login: user.lastLogin || user.last_login,
          is_active: user.isActive !== undefined ? user.isActive : true
        }], { onConflict: 'id' });

      if (error) {
        console.error(`❌ Erreur migration utilisateur ${user.username}:`, error.message);
      } else {
        console.log(`✅ Utilisateur ${user.username} migré`);
      }
    } catch (error) {
      console.error(`❌ Erreur migration utilisateur ${user.username}:`, error.message);
    }
  }
}

// Fonction pour migrer les clients
async function migrateClients(clients) {
  console.log(`🔄 Migration de ${clients.length} clients...`);
  
  for (const client of clients) {
    try {
      const { data, error } = await supabase
        .from('clients')
        .upsert([{
          id: client.id,
          raison_sociale: client.raisonSociale || client.raison_sociale,
          nom_commercial: client.nomCommercial || client.nom_commercial,
          nif: client.nif,
          rccm: client.rccm,
          adresse: client.adresse,
          ville: client.ville,
          telephone: client.telephone,
          email: client.email,
          contact_principal: client.contactPrincipal || client.contact_principal,
          secteur_activite: client.secteurActivite || client.secteur_activite,
          regime_fiscal: client.regimeFiscal || client.regime_fiscal || 'Réel Normal',
          delai_paiement: client.delaiPaiement || client.delai_paiement || 30,
          remise: client.remise || 0,
          limite_credit: client.limiteCredit || client.limite_credit || 0,
          statut: client.statut || 'actif',
          date_creation: client.dateCreation || client.date_creation || new Date().toISOString(),
          derniere_facture: client.derniereFacture || client.derniere_facture,
          total_facture: client.totalFacture || client.total_facture || 0,
          total_encaissement: client.totalEncaissement || client.total_encaissement || 0,
          solde_impaye: client.soldeImpaye || client.solde_impaye || 0,
          nombre_factures: client.nombreFactures || client.nombre_factures || 0
        }], { onConflict: 'id' });

      if (error) {
        console.error(`❌ Erreur migration client ${client.raisonSociale || client.raison_sociale}:`, error.message);
      } else {
        console.log(`✅ Client ${client.raisonSociale || client.raison_sociale} migré`);
      }
    } catch (error) {
      console.error(`❌ Erreur migration client ${client.raisonSociale || client.raison_sociale}:`, error.message);
    }
  }
}

// Fonction pour migrer les fournisseurs
async function migrateSuppliers(suppliers) {
  console.log(`🔄 Migration de ${suppliers.length} fournisseurs...`);
  
  for (const supplier of suppliers) {
    try {
      const { data, error } = await supabase
        .from('suppliers')
        .upsert([{
          id: supplier.id,
          raison_sociale: supplier.raisonSociale || supplier.raison_sociale,
          nom_commercial: supplier.nomCommercial || supplier.nom_commercial,
          nif: supplier.nif,
          rccm: supplier.rccm,
          adresse: supplier.adresse,
          ville: supplier.ville,
          telephone: supplier.telephone,
          email: supplier.email,
          contact_principal: supplier.contactPrincipal || supplier.contact_principal,
          secteur_activite: supplier.secteurActivite || supplier.secteur_activite,
          delai_paiement: supplier.delaiPaiement || supplier.delai_paiement || '30 jours',
          remise: supplier.remise || '0%',
          statut: supplier.statut || 'actif'
        }], { onConflict: 'id' });

      if (error) {
        console.error(`❌ Erreur migration fournisseur ${supplier.raisonSociale || supplier.raison_sociale}:`, error.message);
      } else {
        console.log(`✅ Fournisseur ${supplier.raisonSociale || supplier.raison_sociale} migré`);
      }
    } catch (error) {
      console.error(`❌ Erreur migration fournisseur ${supplier.raisonSociale || supplier.raison_sociale}:`, error.message);
    }
  }
}

// Fonction pour migrer les catégories d'articles
async function migrateArticleCategories(categories) {
  console.log(`🔄 Migration de ${categories.length} catégories d'articles...`);
  
  for (const category of categories) {
    try {
      const { data, error } = await supabase
        .from('article_categories')
        .upsert([{
          id: category.id,
          name: category.name,
          description: category.description,
          parent_id: category.parentId || category.parent_id
        }], { onConflict: 'id' });

      if (error) {
        console.error(`❌ Erreur migration catégorie ${category.name}:`, error.message);
      } else {
        console.log(`✅ Catégorie ${category.name} migrée`);
      }
    } catch (error) {
      console.error(`❌ Erreur migration catégorie ${category.name}:`, error.message);
    }
  }
}

// Fonction pour migrer les articles
async function migrateArticles(articles) {
  console.log(`🔄 Migration de ${articles.length} articles...`);
  
  for (const article of articles) {
    try {
      const { data, error } = await supabase
        .from('articles')
        .upsert([{
          id: article.id,
          name: article.name,
          description: article.description,
          sku: article.sku,
          unit_price: article.unitPrice || article.unit_price,
          category_id: article.categoryId || article.category_id,
          stock: article.stock || 0,
          min_stock: article.minStock || article.min_stock || 0,
          max_stock: article.maxStock || article.max_stock || 0,
          unit: article.unit || 'pièce',
          weight: article.weight,
          dimensions: article.dimensions,
          brand: article.brand,
          model: article.model,
          material: article.material,
          color: article.color,
          size: article.size,
          notes: article.notes
        }], { onConflict: 'id' });

      if (error) {
        console.error(`❌ Erreur migration article ${article.name}:`, error.message);
      } else {
        console.log(`✅ Article ${article.name} migré`);
      }
    } catch (error) {
      console.error(`❌ Erreur migration article ${article.name}:`, error.message);
    }
  }
}

// Fonction pour migrer les documents
async function migrateDocuments(documents) {
  console.log(`🔄 Migration de ${documents.length} documents...`);
  
  for (const document of documents) {
    try {
      const { data, error } = await supabase
        .from('documents')
        .upsert([{
          id: document.id,
          type: document.type,
          reference: document.reference,
          client_id: document.clientId || document.client_id,
          date_creation: document.dateCreation || document.date_creation,
          date_echeance: document.dateEcheance || document.date_echeance,
          tva: document.tva || 18.5,
          statut: document.statut || 'pending',
          workflow_status: document.workflowStatus || document.workflow_status || 'draft',
          parent_document_id: document.parentDocumentId || document.parent_document_id,
          order_number: document.orderNumber || document.order_number,
          contract_order_reference: document.contractOrderReference || document.contract_order_reference,
          objet: document.objet || 'CONSOMMABLE',
          total_ht: document.totalHt || document.total_ht || 0,
          total_ttc: document.totalTtc || document.total_ttc || 0
        }], { onConflict: 'id' });

      if (error) {
        console.error(`❌ Erreur migration document ${document.reference}:`, error.message);
      } else {
        console.log(`✅ Document ${document.reference} migré`);
      }
    } catch (error) {
      console.error(`❌ Erreur migration document ${document.reference}:`, error.message);
    }
  }
}

// Fonction principale de migration
async function migrateData(exportFilePath) {
  try {
    console.log('🚀 Début de la migration des données...');
    console.log('=====================================');

    // Lire le fichier d'export
    const exportData = JSON.parse(fs.readFileSync(exportFilePath, 'utf8'));
    console.log(`📁 Fichier d'export lu : ${exportFilePath}`);
    console.log(`📅 Date d'export : ${exportData.timestamp}`);
    console.log(`📊 Version : ${exportData.version}`);

    const { data } = exportData;

    // Migrer dans l'ordre des dépendances
    if (data.users && data.users.length > 0) {
      await migrateUsers(data.users);
    }

    if (data.articleCategories && data.articleCategories.length > 0) {
      await migrateArticleCategories(data.articleCategories);
    }

    if (data.articles && data.articles.length > 0) {
      await migrateArticles(data.articles);
    }

    if (data.clients && data.clients.length > 0) {
      await migrateClients(data.clients);
    }

    if (data.suppliers && data.suppliers.length > 0) {
      await migrateSuppliers(data.suppliers);
    }

    if (data.documents && data.documents.length > 0) {
      await migrateDocuments(data.documents);
    }

    console.log('✅ Migration terminée avec succès !');
    console.log('=====================================');

  } catch (error) {
    console.error('❌ Erreur lors de la migration :', error.message);
    process.exit(1);
  }
}

// Exécution du script
if (require.main === module) {
  const exportFilePath = process.argv[2];
  
  if (!exportFilePath) {
    console.error('❌ Veuillez spécifier le chemin du fichier d\'export');
    console.log('Usage: node migrate-from-export.js <chemin-du-fichier-export>');
    process.exit(1);
  }

  if (!fs.existsSync(exportFilePath)) {
    console.error(`❌ Fichier d'export non trouvé : ${exportFilePath}`);
    process.exit(1);
  }

  migrateData(exportFilePath);
}

module.exports = { migrateData };
