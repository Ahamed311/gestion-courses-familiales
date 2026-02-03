-- Script de création de la base de données pour l'application de gestion des courses
-- Conforme au MCD de la phase 3

-- Créer la base de données (à exécuter en tant qu'admin PostgreSQL)
-- CREATE DATABASE courses;

-- Utiliser la base de données courses
-- \c courses;

-- Table principale : achats
CREATE TABLE IF NOT EXISTS achats (
    id SERIAL PRIMARY KEY,
    produit VARCHAR(100) NOT NULL,
    prix NUMERIC(10,2) CHECK (prix > 0) NOT NULL,
    date_achat DATE NOT NULL DEFAULT CURRENT_DATE
);

-- Index pour optimiser les requêtes fréquentes
CREATE INDEX IF NOT EXISTS idx_achats_date ON achats(date_achat DESC);
CREATE INDEX IF NOT EXISTS idx_achats_produit ON achats(produit);

-- Données de test (optionnel)
INSERT INTO achats (produit, prix, date_achat) VALUES 
('pomme', 2.50, '2024-01-15'),
('poire', 3.00, '2024-01-14'),
('pomme', 2.50, '2024-01-13'),
('riz', 4.20, '2024-01-12'),
('lait', 1.80, '2024-01-11'),
('pomme', 2.50, '2024-01-10')
ON CONFLICT DO NOTHING;