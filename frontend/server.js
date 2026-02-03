const express = require('express');
const path = require('path');
const app = express();

// Servir les fichiers statiques
app.use(express.static(path.join(__dirname, 'public')));

// Route pour l'application React simplifiée
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index-simple.html'));
});

// Route pour toutes les autres pages (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index-simple.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Frontend React (version simplifiée) démarré sur http://localhost:${PORT}`);
  console.log("🎉 Application sans authentification prête !");
});