# Fixia Marketplace - Complete Flow Roadmap

**Vision:** Build a trusted marketplace with clear rules, quality control, and professional interactions.

**Status:** Phase 1 (Registration/Subscription) Complete ✅
**Next Phase:** Implement Complete Marketplace Flow

---

## Complete Marketplace User Journey

```
CLIENT PERSPECTIVE:
1. Register/Browse           → Search professionals
2. Create Request            → Describe what they need
3. Wait for Matches          → See interested professionals
4. Chat & Negotiate          → Internal messaging
5. Accept Proposal           → "Match confirmed"
6. Receive WhatsApp Link     → Move to direct communication
7. Work Happens              → Professional delivers
8. Declare Success           → Did it work? Yes/No
9. Mandatory Rating          → Star rating + comment
10. Reputation Builds        → Profile strength increases

PROFESSIONAL PERSPECTIVE:
1. Register + Subscribe      → Show up in marketplace
2. Browse Requests           → See client needs (filtered by radius/category)
3. Send Proposal             → "I'm interested" + price offer
4. Chat & Negotiate          → Internal messaging
5. Accept Proposal           → "Match confirmed"
6. Receive WhatsApp Link     → Move to direct communication
7. Do the Work               → Professional delivers
8. Declare Success           → Did it go well? Yes/No
9. Mandatory Rating          → Star rating + comment
10. Reputation Builds        → Profile strength increases
```

---

## Phase 1: Core Registration & Subscription ✅

**Status:** COMPLETE & DEPLOYED

### What's Done
- ✅ Professional registration with fields
- ✅ Subscription system with ARS 3.900/month
- ✅ Identity verification requirement (VERIFIED badge)
- ✅ Permission system with grace period
- ✅ API security with permission checks

### Current Capabilities
- Professionals can register and subscribe
- Can create services (if subscription + verified)
- Appear in marketplace (if subscription + verified)
- Basic search by category/location

---

## Phase 2: Request & Match System (NEXT)

**Estimated:** 2-3 weeks
**Priority:** HIGH - Core marketplace functionality

### Database Changes Needed
```prisma
model ServiceRequest {
  id              String    @id @default(uuid())
  clientId        String
  client          User      @relation("ClientRequests", fields: [clientId], references: [id])

  title           String
  description     String
  category        String
  budget          Decimal?
  location        String

  status          RequestStatus  @default(OPEN)  // OPEN, MATCHED, IN_PROGRESS, COMPLETED
  createdAt       DateTime  @default(now())
  expiresAt       DateTime? // Auto-close after 30 days

  proposals       Proposal[]
  matches         Match[]

  @@index([clientId])
  @@index([status])
  @@index([category])
}

enum RequestStatus {
  OPEN              // Waiting for proposals
  MATCHED           // Professional accepted
  IN_PROGRESS       // Work started
  COMPLETED         // Work finished
  CANCELLED         // Cancelled by client
}

model Proposal {
  id              String    @id @default(uuid())
  requestId       String
  request         ServiceRequest  @relation(fields: [requestId], references: [id], onDelete: Cascade)

  providerId      String
  provider        User      @relation("ProvidalsProvided", fields: [providerId], references: [id])

  price           Decimal
  message         String?   // Professional's pitch
  estimatedDays   Int?      // How long it takes

  status          ProposalStatus  @default(PENDING)  // PENDING, ACCEPTED, REJECTED, WITHDRAWN
  createdAt       DateTime  @default(now())
  respondedAt     DateTime?

  match           Match?    // Links to match when accepted

  @@unique([requestId, providerId])  // Only one proposal per professional per request
  @@index([requestId])
  @@index([providerId])
  @@index([status])
}

enum ProposalStatus {
  PENDING         // Waiting for client response
  ACCEPTED        // Client accepted - creates Match
  REJECTED        // Client rejected
  WITHDRAWN       // Professional withdrew
}

model Match {
  id              String    @id @default(uuid())
  requestId       String
  request         ServiceRequest  @relation(fields: [requestId], references: [id])

  clientId        String
  client          User      @relation("MatchesAsClient", fields: [clientId], references: [id])

  providerId      String
  provider        User      @relation("MatchesAsProvider", fields: [providerId], references: [id])

  proposalId      String
  proposal        Proposal  @relation(fields: [proposalId], references: [id])

  price           Decimal
  status          MatchStatus  @default(ACTIVE)

  // Work tracking
  startedAt       DateTime?
  completedAt     DateTime?

  // Completion declaration
  clientApproved  Boolean?  // Did client confirm work was done?
  providerApproved Boolean? // Did professional confirm work was done?

  // Rating & review
  clientReview    Review?   @relation("ClientReview")
  providerReview  Review?   @relation("ProviderReview")

  // Communication
  messages        Message[]
  whatsappLink    String?   // Generated when both accept
  whatsappSharedAt DateTime?

  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  @@index([clientId])
  @@index([providerId])
  @@index([requestId])
  @@index([status])
}

enum MatchStatus {
  ACTIVE          // Match accepted, work in progress
  COMPLETED       // Work finished, awaiting reviews
  CLOSED          // Both have reviewed
  CANCELLED       // Cancelled by either party
}

model Message {
  id              String    @id @default(uuid())
  matchId         String
  match           Match     @relation(fields: [matchId], references: [id], onDelete: Cascade)

  senderId        String
  sender          User      @relation(fields: [senderId], references: [id])

  content         String
  messageType     MessageType  @default(TEXT)  // TEXT, TEMPLATE, FILE

  readAt          DateTime?
  createdAt       DateTime  @default(now())

  @@index([matchId])
  @@index([senderId])
  @@index([readAt])
}

enum MessageType {
  TEXT            // Regular message
  TEMPLATE        // Quick response (price, availability, etc)
  FILE            // Document/image attachment
  SYSTEM          // Automatic message (match created, work completed, etc)
}

model Review {
  id              String    @id @default(uuid())
  matchId         String

  // Who is being reviewed?
  authorId        String    // Who wrote the review
  author          User      @relation("ReviewsWritten", fields: [authorId], references: [id])

  targetId        String    // Who is being reviewed
  target          User      @relation("ReviewsReceived", fields: [targetId], references: [id])

  rating          Int       // 1-5 stars
  comment         String?   // Optional comment

  // Work quality metrics
  recommendWould  Boolean   // Would you recommend this person?

  createdAt       DateTime  @default(now())

  // Link to match (one per match per direction)
  clientMatch     Match?    @relation("ClientReview", fields: [matchId], references: [id])

  @@unique([matchId, authorId])  // Only one review per person per match
  @@index([targetId])
  @@index([authorId])
  @@index([matchId])
}
```

### API Endpoints Needed

**Request Management:**
```
POST   /api/requests                    - Create new service request
GET    /api/requests                    - List my requests (paginated)
GET    /api/requests/:id                - Get request details
PATCH  /api/requests/:id                - Update request
DELETE /api/requests/:id                - Cancel request
```

**Proposal Management:**
```
POST   /api/proposals                   - Send proposal (professional)
GET    /api/proposals                   - List my proposals
PATCH  /api/proposals/:id               - Update proposal (price, message)
POST   /api/proposals/:id/accept        - Client accepts proposal (creates Match)
POST   /api/proposals/:id/reject        - Client rejects proposal
POST   /api/proposals/:id/withdraw      - Professional withdraws
```

**Match Management:**
```
GET    /api/matches                     - List my active matches
GET    /api/matches/:id                 - Get match details
POST   /api/matches/:id/mark-complete   - Declare work complete
POST   /api/matches/:id/generate-whatsapp - Get WhatsApp link
```

**Search & Discovery:**
```
GET    /api/requests/search             - Find requests (client browse)
GET    /api/professionals/search        - Find professionals (client search)
```

### Frontend Components Needed
- ServiceRequest creation form
- Request detail view
- Proposal submission form
- Match negotiation chat interface
- Proposal acceptance/rejection UI
- Work completion declaration

---

## Phase 3: Internal Chat System

**Estimated:** 1-2 weeks
**Priority:** HIGH - Essential for negotiation

### Features
- Real-time messaging between matched parties
- Quick reply templates for common questions
- Message read indicators
- Typing indicators
- Media support (images, files)
- Message history in match timeline

### Technology
- WebSocket or Polling for real-time updates
- Message notifications (in-app, email, push)
- Message archiving for disputes

### Database
- Messages table (already in Phase 2 schema)
- Notification preferences table
- Message templates table

---

## Phase 4: WhatsApp Integration & Digital Contract

**Estimated:** 2-3 weeks
**Priority:** HIGH - Critical for real-world usage

### Features

**1. WhatsApp Share Link**
When both accept match:
- Generate unique contract summary
- Show WhatsApp button with pre-filled message
- Client/Professional can discuss on WhatsApp
- Contract stays as record on Fixia

**2. Digital Contract Creation**
```
Contract Summary:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Service: {title}
Professional: {name}
Client: {name}
Price: ${price}
Estimated Duration: {days} days
Location: {address}
Start Date: {date}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Terms:
- Work must be completed by {date}
- Payment: See original proposal
- Contact: [WhatsApp link]

Both parties agree by clicking "Accept"
```

**3. Contract Storage**
- Store as JSON in database
- Digital signatures via 1-click confirm
- Legally defensible record

### Implementation
- Twilio WhatsApp Business API integration
- Contract generation as PDF
- Email contract to both parties
- Contract acceptance tracking

---

## Phase 5: Work Completion & Declaration System

**Estimated:** 1 week
**Priority:** MEDIUM - Quality control

### Features

**When Work is Done:**

1. **Client Declaration**
   - Form: "Has the professional completed the work?"
   - Options: Yes / No / Partially
   - If Yes → Auto-triggers rating
   - If No → Escalation to support

2. **Professional Declaration**
   - Form: "Have you completed the work?"
   - Options: Yes / No
   - If Yes → Waits for client confirmation

3. **Reconciliation**
   ```
   Both Say YES     → Match COMPLETED → Rating phase
   Client NO, Pro YES → Support review
   Both say NO      → Escalation
   ```

### Database
```prisma
// Add to Match model
clientApproved  Boolean?
providerApproved Boolean?
approvedAt      DateTime?
escalatedAt     DateTime?
escalationReason String?
```

---

## Phase 6: Mandatory Rating & Review System

**Estimated:** 1 week
**Priority:** HIGH - Defines marketplace quality

### Features

**Rating Flow:**
```
After work completion:

BOTH receive: "Please rate this interaction"

Star Rating (1-5):
⭐⭐⭐⭐⭐ (5 - Excellent)
⭐⭐⭐⭐  (4 - Good)
⭐⭐⭐   (3 - Okay)
⭐⭐    (2 - Poor)
⭐     (1 - Terrible)

Text Comment (Optional):
[Write detailed feedback...]

Quick Metrics:
- "Would you recommend this person?" (Yes/No)
- "Was communication clear?" (Yes/No)
- "Delivered as promised?" (Yes/No)
```

**Important Rules:**
- Ratings are MANDATORY to close a match
- Minimum 48 hours to rate (gives time to reflect)
- Can't change rating after submission
- Comments visible publicly (unless reported)
- Average rating shown on profile

**Anti-Gaming Measures:**
- Can't rate own profile
- Can only rate people you've matched with
- Ratings from suspicious accounts flagged
- Admin review if rating pattern is unusual

### Reputation Calculation
```
Professional Score = (
  (average_rating * 0.6) +
  (response_rate * 0.2) +
  (completion_rate * 0.2)
) * 100

Where:
- average_rating: 1-5 stars
- response_rate: % of proposals client/pro respond to
- completion_rate: % of matches marked complete
```

### Display
```
Profile Badge:
🟢 Excellent (4.5-5.0) - Top performer
🔵 Good (4.0-4.4)
🟡 Average (3.0-3.9)
🟠 Below Average (2.0-2.9)
🔴 Poor (<2.0) - May be suspended
```

---

## Phase 7: Support & Dispute System

**Estimated:** 2-3 weeks
**Priority:** MEDIUM - Essential for trust

### Features

**Dispute Scenarios:**
1. Client says work wasn't completed → Professional disputes
2. Professional didn't show up
3. Quality issues
4. Payment disputes

**Resolution Flow:**
```
1. Escalation created
2. Both parties submit evidence
3. Support team reviews (48 hour SLA)
4. Admin decision
5. Refund or completion recorded
```

**Evidence Types:**
- Messages transcript
- Photos/videos
- Time logs
- Contract terms
- Payment records

---

## Technology Decisions

### Real-Time Chat: WebSocket vs Polling
- **WebSocket:** Better for real-time, more bandwidth
- **Recommendation:** Start with polling (socket.io), upgrade to native WebSocket if needed

### Notifications
- In-app: Store in database, show in sidebar
- Email: Send after 5 minutes of inactivity
- Push: App notifications (Phase 2 implementation)

### File Storage
- Images: Cloudinary (already integrated)
- Documents: AWS S3 or Cloudinary
- Contract PDFs: Generate on-demand

### Payment/Escrow
- Current: Direct wallet to wallet
- Upgrade: Escrow system (hold payment until completion)
- Timeline: Phase 8+

---

## Implementation Timeline

```
PHASE 1: Registration & Subscription      ✅ DONE
PHASE 2: Request & Match System           📍 NEXT (Start: Week 1)
PHASE 3: Internal Chat                    📍 (Start: Week 3)
PHASE 4: WhatsApp & Digital Contract      📍 (Start: Week 5)
PHASE 5: Work Completion Declaration      📍 (Start: Week 7)
PHASE 6: Mandatory Rating System          📍 (Start: Week 8)
PHASE 7: Support & Dispute System         📍 (Start: Week 10)

Total Timeline: ~10 weeks for MVP marketplace
```

---

## Business Rules Summary

### Immutable Rules (Core to Platform)
✅ **Subscriptions:** ARS 3.900/month for professionals
✅ **Verification:** VERIFIED badge required before publishing
✅ **Ratings:** Mandatory after work completion
✅ **Chat:** Internal only until match accepted
✅ **WhatsApp:** Only after match accepted
✅ **Contract:** Digital record of all terms
✅ **Disputes:** Support team arbitrates

### Anti-Abuse Measures
- Rate limiting on proposals (5 per day max per professional)
- Spam detection on messages
- Fake profile detection (no reviews after 30 days = suspension)
- Rating bombing detection (multiple 1-star reviews = investigation)
- Banned words filter in messages

---

## Key Differentiators vs Competitors

| Feature | Fixia | Fiverr | Upwork | TaskRabbit |
|---------|-------|--------|--------|-----------|
| Mandatory Ratings | ✅ | ✅ | ✅ | ✅ |
| Internal Chat | ✅ | ✅ | ✅ | ✅ |
| Work Completion Declaration | ✅ | ❌ | ❌ | ✅ |
| Digital Contract | ✅ | ⚠️ | ⚠️ | ✅ |
| WhatsApp Integration | ✅ | ❌ | ❌ | ❌ |
| Local Focus | ✅ | ❌ | ❌ | ⚠️ |
| Geo-Radius Search | ✅ | ❌ | ❌ | ✅ |

**Fixia's Advantage:** Combines best of all platforms with WhatsApp integration + digital contract

---

## Success Metrics

### Phase 2 Completion Target
- 100+ active requests in marketplace
- 50+ active matches per week
- 30-second average response time
- Zero critical bugs in matching logic

### Phase 6 Target (Rating System)
- 95% of matches rated within 7 days
- Average rating across platform: 4.2+ stars
- 0% rating manipulation detected

### Phase 7 Target (Support)
- <2% of matches escalated to disputes
- 95% dispute resolution within 48 hours
- User satisfaction: 4.5+ stars on support

---

## Success Criteria Checklist

✅ **Phase 1 (Current)** - Complete & Deployed
- Professional registration working
- Subscription system active
- Permission system enforced
- Cron job monitoring subscriptions

📍 **Phase 2** - Ready to Start
- All database models defined
- API endpoints documented
- UI mockups ready
- Start date: After cron job is stable

✅ **Development Process**
- Test each phase in staging first
- Deploy features incrementally
- Monitor for bugs/abuse
- Gather user feedback
- Iterate quickly

---

## Files to Create (Phase 2)

**Database/Schema:**
- `prisma/schema.prisma` (updated with new models)

**API Routes:**
- `src/app/api/requests/route.ts` (CRUD)
- `src/app/api/requests/[id]/route.ts` (detail)
- `src/app/api/proposals/route.ts` (CRUD)
- `src/app/api/matches/route.ts` (CRUD)
- `src/app/api/messages/route.ts` (messaging)

**Components:**
- `src/components/request-form.tsx`
- `src/components/request-card.tsx`
- `src/components/proposal-form.tsx`
- `src/components/match-chat.tsx`

**Pages:**
- `src/app/dashboard/requests/page.tsx`
- `src/app/dashboard/matches/page.tsx`
- `src/app/dashboard/proposals/page.tsx`

---

## Next Steps

1. **This Week:** Review and approve Phase 2 plan
2. **Week 1:** Start Phase 2 implementation (Request system)
3. **Week 3:** Launch Phase 3 (Chat system)
4. **Week 5:** Launch Phase 4 (WhatsApp integration)
5. **Week 8:** Rating system live
6. **Week 10:** Full marketplace operational with support

---

**Current Status:** Phase 1 Complete ✅
**Next Action:** Approval to start Phase 2 (Request & Match System)
**Timeline:** 10 weeks to full MVP marketplace

Ready to proceed? Start Phase 2 implementation? 🚀
