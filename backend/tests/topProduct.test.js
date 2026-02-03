const topProduct = require("../services/topProduct");

test("top produit retourne pomme", () => {
  const produits = ["pomme", "poire", "pomme"];
  expect(topProduct(produits)).toBe("pomme");
});
