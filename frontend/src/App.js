import React, { useState, useEffect } from 'react';

const API_BASE = 'http://localhost:3001';

function App() {
  const [achats, setAchats] = useState([]);
  const [topProduit, setTopProduit] = useState('');
  const [totalDepenses, setTotalDepenses] = useState(0);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Formulaire d'ajout
  const [formData, setFormData] = useState({
    produit: '',
    prix: '',
    date_achat: new Date().toISOString().split('T')[0]
  });

  // Charger les données au démarrage
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Charger l'historique
      const achatsResponse = await fetch(`${API_BASE}/achats`);
      const achatsData = await achatsResponse.json();
      setAchats(achatsData);

      // Charger le top produit
      const topResponse = await fetch(`${API_BASE}/top-produit`);
      const topData = await topResponse.json();
      setTopProduit(topData.topProduit || 'Aucun');

      // Charger le bilan
      const bilanResponse = await fetch(`${API_BASE}/bilan`);
      const bilanData = await bilanResponse.json();
      setTotalDepenses(bilanData.totalDepenses || 0);

    } catch (err) {
      setError('Erreur lors du chargement des données');
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      const response = await fetch(`${API_BASE}/achats`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          produit: formData.produit,
          prix: parseFloat(formData.prix),
          date_achat: formData.date_achat
        })
      });

      if (response.ok) {
        setMessage('Achat ajouté avec succès !');
        setFormData({
          produit: '',
          prix: '',
          date_achat: new Date().toISOString().split('T')[0]
        });
        // Recharger les données
        loadData();
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Erreur lors de l\'ajout');
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
      console.error(err);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="container">
      <h1>🛒 Gestion des Courses Familiales</h1>
      
      {/* Formulaire d'ajout */}
      <div className="section">
        <h2>➕ Ajouter un achat</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="produit">Nom du produit :</label>
            <input
              type="text"
              id="produit"
              name="produit"
              value={formData.produit}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="prix">Prix (€) :</label>
            <input
              type="number"
              id="prix"
              name="prix"
              step="0.01"
              min="0.01"
              value={formData.prix}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="date_achat">Date d'achat :</label>
            <input
              type="date"
              id="date_achat"
              name="date_achat"
              value={formData.date_achat}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <button type="submit">Ajouter l'achat</button>
          <button type="button" onClick={loadData}>Actualiser</button>
        </form>
        
        {message && <div className="success">{message}</div>}
        {error && <div className="error">{error}</div>}
      </div>

      {/* Statistiques */}
      <div className="section">
        <h2>📊 Statistiques</h2>
        <div className="stats">
          <div className="stat-card">
            <div className="stat-value">{topProduit}</div>
            <div>Produit le plus acheté</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{totalDepenses.toFixed(2)}€</div>
            <div>Total des dépenses</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{achats.length}</div>
            <div>Nombre d'achats</div>
          </div>
        </div>
      </div>

      {/* Historique */}
      <div className="section">
        <h2>📋 Historique des achats</h2>
        {achats.length === 0 ? (
          <p>Aucun achat enregistré</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Produit</th>
                <th>Prix</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {achats.map((achat, index) => (
                <tr key={index}>
                  <td>{achat.produit}</td>
                  <td>{parseFloat(achat.prix).toFixed(2)}€</td>
                  <td>{new Date(achat.date_achat).toLocaleDateString('fr-FR')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default App;