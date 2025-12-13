-- ============================================================================
-- SECURITY: Row-Level Security (RLS) Phase 4 Implementation
-- ============================================================================
-- This migration extends RLS to social features: notifications and favorites.
--
-- Phase 4 Tables:
-- 1. Notification - User notifications for events
-- 2. Favorite - User's saved/favorite professionals
--
-- ============================================================================

-- ============================================================================
-- 1. NOTIFICATION TABLE - User Notifications
-- ============================================================================

ALTER TABLE "Notification" ENABLE ROW LEVEL SECURITY;

-- POLICY: SELECT - Users see only their own notifications
CREATE POLICY "notification_select_own" ON "Notification"
    FOR SELECT
    USING (
        "userId"::text = current_setting('app.current_user_id')
    );

-- POLICY: INSERT - Only system/application can create notifications
CREATE POLICY "notification_insert_system" ON "Notification"
    FOR INSERT
    WITH CHECK (
        current_setting('app.current_user_role') = 'ADMIN'
        OR "userId"::text = current_setting('app.current_user_id')
    );

-- POLICY: UPDATE - Users can mark their notifications as read
CREATE POLICY "notification_update_own" ON "Notification"
    FOR UPDATE
    USING (
        "userId"::text = current_setting('app.current_user_id')
    )
    WITH CHECK (
        "userId"::text = current_setting('app.current_user_id')
    );

-- POLICY: DELETE - Users can delete their own notifications
CREATE POLICY "notification_delete_own" ON "Notification"
    FOR DELETE
    USING (
        "userId"::text = current_setting('app.current_user_id')
    );

-- POLICY: ADMIN OVERRIDE - Admins see all notifications
CREATE POLICY "notification_admin_select" ON "Notification"
    FOR SELECT
    USING (
        current_setting('app.current_user_role') = 'ADMIN'
    );

-- ============================================================================
-- 2. FAVORITE TABLE - User's Favorite Professionals
-- ============================================================================

ALTER TABLE "Favorite" ENABLE ROW LEVEL SECURITY;

-- POLICY: SELECT - Users see only their own favorites
CREATE POLICY "favorite_select_own" ON "Favorite"
    FOR SELECT
    USING (
        "userId"::text = current_setting('app.current_user_id')
    );

-- POLICY: INSERT - Users can only save their own favorites
CREATE POLICY "favorite_insert_own" ON "Favorite"
    FOR INSERT
    WITH CHECK (
        "userId"::text = current_setting('app.current_user_id')
        AND EXISTS (
            SELECT 1 FROM "User" u
            WHERE u.id::text = "professionalId"::text
            AND u.role = 'PROFESSIONAL'
            AND u.status = 'ACTIVE'
        )
    );

-- POLICY: DELETE - Users can remove their own favorites
CREATE POLICY "favorite_delete_own" ON "Favorite"
    FOR DELETE
    USING (
        "userId"::text = current_setting('app.current_user_id')
    );

-- POLICY: ADMIN OVERRIDE - Admins see all favorites
CREATE POLICY "favorite_admin_select" ON "Favorite"
    FOR SELECT
    USING (
        current_setting('app.current_user_role') = 'ADMIN'
    );

-- ============================================================================
-- 3. INDEX OPTIMIZATION FOR PHASE 4
-- ============================================================================

CREATE INDEX idx_notification_user_id ON "Notification"("userId");
CREATE INDEX idx_notification_user_read ON "Notification"("userId", "isRead");
CREATE INDEX idx_notification_created_at ON "Notification"("createdAt");

CREATE INDEX idx_favorite_user_id ON "Favorite"("userId");
CREATE INDEX idx_favorite_professional_id ON "Favorite"("professionalId");
CREATE INDEX idx_favorite_created_at ON "Favorite"("createdAt");

-- ============================================================================
-- 4. SOCIAL FEATURES VIEWS
-- ============================================================================

-- View for users to see their favorite professionals
CREATE OR REPLACE VIEW "UserFavoriteProfessionals" AS
SELECT
    f.id as favorite_id,
    u.id as professional_id,
    u.name,
    u.avatar,
    p."ratingAvg",
    p.bio,
    f."createdAt" as favorited_at,
    COUNT(DISTINCT r.id) as review_count
FROM "Favorite" f
JOIN "User" u ON f."professionalId" = u.id
LEFT JOIN "Profile" p ON u.id = p."userId"
LEFT JOIN "Review" r ON u.id = r."targetId"
WHERE f."userId"::text = current_setting('app.current_user_id')
GROUP BY f.id, u.id, u.name, u.avatar, p."ratingAvg", p.bio, f."createdAt";

-- View for notification summary
CREATE OR REPLACE VIEW "NotificationSummary" AS
SELECT
    COUNT(*) as total_notifications,
    COUNT(CASE WHEN "isRead" = false THEN 1 END) as unread_count,
    MAX("createdAt") as last_notification_date
FROM "Notification"
WHERE "userId"::text = current_setting('app.current_user_id');

-- ============================================================================
-- 5. AUDIT & MONITORING FOR PHASE 4
-- ============================================================================

-- View for admins to monitor social engagement
CREATE OR REPLACE VIEW "SocialEngagementStats" AS
SELECT
    (SELECT COUNT(*) FROM "Notification") as total_notifications,
    (SELECT COUNT(*) FROM "Favorite") as total_favorites,
    (SELECT COUNT(DISTINCT "userId") FROM "Favorite") as users_with_favorites,
    (SELECT COUNT(DISTINCT "professionalId") FROM "Favorite") as favorited_professionals;

-- ============================================================================
-- 6. TESTING & VERIFICATION
-- ============================================================================
-- Test notification access:
-- SELECT set_config('app.current_user_id', 'user-uuid', true);
-- SELECT * FROM "Notification"; -- Should see own only
--
-- Test adding favorite:
-- INSERT INTO "Favorite" ("userId", "professionalId")
-- VALUES ('user-uuid', 'professional-uuid');
--
-- Test viewing favorites:
-- SELECT * FROM "UserFavoriteProfessionals";
