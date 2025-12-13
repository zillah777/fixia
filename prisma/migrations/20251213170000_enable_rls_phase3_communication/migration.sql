-- ============================================================================
-- SECURITY: Row-Level Security (RLS) Phase 3 Implementation
-- ============================================================================
-- This migration extends RLS to communication and job workflow tables,
-- implementing bidirectional access control for matched jobs and messages.
--
-- Phase 3 Tables:
-- 1. Match - Accepted jobs (client-professional pairing)
-- 2. Message - In-match communication between participants
-- 3. Review - Ratings and feedback on completed work
--
-- Access Control Model:
-- - Match: Only visible to client and provider (bidirectional)
-- - Message: Only visible within match context (bidirectional)
-- - Review: Author, target, and public testimonials
--
-- ============================================================================

-- ============================================================================
-- 1. MATCH TABLE - Accepted Jobs/Work Items
-- ============================================================================

ALTER TABLE "Match" ENABLE ROW LEVEL SECURITY;

-- POLICY: SELECT - Participants in match can view it (bidirectional)
-- Both client and provider can see the match details
CREATE POLICY "match_select_participant" ON "Match"
    FOR SELECT
    USING (
        "clientId"::text = current_setting('app.current_user_id')
        OR "providerId"::text = current_setting('app.current_user_id')
    );

-- POLICY: UPDATE - Participants can update match (approval/completion)
-- Both can update completion status and comments
CREATE POLICY "match_update_participant" ON "Match"
    FOR UPDATE
    USING (
        "clientId"::text = current_setting('app.current_user_id')
        OR "providerId"::text = current_setting('app.current_user_id')
    )
    WITH CHECK (
        "clientId"::text = current_setting('app.current_user_id')
        OR "providerId"::text = current_setting('app.current_user_id')
    );

-- POLICY: ADMIN OVERRIDE - Admins see all matches
CREATE POLICY "match_admin_select" ON "Match"
    FOR SELECT
    USING (
        current_setting('app.current_user_role') = 'ADMIN'
    );

-- POLICY: ADMIN OVERRIDE - Admins can modify matches (dispute resolution)
CREATE POLICY "match_admin_update" ON "Match"
    FOR UPDATE
    USING (
        current_setting('app.current_user_role') = 'ADMIN'
    )
    WITH CHECK (
        current_setting('app.current_user_role') = 'ADMIN'
    );

-- ============================================================================
-- 2. MESSAGE TABLE - In-Match Communication
-- ============================================================================

ALTER TABLE "Message" ENABLE ROW LEVEL SECURITY;

-- POLICY: SELECT - Only match participants can see messages
-- Prevents: Third parties reading private conversations
CREATE POLICY "message_select_match_participant" ON "Message"
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM "Match" m
            WHERE m.id = "Message"."matchId"
            AND (
                m."clientId"::text = current_setting('app.current_user_id')
                OR m."providerId"::text = current_setting('app.current_user_id')
            )
        )
    );

-- POLICY: INSERT - Only match participants can send messages
-- Prevents: Non-participants injecting messages
CREATE POLICY "message_insert_match_participant" ON "Message"
    FOR INSERT
    WITH CHECK (
        "senderId"::text = current_setting('app.current_user_id')
        AND EXISTS (
            SELECT 1 FROM "Match" m
            WHERE m.id = "Message"."matchId"
            AND (
                m."clientId"::text = current_setting('app.current_user_id')
                OR m."providerId"::text = current_setting('app.current_user_id')
            )
        )
    );

-- POLICY: UPDATE - Only receiver can mark message as read
-- Prevents: One participant marking others' messages as read
CREATE POLICY "message_update_read_status" ON "Message"
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM "Match" m
            WHERE m.id = "Message"."matchId"
            AND (
                (m."clientId"::text = current_setting('app.current_user_id') AND "senderId"::text = m."providerId"::text)
                OR (m."providerId"::text = current_setting('app.current_user_id') AND "senderId"::text = m."clientId"::text)
            )
        )
    )
    WITH CHECK (
        "isRead" = true
    );

-- POLICY: DELETE - Only admin can delete messages (moderation)
CREATE POLICY "message_delete_admin" ON "Message"
    FOR DELETE
    USING (
        current_setting('app.current_user_role') = 'ADMIN'
    );

-- POLICY: ADMIN OVERRIDE - Admins see all messages
CREATE POLICY "message_admin_select" ON "Message"
    FOR SELECT
    USING (
        current_setting('app.current_user_role') = 'ADMIN'
    );

-- ============================================================================
-- 3. REVIEW TABLE - Ratings and Feedback
-- ============================================================================

ALTER TABLE "Review" ENABLE ROW LEVEL SECURITY;

-- POLICY: SELECT - Public 5-star reviews (testimonials)
CREATE POLICY "review_select_public_testimonials" ON "Review"
    FOR SELECT
    USING (
        "score" = 5
    );

-- POLICY: SELECT - Target sees reviews they received
CREATE POLICY "review_select_received" ON "Review"
    FOR SELECT
    USING (
        "targetId"::text = current_setting('app.current_user_id')
    );

-- POLICY: SELECT - Author sees reviews they wrote
CREATE POLICY "review_select_authored" ON "Review"
    FOR SELECT
    USING (
        "authorId"::text = current_setting('app.current_user_id')
    );

-- POLICY: INSERT - Only match participants can review completed matches
CREATE POLICY "review_insert_match_participant" ON "Review"
    FOR INSERT
    WITH CHECK (
        "authorId"::text = current_setting('app.current_user_id')
        AND EXISTS (
            SELECT 1 FROM "Match" m
            WHERE m.id = "Review"."matchId"
            AND m."isCompleted" = true
            AND (
                (m."clientId"::text = current_setting('app.current_user_id') AND "targetId"::text = m."providerId"::text)
                OR (m."providerId"::text = current_setting('app.current_user_id') AND "targetId"::text = m."clientId"::text)
            )
        )
    );

-- POLICY: UPDATE - Author can edit recent reviews only
CREATE POLICY "review_update_own_recent" ON "Review"
    FOR UPDATE
    USING (
        "authorId"::text = current_setting('app.current_user_id')
        AND "createdAt" > (NOW() - INTERVAL '24 hours')
    )
    WITH CHECK (
        "authorId"::text = current_setting('app.current_user_id')
        AND "createdAt" > (NOW() - INTERVAL '24 hours')
    );

-- POLICY: DELETE - Only admin can delete reviews
CREATE POLICY "review_delete_admin" ON "Review"
    FOR DELETE
    USING (
        current_setting('app.current_user_role') = 'ADMIN'
    );

-- POLICY: ADMIN OVERRIDE - Admins see all reviews
CREATE POLICY "review_admin_select" ON "Review"
    FOR SELECT
    USING (
        current_setting('app.current_user_role') = 'ADMIN'
    );

-- ============================================================================
-- 4. INDEX OPTIMIZATION FOR PHASE 3
-- ============================================================================

CREATE INDEX idx_match_client_id ON "Match"("clientId");
CREATE INDEX idx_match_provider_id ON "Match"("providerId");
CREATE INDEX idx_match_request_id ON "Match"("requestId");
CREATE INDEX idx_match_is_completed ON "Match"("isCompleted");

CREATE INDEX idx_message_match_id ON "Message"("matchId");
CREATE INDEX idx_message_sender_id ON "Message"("senderId");
CREATE INDEX idx_message_created_at ON "Message"("createdAt");
CREATE INDEX idx_message_match_created ON "Message"("matchId", "createdAt");

CREATE INDEX idx_review_match_id ON "Review"("matchId");
CREATE INDEX idx_review_author_id ON "Review"("authorId");
CREATE INDEX idx_review_target_id ON "Review"("targetId");
CREATE INDEX idx_review_score ON "Review"("score");
CREATE INDEX idx_review_author_target ON "Review"("authorId", "targetId");
CREATE INDEX idx_review_created_at ON "Review"("createdAt");

-- ============================================================================
-- 5. COMMUNICATION VIEWS FOR SAFE DATA ACCESS
-- ============================================================================

-- View for match participants to see conversation summary
CREATE OR REPLACE VIEW "MatchConversation" AS
SELECT
    m.id as match_id,
    m."clientId",
    m."providerId",
    m."createdAt" as match_started,
    m."isCompleted" as is_completed,
    COUNT(msg.id) as message_count,
    MAX(msg."createdAt") as last_message_at,
    SUM(CASE WHEN msg."isRead" = false THEN 1 ELSE 0 END) as unread_count
FROM "Match" m
LEFT JOIN "Message" msg ON m.id = msg."matchId"
GROUP BY m.id, m."clientId", m."providerId", m."createdAt", m."isCompleted";

-- View for user to see all their reviews
CREATE OR REPLACE VIEW "UserReviews" AS
SELECT
    id,
    "matchId",
    "authorId",
    "targetId",
    "score",
    "comment",
    "createdAt",
    'authored' as review_type
FROM "Review"
WHERE "authorId"::text = current_setting('app.current_user_id')
UNION ALL
SELECT
    id,
    "matchId",
    "authorId",
    "targetId",
    "score",
    "comment",
    "createdAt",
    'received' as review_type
FROM "Review"
WHERE "targetId"::text = current_setting('app.current_user_id');

-- View for public professional profiles with ratings
CREATE OR REPLACE VIEW "ProfessionalRating" AS
SELECT
    u.id,
    u.name,
    u.avatar,
    p."ratingAvg",
    COUNT(DISTINCT r.id) as review_count,
    ROUND(AVG(r."score")::numeric, 1) as average_rating,
    COUNT(CASE WHEN r."score" = 5 THEN 1 END) as five_star_count
FROM "User" u
LEFT JOIN "Profile" p ON u.id = p."userId"
LEFT JOIN "Review" r ON u.id = r."targetId"
WHERE u.role = 'PROFESSIONAL'
    AND u.status = 'ACTIVE'
GROUP BY u.id, u.name, u.avatar, p."ratingAvg";

-- ============================================================================
-- 6. AUDIT & MONITORING FOR PHASE 3
-- ============================================================================

-- View for admins to monitor communication
CREATE OR REPLACE VIEW "CommunicationStats" AS
SELECT
    (SELECT COUNT(*) FROM "Match") as total_matches,
    (SELECT COUNT(*) FROM "Match" WHERE "isCompleted" = false) as active_matches,
    (SELECT COUNT(*) FROM "Message") as total_messages,
    (SELECT COUNT(*) FROM "Review") as total_reviews,
    (SELECT COUNT(*) FROM "Review" WHERE "score" >= 4) as positive_reviews,
    (SELECT COUNT(*) FROM "Review" WHERE "score" < 4) as negative_reviews;

-- ============================================================================
-- 7. TESTING & VERIFICATION
-- ============================================================================
-- Test match access (bidirectional):
-- SELECT set_config('app.current_user_id', 'client-uuid', true);
-- SELECT set_config('app.current_user_role', 'CLIENT', true);
-- SELECT * FROM "Match" WHERE "clientId"::text = 'client-uuid'; -- Should work
--
-- Test message sending:
-- INSERT INTO "Message" ("matchId", "senderId", "text")
-- VALUES ('match-id', 'client-uuid', 'Hello');
--
-- Test review creation on completed match:
-- INSERT INTO "Review" ("matchId", "authorId", "targetId", "score")
-- VALUES ('completed-match-id', 'client-uuid', 'provider-uuid', 5);
