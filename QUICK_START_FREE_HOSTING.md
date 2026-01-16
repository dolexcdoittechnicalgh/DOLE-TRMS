# 🚀 Quick Start: Free Hosting Setup

## Overview
This guide will help you deploy your TO-OB System (React + Laravel + MySQL) completely FREE using:
- **Frontend**: Vercel (FREE)
- **Backend**: Railway (FREE - $5 credit/month)
- **Database**: MySQL (included with Railway)

---

## ⚡ Quick Steps (15-20 minutes)

### Step 1: Prepare Your Code

1. **Build your React app:**
   ```bash
   npm run build
   ```
   Make sure it builds without errors.

2. **Commit and push to GitHub:**
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

---

### Step 2: Deploy Backend to Railway (10 minutes)

1. **Sign up:**
   - Go to https://railway.app
   - Click "Start a New Project"
   - Sign up with GitHub

2. **Deploy Laravel:**
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your Laravel backend repository
   - Railway will auto-detect Laravel

3. **Add MySQL Database:**
   - In your project, click "+ New"
   - Select "MySQL"
   - Railway will create a database automatically

4. **Get Database Credentials:**
   - Click on the MySQL service
   - Go to "Variables" tab
   - Copy: `MYSQLHOST`, `MYSQLPORT`, `MYSQLDATABASE`, `MYSQLUSER`, `MYSQLPASSWORD`

5. **Set Environment Variables:**
   - Click on your Laravel service
   - Go to "Variables" tab
   - Add these variables:
     ```
     APP_ENV=production
     APP_DEBUG=false
     APP_KEY=base64:YOUR_KEY_HERE
     APP_URL=https://your-app.up.railway.app
     
     DB_CONNECTION=mysql
     DB_HOST=[MYSQLHOST from step 4]
     DB_PORT=[MYSQLPORT from step 4]
     DB_DATABASE=[MYSQLDATABASE from step 4]
     DB_USERNAME=[MYSQLUSER from step 4]
     DB_PASSWORD=[MYSQLPASSWORD from step 4]
     ```

6. **Generate APP_KEY:**
   - In Railway, go to your Laravel service
   - Click "Deployments" → "View Logs"
   - Or run locally: `php artisan key:generate --show`
   - Copy the key and update `APP_KEY` variable

7. **Run Migrations:**
   - In Railway, add a new variable:
     ```
     RAILWAY_RUN_MIGRATIONS=true
     ```
   - Or manually run in logs/deploy command

8. **Get Your Backend URL:**
   - Railway provides: `https://your-app-name.up.railway.app`
   - Copy this URL - you'll need it for the frontend

---

### Step 3: Deploy Frontend to Vercel (5 minutes)

1. **Sign up:**
   - Go to https://vercel.com
   - Click "Sign Up"
   - Sign up with GitHub

2. **Import Project:**
   - Click "Add New..." → "Project"
   - Import your GitHub repository (React app)
   - Vercel will auto-detect Create React App

3. **Configure Build:**
   - Framework Preset: **Create React App** (auto-detected)
   - Build Command: `npm run build` (auto-detected)
   - Output Directory: `build` (auto-detected)
   - Root Directory: `./` (if React is in root)

4. **Add Environment Variable:**
   - Before deploying, click "Environment Variables"
   - Add:
     - **Name**: `REACT_APP_API_URL`
     - **Value**: `https://your-app-name.up.railway.app/api` (from Step 2)
     - **Environment**: Production, Preview, Development
   - Click "Save"

5. **Deploy:**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Your app will be live at: `https://your-app.vercel.app`

---

### Step 4: Configure CORS in Laravel

1. **Update `config/cors.php` in your Laravel backend:**
   ```php
   'allowed_origins' => [
       'https://your-app.vercel.app',
       'https://your-custom-domain.com', // if you add one
   ],
   ```

2. **Redeploy backend on Railway** (it will auto-redeploy)

---

### Step 5: Test Everything

1. **Visit your Vercel URL**
2. **Try logging in**
3. **Check browser console for errors**
4. **Test API calls**

---

## 🎯 Your URLs

After deployment, you'll have:
- **Frontend**: `https://your-app.vercel.app`
- **Backend API**: `https://your-app-name.up.railway.app/api`

---

## 🔧 Troubleshooting

### Backend not responding?
- Check Railway logs: Service → Deployments → View Logs
- Verify environment variables are set
- Check if database is connected

### CORS errors?
- Update `config/cors.php` with your Vercel URL
- Redeploy backend

### API not found?
- Verify `REACT_APP_API_URL` is set in Vercel
- Check the URL is correct (should end with `/api`)
- Redeploy frontend after adding environment variable

### Database connection failed?
- Verify database credentials in Railway variables
- Check MySQL service is running
- Test connection locally first

---

## 💰 Free Tier Limits

### Vercel:
- ✅ 100GB bandwidth/month
- ✅ Unlimited requests
- ✅ Free SSL
- ✅ Custom domains

### Railway:
- ✅ $5 free credit/month (~500 hours)
- ✅ Sleeps after inactivity (wakes on request)
- ✅ Free SSL
- ✅ Custom domains

**Note**: Railway free tier sleeps after 30 minutes of inactivity. First request after sleep may take 10-30 seconds to wake up. This is normal for free hosting.

---

## 📚 Next Steps

1. **Add Custom Domain** (optional):
   - Vercel: Settings → Domains
   - Railway: Settings → Domains

2. **Set up Monitoring**:
   - Use Railway's built-in metrics
   - Vercel Analytics (free tier available)

3. **Backup Database**:
   - Export database regularly
   - Railway provides database backups (check their docs)

---

## 🆘 Need Help?

- **Vercel Docs**: https://vercel.com/docs
- **Railway Docs**: https://docs.railway.app
- **Laravel Deployment**: https://laravel.com/docs/deployment

---

## ✅ Checklist

- [ ] Backend deployed to Railway
- [ ] MySQL database created
- [ ] Environment variables set in Railway
- [ ] Migrations run
- [ ] Backend URL copied
- [ ] Frontend deployed to Vercel
- [ ] `REACT_APP_API_URL` set in Vercel
- [ ] CORS configured in Laravel
- [ ] Application tested
- [ ] Login works
- [ ] API calls working

---

**Congratulations! Your app is now live for FREE! 🎉**
