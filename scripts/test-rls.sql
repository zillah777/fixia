-- ============================================================================
-- RLS Policy Testing Script
-- ============================================================================
-- This script tests the RLS policies to verify they're working correctly.
-- Run these queries manually against the fixia database.

-- ============================================================================
-- TEST 1: Unauthenticated User (No RLS Context)
-- ============================================================================

-- Reset context
SELECT set_config('app.current_user_id', '', true);
SELECT set_config('app.current_user_role', '', true);

-- Should return 0 rows (RLS blocks access)
SELECT COUNT(*) as user_count FROM "User";
SELECT COUNT(*) as profile_count FROM "Profile";
SELECT COUNT(*) as verification_count FROM "VerificationRequest";

-- ============================================================================
-- TEST 2: Authenticated Client User
-- ============================================================================

-- First, find a CLIENT user ID from the database
-- Replace 'client-uuid-here' with an actual client user ID
SELECT set_config('app.current_user_id', 'client-uuid-here', true);
SELECT set_config('app.current_user_role', 'CLIENT', true);

-- Should only see the current client user
SELECT id, name, role FROM "User";

-- Should not see any profiles (client users don't have profiles or see them differently)
SELECT COUNT(*) FROM "Profile";

-- Should not see any verification requests (they're professional only)
SELECT COUNT(*) FROM "VerificationRequest";

-- ============================================================================
-- TEST 3: Authenticated Professional User
-- ============================================================================

-- Replace 'professional-uuid-here' with an actual professional user ID
SELECT set_config('app.current_user_id', 'professional-uuid-here', true);
SELECT set_config('app.current_user_role', 'PROFESSIONAL', true);

-- Should see themselves
SELECT id, name, role FROM "User";

-- Should see their own profile if it exists
SELECT id, "userId" FROM "Profile";

-- Can create a verification request
-- INSERT INTO "VerificationRequest" ("userId", "idFront", "idBack")
-- VALUES ('professional-uuid-here', 'https://example.com/front.jpg', 'https://example.com/back.jpg');

-- ============================================================================
-- TEST 4: Admin User
-- ============================================================================

-- Replace 'admin-uuid-here' with an actual admin user ID
SELECT set_config('app.current_user_id', 'admin-uuid-here', true);
SELECT set_config('app.current_user_role', 'ADMIN', true);

-- Admin should see ALL users
SELECT COUNT(*) as all_users FROM "User";

-- Admin should see ALL profiles
SELECT COUNT(*) as all_profiles FROM "Profile";

-- Admin should see ALL verification requests
SELECT COUNT(*) as all_verifications FROM "VerificationRequest";

-- ============================================================================
-- TEST 5: Check RLS Policies Are Active
-- ============================================================================

-- Verify RLS is enabled on tables
SELECT
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables
WHERE tablename IN ('User', 'Profile', 'VerificationRequest')
    AND schemaname = 'public';

-- List all RLS policies
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    qual,
    with_check
FROM pg_policies
WHERE tablename IN ('User', 'Profile', 'VerificationRequest')
ORDER BY tablename, policyname;

-- ============================================================================
-- TEST 6: Verify Public View Works
-- ============================================================================

-- Public view should show active professional users
SELECT COUNT(*) FROM "UserPublic";

-- Should only contain professionals
SELECT DISTINCT role FROM "UserPublic";

-- ============================================================================
-- CLEANUP
-- ============================================================================

-- Always clear the context when done testing
SELECT set_config('app.current_user_id', '', true);
SELECT set_config('app.current_user_role', '', true);
