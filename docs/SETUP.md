# UKURKOMPETEN - SETUP GUIDE

Panduan lengkap setup dari 0 hingga aplikasi berjalan.

---

## PREREQUISITES

Pastikan sudah install:
- [Python 3.11+](https://www.python.org/downloads/)
- [Node.js 18+](https://nodejs.org/)
- [Git](https://git-scm.com/)
- [Docker](https://www.docker.com/products/docker-desktop/) (optional, untuk local development)

---

## STEP 1: SETUP SUPABASE DATABASE

1. **Buat akun Supabase** di https://supabase.com

2. **Create new project**:
   - Project name: `ukurkompeten`
   - Database password: (simpan di password manager!)
   - Region: Singapore (closest to Indonesia)

3. **Dapatkan connection string**:
   - Settings → Database → Connection string
   - Copy URI (format: `postgresql://postgres:[password]@db.xxx.supabase.co:5432/postgres`)

4. **Execute schema SQL**:
   - SQL Editor → New query
   - Copy-paste isi `backend/database/schema.sql`
   - Run

---

## STEP 2: SETUP UPSTASH REDIS

1. **Buat akun Upstash** di https://upstash.com

2. **Create Redis database**:
   - Name: `ukurkompeten-redis`
   - Region: Singapore

3. **Dapatkan connection string**:
   - Copy `UPSTASH_REDIS_REST_URL` dan `UPSTASH_REDIS_REST_TOKEN`

---

## STEP 3: SETUP BACKEND

### 3.1 Clone Repository

```bash
git clone [https://github.com/yourusername/ukurkompeten.git](https://github.com/yourusername/ukurkompeten.git)
cd ukurkompeten/backend
```

### 3.2 Setup Python Environment

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3.3 Setup Environment Variables

```bash
# Copy example env file
cp .env.example .env

# Edit .env dengan text editor
nano .env
```

Isi dengan nilai Anda:

```env
DATABASE_URL=postgresql://postgres:[YOUR_PASSWORD]@db.[YOUR_PROJECT].supabase.co:5432/postgres
UPSTASH_REDIS_REST_URL=https://[YOUR_DB].upstash.io
UPSTASH_REDIS_REST_TOKEN=[YOUR_TOKEN]
SECRET_KEY=generate-dengan-openssl-rand-base64-32
FRONTEND_URL=http://localhost:3000
MIDTRANS_SERVER_KEY=your_midtrans_server_key
MIDTRANS_CLIENT_KEY=your_midtrans_client_key
MIDTRANS_IS_PRODUCTION=false
RESEND_API_KEY=your_resend_api_key
EMAIL_FROM=noreply@ukurkompeten.id
```

**Generate SECRET_KEY**:
```bash
openssl rand -base64 32
```

### 3.4 Run Backend

```bash
# Development mode (auto-reload)
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Production mode
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

**Test**: Buka http://localhost:8000/health

Harus return:
```json
{"status": "healthy", "version": "1.0.0"}
```

---

## STEP 4: SETUP FRONTEND

### 4.1 Navigate to Frontend

```bash
cd ../frontend
```

### 4.2 Install Dependencies

```bash
npm install
```

### 4.3 Setup Environment Variables

```bash
cp .env.local.example .env.local
nano .env.local
```

Isi dengan:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 4.4 Run Frontend

```bash
npm run dev
```

**Test**: Buka http://localhost:3030

Harus muncul homepage UkurKompeten!

---

## STEP 5: DEPLOYMENT

### 5.1 Deploy Backend ke Railway

1. **Buat akun Railway** di https://railway.app

2. **Connect GitHub repository**

3. **Deploy**:
   - New → Deploy from GitHub repo
   - Select `backend` folder
   - Add environment variables (sama seperti di .env)

4. **Get public URL**: Railway akan kasih URL seperti:
   `https://ukurkompeten-production.up.railway.app`

### 5.2 Deploy Frontend ke Vercel

1. **Buat akun Vercel** di https://vercel.com

2. **Import project**:
   - Select `frontend` folder
   - Add environment variable: `NEXT_PUBLIC_API_URL` ( Railway backend URL)

3. **Deploy!**

4. **Get public URL**: Vercel akan kasih URL seperti:
   `https://ukurkompeten.vercel.app`

---

## STEP 6: SETUP CUSTOM DOMAIN

### 6.1 Beli Domain

Provider rekomendasi:
- [Domainesia](https://domainesia.com) - .id domain Rp 210rb/tahun
- [Namecheap](https://namecheap.com) - .com domain $12/tahun

### 6.2 Connect Domain ke Vercel

1. **Vercel Dashboard** → Project Settings → Domains

2. **Add domain**: `ukurkompeten.id`

3. **Setup DNS records** di domain provider:
   Type Name Value TTL
A @ 76.76.21.21 Auto
A @ 76.76.21.22 Auto
CNAME www cname.vercel-dns.com Auto


4. **Wait 5-10 menit** untuk propagasi

5. **Done!** Domain aktif dengan HTTPS otomatis

---

## STEP 7: TESTING

### Test Registration

1. Buka http://localhost:3000/register
2. Isi form registration
3. Submit
4. Harusnya redirect ke /dashboard

### Test Assessment

1. Login dengan akun yang baru dibuat
2. Pilih Modul 1
3. Kerjakan beberapa pertanyaan
4. Submit
5. Lihat hasil

---

## TROUBLESHOOTING

### Backend tidak bisa connect ke database

- Check DATABASE_URL format
- Pastikan password benar
- Check firewall Supabase (Settings → Database → Connection pooling)

### Frontend error "Failed to fetch"

- Check NEXT_PUBLIC_API_URL benar
- Pastikan backend running di port 8000
- Check CORS settings di backend

### Database tables tidak ada

- Execute schema.sql di Supabase SQL Editor
- Check apakah ada error syntax

---

## NEXT STEPS

Setelah setup berhasil:

1. **Add assessment questions** (100+ questions untuk Modul 1)
2. **Setup payment gateway** (Midtrans)
3. **Setup email service** (Resend)
4. **Implement scoring logic** (Holland Code, Big Five)
5. **Create PDF report generation**
6. **Add more modules** (Modul 2-5)

---

## SUPPORT

Kalau ada masalah:
- Check dokumentasi: https://ukurkompeten.id/docs
- Email: support@ukurkompeten.id
- GitHub Issues: https://github.com/yourusername/ukurkompeten/issues

