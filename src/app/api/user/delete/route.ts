import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function DELETE(request: Request) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userId = session.user.id;

        // Delete user and all related data (cascading deletes handled by Prisma schema)
        await prisma.user.delete({
            where: { id: userId }
        });

        // Clear session cookie
        const response = NextResponse.json({
            success: true,
            message: 'Account deleted successfully'
        });

        response.cookies.delete('session');

        return response;
    } catch (error) {
        console.error('[DELETE_ACCOUNT_ERROR]', error);
        return NextResponse.json(
            { error: 'Failed to delete account' },
            { status: 500 }
        );
    }
}
