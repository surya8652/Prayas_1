# PRAYAS — Research Coordination and Collaboration Platform

**PRAYAS** is an academic research platform designed to dismantle departmental silos in higher education institutions and research universities. By combining transparent explainable AI matching algorithms, secure session-based authentication, and a modern design system, PRAYAS enables faculty, postdoctoral researchers, and student scholars across disciplines to form cross-departmental grant proposals, share laboratory expertise, and co-author publications.

---

## 🏛️ Architecture Overview

- **Python-First Backend**: Flask 3.x REST API handling authentication, security sessions, database models, explainable matching algorithms, and synergy analytics.
- **Database**: SQLite with SQLAlchemy ORM featuring relational models for Users, Profiles, Skills, and Projects.
- **Security & Cryptography**: Password hashing using Werkzeug scrypt/pbkdf2, secure HTTP-only SameSite session cookies, input normalization, and role-based access control.
- **Testing**: Comprehensive pytest test suite with isolated in-memory SQLite fixtures (`TestingConfig`).
- **Frontend**: React 18 with TypeScript, Vite, Tailwind CSS, and shadcn/ui components.

---

## 🚀 Getting Started

### 1. Prerequisites
- **Python**: 3.10+ (tested with Python 3.13)
- **Node.js**: 18+ and `npm`

---

### 2. Backend Setup (Python Flask)

#### Step 2.1: Create & Activate Virtual Environment
```bash
# Windows (PowerShell)
python -m venv venv
.\venv\Scripts\Activate.ps1

# Linux / macOS
python3 -m venv venv
source venv/bin/activate
```

#### Step 2.2: Install Python Dependencies
```bash
pip install -r backend/requirements.txt
```

#### Step 2.3: Environment Variables
Create a `.env` file in the `backend/` folder (or copy from `backend/.env.example`):
```bash
FLASK_APP=app.py
FLASK_ENV=development
FLASK_DEBUG=1
SECRET_KEY=prayas-super-secret-key-production-ready-2026
DATABASE_URL=sqlite:///prayas.db
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
PORT=5000
```

#### Step 2.4: Database Initialization & Starting the Backend
The SQLite database (`prayas.db`) is automatically initialized and seeded with demo researchers, projects, and collaboration requests on first boot if it does not already exist.

```bash
# Run backend runner script
python run_backend.py

# Or run directly with python module:
python -m backend.app
```
*The backend API will start on `http://localhost:5000`.*

---

### 3. Frontend Setup (React + Vite)

#### Step 3.1: Install Dependencies
```bash
npm install
```

#### Step 3.2: Start Vite Development Server
```bash
npm run dev
```
*The web platform UI will start on `http://localhost:5173`.*

#### Step 3.3: Production Build
```bash
npm run build
```

---

### 4. Running Backend Tests

The project includes isolated pytest tests covering unit models, API endpoints, authentication flows, password security, and access control:

```bash
# Run entire test suite
python -m pytest

# Run specific authentication and profile tests
python -m pytest backend/tests/test_auth_and_profile.py

# Run comprehensive route integration tests
python -m pytest backend/tests/test_comprehensive.py
```

---

## 🗄️ Database Models

| Model | Table | Description |
|---|---|---|
| **User** | `users` | Primary user identity: `id`, `full_name`, `email` (unique, normalized), `password_hash` (Werkzeug), `role` (Student, Faculty, Researcher), `department`, `is_active`, `created_at`, `updated_at`. |
| **ResearcherProfile** | `researcher_profiles` | Academic background: `id`, `user_id` (FK), `bio`, `research_domain`, `research_interests` (JSON), `availability`, `profile_completed`, timestamps. |
| **Skill** | `skills` | Master catalog of unique academic skills and computational tools: `id`, `name`. |
| **ResearcherSkill** | `researcher_skills` | Junction table connecting `researcher_profiles.id` and `skills.id`. |
| **ResearchProject** | `research_projects` | Collaborative initiatives: `id`, `title`, `description`, `owner_id` (FK), `research_domain`, `status`, `deadline`, `created_at`, `updated_at`. |

---

## 🔐 Authentication & Security

- **Endpoints**:
  - `POST /api/auth/register` — Validates institutional email, hashes password with Werkzeug, creates initial user and profile, blocks unauthorized admin creation, and initializes session.
  - `POST /api/auth/login` — Verifies credentials, prevents inactive accounts from signing in, and establishes server-side session.
  - `POST /api/auth/logout` — Invalidates server-side session.
  - `GET /api/auth/me` — Returns current authenticated user without exposing password hashes.
  - `GET /api/profile` — Retrieves the signed-in user's profile and skills.
  - `PUT /api/profile` — Updates profile information with authorization enforcement ensuring users can only modify their own data.
- **Session Security**: Server-side sessions using signed cookies with `SESSION_COOKIE_HTTPONLY=True`, `SESSION_COOKIE_SAMESITE="Lax"`, and CORS with `supports_credentials=True`.

---

## 🧭 Multi-Step Onboarding Flow

New users complete a 6-step guided profile wizard:
1. **Basic Information**: Academic title, full name, and research narrative/bio.
2. **Department & Domain**: Institutional department selection and primary domain.
3. **Skills & Expertise**: Tag-based skill selection with popular suggestions (e.g. PyTorch, ROS2, Bioinformatics).
4. **Research Interests**: Cross-disciplinary interest topics for algorithmic matching.
5. **Ongoing Projects & Availability**: Collaboration bandwidth and grant highlights.
6. **Review & Save**: Profile summary verification before writing directly to SQLite via `PUT /api/profile`.

---

## 👥 Seeded Quick Test Accounts

When the application boots with fresh database, the following faculty and student accounts are available:

| Account | Email | Role | Password |
|---|---|---|---|
| **Dr. Aris Thorne** | `aris.thorne@prayas.edu` | Faculty (Computer Science) | `password` |
| **Dr. Kavita Raman** | `kavita.raman@prayas.edu` | Faculty (Biotech & Biomed) | `password` |
| **Devansh Mehta** | `devansh.m@prayas.edu` | Researcher (Data Science & AI) | `password` |
| **Ananya Sen** | `ananya.sen@prayas.edu` | Student (Electronics & Comm) | `password` |
