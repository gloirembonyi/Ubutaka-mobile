# Mobile App Connection Test

## Current Configuration ✅

Your mobile app is now configured to connect to:
**Backend URL**: `http://192.168.1.67:3000/api`

## Quick Test

To verify the connection is working, try these steps:

### 1. Reload the Mobile App
 
In the Expo terminal (where you ran `npx expo start`), press `r` to reload the app.


### 2. Test User Registration

On your mobile device:

1. Go to the **Sign Up** screen
2. Fill in the form:
   - **Full Name**: Test User
   - **Email**: test@example.com
   - **National ID**: 1 1990 8 0000000 0 01
   - **Password**: password123
   - **Account Type**: Select "Citizen"
3. Tap **Create Account**

If you see a "Success" message, the connection is working! ✅

### 3. Test Login

After creating an account:
1. Try logging in with the same credentials
2. You should be taken to the Dashboard


### 4. Test Land Registration

Once logged in:

1. Tap the **"+"** button in the bottom navigation
2. Or go to Dashboard → "Register Land"
3. Fill in the parcel details:
   - **UPI**: 5/03/12/04/999
   - **Size**: 2500
   - Leave other fields as default
4. Tap **Register Parcel**

## Troubleshooting

### Still seeing "Network request failed"?

1. **Restart the Expo app**:
   - In the Expo metro bundler terminal, press `Ctrl+C` to stop
   - Run `npx expo start` again
   - Reload the app on your device (shake device → "Reload")

2. **Check both devices are on same WiFi**:
   - Your computer: 192.168.1.67
   - Your phone should be on the same network

3. **Check firewall**:
   - Windows Firewall might be blocking port 3000
   - Try temporarily disabling it or adding an exception for Node.js

4. **Verify backend is running**:
   - Open browser: http://192.168.1.67:3000
   - You should see the admin dashboard

## Backend Status

Your backend is currently running at:
- Local: http://localhost:3000
- Network: **http://192.168.1.67:3000** ← Mobile app uses this

Available API endpoints:

- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Login
- `GET /api/users` - Get all users
- `POST /api/parcels` - Register land
- `GET /api/parcels` - Get all parcels
- `POST /api/transactions` - Create transaction

## What's Working Now ✅

1. ✅ Authentication (Sign Up / Login) with real database
2. ✅ User data stored in PostgreSQL
3. ✅ Land Registration saves to database
4. ✅ Sell Land creates transactions
5. ✅ Mobile app configured to connect to 192.168.1.67:3000

## Next Steps

Once you verify the connection works:

1. Create a few user accounts
2. Register some land parcels
3. Try listing a parcel for sale
4. Check the admin dashboard at http://192.168.1.67:3000/admin to see all the data

**Note**: The database schema is already set up in the cloud (Neon PostgreSQL), so you don't need to run migrations. The backend is currently connected and working!
