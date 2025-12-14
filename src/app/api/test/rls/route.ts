/**
 * SECURITY TEST: Row-Level Security Verification Endpoint
 *
 * This endpoint tests that RLS policies are properly enforced.
 * It attempts to query users with and without RLS context set.
 *
 * WARNING: This is a DEBUG endpoint and should be DISABLED in production.
 * Remove this file or add authentication guards in production.
 */

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    // Security check - only allow in development
    if (process.env.NODE_ENV === 'production') {
        return NextResponse.json(
            { error: 'RLS testing disabled in production' },
            { status: 403 }
        )
    }

    const results: Record<string, any> = {
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
        tests: {}
    }

    try {
        // =====================================================================
        // TEST 1: Raw Query to Check RLS Policies
        // =====================================================================
        const policies = await prisma.$queryRaw`
            SELECT
                schemaname,
                tablename,
                policyname,
                permissive,
                roles::text as role_list
            FROM pg_policies
            WHERE tablename IN ('User', 'Profile', 'VerificationRequest')
            ORDER BY tablename, policyname
        `

        results.tests.policies_created = {
            status: policies && Array.isArray(policies) && policies.length > 0 ? 'PASS' : 'FAIL',
            policy_count: Array.isArray(policies) ? policies.length : 0,
            policies: policies
        }

        // =====================================================================
        // TEST 2: Check if RLS is Enabled
        // =====================================================================
        const rlsStatus = await prisma.$queryRaw`
            SELECT
                schemaname,
                tablename,
                rowsecurity
            FROM pg_tables
            WHERE tablename IN ('User', 'Profile', 'VerificationRequest')
                AND schemaname = 'public'
            ORDER BY tablename
        `

        const allRLSEnabled = (rlsStatus as any[]).every((row: any) => row.rowsecurity === true)

        results.tests.rls_enabled = {
            status: allRLSEnabled ? 'PASS' : 'FAIL',
            tables: rlsStatus
        }

        // =====================================================================
        // TEST 3: List Current Configuration
        // =====================================================================
        const config = {
            prisma_middleware_active: true,
            rls_context_variable: 'app.current_user_id',
            rls_role_variable: 'app.current_user_role'
        }

        results.tests.configuration = {
            status: 'INFO',
            config: config
        }

        // =====================================================================
        // TEST 4: Test Prisma Middleware
        // =====================================================================
        try {
            // Clear context
            (globalThis as any).__rls_context = {
                userId: null,
                userRole: null
            }

            // Try to query users without context
            const usersWithoutContext = await prisma.user.findMany({
                take: 1,
                select: { id: true, name: true, role: true }
            })

            results.tests.context_enforcement = {
                status: 'PARTIAL',
                note: 'RLS enforcement depends on PostgreSQL session variables being set by middleware',
                users_found_without_context: usersWithoutContext.length,
                message: 'If 0 users found, RLS is working. If > 0, check middleware is running.'
            }
        } catch (err) {
            results.tests.context_enforcement = {
                status: 'ERROR',
                error: String(err)
            }
        }

        // =====================================================================
        // TEST 5: Summary
        // =====================================================================
        const passedTests = Object.values(results.tests).filter(
            (t: any) => t.status === 'PASS'
        ).length

        const totalTests = Object.keys(results.tests).length

        results.summary = {
            total_tests: totalTests,
            passed: passedTests,
            overall_status:
                passedTests >= totalTests - 1 ? 'PASS' : 'PARTIAL'
        }

        return NextResponse.json(results, { status: 200 })
    } catch (error) {
        results.error = String(error)
        results.summary = { status: 'ERROR' }
        return NextResponse.json(results, { status: 500 })
    }
}
