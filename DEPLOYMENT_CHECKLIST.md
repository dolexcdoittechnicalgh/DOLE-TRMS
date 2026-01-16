# Deployment Checklist

## Pre-Deployment

### Frontend (React)
- [ ] Run `npm run build` successfully
- [ ] Test build locally
- [ ] Update API URLs in code or use environment variables
- [ ] Check all environment variables are set
- [ ] Verify images and assets load correctly

### Backend (Laravel)
- [ ] Set `APP_ENV=production` in `.env`
- [ ] Set `APP_DEBUG=false` in `.env`
- [ ] Generate app key: `php artisan key:generate`
- [ ] Run migrations: `php artisan migrate`
- [ ] Clear caches: `php artisan config:clear && php artisan cache:clear`
- [ ] Test API endpoints
- [ ] Configure CORS for frontend domain
- [ ] Set up file storage (if using uploads)
- [ ] Configure Pusher credentials

### Database
- [ ] Export local database (if needed)
- [ ] Create production database
- [ ] Import schema and data
- [ ] Test database connections

---

## Deployment Steps

### 1. Deploy Frontend to Vercel
- [ ] Create Vercel account
- [ ] Connect GitHub repository
- [ ] Configure build settings:
  - Build Command: `npm run build`
  - Output Directory: `build`
- [ ] Add environment variables
- [ ] Deploy
- [ ] Test deployed frontend
- [ ] Configure custom domain (optional)

### 2. Deploy Backend to Railway
- [ ] Create Railway account
- [ ] Create new project
- [ ] Connect GitHub repository (Laravel backend)
- [ ] Add MySQL service
- [ ] Set environment variables:
  - `APP_ENV=production`
  - `APP_DEBUG=false`
  - `APP_KEY=...`
  - `DB_HOST=...`
  - `DB_DATABASE=...`
  - `DB_USERNAME=...`
  - `DB_PASSWORD=...`
  - `PUSHER_APP_ID=...`
  - `PUSHER_APP_KEY=...`
  - `PUSHER_APP_SECRET=...`
  - `PUSHER_APP_CLUSTER=...`
- [ ] Deploy
- [ ] Run migrations: `php artisan migrate --force`
- [ ] Get backend URL
- [ ] Test API endpoints

### 3. Update Frontend Configuration
- [ ] Update API URL in frontend code or environment variables
- [ ] Redeploy frontend
- [ ] Test frontend-backend connection

### 4. Configure CORS
- [ ] Update `config/cors.php` in Laravel
- [ ] Add frontend domain to allowed origins
- [ ] Redeploy backend

---

## Post-Deployment Testing

- [ ] Test user login
- [ ] Test API endpoints
- [ ] Test file uploads (if applicable)
- [ ] Test real-time features (Pusher)
- [ ] Test on mobile devices
- [ ] Check console for errors
- [ ] Verify SSL certificates
- [ ] Test performance

---

## Monitoring

- [ ] Set up error logging
- [ ] Monitor Railway usage (stay within free tier)
- [ ] Monitor Vercel bandwidth
- [ ] Set up uptime monitoring (optional)
- [ ] Check database size

---

## Backup

- [ ] Set up database backups
- [ ] Backup uploaded files
- [ ] Document deployment process

---

## Troubleshooting

### Common Issues:

1. **CORS Errors**
   - Check `config/cors.php`
   - Verify frontend URL is in allowed origins

2. **API Not Found**
   - Check API URL in frontend
   - Verify backend is deployed and running
   - Check Railway logs

3. **Database Connection Failed**
   - Verify database credentials
   - Check database is running
   - Verify network access

4. **File Upload Issues**
   - Check file storage configuration
   - Verify write permissions
   - Check file size limits

5. **Slow Performance**
   - Backend may be sleeping (Railway free tier)
   - First request after sleep is slow (normal)
   - Consider upgrading if needed

---

## Rollback Plan

- [ ] Document current version
- [ ] Keep previous deployment accessible
- [ ] Know how to revert changes
- [ ] Test rollback procedure
