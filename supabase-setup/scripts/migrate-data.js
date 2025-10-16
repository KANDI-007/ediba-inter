#!/usr/bin/env node

/**
 * Script de migration des données depuis LocalStorage vers Supabase
 * Ce script lit les données exportées depuis l'application et les insère dans Supabase
 */

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

// Fonction pour lire les données exportées
function readExportedData(filePath) {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`❌ Erreur lors de la lecture du fichier ${filePath}:`, error.message);
    return null;
  }
}

// Fonction pour migrer les utilisateurs
async function migrateUsers(users) {
  console.log('👥 Migration des utilisateurs...');
  
  for (const user of users) {
    const { data, error } = await supabase
      .from('users')
      .upsert({
        id: user.id,
        username: user.username,
        email: user.email || `${user.username}@edibainter.com`,
        full_name: user.fullName,
        role: user.role,
        avatar_url: user.avatar,
        phone: user.phone,
        address: user.address,
        join_date: user.joinDate,
        last_login: user.lastLogin,
        is_active: true
      }, { onConflict: 'id' });

    if (error) {
      console.error(`❌ Erreur lors de la migration de l'utilisateur ${user.username}:`, error);
    } else {
      console.log(`✅ Utilisateur ${user.username} migré`);
    }
  }
}

// Fonction pour migrer les clients
async function migrateClients(clients) {
  console.log('🏢 Migration des clients...');
  
  for (const client of clients) {
    const { data, error } = await supabase
      .from('clients')
      .upsert({
        id: client.id,
        raison_sociale: client.raisonSociale,
        nom_commercial: client.nomCommercial,
        nif: client.nif,
        rccm: client.rccm,
        adresse: client.adresse,
        ville: client.ville,
        telephone: client.telephone,
        email: client.email,
        contact_principal: client.contactPrincipal,
        secteur_activite: client.secteurActivite,
        regime_fiscal: client.regimeFiscal || 'Réel Normal',
        delai_paiement: client.delaiPaiement || 30,
        remise: client.remise || 0,
        limite_credit: client.limiteCredit || 0,
        statut: client.statut || 'actif',
        date_creation: client.dateCreation,
        derniere_facture: client.derniereFacture,
        total_facture: client.totalFacture || 0,
        total_encaissement: client.totalEncaissement || 0,
        solde_impaye: client.soldeImpaye || 0,
        nombre_factures: client.nombreFactures || 0
      }, { onConflict: 'id' });

    if (error) {
      console.error(`❌ Erreur lors de la migration du client ${client.raisonSociale}:`, error);
    } else {
      console.log(`✅ Client ${client.raisonSociale} migré`);
    }
  }
}

// Fonction pour migrer les articles
async function migrateArticles(articles) {
  console.log('📦 Migration des articles...');
  
  for (const article of articles) {
    const { data, error } = await supabase
      .from('articles')
      .upsert({
        id: article.id,
        name: article.name,
        description: article.description,
        sku: article.sku,
        unit_price: article.unitPrice,
        category_id: article.categoryId,
        stock: article.stock || 0,
        min_stock: article.minStock || 0,
        max_stock: article.maxStock || 0,
        unit: article.unit || 'pièce',
        weight: article.weight,
        dimensions: article.dimensions,
        brand: article.brand,
        model: article.model,
        material: article.material,
        color: article.color,
        size: article.size,
        notes: article.notes
      }, { onConflict: 'id' });

    if (error) {
      console.error(`❌ Erreur lors de la migration de l'article ${article.name}:`, error);
    } else {
      console.log(`✅ Article ${article.name} migré`);
    }
  }
}

// Fonction pour migrer les catégories d'articles
async function migrateArticleCategories(categories) {
  console.log('📂 Migration des catégories d'articles...');
  
  for (const category of categories) {
    const { data, error } = await supabase
      .from('article_categories')
      .upsert({
        id: category.id,
        name: category.name,
        description: category.description,
        parent_id: category.parentId
      }, { onConflict: 'id' });

    if (error) {
      console.error(`❌ Erreur lors de la migration de la catégorie ${category.name}:`, error);
    } else {
      console.log(`✅ Catégorie ${category.name} migrée`);
    }
  }
}

// Fonction pour migrer les documents
async function migrateDocuments(documents) {
  console.log('📄 Migration des documents...');
  
  for (const doc of documents) {
    const { data, error } = await supabase
      .from('documents')
      .upsert({
        id: doc.id,
        type: doc.type,
        reference: doc.reference,
        client_id: doc.client,
        date_creation: doc.date,
        date_echeance: doc.dueDate,
        tva: doc.tva || 18.5,
        statut: doc.status || 'pending',
        workflow_status: doc.workflowStatus || 'draft',
        parent_document_id: doc.parentDocumentId,
        order_number: doc.orderNumber,
        contract_order_reference: doc.contractOrderReference,
        objet: doc.objet || 'CONSOMMABLE',
        total_ht: doc.items?.reduce((sum, item) => sum + (item.totalHt || 0), 0) || 0,
        total_ttc: doc.items?.reduce((sum, item) => sum + (item.totalHt || 0), 0) * (1 + (doc.tva || 18.5) / 100) || 0,
        created_by: '550e8400-e29b-41d4-a716-446655440001' // Admin par défaut
      }, { onConflict: 'id' });

    if (error) {
      console.error(`❌ Erreur lors de la migration du document ${doc.reference}:`, error);
    } else {
      console.log(`✅ Document ${doc.reference} migré`);
      
      // Migrer les lignes du document
      if (doc.items && doc.items.length > 0) {
        await migrateLineItems(doc.id, doc.items);
      }
    }
  }
}

// Fonction pour migrer les lignes de documents
async function migrateLineItems(documentId, items) {
  for (const item of items) {
    const { data, error } = await supabase
      .from('line_items')
      .insert({
        document_id: documentId,
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unitPrice,
        total_ht: item.totalHt,
        received_quantity: item.receivedQuantity || 0
      });

    if (error) {
      console.error(`❌ Erreur lors de la migration de la ligne ${item.description}:`, error);
    }
  }
}

// Fonction principale de migration
async function migrateData() {
  console.log('🚀 Début de la migration des données...');
  
  // Chemin vers le fichier de données exportées
  const dataFile = process.argv[2] || 'exported-data.json';
  
  if (!fs.existsSync(dataFile)) {
    console.error(`❌ Fichier de données non trouvé: ${dataFile}`);
    console.log('💡 Utilisez: node migrate-data.js path/to/exported-data.json');
    process.exit(1);
  }

  const exportedData = readExportedData(dataFile);
  if (!exportedData) {
    process.exit(1);
  }

  try {
    // Migrer les catégories d'articles en premier
    if (exportedData.articleCategories) {
      await migrateArticleCategories(exportedData.articleCategories);
    }

    // Migrer les articles
    if (exportedData.articles) {
      await migrateArticles(exportedData.articles);
    }

    // Migrer les utilisateurs
    if (exportedData.users) {
      await migrateUsers(exportedData.users);
    }

    // Migrer les clients
    if (exportedData.clients) {
      await migrateClients(exportedData.clients);
    }

    // Migrer les documents
    if (exportedData.documents) {
      await migrateDocuments(exportedData.documents);
    }

    console.log('✅ Migration terminée avec succès !');
    
  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error);
    process.exit(1);
  }
}

// Exécuter la migration
migrateData();
