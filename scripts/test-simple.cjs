// Test simple de connexion Supabase
require('dotenv').config({ path: '.env.local' });

console.log('🔍 Variables d\'environnement :');
console.log('VITE_SUPABASE_URL:', process.env.VITE_SUPABASE_URL ? 'Défini' : 'Non défini');
console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Défini' : 'Non défini');

// Test avec les variables directement
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://edsvbvttpcvslewomwyk.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVkc3ZidnR0cGN2c2xld29td3lrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTk0NTM4NiwiZXhwIjoyMDc1NTIxMzg2fQ.j2n0Tp081Uq5r2drk5FcWSMFSbj4H9PEO_l6dWtLwK0';

console.log('🔄 Test de connexion avec clé service role...');

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testConnection() {
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
    console.log('📊 Données trouvées :', data);
    return true;
  } catch (error) {
    console.error('❌ Erreur de connexion :', error.message);
    return false;
  }
}

testConnection();
