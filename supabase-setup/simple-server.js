// Serveur de test simple
require('dotenv').config();
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Route de test
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Serveur fonctionne',
    timestamp: new Date().toISOString()
  });
});

// Route de test Supabase
app.get('/test-supabase', async (req, res) => {
  try {
    const { createClient } = require('@supabase/supabase-js');
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY // Utiliser service role pour bypass RLS
    );
    
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (error) {
      res.status(500).json({ error: error.message });
    } else {
      res.json({ 
        status: 'OK', 
        message: 'Connexion Supabase réussie',
        data: data
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Serveur de test démarré sur le port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 Test Supabase: http://localhost:${PORT}/test-supabase`);
});
