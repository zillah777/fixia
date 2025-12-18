-- ============================================================================
-- SECURITY: Row-Level Security (RLS) RESTORATION - CONSOLIDATED
-- ============================================================================
-- This script enables RLS on all protected tables and re-implements 
-- all policies from Phase 1 through Phase 5.
-- 
-- Tables Protected:
-- - User, Profile, VerificationRequest (Phase 1)
-- - Service, Request, Proposal (Phase 2)
-- - Match, Message, Review (Phase 3)
-- - Notification, Favorite (Phase 4)
-- - AuditLog, RateLimit, SessionLog (Phase 5)
-- ============================================================================

-- ============================================================================
-- PHASE 1: CORE IDENTITY
-- ============================================================================

-- 1. USER TABLE
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "user_select_own" ON "User";
CREATE POLICY "user_select_own" ON "User" FOR SELECT USING (id::text = current_setting('app.current_user_id'));
DROP POLICY IF EXISTS "user_select_public" ON "User";
CREATE POLICY "user_select_public" ON "User" FOR SELECT USING (status = 'ACTIVE');
DROP POLICY IF EXISTS "user_update_own" ON "User";
CREATE POLICY "user_update_own" ON "User" FOR UPDATE USING (id::text = current_setting('app.current_user_id')) WITH CHECK (id::text = current_setting('app.current_user_id'));
DROP POLICY IF EXISTS "user_admin_select" ON "User";
CREATE POLICY "user_admin_select" ON "User" FOR SELECT USING (current_setting('app.current_user_role') = 'ADMIN');
DROP POLICY IF EXISTS "user_admin_update" ON "User";
CREATE POLICY "user_admin_update" ON "User" FOR UPDATE USING (current_setting('app.current_user_role') = 'ADMIN') WITH CHECK (current_setting('app.current_user_role') = 'ADMIN');

-- 2. PROFILE TABLE
ALTER TABLE "Profile" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "profile_select_active_professional" ON "Profile";
CREATE POLICY "profile_select_active_professional" ON "Profile" FOR SELECT USING (EXISTS (SELECT 1 FROM "User" u WHERE u.id = "Profile"."userId" AND u.role = 'PROFESSIONAL' AND u.status = 'ACTIVE'));
DROP POLICY IF EXISTS "profile_select_own" ON "Profile";
CREATE POLICY "profile_select_own" ON "Profile" FOR SELECT USING ("userId"::text = current_setting('app.current_user_id'));
DROP POLICY IF EXISTS "profile_insert_own" ON "Profile";
CREATE POLICY "profile_insert_own" ON "Profile" FOR INSERT WITH CHECK ("userId"::text = current_setting('app.current_user_id'));
DROP POLICY IF EXISTS "profile_update_own" ON "Profile";
CREATE POLICY "profile_update_own" ON "Profile" FOR UPDATE USING ("userId"::text = current_setting('app.current_user_id')) WITH CHECK ("userId"::text = current_setting('app.current_user_id'));
DROP POLICY IF EXISTS "profile_admin_select" ON "Profile";
CREATE POLICY "profile_admin_select" ON "Profile" FOR SELECT USING (current_setting('app.current_user_role') = 'ADMIN');
DROP POLICY IF EXISTS "profile_admin_update" ON "Profile";
CREATE POLICY "profile_admin_update" ON "Profile" FOR UPDATE USING (current_setting('app.current_user_role') = 'ADMIN') WITH CHECK (current_setting('app.current_user_role') = 'ADMIN');

-- 3. VERIFICATION REQUEST TABLE
ALTER TABLE "VerificationRequest" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "verification_select_own" ON "VerificationRequest";
CREATE POLICY "verification_select_own" ON "VerificationRequest" FOR SELECT USING ("userId"::text = current_setting('app.current_user_id'));
DROP POLICY IF EXISTS "verification_insert_own" ON "VerificationRequest";
CREATE POLICY "verification_insert_own" ON "VerificationRequest" FOR INSERT WITH CHECK ("userId"::text = current_setting('app.current_user_id') AND current_setting('app.current_user_role') = 'PROFESSIONAL');
DROP POLICY IF EXISTS "verification_update_own" ON "VerificationRequest";
CREATE POLICY "verification_update_own" ON "VerificationRequest" FOR UPDATE USING ("userId"::text = current_setting('app.current_user_id') AND status = 'PENDING') WITH CHECK ("userId"::text = current_setting('app.current_user_id') AND status = 'PENDING');
DROP POLICY IF EXISTS "verification_admin_select" ON "VerificationRequest";
CREATE POLICY "verification_admin_select" ON "VerificationRequest" FOR SELECT USING (current_setting('app.current_user_role') = 'ADMIN');
DROP POLICY IF EXISTS "verification_admin_update" ON "VerificationRequest";
CREATE POLICY "verification_admin_update" ON "VerificationRequest" FOR UPDATE USING (current_setting('app.current_user_role') = 'ADMIN') WITH CHECK (current_setting('app.current_user_role') = 'ADMIN');

-- ============================================================================
-- PHASE 2: MARKETPLACE CORE
-- ============================================================================

-- 1. SERVICE TABLE
ALTER TABLE "Service" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "service_select_public" ON "Service";
CREATE POLICY "service_select_public" ON "Service" FOR SELECT USING (EXISTS (SELECT 1 FROM "User" u WHERE u.id = "Service"."providerId" AND u.role = 'PROFESSIONAL' AND u.status = 'ACTIVE' AND u."subscriptionStatus" = 'active'));
DROP POLICY IF EXISTS "service_select_own" ON "Service";
CREATE POLICY "service_select_own" ON "Service" FOR SELECT USING ("providerId"::text = current_setting('app.current_user_id'));
DROP POLICY IF EXISTS "service_insert_professional" ON "Service";
CREATE POLICY "service_insert_professional" ON "Service" FOR INSERT WITH CHECK ("providerId"::text = current_setting('app.current_user_id') AND current_setting('app.current_user_role') = 'PROFESSIONAL');
DROP POLICY IF EXISTS "service_update_own" ON "Service";
CREATE POLICY "service_update_own" ON "Service" FOR UPDATE USING ("providerId"::text = current_setting('app.current_user_id')) WITH CHECK ("providerId"::text = current_setting('app.current_user_id'));
DROP POLICY IF EXISTS "service_delete_own_or_admin" ON "Service";
CREATE POLICY "service_delete_own_or_admin" ON "Service" FOR DELETE USING ("providerId"::text = current_setting('app.current_user_id') OR current_setting('app.current_user_role') = 'ADMIN');

-- 2. REQUEST TABLE
ALTER TABLE "Request" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "request_select_own" ON "Request";
CREATE POLICY "request_select_own" ON "Request" FOR SELECT USING ("clientId"::text = current_setting('app.current_user_id'));
DROP POLICY IF EXISTS "request_select_open_for_professionals" ON "Request";
CREATE POLICY "request_select_open_for_professionals" ON "Request" FOR SELECT USING (status = 'OPEN' AND current_setting('app.current_user_role') = 'PROFESSIONAL');
DROP POLICY IF EXISTS "request_insert_client" ON "Request";
CREATE POLICY "request_insert_client" ON "Request" FOR INSERT WITH CHECK ("clientId"::text = current_setting('app.current_user_id') AND current_setting('app.current_user_role') = 'CLIENT');
DROP POLICY IF EXISTS "request_update_own" ON "Request";
CREATE POLICY "request_update_own" ON "Request" FOR UPDATE USING ("clientId"::text = current_setting('app.current_user_id') AND status = 'OPEN') WITH CHECK ("clientId"::text = current_setting('app.current_user_id') AND status = 'OPEN');

-- 3. PROPOSAL TABLE
ALTER TABLE "Proposal" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "proposal_select_by_request_owner" ON "Proposal";
CREATE POLICY "proposal_select_by_request_owner" ON "Proposal" FOR SELECT USING (EXISTS (SELECT 1 FROM "Request" r WHERE r.id = "Proposal"."requestId" AND r."clientId"::text = current_setting('app.current_user_id')));
DROP POLICY IF EXISTS "proposal_select_own" ON "Proposal";
CREATE POLICY "proposal_select_own" ON "Proposal" FOR SELECT USING ("providerId"::text = current_setting('app.current_user_id'));
DROP POLICY IF EXISTS "proposal_insert_professional" ON "Proposal";
CREATE POLICY "proposal_insert_professional" ON "Proposal" FOR INSERT WITH CHECK ("providerId"::text = current_setting('app.current_user_role') = 'PROFESSIONAL');

-- ============================================================================
-- PHASE 3: COMMUNICATION & WORKFLOW
-- ============================================================================

-- 1. MATCH TABLE
ALTER TABLE "Match" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "match_select_participant" ON "Match";
CREATE POLICY "match_select_participant" ON "Match" FOR SELECT USING ("clientId"::text = current_setting('app.current_user_id') OR "providerId"::text = current_setting('app.current_user_id'));
DROP POLICY IF EXISTS "match_update_participant" ON "Match";
CREATE POLICY "match_update_participant" ON "Match" FOR UPDATE USING ("clientId"::text = current_setting('app.current_user_id') OR "providerId"::text = current_setting('app.current_user_id'));

-- 2. MESSAGE TABLE
ALTER TABLE "Message" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "message_select_match_participant" ON "Message";
CREATE POLICY "message_select_match_participant" ON "Message" FOR SELECT USING (EXISTS (SELECT 1 FROM "Match" m WHERE m.id = "Message"."matchId" AND (m."clientId"::text = current_setting('app.current_user_id') OR m."providerId"::text = current_setting('app.current_user_id'))));
DROP POLICY IF EXISTS "message_insert_match_participant" ON "Message";
CREATE POLICY "message_insert_match_participant" ON "Message" FOR INSERT WITH CHECK ("senderId"::text = current_setting('app.current_user_id'));

-- 3. REVIEW TABLE
ALTER TABLE "Review" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "review_select_public_testimonials" ON "Review";
CREATE POLICY "review_select_public_testimonials" ON "Review" FOR SELECT USING ("score" = 5);
DROP POLICY IF EXISTS "review_select_received" ON "Review";
CREATE POLICY "review_select_received" ON "Review" FOR SELECT USING ("targetId"::text = current_setting('app.current_user_id'));
DROP POLICY IF EXISTS "review_select_authored" ON "Review";
CREATE POLICY "review_select_authored" ON "Review" FOR SELECT USING ("authorId"::text = current_setting('app.current_user_id'));

-- ============================================================================
-- PHASE 4: SOCIAL FEATURES
-- ============================================================================

-- 1. NOTIFICATION TABLE
ALTER TABLE "Notification" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "notification_select_own" ON "Notification";
CREATE POLICY "notification_select_own" ON "Notification" FOR SELECT USING ("userId"::text = current_setting('app.current_user_id'));
DROP POLICY IF EXISTS "notification_update_own" ON "Notification";
CREATE POLICY "notification_update_own" ON "Notification" FOR UPDATE USING ("userId"::text = current_setting('app.current_user_id'));

-- 2. FAVORITE TABLE
ALTER TABLE "Favorite" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "favorite_select_own" ON "Favorite";
CREATE POLICY "favorite_select_own" ON "Favorite" FOR SELECT USING ("userId"::text = current_setting('app.current_user_id'));
DROP POLICY IF EXISTS "favorite_insert_own" ON "Favorite";
CREATE POLICY "favorite_insert_own" ON "Favorite" FOR INSERT WITH CHECK ("userId"::text = current_setting('app.current_user_id'));

-- ============================================================================
-- PHASE 5: HARDENING & INFRASTRUCTURE
-- ============================================================================

-- 1. AUDIT LOG TABLE
ALTER TABLE "AuditLog" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "audit_log_admin_select" ON "AuditLog";
CREATE POLICY "audit_log_admin_select" ON "AuditLog" FOR SELECT USING (current_setting('app.current_user_role') = 'ADMIN');
DROP POLICY IF EXISTS "audit_log_insert_system" ON "AuditLog";
CREATE POLICY "audit_log_insert_system" ON "AuditLog" FOR INSERT WITH CHECK (true);

-- 2. RATE LIMIT TABLE
ALTER TABLE "RateLimit" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "rate_limit_select_own" ON "RateLimit";
CREATE POLICY "rate_limit_select_own" ON "RateLimit" FOR SELECT USING ("userId" = current_setting('app.current_user_id'));
DROP POLICY IF EXISTS "rate_limit_insert_update" ON "RateLimit";
CREATE POLICY "rate_limit_insert_update" ON "RateLimit" FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "rate_limit_update_system" ON "RateLimit";
CREATE POLICY "rate_limit_update_system" ON "RateLimit" FOR UPDATE USING (true);

-- 3. SESSION LOG TABLE
ALTER TABLE "SessionLog" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "session_log_select_own" ON "SessionLog";
CREATE POLICY "session_log_select_own" ON "SessionLog" FOR SELECT USING ("userId" = current_setting('app.current_user_id'));
DROP POLICY IF EXISTS "session_log_update_own" ON "SessionLog";
CREATE POLICY "session_log_update_own" ON "SessionLog" FOR UPDATE USING ("userId" = current_setting('app.current_user_id'));

-- ============================================================================
-- VIEWS, FUNCTIONS & INDEXES
-- ============================================================================

-- Views (Recreate)
DROP VIEW IF EXISTS "UserPublic" CASCADE;
CREATE VIEW "UserPublic" AS SELECT id, name, avatar, role, status, location, "createdAt" FROM "User" WHERE status = 'ACTIVE' AND role = 'PROFESSIONAL';

DROP VIEW IF EXISTS "ServicePublic" CASCADE;
CREATE VIEW "ServicePublic" AS SELECT s.id, s.title, s.description, s.price, s."categoryId", s.tags, s."providerId", s."createdAt", u.name as provider_name, u.avatar as provider_avatar, p."ratingAvg" as provider_rating FROM "Service" s JOIN "User" u ON s."providerId" = u.id LEFT JOIN "Profile" p ON u.id = p."userId" WHERE u.status = 'ACTIVE' AND u.role = 'PROFESSIONAL' AND u."subscriptionStatus" = 'active';

DROP VIEW IF EXISTS "RequestOpen" CASCADE;
CREATE VIEW "RequestOpen" AS SELECT r.id, r.title, r.description, r.budget, r."categoryId", r.location, r.tags, r."createdAt" FROM "Request" r JOIN "User" u ON r."clientId" = u.id WHERE r.status = 'OPEN' AND u.status = 'ACTIVE';

-- Functions
CREATE OR REPLACE FUNCTION log_audit_entry(p_user_id TEXT, p_table_name TEXT, p_action TEXT, p_record_id TEXT, p_changed_data JSONB DEFAULT NULL) RETURNS VOID AS $$ BEGIN INSERT INTO "AuditLog" ("userId", "tableName", action, "recordId", "changedData") VALUES (p_user_id::UUID, p_table_name, p_action, p_record_id, p_changed_data); END; $$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION check_rate_limit(p_user_id TEXT, p_endpoint TEXT) RETURNS TABLE (is_limited BOOLEAN, current_count INTEGER, limit_reset_at TIMESTAMP) AS $$ BEGIN RETURN QUERY SELECT ("requestCount" >= 100)::BOOLEAN, "requestCount", "resetAt" FROM "RateLimit" WHERE "userId" = p_user_id AND endpoint = p_endpoint AND "resetAt" > NOW() LIMIT 1; END; $$ LANGUAGE plpgsql;
