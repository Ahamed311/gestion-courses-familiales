// Application React simplifiée sans authentification
const { useState, useEffect } = React;

const API_BASE = window.location.hostname === 'localhost' ? 
  'http://localhost:3001' : 
  'https://gestion-courses-familiales.onrender.com';

function App() {
  // États pour l'application
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
      const achatsResponse = await fetch(`${API_BASE}/api/achats`);
      if (!achatsResponse.ok) throw new Error('Erreur lors du chargement des achats');
      const achatsData = await achatsResponse.json();
      setAchats(achatsData);

      // Charger le top produit
      const topResponse = await fetch(`${API_BASE}/api/top-produit`);
      if (!topResponse.ok) throw new Error('Erreur lors du chargement du top produit');
      const topData = await topResponse.json();
      setTopProduit(topData.topProduit || 'Aucun');

      // Charger le bilan
      const bilanResponse = await fetch(`${API_BASE}/api/bilan`);
      if (!bilanResponse.ok) throw new Error('Erreur lors du chargement du bilan');
      const bilanData = await bilanResponse.json();
      setTotalDepenses(bilanData.totalDepenses || 0);

    } catch (err) {
      setError(err.message || 'Erreur de connexion au serveur');
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
      const response = await fetch(`${API_BASE}/api/achats`, {
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

  return React.createElement('div', { className: 'container' },
    // Header
    React.createElement('div', { className: 'header' },
      React.createElement('h1', null, '🛒 Gestion des Courses Familiales'),
      React.createElement('p', { className: 'subtitle' }, 'Application simplifiée pour gérer vos achats')
    ),
    
    // Formulaire d'ajout
    React.createElement('div', { className: 'section' },
      React.createElement('h2', null, '➕ Ajouter un achat'),
      React.createElement('form', { onSubmit: handleSubmit },
        React.createElement('div', { className: 'form-group' },
          React.createElement('label', { htmlFor: 'produit' }, 'Nom du produit :'),
          React.createElement('input', {
            type: 'text',
            id: 'produit',
            name: 'produit',
            value: formData.produit,
            onChange: handleInputChange,
            placeholder: 'Ex: pomme, riz, lait...',
            disabled: loading,
            required: true
          })
        ),
        React.createElement('div', { className: 'form-group' },
          React.createElement('label', { htmlFor: 'prix' }, 'Prix (€) :'),
          React.createElement('input', {
            type: 'number',
            id: 'prix',
            name: 'prix',
            step: '0.01',
            min: '0.01',
            value: formData.prix,
            onChange: handleInputChange,
            placeholder: 'Ex: 2.50',
            disabled: loading,
            required: true
          })
        ),
        React.createElement('div', { className: 'form-group' },
          React.createElement('label', { htmlFor: 'date_achat' }, 'Date d\'achat :'),
          React.createElement('input', {
            type: 'date',
            id: 'date_achat',
            name: 'date_achat',
            value: formData.date_achat,
            onChange: handleInputChange,
            disabled: loading,
            required: true
          })
        ),
        React.createElement('button', { type: 'submit', disabled: loading },
          loading ? 'Ajout en cours...' : 'Ajouter l\'achat'
        ),
        React.createElement('button', {
          type: 'button',
          className: 'btn-secondary',
          onClick: loadData,
          disabled: loading
        }, loading ? 'Chargement...' : 'Actualiser')
      ),
      message && React.createElement('div', { className: 'message success' }, message),
      error && React.createElement('div', { className: 'message error' }, error)
    ),

    // Statistiques
    React.createElement('div', { className: 'section' },
      React.createElement('h2', null, '📊 Statistiques'),
      React.createElement('div', { className: 'stats' },
        React.createElement('div', { className: 'stat-card' },
          React.createElement('div', { className: 'stat-value' }, loading ? '...' : topProduit),
          React.createElement('div', { className: 'stat-label' }, 'Produit le plus acheté')
        ),
        React.createElement('div', { className: 'stat-card' },
          React.createElement('div', { className: 'stat-value' },
            loading ? '...' : `${totalDepenses.toFixed(2)}€`
          ),
          React.createElement('div', { className: 'stat-label' }, 'Total des dépenses')
        ),
        React.createElement('div', { className: 'stat-card' },
          React.createElement('div', { className: 'stat-value' }, loading ? '...' : achats.length),
          React.createElement('div', { className: 'stat-label' }, 'Nombre d\'achats')
        )
      )
    ),

    // Historique
    React.createElement('div', { className: 'section' },
      React.createElement('h2', null, '📋 Historique des achats'),
      loading ? 
        React.createElement('div', { className: 'loading' }, 'Chargement des données...') :
      error && achats.length === 0 ?
        React.createElement('div', { className: 'message error' },
          'Impossible de charger les données. Vérifiez que le backend est démarré.'
        ) :
      achats.length === 0 ?
        React.createElement('div', { className: 'empty-state' },
          'Aucun achat enregistré. Ajoutez votre premier achat ci-dessus !'
        ) :
        React.createElement('table', null,
          React.createElement('thead', null,
            React.createElement('tr', null,
              React.createElement('th', null, 'Produit'),
              React.createElement('th', null, 'Prix'),
              React.createElement('th', null, 'Date')
            )
          ),
          React.createElement('tbody', null,
            achats.map((achat, index) =>
              React.createElement('tr', { key: achat.id || index },
                React.createElement('td', null, achat.produit),
                React.createElement('td', null, `${parseFloat(achat.prix).toFixed(2)}€`),
                React.createElement('td', null, new Date(achat.date_achat).toLocaleDateString('fr-FR'))
              )
            )
          )
        )
    ),

    // Footer
    React.createElement('div', { className: 'footer' },
      React.createElement('p', null, '🎉 Application prête pour la production - Version simplifiée')
    )
  );
}

// Rendu de l'application
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));