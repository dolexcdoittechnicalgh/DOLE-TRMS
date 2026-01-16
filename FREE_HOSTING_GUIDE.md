# Free Hosting Guide for TO-OB System

## 🎯 Best Free Hosting Combination

### Recommended Setup:
1. **Frontend (React)**: Vercel (FREE) - Best for React apps
2. **Backend (Laravel)**: Railway or Render (FREE tier)
3. **Database (MySQL)**: Included with backend hosting or use free MySQL hosting

---

## Option 1: Vercel + Railway (Recommended)

### Frontend: Vercel (FREE)
- ✅ Unlimited bandwidth
- ✅ Free SSL certificate
- ✅ Custom domain support
- ✅ Automatic deployments from GitHub
- ✅ Fast CDN

**Limits:**
- 100GB bandwidth/month
- Perfect for most applications

### Backend: Railway (FREE)
- ✅ $5 free credit monthly (enough for small apps)
- ✅ Easy Laravel deployment
- ✅ MySQL database included
- ✅ Free SSL
- ✅ Custom domain support

**Limits:**
- $5 credit = ~500 hours of runtime
- Sleeps after inactivity (wakes on request)

---

## Option 2: Vercel + Render (Alternative)

### Frontend: Vercel (Same as above)

### Backend: Render (FREE)
- ✅ Free tier available
- ✅ Laravel support
- ✅ PostgreSQL included (can use MySQL too)
- ✅ Free SSL

**Limits:**
- Sleeps after 15 minutes of inactivity
- Slower cold starts

---

## Option 3: All-in-One Free PHP Hosting

### Providers: InfinityFree, 000webhost, Freehostia
- ✅ Free PHP hosting (Laravel works)
- ✅ Free MySQL database
- ✅ Can host both frontend and backend
- ❌ Limited resources
- ❌ May have ads
- ❌ Slower performance

---

## 📋 Step-by-Step Deployment

### Part 1: Deploy Frontend to Vercel

1. **Build your React app:**
   ```bash
   npm run build
   ```

2. **Create Vercel account:**
   - Go to https://vercel.com
   - Sign up with GitHub

3. **Deploy:**
   - Click "New Project"
   - Import your GitHub repository
   - Framework Preset: **Create React App**
   - Build Command: `npm run build`
   - Output Directory: `build`
   - Click "Deploy"

4. **Update API URL:**
   - After deployment, update your `src/api.js` to use your backend URL
   - Or use environment variables (see below)

---

### Part 2: Deploy Backend to Railway

1. **Prepare Laravel for production:**
   - Create `Procfile` in Laravel root:
     ```
     web: vendor/bin/heroku-php-apache2 public/
     ```
   - Create `railway.json` (optional):
     ```json
     {
       "$schema": "https://railway.app/railway.schema.json",
       "build": {
         "builder": "NIXPACKS"
       },
       "deploy": {
         "startCommand": "php artisan serve --host=0.0.0.0 --port=$PORT",
         "restartPolicyType": "ON_FAILURE",
         "restartPolicyMaxRetries": 10
       }
     }
     ```

2. **Create Railway account:**
   - Go to https://railway.app
   - Sign up with GitHub

3. **Deploy:**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your Laravel backend repository
   - Railway will auto-detect Laravel

4. **Add MySQL Database:**
   - In Railway project, click "+ New"
   - Select "MySQL"
   - Railway will provide connection details

5. **Set Environment Variables:**
   - Go to Variables tab
   - Add:
     ```
     APP_ENV=production
     APP_DEBUG=false
     APP_KEY=your-app-key
     DB_HOST=your-mysql-host
     DB_DATABASE=your-database-name
     DB_USERNAME=your-username
     DB_PASSWORD=your-password
     ```

6. **Run Migrations:**
   - In Railway, go to your service
   - Click "Deployments" → "View Logs"
   - Or add to deploy command: `php artisan migrate --force`

7. **Get your backend URL:**
   - Railway provides: `https://your-app.up.railway.app`
   - Update this in your frontend API configuration

---

### Part 3: Update Frontend API Configuration

Update `src/api.js` to use your Railway backend URL:

```javascript
const API_BASE_URL =
  hostname === "localhost" ||
  hostname.startsWith("192.168.") ||
  hostname.startsWith("10.")
    ? `http://${hostname}:8000/api`
    : `https://your-app.up.railway.app/api`; // Your Railway URL
```

Or use environment variables (better approach - see below).

---

## 🔧 Using Environment Variables (Recommended)

### For Frontend (Vercel):

1. **Create `.env.production` file:**
   ```
   REACT_APP_API_URL=https://your-app.up.railway.app/api
   ```

2. **Update `src/api.js`:**
   ```javascript
   const API_BASE_URL = process.env.REACT_APP_API_URL || 
     (hostname === "localhost" || hostname.startsWith("192.168.") || hostname.startsWith("10.")
       ? `http://${hostname}:8000/api`
       : `https://api.dolexcdo.online/api`);
   ```

3. **Add to Vercel:**
   - Go to Project Settings → Environment Variables
   - Add: `REACT_APP_API_URL` = `https://your-app.up.railway.app/api`

---

## 🗄️ Free MySQL Database Alternatives

If Railway's MySQL doesn't work, use:

1. **db4free.net** - Free MySQL hosting
2. **FreeMySQLDatabase.com** - Free MySQL
3. **PlanetScale** - Free tier (MySQL compatible)

---

## 📝 Important Notes

### CORS Configuration
Make sure your Laravel backend allows requests from your Vercel domain:

In `config/cors.php`:
```php
'allowed_origins' => [
    'https://your-vercel-app.vercel.app',
    'https://your-custom-domain.com',
],
```

### File Storage
For file uploads (signatures, photos), use:
- **Cloudinary** (free tier)
- **AWS S3** (free tier for 12 months)
- **Railway volumes** (persistent storage)

### Pusher Configuration
Your app uses Pusher. Update Pusher credentials in Laravel `.env`:
```
PUSHER_APP_ID=your-app-id
PUSHER_APP_KEY=your-key
PUSHER_APP_SECRET=your-secret
PUSHER_APP_CLUSTER=your-cluster
```

---

## 🚀 Quick Start Checklist

- [ ] Build React app: `npm run build`
- [ ] Deploy frontend to Vercel
- [ ] Deploy backend to Railway
- [ ] Set up MySQL database
- [ ] Configure environment variables
- [ ] Update API URLs in frontend
- [ ] Configure CORS in Laravel
- [ ] Run migrations
- [ ] Test the application

---

## 💡 Tips for Free Hosting

1. **Railway sleeps after inactivity** - First request may be slow
2. **Use environment variables** - Easier to update URLs
3. **Monitor usage** - Stay within free tier limits
4. **Use CDN for static files** - Vercel handles this automatically
5. **Optimize images** - Reduce file sizes

---

## 🔗 Useful Links

- Vercel: https://vercel.com
- Railway: https://railway.app
- Render: https://render.com
- db4free: https://db4free.net
- PlanetScale: https://planetscale.com

---

## ⚠️ Limitations of Free Hosting

1. **Cold starts** - Backend may sleep, first request slow
2. **Resource limits** - Limited CPU/RAM
3. **Bandwidth limits** - May hit limits with high traffic
4. **No guaranteed uptime** - Free tiers have lower SLA
5. **Database size limits** - Usually 100MB-1GB free

For production with high traffic, consider upgrading to paid plans.
