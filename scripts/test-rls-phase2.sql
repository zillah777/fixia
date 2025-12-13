-- ============================================================================
-- RLS Phase 2 Policy Testing Script - Marketplace Core
-- ============================================================================
-- This script tests the RLS policies for Service, Request, and Proposal tables.
-- Replace user UUIDs with actual values from your database.

-- ============================================================================
-- TEST 1: Setup Test Data (Run once)
-- ============================================================================
-- Skip if you want to test with existing data

-- Create test client user
-- INSERT INTO "User" (id, email, name, role, status, "subscriptionStatus")
-- VALUES ('client-123', 'client@test.com', 'Test Client', 'CLIENT', 'ACTIVE', NULL);

-- Create test professional user with active subscription
-- INSERT INTO "User" (id, email, name, role, status, "subscriptionStatus", "canCreateServices", "canReceiveBookings")
-- VALUES ('pro-456', 'pro@test.com', 'Test Professional', 'PROFESSIONAL', 'ACTIVE', 'active', true, true);

-- ============================================================================
-- TEST 2: Unauthenticated User (No RLS Context)
-- ============================================================================

-- Reset context
SELECT set_config('app.current_user_id', '', true);
SELECT set_config('app.current_user_role', '', true);

-- Should return 0 rows (RLS blocks access)
ECHO 'Unauthenticated - Service count (should be 0):';
SELECT COUNT(*) as service_count FROM "Service";

ECHO 'Unauthenticated - Request count (should be 0):';
SELECT COUNT(*) as request_count FROM "Request";

ECHO 'Unauthenticated - Proposal count (should be 0):';
SELECT COUNT(*) as proposal_count FROM "Proposal";

-- ============================================================================
-- TEST 3: CLIENT User - Request Management
-- ============================================================================

-- Set CLIENT context (replace 'client-123' with actual client UUID)
SELECT set_config('app.current_user_id', 'client-123', true);
SELECT set_config('app.current_user_role', 'CLIENT', true);

ECHO '=== CLIENT USER TESTS ===';

-- Should only see own requests
ECHO 'Client - Own requests:';
SELECT id, title, status FROM "Request" WHERE "clientId"::text = 'client-123';

-- Should not see services (clients don't view service list via RLS)
ECHO 'Client - Service visibility (policy allows public services):';
SELECT COUNT(*) as visible_services FROM "Service";

-- Should see proposals on own requests
ECHO 'Client - Proposals on own requests:';
SELECT p.id, p.price, p.status FROM "Proposal" p
JOIN "Request" r ON p."requestId" = r.id
WHERE r."clientId"::text = 'client-123';

-- Test: Cannot see proposals on other clients' requests
ECHO 'Client - Cannot see proposals on other requests:';
SELECT COUNT(*) as other_proposals FROM "Proposal" p
JOIN "Request" r ON p."requestId" = r.id
WHERE r."clientId"::text != 'client-123';

-- ============================================================================
-- TEST 4: PROFESSIONAL User - Marketplace Browsing
-- ============================================================================

-- Set PROFESSIONAL context (replace 'pro-456' with actual professional UUID)
SELECT set_config('app.current_user_id', 'pro-456', true);
SELECT set_config('app.current_user_role', 'PROFESSIONAL', true);

ECHO '=== PROFESSIONAL USER TESTS ===';

-- Should see own services
ECHO 'Professional - Own services:';
SELECT id, title FROM "Service" WHERE "providerId"::text = 'pro-456';

-- Should see public services from other professionals
ECHO 'Professional - Public services from others (count):';
SELECT COUNT(*) as other_services FROM "Service"
WHERE "providerId"::text != 'pro-456';

-- Should see open requests (for bidding)
ECHO 'Professional - Open requests (for bidding):';
SELECT id, title, budget FROM "Request" WHERE status = 'OPEN' LIMIT 5;

-- Should see own proposals
ECHO 'Professional - Own proposals:';
SELECT id, price, status FROM "Proposal" WHERE "providerId"::text = 'pro-456';

-- Should not see proposals from competitors
ECHO 'Professional - Cannot see competitor proposals:';
SELECT COUNT(*) as other_proposals FROM "Proposal"
WHERE "providerId"::text != 'pro-456';

-- ============================================================================
-- TEST 5: PROFESSIONAL Cannot Propose Twice to Same Request
-- ============================================================================

-- RLS prevents inserting if unique constraint violated
-- SELECT set_config('app.current_user_id', 'pro-456', true);
-- SELECT set_config('app.current_user_role', 'PROFESSIONAL', true);
--
-- Try to insert duplicate proposal (should fail):
-- INSERT INTO "Proposal" ("requestId", "providerId", price, message)
-- VALUES ('request-789', 'pro-456', 100.00, 'Duplicate bid');
-- Expected: Unique constraint violation or 0 rows inserted

-- ============================================================================
-- TEST 6: REQUEST Status Controls Editing
-- ============================================================================

-- Clients can only modify OPEN requests
ECHO '=== REQUEST STATUS & PERMISSIONS ===';

-- Set CLIENT context
SELECT set_config('app.current_user_id', 'client-123', true);
SELECT set_config('app.current_user_role', 'CLIENT', true);

-- Attempt to update OPEN request (should succeed)
-- UPDATE "Request" SET title = 'Updated Title'
-- WHERE id = 'open-request-id' AND status = 'OPEN';

-- Attempt to update MATCHED request (should fail - status != 'OPEN')
-- UPDATE "Request" SET title = 'Updated Title'
-- WHERE id = 'matched-request-id' AND status = 'MATCHED';

-- ============================================================================
-- TEST 7: PROPOSAL Status Controls Editing
-- ============================================================================

-- Professionals can only modify PENDING proposals
ECHO '=== PROPOSAL STATUS & PERMISSIONS ===';

SELECT set_config('app.current_user_id', 'pro-456', true);
SELECT set_config('app.current_user_role', 'PROFESSIONAL', true);

-- Attempt to update PENDING proposal (should succeed)
-- UPDATE "Proposal" SET price = 150.00
-- WHERE id = 'pending-proposal-id' AND status = 'PENDING';

-- Attempt to update ACCEPTED proposal (should fail - status != 'PENDING')
-- UPDATE "Proposal" SET price = 150.00
-- WHERE id = 'accepted-proposal-id' AND status = 'ACCEPTED';

-- ============================================================================
-- TEST 8: ADMIN Override - Full Access
-- ============================================================================

ECHO '=== ADMIN USER TESTS ===';

SELECT set_config('app.current_user_id', 'admin-999', true);
SELECT set_config('app.current_user_role', 'ADMIN', true);

-- Admin should see ALL services
ECHO 'Admin - All services count:';
SELECT COUNT(*) as total_services FROM "Service";

-- Admin should see ALL requests
ECHO 'Admin - All requests count:';
SELECT COUNT(*) as total_requests FROM "Request";

-- Admin should see ALL proposals
ECHO 'Admin - All proposals count:';
SELECT COUNT(*) as total_proposals FROM "Proposal";

-- ============================================================================
-- TEST 9: Marketplace Views
-- ============================================================================

ECHO '=== MARKETPLACE VIEWS ===';

-- Clear context for view testing
SELECT set_config('app.current_user_id', '', true);
SELECT set_config('app.current_user_role', '', true);

-- Public services view (should work without auth)
ECHO 'ServicePublic view count:';
SELECT COUNT(*) as public_services FROM "ServicePublic";

-- Open requests view (for professionals to browse)
ECHO 'RequestOpen view count:';
SELECT COUNT(*) as open_requests FROM "RequestOpen";

-- Marketplace statistics (admin view)
ECHO 'Marketplace statistics:';
SELECT * FROM "MarketplaceStats";

-- ============================================================================
-- TEST 10: Subscription-Based Access Control
-- ============================================================================

ECHO '=== SUBSCRIPTION & FEATURE ACCESS ===';

-- Professional without active subscription cannot create services
-- This is enforced by:
-- 1. INSERT policy checks subscriptionStatus = 'active'
-- 2. INSERT policy checks canCreateServices = true

-- Professional without canReceiveBookings cannot see open requests
-- SELECT set_config('app.current_user_id', 'suspended-pro', true);
-- SELECT set_config('app.current_user_role', 'PROFESSIONAL', true);
-- SELECT COUNT(*) FROM "Request" WHERE status = 'OPEN'; -- Should be 0

-- ============================================================================
-- TEST 11: Public/Private Service Visibility
-- ============================================================================

ECHO '=== SERVICE VISIBILITY BY PROVIDER STATUS ===';

-- Professional with INACTIVE user status should not have public services
-- SELECT set_config('app.current_user_id', '', true);
-- SELECT COUNT(*) FROM "Service"
-- WHERE "providerId" = 'inactive-professional-id'; -- Should be 0

-- Professional with SUSPENDED status should not have public services
-- Similar test for SUSPENDED status

-- ============================================================================
-- TEST 12: Cascade Delete Verification
-- ============================================================================

-- When a Request is deleted, all Proposals should cascade delete
-- DELETE FROM "Request" WHERE id = 'test-request-id';
-- SELECT COUNT(*) FROM "Proposal" WHERE "requestId" = 'test-request-id'; -- Should be 0

-- ============================================================================
-- CLEANUP
-- ============================================================================

-- Always clear the context when done testing
SELECT set_config('app.current_user_id', '', true);
SELECT set_config('app.current_user_role', '', true);

ECHO '=== RLS PHASE 2 TESTS COMPLETE ===';
ECHO 'All policies should be working correctly.';
