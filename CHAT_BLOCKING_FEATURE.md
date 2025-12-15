# Chat Blocking Feature - When Both Users Have Rated

**Date:** December 15, 2025
**Feature:** Automatic chat closure when both Client and Professional users complete their ratings
**Status:** ✅ IMPLEMENTED

---

## Overview

When a match is marked as **COMPLETED** and **BOTH users have submitted their ratings**, the chat conversation is automatically **CLOSED** and disabled for both parties.

### Expected Behavior

| Scenario | Chat Status | Input | Message |
|----------|-------------|-------|---------|
| Match in progress | ✅ Active | Enabled | "Escribe un mensaje..." |
| Match complete, waiting for ratings | ✅ Active | Enabled | "Escribe un mensaje..." |
| Both have rated | ❌ Closed | Disabled | "Conversación finalizada. Ambos usuarios han completado las calificaciones." |

---

## Technical Implementation

### 1. API-Level Blocking (Messages POST)

**File:** `src/app/api/messages/route.ts`

The POST endpoint now validates if a match is "fully rated" before accepting messages:

```typescript
// Check if both users have rated (match is fully closed)
if (match.isCompleted) {
    const reviews = await prisma.review.findMany({
        where: { matchId },
        select: { authorId: true }
    });

    const clientHasRated = reviews.some(r => r.authorId === match.clientId);
    const providerHasRated = reviews.some(r => r.authorId === match.providerId);

    // If both have rated, conversation is closed
    if (clientHasRated && providerHasRated) {
        return new NextResponse(
            JSON.stringify({
                error: "Esta conversación ha finalizado. Ambos usuarios han completado las calificaciones."
            }),
            { status: 410 }  // HTTP 410 Gone
        );
    }
}
```

**Status Code:** `410 Gone` - Indicates the resource (conversation) is no longer available

**Error Message (Spanish):** "Esta conversación ha finalizado. Ambos usuarios han completado las calificaciones."

### 2. Frontend Blocking (UI Layer)

**File:** `src/app/dashboard/matches/page.tsx`

The matches page conditionally renders either:
- **Chat input form** - If conversation is still active
- **Closed message** - If both users have rated

```typescript
{selectedMatch.isCompleted && haveMutualReviews(selectedMatch) ? (
    <div className="flex items-center justify-center gap-2 p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-900">
        <CheckCircle2 className="h-4 w-4" />
        <span>Conversación finalizada. Ambos usuarios han completado las calificaciones.</span>
    </div>
) : (
    // Chat input form
)}
```

### 3. Error Handling

When user attempts to send a message on a closed conversation:

```typescript
} else if (res.status === 410) {
    // Match is closed - both users have rated
    const error = await res.json()
    toast.error(error.error || "Esta conversación ha finalizado")
    // Refresh to update UI
    setRatingRefreshTrigger(prev => prev + 1)
}
```

---

## Data Flow

### Message Sending Flow (Complete)

```
1. User types message and clicks "Enviar"
   ↓
2. Frontend calls POST /api/messages
   ↓
3. API validates:
   - User is authenticated ✓
   - User belongs to match ✓
   - Match exists ✓
   - Match is completed?
      ↓ YES
   - Both users rated?
      ↓ YES → Return 410 Gone ❌
      ↓ NO  → Allow message ✅
   ↓
4. Frontend handles response:
   - 200 OK → Show message in chat ✅
   - 410 Gone → Show error toast + refresh UI ❌
```

### Rating Completion Flow

```
1. User rates from RatingGate component
   ↓
2. ReviewDialog submits rating via POST /api/reviews
   ↓
3. Rating is saved to database
   ↓
4. onSuccess callback fires
   ↓
5. setRatingRefreshTrigger() increments state
   ↓
6. RatingGate re-checks reviews for this match
   ↓
7. If both rated:
   - RatingGate shows: "¡Ambos han calificado! Match cerrado."
   - onBothRated() callback fires
   - fetchMatches() refreshes conversation list
   ↓
8. Matches page detects haveMutualReviews() returns true
   ↓
9. Chat input replaced with closed message
```

---

## Database Validation

The implementation relies on the `Review` model unique constraint:

```prisma
model Review {
  id        String   @id @default(uuid())
  matchId   String
  authorId  String
  targetId  String
  score     Int
  comment   String?

  @@unique([matchId, authorId])  // One review per author per match
}
```

This ensures:
- A user can only submit ONE review per match
- The database guarantees data integrity
- The API can safely check for both reviews

---

## User Experience

### For Client User

1. **During Work**
   - Chat is available
   - Can coordinate with Professional

2. **Work Complete**
   - "Necesitas calificar a el profesional" message appears
   - Can click "Calificar" to submit rating

3. **After Rating**
   - If Professional hasn't rated yet:
     - Can still chat
     - "Profesional: ⏳ Pendiente" status shown
   - If Professional has rated:
     - Chat disabled
     - "¡Ambos han calificado! Match cerrado." message shown

### For Professional User

- Same flow from Professional perspective
- Chat closes when both have rated

---

## Edge Cases Handled

✅ **User refreshes page**
- Frontend checks haveMutualReviews() on load
- Chat is immediately disabled if needed

✅ **User tries to send message after both rated**
- API returns 410 Gone
- Frontend shows error toast
- UI state is refreshed

✅ **One user rates, other doesn't yet**
- Chat remains active
- RatingGate shows pending status

✅ **Both users rate simultaneously**
- Whichever completes first triggers closure
- Second user sees chat disabled when they refresh

✅ **Network error during message send**
- User sees error toast
- Message is not sent (input is restored)
- Chat remains available for retry

---

## Commit Information

**Commit:** `9ef7239`
**Message:** "feat: implement chat blocking when both users have rated"

---

## Testing Checklist

- [ ] User can send messages before both rate
- [ ] User sees RatingGate prompts after completion
- [ ] User can submit rating successfully
- [ ] Chat input disappears when both rate
- [ ] User sees "Conversación finalizada" message
- [ ] Attempting to send message after closure shows error
- [ ] Error handling works correctly
- [ ] UI updates immediately (no page refresh needed)
- [ ] Works on mobile and desktop

---

## Related Features

- **Review/Rating System** - See [REVIEW_FIX_SUMMARY.md](./REVIEW_FIX_SUMMARY.md)
- **Work Completion Form** - Marks match as `isCompleted`
- **RatingGate Component** - Detects when both users have rated
- **Matches Dashboard** - Shows chat and rating status

---

## Future Enhancements

1. **Archive Conversations** - Option to view closed conversations without reopening
2. **Rating Reminder Notifications** - Notify users when partner hasn't rated yet
3. **Appeal/Dispute System** - Allow changing rating within 24 hours
4. **Conversation Export** - Let users download chat history before closure
5. **WebSocket Updates** - Real-time notification when partner rates (currently polls every 3 seconds)

---

## Status

✅ **Implementation:** Complete
✅ **API Blocking:** Active
✅ **UI Blocking:** Active
✅ **Build:** Passing
⏳ **Testing:** Pending manual QA

