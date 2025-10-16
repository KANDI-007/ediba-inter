# 📊 Application des Migrations SQL - EDIBA INTER

## 🎯 Instructions pour Appliquer les Migrations

### **Étape 1 : Accéder à l'Éditeur SQL de Supabase**

1. Allez sur [supabase.com](https://supabase.com)
2. Connectez-vous à votre compte
3. Sélectionnez votre projet : `edsvbvttpcvslewomwyk`
4. Dans le menu de gauche, cliquez sur **"SQL Editor"**

### **Étape 2 : Appliquer les Migrations dans l'Ordre**

#### **Migration 1 : Schéma Initial**
Copiez et exécutez le contenu du fichier `supabase/migrations/20241208000001_initial_schema.sql` :

```sql
-- Migration initiale pour EDIBA INTER
-- Création des tables principales

-- Extension pour UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table des utilisateurs
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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

-- Table des clients
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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

-- Table des fournisseurs
CREATE TABLE suppliers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
  delai_paiement VARCHAR(20) DEFAULT '30 jours',
  remise VARCHAR(10) DEFAULT '0%',
  statut VARCHAR(20) DEFAULT 'actif' CHECK (statut IN ('actif', 'inactif', 'suspendu')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Index pour les performances
CREATE INDEX idx_suppliers_nif ON suppliers(nif);
CREATE INDEX idx_suppliers_raison_sociale ON suppliers(raison_sociale);

-- Table des catégories d'articles
CREATE TABLE article_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  parent_id UUID REFERENCES article_categories(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Index pour les performances
CREATE INDEX idx_article_categories_parent_id ON article_categories(parent_id);

-- Table des articles
CREATE TABLE articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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

-- Table des documents (factures, devis, etc.)
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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

-- Table des lignes de documents
CREATE TABLE line_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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

-- Table des paiements
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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

-- Table des décharges
CREATE TABLE discharges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  prestataire VARCHAR(200) NOT NULL,
  prestation TEXT NOT NULL,
  date_prestation DATE NOT NULL,
  lieu VARCHAR(200) NOT NULL,
  objet TEXT DEFAULT 'CONSOMMABLE',
  signature_data TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Index pour les performances
CREATE INDEX idx_discharges_prestataire ON discharges(prestataire);
CREATE INDEX idx_discharges_date_prestation ON discharges(date_prestation);

-- Table des conversations de chat
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(200),
  is_group BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Table des participants aux conversations
CREATE TABLE conversation_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  joined_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(conversation_id, user_id)
);

-- Index pour les performances
CREATE INDEX idx_conversation_participants_conversation_id ON conversation_participants(conversation_id);
CREATE INDEX idx_conversation_participants_user_id ON conversation_participants(user_id);

-- Table des messages de chat
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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

-- Table des activités (logs)
CREATE TABLE activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  action VARCHAR(100) NOT NULL,
  module VARCHAR(50) NOT NULL,
  description TEXT,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Index pour les performances
CREATE INDEX idx_activities_user_id ON activities(user_id);
CREATE INDEX idx_activities_module ON activities(module);
CREATE INDEX idx_activities_created_at ON activities(created_at);

-- Table des notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) DEFAULT 'info',
  is_read BOOLEAN DEFAULT FALSE,
  data JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Index pour les performances
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);
```

#### **Migration 2 : Politiques RLS**
Copiez et exécutez le contenu du fichier `supabase/migrations/20241208000002_rls_policies.sql` :

```sql
-- Configuration des politiques RLS (Row Level Security)
-- Activation de RLS sur toutes les tables

-- Activer RLS sur toutes les tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE line_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE discharges ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Politiques pour les utilisateurs
CREATE POLICY "Users can view their own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own data" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can manage all users" ON users
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

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

-- Politiques pour les fournisseurs
CREATE POLICY "Authenticated users can view suppliers" ON suppliers
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admin and commercial can manage suppliers" ON suppliers
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('admin', 'commercial')
    )
  );

-- Politiques pour les articles
CREATE POLICY "Authenticated users can view articles" ON articles
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admin and commercial can manage articles" ON articles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('admin', 'commercial')
    )
  );

-- Politiques pour les catégories d'articles
CREATE POLICY "Authenticated users can view article categories" ON article_categories
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admin and commercial can manage article categories" ON article_categories
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('admin', 'commercial')
    )
  );

-- Politiques pour les documents
CREATE POLICY "Authenticated users can view documents" ON documents
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admin and commercial can manage documents" ON documents
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('admin', 'commercial')
    )
  );

-- Politiques pour les lignes de documents
CREATE POLICY "Authenticated users can view line items" ON line_items
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admin and commercial can manage line items" ON line_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('admin', 'commercial')
    )
  );

-- Politiques pour les paiements
CREATE POLICY "Authenticated users can view payments" ON payments
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admin and comptable can manage payments" ON payments
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('admin', 'comptable')
    )
  );

-- Politiques pour les décharges
CREATE POLICY "Authenticated users can view discharges" ON discharges
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admin and commercial can manage discharges" ON discharges
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('admin', 'commercial')
    )
  );

-- Politiques pour les conversations
CREATE POLICY "Users can view their conversations" ON conversations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM conversation_participants 
      WHERE conversation_participants.conversation_id = conversations.id 
      AND conversation_participants.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create conversations" ON conversations
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their conversations" ON conversations
  FOR UPDATE USING (auth.uid() = created_by);

-- Politiques pour les participants aux conversations
CREATE POLICY "Users can view conversation participants" ON conversation_participants
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM conversation_participants cp2
      WHERE cp2.conversation_id = conversation_participants.conversation_id 
      AND cp2.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage conversation participants" ON conversation_participants
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM conversations 
      WHERE conversations.id = conversation_participants.conversation_id 
      AND conversations.created_by = auth.uid()
    )
  );

-- Politiques pour les messages
CREATE POLICY "Users can view messages in their conversations" ON messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM conversation_participants 
      WHERE conversation_participants.conversation_id = messages.conversation_id 
      AND conversation_participants.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can send messages to their conversations" ON messages
  FOR INSERT WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM conversation_participants 
      WHERE conversation_participants.conversation_id = messages.conversation_id 
      AND conversation_participants.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can edit their own messages" ON messages
  FOR UPDATE USING (auth.uid() = sender_id);

-- Politiques pour les activités
CREATE POLICY "Users can view their own activities" ON activities
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all activities" ON activities
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

CREATE POLICY "System can create activities" ON activities
  FOR INSERT WITH CHECK (true);

-- Politiques pour les notifications
CREATE POLICY "Users can view their own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "System can create notifications" ON notifications
  FOR INSERT WITH CHECK (true);
```

#### **Migration 3 : Données de Test**
Copiez et exécutez le contenu du fichier `supabase/migrations/20241208000003_seed_data.sql` :

```sql
-- Données de test pour EDIBA INTER
-- Insertion des utilisateurs par défaut

-- Insertion des utilisateurs
INSERT INTO users (id, username, email, full_name, role, phone, address, join_date) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'alayi', 'alayi@edibainter.com', 'ALAYI Abide', 'admin', '+228 12 34 56 78', 'Lomé, Togo', '2024-01-01'),
('550e8400-e29b-41d4-a716-446655440002', 'esso', 'esso@edibainter.com', 'ESSO Comptable', 'comptable', '+228 12 34 56 79', 'Lomé, Togo', '2024-01-01'),
('550e8400-e29b-41d4-a716-446655440003', 'gloria', 'gloria@edibainter.com', 'GLORIA Commercial', 'commercial', '+228 12 34 56 80', 'Lomé, Togo', '2024-01-01'),
('550e8400-e29b-41d4-a716-446655440004', 'paul', 'paul@edibainter.com', 'PAUL Commercial', 'commercial', '+228 12 34 56 81', 'Lomé, Togo', '2024-01-01'),
('550e8400-e29b-41d4-a716-446655440005', 'gym', 'gym@edibainter.com', 'GYM Lecture', 'lecture', '+228 12 34 56 82', 'Lomé, Togo', '2024-01-01'),
('550e8400-e29b-41d4-a716-446655440006', 'sam', 'sam@edibainter.com', 'SAM Comptable', 'comptable', '+228 12 34 56 83', 'Lomé, Togo', '2024-01-01');

-- Insertion des catégories d'articles
INSERT INTO article_categories (id, name, description, parent_id) VALUES
('650e8400-e29b-41d4-a716-446655440001', 'Ameublement', 'Mobilier et ameublement', NULL),
('650e8400-e29b-41d4-a716-446655440002', 'Informatique', 'Équipements informatiques', NULL),
('650e8400-e29b-41d4-a716-446655440003', 'Fournitures de bureau', 'Fournitures et matériel de bureau', NULL);

-- Sous-catégories pour Ameublement
INSERT INTO article_categories (id, name, description, parent_id) VALUES
('650e8400-e29b-41d4-a716-446655440011', 'Bureaux', 'Bureaux et tables de travail', '650e8400-e29b-41d4-a716-446655440001'),
('650e8400-e29b-41d4-a716-446655440012', 'Chaises', 'Chaises et sièges', '650e8400-e29b-41d4-a716-446655440001'),
('650e8400-e29b-41d4-a716-446655440013', 'Armoires', 'Armoires et rangements', '650e8400-e29b-41d4-a716-446655440001'),
('650e8400-e29b-41d4-a716-446655440014', 'Éclairage', 'Lampes et éclairage', '650e8400-e29b-41d4-a716-446655440001');

-- Sous-catégories pour Informatique
INSERT INTO article_categories (id, name, description, parent_id) VALUES
('650e8400-e29b-41d4-a716-446655440021', 'Ordinateurs', 'Ordinateurs de bureau et portables', '650e8400-e29b-41d4-a716-446655440002'),
('650e8400-e29b-41d4-a716-446655440022', 'Périphériques', 'Souris, claviers, imprimantes', '650e8400-e29b-41d4-a716-446655440002'),
('650e8400-e29b-41d4-a716-446655440023', 'Réseau', 'Équipements réseau et télécommunications', '650e8400-e29b-41d4-a716-446655440002'),
('650e8400-e29b-41d4-a716-446655440024', 'Logiciels', 'Logiciels et licences', '650e8400-e29b-41d4-a716-446655440002');

-- Sous-catégories pour Fournitures de bureau
INSERT INTO article_categories (id, name, description, parent_id) VALUES
('650e8400-e29b-41d4-a716-446655440031', 'Papeterie', 'Papier, stylos, crayons', '650e8400-e29b-41d4-a716-446655440003'),
('650e8400-e29b-41d4-a716-446655440032', 'Organisation', 'Classeurs, dossiers, étiquettes', '650e8400-e29b-41d4-a716-446655440003'),
('650e8400-e29b-41d4-a716-446655440033', 'Nettoyage', 'Produits de nettoyage', '650e8400-e29b-41d4-a716-446655440003'),
('650e8400-e29b-41d4-a716-446655440034', 'Sécurité', 'Équipements de sécurité', '650e8400-e29b-41d4-a716-446655440003');

-- Insertion d'articles d'exemple
INSERT INTO articles (id, name, description, sku, unit_price, category_id, stock, min_stock, max_stock, brand, model, material, color, size) VALUES
('750e8400-e29b-41d4-a716-446655440001', 'Bureau en bois massif', 'Bureau professionnel en bois massif', 'BUR-001', 150000.00, '650e8400-e29b-41d4-a716-446655440011', 5, 2, 10, 'IKEA', 'HEMNES', 'Bois massif', 'Chêne', '120x60x75'),
('750e8400-e29b-41d4-a716-446655440002', 'Chaise ergonomique', 'Chaise de bureau ergonomique', 'CHA-001', 75000.00, '650e8400-e29b-41d4-a716-446655440012', 8, 3, 15, 'Herman Miller', 'Aeron', 'Métal et tissu', 'Noir', 'Standard'),
('750e8400-e29b-41d4-a716-446655440003', 'Ordinateur portable', 'Laptop professionnel', 'ORD-001', 450000.00, '650e8400-e29b-41d4-a716-446655440021', 3, 1, 5, 'Dell', 'Latitude 5520', 'Plastique et métal', 'Argent', '15.6 pouces'),
('750e8400-e29b-41d4-a716-446655440004', 'Imprimante laser', 'Imprimante laser multifonction', 'IMP-001', 120000.00, '650e8400-e29b-41d4-a716-446655440022', 2, 1, 3, 'HP', 'LaserJet Pro', 'Plastique', 'Blanc', 'A4'),
('750e8400-e29b-41d4-a716-446655440005', 'Papier A4', 'Rame de papier A4 80g', 'PAP-001', 2500.00, '650e8400-e29b-41d4-a716-446655440031', 50, 10, 100, 'Xerox', 'Business', 'Papier', 'Blanc', 'A4');

-- Insertion de clients d'exemple
INSERT INTO clients (id, raison_sociale, nom_commercial, nif, rccm, adresse, ville, telephone, email, contact_principal, secteur_activite, regime_fiscal, delai_paiement, remise, limite_credit, statut) VALUES
('850e8400-e29b-41d4-a716-446655440001', 'SOCIETE GENERALE DU TOGO', 'SGT', 'NIF001', 'RCCM001', 'Avenue de la Paix, Lomé', 'Lomé', '+228 22 21 20 00', 'contact@sgt.tg', 'Jean KOUASSI', 'Banque', 'Réel Normal', 30, 5.00, 10000000.00, 'actif'),
('850e8400-e29b-41d4-a716-446655440002', 'ORANGE TOGO', 'Orange', 'NIF002', 'RCCM002', 'Boulevard du 13 Janvier, Lomé', 'Lomé', '+228 22 22 22 22', 'contact@orange.tg', 'Marie ADJOVI', 'Télécommunications', 'Réel Normal', 15, 10.00, 5000000.00, 'actif'),
('850e8400-e29b-41d4-a716-446655440003', 'MINISTERE DE LA SANTE', 'MINSANTE', 'NIF003', 'RCCM003', 'Quartier Administratif, Lomé', 'Lomé', '+228 22 23 24 25', 'contact@sante.gouv.tg', 'Dr. Koffi AMEGAN', 'Santé Publique', 'Réel Normal', 60, 0.00, 20000000.00, 'actif'),
('850e8400-e29b-41d4-a716-446655440004', 'UNIVERSITE DE LOME', 'UL', 'NIF004', 'RCCM004', 'Campus de Lomé', 'Lomé', '+228 22 25 26 27', 'contact@univ-lome.tg', 'Prof. Ama KOUMA', 'Éducation', 'Réel Normal', 45, 2.00, 15000000.00, 'actif'),
('850e8400-e29b-41d4-a716-446655440005', 'ENTREPRISE GENERALE DU BATIMENT', 'EGB', 'NIF005', 'RCCM005', 'Zone Industrielle, Lomé', 'Lomé', '+228 22 27 28 29', 'contact@egb.tg', 'Ing. Yao TETE', 'BTP', 'Réel Normal', 30, 8.00, 25000000.00, 'actif');

-- Insertion de fournisseurs d'exemple
INSERT INTO suppliers (id, raison_sociale, nom_commercial, nif, rccm, adresse, ville, telephone, email, contact_principal, secteur_activite, delai_paiement, remise, statut) VALUES
('950e8400-e29b-41d4-a716-446655440001', 'FOURNISSEUR MOBILIER SARL', 'FOURNISSEUR MOBILIER', 'NIF-SUP001', 'RCCM-SUP001', 'Avenue de la République, Lomé', 'Lomé', '+228 22 30 31 32', 'contact@fournisseur-mobilier.tg', 'Kossi AGBO', 'Mobilier', '30 jours', '5%', 'actif'),
('950e8400-e29b-41d4-a716-446655440002', 'INFORMATIQUE PLUS', 'INFO PLUS', 'NIF-SUP002', 'RCCM-SUP002', 'Rue du Commerce, Lomé', 'Lomé', '+228 22 33 34 35', 'contact@info-plus.tg', 'Afi KOUMA', 'Informatique', '15 jours', '10%', 'actif'),
('950e8400-e29b-41d4-a716-446655440003', 'BUREAUTIQUE CENTER', 'BUREAU CENTER', 'NIF-SUP003', 'RCCM-SUP003', 'Avenue de la Paix, Lomé', 'Lomé', '+228 22 36 37 38', 'contact@bureau-center.tg', 'Komla TETE', 'Fournitures de bureau', '20 jours', '3%', 'actif');

-- Création d'une conversation de test
INSERT INTO conversations (id, name, is_group, created_by) VALUES
('a50e8400-e29b-41d4-a716-446655440001', 'Équipe EDIBA', true, '550e8400-e29b-41d4-a716-446655440001');

-- Ajout des participants à la conversation
INSERT INTO conversation_participants (conversation_id, user_id) VALUES
('a50e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001'),
('a50e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002'),
('a50e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003'),
('a50e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440004'),
('a50e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440005'),
('a50e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440006');

-- Insertion de messages de test
INSERT INTO messages (conversation_id, sender_id, content, message_type) VALUES
('a50e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Bienvenue dans l''équipe EDIBA INTER !', 'text'),
('a50e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', 'Merci pour l''accueil !', 'text'),
('a50e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', 'Ravi de faire partie de l''équipe', 'text');
```

### **Étape 3 : Vérification**

Après avoir exécuté les 3 migrations, vérifiez que tout fonctionne :

1. Allez dans **"Table Editor"** dans Supabase
2. Vérifiez que toutes les tables sont créées
3. Vérifiez que les données de test sont présentes

### **Étape 4 : Test de l'API**

1. Allez dans **"API"** dans Supabase
2. Testez une requête simple :
   ```sql
   SELECT * FROM users LIMIT 5;
   ```

## ✅ **Résultat Attendu**

Après l'application des migrations, vous devriez avoir :
- ✅ **13 tables** créées avec toutes les relations
- ✅ **Politiques RLS** configurées pour la sécurité
- ✅ **Données de test** insérées (6 utilisateurs, 5 clients, 5 articles, etc.)
- ✅ **API REST** fonctionnelle et sécurisée

## 🚀 **Prochaines Étapes**

Une fois les migrations appliquées :
1. **Tester le backend** : `npm run dev`
2. **Tester l'API** : `curl http://localhost:3000/health`
3. **Migrer les données** depuis votre application
4. **Déployer en production**

---

**📋 Suivez ces instructions étape par étape pour configurer votre base de données Supabase !**
