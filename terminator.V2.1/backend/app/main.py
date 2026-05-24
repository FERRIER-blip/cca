from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import RedirectResponse
import os

from app.db.database import engine, Base
from app.core.config import settings
from app.api import auth, services, trainings, testimonials, experts, partners, news, contact, admin

# Création des tables
Base.metadata.create_all(bind=engine)

os.makedirs("uploads", exist_ok=True)

app = FastAPI(
    title=settings.APP_NAME,
    description="API pour le Cabinet Construire l'Avenir (CCA)",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# --- INCLUSION DES ROUTEURS ---
# On ajoute le préfixe /api à TOUT le monde pour la cohérence frontend
app.include_router(auth.router, prefix="/api")
app.include_router(services.router, prefix="/api")
app.include_router(trainings.router, prefix="/api")
app.include_router(testimonials.router, prefix="/api")
app.include_router(experts.router, prefix="/api")
app.include_router(partners.router, prefix="/api")
app.include_router(news.router, prefix="/api")
app.include_router(contact.router, prefix="/api")

# CORRECTION : On ajoute /api ici pour que l'URL soit /api/admin/...
app.include_router(admin.router, prefix="/api")

@app.get("/")
def root():
    return {
        "message": "Bienvenue sur l'API du Cabinet Construire l'Avenir (CCA)",
        "docs": "/docs",
        "admin_api": "/api/admin/dashboard" 
    }

# Redirection pratique
@app.get("/admin")
def redirect_to_admin():
    return RedirectResponse(url="/api/admin/dashboard")

@app.get("/api/health")
def health_check():
    return {"status": "healthy"}