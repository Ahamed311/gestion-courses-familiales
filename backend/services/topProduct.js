/**
 * Fonction qui retourne le produit le plus acheté
 * @param {Array} products - Liste des produits
 * @returns {string} - Le produit le plus fréquent
 */
function topProduct(products) {
  if (!products || products.length === 0) {
    return null;
  }

  const count = {};
  
  // Compter les occurrences de chaque produit
  for (const product of products) {
    count[product] = (count[product] || 0) + 1;
  }
  
  // Trouver le produit avec le plus d'occurrences
  return Object.keys(count).reduce((a, b) => 
    count[a] > count[b] ? a : b
  );
}

module.exports = topProduct;