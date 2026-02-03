-- Script de création de la base de données pour l'application de gestion des courses
-- Version production avec sécurité renforcée

-- Créer la base de données (à exécuter en tant qu'admin PostgreSQL)
-- CREATE DATABASE courses;

-- Utiliser la base de données courses
-- \c courses;

-- Table des utilisateurs (familles) avec sécurité renforcée
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    nom_famille VARCHAR(100) NOT NULL UNIQUE,
    mot_de_passe VARCHAR(255) NOT NULL, -- Hash bcrypt
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- Table principale : achats avec référence utilisateur
CREATE TABLE IF NOT EXISTS achats (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    produit VARCHAR(100) NOT NULL,
    prix NUMERIC(10,2) CHECK (prix > 0) NOT NULL,
    date_achat DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index pour optimiser les requêtes fréquentes
CREATE INDEX IF NOT EXISTS idx_achats_date ON achats(date_achat DESC);
CREATE INDEX IF NOT EXISTS idx_achats_produit ON achats(produit);
CREATE INDEX IF NOT EXISTS idx_achats_user ON achats(user_id);
CREATE INDEX IF NOT EXISTS idx_users_famille ON users(nom_famille);

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger pour mettre à jour updated_at sur users
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Données de test (optionnel - pour le développement uniquement)
-- Ces données seront créées par l'application avec des mots de passe hachés