# CCA — Cabinet Construire l'Avenir — Site Web Complet

Le Cabinet Construire l’Avenir (CCA) est un cabinet d’expertise et de conseil dans divers domaines, notamment juridique, administratif et de communication. Notre équipe de professionnels qualifiés et expérimentés met son expertise au service de votre réussite

## 🏗️ Architecture

```
cca-project/
├── frontend/                    ← Frontend React + Vite + TypeScript
│   ├── src/
│   │   ├── services/api.ts ← Service Axios (toutes les routes API)
│   │   ├── store/authStore.ts
│   │   ├── types/index.ts
│   │   ├── pages/          ← Pages publiques connectées à l'API
│   │   │   ├── Home.tsx, Services.tsx, Trainings.tsx, News.tsx
│   │   │   ├── ServiceDetail.tsx, TrainingDetail.tsx, NewsDetail.tsx
│   │   │   ├── Contact.tsx
│   │   │   ├── admin/      ← Panel admin complet
│   │   │   └── client/     ← Espace client
│   │   └── components/sections/
│   │       ├── Services.tsx    ← Données API
│   │       ├── Trainings.tsx   ← Données API
│   │       ├── Testimonials.tsx← Données API
│   │       └── Partners.tsx    ← Données API
│   └── .env               ← VITE_API_URL=http://localhost:8000/api
│
└── backend/               ← API FastAPI + SQLite
    ├── app/
    │   ├── main.py         ← App FastAPI + CORS
    │   ├── api/            ← Tous les routers REST
    │   │   ├── auth.py     ← /register /login /me
    │   │   ├── services.py ← CRUD services
    │   │   ├── trainings.py← CRUD formations + inscriptions
    │   │   ├── experts.py  ← CRUD experts
    │   │   ├── testimonials.py
    │   │   ├── partners.py
    │   │   ├── news.py
    │   │   ├── contact.py  ← Messages + demandes de service
    │   │   └── admin.py    ← Dashboard + gestion utilisateurs
    │   ├── models/         ← SQLAlchemy ORM
    │   ├── schemas/        ← Pydantic validation
    │   ├── core/           ← JWT + bcrypt + config
    │   └── db/             ← SQLite engine
    ├── .env                ← Variables d'environnement
    ├── seed.py             ← Script d'initialisation des données
    └── cca_database.db     ← Base SQLite (créée automatiquement)




## 🔗 Endpoints API

| Méthode | Route                          | Description                    |
|---------|--------------------------------|--------------------------------|
| POST    | /api/auth/login                | Connexion (form-urlencoded)    |
| POST    | /api/auth/register             | Inscription                    |
| GET     | /api/services/                 | Liste des services             |
| GET     | /api/services/{slug}           | Détail d'un service            |
| GET     | /api/trainings/                | Liste des formations           |
| GET     | /api/trainings/{slug}          | Détail d'une formation         |
| POST    | /api/trainings/enroll          | S'inscrire à une formation     |
| GET     | /api/trainings/my/enrollments  | Mes inscriptions               |
| GET     | /api/testimonials/featured     | Témoignages mis en avant       |
| GET     | /api/partners/                 | Liste des partenaires          |
| GET     | /api/news/                     | Actualités publiées            |
| GET     | /api/news/{slug}               | Détail d'une actualité         |
| POST    | /api/contact/message           | Envoyer un message             |
| GET     | /api/admin/dashboard           | Stats admin (admin requis)     |
| GET     | /api/admin/users               | Gestion utilisateurs           |


