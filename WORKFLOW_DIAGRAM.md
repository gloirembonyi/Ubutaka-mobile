# Land Transaction Workflow - Visual Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│          LAND TRANSACTION WORKFLOW - COMPLETE PROCESS           │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  STAGE 1: MARKETPLACE LISTING                         [0%]      │
│  ────────────────────────────────────────────────────           │
│  🏪 Actor: SELLER                                               │
│  Status: For Sale                                               │
│  Action: Seller lists land with price on marketplace            │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                    [BUYER BROWSES & SELECTS]
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  STAGE 2: PENDING_SELLER_APPROVAL                    [20%]  🟠  │
│  ─────────────────────────────────────────────────────          │
│  🤝 Actor: BUYER sends offer → SELLER reviews                   │
│  Button: "Review & Approve Offer" (Orange)                      │
│  Actions:                                                       │
│    • Buyer: Clicks "Confirm Purchase Offer"                    │
│    • Seller: Approves or Rejects offer                         │
│  Result: If approved → Move to Stage 3                         │
│         If rejected → Transaction deleted                      │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                    [SELLER APPROVES OFFER]
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  STAGE 3: PENDING_PAYMENT                            [40%]  🔵  │
│  ────────────────────────────────────────────────────           │
│  💳 Actor: BUYER                                                │
│  Button: "Pay Fees & Submit to Notary" (Blue)                  │
│  Action: Buyer pays transaction fees                           │
│  Result: Transaction sent to Notary for certification          │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                      [PAYMENT CONFIRMED]
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  STAGE 4: PENDING_NOTARY                             [60%]  🟣  │
│  ────────────────────────────────────────────────────           │
│  ⚖️  Actor: NOTARY                                              │
│  Button: "Certify Transaction" (Blue)                          │
│  Action: Notary reviews documents & certifies legitimacy       │
│  Result: Certified transaction returned to Seller              │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                   [NOTARY CERTIFIES TRANSACTION]
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  STAGE 5: PENDING_SELLER                             [80%]  🟢  │
│  ────────────────────────────────────────────────────           │
│  ✍️  Actor: SELLER                                              │
│  Button: "Confirm & Sign Final Transfer" (Green)               │
│  Action: Seller provides final signature                       │
│  Warning: "This action is irreversible and recorded on chain"  │
│  Result: Ownership transfer initiated                          │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                    [SELLER CONFIRMS & SIGNS]
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  STAGE 6: COMPLETED                                 [100%]  ✅  │
│  ────────────────────────────────────────────────────           │
│  🎉 All Parties                                                 │
│  Status: Transfer Complete                                     │
│  System Actions:                                               │
│    ✓ Parcel ownership → Buyer                                 │
│    ✓ Parcel status → Verified                                 │
│    ✓ Blockchain record created                                │
│    ✓ All parties notified                                     │
└─────────────────────────────────────────────────────────────────┘

═══════════════════════════════════════════════════════════════════

                         ROLE SUMMARY

┌───────────────┬─────────────────────────────────────────────────┐
│    SELLER     │  • Posts land on marketplace (Stage 1)          │
│               │  • Approves/Rejects buyer offer (Stage 2)       │
│               │  • Provides final signature (Stage 5)           │
└───────────────┴─────────────────────────────────────────────────┘

┌───────────────┬─────────────────────────────────────────────────┐
│     BUYER     │  • Sends purchase offer (Stage 2)               │
│               │  • Pays transaction fees (Stage 3)              │
│               │  • Receives ownership (Stage 6)                 │
└───────────────┴─────────────────────────────────────────────────┘

┌───────────────┬─────────────────────────────────────────────────┐
│    NOTARY     │  • Reviews transaction (Stage 4)                │
│               │  • Certifies legitimacy (Stage 4)               │
└───────────────┴─────────────────────────────────────────────────┘

═══════════════════════════════════════════════════════════════════

                      STATUS COLOR CODES

🟠 Orange  - PENDING_SELLER_APPROVAL (Awaiting seller decision)
🔵 Blue    - PENDING_PAYMENT (Awaiting buyer payment)
🟣 Purple  - PENDING_NOTARY (Under government review)
🟢 Green   - PENDING_SELLER (Awaiting seller final signature)
✅ Success - COMPLETED (Ownership transferred)

═══════════════════════════════════════════════════════════════════

                      REJECTION POINTS

❌ Stage 2: Seller can REJECT buyer's offer
   → Transaction deleted
   → Land remains on marketplace
   → Buyer notified

⚠️  All other stages: No rejection allowed
   → Process must complete or be cancelled through support

═══════════════════════════════════════════════════════════════════
```
