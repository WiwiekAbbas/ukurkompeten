# DEPLOYMENT GUIDE

Panduan deployment production-ready.

---

## INFRASTRUCTURE OVERVIEW
┌─────────────────────────────────────────────────────────┐
│ Cloud │
│ │
│ ┌─────────────┐ ┌─────────────┐ │
│ │ Vercel │ │ Railway │ │
│ │ Frontend │ │ Backend │ │
│ │ (Next.js) │◄────►│ (FastAPI) │ │
│ └─────────────┘ └──────┬──────┘ │
│ │ │
│ ┌──────▼──────┐ │
│ │ Supabase │ │
│ │ (PostgreSQL)│ │
│ └─────────────┘ │
│ │
└─────────────────────────────────────────────────────────┘


---

## BACKEND DEPLOYMENT (Railway)

### 1. Prepare Backend

```bash
cd backend

# Create requirements.txt
pip freeze > requirements.txt

# Create Railway config
echo "web: uvicorn main:app --host 0.0.0.0 --port $PORT" > Procfile
```

### 2. Deploy to Railway

1. **Push code ke GitHub**

2. **Railway Dashboard** → New Project → Deploy from GitHub

3. **Add environment variables**:
   - `DATABASE_URL`
   - `UPSTASH_REDIS_REST_URL`
   - `SECRET_KEY`
   - `FRONTEND_URL` (Vercel URL nanti)
   - dll.

4. **Deploy!**

5. **Get public URL** dari Railway dashboard

---

## FRONTEND DEPLOYMENT (Vercel)

### 1. Prepare Frontend

```bash
cd frontend

# Build test
npm run build

# Fix errors kalau ada
```

### 2. Deploy to Vercel

1. **Push code ke GitHub**

2. **Vercel Dashboard** → Add New → Import Project

3. **Select frontend folder**

4. **Add environment variable**:
   - `NEXT_PUBLIC_API_URL` = Railway backend URL

5. **Deploy!**

6. **Get public URL** dari Vercel dashboard

---

## CUSTOM DOMAIN SETUP

### 1. Buy Domain

Recommended:
- **Domainesia** (.id) - Rp 210rb/tahun
- **Namecheap** (.com) - $12/tahun

### 2. Connect to Vercel

1. **Vercel Dashboard** → Project Settings → Domains

2. **Add domain**: `ukurkompeten.id`

3. **Setup DNS** di domain provider:
Type Name Value TTL
A @ 76.76.21.21 Auto
A @ 76.76.21.22 Auto
CNAME www cname.vercel-dns.com Auto\


4. **Wait 5-10 menit**

5. **Done!**

---

## PRODUCTION CHECKLIST

Sebelum go-live, pastikan:

### Security
- [ ] HTTPS enabled (Vercel auto)
- [ ] CORS configured correctly
- [ ] JWT secret key strong enough
- [ ] Database password rotated
- [ ] Environment variables not in GitHub

### Performance
- [ ] Database indexes created
- [ ] Images optimized
- [ ] Frontend build optimized
- [ ] CDN enabled (Vercel auto)

### Monitoring
- [ ] Sentry setup (error tracking)
- [ ] Analytics setup (Plausible/Google Analytics)
- [ ] Uptime monitoring (UptimeRobot/Pingdom)

### Backup
- [ ] Database backup enabled (Supabase auto)
- [ ] Code backed up (GitHub)
- [ ] Environment variables documented

---

## MONITORING SETUP

### Sentry (Error Tracking)

1. **Create account** di https://sentry.io

2. **Install SDK**:

Backend:
```bash
pip install sentry-sdk[fastapi]
```

Frontend:
```bash
npm install @sentry/nextjs
```

3. **Add DSN** ke environment variables

4. **Initialize** di code

### Plausible (Analytics)

1. **Self-host** atau **use cloud** di https://plausible.io

2. **Add script** ke `layout.tsx`:

```tsx
<script 
  defer 
  data-domain="ukurkompeten.id" 
  src="[https://plausible.io/js/script.js](https://plausible.io/js/script.js)"
/>
```

---

## SCALING

### When to Scale?

- > 1000 concurrent users
- > 10,000 assessments/month
- Database > 1GB

### How to Scale?

**Frontend**: Vercel auto-scales (no action needed)

**Backend**:
- Upgrade Railway plan ($5 → $20/month)
- Add more workers
- Use Redis caching

**Database**:
- Upgrade Supabase plan ($0 → $25/month)
- Add read replicas
- Implement connection pooling

---

## COST ESTIMATION (Production)

| Service | Free Tier | Paid Tier (10k users/month) |
|---------|-----------|-----------------------------|
| Vercel | Free | Free |
| Railway | Free (500 hrs) | $5-20/month |
| Supabase | Free (500MB) | $25/month |
| Upstash Redis | Free (10k commands/day) | $10/month |
| Resend Email | Free (3k/month) | $20/month |
| Domain | - | Rp 200rb/tahun |
| **Total** | **~Rp 0** | **~Rp 1-1.5jt/month** |

---

## DISASTER RECOVERY

### If Backend Down:
1. Check Railway logs
2. Restart service
3. Check database connection
4. Rollback jika perlu

### If Frontend Down:
1. Check Vercel deployment logs
2. Rollback ke previous deployment
3. Check API connection

### If Database Down:
1. Check Supabase status
2. Restore from backup (auto daily)
3. Contact Supabase support

---

## SUPPORT

Production issues?
- Railway support: support@railway.app
- Vercel support: support@vercel.com
- Supabase support: support@supabase.com
