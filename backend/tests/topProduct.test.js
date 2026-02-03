const topProduct = require("../services/topProduct");

describe("Top Produit Tests", () => {
  test("retourne le produit le plus acheté - scénario exact de l'épreuve", () => {
    // Scénario exact demandé : ["pomme","poire","pomme"] → "pomme"
    const produits = ["pomme", "poire", "pomme"];
    const resultat = topProduct(produits);
    expect(resultat).toBe("pomme");
  });

  test("gère les cas d'égalité", () => {
    const produits = ["riz", "lait", "riz", "lait"];
    const resultat = topProduct(produits);
    // Doit retourner l'un des deux (riz ou lait)
    expect(["riz", "lait"]).toContain(resultat);
  });

  test("gère une liste vide", () => {
    const produits = [];
    const resultat = topProduct(produits);
    expect(resultat).toBeNull();
  });

  test("gère un seul produit", () => {
    const produits = ["banane"];
    const resultat = topProduct(produits);
    expect(resultat).toBe("banane");
  });
});