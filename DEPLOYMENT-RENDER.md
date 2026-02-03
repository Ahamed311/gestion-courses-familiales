# Guide de Déploiement Render

## Problème Résolu
Le déploiement échouait car Render utilisait l'ancien commit `f5f5ae7` de la branche `fonctionnalite/ajout-produit` au lieu de la branche `main` mise à jour.

## Configuration Render Dashboard

### 1. Vérifier la Branche
Dans votre dashboard Render :
- Allez dans les paramètres de votre service
- Section "Build & Deploy"
- **Branch** : Assurez-vous que c'est `main` (pas `fonctionnalite/ajout-produit`)

### 2. Variables d'Environnement
Ajoutez ces variables dans le dashboard Render :
```
NODE_ENV=production
DATABASE_URL=[URL fournie par Render PostgreSQL]
```

### 3. Configuration Base de Données
- Créez un service PostgreSQL sur Render
- Copiez l'URL de connexion interne
- Ajoutez-la comme variable `DATABASE_URL`

## Fichiers de Configuration

### render.yaml
```yaml
services:
  - type: web
    name: gestion-courses
    env: node
    plan: free
    branch: main  # ← IMPORTANT: Spécifie la branche main
    buildCommand: npm install
    startCommand: node backend/index.js
    envVars:
      - key: NODE_ENV
        value: production
```

### Procfile
```
web: node backend/index.js
```

## Structure des Fichiers
```
/
├── backend/
│   ├── index.js     # Point d'entrée (redirige vers app.js)
│   ├── app.js       # Application principale
│   ├── db.js        # Configuration PostgreSQL
│   └── package.json # Dépendances backend
├── frontend/
│   └── public/
│       ├── index.html
│       └── app.js   # Application React
├── package.json     # Configuration racine
├── render.yaml      # Configuration Render
└── Procfile         # Configuration Heroku/Render
```

## Commandes Git Exécutées
```bash
# Mise à jour render.yaml avec la branche main
git add render.yaml
git commit -m "fix: Spécifier la branche main dans render.yaml"
git push origin main

# Synchronisation de la branche fonctionnalite/ajout-produit
git checkout fonctionnalite/ajout-produit
git merge main
git push origin fonctionnalite/ajout-produit
git checkout main
```

## Prochaines Étapes
1. Vérifiez que Render utilise la branche `main` dans le dashboard
2. Configurez la base de données PostgreSQL
3. Ajoutez les variables d'environnement
4. Redéployez le service

Le déploiement devrait maintenant fonctionner avec le dernier commit de la branche main !