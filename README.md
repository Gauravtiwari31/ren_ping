# Renpin - Keep Alive Monitoring System

Renpin is a full-stack system built to keep your free-tier deployments (like Render) awake by pinging them at regular intervals. It also provides a dashboard to monitor uptime, response times, and sends email alerts if your service goes down.

## 🚀 Features
- **Next.js 15 Dashboard**: Built with Tailwind CSS and Dark Mode.
- **Node.js/Express Backend**: Powered by Prisma ORM and PostgreSQL.
- **Node-Cron Service**: Automatically pings registered URLs every 10 minutes.
- **Email Alerts**: Get notified if your service remains down for over 30 minutes.
- **Docker Support**: Easily run the entire stack locally with Docker Compose.

---

## 💻 Local Setup (Run on your own PC)

The easiest way to run Renpin locally is via Docker. When running locally, your PC acts as the server that pings your websites. **Note:** Your PC must remain ON and connected to the internet for the cron job to continue running.

### Prerequisites
- Node.js (v20+)
- Docker & Docker Compose

### 1. Database & Backend
1. Open a terminal in the root folder.
2. Start the PostgreSQL database and Node.js backend using Docker:
   ```bash
   docker-compose up -d --build
   ```
3. The backend will now be running on `http://localhost:5000`. You can view the API documentation at `http://localhost:5000/api-docs`.

### 2. Frontend
1. Open a new terminal tab and navigate to the frontend folder:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
2. Open your browser and go to `http://localhost:3000`.
3. Register a new account and start adding your URLs!

---

## 🌐 Cloud Deployment (Vercel & Render)

If you prefer to host Renpin in the cloud, follow these steps. Please read `DEPLOYMENT.md` for full detailed instructions.

### 1. Render (Backend)
1. Set up a free PostgreSQL database on Render.
2. Deploy the `backend` folder as a Web Service.
3. Configure the Start Command: `npx prisma db push && npm start`
4. Provide the environment variables (see `backend/.env.example`).

### 2. Vercel (Frontend)
1. Import the repository in Vercel.
2. Select the `frontend` folder as the Root Directory.
3. Add the `NEXT_PUBLIC_API_URL` environment variable pointing to your Render backend URL.

### ⚠️ Important Note for Render Free Tier
If you deploy this backend to Render's free tier, the backend itself will go to sleep after 15 minutes of inactivity. To prevent this, you **must** use a free tool like [cron-job.org](https://cron-job.org/) or [UptimeRobot](https://uptimerobot.com/) to ping your Renpin backend URL (`https://your-renpin-backend.onrender.com/health`) every 10 minutes. Once Renpin stays awake, it will automatically keep all your other Render apps awake!
