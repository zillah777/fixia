# Phase 3: Testing & Deployment Guide

**Date:** December 10, 2025
**Objective:** Complete final testing and deploy to production
**Estimated Time:** 3-4 hours

---

## Testing Plan

### 1. Development Environment Verification ✅

**Current Status:**
- ✅ Dev server running on localhost:3000
- ✅ Health endpoint responds: `{"status":"healthy","database":"connected"}`
- ✅ PostgreSQL database connected
- ✅ All migrations applied
- ✅ No TypeScript compilation errors
- ✅ No runtime errors in console

**Verification Commands:**
```bash
# Check dev server
curl http://localhost:3000/api/health

# Check database connection
npx prisma db execute --stdin < /dev/null

# List all migrations
npx prisma migrate status

# Check for TypeScript errors (already done)
npx tsc --noEmit
```

---

### 2. Manual End-to-End Testing (1 hour)

**Prerequisites:**
- 2 test accounts (1 CLIENT, 1 PROFESSIONAL)
- Both verified
- Professional subscribed

**Test Scenario: Complete Marketplace Transaction**

#### Step 1: Create Request (Client)
```
1. Login as CLIENT account
2. Navigate to Dashboard → Create Request
3. Fill in:
   - Title: "Reparación de Aire Acondicionado"
   - Description: "Aire acondicionado no enfría, revisar"
   - Budget: 5000
   - Category: "HVAC"
   - Location: [Select location]
4. Upload 2-3 images
5. Click "Create Request"
6. Verify request appears in "My Requests"
```

**Expected Result:** Request created successfully, visible in request list ✅

---

#### Step 2: Browse & Submit Proposal (Professional)
```
1. Logout, login as PROFESSIONAL
2. Navigate to Dashboard → Opportunities
3. Find the request you just created
4. Click on request detail
5. Fill proposal form:
   - Price: 4500
   - Message: "Puedo reparar en 2 horas"
6. Click "Send Proposal"
7. Verify toast: "Propuesta enviada exitosamente"
```

**Expected Result:** Proposal submitted, visible in professional's proposals ✅

---

#### Step 3: Accept Proposal & Create Match (Client)
```
1. Logout, login as CLIENT
2. Navigate to Dashboard → My Requests
3. Click on your request
4. Scroll to Proposals section
5. Find professional's proposal
6. Click "Accept Proposal"
7. Verify match created
8. Verify navigation to Matches view
```

**Expected Result:** Match created, both users can chat ✅

---

#### Step 4: Real-Time Chat (Both)
```
CLIENT:
1. Navigate to Dashboard → Matches
2. See match with professional
3. Type message: "Hola, ¿cuándo puedes venir?"
4. Click send

PROFESSIONAL (30 seconds later):
1. Refresh or let polling update (5 seconds)
2. See client's message
3. Type reply: "Puedo venir mañana a las 10"
4. Send message

CLIENT:
1. See professional's reply
2. Type: "Perfecto, te espero"
3. Send message

PROFESSIONAL:
1. See client's reply
```

**Expected Result:** Real-time messaging works with 5-second polling ✅

---

#### Step 5: Mark Work Complete (Professional)
```
PROFESSIONAL:
1. In chat header, see "Marcar Trabajo como Completado" button
2. Click button
3. Textarea expands
4. Enter description: "Cambié el refrigerante y reparé el compresor. Todo funcionando correctamente"
5. Click "Enviar"
6. Verify toast: "Trabajo marcado como completado. Esperando aprobación del cliente."
7. Verify status shows: "Profesional: ✓ Confirmó"
8. Status shows: "Cliente: ⏳ Pendiente"
```

**Expected Result:** Professional work completion submitted ✅

---

#### Step 6: Approve Work Completion (Client)
```
CLIENT:
1. Refresh match chat
2. In header, see work completion form with alert:
   "¿El trabajo se ha completado correctamente?"
3. Two buttons: "Sí, Completado" and "No, Rechazar"
4. Click "Sí, Completado"
5. Verify toast: "Trabajo aprobado como completado."
6. Status updates: "Cliente: ✓ Confirmó"
7. Both users see: "Profesional: ✓ Confirmó" and "Cliente: ✓ Confirmó"
```

**Expected Result:** Work marked as complete ✅

---

#### Step 7: Rating Gate Appears (Both)
```
CLIENT:
1. After work completion, rating gate appears in header
2. Shows:
   - "Necesitas calificar a Profesional"
   - "Calificar" button
   - Status: "Profesional: ⏳ Pendiente"

PROFESSIONAL (same scenario):
1. Rating gate appears
2. Shows:
   - "Necesitas calificar a Cliente"
   - "Calificar" button
   - Status: "Cliente: ⏳ Pendiente"
```

**Expected Result:** Rating gate component appears correctly ✅

---

#### Step 8: Submit Ratings (Both)
```
CLIENT:
1. Click "Calificar" button
2. ReviewDialog modal opens
3. Select 5 stars
4. Enter comment: "Excelente trabajo, muy profesional y rápido"
5. Click "Enviar Reseña"
6. Toast: "¡Reseña enviada exitosamente!"
7. Page reloads
8. Rating gate now shows: "Tú: ✓ Has calificado"
9. Status shows: "Profesional: ⏳ Pendiente"

PROFESSIONAL (3-5 seconds later):
1. Polling updates
2. Sees client's rating was submitted
3. Professional's status shows: "Cliente: ✓ Ha calificado"
4. Same flow: Click "Calificar"
5. Select 4 stars
6. Enter comment: "Cliente muy atento y responsable"
7. Submit rating
8. Page reloads
```

**Expected Result:** Both users rate each other successfully ✅

---

#### Step 9: Both Ratings Complete (Both)
```
CLIENT & PROFESSIONAL:
1. After professional rates
2. Rating gate shows success:
   "¡Ambos han calificado! Este match está cerrado."
3. Toast notification: "¡Ambos han calificado! Match cerrado."
4. Matches list refreshed
5. This match now shows as "Completed" with ratings visible
```

**Expected Result:** Match fully completed with both ratings ✅

---

### 3. Component Testing Checklist

#### Work Completion Form
- [ ] Form shows "Marcar Trabajo como Completado" button (professionals)
- [ ] Form shows approval buttons (clients)
- [ ] Comment required for professionals
- [ ] Comment validation works
- [ ] Status displays correctly after submission
- [ ] Both parties see status updates
- [ ] Toast notifications appear
- [ ] Form hides after work marked complete

#### Rating Gate
- [ ] Appears only after work is completed
- [ ] Shows correct status for both users
- [ ] Polling updates status every 3 seconds
- [ ] Calificar button works
- [ ] Success message shows when both rated
- [ ] Doesn't re-render unnecessarily
- [ ] Mobile responsive (buttons stack on small screens)

#### Chat System
- [ ] Messages display correctly
- [ ] New messages appear within 5 seconds (polling)
- [ ] WhatsApp button works
- [ ] User avatars display
- [ ] Timestamps show correctly
- [ ] Message input clears after send
- [ ] Loading states appear

#### Services Page
- [ ] Page accessible only to professionals
- [ ] Can create new service
- [ ] Can delete service
- [ ] Service list updates after CRUD
- [ ] Form validation works
- [ ] Category selector works
- [ ] Price displays correctly

---

### 4. Mobile Responsiveness Testing (30 minutes)

**Devices to Test:**
- [ ] iPhone 12/13 (375px width)
- [ ] iPad (768px width)
- [ ] Android phone (360px width)
- [ ] Desktop (1920px width)

**Areas to Test:**
- [ ] Chat header layout responsive
- [ ] Work completion form readable
- [ ] Rating gate buttons stack correctly
- [ ] Review dialog modal fits screen
- [ ] Messages scroll properly
- [ ] Input fields accessible
- [ ] No horizontal scroll
- [ ] Touch targets > 44px

**Testing Approach:**
```bash
# Use Chrome DevTools
1. Open DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Select different device presets
4. Test all scenarios above
5. Check landscape orientation
```

---

### 5. Cross-Browser Testing (15 minutes)

**Browsers:**
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

**Test Points:**
- [ ] All features work
- [ ] Styling consistent
- [ ] No console errors
- [ ] Responsive layout correct
- [ ] Modal dialogs display properly
- [ ] Forms submit correctly

---

### 6. Performance Testing (15 minutes)

**Measurements:**
```bash
# Test API response times
curl -w "@curl-format.txt" http://localhost:3000/api/health

# Load test with Apache Bench
ab -n 100 -c 10 http://localhost:3000/api/health

# Monitor database queries
# Check database logs for slow queries
```

**Targets:**
- [ ] API response < 100ms
- [ ] Page load < 2s on 3G
- [ ] No memory leaks
- [ ] Polling doesn't cause jank
- [ ] Smooth scrolling in chat

---

### 7. Error Scenario Testing (15 minutes)

**Network Errors:**
- [ ] Simulate network timeout
  - Turn off WiFi, try to send message
  - Expected: Error toast, message input cleared
- [ ] Simulate network slow
  - Throttle to slow 3G
  - Expected: Loading indicators appear
- [ ] No internet, then reconnect
  - Expected: Auto-retry, data syncs

**User Errors:**
- [ ] Professional tries to rate without comment
  - Expected: Validation error
- [ ] Send empty message
  - Expected: Prevented by button disable
- [ ] Try to create duplicate proposal
  - Expected: Error message (unique constraint)

**Edge Cases:**
- [ ] Both users approve work simultaneously
  - Expected: Handled gracefully
- [ ] Both users rate simultaneously
  - Expected: Both ratings saved
- [ ] User navigates away during submission
  - Expected: Request completes, data saved

---

## Testing Checklist

### Phase 3 Testing Checklist

**Development Environment (DONE ✅)**
- [x] Dev server running
- [x] Health endpoint responds
- [x] Database connected
- [x] No compilation errors

**Manual End-to-End (IN PROGRESS)**
- [ ] Request creation works
- [ ] Proposal submission works
- [ ] Match creation works
- [ ] Chat messaging works
- [ ] Work completion submission works
- [ ] Work completion approval works
- [ ] Rating gate appears
- [ ] Rating submission works
- [ ] Both parties can rate
- [ ] Success message displays

**Component Testing (NEXT)**
- [ ] Work completion form renders
- [ ] Rating gate renders
- [ ] Status updates work
- [ ] Polling detects changes
- [ ] Mobile responsive
- [ ] Toast notifications work

**Mobile Testing (NEXT)**
- [ ] iPhone responsiveness
- [ ] Android responsiveness
- [ ] Touch interactions work
- [ ] Forms accessible

**Browser Testing (NEXT)**
- [ ] Chrome works
- [ ] Firefox works
- [ ] Safari works
- [ ] Edge works

**Performance (NEXT)**
- [ ] API fast (<100ms)
- [ ] Page load fast (<2s)
- [ ] No memory leaks
- [ ] Smooth interactions

**Error Scenarios (NEXT)**
- [ ] Network errors handled
- [ ] User errors prevented
- [ ] Edge cases work

---

## Deployment Steps

### Pre-Deployment (30 minutes)

```bash
# 1. Verify all code committed
git status
git log --oneline -5

# 2. Create database backup
pg_dump -U postgres fixia > fixia_backup_$(date +%Y%m%d_%H%M%S).sql

# 3. Verify current migrations
npx prisma migrate status

# 4. Build production version
npm run build

# 5. Check for errors
echo $?  # Should be 0
```

### Deployment (15 minutes)

```bash
# 1. Deploy with Docker
docker compose down
docker compose build
docker compose up -d

# 2. Verify health
curl http://localhost:3000/api/health

# 3. Check logs
docker compose logs app

# 4. Monitor for errors
docker compose logs -f app | grep -i error
```

### Post-Deployment (30 minutes)

```bash
# 1. Test basic endpoints
curl http://localhost:3000/api/health
curl -X GET http://localhost:3000/api/matches

# 2. Monitor error logs
docker compose logs app | tail -50

# 3. Check database integrity
npx prisma db push --skip-generate

# 4. Run quick smoke tests
# - Navigate to key pages
# - Test one complete workflow
# - Verify no console errors
```

---

## Rollback Plan

**If Issues Occur:**

```bash
# 1. Stop current deployment
docker compose down

# 2. Restore from backup
psql -U postgres fixia < fixia_backup_YYYYMMDD_HHMMSS.sql

# 3. Restart previous version
docker compose up -d

# 4. Verify
curl http://localhost:3000/api/health

# 5. Investigate issue in dev environment
# 6. Create fix and re-deploy
```

---

## Sign-Off Criteria

**Testing Complete When:**
- ✅ All manual tests pass
- ✅ Mobile works on multiple devices
- ✅ Browsers all supported
- ✅ Performance acceptable
- ✅ Error handling works
- ✅ No critical bugs found

**Deployment Complete When:**
- ✅ Production health check passes
- ✅ No errors in logs
- ✅ Sample requests work
- ✅ Database integrity verified
- ✅ Quick smoke test passes

---

## Timeline

| Phase | Duration | Status |
|-------|----------|--------|
| Manual E2E Testing | 1 hour | ⏳ IN PROGRESS |
| Mobile Testing | 30 min | ⏳ NEXT |
| Browser Testing | 15 min | ⏳ NEXT |
| Performance Test | 15 min | ⏳ NEXT |
| Error Scenarios | 15 min | ⏳ NEXT |
| **Testing Total** | **2.5 hours** | ⏳ |
| Pre-Deployment | 30 min | ⏳ |
| Deployment | 15 min | ⏳ |
| Post-Deployment | 30 min | ⏳ |
| **Deployment Total** | **1.25 hours** | ⏳ |
| **GRAND TOTAL** | **3.75 hours** | ⏳ |

---

## Notes

### Important
- **Backup database before any migration**
- **Test in development environment first**
- **Have rollback plan ready**
- **Monitor logs for 24 hours post-deployment**
- **Keep backup for 7 days minimum**

### Monitoring Post-Launch
```bash
# Monitor real-time logs
docker compose logs -f app

# Check error rate
grep -i error /var/log/app.log | wc -l

# Monitor database performance
psql -U postgres -d fixia -c "SELECT * FROM pg_stat_statements LIMIT 10;"

# Check API response times
# Set up monitoring dashboard (optional)
```

---

## Success Criteria

✅ **When MVP Launch is Complete:**
1. All manual tests pass
2. Mobile devices work correctly
3. Production deployment successful
4. Health endpoint returns 200
5. Sample workflows execute without errors
6. Error logs show no critical issues
7. Users can complete full transaction
8. Ratings saved correctly
9. All features functional

**Status:** Ready for Phase 3 Execution 🚀
