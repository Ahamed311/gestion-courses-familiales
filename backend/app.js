const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

// Route POST pour ajouter un achat
app.post("/achats", async (req, res) => {
  const { produit, prix, date_achat } = req.body;

  try {
    await pool.query(
      "INSERT INTO achats (produit, prix, date_achat) VALUES ($1,$2,$3)",
      [produit, prix, date_achat]
    );
    res.status(201).json({ message: "Achat ajouté" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

app.listen(3001, () => {
  console.log("Backend lancé sur http://localhost:3001");
});
