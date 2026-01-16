# 🚀 Quick Start: Free Hosting Setup

## Overview
This guide will help you deploy your TO-OB System (React + Laravel + MySQL) completely FREE using:
- **Frontend**: Vercel (FREE)
- **Backend**: Render (FREE - truly free, no credits needed)
- **Database**: MySQL (included with Render or use free MySQL hosting)

---

## 🆓 Other Free Backend Options

If Render doesn't work for you, here are other **completely free** alternatives:

### Option A: Render (Recommended - Used in this guide)
- ✅ Truly free (no credit card needed)
- ✅ 750 hours/month
- ✅ PostgreSQL included
- ⚠️ Sleeps after 15 min inactivity

### Option B: Fly.io
- ✅ Free tier with 3 shared VMs
- ✅ No sleep (always on)
- ✅ Good for Laravel
- ⚠️ Requires credit card (but won't charge on free tier)

### Option C: Koyeb
- ✅ Free tier available
- ✅ No credit card needed
- ✅ Always-on option
- ⚠️ Limited resources

### Option D: AlwaysData
- ✅ Free PHP hosting
- ✅ Free MySQL included
- ✅ No sleep
- ⚠️ Limited to 100MB storage

**This guide uses Render as it's the easiest and most reliable free option.**

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

### Step 2: Deploy Backend to Render (10 minutes)

1. **Sign up:**
   - Go to https://render.com
   - Click "Get Started for Free"
   - Sign up with GitHub (completely free, no credit card needed)

2. **Deploy Laravel:**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select your Laravel backend repository
   - Render will auto-detect Laravel

3. **Configure Web Service:**
   - **Name**: `your-app-backend` (or any name)
   - **Region**: Choose closest to you
   - **Branch**: `main` (or your default branch)
   - **Root Directory**: Leave empty (if Laravel is in root) or specify folder
   - **Runtime**: `PHP`
   - **Build Command**: `composer install --no-dev --optimize-autoloader && php artisan config:cache && php artisan route:cache`
   - **Start Command**: `php -S 0.0.0.0:$PORT -t public`
   - **Plan**: Select **Free** (completely free!)

4. **Add MySQL Database:**
   - In your Render dashboard, click "New +" → "PostgreSQL" (Render's free database)
   - **OR** use free MySQL hosting (see Step 2b below)
   - **Name**: `your-app-db`
   - **Database**: Auto-created
   - **Plan**: Select **Free**
   - Copy the **Internal Database URL** or individual credentials

5. **Set Environment Variables:**
   - In your Web Service, go to "Environment" tab
   - Click "Add Environment Variable"
   - Add these variables:
     ```
     APP_ENV=production
     APP_DEBUG=false
     APP_KEY=base64:YOUR_KEY_HERE
     APP_URL=https://your-app-backend.onrender.com
     
     DB_CONNECTION=mysql
     DB_HOST=[from database credentials]
     DB_PORT=3306
     DB_DATABASE=[from database credentials]
     DB_USERNAME=[from database credentials]
     DB_PASSWORD=[from database credentials]
     ```

6. **Generate APP_KEY:**
   - Run locally: `php artisan key:generate --show`
   - Copy the key and paste it in `APP_KEY` variable
   - Or let Render generate it (add to build command: `php artisan key:generate`)

7. **Run Migrations:**
   - Add to Build Command: `&& php artisan migrate --force`
   - Or run manually after first deployment in Render Shell

8. **Get Your Backend URL:**
   - Render provides: `https://your-app-backend.onrender.com`
   - Copy this URL - you'll need it for the frontend
   - **Note**: Free tier sleeps after 15 min inactivity (wakes automatically on request)

**Alternative Step 2b: Use Free MySQL Hosting (if Render PostgreSQL doesn't work)**

If you need MySQL specifically, use these free options:
- **db4free.net**: https://db4free.net (free MySQL)
- **FreeMySQLDatabase.com**: Free MySQL hosting
- **PlanetScale**: Free tier (MySQL compatible)

Then use those credentials in your environment variables.

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
     - **Value**: `https://your-app-backend.onrender.com/api` (from Step 2)
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
- **Backend API**: `https://your-app-backend.onrender.com/api`

---

## 🔧 Troubleshooting

### Backend not responding?
- Check Render logs: Dashboard → Your Service → Logs
- Verify environment variables are set
- Check if database is connected
- **Note**: Free tier sleeps after 15 min - first request may take 30-60 seconds to wake up

### CORS errors?
- Update `config/cors.php` with your Vercel URL
- Redeploy backend

### API not found?
- Verify `REACT_APP_API_URL` is set in Vercel
- Check the URL is correct (should end with `/api`)
- Redeploy frontend after adding environment variable

### Database connection failed?
- Verify database credentials in Render environment variables
- Check database service is running in Render dashboard
- Test connection locally first
- If using external MySQL (db4free), verify the host allows external connections

---

## 💰 Free Tier Limits

### Vercel:
- ✅ 100GB bandwidth/month
- ✅ Unlimited requests
- ✅ Free SSL
- ✅ Custom domains
- ✅ No sleep/wake delays

### Render:
- ✅ **Completely FREE** - No credit card, no credits needed
- ✅ 750 hours/month (enough for 24/7 operation)
- ✅ Sleeps after 15 minutes of inactivity (wakes automatically)
- ✅ Free SSL
- ✅ Custom domains
- ✅ PostgreSQL database included (or use free MySQL hosting)

**Note**: Render free tier sleeps after 15 minutes of inactivity. First request after sleep may take 30-60 seconds to wake up. This is normal for free hosting and doesn't affect functionality.

---

## 📚 Next Steps

1. **Add Custom Domain** (optional):
   - Vercel: Settings → Domains
   - Railway: Settings → Domains

2. **Set up Monitoring**:
   - Use Render's built-in metrics and logs
   - Vercel Analytics (free tier available)

3. **Backup Database**:
   - Export database regularly
   - Railway provides database backups (check their docs)

---

## 🆘 Need Help?

- **Vercel Docs**: https://vercel.com/docs
- **Render Docs**: https://render.com/docs
- **Laravel Deployment**: https://laravel.com/docs/deployment
- **Free MySQL Hosting**: https://db4free.net or https://www.freemysqldatabase.com

---

## ✅ Checklist

- [ ] Backend deployed to Render (FREE - no credit card needed)
- [ ] Database created (PostgreSQL on Render or free MySQL hosting)
- [ ] Environment variables set in Render
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
