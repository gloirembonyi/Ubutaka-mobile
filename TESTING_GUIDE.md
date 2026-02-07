# Quick Testing Guide - Land Transaction Workflow

## 🎯 Prerequisites

You need 3 test users (or use 2 users + admin panel):
1. **Test Seller** - Role: USER with verified land
2. **Test Buyer** - Role: USER 
3. **Test Notary** - Role: NOTARY

## 📱 Step-by-Step Testing

### ✅ STEP 1: Seller Lists Land
**User:** Seller
1. Login as seller
2. Navigate to **"My Parcels"** tab
3. Find a verified parcel
4. Click **"Sell"** button (green button on parcel card)
5. Choose **"List on Marketplace"**
6. Enter price (e.g., "15,000,000")
7. Click **"Continue"** → **"List Land"**

**Expected Result:**
- ✓ Alert: "Listed! Your parcel is now listed on the Marketplace"
- ✓ Parcel appears in Marketplace with price tag
- ✓ Parcel shows "For Sale" status in My Parcels

---

### ✅ STEP 2: Buyer Sends Offer
**User:** Buyer
1. Login as buyer (different user)
2. Navigate to **"Marketplace"** tab
3. Find the listed land parcel
4. Click on the parcel card
5. Click **"Confirm Purchase Offer"**

**Expected Result:**
- ✓ Alert: "Your purchase offer has been sent to the seller..."
- ✓ Transaction created with status `PENDING_SELLER_APPROVAL`
- ✓ In **Transactions** screen, see orange "Awaiting Seller Approval" indicator

---

### ✅ STEP 3: Seller Reviews & Approves
**User:** Seller
1. Go to **"Transactions"** screen
2. Look for new transaction with orange indicator
3. Transaction should show:
   - Status: "PENDING_SELLER_APPROVAL"
   - Next Step: "Awaiting Seller Approval" (orange)
   - Orange button: **"Review & Approve Offer"**
4. Click **"Review & Approve Offer"**
5. Alert appears with two options:
   - "Reject" (to delete offer)
   - "Approve & Continue" (to proceed)
6. Click **"Approve & Continue"**

**Expected Result:**
- ✓ Alert: "You have approved the buyer's offer. The buyer has been notified to proceed with payment."
- ✓ Transaction status → `PENDING_PAYMENT`, Progress → 40%
- ✓ Buyer sees blue "Payment Required" indicator

---

### ✅ STEP 4: Buyer Pays Fees
**User:** Buyer
1. Go to **"Transactions"** screen
2. Find the approved transaction
3. Transaction should show:
   - Status: "PENDING_PAYMENT"
   - Next Step: "Payment Required" (red/primary color)
   - Blue button: **"Pay Fees & Submit to Notary"**
4. Click **"Pay Fees & Submit to Notary"**
5. Confirm payment in alert

**Expected Result:**
- ✓ Alert: "Fees paid. The transaction has been submitted to the Notary for review."
- ✓ Transaction status → `PENDING_NOTARY`, Progress → 60%
- ✓ Notary sees transaction in their dashboard

---

### ✅ STEP 5: Notary Certifies
**User:** Notary
1. Login as notary user
2. Navigate to **Notary Dashboard**
3. In **"Pending Verification"** tab, find the transaction
4. Transaction should show:
   - Payment notification: "Payment Received - Ready for Review"
   - Blue button: **"Certify Transaction"**
5. Click **"Certify Transaction"**
6. Confirm certification

**Expected Result:**
- ✓ Alert: "You have notarized this transaction. We have sent a notification to the seller for final approval."
- ✓ Transaction status → `PENDING_SELLER`, Progress → 80%
- ✓ Seller sees green "Await Seller Final Signature" indicator

---

### ✅ STEP 6: Seller Final Signature
**User:** Seller
1. Go to **"Transactions"** screen
2. Find the notarized transaction
3. Transaction should show:
   - Status: "PENDING_SELLER"
   - Next Step: "Await Seller Final Signature" (accent color)
   - Green button: **"Confirm & Sign Final Transfer"**
4. Click **"Confirm & Sign Final Transfer"**
5. Alert warns: "This action is recorded on the blockchain and is irreversible"
6. Click **"Confirm & Sign"**

**Expected Result:**
- ✓ Alert: "Ownership transferred! The land has been officially updated in the registry."
- ✓ Transaction status → `COMPLETED`, Progress → 100%
- ✓ Parcel `ownerName` → Buyer's name
- ✓ Parcel status → `Verified`
- ✓ Parcel removed from seller's "My Parcels"
- ✓ Parcel appears in buyer's "My Parcels"
- ✓ Both parties see "Transfer Complete" with blockchain verification

---

## 🧪 Testing Rejection Flow

### Test: Seller Rejects Offer
1. Follow steps 1-2 above (Seller lists, Buyer sends offer)
2. When seller receives offer (Step 3)
3. Click **"Review & Approve Offer"**
4. In alert, click **"Reject"** instead of "Approve & Continue"

**Expected Result:**
- ✓ Alert: "The buyer's offer has been rejected"
- ✓ Transaction deleted from database
- ✓ Buyer no longer sees the transaction
- ✓ Land remains on marketplace for other buyers

---

## 📊 What to Check at Each Stage

### Seller View:
- [ ] Stage 1: Can list land on marketplace
- [ ] Stage 2: Sees orange "Review & Approve Offer" button
- [ ] Stage 2: Can approve or reject offer
- [ ] Stage 3-4: Read-only status during buyer payment and notary review
- [ ] Stage 5: Sees green "Confirm & Sign Final Transfer" button
- [ ] Stage 6: Transaction shows as completed

### Buyer View:
- [ ] Stage 2: Sees orange "Awaiting Seller Approval" after sending offer
- [ ] Stage 3: Sees blue "Pay Fees & Submit to Notary" after seller approves
- [ ] Stage 4-5: Read-only status during notary and seller final signature
- [ ] Stage 6: Receives ownership, parcel appears in "My Parcels"

### Notary View:
- [ ] Stage 4: Sees transaction in "Pending Verification" tab
- [ ] Stage 4: Sees "Payment Received - Ready for Review" notification
- [ ] Stage 4: Can certify transaction
- [ ] All other stages: Can view but no action buttons

---

## 🔍 Where to Find Things

### Mobile App Screens:
- **Marketplace** → Browse/buy land
- **My Parcels** → Manage owned land, list for sale
- **Transactions** → Track all transaction progress
- **Notary Dashboard** → Notary certification (notary role only)

### Transaction Status Indicators:
- **Orange Badge** → Awaiting seller approval
- **Blue Badge** → Payment required (buyer) or review required (notary)
- **Green Badge** → Final seller signature needed
- **Check Mark** → Completed

---

## ⚠️ Common Issues & Solutions

### Issue: "Transaction not found" error
**Solution:** The backend was updated to fix Next.js 15 compatibility. Make sure the admin server is running and restarted after the changes.

### Issue: Seller doesn't see buyer's offer
**Solution:** 
1. Check that transaction was created with correct `sellerName`
2. Ensure seller is viewing "Transactions" screen, not just notifications
3. Refresh the transactions list (pull down to refresh)

### Issue: Notary doesn't see transaction
**Solution:**
1. Ensure buyer paid fees (Stage 3)
2. Check transaction status is `PENDING_NOTARY`
3. Refresh notary dashboard

### Issue: Ownership not transferred
**Solution:**
1. Verify seller completed Stage 5 (final signature)
2. Check transaction status is `COMPLETED`
3. Ensure API endpoint `/api/parcels/[upi]` is working

---

## 🎬 Quick Test Script

Copy and use this as a checklist:

```
[ ] 1. SELLER: List land ($15M)
[ ] 2. BUYER: Send offer
[ ] 3. SELLER: Approve offer (orange button)
[ ] 4. BUYER: Pay fees (blue button)
[ ] 5. NOTARY: Certify (blue button)
[ ] 6. SELLER: Final sign (green button)
[ ] 7. VERIFY: Buyer now owns land
[ ] 8. VERIFY: Transaction shows 100% complete

REJECTION TEST:
[ ] 1. SELLER: List different land
[ ] 2. BUYER: Send offer
[ ] 3. SELLER: REJECT offer
[ ] 4. VERIFY: Transaction deleted
[ ] 5. VERIFY: Land still on marketplace
```

---

## 📸 Expected Button Colors

| Stage | Who | Button Text | Button Color |
|-------|-----|-------------|--------------|
| 2 | Seller | Review & Approve Offer | 🟠 Orange (#F59E0B) |
| 3 | Buyer | Pay Fees & Submit to Notary | 🔵 Blue (Primary) |
| 4 | Notary | Certify Transaction | 🔵 Blue (Primary) |
| 5 | Seller | Confirm & Sign Final Transfer | 🟢 Green (Success) |

---

## ✅ Success Criteria

The implementation is working correctly if:
1. ✓ All 6 stages complete in order
2. ✓ Each actor sees correct buttons at correct times
3. ✓ Status progresses: 0% → 20% → 40% → 60% → 80% → 100%
4. ✓ Rejection works (seller can reject at stage 2)
5. ✓ Ownership transfers to buyer at completion
6. ✓ Land removed from marketplace after completion
7. ✓ Blockchain hash recorded (visible in transaction details)

---

Happy Testing! 🚀
