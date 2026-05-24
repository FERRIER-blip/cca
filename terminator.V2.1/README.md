# CCA — Cabinet Construire l'Avenir — Site Web Complet

## ✅ Connexion Frontend ↔ Backend — TERMINÉE

---

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
```

---

## 🚀 Démarrage

### 1. Backend (terminal 1)
```bash
cd backend
pip install fastapi uvicorn sqlalchemy "pydantic[email]" pydantic-settings python-jose passlib python-multipart
python seed.py          # Données de démo + admin
uvicorn app.main:app --reload --port 8000
```

### 2. Frontend (terminal 2)
```bash
cd app
npm install
npm run dev             # http://localhost:5173
```

---

## 🔐 Comptes de démonstration

| Rôle          | Email                 | Mot de passe   |
|---------------|-----------------------|----------------|
| Administrateur| admin@cca-td.com      | Admin@2024!    |

---

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

Documentation interactive Swagger : **http://localhost:8000/docs**

---

## ⚙️ Corrections apportées

1. **Login OAuth2** — Le frontend envoyait du JSON ; FastAPI attend du `application/x-www-form-urlencoded`. Corrigé dans `api.ts`.
2. **Ordre des routes FastAPI** — `/enroll` et `/my/enrollments` placés **avant** `/{slug}` pour éviter le conflit de routing.
3. **Toutes les sections de la page d'accueil** — `Services`, `Trainings`, `Testimonials`, `Partners` utilisent maintenant `useQuery` + API.
4. **Pages publiques** — `Services`, `Trainings`, `News` + pages de détail toutes connectées.
5. **Panel Admin** — `Dashboard`, `Services`, `Trainings`, `News`, `Messages`, `Users`, `Experts`, `Testimonials`, `Partners`, `ServiceRequests` tous connectés.
6. **Espace Client** — `Dashboard`, `Profile`, `Trainings` (avec inscription en 1 clic) connectés.
7. **Page Contact** — Formulaire soumis réellement via `POST /api/contact/message`.
8. **Base de données** — Script `seed.py` pour pré-remplir toutes les collections avec des données de démo.
