# Ubutaka — Digital Land Ownership and Conflict Resolution Management System

Ubutaka is a mobile and web platform for managing land ownership in Rwanda. Citizens register and verify
parcels, buy and sell land through a transparent multi-step workflow certified by a notary, and report
land disputes that are routed automatically to the Abunzi mediator of their village. Officers of the
National Land Authority (NLA) verify parcels and supervise everything from a web dashboard.

The repository contains two applications that work together:

| Folder | Application | Technology |
|---|---|---|
| `/` (root) | **Mobile app** for citizens, notaries and Abunzi mediators | React Native 0.86 · Expo SDK 57 · TypeScript · Zustand |
| `/ubutaka-admin` | **NLA admin dashboard + REST API** used by the mobile app | Next.js 16 · React 19 · Prisma 6 · PostgreSQL · Tailwind 4 |

---

## 1. How the system works

```
 ┌────────────────────────┐      HTTPS / JSON + JWT      ┌──────────────────────────────┐
 │  Ubutaka mobile app     │ ───────────────────────────▶ │  ubutaka-admin (Next.js)      │
 │  Citizen · Notary ·     │                              │  • REST API  /api/*           │
 │  Abunzi dashboards      │ ◀─────────────────────────── │  • Admin dashboard  /admin    │
 └────────────────────────┘                              └───────────────┬──────────────┘
                                                                          │ Prisma ORM
                                                                 ┌────────▼────────┐
                                                                 │   PostgreSQL     │
                                                                 └─────────────────┘
```

### User roles

| Role | Where | What they do |
|---|---|---|
| `USER` (citizen) | Mobile | Register parcels by UPI (with co-owners and heirs), view e-certificate + QR code, sell/buy land, report disputes and anomalies (GPS + photo), keep documents in a vault, work offline |
| `NOTARY` | Mobile | Certify land transfers that reach the notary step; certify uploaded documents |
| `ABUNZI` | Mobile | Receive disputes from their own village, run the mediation room, record statements, evidence, family tree and decisions, resolve cases |
| `ADMIN` (NLA officer) | Web `/admin` | Verify parcels (issues certificate number), manage users and roles, monitor transactions, disputes and anomaly reports |

### Main workflows

**Parcel registration and verification**

`Pending Verification` → (NLA admin verifies) → `Verified` + certificate `CERT-<year>-<nnnn>` + QR code.
The QR code carries the UPI, certificate number and a SHA-256 fingerprint of the registry record; the
scanner checks it against `GET /api/verify`, so an old certificate stops verifying after the land is sold.

**Land transfer (five stages)**

| Status | Progress | Who acts |
|---|---|---|
| `PENDING_SELLER_APPROVAL` | 20 % | Buyer made an offer; seller approves or rejects |
| `PENDING_PAYMENT` | 40 % | Buyer pays the transfer fees |
| `PENDING_NOTARY` | 60 % | Notary certifies (only the `NOTARY` role can) |
| `PENDING_SELLER` | 80 % | Seller gives the final signature |
| `COMPLETED` | 100 % | Owner updated, ownership history appended |

The server enforces the order (a step cannot be skipped). Every transaction is written to a
**tamper-evident ledger**: each record stores the SHA-256 hash of the previous record of the same parcel,
and `GET /api/verify?upi=…` re-checks the whole chain.

**Dispute resolution**

A citizen reports a dispute → the API assigns a verified Abunzi of the same village (then cell, then sector) →
`Investigation` → `Mediation` → `Resolved`. Statements, evidence, the family tree of heirs and decisions are
stored with the case and visible to the NLA in `/admin/disputes/<id>`.

### Security

| Concern | Implementation |
|---|---|
| Passwords | bcrypt (cost 10); legacy plain-text passwords are upgraded on first login |
| Mobile sessions | JWT (7 days) sent as `Authorization: Bearer` by a global fetch wrapper (`services/apiClient.ts`) |
| Biometric login | Device fingerprint / Face ID unlocks the token kept in Expo SecureStore |
| Admin sessions | HTTP-only cookie (8 h); `/admin/*` is protected in `src/proxy.ts` |
| Authorisation | Every API route checks the session and role (`src/lib/auth.ts` → `requireAuth`) |
| Sensitive data | Co-owners and heirs encrypted at rest with AES-256-GCM (`src/lib/encryption.ts`) |
| National ID | 16-digit Rwandan ID structure validated on the phone and on the server (`src/lib/nida.ts`) |
| Integrity | SHA-256 hash chain for transactions (`src/lib/ledger.ts`), SHA-256 certificate fingerprint |

---

## 2. Project structure

```
Ubutaka-mobile/
├── App.tsx                  # screen navigation (state-based) and language switch (RW / EN / FR)
├── index.js                 # entry point; installs the authenticated fetch wrapper
├── config/api.ts            # API base URL and endpoint list
├── screens/                 # 30+ screens (Dashboard, RegisterLand, Marketplace, Transaction, Notary, Abunzi, ...)
├── services/                # apiClient, authService, nidaValidation, SyncService (offline queue)
├── store/authStore.ts       # persisted session (Zustand + AsyncStorage)
├── utils/geo.ts             # parcel boundary helpers (GeoJSON)
└── ubutaka-admin/
    ├── prisma/schema.prisma # User, Parcel, Transaction, Dispute, AnomalyReport, LandDocument
    ├── scripts/e2e-test.cjs # end-to-end API test that also loads demo data (42 test cases)
    └── src/
        ├── app/api/...      # REST API route handlers
        ├── app/admin/...    # dashboard pages (users, parcels, transactions, disputes, anomalies, settings)
        ├── app/actions/     # server actions used by the dashboard
        ├── lib/             # auth, encryption, ledger, nida, parcels, users
        └── proxy.ts         # CORS for /api and protection of /admin
```

---

## 3. Running the project

### Prerequisites

- Node.js 20.19+ (22 LTS recommended) and npm
- A PostgreSQL database (local PostgreSQL, or a free Neon / Supabase database)
- For the mobile app: the **Expo Go** app (SDK 57) on an Android/iOS phone on the same Wi-Fi network,
  or an Android emulator

### Step 1 — install dependencies

```bash
git clone https://github.com/gloirembonyi/Ubutaka-mobile.git
cd Ubutaka-mobile
npm install                    # installs the mobile app and the ubutaka-admin workspace
```

### Step 2 — configure and start the API + admin dashboard

Create `ubutaka-admin/.env`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE"
JWT_SECRET="a-long-random-string"          # required in production
ENCRYPTION_KEY="another-long-random-string" # required in production (encrypts co-owners / heirs)
```

Create the tables and start the server:

```bash
cd ubutaka-admin
npx prisma generate
npx prisma db push            # creates the tables from prisma/schema.prisma
npm run dev                   # http://localhost:3000  (dashboard at /admin, API at /api)
```

Production build: `npm run build && npm start`.

**First administrator.** Administrators cannot self-register. Create one once, for example with
`node prisma/seed.js` (creates `admin@ubutaka.gov.rw`; its password is hashed automatically at first
login), or insert a user with `role = 'ADMIN'` in the database.

### Step 3 — configure and start the mobile app

Create `.env` in the project root and point it at the API:

```env
# phone on the same Wi-Fi: use your computer's IP address (ipconfig / ifconfig)
EXPO_PUBLIC_API_URL=http://192.168.1.20:3000/api
# Android emulator: http://10.0.2.2:3000/api
# deployed API:     https://ubutaka-admin.vercel.app/api
```

```bash
cd ..                         # back to the project root
npx expo start -c             # scan the QR code with Expo Go (SDK 57)
```

### Step 4 — load demo data and run the end-to-end test (optional)

On a **throw-away** database only (the script deletes all rows first):

```bash
cd ubutaka-admin
DEMO_DATABASE_URL="postgresql://..." API_URL="http://localhost:3000/api" ALLOW_DEMO_RESET=yes node scripts/e2e-test.cjs
```

It registers citizens, a notary and two Abunzi mediators, registers and verifies 8 parcels in Kigali,
runs a complete sale, disputes, anomaly reports and document certification, and checks 42 rules
(authentication, permissions, encryption, ledger tamper detection, workflow order). Expected output:
`42/42 test cases passed`.

Demo accounts created by the script (password `Ubutaka@2026`, admin `Admin@2026`):

| Role | Email |
|---|---|
| Admin (web) | `admin@ubutaka.gov.rw` |
| Citizen | `diane.uwase@example.rw`, `jc.habimana@example.rw`, `grace.ingabire@example.rw` |
| Notary | `notary.uwimana@example.rw` |
| Abunzi | `abunzi.nsengimana@example.rw` (Amahoro village) |

---

## 4. API reference (summary)

| Method & path | Access | Purpose |
|---|---|---|
| `POST /api/auth/register` | public | Create account (USER / NOTARY / ABUNZI) — validates national ID |
| `POST /api/auth/login` | public | Email + password, or `biometricToken`; returns JWT |
| `GET/POST /api/parcels`, `GET/PATCH /api/parcels/{upi}` | signed in | Register / list / update parcels; verification is ADMIN-only |
| `GET/POST /api/transactions`, `PATCH/DELETE /api/transactions/{id}` | signed in | Transfer workflow (ordered statuses, notary step NOTARY-only) |
| `GET /api/verify?upi=&certId=&hash=` | public | Certificate authenticity + ledger integrity + open disputes |
| `GET/POST /api/disputes`, `GET/PATCH /api/disputes/{id}` | signed in | Disputes; auto-assignment to village Abunzi |
| `GET/POST /api/anomalies`, `PATCH /api/anomalies/{id}` | signed in / ADMIN | Anomaly reports with GPS and photo |
| `GET/POST /api/documents`, `PATCH /api/documents/{id}` | signed in / NOTARY | Document vault and certification |
| `GET /api/users`, `GET/PATCH /api/users/{id}` | signed in | Users (never returns password hashes); profile completion |
| `GET /api/locations` | public | Province → district → sector → cell → village lists |

---

## 5. Deployment

- **API + dashboard:** Vercel (root directory `ubutaka-admin`). Set `DATABASE_URL`, `JWT_SECRET` and
  `ENCRYPTION_KEY` in the Vercel project settings.
- **Mobile app:** Expo Application Services — `eas build -p android --profile preview` produces an APK that
  uses `https://ubutaka-admin.vercel.app/api` (see `eas.json`).

## 6. Troubleshooting

| Problem | Fix |
|---|---|
| Expo Go says "Project is incompatible with this version of Expo Go" | Install Expo Go for SDK 57 (the project uses Expo SDK 57) |
| Mobile app shows "Could not connect to server" | `EXPO_PUBLIC_API_URL` must use your computer's IP (not `localhost`) and the API must be running; restart with `npx expo start -c` |
| `Authentication required` (401) from the API | Log in again — the session token expired |
| `Failed to load SWC binary` when starting Next.js | Reinstall dependencies: delete `node_modules` and run `npm install` |
| Admin login fails | Use an account with role `ADMIN`; administrators cannot self-register |
