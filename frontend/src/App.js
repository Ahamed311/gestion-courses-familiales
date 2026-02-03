import React, { useState, useEffect } from 'react';

const API_BASE = process.env.NODE_ENV === 'production' 
  ? 'https://votre-backend-url.com' 
  : 'http://localhost:3001';

function App() {
  const [achats, setAchats] = useState([]);
  const [topProduit, setTopProduit] = useState('');
  const [totalDepenses, setTotalDepenses] = useState(0);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
    setLoading(true);
    setError('');
    
    try {
      // Charger l'historique
      const achatsResponse = await fetch(`${API_BASE}/achats`);
      if (!achatsResponse.ok) throw new Error('Erreur lors du chargement des achats');
      const achatsData = await achatsResponse.json();
      setAchats(achatsData);

      // Charger le top produit
      const topResponse = await fetch(`${API_BASE}/top-produit`);
      if (!topResponse.ok) throw new Error('Erreur lors du chargement du top produit');
      const topData = await topResponse.json();
      setTopProduit(topData.topProduit || 'Aucun');

      // Charger le bilan
      const bilanResponse = await fetch(`${API_BASE}/bilan`);
      if (!bilanResponse.ok) throw new Error('Erreur lors du chargement du bilan');
      const bilanData = await bilanResponse.json();
      setTotalDepenses(bilanData.totalDepenses || 0);

    } catch (err) {
      setError('Erreur de connexion au serveur. Vérifiez que le backend est démarré sur http://localhost:3001');
      console.error('Erreur lors du chargement:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    // Validation côté client
    if (!formData.produit.trim()) {
      setError('Le nom du produit est obligatoire');
      setLoading(false);
      return;
    }

    if (!formData.prix || parseFloat(formData.prix) <= 0) {
      setError('Le prix doit être un nombre positif');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/achats`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          produit: formData.produit.trim(),
          prix: parseFloat(formData.prix),
          date_achat: formData.date_achat
        })
      });

      const result = await response.json();

      if (response.ok) {
        setMessage('✅ Achat ajouté avec succès !');
        setFormData({
          produit: '',
          prix: '',
          date_achat: new Date().toISOString().split('T')[0]
        });
        // Recharger les données
        await loadData();
      } else {
        setError(result.message || 'Erreur lors de l\'ajout');
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
      console.error('Erreur lors de l\'ajout:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Effacer les messages après 5 secondes
  useEffect(() => {
    if (message || error) {
      const timer = setTimeout(() => {
        setMessage('');
        setError('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message, error]);

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
              placeholder="Ex: pomme, riz, lait..."
              disabled={loading}
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
              placeholder="Ex: 2.50"
              disabled={loading}
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
              disabled={loading}
              required
            />
          </div>
          
          <button type="submit" disabled={loading}>
            {loading ? 'Ajout en cours...' : 'Ajouter l\'achat'}
          </button>
          <button 
            type="button" 
            className="btn-secondary" 
            onClick={loadData}
            disabled={loading}
          >
            {loading ? 'Chargement...' : 'Actualiser'}
          </button>
        </form>
        
        {message && <div className="message success">{message}</div>}
        {error && <div className="message error">{error}</div>}
      </div>

      {/* Statistiques */}
      <div className="section">
        <h2>📊 Statistiques</h2>
        <div className="stats">
          <div className="stat-card">
            <div className="stat-value">{loading ? '...' : topProduit}</div>
            <div className="stat-label">Produit le plus acheté</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">
              {loading ? '...' : `${totalDepenses.toFixed(2)}€`}
            </div>
            <div className="stat-label">Total des dépenses</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{loading ? '...' : achats.length}</div>
            <div className="stat-label">Nombre d'achats</div>
          </div>
        </div>
      </div>

      {/* Historique */}
      <div className="section">
        <h2>📋 Historique des achats</h2>
        {loading ? (
          <div className="loading">Chargement des données...</div>
        ) : error && achats.length === 0 ? (
          <div className="message error">
            Impossible de charger les données. Vérifiez que le backend est démarré.
          </div>
        ) : achats.length === 0 ? (
          <div className="empty-state">
            Aucun achat enregistré. Ajoutez votre premier achat ci-dessus !
          </div>
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
                <tr key={achat.id || index}>
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