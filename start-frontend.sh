#!/bin/bash
# Script de démarrage du frontend CCA

echo "🚀 Démarrage du frontend CCA..."
cd "$(dirname "$0")/app"

# Installation des dépendances si nécessaire
if [ ! -d "node_modules" ]; then
  echo "📦 Installation des dépendances npm..."
  npm install
fi

echo "✅ Frontend disponible sur http://localhost:5173"
echo ""
npm run dev
