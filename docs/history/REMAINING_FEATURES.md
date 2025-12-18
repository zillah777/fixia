# Remaining Features - Phase 2 & 3

**Total Remaining Work:** 3-4 hours
**Features:** 2 critical features + Services page completion

---

## Feature #2: Mandatory Rating Gate (1-2 hours)

### Purpose
Force users to rate each other after work is marked complete. Prevents match closure without mutual ratings.

### Workflow
1. Work marked complete by both parties
2. System shows rating modal (can't dismiss)
3. Professional must rate client (1-5 stars + optional comment)
4. Client must rate professional (1-5 stars + optional comment)
5. Only after both rate → Match fully closes
6. Unrated matches show warning banner in messages list

### What Exists
- ✅ `src/components/reviews/review-form.tsx` - Standalone rating form (already complete)
- ✅ `src/components/reviews/review-dialog.tsx` - Rating dialog wrapper (already complete)
- ✅ `/api/reviews` endpoint - Creates review records (already complete)
- ✅ Database schema: Review model with unique constraint on (matchId, authorId)

### What Needs Building
1. **Rating Gate Modal** - Force-show modal when `isCompleted=true` and user hasn't rated
2. **Rating Status Display** - Show who has rated who
3. **Integration Point** - Hook into matches/page.tsx after work completion
4. **Toast Notifications** - Notify user when rating is received

### Estimated Implementation

**Component: `src/components/match/rating-gate.tsx`** (100-120 lines)
```typescript
export function RatingGate({
  matchId: string
  clientId: string
  providerId: string
  currentUserId: string
  onBothRated: () => void  // Callback when both have rated
}) {
  // State
  const [userRating, setUserRating] = useState(false)
  const [otherRating, setOtherRating] = useState(false)
  const [loading, setLoading] = useState(false)

  // Show modal if:
  // - Match is completed AND
  // - Current user hasn't rated yet

  // Display both users' rating status
  // Allow user to submit rating if they haven't
  // Call onBothRated() when both have rated
}
```

**Integration Point: `src/app/dashboard/matches/page.tsx`**
```typescript
// After WorkCompletionForm, inside chat header:
{selectedMatch.isCompleted && (
  <RatingGate
    matchId={selectedMatch.id}
    clientId={selectedMatch.clientId}
    providerId={selectedMatch.providerId}
    currentUserId={currentUser?.id || ""}
    onBothRated={() => {
      // Refresh match data or close chat
      fetchMatches()
    }}
  />
)}
```

### Key Details
- Modal should NOT be dismissible (use Dialog without close button)
- Show progress: "You have rated. Waiting for other user..."
- Show visual indicators: ✓ for rated, ⏳ for pending
- Only show modal to the current user
- Other user sees reading-only status display
- Ban user from creating new requests/accepting proposals if 2+ unrated matches

---

## Feature #3: Services Page Completion (2 hours)

### Current State
File: `src/app/dashboard/services/page.tsx` (41 lines - mostly empty stub)

### Purpose
Allow professionals to:
- View their published services
- Create new services
- Edit existing services
- Delete services

### Workflow
1. **List View:**
   - Grid of service cards
   - Shows title, description, price, category
   - Edit/Delete buttons on each
   - "Create New Service" button at top

2. **Create Service:**
   - Modal/form with:
     - Title (required)
     - Description (required)
     - Category dropdown
     - Price (required, number)
     - Images upload (optional, multiple)
     - Tags (optional, max 5)
   - Submit → POST `/api/services`
   - Success → Add to list

3. **Edit Service:**
   - Modal pre-fills with current data
   - Same fields as create
   - Submit → PATCH `/api/services/[id]`
   - Success → Update in list

4. **Delete Service:**
   - Confirm dialog
   - DELETE `/api/services/[id]`
   - Remove from list

### What Exists
- ✅ `src/components/services/service-card.tsx` - Service display card
- ✅ `src/components/settings/services-manager.tsx` - Service management component (might have form)
- ✅ `/api/services` endpoint (GET/POST/PATCH/DELETE)
- ✅ Database schema: Service model with all required fields

### What Needs Building
**File: `src/app/dashboard/services/page.tsx`** (150-200 lines)

```typescript
"use client"

export default function ServicesPage() {
  const { user } = useAuth()
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingService, setEditingService] = useState(null)

  // Fetch services on mount
  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    const res = await fetch('/api/services')
    const data = await res.json()
    setServices(data)
  }

  const handleCreate = async (formData) => {
    const res = await fetch('/api/services', {
      method: 'POST',
      body: JSON.stringify(formData)
    })
    if (res.ok) {
      const newService = await res.json()
      setServices([...services, newService])
      toast.success('Servicio creado')
    }
  }

  const handleEdit = async (id, formData) => {
    const res = await fetch(`/api/services/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(formData)
    })
    if (res.ok) {
      const updated = await res.json()
      setServices(services.map(s => s.id === id ? updated : s))
      toast.success('Servicio actualizado')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro?')) return
    const res = await fetch(`/api/services/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setServices(services.filter(s => s.id !== id))
      toast.success('Servicio eliminado')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Mis Servicios</h1>
        <Button onClick={() => setShowCreateModal(true)}>
          + Nuevo Servicio
        </Button>
      </div>

      {services.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map(service => (
            <ServiceCard
              key={service.id}
              service={service}
              onEdit={() => setEditingService(service)}
              onDelete={() => handleDelete(service.id)}
            />
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      <ServiceFormDialog
        open={showCreateModal || !!editingService}
        onOpenChange={(open) => {
          if (!open) {
            setShowCreateModal(false)
            setEditingService(null)
          }
        }}
        service={editingService}
        onSubmit={editingService ? handleEdit : handleCreate}
      />
    </div>
  )
}
```

### Component Dependencies
- `ServiceCard` from `src/components/services/service-card.tsx`
- May need to create `ServiceFormDialog` if doesn't exist
- Use existing `services-manager.tsx` for form if has one

### Key Details
- Only show user's own services (filter by `providerId`)
- Category selector should match database categories
- Images: Use existing Cloudinary upload component
- Price formatting: Show with currency
- Tags: Use chip/badge component
- Responsive grid: 1 column mobile, 2-3 desktop
- Empty state: Show "Create your first service" with icon
- Loading state: Skeleton cards while fetching

---

## Implementation Order

### Phase 1 ✅ DONE
- [x] Work Completion Feature
  - Database schema
  - API endpoint
  - UI component
  - Integration

### Phase 2 (NEXT - 3 hours)
1. **Rating Gate Modal** (1-2 hours)
   - Create component
   - Integrate into matches page
   - Add warning banner to match list

2. **Services Page** (2 hours)
   - Complete page with CRUD
   - Form dialog or modal
   - Connect to API

### Phase 3 (FINAL - Testing & Polish, 1-2 hours)
- Test full workflow: Request → Proposal → Match → Chat → Complete → Rate
- Mobile responsiveness check
- Error handling verification
- Deploy to production

---

## Testing Strategy

### For Rating Gate
1. Create match with two test users
2. Mark work complete (both approve)
3. Verify modal shows on refresh
4. Professional rates client
5. Verify client sees "Waiting for other user"
6. Client rates professional
7. Verify both users see ✓ checkmarks
8. Verify unrated match warning banner

### For Services Page
1. Go to Services page (empty state)
2. Click "Create Service"
3. Fill form with:
   - Title: "Plomería Básica"
   - Description: "Reparación de tuberías..."
   - Price: 5000
   - Category: "Plomería"
4. Submit
5. Verify appears in list
6. Edit service (change price)
7. Verify changes saved
8. Delete service
9. Verify removed from list
10. Create multiple services (5+)
11. Verify grid layout responsive
12. Test on mobile

---

## Deployment

**Before Production:**
- Test both features thoroughly
- Backup database
- Test migration (if any)
- Monitor error logs

**Production Deployment:**
1. Deploy code
2. Verify endpoints respond
3. Have admin user test workflow
4. Monitor for 24 hours

---

## Estimated Timeline

- **Rating Gate:** 1-2 hours (mostly integration)
- **Services Page:** 2 hours (form building and API connection)
- **Testing:** 1 hour (manual testing both features)
- **Polish:** 30 minutes (styling fixes, error handling)

**Total: 4.5-5 hours**

---

## Success Criteria

✅ **Rating Gate**
- Modal appears when work completed
- Can't dismiss modal
- Both users can rate
- Ratings saved to database
- Both ratings trigger match completion
- Warning banner shows for unrated matches

✅ **Services Page**
- Can create service with all fields
- Can edit existing service
- Can delete service
- List displays all user's services
- Works responsively on mobile
- Integrates with existing service-card component
- Toast notifications on all actions

✅ **Overall**
- No TypeScript errors
- Dev server runs without issues
- Health endpoint responds
- All API endpoints return correct responses
- Mobile-responsive design
- Production-ready code quality

---

## Notes

- Both features build on existing components/APIs
- No new database migrations needed for features 2 & 3
- Keep UI consistent with existing design system
- Use existing shadcn/ui components where possible
- Follow existing code patterns in the codebase
- Test on actual devices, not just browser dev tools
