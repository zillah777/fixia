-- ============================================================================
-- SECURITY: Row-Level Security (RLS) Phase 2 Implementation
-- ============================================================================
-- This migration extends RLS to the marketplace core tables, implementing
-- fine-grained access control for services, requests, and proposals.
--
-- Phase 2 Tables:
-- 1. Service - Professional services (offerings)
-- 2. Request - Client service requests
-- 3. Proposal - Professional bids on requests
--
-- Access Control Model:
-- - Services: Public visibility for active professionals only
-- - Requests: Clients see own, professionals see OPEN for bidding
-- - Proposals: Clients see proposals on their requests, professionals see own
--
-- ============================================================================

-- ============================================================================
-- 1. SERVICE TABLE - Professional Service Offerings
-- ============================================================================

ALTER TABLE "Service" ENABLE ROW LEVEL SECURITY;

-- POLICY: SELECT - Services from active, verified professionals are public
-- Professionals must have active subscriptions to list services
CREATE POLICY "service_select_public" ON "Service"
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM "User" u
            WHERE u.id = "Service"."providerId"
            AND u.role = 'PROFESSIONAL'
            AND u.status = 'ACTIVE'
            AND u."subscriptionStatus" = 'active'
            AND u."canCreateServices" = true
        )
    );

-- POLICY: SELECT - Service providers see all their own services
CREATE POLICY "service_select_own" ON "Service"
    FOR SELECT
    USING (
        "providerId"::text = current_setting('app.current_user_id')
    );

-- POLICY: INSERT - Only professionals with active subscriptions can create services
CREATE POLICY "service_insert_professional" ON "Service"
    FOR INSERT
    WITH CHECK (
        "providerId"::text = current_setting('app.current_user_id')
        AND current_setting('app.current_user_role') = 'PROFESSIONAL'
        AND EXISTS (
            SELECT 1 FROM "User" u
            WHERE u.id::text = current_setting('app.current_user_id')
            AND u.role = 'PROFESSIONAL'
            AND u.status = 'ACTIVE'
            AND u."subscriptionStatus" = 'active'
            AND u."canCreateServices" = true
        )
    );

-- POLICY: UPDATE - Only service provider can modify their services
CREATE POLICY "service_update_own" ON "Service"
    FOR UPDATE
    USING (
        "providerId"::text = current_setting('app.current_user_id')
    )
    WITH CHECK (
        "providerId"::text = current_setting('app.current_user_id')
    );

-- POLICY: DELETE - Service provider or admin can delete services
CREATE POLICY "service_delete_own_or_admin" ON "Service"
    FOR DELETE
    USING (
        "providerId"::text = current_setting('app.current_user_id')
        OR current_setting('app.current_user_role') = 'ADMIN'
    );

-- POLICY: ADMIN OVERRIDE - Admins see all services
CREATE POLICY "service_admin_select" ON "Service"
    FOR SELECT
    USING (
        current_setting('app.current_user_role') = 'ADMIN'
    );

-- POLICY: ADMIN OVERRIDE - Admins can modify any service
CREATE POLICY "service_admin_update" ON "Service"
    FOR UPDATE
    USING (
        current_setting('app.current_user_role') = 'ADMIN'
    )
    WITH CHECK (
        current_setting('app.current_user_role') = 'ADMIN'
    );

-- ============================================================================
-- 2. REQUEST TABLE - Client Service Requests
-- ============================================================================

ALTER TABLE "Request" ENABLE ROW LEVEL SECURITY;

-- POLICY: SELECT - Clients see their own requests
CREATE POLICY "request_select_own" ON "Request"
    FOR SELECT
    USING (
        "clientId"::text = current_setting('app.current_user_id')
    );

-- POLICY: SELECT - Professionals see OPEN requests (marketplace browsing)
-- Only if professional has active subscription and can receive bookings
CREATE POLICY "request_select_open_for_professionals" ON "Request"
    FOR SELECT
    USING (
        status = 'OPEN'
        AND current_setting('app.current_user_role') = 'PROFESSIONAL'
        AND EXISTS (
            SELECT 1 FROM "User" u
            WHERE u.id::text = current_setting('app.current_user_id')
            AND u.role = 'PROFESSIONAL'
            AND u.status = 'ACTIVE'
            AND u."subscriptionStatus" = 'active'
            AND u."canReceiveBookings" = true
        )
    );

-- POLICY: SELECT - Professionals that already proposed see the request
-- Allows professionals to see requests they've bid on, regardless of status
CREATE POLICY "request_select_with_proposal" ON "Request"
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM "Proposal" p
            WHERE p."requestId" = "Request".id
            AND p."providerId"::text = current_setting('app.current_user_id')
        )
    );

-- POLICY: INSERT - Only authenticated clients can create requests
CREATE POLICY "request_insert_client" ON "Request"
    FOR INSERT
    WITH CHECK (
        "clientId"::text = current_setting('app.current_user_id')
        AND current_setting('app.current_user_role') = 'CLIENT'
    );

-- POLICY: UPDATE - Only request owner can modify their requests
-- Can only update OPEN requests (once matched, no edits)
CREATE POLICY "request_update_own" ON "Request"
    FOR UPDATE
    USING (
        "clientId"::text = current_setting('app.current_user_id')
        AND status = 'OPEN'
    )
    WITH CHECK (
        "clientId"::text = current_setting('app.current_user_id')
        AND status = 'OPEN'
    );

-- POLICY: DELETE - Only request owner can delete their own requests
-- Can only delete OPEN requests (protection against deleting matched work)
CREATE POLICY "request_delete_own" ON "Request"
    FOR DELETE
    USING (
        "clientId"::text = current_setting('app.current_user_id')
        AND status = 'OPEN'
    );

-- POLICY: ADMIN OVERRIDE - Admins see all requests
CREATE POLICY "request_admin_select" ON "Request"
    FOR SELECT
    USING (
        current_setting('app.current_user_role') = 'ADMIN'
    );

-- POLICY: ADMIN OVERRIDE - Admins can modify any request (moderation)
CREATE POLICY "request_admin_update" ON "Request"
    FOR UPDATE
    USING (
        current_setting('app.current_user_role') = 'ADMIN'
    )
    WITH CHECK (
        current_setting('app.current_user_role') = 'ADMIN'
    );

-- ============================================================================
-- 3. PROPOSAL TABLE - Professional Bids on Requests
-- ============================================================================

ALTER TABLE "Proposal" ENABLE ROW LEVEL SECURITY;

-- POLICY: SELECT - Clients see proposals on their own requests
CREATE POLICY "proposal_select_by_request_owner" ON "Proposal"
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM "Request" r
            WHERE r.id = "Proposal"."requestId"
            AND r."clientId"::text = current_setting('app.current_user_id')
        )
    );

-- POLICY: SELECT - Professionals see their own proposals
CREATE POLICY "proposal_select_own" ON "Proposal"
    FOR SELECT
    USING (
        "providerId"::text = current_setting('app.current_user_id')
    );

-- POLICY: INSERT - Only active professionals can submit proposals
-- Prevents: Inactive professionals from bidding
-- Prevents: Non-professionals from bidding
-- Prevents: Proposals on closed requests
CREATE POLICY "proposal_insert_professional" ON "Proposal"
    FOR INSERT
    WITH CHECK (
        "providerId"::text = current_setting('app.current_user_id')
        AND current_setting('app.current_user_role') = 'PROFESSIONAL'
        AND EXISTS (
            SELECT 1 FROM "User" u
            WHERE u.id::text = current_setting('app.current_user_id')
            AND u.role = 'PROFESSIONAL'
            AND u.status = 'ACTIVE'
            AND u."subscriptionStatus" = 'active'
            AND u."canReceiveBookings" = true
        )
        AND EXISTS (
            SELECT 1 FROM "Request" r
            WHERE r.id = "Proposal"."requestId"
            AND r.status = 'OPEN'
        )
    );

-- POLICY: UPDATE - Only proposal author can modify pending proposals
-- Prevents: Modifying proposals after client starts reviewing
CREATE POLICY "proposal_update_own_pending" ON "Proposal"
    FOR UPDATE
    USING (
        "providerId"::text = current_setting('app.current_user_id')
        AND status = 'PENDING'
    )
    WITH CHECK (
        "providerId"::text = current_setting('app.current_user_id')
        AND status = 'PENDING'
    );

-- POLICY: DELETE - Only proposal author can delete pending proposals
CREATE POLICY "proposal_delete_own_pending" ON "Proposal"
    FOR DELETE
    USING (
        "providerId"::text = current_setting('app.current_user_id')
        AND status = 'PENDING'
    );

-- POLICY: ADMIN OVERRIDE - Admins see all proposals
CREATE POLICY "proposal_admin_select" ON "Proposal"
    FOR SELECT
    USING (
        current_setting('app.current_user_role') = 'ADMIN'
    );

-- POLICY: ADMIN OVERRIDE - Admins can modify proposals (moderation)
CREATE POLICY "proposal_admin_update" ON "Proposal"
    FOR UPDATE
    USING (
        current_setting('app.current_user_role') = 'ADMIN'
    )
    WITH CHECK (
        current_setting('app.current_user_role') = 'ADMIN'
    );

-- ============================================================================
-- 4. INDEX OPTIMIZATION FOR PHASE 2
-- ============================================================================

CREATE INDEX idx_service_provider_id ON "Service"("providerId");

CREATE INDEX idx_request_client_id ON "Request"("clientId");
CREATE INDEX idx_request_status ON "Request"(status);
CREATE INDEX idx_request_client_status ON "Request"("clientId", status);

CREATE INDEX idx_proposal_request_id ON "Proposal"("requestId");
CREATE INDEX idx_proposal_provider_id ON "Proposal"("providerId");
CREATE INDEX idx_proposal_status ON "Proposal"(status);
CREATE INDEX idx_proposal_request_provider ON "Proposal"("requestId", "providerId");

-- ============================================================================
-- 5. MARKETPLACE VIEWS FOR SAFE DATA ACCESS
-- ============================================================================

-- View for browsing public professional services
CREATE OR REPLACE VIEW "ServicePublic" AS
SELECT
    s.id,
    s.title,
    s.description,
    s.price,
    s."categoryId",
    s.tags,
    s."providerId",
    s."createdAt",
    u.name as provider_name,
    u.avatar as provider_avatar,
    p."ratingAvg" as provider_rating
FROM "Service" s
JOIN "User" u ON s."providerId" = u.id
LEFT JOIN "Profile" p ON u.id = p."userId"
WHERE u.status = 'ACTIVE'
    AND u.role = 'PROFESSIONAL'
    AND u."subscriptionStatus" = 'active';

-- View for browsing open requests (for professionals to bid)
CREATE OR REPLACE VIEW "RequestOpen" AS
SELECT
    r.id,
    r.title,
    r.description,
    r.budget,
    r."categoryId",
    r.location,
    r.tags,
    r."createdAt",
    (SELECT COUNT(*) FROM "Proposal" WHERE "requestId" = r.id) as proposal_count
FROM "Request" r
JOIN "User" u ON r."clientId" = u.id
WHERE r.status = 'OPEN'
    AND u.status = 'ACTIVE';

-- ============================================================================
-- 6. AUDIT & MONITORING
-- ============================================================================

-- View for admins to monitor marketplace health
CREATE OR REPLACE VIEW "MarketplaceStats" AS
SELECT
    (SELECT COUNT(*) FROM "Service" WHERE EXISTS (
        SELECT 1 FROM "User" u WHERE u.id = "Service"."providerId"
        AND u.status = 'ACTIVE' AND u."subscriptionStatus" = 'active'
    )) as active_services,
    (SELECT COUNT(*) FROM "Request" WHERE status = 'OPEN') as open_requests,
    (SELECT COUNT(*) FROM "Proposal" WHERE status = 'PENDING') as pending_proposals,
    (SELECT COUNT(*) FROM "Request" WHERE status = 'OPEN') as active_clients,
    (SELECT COUNT(DISTINCT "providerId") FROM "Service") as active_professionals;

-- ============================================================================
-- 7. TESTING & VERIFICATION
-- ============================================================================
-- To test these policies, use:
--
-- Test as CLIENT user:
-- SELECT set_config('app.current_user_id', 'client-uuid-here', true);
-- SELECT set_config('app.current_user_role', 'CLIENT', true);
-- SELECT * FROM "Request"; -- Should only see own requests
-- SELECT * FROM "Proposal"; -- Should see proposals on own requests
--
-- Test as PROFESSIONAL user:
-- SELECT set_config('app.current_user_id', 'professional-uuid-here', true);
-- SELECT set_config('app.current_user_role', 'PROFESSIONAL', true);
-- SELECT * FROM "Request" WHERE status = 'OPEN'; -- Should see open requests
-- SELECT * FROM "Service"; -- Should see own + public services
-- SELECT * FROM "Proposal"; -- Should see own proposals
--
-- Test as ADMIN:
-- SELECT set_config('app.current_user_role', 'ADMIN', true);
-- SELECT COUNT(*) FROM "Service"; -- Should return all services
-- SELECT COUNT(*) FROM "Request"; -- Should return all requests
-- SELECT COUNT(*) FROM "Proposal"; -- Should return all proposals
