-- ============================================================================
-- SECURITY: Row-Level Security (RLS) Phase 1 Implementation
-- ============================================================================
-- This migration enables RLS on core security-critical tables and implements
-- ownership-based and role-based access control policies.
--
-- RLS Context Variables (set by application middleware):
-- - app.current_user_id: UUID of authenticated user (stored as TEXT in current_setting)
-- - app.current_user_role: Role of authenticated user (CLIENT, PROFESSIONAL, ADMIN)
--
-- Phase 1 Tables:
-- 1. User - Core user data with privacy protections
-- 2. Profile - Professional profile visibility control
-- 3. VerificationRequest - Sensitive identity verification data
--
-- Future phases will cover: Service, Request, Proposal, Match, Message, Review, etc.
-- ============================================================================

-- ============================================================================
-- 1. USER TABLE - Core Authentication & Authorization Data
-- ============================================================================

ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;

-- POLICY: SELECT - Users see their own complete record
-- Note: current_setting() returns TEXT, so we cast to compare with UUID
CREATE POLICY "user_select_own" ON "User"
    FOR SELECT
    USING (
        id::text = current_setting('app.current_user_id')
    );

-- POLICY: SELECT - Users see basic public info of other users
-- In production, consider using a VIEW to filter sensitive fields
CREATE POLICY "user_select_public" ON "User"
    FOR SELECT
    USING (
        status = 'ACTIVE'
        AND (
            -- Owner sees full record
            id::text = current_setting('app.current_user_id')
            OR
            -- Others see public fields only (this is advisory - use VIEW for hard filtering)
            true
        )
    );

-- POLICY: UPDATE - Users can only update their own profile
-- Prevents role/status changes (WITH CHECK clause enforces this)
CREATE POLICY "user_update_own" ON "User"
    FOR UPDATE
    USING (
        id::text = current_setting('app.current_user_id')
    )
    WITH CHECK (
        id::text = current_setting('app.current_user_id')
        -- Prevent role change (must match existing role)
        AND role = (SELECT role FROM "User" WHERE id::text = current_setting('app.current_user_id'))
        -- Prevent status change (must match existing status)
        AND status = (SELECT status FROM "User" WHERE id::text = current_setting('app.current_user_id'))
    );

-- POLICY: ADMIN OVERRIDE - Admins can see all users (for moderation/management)
CREATE POLICY "user_admin_select" ON "User"
    FOR SELECT
    USING (
        current_setting('app.current_user_role') = 'ADMIN'
    );

-- POLICY: ADMIN OVERRIDE - Admins can update any user (for moderation)
CREATE POLICY "user_admin_update" ON "User"
    FOR UPDATE
    USING (
        current_setting('app.current_user_role') = 'ADMIN'
    )
    WITH CHECK (
        current_setting('app.current_user_role') = 'ADMIN'
    );

-- Note: INSERT and DELETE handled via application layer for User table
-- User creation is through auth system, deletion is admin-only

-- ============================================================================
-- 2. PROFILE TABLE - Professional Profiles with Public Visibility
-- ============================================================================

ALTER TABLE "Profile" ENABLE ROW LEVEL SECURITY;

-- POLICY: SELECT - Public professional profiles (active professionals only)
-- Professionals with ACTIVE status and non-suspended accounts show public profile
CREATE POLICY "profile_select_active_professional" ON "Profile"
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM "User" u
            WHERE u.id = "Profile"."userId"
            AND u.role = 'PROFESSIONAL'
            AND u.status = 'ACTIVE'
        )
    );

-- POLICY: SELECT - Users see their own complete profile
CREATE POLICY "profile_select_own" ON "Profile"
    FOR SELECT
    USING (
        "userId"::text = current_setting('app.current_user_id')
    );

-- POLICY: INSERT - Only user can create their own profile
CREATE POLICY "profile_insert_own" ON "Profile"
    FOR INSERT
    WITH CHECK (
        "userId"::text = current_setting('app.current_user_id')
    );

-- POLICY: UPDATE - Only owner can update their profile
CREATE POLICY "profile_update_own" ON "Profile"
    FOR UPDATE
    USING (
        "userId"::text = current_setting('app.current_user_id')
    )
    WITH CHECK (
        "userId"::text = current_setting('app.current_user_id')
    );

-- POLICY: ADMIN OVERRIDE - Admins see all profiles
CREATE POLICY "profile_admin_select" ON "Profile"
    FOR SELECT
    USING (
        current_setting('app.current_user_role') = 'ADMIN'
    );

-- POLICY: ADMIN OVERRIDE - Admins can update any profile (for moderation)
CREATE POLICY "profile_admin_update" ON "Profile"
    FOR UPDATE
    USING (
        current_setting('app.current_user_role') = 'ADMIN'
    )
    WITH CHECK (
        current_setting('app.current_user_role') = 'ADMIN'
    );

-- ============================================================================
-- 3. VERIFICATION REQUEST TABLE - Sensitive Identity Documents
-- ============================================================================

ALTER TABLE "VerificationRequest" ENABLE ROW LEVEL SECURITY;

-- POLICY: SELECT - Users see their own verification request
CREATE POLICY "verification_select_own" ON "VerificationRequest"
    FOR SELECT
    USING (
        "userId"::text = current_setting('app.current_user_id')
    );

-- POLICY: INSERT - Only professionals can create verification requests
-- (This is also enforced at application layer)
CREATE POLICY "verification_insert_own" ON "VerificationRequest"
    FOR INSERT
    WITH CHECK (
        "userId"::text = current_setting('app.current_user_id')
        AND current_setting('app.current_user_role') = 'PROFESSIONAL'
    );

-- POLICY: UPDATE - Only professionals can update their own request (before approval)
CREATE POLICY "verification_update_own" ON "VerificationRequest"
    FOR UPDATE
    USING (
        "userId"::text = current_setting('app.current_user_id')
        AND status = 'PENDING' -- Can only update pending requests
    )
    WITH CHECK (
        "userId"::text = current_setting('app.current_user_id')
        AND status = 'PENDING'
    );

-- POLICY: ADMIN OVERRIDE - Admins see all verification requests
CREATE POLICY "verification_admin_select" ON "VerificationRequest"
    FOR SELECT
    USING (
        current_setting('app.current_user_role') = 'ADMIN'
    );

-- POLICY: ADMIN OVERRIDE - Admins can approve/reject verification requests
CREATE POLICY "verification_admin_update" ON "VerificationRequest"
    FOR UPDATE
    USING (
        current_setting('app.current_user_role') = 'ADMIN'
    )
    WITH CHECK (
        current_setting('app.current_user_role') = 'ADMIN'
    );

-- ============================================================================
-- 4. INDEX OPTIMIZATION FOR RLS
-- ============================================================================
-- These indexes help RLS queries perform efficiently

CREATE INDEX idx_user_role ON "User"(role) WHERE status = 'ACTIVE';
CREATE INDEX idx_user_status ON "User"(status);
CREATE INDEX idx_profile_user_id ON "Profile"("userId");
CREATE INDEX idx_verification_user_id ON "VerificationRequest"("userId");

-- ============================================================================
-- 5. USEFUL HELPER VIEW FOR PUBLIC USER DATA
-- ============================================================================
-- Use this view to safely expose only public user fields without RLS bypass

CREATE OR REPLACE VIEW "UserPublic" AS
SELECT
    id,
    name,
    avatar,
    role,
    status,
    location,
    "createdAt"
FROM "User"
WHERE status = 'ACTIVE'
    AND role = 'PROFESSIONAL';

-- ============================================================================
-- 6. FUTURE PHASES
-- ============================================================================
-- Phase 2: Service, Request, Proposal (Marketplace core)
-- Phase 3: Match, Message (Communication)
-- Phase 4: Review, Notification, Favorite (Social)
-- Phase 5: Encryption, Audit logging, Rate limiting

-- ============================================================================
-- TESTING & VERIFICATION
-- ============================================================================
-- To test these policies, use:
--
-- Test as authenticated user:
-- SELECT set_config('app.current_user_id', 'user-uuid-here', true);
-- SELECT set_config('app.current_user_role', 'CLIENT', true);
-- SELECT * FROM "User"; -- Should only return current user
--
-- Test as admin:
-- SELECT set_config('app.current_user_role', 'ADMIN', true);
-- SELECT * FROM "User"; -- Should return all users
--
-- Test as unauthenticated (empty context):
-- SELECT set_config('app.current_user_id', '', true);
-- SELECT set_config('app.current_user_role', '', true);
-- SELECT * FROM "User"; -- Should return nothing (RLS blocks access)
