# 🚀 Ubutaka Mobile - Installation Guide

This guide will help you set up the Ubutaka Land Registration System on a new computer. The project consists of two applications:
- **Mobile App** (React Native/Expo) - For landowners and applicants
- **Admin Panel** (Next.js) - For administrators and notaries

## 📋 Prerequisites

Before you begin, make sure you have the following installed on your computer:

### Required Software

1. **Node.js** (v18 or higher)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version`

2. **pnpm** (Package Manager)
   - Install globally: `npm install -g pnpm`
   - Verify installation: `pnpm --version`

3. **Git** (to clone the repository)
   - Download from: https://git-scm.com/
   - Verify installation: `git --version`

4. **Expo Go App** (for testing mobile app on your phone)
   - Download from App Store (iOS) or Google Play Store (Android)

### Optional (for advanced development)

- **Android Studio** (for Android emulator)
- **Xcode** (for iOS simulator - macOS only)

---

## 🔽 Step 1: Clone the Repository

Open your terminal/command prompt and run:

```bash
git clone https://github.com/gloirembonyi/Ubutaka-mobile.git
cd Ubutaka-mobile
```

---

## ⚙️ Step 2: Install Dependencies

### Install Root Project Dependencies (Mobile App)

In the root directory of the project (`Ubutaka-mobile`):

```bash
npm install
```

This will install all the required packages for the mobile application.

### Install Admin Panel Dependencies

Navigate to the admin panel and install its dependencies:

```bash
cd ubutaka-admin
pnpm install
cd ..
```

> **Note:** We use `pnpm` for the admin panel and `npm` for the mobile app.

---

## 🔐 Step 3: Configure Environment Variables

### Mobile App Environment Setup

1. Create a `.env` file in the root directory:

```bash
# For Windows
type nul > .env

# For macOS/Linux
touch .env
```

2. Open `.env` and add the following configuration:

```env
# Mobile App API Endpoint
# Replace with your local IP address or production URL
EXPO_PUBLIC_API_URL=http://YOUR_LOCAL_IP:3000/api
```

> **How to find your local IP:**
> - **Windows:** Open CMD and run `ipconfig`, look for "IPv4 Address"
> - **macOS/Linux:** Run `ifconfig` or `ip addr`
> - **Example:** `EXPO_PUBLIC_API_URL=http://192.168.1.100:3000/api`

### Admin Panel Environment Setup

1. Navigate to the admin panel directory and create a `.env` file:

```bash
cd ubutaka-admin
# For Windows
type nul > .env

# For macOS/Linux
touch .env
```

2. Open `ubutaka-admin/.env` and add the following:

```env
# PostgreSQL Database Connection URL
# You can use Neon.tech, Supabase, or your own PostgreSQL instance
DATABASE_URL="postgresql://USERNAME:PASSWORD@HOST:PORT/DATABASE?sslmode=require"

# API URL for the mobile app to connect
# Replace with your local IP address
EXPO_PUBLIC_API_URL="http://YOUR_LOCAL_IP:3000/api"
```

> **Getting a Database URL:**
> 
> **Option 1: Neon.tech (Recommended for beginners)**
> 1. Sign up at https://neon.tech
> 2. Create a new project
> 3. Copy the connection string and paste it as `DATABASE_URL`
>
> **Option 2: Supabase**
> 1. Sign up at https://supabase.com
> 2. Create a new project
> 3. Go to Settings → Database → Connection String → Connection Pooling
> 4. Copy the connection string and paste it as `DATABASE_URL`
>
> **Option 3: Local PostgreSQL**
> 1. Install PostgreSQL on your computer
> 2. Create a new database
> 3. Format: `postgresql://postgres:YOUR_PASSWORD@localhost:5432/ubutaka`

---

## 🗄️ Step 4: Set Up the Database

Navigate to the admin panel directory:

```bash
cd ubutaka-admin
```

### Generate Prisma Client

```bash
pnpm exec prisma generate
```

### Run Database Migrations

This will create all necessary tables in your database:

```bash
pnpm exec prisma db push
```

### Seed the Database (Optional but Recommended)

This will populate your database with sample data including admin users:

```bash
pnpm exec prisma db seed
```

**Default Admin Credentials:**
- **Email:** `admin@ubutaka.gov.rw`
- **Password:** `admin123`

> ⚠️ **Important:** Change these credentials in production!

Return to the root directory:

```bash
cd ..
```

---

## 🚀 Step 5: Run the Applications

You need to run both applications simultaneously in separate terminal windows.

### Terminal 1: Start the Admin Panel (Backend + Web UI)

Open a terminal in the project root and run:

```bash
cd ubutaka-admin
pnpm dev
```

The admin panel will be available at: **http://localhost:3000**

### Terminal 2: Start the Mobile App

Open a **new terminal** in the project root and run:

```bash
npm start
# or
npx expo start -c
```

You'll see a QR code in the terminal.

---

## 📱 Step 6: Test the Mobile App

### Option 1: Use Your Physical Phone (Recommended)

1. Install **Expo Go** app on your phone:
   - iOS: https://apps.apple.com/app/expo-go/id982107779
   - Android: https://play.google.com/store/apps/details?id=host.exp.exponent

2. **Make sure your phone and computer are on the same WiFi network**

3. Scan the QR code:
   - **iOS:** Open the Camera app and scan the QR code
   - **Android:** Open the Expo Go app and tap "Scan QR Code"

### Option 2: Use an Emulator

**For Android:**
```bash
npm run android
```

**For iOS (macOS only):**
```bash
npm run ios
```

---

## ✅ Verify Everything is Working

### Test Admin Panel
1. Open http://localhost:3000 in your browser
2. Login with the default credentials:
   - Email: `admin@ubutaka.gov.rw`
   - Password: `admin123`

### Test Mobile App
1. Open the app on your phone/emulator
2. Try logging in or registering a new user
3. Test basic functionality like viewing land parcels

---

## 🛠️ Common Issues & Solutions

### Issue 1: "Cannot connect to database"
**Solution:** 
- Verify your `DATABASE_URL` is correct
- Make sure your database service (Neon/Supabase) is running
- Run `pnpm exec prisma db push` again

### Issue 2: "Network request failed" on mobile app
**Solution:**
- Make sure your phone and computer are on the same WiFi
- Check that `EXPO_PUBLIC_API_URL` uses your correct local IP address
- Try disabling firewall temporarily
- Restart the admin panel server

### Issue 3: "Module not found" errors
**Solution:**
- Delete `node_modules` folders: `rm -rf node_modules ubutaka-admin/node_modules`
- Clear package manager caches: `npm cache clean --force` and `pnpm store prune`
- Reinstall dependencies: `npm install` and `cd ubutaka-admin && pnpm install`

### Issue 4: Port 3000 already in use
**Solution:**
- Kill the process using port 3000
- Or change the port in `ubutaka-admin/package.json`: `"dev": "next dev -p 3001"`

### Issue 5: Prisma client errors
**Solution:**
```bash
cd ubutaka-admin
pnpm exec prisma generate
pnpm exec prisma db push
```

---

## 📂 Project Structure

```
Ubutaka-mobile/
├── .env                          # Mobile app environment variables
├── App.tsx                       # Main mobile app entry point
├── package.json                  # Mobile app dependencies
├── components/                   # Reusable mobile components
├── screens/                      # Mobile app screens
├── services/                     # API services
├── types/                        # TypeScript type definitions
└── ubutaka-admin/               # Admin panel (Next.js)
    ├── .env                      # Admin panel environment variables
    ├── package.json              # Admin panel dependencies
    ├── prisma/                   # Database schema and migrations
    │   ├── schema.prisma         # Database models
    │   └── seed.js               # Database seeding
    └── src/                      # Next.js app source code
        ├── app/                  # App routes and pages
        ├── components/           # React components
        └── lib/                  # Utility functions
```

---

## 🔄 Development Workflow

### Making Changes

1. **Mobile App Changes:**
   - Edit files in `screens/`, `components/`, etc.
   - The app will auto-reload using Expo's hot reloading

2. **Admin Panel Changes:**
   - Edit files in `ubutaka-admin/src/`
   - Next.js will auto-reload the browser

3. **Database Changes:**
   ```bash
   cd ubutaka-admin
   # Edit prisma/schema.prisma
   pnpm exec prisma db push
   pnpm exec prisma generate
   ```

### Useful Commands

```bash
# Mobile App
npm start              # Start Expo development server
npm run android        # Run on Android emulator
npm run ios            # Run on iOS simulator

# Admin Panel (run from ubutaka-admin directory)
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm start            # Start production server
pnpm exec prisma studio  # Open Prisma database GUI
```

---

## 🚀 Production Deployment

### Mobile App
- Build with EAS: https://docs.expo.dev/build/introduction/
- Submit to App Store/Play Store

### Admin Panel
- Deploy to Vercel, Netlify, or any Node.js hosting
- Make sure to set environment variables on your hosting platform

---

## 📚 Additional Resources

- **Expo Documentation:** https://docs.expo.dev/
- **Next.js Documentation:** https://nextjs.org/docs
- **Prisma Documentation:** https://www.prisma.io/docs
- **React Native Documentation:** https://reactnative.dev/

---

## 🆘 Getting Help

If you encounter any issues:
1. Check the console/terminal for error messages
2. Review this guide's troubleshooting section
3. Check the project's GitHub Issues
4. Reach out to the development team

---

## 📝 Notes

- **Security:** Remember to change default credentials in production
- **Database:** Keep your `DATABASE_URL` secure and never commit it to git
- **Network:** For mobile testing, ensure firewall allows connections on port 3000
- **Development:** Both servers must be running for the system to work properly

---

**Happy Coding! 🎉**
