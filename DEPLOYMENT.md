# Deployment Guide

This document outlines how to deploy the Keep Alive Monitoring System to production.

## 1. Backend (Render)

We will deploy the Node.js backend as a Web Service on Render, alongside a free PostgreSQL database.

### Steps:
1. **Database**: Create a new **PostgreSQL** instance on Render. Copy the Internal and External Database URLs.
2. **Web Service**: Create a new **Web Service** on Render connected to this repository.
3. **Configuration**:
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npx prisma generate && npm run build`
   - **Start Command**: `npx prisma db push && npm start`
4. **Environment Variables**:
   - `DATABASE_URL`: (Paste the External/Internal Render Postgres URL)
   - `JWT_SECRET`: A strong random string for JWT signing.
   - `SMTP_HOST`: e.g., `smtp.gmail.com` or SendGrid/Mailgun host.
   - `SMTP_PORT`: e.g., `587`
   - `SMTP_USER`: Your SMTP username/email.
   - `SMTP_PASS`: Your SMTP app password.

## 2. Frontend (Vercel)

We will deploy the Next.js 15 frontend on Vercel.

### Steps:
1. Go to [Vercel](https://vercel.com/) and import this repository.
2. **Configuration**:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
3. **Environment Variables**:
   - `NEXT_PUBLIC_API_URL`: The URL of your deployed Render backend (e.g., `https://my-backend.onrender.com/api`).

## 3. Local Development

You can run the entire stack locally using Docker Compose:

```bash
# Start Postgres database and Node backend
docker-compose up -d

# In a separate terminal, start the Next.js frontend
cd frontend
npm run dev
```

The frontend will be available at `http://localhost:3000` and the backend at `http://localhost:5000`. API Documentation is available at `http://localhost:5000/api-docs`.
