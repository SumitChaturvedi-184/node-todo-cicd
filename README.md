# Task Manager (Secure Version)

## 🔒 Environment Setup
1. Create `.env` file:
```env
DB_USER=admin
DB_PASS=your_secure_password
DB_HOST=localhost
```

## 🚀 Running Locally
```bash
docker-compose up -d
npm install
npm start
```

## ⚙️ CI/CD Pipeline
1. Store credentials in Jenkins:
   - Add `mongodb-creds` (username/password)
   - Add SSH `deploy-key`

2. Pipeline will:
   - Auto-build on Git push
   - Keep credentials secure