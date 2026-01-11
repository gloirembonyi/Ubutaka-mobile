# Ubutaka Mobile App - Setup Guide

## Overview

This guide will help you configure and run both the mobile app and backend server for development.

## Prerequisites

- Node.js and npm installed
- Expo CLI installed (`npm install -g expo-cli`)
- Android Studio (for Android emulator) or Xcode (for iOS simulator)
- The backend Next.js server running

## Backend Setup (ubutaka-admin)

### 1. Create Environment File

Create a `.env` file in the `ubutaka-admin` directory:

```env
DATABASE_URL="postgresql://neondb_owner:npg_mxModG72jPUC@ep-steep-pine-ah5w4ufc-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
```

### 2. Run Database Migrations

```bash
cd ubutaka-admin
npx prisma generate
npx prisma db push
```

### 3. Start the Backend Server

```bash
npm run dev
```


The backend should now be running at `http://localhost:3000`

## Mobile App Setup

### 1. Configure API URL

The mobile app needs to know where your backend server is running. This depends on your testing environment:

#### Option A: Android Emulator

The Android emulator uses `10.0.2.2` to access your computer's localhost.

Edit `config/api.ts` (line 16):

```typescript
return 'http://10.0.2.2:3000/api';
```

#### Option B: iOS Simulator

The iOS simulator can use localhost directly:
 
```typescript
return 'http://localhost:3000/api';
```

#### Option C: Physical Device

If testing on a physical device, use your computer's local IP address:

1. **Windows**: Run `ipconfig` in Command Prompt
2. **Mac/Linux**: Run `ifconfig` or `hostname -I` in Terminal
3. Look for your IPv4 Address (e.g., `192.168.1.100`)

Then update `config/api.ts`:

```typescript
return 'http://192.168.1.100:3000/api';
```

**Important**: Make sure your phone and computer are on the same WiFi network!

### 2. Start the Mobile App

```bash
npx expo start
```

Then:
- Scan QR code with Expo Go app for physical device

### Features Now Available

### ✅ User Authentication

- **Sign Up**: Create a new account with email, password, and national ID
- **Login**: Access your account with email and password
- **Persistent Sessions**: Stay logged in across app restarts
- All user data is stored securely in the PostgreSQL database

### ✅ Land Registration

- Register new land parcels with UPI, location, size, and land use
- Parcels are saved to the database and linked to your account
- View your registered parcels in the app

### ✅ Sell Land

- List your registered parcels for sale
- Set asking price in RWF
- Creates a transaction record in the database
- Only parcels you own appear in the selling interface

### ✅ Buy Land (Marketplace)

- View all parcels listed for sale
- Filter by district, land use, and price range
- See parcel details and owner information

## Troubleshooting

### "Network request failed" Error

This means the mobile app can't reach the backend server. Check:

1. **Is the backend running?** Make sure `npm run dev` is running in the `ubutaka-admin` folder
2. **Is the API URL correct?** Check `config/api.ts` and update with the correct IP/URL
3. **Firewall issues?** Make sure your firewall allows connections on port 3000
4. **Same network?** If using a physical device, ensure it's on the same WiFi as your computer

### Database Connection Issues

If Prisma can't connect to the database:

1. **Check the DATABASE_URL** in `.env` file
2. **Run migrations**: `npx prisma db push`
3. **Generate Prisma client**: `npx prisma generate`

### Backend Dependencies

If you see "Cannot find module" errors:

```bash
cd ubutaka-admin
npm install
```

## API Endpoints

The backend provides these endpoints:

- `POST /api/auth/register` - Create new user account
- `POST /api/auth/login` - Login with email/password
- `GET /api/users` - Get all users
- `POST /api/users` - Create user (admin)
- `GET /api/parcels` - Get all registered parcels
- `POST /api/parcels` - Register a new parcel
- `GET /api/transactions` - Get all transactions
- `POST /api/transactions` - Create a transaction

## Next Steps

1. **Test User Registration**: Create an account on the mobile app
2. **Register a Parcel**: Add your first land parcel
3. **List for Sale**: Try selling a parcel
4. **Test Authentication**: Logout and login again to verify persistence

## Need Help?

- Check the terminal running `npx expo start` for mobile app errors
- Check the terminal running `npm run dev` for backend errors
- Review the API configuration in `config/api.ts`
- Make sure both backend and mobile servers are running simultaneously
