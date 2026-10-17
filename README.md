# PRAYAS — Research Coordination and Collaboration Platform

**PRAYAS** is an academic research coordination platform that helps college faculty and students discover researchers across departments, publish research initiatives, propose collaborations, and leverage an explainable AI matching engine.

---

## 🏛️ Architecture & Tech Stack

The platform maintains a clear separation between frontend and backend:

### Frontend
- **Framework:** React + TypeScript + Vite
- **Styling & Components:** Tailwind CSS + shadcn/ui design primitives
- **Icons:** Lucide React
- **Motion:** Framer Motion
- **Architecture:** Component-driven design (`ui`, `layout`, `common`, `researchers`, `projects`, `matching`, `notifications`)

### Backend
- **Framework:** Python Flask
- **Database:** SQLite with SQLAlchemy ORM
- **CORS & Environment:** Flask-CORS + python-dotenv
- **Matching Engine:** Explainable multi-attribute matching algorithm in pure Python
- **Testing:** Pytest

---

## 📁 Project Directory Structure

```text
Prayas_1/
├── backend/
│   ├── app.py                # Flask application factory, routes registration & DB seeding
│   ├── config.py             # Development, testing, and production config
│   ├── extensions.py         # SQLAlchemy & CORS extensions
│   ├── requirements.txt      # Python dependencies
│   ├── .env.example          # Sample environment variables
│   ├── models/
│   │   ├── __init__.py
│   │   ├── user.py           # User model (Faculty, Researcher, Student)
│   │   ├── project.py        # Project model (Title, Abstract, Skills, Tags)
│   │   └── collaboration.py  # Collaboration request model
│   ├── routes/
│   │   ├── __init__.py
│   │   ├── researchers.py    # /api/researchers CRUD & search
│   │   ├── projects.py       # /api/projects CRUD & listing
│   │   ├── collaborations.py # /api/collaborations application workflow
│   │   └── matching.py       # /api/matching/project/<id> explainable matching
│   ├── services/
│   │   ├── __init__.py
│   │   └── matching_service.py # Explainable scoring & natural language reasoning
│   └── tests/
│       ├── __init__.py
│       └── test_api.py       # Pytest test suite
│
├── src/
│   ├── components/
│   │   ├── ui/               # Reusable shadcn/ui primitives (button, card, badge, input)
│   │   ├── layout/           # Navbar, Sidebar
│   │   ├── common/           # DepartmentBadge, StatusPill
│   │   ├── researchers/      # ResearcherCard
│   │   ├── projects/         # ProjectCard
│   │   ├── matching/         # MatchingScoreModal (visual breakdown & reasoning)
│   │   └── notifications/    # NotificationDrawer
│   ├── data/                 # Mock initial data & offline fallback
│   ├── hooks/                # usePrayasData custom hook
│   ├── layouts/              # MainLayout wrapper
│   ├── lib/                  # utils.ts (cn helper)
│   ├── pages/                # DashboardPage, ResearchersPage, ProjectsPage, MatchingPage
│   ├── services/             # api.ts (fetch client with fallback)
│   ├── types/                # index.ts (TypeScript data models)
│   ├── App.tsx               # Root component & page router
│   ├── main.tsx              # React DOM entry
│   └── index.css             # Tailwind CSS & theme tokens
│
├── index.html
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
├── tsconfig.app.json
├── vite.config.ts
└── README.md
```

---

## ⚡ Quickstart Guide

### 1. Prerequisites
- **Node.js** (v18+ or v24+) & **npm**
- **Python** (3.10+)

### 2. Frontend Setup & Run
From the project root:
```bash
# 1. Install dependencies
npm install

# 2. Build or validate TypeScript
npm run build

# 3. Start local development server
npm run dev
```
The Vite frontend will be available at: `http://localhost:5173`

### 3. Backend Setup & Run
From the project root:
```bash
# 1. Install backend requirements
python -m pip install -r backend/requirements.txt

# 2. (Optional) Configure environment
cp backend/.env.example backend/.env

# 3. Start Flask API server
python -m backend.app
```
The Flask API server will start on: `http://localhost:5000`
Health check: `http://localhost:5000/api/health`

### 4. Running Backend Tests
```bash
pytest backend/tests
```

---

## 🧠 Explainable Matching Algorithm

Unlike black-box recommendation models, PRAYAS provides clear mathematical scoring and human-readable explanations for every match:

| Attribute | Weight | Explanation |
| :--- | :--- | :--- |
| **Required Skills Match** | **45%** | Percentage of project requisite skills possessed by the researcher. |
| **Domain & Interest Overlap**| **35%** | Shared research keywords and tags between project and faculty. |
| **Interdisciplinary Synergy**| **20%** | Bonus awarded for cross-departmental collaboration. |

Each result returns:
- Numerical match score (0–100%)
- Attribute-by-attribute breakdown
- Natural language rationale (e.g. *"Shares 2 required skills: Python, PyTorch; Interdisciplinary synergy between Biotechnology and Computer Science"*).
