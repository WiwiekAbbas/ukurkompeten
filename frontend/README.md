# UkurKompeten Frontend

Next.js 14 + TypeScript + Tailwind CSS

## Setup

1. Install dependencies:
```bash
npm install
```

2. Copy environment file:
```bash
cp .env.local.example .env.local
```

3. Update `.env.local` dengan API URL backend Anda

4. Run development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## Deployment

### Vercel

1. Push code ke GitHub
2. Import project di Vercel
3. Set environment variable: `NEXT_PUBLIC_API_URL`
4. Deploy!

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod
- **HTTP Client**: Axios
- **UI Components**: Radix UI + custom
