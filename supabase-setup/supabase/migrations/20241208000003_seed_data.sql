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
