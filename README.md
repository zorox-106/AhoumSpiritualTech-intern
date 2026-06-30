# Ahoum Sessions Marketplace

A modern marketplace to browse and book spiritual sessions, built with React and Django.

## Tech Stack
- **Frontend**: React, Vite
- **Backend**: Django, Django REST Framework
- **Database**: PostgreSQL (Render)
- **Auth**: Firebase (Google Login)
- **Payments**: Stripe Checkout
- **Deployment**: Vercel (Frontend), Render (Backend)

## Local Setup

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

## Environment Variables Needed

Create a `.env` file in the root if you are running locally:

**Frontend (Vite):**
- `VITE_API_BASE_URL`
- `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, etc. (from your Firebase project)
- `VITE_STRIPE_PUBLISHABLE_KEY`

**Backend (Django):**
- `DATABASE_URL` (Postgres URL)
- `DJANGO_SECRET_KEY`
- `STRIPE_SECRET_KEY`
