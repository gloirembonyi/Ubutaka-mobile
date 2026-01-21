# 🚀 Ubutaka Mobile App - Connection Setup Guide

## 📱 Overview
This guide shows you how to connect your mobile app to the backend server and fix connection issues.

---

## ⚙️ Quick Setup Steps

### 1️⃣ **Find Your Computer's IP Address**

#### On Windows:
```bash
ipconfig
```
Look for **"IPv4 Address"** under your active network adapter (e.g., `192.168.1.69`)

#### On Mac/Linux:
```bash
ifconfig
# or
hostname -I
```

---

### 2️⃣ **Update Mobile App Configuration**

Edit the file: **`.env`** (in the root of `Ubutaka-mobile` folder)

```env
# Mobile App Environment Variables
# Update the API URL to match your backend server address

# For Android Emulator: use http://10.0.2.2:3000/api
# For iOS Simulator: use http://localhost:3000/api
# For Physical Device: use your computer's IP address

# Current configuration (update this based on your setup):
EXPO_PUBLIC_API_URL="http://192.168.1.69:3000/api"
```

**Replace `192.168.1.69` with YOUR computer's IP address!**

---

### 3️⃣ **Update Backend Configuration**

Edit the file: **`ubutaka-admin/.env`**

```env
# Backend Environment Variables
# Database connection string for PostgreSQL (Neon)

DATABASE_URL="postgresql://neondb_owner:npg_mxModG72jPUC@ep-steep-pine-ah5w4ufc-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

# Optional: API URL for the mobile app to connect to this backend
EXPO_PUBLIC_API_URL="http://192.168.1.69:3000/api"
```

**Replace `192.168.1.69` with YOUR computer's IP address!**

---

## 🔄 How to Restart After Changes

### Stop Both Servers:
Press `Ctrl+C` in both terminal windows

### Restart Backend:
```bash
cd c:\Users\gloire\Documents\Ubutaka-mobile\ubutaka-admin
npm run dev
```

### Restart Mobile App:
```bash
cd c:\Users\gloire\Documents\Ubutaka-mobile
npx expo start
```

**Important:** After changing `.env` files, you MUST restart both servers!

---

## 🎯 Different Environments

### 📱 Physical Device (Phone/Tablet)
```env
EXPO_PUBLIC_API_URL="http://192.168.1.69:3000/api"
```
✅ Use your computer's IP address
✅ Make sure phone and computer are on the SAME WiFi network

### 🤖 Android Emulator
```env
EXPO_PUBLIC_API_URL="http://10.0.2.2:3000/api"
```
✅ Android emulator uses special IP `10.0.2.2` to access localhost

### 🍎 iOS Simulator
```env
EXPO_PUBLIC_API_URL="http://localhost:3000/api"
```
✅ iOS simulator can use `localhost` directly

---

## 🔍 Troubleshooting

### ❌ "Network request failed" Error

**Checklist:**
1. ✅ Is the backend server running? (Check terminal for "Ready in X.Xs")
2. ✅ Did you update the IP address in `.env` file?
3. ✅ Did you restart BOTH servers after changing `.env`?
4. ✅ Are phone and computer on the same WiFi network?
5. ✅ Is your firewall blocking port 3000?

### 🔥 Firewall Issues (Windows)

If you see connection errors, allow Node.js through Windows Firewall:

1. Open **Windows Defender Firewall**
2. Click **"Allow an app through firewall"**
3. Find **Node.js** and check both **Private** and **Public**
4. Click **OK**

### 📡 Check Backend is Running

Your backend terminal should show:
```
✓ Ready in 2.3s
- Local:    http://localhost:3000
- Network:  http://192.168.1.69:3000
```

### 📱 Check Mobile App Logs

Your mobile terminal should show:
```
✅ API Base URL: http://192.168.1.69:3000/api
```

If you see:
```
⚠️ EXPO_PUBLIC_API_URL is not set in .env file!
```
Then your `.env` file is not being read properly.

---

## 🛠️ How to Fix in the Future

### When Your IP Address Changes:

1. **Find new IP address:**
   ```bash
   ipconfig  # Windows
   ifconfig  # Mac/Linux
   ```

2. **Update `.env` file:**
   ```env
   EXPO_PUBLIC_API_URL="http://YOUR_NEW_IP:3000/api"
   ```

3. **Restart both servers:**
   - Stop with `Ctrl+C`
   - Start backend: `npm run dev`
   - Start mobile: `npx expo start`

### When Switching Between Devices:

| Device Type | IP to Use |
|------------|-----------|
| Physical Phone | Your computer's IP (e.g., `192.168.1.69`) |
| Android Emulator | `10.0.2.2` |
| iOS Simulator | `localhost` |

---

## 📝 File Locations

```
Ubutaka-mobile/
├── .env                          ← Mobile app config (UPDATE THIS)
├── config/
│   └── api.ts                    ← API configuration (reads .env)
└── ubutaka-admin/
    └── .env                      ← Backend config (UPDATE THIS)
```

---

## ✅ Verification Steps

1. **Backend is running:**
   - Terminal shows: `✓ Ready in X.Xs`
   - Can open: `http://localhost:3000` in browser

2. **Mobile app connected:**
   - Terminal shows: `✅ API Base URL: http://...`
   - No "Network request failed" errors
   - App loads data successfully

3. **Both on same network:**
   - Computer IP: `192.168.1.69`
   - Phone WiFi: Same network as computer
   - Backend accessible at: `http://192.168.1.69:3000`

---

## 🆘 Still Having Issues?

1. Check both terminal windows for error messages
2. Verify `.env` files are in the correct locations
3. Make sure you restarted BOTH servers after changes
4. Try accessing `http://YOUR_IP:3000/api/users` in your phone's browser
5. Check Windows Firewall settings

---

## 📞 Quick Reference Commands

```bash
# Find IP Address
ipconfig                                    # Windows
ifconfig                                    # Mac/Linux

# Start Backend
cd ubutaka-admin
npm run dev

# Start Mobile App
npx expo start

# Restart Everything
Ctrl+C (stop both)
npm run dev (in ubutaka-admin)
npx expo start (in Ubutaka-mobile)
```

---

**Remember:** Every time you change the `.env` file, you MUST restart the servers! 🔄
