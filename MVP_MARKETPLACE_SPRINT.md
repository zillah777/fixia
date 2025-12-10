# Fixia MVP Marketplace - 2-Week Sprint Plan

**Current Status:** Phase 1 (Registration/Subscription) ✅ COMPLETE
**Next Phase:** Phase 2 (Marketplace Flow) - MVP in 2 weeks
**Start Date:** Week of Dec 10, 2025
**Completion Date:** Week of Dec 23, 2025

---

## Sprint Overview

This is the **MINIMAL viable marketplace** to make the platform functional for real transactions.

**In scope:** Request → Proposal → Match → Chat → Completion → Rating
**Out of scope:** Disputes, templates, advanced search, digital contracts (v2)

---

## Week 1: Core UI Components & Pages

### Day 1-2: Request Creation (Frontend Only - 4 hours)

**Goal:** Let clients create service requests

**Database:** ✅ Already exists (Request model)
**API:** ✅ Already exists (POST `/api/requests`)
**What to build:**

#### File: `src/app/dashboard/requests/page.tsx`
```typescript
// PAGE: List client's service requests
// Features:
// - Show all my requests (OPEN, MATCHED, COMPLETED, CANCELLED)
// - New Request button
// - Quick actions (edit, delete, repost)
// - Status badges
// - Budget info, proposals count
```

**Component:** `src/components/request-form.tsx`
```typescript
// FORM: Create/edit service request
// Fields:
// - title (required)
// - description (textarea, required)
// - category (select, required)
// - budget (optional)
// - location (with map picker)
// - images upload (max 5)
// - tags (optional)
// Validation: Zod schema
// Submit: POST /api/requests
```

**Component:** `src/components/request-card.tsx`
```typescript
// CARD: Show request preview
// Display:
// - Title, description (truncate)
// - Category, location, budget
// - Created date, expires date
// - Proposal count
// - Status badge
// - Click to expand
```

**Estimated time:** 4 hours
**Dependencies:** shadcn/ui form, input, textarea, select components

---

### Day 2-3: Match/Proposal Management (4 hours)

**Goal:** View matches, send proposals, accept/reject

**File:** `src/app/dashboard/proposals/page.tsx`
```typescript
// PAGE: Show proposals I've sent
// Split into tabs:
// - PENDING: Waiting for client response
// - ACCEPTED: Client said yes (ready for match)
// - REJECTED: Client said no
// - WITHDRAWN: I withdrew my offer
// Features:
// - List with status, price, created date
// - Quick actions: withdraw, resend
// - Can view request details
```

**File:** `src/app/dashboard/matches/page.tsx`
```typescript
// PAGE: Show my active matches
// Features:
// - List of active matches
// - Filter: ACTIVE, COMPLETED, CLOSED
// - For each match: client/professional name, price, created date
// - Quick action: View Chat, Mark Complete, Rate
// - Status indicator
```

**Component:** `src/components/proposal-form.tsx`
```typescript
// FORM: Send proposal on a request
// Fields:
// - price (required, Decimal)
// - message (optional, pitch)
// - estimatedDays (optional)
// Validation: price > 0
// Submit: POST /api/proposals
// Success: Show "Proposal sent!" toast
```

**Estimated time:** 4 hours
**Dependencies:** None new

---

### Day 3-4: Chat Interface (6 hours)

**Goal:** Real-time messaging between matched parties

**File:** `src/app/dashboard/matches/[id]/page.tsx`
```typescript
// PAGE: Match detail with chat
// Left side (40%):
// - Match info: professional/client name, price, status
// - Request details: title, description
// - Buttons: Mark Complete, Rate, WhatsApp Share
//
// Right side (60%):
// - Chat messages list (infinite scroll)
// - Message input at bottom
// - Timestamps, read receipts
// - Typing indicator (optional v2)
```

**Component:** `src/components/match-chat.tsx`
```typescript
// COMPONENT: Embedded chat
// Features:
// - Display messages with sender info, timestamp
// - Alternate left/right based on sender
// - Auto-scroll to bottom
// - Input field with send button
// - Loading state while sending
// - Error handling
//
// Real-time: Use polling (GET /api/messages?matchId=X every 2s)
// Future: Upgrade to WebSocket
//
// API calls:
// - GET /api/messages?matchId=X&limit=50
// - POST /api/messages (send)
```

**Component:** `src/components/message-item.tsx`
```typescript
// COMPONENT: Single message display
// Display:
// - Avatar of sender
// - Name, timestamp
// - Message text
// - Read indicator (checkmark)
```

**Estimated time:** 6 hours
**Dependencies:** None new

---

## Week 2: Completion, Rating, and Polish

### Day 5-6: Work Completion & Rating (5 hours)

**Goal:** Mark work complete, force rating, enable WhatsApp

**Component:** `src/components/work-completion.tsx`
```typescript
// COMPONENT: Mark work as complete
// Two-step flow:
//
// Step 1 - Declaration:
// - "Has the work been completed?"
// - For CLIENT: Approve/Reject buttons
// - For PROFESSIONAL: Done/Not Done buttons
// - Comment box (optional)
//
// Step 2 - Rating (after both approved):
// - Star rating (1-5)
// - Text comment (optional)
// - "Would you recommend?" (yes/no)
// - Submit button
//
// UX:
// - Show client approval status to pro
// - Show pro completion to client
// - Auto-transition to rating when both approve
// - Block match closure without both ratings
//
// API:
// - POST /api/matches/[id]/mark-complete
// - POST /api/reviews
```

**Component:** `src/components/review-form.tsx`
```typescript
// FORM: Submit rating & review
// Fields:
// - Rating: Star picker (1-5)
// - Comment: Textarea (optional)
// - "Would recommend": Yes/No toggle
// - Submit button
//
// Validation:
// - Rating required
// - Can only rate once per match
// - Only after work marked complete
//
// Post-submit:
// - Show "Rating submitted!" toast
// - Redirect to matches list
//
// API: POST /api/reviews
```

**Backend Enhancement:** `src/app/api/matches/[id]/complete/route.ts`
```typescript
// POST endpoint to mark work complete
// Request body:
// {
//   approved: boolean,
//   comment?: string
// }
//
// Logic:
// 1. Check user is in match (client or professional)
// 2. Store approval (clientApproved or providerApproved)
// 3. If both approved, change match status to "COMPLETED"
// 4. Send notification to other party
// 5. Return match with updated status
//
// Response:
// {
//   status: "COMPLETED" | "ACTIVE",
//   clientApproved: true/false,
//   providerApproved: true/false,
//   message: "Work marked complete. Please rate."
// }
```

**Estimated time:** 5 hours
**Dependencies:** Star rating component (install: `npm install react-star-ratings`)

---

### Day 6-7: WhatsApp & Final Polish (3 hours)

**Goal:** Add WhatsApp share button

**Component Enhancement:** Update match detail page
```typescript
// Add WhatsApp button (show after both accept match)
// Button text: "Continue on WhatsApp"
// Link: https://wa.me/[profPhone]?text=[message]
//
// Message content:
// "Hi! I'm ready to work on your request. Let's confirm details: [price], [location], [date]"
//
// Record in DB:
// - whatsappRevealedAt: timestamp when clicked
// - whatsappSharedByRole: "CLIENT" | "PROFESSIONAL"
//
// API: PATCH /api/matches/[id]/share-whatsapp
```

**Frontend Polish (2 hours):**
- Loading states on all buttons
- Error toasts
- Confirmation dialogs for destructive actions
- Mobile responsive design
- Accessibility (keyboard navigation, ARIA labels)

**Estimated time:** 3 hours
**Dependencies:** None new

---

## API Completeness Checklist

### Requests
- ✅ GET `/api/requests` - List my requests (check pagination)
- ✅ POST `/api/requests` - Create request (check)
- ✅ PATCH `/api/requests/[id]` - Update request (check)
- ✅ DELETE `/api/requests/[id]` - Cancel request (check)

### Proposals
- ✅ GET `/api/proposals` - List my proposals (check)
- ✅ POST `/api/proposals` - Send proposal (check)
- ✅ PATCH `/api/proposals/[id]` - Update proposal (check)
- ✅ POST `/api/proposals/[id]/accept` - Accept (creates match)
- ✅ POST `/api/proposals/[id]/reject` - Reject
- ✅ POST `/api/proposals/[id]/withdraw` - Withdraw

### Matches
- ✅ GET `/api/matches` - List my matches
- ✅ GET `/api/matches/[id]` - Match detail
- ✅ POST `/api/matches/[id]/complete` - Mark complete (NEEDS BUILD)
- ✅ POST `/api/matches/[id]/share-whatsapp` - Share WhatsApp (NEEDS BUILD)

### Messages
- ✅ GET `/api/messages?matchId=X` - Get messages (verify works)
- ✅ POST `/api/messages` - Send message (verify works)

### Reviews
- ✅ GET `/api/reviews?matchId=X` - Get match reviews
- ✅ POST `/api/reviews` - Submit rating (verify complete)

---

## Database Changes (Minor)

Add to Match model (update schema):
```prisma
model Match {
  // ... existing fields ...

  clientApproved    Boolean?    // Did client approve completion?
  providerApproved  Boolean?    // Did professional approve?
  completedAt       DateTime?   // When marked complete

  // WhatsApp tracking
  whatsappSharedAt  DateTime?   // When WhatsApp was clicked
  whatsappSharedBy  String?     // CLIENT or PROFESSIONAL
}
```

Migration:
```bash
npx prisma migrate dev --name add_match_completion_fields
```

---

## Testing Checklist

### E2E Flow (Manual Testing)

**Scenario 1: Happy Path**
```
1. Client creates request ✓
2. Professional views request ✓
3. Professional sends proposal ✓
4. Client reviews proposal ✓
5. Client accepts proposal (creates match) ✓
6. Both exchange messages in chat ✓
7. Professional marks complete ✓
8. Client approves completion ✓
9. Both rate each other ✓
10. Match closed with ratings visible ✓
```

**Scenario 2: Dispute Path**
```
1. Work marked complete by pro ✓
2. Client says "Not complete" ✓
3. Both can see disagreement ✓
4. Can message to clarify (TODO: support escalation)
```

**Scenario 3: Rating Enforcement**
```
1. After work approved, rating required ✓
2. Can't close match without rating ✓
3. Both must rate independently ✓
```

---

## Frontend Components Summary

### Pages to Create
1. `src/app/dashboard/requests/page.tsx` - Client's requests
2. `src/app/dashboard/proposals/page.tsx` - My proposals
3. `src/app/dashboard/matches/page.tsx` - My matches
4. `src/app/dashboard/matches/[id]/page.tsx` - Match detail with chat

### Components to Create
1. `request-form.tsx` - Create/edit request
2. `request-card.tsx` - Request preview
3. `proposal-form.tsx` - Send proposal
4. `proposal-card.tsx` - Proposal display
5. `match-chat.tsx` - Chat interface
6. `message-item.tsx` - Single message
7. `work-completion.tsx` - Mark complete form
8. `review-form.tsx` - Rating & review
9. `professional-card.tsx` - Pro info in match (might exist)

### Total: 9 new files, ~500 lines of code

---

## Backend APIs to Enhance

### Need Implementation/Testing
1. `POST /api/matches/[id]/complete` - Mark work complete (NEW)
2. `POST /api/matches/[id]/share-whatsapp` - Track WhatsApp share (NEW)
3. Verify all GET/POST endpoints work correctly
4. Add proper error handling
5. Add validation schemas with Zod

### Total: 2 new routes, 50-100 lines of code

---

## Deliverables by End of Week 2

### Live Features
✅ Create service requests
✅ View all requests (with status)
✅ Send proposals on requests
✅ View sent/received proposals
✅ Accept/reject proposals (creates match)
✅ Chat between matched parties
✅ Mark work as complete
✅ Mandatory rating & review
✅ WhatsApp share button
✅ View active matches with status

### Performance Targets
- Page load: <2 seconds
- Chat message send: <500ms
- No N+1 queries
- Proper pagination on lists

### Quality Targets
- Zero TypeScript errors
- All forms validated with Zod
- Error messages user-friendly
- Mobile responsive
- Keyboard accessible

---

## Success Criteria

### Feature Complete
- [ ] Can create request → send proposal → match → chat → rate (full flow)
- [ ] Professional appears on match dashboard with status
- [ ] Chat is real-time (or 2-second polling)
- [ ] Ratings are mandatory and visible
- [ ] WhatsApp button appears after match accepted

### User Experience
- [ ] All forms are intuitive
- [ ] Error messages are clear
- [ ] Loading states visible
- [ ] Mobile works well
- [ ] No console errors

### Performance
- [ ] Dashboard loads in <2 seconds
- [ ] Chat is responsive
- [ ] No memory leaks
- [ ] Pagination works on large lists

### Security
- [ ] Only match participants can chat
- [ ] Only client can approve completion
- [ ] Only users in match can rate
- [ ] Proposal unique per pro per request

---

## Tools & Dependencies

**Already installed:**
- ✅ Next.js 16
- ✅ React Hook Form
- ✅ shadcn/ui
- ✅ Zod
- ✅ Prisma
- ✅ Tailwind CSS

**Need to install:**
```bash
npm install react-star-ratings
npm install socket.io-client  # For future real-time upgrade
```

---

## Timeline (Aggressive - 2 Weeks)

### Week 1
- Mon-Tue: Request creation UI (4h)
- Tue-Wed: Proposal & match list pages (4h)
- Wed-Fri: Chat interface (6h)
- Fri: Testing & bug fixes (2h)

### Week 2
- Mon-Tue: Work completion & rating UI (5h)
- Tue-Wed: WhatsApp integration (3h)
- Wed-Fri: Polish, testing, bug fixes (6h)
- Fri: Deploy to staging & test full flow

---

## Known Risks & Mitigations

### Risk 1: Chat Performance
**Issue:** Polling every 2 seconds might be slow
**Mitigation:** Start with polling, add WebSocket in v2 if needed

### Risk 2: Mandatory Rating Blocking
**Issue:** Users might get stuck if can't rate
**Mitigation:** Admin can force-close matches if needed (add later)

### Risk 3: Missing API Validation
**Issue:** Some endpoints might accept bad data
**Mitigation:** Audit all endpoints, add Zod schemas

---

## Post-Sprint Roadmap

### Week 3-4 (v2 Improvements)
- [ ] Real-time chat (WebSocket)
- [ ] Advanced request search (filters, geo-radius)
- [ ] Message templates (quick responses)
- [ ] Dispute system (basic support escalation)
- [ ] Rating analytics dashboard

### Week 5+ (Additional Features)
- [ ] Digital contract generation
- [ ] Escrow payment system
- [ ] Professional badges (top-rated, trusted)
- [ ] In-app notifications (push, email)
- [ ] Analytics for professionals

---

## Estimated Effort

**Frontend:** 25-30 hours
**Backend:** 5-10 hours
**Testing:** 5-10 hours
**Deployment:** 2-3 hours

**Total:** ~40-50 hours (5-6 days intensive development)

---

## Sign-Off Checklist

Before launch:
- [ ] All pages load without errors
- [ ] Full flow tested end-to-end
- [ ] Mobile design tested
- [ ] No TypeScript errors
- [ ] Error handling on all forms
- [ ] API responses validated
- [ ] Database migrations run clean
- [ ] Staging deployment successful
- [ ] User documentation ready
- [ ] Admin knows how to support users

---

## Next Action

**Start this week:**
1. Create empty files for all pages/components (scaffolding)
2. Setup Zod schemas for validation
3. Review existing API endpoints
4. Begin request creation UI

**Expected launch:** December 23, 2025 ✅

---

**Status:** Ready to start 🚀
**Confidence:** 95% (API is 90% ready, mostly UI work)
**Risk Level:** Low (all models exist, well-tested)
