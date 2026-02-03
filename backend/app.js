const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
require('dotenv').config();

const pool = require("./db");
const topProduct = require("./services/topProduct");

const app = express();

// Sécurité de base
app.use(helmet());
app.use(cors());
app.use(express.json());

// Initialiser la base de données au démarrage
async function initializeTable() {
  try {
    // Table des achats (version simplifiée sans utilisateurs)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS achats (
        id SERIAL PRIMARY KEY,
        produit VARCHAR(100) NOT NULL,
        prix NUMERIC(10,2) CHECK (prix > 0) NOT NULL,
        date_achat DATE NOT NULL DEFAULT CURRENT_DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("✅ Table 'achats' créée ou vérifiée");
    
    // Ajouter quelques données de test si la table est vide
    const result = await pool.query("SELECT COUNT(*) FROM achats");
    const count = parseInt(result.rows[0].count);
    
    if (count === 0) {
      await pool.query(`
        INSERT INTO achats (produit, prix, date_achat) VALUES 
        ('pomme', 2.50, '2024-01-15'),
        ('poire', 3.00, '2024-01-14'),
        ('pomme', 2.50, '2024-01-13'),
        ('riz', 4.20, '2024-01-12'),
        ('lait', 1.80, '2024-01-11'),
        ('pomme', 2.50, '2024-01-10')
      `);
      console.log("✅ Données de test ajoutées");
    }
    
    // Créer les index pour les performances
    await pool.query('CREATE INDEX IF NOT EXISTS idx_achats_date ON achats(date_achat DESC)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_achats_produit ON achats(produit)');
    console.log("✅ Index créés pour les performances");
    
  } catch (error) {
    console.error("❌ Erreur lors de l'initialisation:", error);
  }
}

// Route de test pour vérifier que le serveur fonctionne
app.get("/", (req, res) => {
  res.json({ 
    message: "API Gestion des courses familiales",
    version: "1.0.0 - Version simplifiée",
    endpoints: [
      "POST /achats - Ajouter un achat",
      "GET /achats - Historique des achats",
      "GET /top-produit - Produit le plus acheté",
      "GET /bilan - Bilan financier"
    ]
  });
});

// Route POST pour ajouter un achat
app.post("/achats", async (req, res) => {
  const { produit, prix, date_achat } = req.body;

  // Validation des données
  if (!produit || !prix || !date_achat) {
    return res.status(400).json({ message: "Tous les champs sont obligatoires" });
  }

  if (prix <= 0) {
    return res.status(400).json({ message: "Le prix doit être positif" });
  }

  try {
    await pool.query(
      "INSERT INTO achats (produit, prix, date_achat) VALUES ($1,$2,$3)",
      [produit, prix, date_achat]
    );
    res.status(201).json({ message: "Achat ajouté avec succès" });
  } catch (err) {
    console.error("Erreur lors de l'ajout:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Route GET pour récupérer l'historique des achats (trié par date décroissante)
app.get("/achats", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM achats ORDER BY date_achat DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Erreur lors de la récupération:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Route GET pour le top produit (le plus acheté par occurrences)
app.get("/top-produit", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT produit FROM achats GROUP BY produit ORDER BY COUNT(*) DESC LIMIT 1"
    );
    
    if (result.rows.length === 0) {
      return res.json({ message: "Aucun achat enregistré" });
    }
    
    res.json({ 
      topProduit: result.rows[0].produit,
      message: `Le produit le plus acheté est : ${result.rows[0].produit}`
    });
  } catch (err) {
    console.error("Erreur lors du calcul du top produit:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Route GET pour le bilan financier (total des dépenses)
app.get("/bilan", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT SUM(prix) AS total_depenses FROM achats"
    );
    
    const total = result.rows[0].total_depenses || 0;
    res.json({ 
      totalDepenses: parseFloat(total),
      message: `Total des dépenses : ${total}€`
    });
  } catch (err) {
    console.error("Erreur lors du calcul du bilan:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Initialiser la base de données au démarrage
initializeTable();

// Démarrer le serveur
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Backend lancé sur http://localhost:${PORT}`);
  console.log(`📊 Environnement: ${process.env.NODE_ENV || 'development'}`);
  console.log("🎉 Application prête (version simplifiée sans authentification) !");
});