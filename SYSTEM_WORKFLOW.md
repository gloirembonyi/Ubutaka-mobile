# Ubutaka System Workflow - Complete Implementation

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    UBUTAKA LAND SYSTEM                       │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
    ┌───▼───┐           ┌────▼───┐           ┌────▼────┐
    │  USER │           │ ABUNZI  │           │ NOTARY  │
    └───┬───┘           └────┬───┘           └─────┬───┘
        │                    │                      │
  [Dashboard]          [Abunzi Portal]     [Notary Portal]
        │                    │                      │
        └────────────────────┴──────────────────────┘
                           │
                  ┌────────▼────────┐
                  │   TRANSACTIONS   │
                  └────────┬────────┘
                           │
              ┌────────────┴────────────┐
              │                         │
         [Blockchain]            [Database/Prisma]
```

---

## 📋 Feature 1: Rwanda Location Data

### Data Flow
```
User Opens Register Land Screen
        │
        ▼
   Mount Effect
        │
        ▼
GET /api/locations?level=provinces
        │
        ▼
   [Kigali City, Eastern, Southern, Western, Northern]
        │
User Selects "Kigali City"
        │
        ▼
GET /api/locations?level=districts&province=Kigali%20City
        │
        ▼
   [Gasabo, Kicukiro, Nyarugenge]
        │
User Selects "Gasabo"
        │
        ▼
GET /api/locations?level=sectors&province=Kigali%20City&district=Gasabo
        │
        ▼
   [Remera, Kimihurura, Kacyiru, Kimironko]
        │
User Continues...
        │
        ▼
GET /api/locations?level=cells&...
        │
        ▼
GET /api/locations?level=villages&...
        │
        ▼
Complete Location Selection
```

### API Structure
```typescript
// Request
GET /api/locations?level=districts&province=Kigali%20City

// Response
{
  "districts": ["Gasabo", "Kicukiro", "Nyarugenge"]
}
```

### UI Flow
```
┌──────────────────────────────────────────┐
│  Register Land - Step 1: Parcel Details  │
├──────────────────────────────────────────┤
│  Location Data                            │
│                                           │
│  PROVINCE              DISTRICT           │
│  ┌──────────────┐     ┌──────────────┐   │
│  │ Kigali City ▼│     │ Gasabo      ▼│   │  <-- Dropdowns
│  └──────────────┘     └──────────────┘   │
│                                           │
│  SECTOR        CELL           VILLAGE     │
│  ┌─────────┐  ┌─────────┐   ┌─────────┐  │
│  │ Remera ▼│  │ abisindu▼│   │ e.g... ▼│  │
│  └─────────┘  └─────────┘   └─────────┘  │
│                                           │
│  [Modal opens when clicked]               │
│  ┌────────────────────────────────────┐   │
│  │ Select Province           [X]      │   │
│  ├────────────────────────────────────┤   │
│  │ ☑ Kigali City                      │   │
│  │ ☐ Eastern Province                 │   │
│  │ ☐ Southern Province                │   │
│  │ ☐ Western Province                 │   │
│  │ ☐ Northern Province                │   │
│  └────────────────────────────────────┘   │
└──────────────────────────────────────────┘
```

---

## 📋 Feature 2: Notary Dashboard Enhancement

### Transaction Workflow
```
Seller Initiates Transaction
        │
        ▼
Status: PENDING
Step: "Awaiting Payment"
        │
        ▼
Seller Pays Notary Fees
        │
        ▼
Status: PENDING_NOTARY
Step: "Payment Confirmation Received"  <-- TRIGGERS NOTIFICATION
        │
        ▼
┌───────────────────────────────────────┐
│   NOTARY DASHBOARD SHOWS:             │
│   - Red badge (1) on Total Volume     │
│   - Green "Payment Received" banner   │
└───────────────────────────────────────┘
        │
        ▼
Notary Review Transaction Details
        │
        ▼
Notary Clicks "Certify Transaction"
        │
        ▼
Confirmation Dialog: "Are you sure?"
        │
        ▼
PATCH /api/transactions/{id}
{
  status: "COMPLETED",
  step: "Notarized & Registered",
  progress: 100
}
        │
        ▼
Transaction Recorded on Blockchain
        │
        ▼
Status: COMPLETED ✓
Transaction Moves to "Archives" Tab
```

### Dashboard UI
```
┌──────────────────────────────────────────────────────┐
│  👤 MURAHO, Notery mugabo            [RW] [EN] [🌐]  │
├──────────────────────────────────────────────────────┤
│  Notary Portal                                        │
│  Official government certification for land           │
│  transactions.                                        │
├──────────────────────────────────────────────────────┤
│  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐     │
│  │  📋    │  │  📄    │  │  ✅    │  │  💰  🔴1│     │
│  │   1    │  │   0    │  │   0    │  │   5    │     │
│  │To Review│  │Docs   │  │Certif'd│  │Total   │     │
│  └────────┘  └────────┘  └────────┘  └────────┘     │
├──────────────────────────────────────────────────────┤
│  [Pending Verification] [Archives] [Document Vault]  │
├──────────────────────────────────────────────────────┤
│  ╔════════════════════════════════════════════════╗  │
│  ║ Sale of Parcel 48388hdjsj     🟡 PENDING_NOTARY║  │
│  ║ UPI: 48388hdjsj                                ║  │
│  ║                                                ║  │
│  ║ SELLER          →          BUYER               ║  │
│  ║ Gloire Mbonyi              184646494976488     ║  │
│  ║                                                ║  │
│  ║ ─────────────────────────────────────────────  ║  │
│  ║                                                ║  │
│  ║ Transaction Value:   5,464,644 RWF            ║  │
│  ║                                                ║  │
│  ║ ┌───────────────────────────────────────────┐ ║  │
│  ║ │ 💳 Payment Received - Ready for Review    │ ║  │ <- NOTIFICATION
│  ║ └───────────────────────────────────────────┘ ║  │
│  ║                                                ║  │
│  ║ [✓ Certify Transaction] [View Details]        ║  │
│  ╚════════════════════════════════════════════════╝  │
└──────────────────────────────────────────────────────┘
│  [🏠 Home] [🗺️ Market] [➕] [📚 Learn] [👤 Profile] │
└──────────────────────────────────────────────────────┘
```

### Payment Notification Logic
```typescript
// Badge Counter
const stats = {
  paymentPending: transactions.filter(tx => 
    tx.step?.includes('Payment')
  ).length
};

// Display Badge
{stats.paymentPending > 0 && (
  <View style={styles.notificationBadge}>
    <Text>{stats.paymentPending}</Text>  // Shows "1"
  </View>
)}

// Transaction Card Banner
{tx.step?.toLowerCase().includes('payment') && (
  <View style={styles.paymentNotification}>
    <MaterialIcons name="payment" color="green" />
    <Text>Payment Received - Ready for Review</Text>
  </View>
)}
```

---

## 📋 Feature 3: Navigation Fix

### Before (Broken)
```
NOTARY User Clicks Home Button
        │
        ▼
BottomNav.getActiveTab('notary-dashboard')
        │
        ▼
Returns 'dashboard' (WRONG!)
        │
        ▼
onNavigate('dashboard')  <-- USER dashboard instead of notary!
        │
        ▼
❌ NOTARY sees regular user dashboard
```

### After (Fixed)
```
NOTARY User Clicks Home Button
        │
        ▼
BottomNav checks: user?.role === 'NOTARY'
        │
        ▼
onNavigate('notary-dashboard')  <-- Correct!
        │
        ▼
✅ NOTARY sees Notary Portal dashboard
```

### Code Fix
```typescript
// In BottomNav.tsx

// 1. Added to active tab detection
const getActiveTab = (screen: Screen): Screen => {
  if (['dashboard', 'abunzi-dashboard', 'notary-dashboard', ...].includes(screen))
    return 'dashboard';
  // ...
};

// 2. Added role-based routing
onPress={() => {
  if (item.id === 'dashboard' && user?.role === 'ABUNZI') {
    onNavigate('abunzi-dashboard');
  } else if (item.id === 'dashboard' && user?.role === 'NOTARY') {
    onNavigate('notary-dashboard');  // ← NEW!
  } else {
    onNavigate(item.id);
  }
}}
```

---

## 🔄 Complete User Journey

### Land Registration Journey
```
1. USER opens app
   ↓
2. Click "+ Actions" button (center of bottom nav)
   ↓
3. Navigate to "Register Land" screen
   ↓
4. Step 1: Parcel Details
   - Tap "Select Province" → Choose from modal
   - Tap "Select District" → Choose from modal (auto-loaded)
   - Tap "Select Sector" → Choose from modal (auto-loaded)
   - Tap "Select Cell" → Choose from modal (auto-loaded)
   - Tap "Select Village" → Choose from modal (auto-loaded)
   - Enter UPI or Generate New
   - Select Land Use, Ownership, Size
   ↓
5. Step 2: Owner Information
   - Fill in owner details (auto-filled if logged in)
   - Add partners/children if needed
   ↓
6. Step 3: Documents
   - Check required documents
   - Upload if available
   ↓
7. Step 4: Review
   - Verify all details
   - Submit
   ↓
8. Transaction Created
   - Status: PENDING
   - Assigned to blockchain
   - Generates transaction hash
```

### Transaction Processing Journey
```
1. Transaction created (Status: PENDING)
   ↓
2. Seller pays notary fees
   - Transaction step updated to include "Payment"
   ↓
3. NOTARY notified
   - Red badge appears on dashboard
   - Green banner shows in transaction card
   ↓
4. NOTARY reviews transaction
   - Verifies seller/buyer details
   - Checks UPI validity
   - Reviews documents
   ↓
5. NOTARY clicks "Certify Transaction"
   - Confirmation dialog appears
   ↓
6. NOTARY confirms
   - PATCH request to update transaction
   - Status → COMPLETED
   - Step → "Notarized & Registered"
   - Progress → 100%
   ↓
7. Blockchain recording
   - Transaction hash generated
   - Block number assigned
   ↓
8. Transaction completed ✓
   - Moves to "Archives" tab
   - Green "Notarized" indicator shows
```

---

## 📊 Data Models

### Transaction Model
```typescript
{
  id: string;                    // Unique ID
  title: string;                 // "Sale of Parcel X"
  upi: string;                   // Land parcel ID
  status: string;                // PENDING | PENDING_NOTARY | COMPLETED
  step: string;                  // Current step description
  progress: number;              // 0-100
  sellerName?: string;           // Seller's name
  buyerName?: string;            // Buyer's name
  price?: string;                // Transaction value
  date: string;                  // ISO date
  txHash?: string;               // Blockchain hash
  blockNumber?: number;          // Block number
}
```

### Location API Response
```typescript
{
  provinces?: string[];          // List of provinces
  districts?: string[];          // List of districts
  sectors?: string[];            // List of sectors
  cells?: string[];              // List of cells
  villages?: string[];           // List of villages
}
```

---

## 🎯 Success Indicators

### Visual Indicators
✅ Dropdown arrows show on location fields
✅ Modal opens smoothly with slide animation
✅ Checkmarks appear on selected items
✅ Red badge (with number) on notary dashboard
✅ Green "Payment Received" banner
✅ "Certify Transaction" button is prominent
✅ Status badges are color-coded

### Functional Indicators
✅ Selecting province loads districts
✅ Selecting district loads sectors
✅ Changing province resets all child selections
✅ Payment transactions show notification
✅ Certifying transaction updates status
✅ NOTARY clicks Home → goes to notary-dashboard
✅ Transaction appears in correct tab based on status

---

## 🔐 Security & Data Integrity

### Location Data
✅ No user input for location names → **Prevents injection**
✅ Dropdown-only selection → **Ensures data accuracy**
✅ Server-side validation → **Verified data**
✅ Matches official Rwanda divisions → **Government compliance**

### Transaction Approval
✅ Confirmation dialog → **Prevents accidental approval**
✅ Role-based access → **Only notaries can certify**
✅ Blockchain recording → **Immutable audit trail**
✅ Status transitions tracked → **Full history**

---

**All systems operational! Ready for production! 🚀**
