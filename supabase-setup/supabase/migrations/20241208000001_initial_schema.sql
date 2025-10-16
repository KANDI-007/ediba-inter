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
