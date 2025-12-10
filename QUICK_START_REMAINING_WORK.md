# Quick Start - Remaining Work (Phase 2 & 3)

**Time Remaining:** 3-4 hours
**Features:** 2 critical + 1 page completion
**Status:** Phase 1 ✅ COMPLETE

---

## What's Done (Phase 1)
✅ Work Completion System
- API endpoint: `POST /api/matches/[id]/complete`
- Component: `src/components/match/work-completion-form.tsx`
- Database fields added to Match model
- Integrated into matches page header
- Production-ready code

---

## Phase 2: Rating Gate (1-2 hours)

### Quick Overview
Users must rate each other after work marked complete. Can't close match without mutual ratings.

### File to Create
`src/components/match/rating-gate.tsx`

### Key Points
- Don't use Card/CardHeader (too big for header)
- Simple horizontal status display
- Modal only shows to user who hasn't rated
- Can't dismiss modal (remove close button)
- Use existing review-form.tsx and review-dialog.tsx

### Basic Structure
```typescript
"use client"

export function RatingGate({
  matchId: string
  clientId: string
  providerId: string
  currentUserId: string
  onBothRated: () => void
}) {
  const [userHasRated, setUserHasRated] = useState(false)
  const [otherHasRated, setOtherHasRated] = useState(false)

  // Check if both have rated on mount
  useEffect(() => {
    fetchRatingStatus()
  }, [])

  // If current user hasn't rated, show modal with ReviewDialog
  // If current user has rated, show status of both users
  // When both have rated, call onBothRated()
}
```

### Integration
Add to `src/app/dashboard/matches/page.tsx` after WorkCompletionForm:
```typescript
{selectedMatch.isCompleted && (
  <RatingGate
    matchId={selectedMatch.id}
    clientId={selectedMatch.clientId}
    providerId={selectedMatch.providerId}
    currentUserId={currentUser?.id || ""}
    onBothRated={() => {
      // Close modal or refresh
      fetchMatches()
    }}
  />
)}
```

### API Calls
- GET `/api/reviews?matchId=X` - Check who has rated
- POST `/api/reviews` - Submit rating (already wired)

---

## Phase 3: Services Page (2 hours)

### Quick Overview
CRUD page for professionals to manage their services.

### File to Edit
`src/app/dashboard/services/page.tsx` (currently 41-line stub)

### Key Features
```
┌─ Page Layout
├─ Header: "Mis Servicios" + "Create New Service" button
├─ Empty State: If no services, show icon + CTA
└─ Grid: Display all services with edit/delete buttons

┌─ Create Flow
├─ Click "Create New Service"
├─ Modal opens with form
├─ Fill: Title, Description, Category, Price, Images (optional), Tags (optional)
└─ Submit → POST /api/services → Refresh list

┌─ Edit Flow
├─ Click edit button on card
├─ Modal opens with pre-filled data
└─ Submit → PATCH /api/services/[id] → Update list

┌─ Delete Flow
├─ Click delete button
├─ Confirm dialog
└─ DELETE /api/services/[id] → Remove from list
```

### Basic Structure
```typescript
"use client"

export default function ServicesPage() {
  const { user } = useAuth()
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingService, setEditingService] = useState(null)

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    const res = await fetch('/api/services')
    setServices(await res.json())
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Mis Servicios</h1>
        <Button onClick={() => setShowModal(true)}>
          + Nuevo Servicio
        </Button>
      </div>

      {services.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map(s => (
            <ServiceCard
              key={s.id}
              service={s}
              onEdit={() => setEditingService(s)}
              onDelete={() => handleDelete(s.id)}
            />
          ))}
        </div>
      )}

      {/* Form Modal */}
      <ServiceFormDialog
        open={showModal || !!editingService}
        onOpenChange={...}
        service={editingService}
        onSubmit={...}
      />
    </div>
  )
}
```

### Form Fields
- **Title** (text, required)
- **Description** (textarea, required)
- **Category** (dropdown, required) - Use existing categories
- **Price** (number, required) - Decimal format
- **Images** (upload, optional) - Multiple, use Cloudinary
- **Tags** (chips, optional) - Max 5

### Components to Use
- Existing `service-card.tsx` - Display cards
- Existing `services-manager.tsx` - Check for form
- shadcn/ui `Button`, `Dialog`, `Input`, `Textarea`, `Select`

---

## Testing Checklist

### Rating Gate
- [ ] Work marked complete
- [ ] Modal appears (can't dismiss)
- [ ] User can rate
- [ ] Rating saved
- [ ] Other user sees pending status
- [ ] Both rated → Modal closes
- [ ] Toast notification shows

### Services Page
- [ ] Create service with all fields
- [ ] Service appears in grid
- [ ] Edit service (change price)
- [ ] Changes save
- [ ] Delete service (confirm dialog)
- [ ] Service removed from list
- [ ] Empty state shows initially
- [ ] Responsive grid (1/2/3 columns)
- [ ] Test on mobile device

---

## Build & Deploy

### Dev Testing
```bash
npm run dev
# Navigate to localhost:3000
# Test features manually
```

### Build Check
```bash
npm run build
# Should complete without errors
# Check for TypeScript errors
```

### Production Deploy
```bash
# Build Docker image
docker compose build

# Deploy
docker compose up -d

# Verify
curl http://localhost:3000/api/health
# Should return: {"status":"healthy","database":"connected"}
```

---

## API Endpoints (Existing - Use These)

### Reviews
- `GET /api/reviews?matchId=X` - Get reviews for match
- `POST /api/reviews` - Create review
  ```json
  {
    "matchId": "...",
    "targetId": "...",
    "score": 5,
    "comment": "..."
  }
  ```

### Services
- `GET /api/services` - List user's services
- `POST /api/services` - Create service
  ```json
  {
    "title": "...",
    "description": "...",
    "categoryId": "...",
    "price": 5000,
    "images": ["..."],
    "tags": ["..."]
  }
  ```
- `PATCH /api/services/[id]` - Update service
- `DELETE /api/services/[id]` - Delete service

---

## Common Pitfalls to Avoid

❌ **Don't:**
- Try to redesign existing components
- Add "nice-to-have" features
- Change database schema
- Rebuild rating system (already works)
- Make complex form validations

✅ **Do:**
- Use existing components as-is
- Focus on integrating + wrapping existing functionality
- Keep component small and focused
- Use simple form validation (required fields)
- Test manually with real account

---

## Time Tracking

| Task | Estimated | Notes |
|------|-----------|-------|
| Rating Gate Component | 45 min | Mostly integration |
| Rating Gate Integration | 30 min | Add to matches page |
| Rating Gate Testing | 15 min | Quick manual test |
| Services Page Creation | 60 min | CRUD form + grid |
| Services Page Testing | 30 min | Create/edit/delete flow |
| Responsive Design | 15 min | Mobile viewport check |
| Bug Fixes | 15 min | Handle edge cases |
| **TOTAL** | **3.5 hours** | Ready to deploy |

---

## Success Criteria

### Rating Gate ✅
- [ ] Modal prevents dismissal
- [ ] Both users must rate to close match
- [ ] Status shows clearly (✓ done, ⏳ waiting)
- [ ] No database errors
- [ ] Works on mobile

### Services Page ✅
- [ ] Can create service
- [ ] Can edit service
- [ ] Can delete service
- [ ] All CRUD operations work
- [ ] Responsive grid layout
- [ ] Empty state shows

### Overall ✅
- [ ] No TypeScript errors
- [ ] Dev server runs clean
- [ ] All features work together
- [ ] No regressions in existing features
- [ ] Ready for production

---

## Resources

### Existing Components to Reference
- `src/components/reviews/review-dialog.tsx` - Rating dialog pattern
- `src/components/reviews/review-form.tsx` - Rating form implementation
- `src/components/services/service-card.tsx` - Service display
- `src/app/dashboard/requests/[id]/page.tsx` - Form modal pattern

### Existing Pages to Reference
- `src/app/dashboard/requests/page.tsx` - CRUD list pattern
- `src/app/dashboard/portfolio/page.tsx` - Gallery/list pattern
- `src/app/dashboard/settings/page.tsx` - Complex form pattern

### API to Review
- `src/app/api/reviews/route.ts` - Review endpoints
- `src/app/api/services/*` - Service endpoints
- `src/app/api/matches/[id]/complete/route.ts` - New endpoint reference

---

## Next Steps

1. **Start with Rating Gate** (simpler)
   - Create component file
   - Add modal for rating
   - Integrate into page
   - Test 5 minutes

2. **Then Services Page** (more code)
   - Complete stub file
   - Add CRUD functions
   - Test 5 minutes

3. **Quick final testing**
   - Full workflow test
   - Mobile check
   - Build verification

4. **Deploy**
   - Run migration (if any)
   - Deploy code
   - Monitor logs

**Estimated total time: 3-4 hours** ⏱️

Ready? Let's go! 🚀
