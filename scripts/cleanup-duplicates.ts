import { PrismaClient } from "@prisma/client"
import { writeFileSync } from "fs"
import { join } from "path"

const prisma = new PrismaClient()

/**
 * CRITICAL: Cleanup duplicate proposals and reviews BEFORE running migrations
 *
 * This script:
 * 1. Finds duplicate proposals (same requestId + providerId)
 * 2. Finds duplicate reviews (same matchId + authorId)
 * 3. Removes duplicates, keeping only the most recent ones
 * 4. Logs all deletions for audit trail
 *
 * Run with: npx tsx scripts/cleanup-duplicates.ts
 *
 * IMPORTANT: Run this BEFORE applying migrations that add unique constraints!
 */

interface DuplicateRecord {
  requestId?: string
  providerId?: string
  matchId?: string
  authorId?: string
  count: number
}

async function cleanupDuplicateProposals(): Promise<{ deleted: number; logged: string[] }> {
  console.log("🔍 Scanning for duplicate proposals...")

  // Find duplicates: same requestId + providerId
  const duplicates = await prisma.$queryRaw<DuplicateRecord[]>`
    SELECT
      "requestId",
      "providerId",
      COUNT(*) as count
    FROM "Proposal"
    GROUP BY "requestId", "providerId"
    HAVING COUNT(*) > 1
  `

  if (duplicates.length === 0) {
    console.log("✅ No duplicate proposals found")
    return { deleted: 0, logged: [] }
  }

  console.log(`⚠️  Found ${duplicates.length} duplicate proposal groups`)

  let totalDeleted = 0
  const logs: string[] = []

  for (const dup of duplicates) {
    // Get all proposals for this requestId + providerId, ordered by creation date (newest first)
    const proposals = await prisma.proposal.findMany({
      where: {
        requestId: dup.requestId!,
        providerId: dup.providerId!
      },
      orderBy: { createdAt: "desc" },
      select: { id: true, createdAt: true }
    })

    // Keep the newest one, delete the rest
    const toDelete = proposals.slice(1)

    for (const proposal of toDelete) {
      await prisma.proposal.delete({
        where: { id: proposal.id }
      })

      totalDeleted++
      const logMessage = `Deleted duplicate proposal: ${proposal.id} (older than: ${proposals[0].id})`
      logs.push(logMessage)
      console.log(`  ✓ ${logMessage}`)
    }
  }

  console.log(`✅ Deleted ${totalDeleted} duplicate proposals`)
  return { deleted: totalDeleted, logged: logs }
}

async function cleanupDuplicateReviews(): Promise<{ deleted: number; logged: string[] }> {
  console.log("\n🔍 Scanning for duplicate reviews...")

  // Find duplicates: same matchId + authorId
  const duplicates = await prisma.$queryRaw<DuplicateRecord[]>`
    SELECT
      "matchId",
      "authorId",
      COUNT(*) as count
    FROM "Review"
    GROUP BY "matchId", "authorId"
    HAVING COUNT(*) > 1
  `

  if (duplicates.length === 0) {
    console.log("✅ No duplicate reviews found")
    return { deleted: 0, logged: [] }
  }

  console.log(`⚠️  Found ${duplicates.length} duplicate review groups`)

  let totalDeleted = 0
  const logs: string[] = []

  for (const dup of duplicates) {
    // Get all reviews for this matchId + authorId, ordered by creation date (newest first)
    const reviews = await prisma.review.findMany({
      where: {
        matchId: dup.matchId!,
        authorId: dup.authorId!
      },
      orderBy: { createdAt: "desc" },
      select: { id: true, createdAt: true }
    })

    // Keep the newest one, delete the rest
    const toDelete = reviews.slice(1)

    for (const review of toDelete) {
      await prisma.review.delete({
        where: { id: review.id }
      })

      totalDeleted++
      const logMessage = `Deleted duplicate review: ${review.id} (older than: ${reviews[0].id})`
      logs.push(logMessage)
      console.log(`  ✓ ${logMessage}`)
    }
  }

  console.log(`✅ Deleted ${totalDeleted} duplicate reviews`)
  return { deleted: totalDeleted, logged: logs }
}

async function main() {
  try {
    console.log("═════════════════════════════════════════════════════════════")
    console.log("🚀 Starting database cleanup: Removing duplicates")
    console.log("═════════════════════════════════════════════════════════════\n")

    const proposalResults = await cleanupDuplicateProposals()
    const reviewResults = await cleanupDuplicateReviews()

    const totalDeleted = proposalResults.deleted + reviewResults.deleted
    const allLogs = [...proposalResults.logged, ...reviewResults.logged]

    console.log("\n═════════════════════════════════════════════════════════════")
    console.log(`✅ Cleanup completed! Deleted ${totalDeleted} duplicate records`)
    console.log("═════════════════════════════════════════════════════════════\n")

    // Save audit log
    const timestamp = new Date().toISOString()
    const auditLog = `
DUPLICATE CLEANUP AUDIT LOG
Generated: ${timestamp}

Summary:
- Duplicate proposals deleted: ${proposalResults.deleted}
- Duplicate reviews deleted: ${reviewResults.deleted}
- Total records deleted: ${totalDeleted}

Details:
${allLogs.map(log => `- ${log}`).join("\n")}

This log confirms that duplicates were successfully removed before
applying unique constraints in the migration.
`

    const logPath = join(process.cwd(), "cleanup-audit.log")
    writeFileSync(logPath, auditLog)
    console.log(`📝 Audit log saved to: ${logPath}\n`)

    if (totalDeleted > 0) {
      console.log("⚠️  IMPORTANT: You can now safely run migrations with unique constraints")
      console.log("   Run: npx prisma migrate dev --name add_unique_constraints_proposals_reviews\n")
    } else {
      console.log("✅ No duplicates found - database is clean")
      console.log("   You can proceed with migrations\n")
    }
  } catch (error) {
    console.error("\n❌ Error during cleanup:", error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
