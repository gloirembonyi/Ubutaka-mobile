# Land Transaction Workflow - Complete Process

## Overview
This document describes the complete end-to-end workflow for land transactions in the Ubutaka platform, from listing to ownership transfer.

## Transaction Flow

### Stage 1: Seller Lists Land on Marketplace
**Actor:** Seller  
**Screen:** SellLandScreen / MyParcelsScreen  
**Status:** Parcel marked as "For Sale" with price  

**Actions:**
1. Seller navigates to "My Parcels"
2. Clicks "Sell" button on a verified parcel
3. Chooses "List on Marketplace"
4. Sets sale price
5. Submits to marketplace

**Result:**
- Parcel status: `For Sale`
- Parcel has a price set
- Visible in marketplace for all buyers

---

### Stage 2: Buyer Sends Offer to Seller
**Actor:** Buyer  
**Screen:** BuyLandScreen  
**Status:** `PENDING_SELLER_APPROVAL`  
**Progress:** 20%  

**Actions:**
1. Buyer browses marketplace
2. Finds desired land parcel
3. Clicks to view details
4. Clicks "Confirm Purchase Offer"
5. System creates transaction with status `PENDING_SELLER_APPROVAL`

**Result:**
- Transaction created
- Seller receives notification
- Buyer waits for seller approval
- Transaction appears in both seller's and buyer's transaction screens

**What Seller Sees:**
- Alert badge on transaction screen
- "Review & Approve Offer" button (orange)
- Buyer's name and offer details

**What Buyer Sees:**
- "Awaiting Seller Approval" status
- Cannot proceed until seller approves

---

### Stage 3: Seller Approves or Rejects Offer
**Actor:** Seller  
**Screen:** TransactionScreen  
**Status Changes:** `PENDING_SELLER_APPROVAL` → `PENDING_PAYMENT` (if approved)  
**Progress:** 40%  

**Actions:**
1. Seller opens Transactions screen
2. Sees buyer's offer with yellow "Review & Approve Offer" button
3. Clicks button
4. Alert shows two options:
   - **Reject**: Deletes transaction, notifies buyer
   - **Approve & Continue**: Moves to payment stage

**Result if Approved:**
- Transaction status: `PENDING_PAYMENT`
- Step: "Awaiting Buyer Payment"
- Buyer is notified to pay fees

**Result if Rejected:**
- Transaction deleted
- Buyer receives rejection notification
- Land remains on marketplace

---

### Stage 4: Buyer Pays Transaction Fees
**Actor:** Buyer  
**Screen:** TransactionScreen  
**Status Changes:** `PENDING_PAYMENT` → `PENDING_NOTARY`  
**Progress:** 60%  

**Actions:**
1. Buyer opens Transactions screen
2. Sees approved transaction with "Pay Fees & Submit to Notary" button
3. Clicks button
4. Confirms payment
5. System updates transaction status

**Result:**
- Transaction status: `PENDING_NOTARY`
- Step: "Awaiting Notary Certification"
- Notary receives notification
- Transaction appears in Notary Dashboard

**What Notary Sees:**
- New transaction in "Pending Verification" tab
- Payment status indicator showing "Payment Received - Ready for Review"
- "Certify Transaction" button

---

### Stage 5: Notary Reviews and Certifies
**Actor:** Notary  
**Screen:** NotaryDashboardScreen  
**Status Changes:** `PENDING_NOTARY` → `PENDING_SELLER`  
**Progress:** 80%  

**Actions:**
1. Notary opens their dashboard
2. Reviews transaction in "Pending Verification" tab
3. Checks documents and legal requirements
4. Clicks "Certify Transaction"
5. Confirms certification

**Result:**
- Transaction status: `PENDING_SELLER`
- Step: "Awaiting Seller Confirmation"
- Seller receives notification for final signature
- Transaction returns to seller for final approval

**What Seller Sees:**
- "Confirm & Sign Final Transfer" button (green)
- Message that notary has certified the transaction

---

### Stage 6: Seller Provides Final Confirmation
**Actor:** Seller  
**Screen:** TransactionScreen  
**Status Changes:** `PENDING_SELLER` → `COMPLETED`  
**Progress:** 100%  

**Actions:**
1. Seller opens Transactions screen
2. Sees notarized transaction with "Confirm & Sign Final Transfer" button (green)
3. Clicks button
4. Reviews final confirmation alert: "This action is recorded on the blockchain and is irreversible"
5. Confirms signature

**Result:**
- Transaction status: `COMPLETED`
- Parcel ownership transferred to buyer
- Parcel status changed to `Verified`
- Parcel `ownerName` updated to buyer's name
- Blockchain record created
- Both parties receive "Success" notification

---

## Complete Status Flow

```
Marketplace Listing
        ↓
PENDING_SELLER_APPROVAL (20%) - Buyer sent offer
        ↓
[Seller Approves]
        ↓
PENDING_PAYMENT (40%) - Awaiting buyer payment
        ↓
[Buyer Pays Fees]
        ↓
PENDING_NOTARY (60%) - Under notary review
        ↓
[Notary Certifies]
        ↓
PENDING_SELLER (80%) - Awaiting seller final signature
        ↓
[Seller Signs]
        ↓
COMPLETED (100%) - Ownership transferred
```

## User Actions by Role

### Seller Actions:
1. List land on marketplace (SellLandScreen)
2. Approve/Reject buyer offer (TransactionScreen)
3. Provide final signature (TransactionScreen)

### Buyer Actions:
1. Send purchase offer (BuyLandScreen)
2. Pay transaction fees (TransactionScreen)

### Notary Actions:
1. Review transaction documents (NotaryDashboardScreen)
2. Certify transaction legitimacy (NotaryDashboardScreen)

## Transaction Screens

### For Buyers:
- **PENDING_SELLER_APPROVAL**: Shows "Awaiting Seller Approval" (Orange indicator)
- **PENDING_PAYMENT**: Shows "Pay Fees & Submit to Notary" button (Blue)
- **PENDING_NOTARY**: Shows "Under Notary Review" (Read-only)
- **PENDING_SELLER**: Shows "Awaiting Seller Final Signature" (Read-only)
- **COMPLETED**: Shows "Transfer Complete" with blockchain verification

### For Sellers:
- **PENDING_SELLER_APPROVAL**: Shows "Review & Approve Offer" button (Orange)
- **PENDING_PAYMENT**: Shows "Awaiting Buyer Payment" (Read-only)
- **PENDING_NOTARY**: Shows "Under Notary Review" (Read-only)
- **PENDING_SELLER**: Shows "Confirm & Sign Final Transfer" button (Green)
- **COMPLETED**: Shows "Transfer Complete" with blockchain verification

### For Notary:
- **PENDING_NOTARY**: Shows "Certify Transaction" button (Blue)
- All other statuses visible for monitoring but no action buttons

## Key Features

1. **Multi-Stage Approval**: 5-step process ensures all parties are involved
2. **Rejection Handling**: Seller can reject offers at approval stage
3. **Payment Verification**: Buyer must pay before notary review
4. **Notary Certification**: Official government verification step
5. **Final Seller Confirmation**: Seller has ultimate control before transfer
6. **Blockchain Recording**: All completed transactions immutably recorded
7. **Automatic Ownership Transfer**: System updates parcel ownership on completion

## Security & Validation

- Each step requires explicit user confirmation
- Blockchain hash generated and stored for audit trail
- All status changes logged with timestamps
- Irreversible final transfer with clear warning
- Notary certification required for legal validity

## Error Handling

- Network failures: Transactions queued for retry
- Invalid states: System prevents out-of-order progression
- Rejected offers: Clean transaction deletion
- Failed payments: Transaction remains in PENDING_PAYMENT until successful
