// Script de test de la migration des données avec clé admin
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Configuration Supabase avec clé service role
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://edsvbvttpcvslewomwyk.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVkc3ZidnR0cGN2c2xld29td3lrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTk0NTM4NiwiZXhwIjoyMDc1NTIxMzg2fQ.j2n0Tp081Uq5r2drk5FcWSMFSbj4H9PEO_l6dWtLwK0';

console.log('🔍 Variables d\'environnement détectées :');
console.log('SUPABASE_URL:', supabaseUrl ? 'Défini' : 'Non défini');
console.log('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? 'Défini' : 'Non défini');

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variables d\'environnement Supabase manquantes');
  console.log('💡 Utilisez la clé service role pour bypasser RLS');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Fonction pour tester la connexion
async function testConnection() {
  console.log('🔄 Test de connexion à Supabase (avec clé service role)...');
  
  try {
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('❌ Erreur de connexion :', error.message);
      return false;
    }
    
    console.log('✅ Connexion à Supabase réussie');
    return true;
  } catch (error) {
    console.error('❌ Erreur de connexion :', error.message);
    return false;
  }
}

// Fonction pour compter les enregistrements
async function countRecords() {
  console.log('📊 Comptage des enregistrements...');
  
  const tables = [
    'users',
    'clients', 
    'suppliers',
    'articles',
    'article_categories',
    'documents',
    'line_items',
    'payments',
    'discharges',
    'conversations',
    'messages',
    'activities',
    'notifications'
  ];

  const counts = {};

  for (const table of tables) {
    try {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        console.log(`❌ ${table}: Erreur - ${error.message}`);
        counts[table] = 'Erreur';
      } else {
        counts[table] = count || 0;
        console.log(`✅ ${table}: ${count || 0} enregistrements`);
      }
    } catch (error) {
      console.log(`❌ ${table}: Erreur - ${error.message}`);
      counts[table] = 'Erreur';
    }
  }

  return counts;
}

// Fonction pour tester les données de base
async function testBasicData() {
  console.log('🧪 Test des données de base...');
  
  try {
    // Test des utilisateurs
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, username, role')
      .limit(5);
    
    if (usersError) {
      console.error('❌ Erreur récupération utilisateurs :', usersError.message);
    } else {
      console.log(`✅ ${users.length} utilisateurs trouvés`);
      users.forEach(user => {
        console.log(`   - ${user.username} (${user.role})`);
      });
    }

    // Test des clients
    const { data: clients, error: clientsError } = await supabase
      .from('clients')
      .select('id, raison_sociale, statut')
      .limit(5);
    
    if (clientsError) {
      console.error('❌ Erreur récupération clients :', clientsError.message);
    } else {
      console.log(`✅ ${clients.length} clients trouvés`);
      clients.forEach(client => {
        console.log(`   - ${client.raison_sociale} (${client.statut})`);
      });
    }

    // Test des articles
    const { data: articles, error: articlesError } = await supabase
      .from('articles')
      .select('id, name, unit_price')
      .limit(5);
    
    if (articlesError) {
      console.error('❌ Erreur récupération articles :', articlesError.message);
    } else {
      console.log(`✅ ${articles.length} articles trouvés`);
      articles.forEach(article => {
        console.log(`   - ${article.name} (${article.unit_price} FCFA)`);
      });
    }

  } catch (error) {
    console.error('❌ Erreur lors du test des données :', error.message);
  }
}

// Fonction principale de test
async function runTests() {
  console.log('🧪 Tests de migration EDIBA INTER (Admin)');
  console.log('==========================================');
  
  // Test de connexion
  const connected = await testConnection();
  if (!connected) {
    console.error('❌ Impossible de continuer sans connexion à Supabase');
    process.exit(1);
  }
  
  console.log('');
  
  // Comptage des enregistrements
  const counts = await countRecords();
  
  console.log('');
  
  // Test des données de base
  await testBasicData();
  
  console.log('');
  console.log('📊 Résumé des tests :');
  console.log('=====================');
  
  Object.entries(counts).forEach(([table, count]) => {
    const status = count === 'Erreur' ? '❌' : '✅';
    console.log(`${status} ${table}: ${count}`);
  });
  
  console.log('');
  console.log('✅ Tests terminés !');
  console.log('');
  console.log('💡 Note : Utilisez la clé service role pour les opérations de migration');
}

// Exécution
if (require.main === module) {
  runTests().catch(error => {
    console.error('❌ Erreur lors des tests :', error.message);
    process.exit(1);
  });
}

module.exports = { runTests };
