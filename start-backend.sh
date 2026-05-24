#!/bin/bash
# Script de démarrage du backend CCA

echo "🚀 Démarrage du backend CCA..."
cd "$(dirname "$0")/backend"

# Installation des dépendances si nécessaire
if [ ! -d ".venv" ]; then
  echo "📦 Création de l'environnement virtuel..."
  python3 -m venv .venv
fi

source .venv/bin/activate
pip install -q fastapi uvicorn sqlalchemy "pydantic[email]" pydantic-settings python-jose passlib python-multipart

# Initialisation de la base de données (si première fois)
if [ ! -f "cca_database.db" ]; then
  echo "🌱 Initialisation de la base de données..."
  python seed.py
fi

echo "✅ Backend disponible sur http://localhost:8000"
echo "📚 Documentation API: http://localhost:8000/docs"
echo ""
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
