# UKURKOMPETEN

Platform assessment kompetensi berbasis data untuk profesional Indonesia.

**Tagline**: Kenali kemampuan, asah kompetensi

---

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- Supabase account
- Upstash account

### 1. Clone Repository

```bash
git clone [https://github.com/yourusername/ukurkompeten.git](https://github.com/yourusername/ukurkompeten.git)
cd ukurkompeten
```

### 2. Setup Database

- Buat project di [Supabase](https://supabase.com)
- Execute `backend/database/schema.sql` di SQL Editor

### 3. Setup Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env dengan nilai Anda
uvicorn main:app --reload
```

### 4. Setup Frontend

```bash
cd frontend
npm install
cp .env.local.example .env.local
# Edit .env.local
npm run dev
```

### 5. Open Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

---

## 📚 Documentation

- [Setup Guide](docs/SETUP.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
- [API Documentation](docs/API.md)

---

## 🛠️ Tech Stack

**Backend**:
- FastAPI (Python)
- SQLAlchemy (ORM)
- PostgreSQL (Supabase)
- Redis (Upstash)
- JWT Authentication

**Frontend**:
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Zustand (State Management)
- React Hook Form + Zod

---

## 📦 Project Structure
ukurkompeten/
├── backend/ # FastAPI backend
│ ├── api/ # API routes
│ ├── models/ # SQLAlchemy models
│ ├── schemas/ # Pydantic schemas
│ ├── services/ # Business logic
│ ├── utils/ # Helpers
│ └── database/ # DB schema & migrations
├── frontend/ # Next.js frontend
│ ├── src/
│ │ ├── app/ # Pages
│ │ ├── components/
│ │ ├── hooks/
│ │ └── lib/
│ └── public/
├── docs/ # Documentation
└── README.md


---

## 🎯 Features

- ✅ User registration & authentication
- ✅ 5 assessment modules (Modul 1 ready, 2-5 WIP)
- ✅ Real-time scoring & results
- ✅ Interactive dashboard
- ✅ Payment integration (Midtrans)
- ✅ PDF report generation
- ✅ B2B API ready

---

## 🤝 Contributing

Contributions welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) first.

---

## 📄 License

This project is proprietary software. All rights reserved.

---

## 📞 Contact

- Website: https://ukurkompeten.id
- Email: hello@ukurkompeten.id
- GitHub: https://github.com/yourusername/ukurkompeten

---

**Built with ❤️ for Indonesian professionals**
