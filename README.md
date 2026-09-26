# Ubutaka Mobile — Digital Land Ownership and Conflict Resolution

Ubutaka is the mobile application of the Digital Land Ownership and Conflict Resolution Management
System for Rwanda. Citizens register and verify their land, buy and sell parcels through a transparent,
notary-certified workflow, and report land disputes that are routed automatically to the Abunzi mediator
of their village. Notaries and Abunzi mediators have their own dashboards in the same app.

- **Server (REST API + NLA admin dashboard):** <https://github.com/gloirembonyi/land-management-v2-app>
- **Stack:** React Native 0.86 · Expo SDK 57 · React 19 · TypeScript · Zustand · Expo SecureStore,
  LocalAuthentication, Camera, Location, Print · react-native-maps · react-native-qrcode-svg

```
 Ubutaka mobile app  ──HTTPS / JSON, Authorization: Bearer <JWT>──▶  Ubutaka API (Next.js)  ──▶  PostgreSQL
```

---

## What the app does

| Role | Main screens | Capabilities |
|---|---|---|
| **Citizen** (`USER`) | Dashboard, My Parcels, Register Land, Parcel Detail, Certificate, Marketplace, Sell / Buy Land, Transactions, Disputes, Report Anomaly, Document Vault, Land Map, Offline Manager | Register a parcel by UPI (location, size, use, co-owners, heirs); receive a verified e-certificate with QR code; list land for sale or transfer it privately; follow each stage of a transfer; report disputes and anomalies (GPS + photo); keep documents; view parcels on the map; work offline |
| **Notary** (`NOTARY`) | Notary Dashboard | Review transfers waiting for certification and certify them; certify uploaded documents |
| **Abunzi mediator** (`ABUNZI`) | Abunzi Dashboard, Dispute Detail, Mediation Room | Receive disputes of their village, record statements, evidence, the family tree of heirs and decisions, move cases from Investigation to Mediation to Resolved |
| Everyone | Landing, Login / Sign-up, Profile, Profile Completion, Settings, Support, QR Scanner | Biometric login, profile completion (ID photo, signature, village), language RW / EN / FR, verify any certificate by scanning its QR code or typing a UPI |

### Land transfer workflow

`PENDING_SELLER_APPROVAL` (20 %) → `PENDING_PAYMENT` (40 %) → `PENDING_NOTARY` (60 %) →
`PENDING_SELLER` (80 %) → `COMPLETED` (100 %). The Transactions screen shows the next step for each party,
and every record belongs to a SHA-256 hash-chained ledger that can be re-verified from the app.

### Security on the device

- Session token stored with Zustand persistence and, for biometric login, in **Expo SecureStore**;
  the device fingerprint / Face ID unlocks it (`services/authService.ts`).
- `services/apiClient.ts` adds `Authorization: Bearer <token>` to every API request and signs the user out
  when the session expires.
- National ID numbers are checked against the 16-digit Rwandan ID structure before sign-up
  (`services/nidaValidation.ts`); the server validates them again.
- Co-owners and heirs are sent over HTTPS and encrypted at rest by the server (AES-256-GCM).
- Offline actions are queued and synchronised when connectivity returns (`services/SyncService.ts`).

---

## Running the app

### Prerequisites

- Node.js 20.19+ (22 LTS recommended)
- The Ubutaka API running (see the server repository) or the deployed API
- **Expo Go for SDK 57** on an Android or iOS phone on the same Wi-Fi network, or an Android emulator

### Steps

```bash
git clone https://github.com/gloirembonyi/Ubutaka-mobile.git
cd Ubutaka-mobile
npm install
cp .env.example .env        # then edit EXPO_PUBLIC_API_URL
npx expo start -c           # scan the QR code with Expo Go
```

`EXPO_PUBLIC_API_URL` values:

| Where the app runs | Value |
|---|---|
| Phone on the same Wi-Fi as the API | `http://<your-computer-IP>:3000/api` (find the IP with `ipconfig` / `ifconfig`) |
| Android emulator | `http://10.0.2.2:3000/api` |
| Deployed API | `https://ubutaka-admin.vercel.app/api` |

### Demo accounts

When the server was loaded with its demo data (`npm run test:e2e` in the server repository), you can log
in with password `Ubutaka@2026`:

| Role | Email |
|---|---|
| Citizen | `diane.uwase@example.rw` · `jc.habimana@example.rw` · `grace.ingabire@example.rw` |
| Notary | `notary.uwimana@example.rw` |
| Abunzi (Amahoro village) | `abunzi.nsengimana@example.rw` |

### Building an installable app

```bash
npm install -g eas-cli
eas build -p android --profile preview    # APK that uses https://ubutaka-admin.vercel.app/api
```

---

## Project structure

```
App.tsx               screen navigation (state-based), language switch, role-based dashboards
index.js              entry point; installs the authenticated fetch wrapper
config/api.ts         API base URL and endpoints
screens/              30+ screens (citizen, notary and Abunzi flows)
components/           header, bottom navigation and shared UI
services/             apiClient, authService, nidaValidation, SyncService
store/authStore.ts    persisted session
utils/geo.ts          parcel boundary helpers (GeoJSON ⇄ map coordinates)
styles/               colours and global styles
```

## Troubleshooting

| Problem | Fix |
|---|---|
| "Project is incompatible with this version of Expo Go" | Install Expo Go for SDK 57 |
| "Could not connect to server" | Check `EXPO_PUBLIC_API_URL` (use the computer's IP, not `localhost`), make sure the API is running, restart with `npx expo start -c` |
| Logged out unexpectedly | The session expired (7 days) — log in again; biometric login restores it |
| Map is empty | Parcels appear once they are registered with a location; allow location access when registering |
