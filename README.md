# TO-OB System (Travel Order & Official Business System)

A comprehensive web application for managing Travel Orders, Official Business requests, and Pass Slips. Built with React frontend and Laravel backend.

## 📋 Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [Troubleshooting](#troubleshooting)
- [Deployment](#deployment)

## ✨ Features

- **Travel Order Management**: Create, approve, and track travel orders
- **Official Business Requests**: Manage official business requests
- **Pass Slip System**: Handle pass slip requests
- **Real-time Notifications**: Live updates using Laravel Echo and Pusher
- **User Roles**: Admin, Evaluator, and Employee roles
- **PDF Generation**: Automatic PDF generation for documents
- **Calendar Integration**: View and manage requests on a calendar
- **Responsive Design**: Works on desktop and mobile devices

## 🔧 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **npm** (v6 or higher) - Comes with Node.js
- **Git** - [Download](https://git-scm.com/)
- **Laravel Backend** - The backend API should be running (see backend repository)

### Verify Installation

```bash
node --version    # Should show v14 or higher
npm --version     # Should show v6 or higher
git --version     # Should show any version
```

## 📦 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/dolexcdoittechnicalgh/DOLE-TRMS.git
cd TO-OB-system
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages listed in `package.json`.

**Note**: If you encounter errors during installation:
- Try deleting `node_modules` folder and `package-lock.json`
- Run `npm cache clean --force`
- Run `npm install` again

### 3. Environment Setup

Create a `.env` file in the root directory (optional for local development):

```env
REACT_APP_API_URL=http://localhost:8000/api
```

**Note**: The app will auto-detect `localhost` and use `http://localhost:8000/api` by default. You only need this file if you want to override the default behavior.

## 🚀 Running the Application

### Development Mode

Start the development server:

```bash
npm start
```

or

```bash
npm run dev
```

The application will open automatically in your browser at [http://localhost:3000](http://localhost:3000).

**Features in Development Mode:**
- Hot reloading (changes reflect immediately)
- Error overlay in browser
- Source maps for debugging

### Production Build

To create an optimized production build:

```bash
npm run build
```

This creates a `build` folder with optimized files ready for deployment.

### Running Tests

```bash
npm test
```

## 🌐 Environment Variables

### For Local Development

The app automatically detects if you're running on `localhost` and connects to `http://localhost:8000/api`.

### For Production/Deployment

Set the following environment variable:

- `REACT_APP_API_URL` - Your backend API URL (e.g., `https://api.dolexcdo.online/api`)

**Important**: 
- Environment variables must start with `REACT_APP_` to be accessible in the browser
- After changing environment variables, restart the development server
- For deployment platforms (Vercel, Netlify, etc.), set variables in their dashboard

See [ENV_VARIABLES.md](./ENV_VARIABLES.md) for detailed configuration.

## 📁 Project Structure

```
TO-OB-system/
├── public/                 # Static files
│   ├── index.html         # HTML template
│   └── assets/            # Images and static assets
├── src/
│   ├── components/        # Reusable components
│   ├── contexts/          # React contexts (state management)
│   ├── layouts/           # Layout components
│   ├── pages/             # Main page components
│   │   ├── Functions.js   # Main component functions
│   │   ├── Login.js       # Login page
│   │   ├── calendar.js    # Calendar view
│   │   └── ...
│   ├── utils/             # Utility functions
│   │   ├── apiConfig.js   # API configuration
│   │   ├── echo.js        # Laravel Echo setup
│   │   └── ...
│   ├── App.js             # Main App component
│   └── index.js           # Entry point
├── package.json           # Dependencies and scripts
└── README.md             # This file
```

## 📜 Available Scripts

### `npm start` or `npm run dev`
Runs the app in development mode at [http://localhost:3000](http://localhost:3000)

### `npm run build`
Builds the app for production to the `build` folder

### `npm test`
Launches the test runner in interactive watch mode

### `npm run eject`
**⚠️ Warning**: This is a one-way operation. Ejects from Create React App to expose all configuration files.

## 🔌 Backend Connection

This frontend requires a Laravel backend API to be running. 

### Default Backend URLs:
- **Local Development**: `http://localhost:8000/api`
- **Production**: `https://api.dolexcdo.online/api` (or your configured URL)

### Backend Requirements:
- Laravel API must be running
- CORS must be configured to allow requests from the frontend
- Authentication endpoints must be available
- Pusher credentials must be configured for real-time features

## 🐛 Troubleshooting

### Port Already in Use

If port 3000 is already in use:

```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9
```

Or set a different port:
```bash
PORT=3001 npm start
```

### Module Not Found Errors

```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### API Connection Issues

1. **Check if backend is running**: Ensure Laravel backend is running on port 8000
2. **Check CORS configuration**: Backend must allow requests from `http://localhost:3000`
3. **Check browser console**: Look for CORS or network errors
4. **Verify API URL**: Check `src/utils/apiConfig.js` for correct API endpoint

### Build Errors

```bash
# Clear cache and rebuild
npm cache clean --force
rm -rf node_modules build
npm install
npm run build
```

### Real-time Features Not Working

- Verify Pusher credentials are configured in backend
- Check `src/utils/echo.js` for correct Pusher configuration
- Ensure WebSocket connections are not blocked by firewall

## 🚢 Deployment

### Quick Deployment Options

1. **Vercel** (Recommended for React apps)
   - See [QUICK_START_FREE_HOSTING.md](./QUICK_START_FREE_HOSTING.md)

2. **Netlify**
   - Connect GitHub repository
   - Build command: `npm run build`
   - Publish directory: `build`

3. **Other Platforms**
   - See [FREE_HOSTING_GUIDE.md](./FREE_HOSTING_GUIDE.md)

### Deployment Checklist

- [ ] Set `REACT_APP_API_URL` environment variable
- [ ] Build the app: `npm run build`
- [ ] Test the production build locally
- [ ] Configure CORS on backend for production domain
- [ ] Update Pusher credentials if needed
- [ ] Test all features after deployment

See [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) for detailed deployment steps.

## 📚 Additional Documentation

- [Environment Variables Guide](./ENV_VARIABLES.md) - Detailed environment variable setup
- [Free Hosting Guide](./FREE_HOSTING_GUIDE.md) - Deploy for free
- [Quick Start Hosting](./QUICK_START_FREE_HOSTING.md) - Fast deployment guide
- [Deployment Checklist](./DEPLOYMENT_CHECKLIST.md) - Step-by-step deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is proprietary software for DOLE-XCDO.

## 🆘 Support

For issues and questions:
- Check the [Troubleshooting](#troubleshooting) section
- Review the documentation files in the repository
- Contact the development team

## 🎯 Quick Start Summary

```bash
# 1. Clone and install
git clone https://github.com/dolexcdoittechnicalgh/DOLE-TRMS.git
cd TO-OB-system
npm install

# 2. Start development server
npm start

# 3. Open browser
# App will open at http://localhost:3000
```

**Make sure your Laravel backend is running on port 8000!**

---

**Happy Coding! 🚀**
