from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import RedirectResponse
import os

from app.db.database import engine, Base
from app.core.config import settings
# Import des routeurs
from app.api import (
    auth, 
    services, 
    trainings, 
    testimonials, 
    experts, 
    partners, 
    news, 
    contact, 
    admin,
    progress  # <--- IMPORTATION DU NOUVEAU ROUTER
)

# Création automatique des tables dans la base de données
# (Utile en développement pour appliquer vos nouveaux modèles Module et Progress)
Base.metadata.create_all(bind=engine)

# S'assurer que le dossier de stockage des fichiers existe
os.makedirs("uploads", exist_ok=True)

app = FastAPI(
    title=settings.APP_NAME,
    description="API pour le Cabinet Construire l'Avenir (CCA) - Système LMS Intégré",
    version="1.1.0"
)

# Configuration du CORS pour permettre au Frontend (React/Vite) de communiquer avec l'API
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Servir les fichiers statiques (images des formations, logos, etc.)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# --- INCLUSION DES ROUTEURS AVEC PRÉFIXE /API ---

app.include_router(auth.router, prefix="/api")
app.include_router(services.router, prefix="/api")
app.include_router(trainings.router, prefix="/api")
app.include_router(progress.router, prefix="/api") # <--- ACTIVATION DU SUIVI DE PROGRESSION
app.include_router(testimonials.router, prefix="/api")
app.include_router(experts.router, prefix="/api")
app.include_router(partners.router, prefix="/api")
app.include_router(news.router, prefix="/api")
app.include_router(contact.router, prefix="/api")
app.include_router(admin.router, prefix="/api")

@app.get("/")
def root():
    return {
        "message": "Bienvenue sur l'API du Cabinet Construire l'Avenir (CCA)",
        "docs": "/docs",
        "status": "online",
        "lms_version": "1.1"
    }

# Redirection pratique pour tester les stats admin rapidement
@app.get("/admin")
def redirect_to_admin():
    return RedirectResponse(url="/api/admin/dashboard")

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "database": "connected"}