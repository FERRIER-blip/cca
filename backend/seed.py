"""
Script d'initialisation des données pour le backend CCA
"""
import sys
import os
import time
from datetime import datetime
from sqlalchemy import text

# 1. On définit le chemin pour permettre les imports de 'app'
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# 2. On importe l'engine et la SESSION
from app.db.database import SessionLocal, engine

# 3. ON IMPORTE LA BASE ET TOUS LES MODÈLES
from app.models.models import Base, User, Service, Training, Expert, Testimonial, Partner, News, Domain

from app.core.security import get_password_hash

def seed():
    # 4. On crée les tables
    print("⏳ Création des tables en cours...")
    Base.metadata.create_all(bind=engine)
    
    time.sleep(1) # Sécurité pour laisser à SQLite le temps de synchroniser le fichier
    
    db = SessionLocal()
    
    try:
        # Vérification technique de la base
        db.execute(text("SELECT 1 FROM users LIMIT 1"))
        print("✅ Table 'users' détectée.")

        # ---- Admin user ----
        if not db.query(User).filter(User.email == "admin@cca-td.com").first():
            admin = User(
                email="admin@cca-td.com",
                hashed_password=get_password_hash("Admin@2024!"),
                first_name="Admin",
                last_name="CCA",
                is_admin=True,
                is_active=True,
                is_superadmin=True
            )
            db.add(admin)
            print("✅ Admin créé")

        # ---- Services ----
        services_data = [
            {"title": "Droit", "slug": "droit", "description": "Expertise juridique complète pour sécuriser vos décisions et protéger vos intérêts.", "full_content": "Notre département juridique offre une gamme complète de services incluant le conseil et la consultation juridique, la rédaction d'actes juridiques, l'assistance et représentation, l'audit et conformité juridique, ainsi que l'appui institutionnel et les réformes.", "icon": "scale", "order": 1},
            {"title": "Administration", "slug": "administration", "description": "Optimisation de vos processus administratifs et organisationnels.", "full_content": "Notre expertise administrative couvre la gouvernance et l'organisation institutionnelle, la gestion administrative, la formation et le renforcement des capacités, la gestion des projets et programmes, ainsi que les études, recherches et analyses.", "icon": "building2", "order": 2},
            {"title": "Communication", "slug": "communication", "description": "Stratégies de communication efficaces pour votre image institutionnelle.", "full_content": "Nos experts en communication vous accompagnent dans votre communication stratégique, institutionnelle, digitale, événementielle et dans la formation à la communication.", "icon": "message-square", "order": 3},
            {"title": "Informatique", "slug": "informatique", "description": "Solutions digitales innovantes pour votre transformation numérique.", "full_content": "Nous proposons des solutions IT complètes : audit et diagnostic des systèmes d'information, conseil en transformation digitale, formation, développement et sécurisation informatiques, gestion et sécurisation des données.", "icon": "monitor", "order": 4},
            {"title": "Formation", "slug": "formation", "description": "Renforcement des capacités de vos équipes avec nos programmes sur mesure.", "full_content": "Nos programmes de formation couvrent la légistique, le droit du travail, les marchés publics, la rédaction administrative, la communication et bien plus encore.", "icon": "graduation-cap", "order": 5},
            {"title": "Conseil", "slug": "conseil", "description": "Accompagnement stratégique personnalisé pour votre réussite.", "full_content": "Notre cabinet de conseil vous accompagne dans votre développement stratégique avec des solutions personnalisées adaptées à vos enjeux et objectifs.", "icon": "lightbulb", "order": 6},
        ]

        for s in services_data:
            if not db.query(Service).filter(Service.slug == s["slug"]).first():
                db.add(Service(**s))
        
        print("✅ Services créés")

        # ---- Domains ----
        domains_data = [
            {"name": "Droit", "slug": "droit", "description": "Formations juridiques", "icon": "scale", "order": 1},
            {"name": "Management", "slug": "management", "description": "Gestion et administration", "icon": "briefcase", "order": 2},
            {"name": "Communication", "slug": "communication", "description": "Communication professionnelle", "icon": "message-square", "order": 3},
            {"name": "Informatique", "slug": "informatique", "description": "Technologies de l'information", "icon": "monitor", "order": 4},
        ]
        for d in domains_data:
            if not db.query(Domain).filter(Domain.slug == d["slug"]).first():
                db.add(Domain(**d))
        
        db.flush() # Applique les changements pour récupérer les IDs des domaines

        # ---- Trainings ----
        droit_domain = db.query(Domain).filter(Domain.slug == "droit").first()
        mgmt_domain = db.query(Domain).filter(Domain.slug == "management").first()
        comm_domain = db.query(Domain).filter(Domain.slug == "communication").first()

        trainings_data = [
            {"title": "Légistique", "slug": "legistique", "description": "Maîtrisez l'art de la rédaction des textes juridiques.", "full_content": "Ce programme intensif vous forme à la légistique...", "duration": "3 jours", "price": 150000, "domain_id": droit_domain.id if droit_domain else None},
            {"title": "Droit du travail", "slug": "droit-du-travail", "description": "Comprenez les nuances du droit du travail.", "full_content": "Formation complète sur les fondamentaux...", "duration": "2 jours", "price": 100000, "domain_id": droit_domain.id if droit_domain else None},
            {"title": "Droit des marchés publics", "slug": "marches-publics", "description": "Optimisez vos marchés publics.", "full_content": "Apprenez la réglementation des marchés publics...", "duration": "3 jours", "price": 180000, "domain_id": droit_domain.id if droit_domain else None},
            {"title": "Rédaction administrative", "slug": "redaction-administrative", "description": "Perfectionnez vos écrits administratifs.", "full_content": "Formez-vous aux techniques de rédaction administrative...", "duration": "2 jours", "price": 80000, "domain_id": mgmt_domain.id if mgmt_domain else None},
            {"title": "Communication institutionnelle", "slug": "communication-institutionnelle", "description": "Développez votre impact communicationnel.", "full_content": "Maîtrisez les stratégies de communication...", "duration": "2 jours", "price": 120000, "domain_id": comm_domain.id if comm_domain else None},
            {"title": "Gestion de projet", "slug": "gestion-projet", "description": "Maîtrisez les techniques modernes.", "full_content": "Formation complète en gestion de projet...", "duration": "5 jours", "price": 250000, "domain_id": mgmt_domain.id if mgmt_domain else None},
        ]
        for t in trainings_data:
            if not db.query(Training).filter(Training.slug == t["slug"]).first():
                db.add(Training(**t))
        print("✅ Formations créées")

        # ---- Experts ----
        experts_data = [
            {"name": "Mahamat Ali Hassane", "title": "Expert Juridique Senior", "bio": "Avocat avec plus de 15 ans d'expérience...", "specialties": '["Droit des affaires", "Droit public", "Légistique"]'},
            {"name": "Fatime Oumar", "title": "Consultante en Management", "bio": "Experte en administration publique...", "specialties": '["Administration publique", "Gouvernance", "Gestion de projet"]'},
            {"name": "Ibrahim Saleh", "title": "Expert en Communication", "bio": "Spécialiste de la communication...", "specialties": '["Communication stratégique", "Relations publiques", "Communication digitale"]'},
            {"name": "Amina Déby", "title": "Consultante IT & Digital", "bio": "Ingénieure en systèmes d'information...", "specialties": '["Transformation digitale", "Sécurité informatique", "Développement logiciel"]'},
        ]
        for e in experts_data:
            if not db.query(Expert).filter(Expert.name == e["name"]).first():
                db.add(Expert(**e))
        print("✅ Experts créés")

        # ---- Testimonials ----
        testimonials_data = [
            {"author_name": "Marie Dupont", "author_title": "Directrice RH", "author_company": "Société Africaine", "content": "Le CCA a transformé notre approche administrative...", "rating": 5, "is_approved": True, "is_featured": True},
            {"author_name": "Jean Kouamé", "author_title": "CEO", "author_company": "Tech Afrique", "content": "Une équipe professionnelle et réactive...", "rating": 5, "is_approved": True, "is_featured": True},
            {"author_name": "Aminata Diallo", "author_title": "Manager", "author_company": "Banque Centrale", "content": "Les formations du CCA ont considérablement renforcé les compétences...", "rating": 5, "is_approved": True, "is_featured": True},
            {"author_name": "Paul Mensah", "author_title": "Directeur Juridique", "author_company": "Groupe Industriel", "content": "Leur accompagnement juridique nous a permis de sécuriser nos contrats...", "rating": 5, "is_approved": True, "is_featured": True},
        ]
        for test in testimonials_data:
            if not db.query(Testimonial).filter(Testimonial.author_name == test["author_name"]).first():
                db.add(Testimonial(**test))
        print("✅ Témoignages créés")

        # ---- Partners ----
        partners_data = [
            {"name": "Ministère de la Justice", "logo_url": "", "website": "", "order": 1, "is_active": True},
            {"name": "Banque Centrale", "logo_url": "", "website": "", "order": 2, "is_active": True},
            {"name": "Société Générale", "logo_url": "", "website": "", "order": 3, "is_active": True},
            {"name": "Total Energies", "logo_url": "", "website": "", "order": 4, "is_active": True},
            {"name": "ONG Internationale", "logo_url": "", "website": "", "order": 5, "is_active": True},
            {"name": "Université de N'Djaména", "logo_url": "", "website": "", "order": 6, "is_active": True},
        ]
        for p in partners_data:
            if not db.query(Partner).filter(Partner.name == p["name"]).first():
                db.add(Partner(**p))
        print("✅ Partenaires créés")

        # ---- News ----
        news_data = [
            {"title": "Lancement de notre nouvelle plateforme", "slug": "lancement-plateforme", "excerpt": "Le CCA lance une plateforme innovante...", "content": "Le Cabinet Construire l'Avenir est fier d'annoncer...", "is_published": True, "published_at": datetime(2024, 3, 15)},
            {"title": "Partenariat stratégique", "slug": "partenariat-justice", "excerpt": "Signature d'un protocole d'accord...", "content": "Le CCA a signé un protocole d'accord...", "is_published": True, "published_at": datetime(2024, 3, 10)},
            {"title": "Séminaire sur la réforme du travail", "slug": "seminaire-travail", "excerpt": "Retour sur le séminaire organisé...", "content": "Le CCA a organisé un séminaire...", "is_published": True, "published_at": datetime(2024, 3, 5)},
        ]
        for n in news_data:
            if not db.query(News).filter(News.slug == n["slug"]).first():
                db.add(News(**n))
        print("✅ Actualités créées")

        # ---- Validation finale ----
        db.commit()
        print("\n🎉 Initialisation terminée avec succès !")

    except Exception as e:
        print(f"❌ Erreur : {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed()