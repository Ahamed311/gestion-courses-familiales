#!/bin/bash

echo "🔧 Installation des dépendances backend..."
cd backend
npm install --production

echo "🔧 Installation des dépendances frontend..."
cd ../frontend
npm install --production

echo "✅ Build terminé !"