# 🚀 Démarrage Rapide - Gestion des Courses

## ⚡ Lancement en 30 secondes

### Option 1 : Commande Unique
```bash
npm start
```

### Option 2 : Séparément
```bash
# Terminal 1 - Backend
npm run start:backend

# Terminal 2 - Frontend  
npm run start:frontend
```

### Option 3 : Docker
```bash
npm run docker:up
```

## 📱 Accès à l'Application

Une fois démarré, ouvrez votre navigateur :

**🌐 Application** : http://localhost:3000  
**🔧 API** : http://localhost:3001

## 🎯 Utilisation Immédiate

1. **Ajouter un achat** : Remplissez le formulaire (produit, prix, date)
2. **Voir l'historique** : Liste automatiquement mise à jour
3. **Consulter les stats** : Top produit et total des dépenses

## 🛠️ Prérequis

- **Node.js** 18+ 
- **PostgreSQL** 12+
- **Base de données** : `courses` (créée automatiquement)

## 🔧 Configuration Rapide PostgreSQL

```bash
# Installer PostgreSQL (Ubuntu/Debian)
sudo apt install postgresql postgresql-contrib

# Créer la base de données
sudo -u postgres createdb courses

# Ou avec Docker
docker run --name postgres-courses -e POSTGRES_DB=courses -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres:15
```

## 📊 Fonctionnalités Disponibles

✅ **Ajout d'achats** avec validation  
✅ **Historique** trié par date  
✅ **Top produit** par occurrences  
✅ **Bilan financier** automatique  
✅ **Interface responsive** mobile/desktop  
✅ **Données de test** incluses  

## 🆘 Dépannage Express

**Port occupé ?**
```bash
# Changer les ports dans les fichiers de config
# Ou arrêter les processus existants
```

**Base de données ?**
```bash
# Vérifier PostgreSQL
sudo service postgresql status

# Redémarrer si nécessaire
sudo service postgresql restart
```

**Erreur de modules ?**
```bash
# Réinstaller les dépendances
rm -rf node_modules package-lock.json
npm install
```

## 🎉 C'est Parti !

L'application est maintenant prête à l'emploi sans configuration complexe !

---

**💡 Astuce** : Marquez cette page pour un accès rapide aux commandes essentielles.