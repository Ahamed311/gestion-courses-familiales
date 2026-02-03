// topProduct.js
function topProduct(products) {
  const count = {};
  for (const p of products) {
    count[p] = (count[p] || 0) + 1;
  }
  return Object.keys(count).reduce((a, b) =>
    count[a] > count[b] ? a : b
  );
}

module.exports = topProduct;
