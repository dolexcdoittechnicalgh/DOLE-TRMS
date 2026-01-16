# Environment Variables Configuration

## Frontend (React) - For Vercel Deployment

### Required Environment Variables

Add these in Vercel Dashboard → Project Settings → Environment Variables:

```
REACT_APP_API_URL=https://your-backend-url.up.railway.app/api
```

### How to Set in Vercel:

1. Go to your project on Vercel
2. Click **Settings** → **Environment Variables**
3. Add new variable:
   - **Name**: `REACT_APP_API_URL`
   - **Value**: `https://your-backend-url.up.railway.app/api`
   - **Environment**: Production (and Preview if needed)
4. Click **Save**
5. Redeploy your application

---

## Backend (Laravel) - For Railway Deployment

### Required Environment Variables

Add these in Railway Dashboard → Variables:

```
APP_ENV=production
APP_DEBUG=false
APP_KEY=base64:your-generated-key-here
APP_URL=https://your-backend-url.up.railway.app

DB_CONNECTION=mysql
DB_HOST=containers-us-west-xxx.railway.app
DB_PORT=3306
DB_DATABASE=railway
DB_USERNAME=root
DB_PASSWORD=your-password

PUSHER_APP_ID=your-pusher-id
PUSHER_APP_KEY=your-pusher-key
PUSHER_APP_SECRET=your-pusher-secret
PUSHER_APP_CLUSTER=your-cluster

BROADCAST_DRIVER=pusher
CACHE_DRIVER=file
QUEUE_CONNECTION=sync
SESSION_DRIVER=file
SESSION_LIFETIME=120
```

### How to Set in Railway:

1. Go to your Railway project
2. Click on your Laravel service
3. Go to **Variables** tab
4. Click **+ New Variable**
5. Add each variable one by one
6. Railway will automatically redeploy

### Generate APP_KEY:

If you need to generate a new APP_KEY:
```bash
php artisan key:generate --show
```

Copy the output and set it as `APP_KEY` in Railway.

---

## Local Development (.env file)

For local development, create a `.env` file in your project root:

```env
# Frontend (.env in React root)
REACT_APP_API_URL=http://localhost:8000/api

# Backend (.env in Laravel root)
APP_ENV=local
APP_DEBUG=true
APP_KEY=base64:your-local-key
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=your_local_db
DB_USERNAME=root
DB_PASSWORD=

# ... other Laravel variables
```

---

## Important Notes

1. **Environment Variable Naming:**
   - React: Must start with `REACT_APP_` to be accessible in the browser
   - Laravel: Standard `.env` format

2. **Security:**
   - Never commit `.env` files to Git
   - Use environment variables in hosting platforms
   - Keep sensitive keys secure

3. **After Changing Variables:**
   - Frontend: Redeploy on Vercel
   - Backend: Railway auto-redeploys when variables change

4. **Testing:**
   - Test API connection after setting variables
   - Check browser console for errors
   - Verify CORS is configured correctly
