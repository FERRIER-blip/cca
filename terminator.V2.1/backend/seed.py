"""
Script d'initialisation des données pour le backend CCA
Crée un admin par défaut et des données de démonstration
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.db.database import SessionLocal, engine, Base
from app.models.models import (
    User, Service, Training, Expert, Testimonial, 
    Partner, News, Domain
)
from app.core.security import get_password_hash
from datetime import datetime

# Create tables
Base.metadata.create_all(bind=engine)

db = SessionLocal()

def seed():
    # ---- Admin user ----
    if not db.query(User).filter(User.email == "admin@cca-td.com").first():
        admin = User(
            email="admin@cca-td.com",
            hashed_password=get_password_hash("Admin@2024!"),
            first_name="Admin",
            last_name="CCA",
            is_admin=True,
            is_active=True,
        )
        db.add(admin)
        print("✅ Admin créé: admin@cca-td.com / Admin@2024!")

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
    db.flush()
    print("✅ Domaines créés")

    # ---- Trainings ----
    droit_domain = db.query(Domain).filter(Domain.slug == "droit").first()
    mgmt_domain = db.query(Domain).filter(Domain.slug == "management").first()
    comm_domain = db.query(Domain).filter(Domain.slug == "communication").first()
    it_domain = db.query(Domain).filter(Domain.slug == "informatique").first()

    trainings_data = [
        {"title": "Légistique", "slug": "legistique", "description": "Maîtrisez l'art de la rédaction des textes juridiques avec nos experts.", "full_content": "Ce programme intensif vous forme à la légistique, c'est-à-dire la science et la technique de l'élaboration des textes législatifs et réglementaires.", "duration": "3 jours", "price": 150000, "domain_id": droit_domain.id if droit_domain else None},
        {"title": "Droit du travail", "slug": "droit-du-travail", "description": "Comprenez les nuances du droit du travail et la gestion des ressources humaines.", "full_content": "Formation complète sur les fondamentaux du droit du travail, les contrats, la rupture du contrat de travail et les relations avec les syndicats.", "duration": "2 jours", "price": 100000, "domain_id": droit_domain.id if droit_domain else None},
        {"title": "Droit des marchés publics", "slug": "marches-publics", "description": "Optimisez vos marchés publics et maîtrisez la réglementation.", "full_content": "Apprenez la réglementation des marchés publics, les procédures d'appels d'offres, la passation et l'exécution des marchés.", "duration": "3 jours", "price": 180000, "domain_id": droit_domain.id if droit_domain else None},
        {"title": "Rédaction administrative", "slug": "redaction-administrative", "description": "Perfectionnez vos écrits administratifs et professionnels.", "full_content": "Formez-vous aux techniques de rédaction administrative : notes, rapports, comptes-rendus, correspondances officielles.", "duration": "2 jours", "price": 80000, "domain_id": mgmt_domain.id if mgmt_domain else None},
        {"title": "Communication institutionnelle", "slug": "communication-institutionnelle", "description": "Développez votre impact communicationnel et votre image institutionnelle.", "full_content": "Maîtrisez les stratégies de communication institutionnelle, la gestion de l'image, les relations publiques et la communication de crise.", "duration": "2 jours", "price": 120000, "domain_id": comm_domain.id if comm_domain else None},
        {"title": "Gestion de projet", "slug": "gestion-projet", "description": "Maîtrisez les techniques modernes de gestion de projet.", "full_content": "Formation complète en gestion de projet couvrant la planification, l'exécution, le suivi et la clôture des projets selon les standards internationaux.", "duration": "5 jours", "price": 250000, "domain_id": mgmt_domain.id if mgmt_domain else None},
    ]
    for t in trainings_data:
        if not db.query(Training).filter(Training.slug == t["slug"]).first():
            db.add(Training(**t))
    print("✅ Formations créées")

    # ---- Experts ----
    experts_data = [
        {"first_name": "Mahamat", "last_name": "Ali Hassane", "title": "Expert Juridique Senior", "bio": "Avocat avec plus de 15 ans d'expérience dans le droit des affaires et le droit public au Tchad.", "specialties": '["Droit des affaires", "Droit public", "Légistique"]'},
        {"first_name": "Fatime", "last_name": "Oumar", "title": "Consultante en Management", "bio": "Experte en administration publique et gouvernance institutionnelle, avec une expérience de 12 ans.", "specialties": '["Administration publique", "Gouvernance", "Gestion de projet"]'},
        {"first_name": "Ibrahim", "last_name": "Saleh", "title": "Expert en Communication", "bio": "Spécialiste de la communication stratégique et institutionnelle, avec un parcours en médias et relations publiques.", "specialties": '["Communication stratégique", "Relations publiques", "Communication digitale"]'},
        {"first_name": "Amina", "last_name": "Déby", "title": "Consultante IT & Digital", "bio": "Ingénieure en systèmes d'information avec une expertise en transformation digitale des organisations.", "specialties": '["Transformation digitale", "Sécurité informatique", "Développement logiciel"]'},
    ]
    for e in experts_data:
        if not db.query(Expert).filter(Expert.first_name == e["first_name"], Expert.last_name == e["last_name"]).first():
            db.add(Expert(**e))
    print("✅ Experts créés")

    # ---- Testimonials ----
    testimonials_data = [
        {"author_name": "Marie Dupont", "author_title": "Directrice RH", "author_company": "Société Africaine", "content": "Le CCA a transformé notre approche administrative. Leur expertise est inestimable et leur accompagnement a permis d'optimiser significativement nos processus.", "rating": 5, "is_approved": True, "is_featured": True},
        {"author_name": "Jean Kouamé", "author_title": "CEO", "author_company": "Tech Afrique", "content": "Une équipe professionnelle et réactive. Je recommande vivement leurs services juridiques qui nous ont permis de sécuriser nos contrats internationaux.", "rating": 5, "is_approved": True, "is_featured": True},
        {"author_name": "Aminata Diallo", "author_title": "Manager", "author_company": "Banque Centrale", "content": "Les formations du CCA ont considérablement renforcé les compétences de notre équipe. Un investissement qui a porté ses fruits.", "rating": 5, "is_approved": True, "is_featured": True},
        {"author_name": "Paul Mensah", "author_title": "Directeur Juridique", "author_company": "Groupe Industriel", "content": "Leur accompagnement juridique nous a permis de sécuriser nos contrats et de naviguer sereinement dans un environnement réglementaire complexe.", "rating": 5, "is_approved": True, "is_featured": True},
    ]
    for t in testimonials_data:
        if not db.query(Testimonial).filter(Testimonial.author_name == t["author_name"]).first():
            db.add(Testimonial(**t))
    print("✅ Témoignages créés")

    # ---- Partners ----
    partners_data = [
        {"name": "Ministère de la Justice", "logo_url": "", "website": "", "order": 1},
        {"name": "Banque Centrale", "logo_url": "", "website": "", "order": 2},
        {"name": "Société Générale", "logo_url": "", "website": "", "order": 3},
        {"name": "Total Energies", "logo_url": "", "website": "", "order": 4},
        {"name": "ONG Internationale", "logo_url": "", "website": "", "order": 5},
        {"name": "Université de N'Djaména", "logo_url": "", "website": "", "order": 6},
        {"name": "Chambre de Commerce", "logo_url": "", "website": "", "order": 7},
        {"name": "Banque Africaine", "logo_url": "", "website": "", "order": 8},
    ]
    for p in partners_data:
        if not db.query(Partner).filter(Partner.name == p["name"]).first():
            db.add(Partner(**p))
    print("✅ Partenaires créés")

    # ---- News ----
    news_data = [
        {"title": "Lancement de notre nouvelle plateforme de formation en ligne", "slug": "lancement-plateforme", "excerpt": "Le CCA lance une plateforme innovante pour permettre à tous d'accéder à nos formations à distance.", "content": "Le Cabinet Construire l'Avenir est fier d'annoncer le lancement de sa nouvelle plateforme de formation en ligne. Cette initiative s'inscrit dans notre démarche d'innovation et d'accessibilité...", "is_published": True, "published_at": datetime(2024, 3, 15)},
        {"title": "Partenariat stratégique avec le Ministère de la Justice", "slug": "partenariat-justice", "excerpt": "Signature d'un protocole d'accord pour le renforcement des capacités des magistrats.", "content": "Le CCA a signé un protocole d'accord avec le Ministère de la Justice du Tchad pour renforcer les capacités des magistrats en matière de légistique et droit des affaires...", "is_published": True, "published_at": datetime(2024, 3, 10)},
        {"title": "Séminaire sur la réforme du code du travail", "slug": "seminaire-travail", "excerpt": "Retour sur le séminaire organisé pour les professionnels des ressources humaines.", "content": "Le CCA a organisé un séminaire de deux jours sur la réforme du code du travail. Plus de 50 professionnels des ressources humaines ont participé à cet événement...", "is_published": True, "published_at": datetime(2024, 3, 5)},
        {"title": "Nouveau programme de formation en gestion de projet", "slug": "nouveau-programme-gp", "excerpt": "Découvrez notre nouveau cursus complet en gestion de projet certifiant.", "content": "Nous avons le plaisir d'annoncer le lancement de notre nouveau programme de formation en gestion de projet. Ce cursus certifiant de 5 jours est conçu pour les cadres et managers...", "is_published": True, "published_at": datetime(2024, 2, 28)},
        {"title": "Le CCA recrute de nouveaux consultants", "slug": "recrutement", "excerpt": "Rejoignez notre équipe d'experts et participez à des projets passionnants.", "content": "Le Cabinet Construire l'Avenir est en pleine expansion et recherche de nouveaux consultants dans les domaines du droit, de l'administration et de la communication...", "is_published": True, "published_at": datetime(2024, 2, 20)},
        {"title": "Rapport annuel 2023 : Bilan et perspectives", "slug": "rapport-annuel-2023", "excerpt": "Découvrez les réalisations du CCA en 2023 et nos projets pour l'année à venir.", "content": "Le rapport annuel 2023 du CCA est désormais disponible. Cette année a été marquée par de nombreuses réalisations : formation de plus de 500 participants, 30 nouveaux partenariats...", "is_published": True, "published_at": datetime(2024, 2, 15)},
    ]
    for n in news_data:
        if not db.query(News).filter(News.slug == n["slug"]).first():
            db.add(News(**n))
    print("✅ Actualités créées")

    db.commit()
    print("\n🎉 Initialisation terminée avec succès!")
    print("📧 Admin: admin@cca-td.com")
    print("🔑 Mot de passe: Admin@2024!")

seed()
db.close()
