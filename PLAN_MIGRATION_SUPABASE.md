# 🚀 Plan de Migration vers Supabase - EDIBA INTER

## 📋 Vue d'ensemble

Ce document détaille le plan de migration de l'application EDIBA INTER depuis LocalStorage vers Supabase, incluant la création du backend API et la configuration d'hébergement.

---

## 🎯 Objectifs de la Migration

### **Objectifs Techniques**
- ✅ Migration des données vers PostgreSQL
- ✅ Création d'une API REST complète
- ✅ Authentification sécurisée avec JWT
- ✅ Temps réel avec WebSockets
- ✅ Stockage de fichiers intégré
- ✅ Backup automatique des données

### **Objectifs Business**
- ✅ Amélioration des performances
- ✅ Sécurité renforcée
- ✅ Scalabilité pour la croissance
- ✅ Collaboration multi-utilisateurs
- ✅ Accessibilité depuis n'importe où

---

## 🏗️ Architecture Cible

### **Stack Technologique**
```
Frontend (React + TypeScript)
    ↓ HTTPS
Vercel (CDN + Hosting)
    ↓ API Calls
Supabase (PostgreSQL + API + Auth)
    ↓ WebSockets
Temps Réel (Chat + Présence)
```

### **Composants**
- **Frontend** : React (existant) → Vercel
- **Backend** : Node.js + Express → Supabase Edge Functions
- **Base de Données** : PostgreSQL → Supabase
- **Authentification** : JWT → Supabase Auth
- **Stockage** : LocalStorage → Supabase Storage
- **Temps Réel** : Socket.IO → Supabase Realtime

---

## 📊 Schéma de Base de Données

### **1. Table Users**
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'comptable', 'commercial', 'lecture')),
  avatar_url TEXT,
  phone VARCHAR(20),
  address TEXT,
  join_date TIMESTAMP DEFAULT NOW(),
  last_login TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Index pour les performances
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
```

### **2. Table Clients**
```sql
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  raison_sociale VARCHAR(200) NOT NULL,
  nom_commercial VARCHAR(200),
  nif VARCHAR(50) UNIQUE NOT NULL,
  rccm VARCHAR(50),
  adresse TEXT NOT NULL,
  ville VARCHAR(100) NOT NULL,
  telephone VARCHAR(20) NOT NULL,
  email VARCHAR(100),
  contact_principal VARCHAR(100),
  secteur_activite VARCHAR(100),
  regime_fiscal VARCHAR(50) DEFAULT 'Réel Normal',
  delai_paiement INTEGER DEFAULT 30,
  remise DECIMAL(5,2) DEFAULT 0,
  limite_credit DECIMAL(15,2) DEFAULT 0,
  statut VARCHAR(20) DEFAULT 'actif' CHECK (statut IN ('actif', 'inactif', 'suspendu')),
  date_creation TIMESTAMP DEFAULT NOW(),
  derniere_facture TIMESTAMP,
  total_facture DECIMAL(15,2) DEFAULT 0,
  total_encaissement DECIMAL(15,2) DEFAULT 0,
  solde_impaye DECIMAL(15,2) DEFAULT 0,
  nombre_factures INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Index pour les performances
CREATE INDEX idx_clients_nif ON clients(nif);
CREATE INDEX idx_clients_raison_sociale ON clients(raison_sociale);
CREATE INDEX idx_clients_statut ON clients(statut);
```

### **3. Table Documents**
```sql
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(20) NOT NULL CHECK (type IN ('proforma', 'bl', 'invoice', 'acompte', 'solde')),
  reference VARCHAR(50) UNIQUE NOT NULL,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  date_creation DATE NOT NULL,
  date_echeance DATE,
  tva DECIMAL(5,2) DEFAULT 18.5,
  statut VARCHAR(20) DEFAULT 'pending' CHECK (statut IN ('validated', 'paid', 'partial', 'overdue', 'pending')),
  workflow_status VARCHAR(20) DEFAULT 'draft' CHECK (workflow_status IN ('draft', 'validated', 'ordered', 'delivered', 'invoiced', 'completed')),
  parent_document_id UUID REFERENCES documents(id),
  order_number VARCHAR(50),
  contract_order_reference VARCHAR(100),
  objet TEXT DEFAULT 'CONSOMMABLE',
  total_ht DECIMAL(15,2) NOT NULL DEFAULT 0,
  total_ttc DECIMAL(15,2) NOT NULL DEFAULT 0,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Index pour les performances
CREATE INDEX idx_documents_type ON documents(type);
CREATE INDEX idx_documents_client_id ON documents(client_id);
CREATE INDEX idx_documents_date_creation ON documents(date_creation);
CREATE INDEX idx_documents_statut ON documents(statut);
```

### **4. Table Line Items**
```sql
CREATE TABLE line_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity DECIMAL(10,2) NOT NULL,
  unit_price DECIMAL(15,2) NOT NULL,
  total_ht DECIMAL(15,2) NOT NULL,
  received_quantity DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Index pour les performances
CREATE INDEX idx_line_items_document_id ON line_items(document_id);
```

### **5. Table Payments**
```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  amount DECIMAL(15,2) NOT NULL,
  payment_date DATE NOT NULL,
  payment_method VARCHAR(50),
  note TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Index pour les performances
CREATE INDEX idx_payments_document_id ON payments(document_id);
CREATE INDEX idx_payments_payment_date ON payments(payment_date);
```

### **6. Tables Chat**
```sql
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200),
  is_group BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE conversation_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  joined_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(conversation_id, user_id)
);

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES users(id),
  content TEXT,
  message_type VARCHAR(20) DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file', 'audio', 'video')),
  file_url TEXT,
  file_name VARCHAR(255),
  file_size INTEGER,
  reply_to_id UUID REFERENCES messages(id),
  is_edited BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Index pour les performances
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);
```

### **7. Tables Articles**
```sql
CREATE TABLE article_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  parent_id UUID REFERENCES article_categories(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200) NOT NULL,
  description TEXT,
  sku VARCHAR(100) UNIQUE,
  unit_price DECIMAL(15,2),
  category_id UUID REFERENCES article_categories(id),
  stock INTEGER DEFAULT 0,
  min_stock INTEGER DEFAULT 0,
  max_stock INTEGER DEFAULT 0,
  unit VARCHAR(20) DEFAULT 'pièce',
  weight DECIMAL(10,2),
  dimensions VARCHAR(100),
  brand VARCHAR(100),
  model VARCHAR(100),
  material VARCHAR(100),
  color VARCHAR(50),
  size VARCHAR(50),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Index pour les performances
CREATE INDEX idx_articles_category_id ON articles(category_id);
CREATE INDEX idx_articles_sku ON articles(sku);
CREATE INDEX idx_articles_name ON articles(name);
```

---

## 🔧 Configuration Supabase

### **1. Création du Projet**
```bash
# Installation de Supabase CLI
npm install -g supabase

# Initialisation du projet
supabase init

# Connexion à Supabase
supabase login

# Création du projet
supabase projects create ediba-inter --region us-east-1
```

### **2. Configuration des Tables**
```sql
-- Exécuter les scripts SQL dans l'ordre
-- 1. Créer les tables
-- 2. Créer les index
-- 3. Configurer les RLS (Row Level Security)
-- 4. Créer les triggers
-- 5. Insérer les données par défaut
```

### **3. Configuration RLS (Row Level Security)**
```sql
-- Activer RLS sur toutes les tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE line_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Politiques pour les utilisateurs
CREATE POLICY "Users can view their own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own data" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Politiques pour les clients
CREATE POLICY "Authenticated users can view clients" ON clients
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admin and commercial can manage clients" ON clients
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('admin', 'commercial')
    )
  );
```

---

## 🚀 Développement Backend API

### **1. Structure du Projet Backend**
```
backend/
├── src/
│   ├── controllers/     # Contrôleurs API
│   ├── services/        # Logique métier
│   ├── models/          # Modèles de données
│   ├── middleware/      # Middleware (auth, validation)
│   ├── routes/          # Routes API
│   ├── utils/           # Utilitaires
│   └── config/          # Configuration
├── supabase/
│   ├── migrations/      # Migrations SQL
│   ├── functions/       # Edge Functions
│   └── seed.sql         # Données de test
├── package.json
└── tsconfig.json
```

### **2. Configuration TypeScript**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### **3. Dépendances Backend**
```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.38.0",
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "express-rate-limit": "^7.1.5",
    "joi": "^17.11.0",
    "jsonwebtoken": "^9.0.2",
    "bcryptjs": "^2.4.3",
    "multer": "^1.4.5-lts.1",
    "socket.io": "^4.7.5",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/cors": "^2.8.17",
    "@types/jsonwebtoken": "^9.0.5",
    "@types/bcryptjs": "^2.4.6",
    "@types/multer": "^1.4.11",
    "typescript": "^5.3.2",
    "ts-node": "^10.9.1",
    "nodemon": "^3.0.2"
  }
}
```

### **4. Configuration Supabase Client**
```typescript
// src/config/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Client avec service role pour les opérations admin
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
```

### **5. Middleware d'Authentification**
```typescript
// src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { supabase } from '../config/supabase';

interface AuthRequest extends Request {
  user?: {
    id: string;
    username: string;
    role: string;
  };
}

export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token d\'accès requis' });
  }

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return res.status(403).json({ error: 'Token invalide' });
    }

    req.user = {
      id: user.id,
      username: user.user_metadata.username,
      role: user.user_metadata.role
    };

    next();
  } catch (error) {
    return res.status(403).json({ error: 'Token invalide' });
  }
};
```

---

## 📱 Migration Frontend

### **1. Configuration Supabase Client**
```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);
```

### **2. Migration des Contextes**
```typescript
// src/contexts/DataContext.tsx - Version Supabase
import { supabase } from '../lib/supabase';

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  // Remplacer les appels LocalStorage par des appels Supabase
  const fetchClients = async () => {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  };

  const addClient = async (client: Omit<Client, 'id'>) => {
    const { data, error } = await supabase
      .from('clients')
      .insert([client])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  };

  // ... autres méthodes
};
```

### **3. Migration du Chat**
```typescript
// src/contexts/ChatContext.tsx - Version Supabase
import { supabase } from '../lib/supabase';

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  // Utiliser Supabase Realtime au lieu de Socket.IO
  useEffect(() => {
    const channel = supabase
      .channel('messages')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          // Nouveau message reçu
          setMessages(prev => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
};
```

---

## 🚀 Déploiement et Configuration

### **1. Configuration Vercel**
```json
// vercel.json
{
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "env": {
    "VITE_SUPABASE_URL": "@supabase-url",
    "VITE_SUPABASE_ANON_KEY": "@supabase-anon-key"
  }
}
```

### **2. Variables d'Environnement**
```bash
# .env.local
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### **3. Scripts de Déploiement**
```json
// package.json
{
  "scripts": {
    "build": "vite build",
    "preview": "vite preview",
    "deploy": "vercel --prod",
    "db:migrate": "supabase db push",
    "db:seed": "supabase db seed"
  }
}
```

---

## 📊 Plan de Migration par Phases

### **Phase 1 : Préparation (Semaine 1)**
- [ ] Création du projet Supabase
- [ ] Configuration des tables et RLS
- [ ] Développement de l'API backend de base
- [ ] Tests de connexion et authentification

### **Phase 2 : Migration des Données (Semaine 2)**
- [ ] Script d'export des données LocalStorage
- [ ] Script d'import vers Supabase
- [ ] Migration des utilisateurs et authentification
- [ ] Tests de migration des données

### **Phase 3 : Migration Frontend (Semaine 3)**
- [ ] Refactoring des contextes pour Supabase
- [ ] Migration du système de chat
- [ ] Tests d'intégration complets
- [ ] Optimisation des performances

### **Phase 4 : Déploiement (Semaine 4)**
- [ ] Configuration Vercel + Supabase
- [ ] Déploiement en production
- [ ] Tests de charge et performance
- [ ] Formation des utilisateurs

---

## 🧪 Tests et Validation

### **Tests Unitaires**
```typescript
// tests/api/clients.test.ts
import request from 'supertest';
import app from '../src/app';

describe('Clients API', () => {
  test('GET /api/clients', async () => {
    const response = await request(app)
      .get('/api/clients')
      .set('Authorization', 'Bearer valid-token');
    
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});
```

### **Tests d'Intégration**
```typescript
// tests/integration/chat.test.ts
import { supabase } from '../src/lib/supabase';

describe('Chat Integration', () => {
  test('Real-time message delivery', async () => {
    // Test de la réception de messages en temps réel
  });
});
```

---

## 📈 Monitoring et Maintenance

### **Métriques à Surveiller**
- **Performance** : Temps de réponse des API
- **Disponibilité** : Uptime de l'application
- **Utilisation** : Nombre d'utilisateurs actifs
- **Erreurs** : Taux d'erreur des requêtes
- **Sécurité** : Tentatives d'intrusion

### **Outils de Monitoring**
- **Supabase Dashboard** : Métriques de base de données
- **Vercel Analytics** : Performance frontend
- **Sentry** : Gestion des erreurs
- **LogRocket** : Session replay et debugging

---

## 🎯 Résultats Attendus

### **Améliorations Techniques**
- ✅ **Performance** : 3x plus rapide
- ✅ **Sécurité** : Niveau entreprise
- ✅ **Scalabilité** : Support de milliers d'utilisateurs
- ✅ **Disponibilité** : 99.9% uptime
- ✅ **Maintenance** : Réduite de 80%

### **Améliorations Business**
- ✅ **Collaboration** : Multi-utilisateurs en temps réel
- ✅ **Mobilité** : Accès depuis n'importe où
- ✅ **Fiabilité** : Données sécurisées et sauvegardées
- ✅ **Évolutivité** : Prêt pour la croissance
- ✅ **ROI** : Retour sur investissement immédiat

---

**🚀 Votre application EDIBA INTER sera prête pour l'avenir avec Supabase !**
