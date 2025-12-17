-- ============================================================================
-- SECURITY: Row-Level Security (RLS) Phase 5 Implementation - HARDENING
-- ============================================================================
-- Final phase adds audit logging, rate limiting, and session tracking
-- for complete production-grade security.
--
-- ============================================================================

-- ============================================================================
-- 1. AUDIT LOG TABLE - Track Sensitive Data Modifications
-- ============================================================================

CREATE TABLE "AuditLog" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "userId" UUID,
    "tableName" TEXT NOT NULL,
    action TEXT NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
    "recordId" TEXT,
    "changedData" JSONB,
    "createdAt" TIMESTAMP DEFAULT NOW()
);

ALTER TABLE "AuditLog" ENABLE ROW LEVEL SECURITY;

-- Admin only: view audit logs
CREATE POLICY "audit_log_admin_select" ON "AuditLog"
    FOR SELECT
    USING (current_setting('app.current_user_role') = 'ADMIN');

-- System: insert audit logs
CREATE POLICY "audit_log_insert_system" ON "AuditLog"
    FOR INSERT
    WITH CHECK (true);

CREATE INDEX idx_audit_log_user_id ON "AuditLog"("userId");
CREATE INDEX idx_audit_log_table_name ON "AuditLog"("tableName");
CREATE INDEX idx_audit_log_created_at ON "AuditLog"("createdAt");

-- ============================================================================
-- 2. RATE LIMITING TABLE - Prevent Abuse
-- ============================================================================

CREATE TABLE "RateLimit" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "userId" TEXT,
    endpoint TEXT NOT NULL,
    "requestCount" INTEGER DEFAULT 1,
    "resetAt" TIMESTAMP NOT NULL,
    "createdAt" TIMESTAMP DEFAULT NOW()
);

ALTER TABLE "RateLimit" ENABLE ROW LEVEL SECURITY;

-- Users see own rate limits
CREATE POLICY "rate_limit_select_own" ON "RateLimit"
    FOR SELECT
    USING ("userId" = current_setting('app.current_user_id'));

-- System manages rate limits
CREATE POLICY "rate_limit_insert_update" ON "RateLimit"
    FOR INSERT
    WITH CHECK (true);

CREATE POLICY "rate_limit_update_system" ON "RateLimit"
    FOR UPDATE
    USING (true)
    WITH CHECK (true);

-- Admins see all
CREATE POLICY "rate_limit_admin_select" ON "RateLimit"
    FOR SELECT
    USING (current_setting('app.current_user_role') = 'ADMIN');

CREATE INDEX idx_rate_limit_user_endpoint ON "RateLimit"("userId", endpoint);
CREATE INDEX idx_rate_limit_reset_at ON "RateLimit"("resetAt");

-- ============================================================================
-- 3. SESSION TRACKING TABLE - Monitor Active Sessions
-- ============================================================================

CREATE TABLE "SessionLog" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "userId" TEXT NOT NULL,
    "ipAddress" TEXT,
    "lastActivityAt" TIMESTAMP DEFAULT NOW(),
    "expiresAt" TIMESTAMP NOT NULL,
    "isActive" BOOLEAN DEFAULT true,
    "createdAt" TIMESTAMP DEFAULT NOW()
);

ALTER TABLE "SessionLog" ENABLE ROW LEVEL SECURITY;

-- Users see own sessions
CREATE POLICY "session_log_select_own" ON "SessionLog"
    FOR SELECT
    USING ("userId" = current_setting('app.current_user_id'));

-- Users can terminate own sessions
CREATE POLICY "session_log_update_own" ON "SessionLog"
    FOR UPDATE
    USING ("userId" = current_setting('app.current_user_id'))
    WITH CHECK ("userId" = current_setting('app.current_user_id'));

-- Admins see all
CREATE POLICY "session_log_admin_select" ON "SessionLog"
    FOR SELECT
    USING (current_setting('app.current_user_role') = 'ADMIN');

CREATE INDEX idx_session_log_user_id ON "SessionLog"("userId");
CREATE INDEX idx_session_log_expires_at ON "SessionLog"("expiresAt");

-- ============================================================================
-- 4. SOFT DELETE SUPPORT - Non-Destructive Deletions
-- ============================================================================

-- Add soft delete to core tables
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMP;
ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMP;
ALTER TABLE "VerificationRequest" ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMP;

CREATE INDEX IF NOT EXISTS idx_user_deleted_at ON "User"("deletedAt");
CREATE INDEX IF NOT EXISTS idx_profile_deleted_at ON "Profile"("deletedAt");
CREATE INDEX IF NOT EXISTS idx_verification_deleted_at ON "VerificationRequest"("deletedAt");

-- ============================================================================
-- 5. ADMIN VIEWS - Security Monitoring
-- ============================================================================

-- Recent audit activity by table
CREATE OR REPLACE VIEW "AuditActivitySummary" AS
SELECT
    "tableName",
    action,
    COUNT(*) as action_count,
    MAX("createdAt") as last_action
FROM "AuditLog"
WHERE "createdAt" > NOW() - INTERVAL '7 days'
GROUP BY "tableName", action
ORDER BY last_action DESC;

-- Security health metrics
CREATE OR REPLACE VIEW "SecurityHealthMetrics" AS
SELECT
    'Audit Entries (7 days)' as metric,
    COUNT(*)::TEXT as value
FROM "AuditLog"
WHERE "createdAt" > NOW() - INTERVAL '7 days'
UNION ALL
SELECT
    'Active Sessions',
    COUNT(*)::TEXT
FROM "SessionLog"
WHERE "isActive" = true
UNION ALL
SELECT
    'Endpoints Rate Limited',
    COUNT(DISTINCT endpoint)::TEXT
FROM "RateLimit"
WHERE "resetAt" > NOW();

-- ============================================================================
-- 6. RATE LIMITING HELPER FUNCTION
-- ============================================================================

CREATE OR REPLACE FUNCTION check_rate_limit(
    p_user_id TEXT,
    p_endpoint TEXT
)
RETURNS TABLE (
    is_limited BOOLEAN,
    current_count INTEGER,
    limit_reset_at TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        ("requestCount" >= 100)::BOOLEAN,
        "requestCount",
        "resetAt"
    FROM "RateLimit"
    WHERE "userId" = p_user_id
        AND endpoint = p_endpoint
        AND "resetAt" > NOW()
    LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 7. AUDIT LOGGING FUNCTION
-- ============================================================================

CREATE OR REPLACE FUNCTION log_audit_entry(
    p_user_id TEXT,
    p_table_name TEXT,
    p_action TEXT,
    p_record_id TEXT,
    p_changed_data JSONB DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO "AuditLog" (
        "userId", "tableName", action, "recordId", "changedData"
    )
    VALUES (
        p_user_id::UUID,
        p_table_name,
        p_action,
        p_record_id,
        p_changed_data
    );
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 8. SOFT DELETE MAINTENANCE
-- ============================================================================

-- View for admins to see soft-deleted users
CREATE OR REPLACE VIEW "DeletedUsersList" AS
SELECT
    id,
    name,
    email,
    "deletedAt",
    AGE(NOW(), "deletedAt") as time_since_deletion
FROM "User"
WHERE "deletedAt" IS NOT NULL
ORDER BY "deletedAt" DESC;

-- ============================================================================
-- 9. TESTING & VERIFICATION QUERIES
-- ============================================================================
-- Check audit log:
-- SELECT * FROM "AuditLog" ORDER BY "createdAt" DESC LIMIT 10;
--
-- Check rate limits:
-- SELECT * FROM "RateLimit" WHERE "resetAt" > NOW();
--
-- Check active sessions:
-- SELECT * FROM "SessionLog" WHERE "isActive" = true;
--
-- View security metrics:
-- SELECT * FROM "SecurityHealthMetrics";
--
-- View audit summary:
-- SELECT * FROM "AuditActivitySummary";
--
-- Check rate limit status:
-- SELECT * FROM check_rate_limit('user-id-here', '/api/proposals');

-- ============================================================================
-- 10. CLEANUP PROCEDURES (Run Periodically)
-- ============================================================================
-- Delete expired rate limits (older than 7 days):
-- DELETE FROM "RateLimit" WHERE "resetAt" < NOW() - INTERVAL '7 days';
--
-- Archive old audit logs (keep 90 days):
-- DELETE FROM "AuditLog" WHERE "createdAt" < NOW() - INTERVAL '90 days';
--
-- Remove expired sessions:
-- DELETE FROM "SessionLog" WHERE "expiresAt" < NOW();
--
-- Permanently delete soft-deleted users (older than 30 days):
-- DELETE FROM "User" WHERE "deletedAt" IS NOT NULL
--     AND "deletedAt" < NOW() - INTERVAL '30 days';
