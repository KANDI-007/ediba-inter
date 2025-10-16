// Test simple du serveur
console.log('Test des variables d\'environnement...');
console.log('SUPABASE_URL:', process.env.SUPABASE_URL);
console.log('SUPABASE_ANON_KEY:', process.env.SUPABASE_ANON_KEY ? 'Défini' : 'Non défini');
console.log('PORT:', process.env.PORT);

// Test de connexion Supabase
const { createClient } = require('@supabase/supabase-js');

try {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );
  console.log('✅ Client Supabase créé avec succès');
  
  // Test de connexion
  supabase.from('users').select('count').then(({ data, error }) => {
    if (error) {
      console.log('❌ Erreur de connexion Supabase:', error.message);
    } else {
      console.log('✅ Connexion Supabase réussie');
    }
  });
} catch (error) {
  console.log('❌ Erreur lors de la création du client Supabase:', error.message);
}
