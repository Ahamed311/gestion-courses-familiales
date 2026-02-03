const express = require("express");
const cors = require("cors");
const pool = require("./db");
const topProduct = require("./services/topProduct");

const app = express();
app.use(cors());
app.use(express.json());

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
    console.error(err);
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
    console.error(err);
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
    console.error(err);
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
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Route de test pour vérifier que le serveur fonctionne
app.get("/", (req, res) => {
  res.json({ 
    message: "API Gestion des courses familiales",
    endpoints: [
      "POST /achats - Ajouter un achat",
      "GET /achats - Historique des achats",
      "GET /top-produit - Produit le plus acheté",
      "GET /bilan - Bilan financier"
    ]
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend lancé sur http://localhost:${PORT}`);
});
