# Prescription Management System

A full-stack React + Flask Prescription Management System built for doctors, patients, pharmacists, and admins.

## Features

- JWT authentication
- Role-based access control (Doctor, Patient, Pharmacist, Admin)
- Prescription CRUD with one-to-many and many-to-many relationships
- Medicine inventory management
- Dashboard with statistics
- React frontend with protected routes
- Flask backend with SQLAlchemy and Flask-JWT-Extended

## Project Structure

- `backend/` — Flask API, models, routes, seeding, configuration
- `frontend/` — React UI built with Vite, pages, authentication context

## Backend Setup

1. Create a Python environment:

```bash
python -m venv .venv
source .venv/bin/activate
```

2. Install backend dependencies:

```bash
pip install -r backend/requirements.txt
```

3. Seed the database:

```bash
python backend/seed.py
```

4. Run the backend server:

```bash
python backend/app.py
```

By default, the API runs at `http://localhost:5000`.

## Frontend Setup

1. Install frontend dependencies:

```bash
cd frontend
npm install
```

2. Run the frontend:

```bash
npm run dev
```

3. Open the Vite app URL shown in the terminal.

## Default Seeded Accounts

- Admin: `admin@health.com` / `adminpass`
- Doctor: `doctor@health.com` / `doctorpass`
- Pharmacist: `pharmacist@health.com` / `pharmapass`
- Patient: `patient@health.com` / `patientpass`

## Notes

- Use `Register` to create new users.
- Doctors can create prescriptions.
- Pharmacists can manage medicines and dispense prescriptions.
- The dashboard shows user, prescription, and medicine counts.
