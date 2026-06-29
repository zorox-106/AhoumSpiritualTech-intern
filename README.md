# Ahoum Sessions Marketplace

A full-stack **Sessions Marketplace** web application where users can sign in via OAuth, browse sessions, and book them. Built as a Fullstack Intern assignment.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite) |
| Backend | Django + Django REST Framework |
| Database | PostgreSQL |
| Auth | OAuth (Google/GitHub) → JWT |
| Infrastructure | Docker + Docker Compose + Nginx |
| Payment (Bonus) | Stripe (Test Mode / Mock) |
| Rate Limiting (Bonus) | DRF Built-in Throttling |

---

## Architecture

```
Browser → Nginx (Port 80) → Frontend (Vite:5173)
                          → Backend API (Django:8000)
                          → PostgreSQL DB
```

All containers are managed by a single `docker-compose.yml` file.

---

## 🚀 Quick Start (One Command)

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running

### Steps

**1. Clone the repository**
```bash
git clone <your-repo-url>
cd "Ahoum SpiritualTech"
```

**2. Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your actual values (see OAuth Setup below)
```

**3. Start the entire stack**
```bash
docker-compose up --build
```

**4. Run database migrations (first time only, in a new terminal)**
```bash
docker-compose exec backend python manage.py migrate
```

**5. (Optional) Seed sample data**
```bash
docker-compose exec backend python seed.py
```

**6. Open your browser**
```
http://localhost
```

---

## Environment Variables

Copy `.env.example` to `.env` and fill in the values:

```env
# Database
DB_NAME=sessions_db
DB_USER=sessions_user
DB_PASSWORD=sessions_password

# Django
DJANGO_SECRET_KEY=your-very-secret-key-here

# OAuth Credentials
GOOGLE_OAUTH2_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GITHUB_OAUTH_CLIENT_ID=your-github-client-id
GITHUB_OAUTH_CLIENT_SECRET=your-github-client-secret

# Stripe (Test Mode)
STRIPE_SECRET_KEY=sk_test_your_stripe_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key
```

---

## OAuth Client Setup

### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project → Enable "Google+ API"
3. Go to **Credentials** → **Create OAuth 2.0 Client ID**
4. Set Authorized redirect URI to: `http://localhost/api/users/auth/oauth/`
5. Copy the **Client ID** to `.env` → `GOOGLE_OAUTH2_CLIENT_ID`

### GitHub OAuth
1. Go to GitHub → **Settings** → **Developer Settings** → **OAuth Apps**
2. Click **New OAuth App**
3. Set **Authorization callback URL** to: `http://localhost/api/users/auth/oauth/`
4. Copy **Client ID** and **Client Secret** to `.env`

> **Note for Assignment Review:** The app includes a **Mock OAuth flow** for demonstration. Click "Continue with Google/GitHub" on the login page to simulate a full OAuth → JWT flow without needing real API keys.

---

## Demo Flow

1. **Open** `http://localhost` — see the public Session Catalog
2. **Click** "Sign In" in the navbar → Login page
3. **Click** "Continue with Google" → Mock OAuth runs → Real JWT issued → Redirected to Dashboard
4. **Navigate** back to Catalog → click "View & Book" on any session
5. **Session Detail page** opens with full info and "Book & Pay Now" button
6. **Click** "Book & Pay Now" → Stripe Checkout modal appears (test card: `4242 4242 4242 4242`)
7. **Click** "Pay" → Booking recorded in database → Redirected to Dashboard
8. **Dashboard** shows your bookings with status badges

---

## API Endpoints

### Auth
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/users/auth/oauth/` | No | OAuth login → returns JWT |
| GET | `/api/users/me/` | JWT | Get current user profile |
| PUT | `/api/users/me/` | JWT | Update profile |

### Sessions
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/marketplace/sessions/` | No | List all active sessions |
| POST | `/api/marketplace/sessions/` | JWT (Creator) | Create a new session |
| GET | `/api/marketplace/sessions/:id/` | No | Session detail |
| PUT | `/api/marketplace/sessions/:id/` | JWT (Creator, own) | Update session |
| DELETE | `/api/marketplace/sessions/:id/` | JWT (Creator, own) | Delete session |
| GET | `/api/marketplace/sessions/my_sessions/` | JWT (Creator) | Creator's own sessions |

### Bookings
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/marketplace/bookings/` | JWT | List bookings (role-aware) |
| POST | `/api/marketplace/bookings/` | JWT | Create a booking |

---

## Features Implemented

### Core (100 pts)
- ✅ Docker multi-container setup (Frontend, Backend, DB, Nginx)
- ✅ OAuth login (Google & GitHub) with JWT issuance
- ✅ Two roles: `USER` (browse & book) and `CREATOR` (create & manage)
- ✅ Public session catalog
- ✅ Session Detail page with booking flow
- ✅ User Dashboard: view bookings & profile
- ✅ Creator Dashboard: manage sessions & view bookings
- ✅ `.env.example` with all required variables

### Bonus (+15 pts)
- ✅ **Payment Gateway**: Mock Stripe Checkout integration (test mode)
- ✅ **Rate Limiting**: DRF throttling — 30 req/min (anon), 100 req/min (auth)

---

## Project Structure

```
.
├── docker-compose.yml
├── .env.example
├── nginx/
│   └── default.conf
├── backend/
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── backend_core/        # Django project settings, urls
│   ├── users/               # Custom User model, OAuth views
│   └── marketplace/         # Session & Booking models, APIs
└── frontend/
    ├── Dockerfile
    ├── src/
    │   ├── AuthContext.jsx  # JWT state management
    │   ├── App.jsx          # Router + Navbar
    │   └── pages/
    │       ├── Home.jsx         # Catalog page
    │       ├── Login.jsx        # OAuth login page
    │       ├── SessionDetail.jsx # Session detail + Stripe checkout
    │       └── Dashboard.jsx    # User/Creator dashboard
    └── package.json
```
