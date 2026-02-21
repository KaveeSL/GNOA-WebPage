import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const token = request.cookies.get('admin_token')?.value;
        if (!token || !verifyToken(token)) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { id } = await params;
        const body = await request.json();
        const { message, link_text, link_url, is_active } = body;

        if (!message) {
            return NextResponse.json(
                { error: 'Message is required' },
                { status: 400 }
            );
        }

        // If activating this banner, deactivate all others
        if (is_active === true) {
            await pool.execute(
                'UPDATE banner SET is_active = FALSE WHERE id != ?',
                [id]
            );
        }

        await pool.execute(
            'UPDATE banner SET message = ?, link_text = ?, link_url = ?, is_active = ? WHERE id = ?',
            [message, link_text || null, link_url || null, is_active !== undefined ? is_active : false, id]
        );

        return NextResponse.json({ 
            id: parseInt(id),
            message,
            link_text,
            link_url,
            is_active: is_active !== undefined ? is_active : false
        });
    } catch (error: any) {
        console.error('Error updating banner:', error);
        return NextResponse.json(
            { error: 'Failed to update banner' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const token = request.cookies.get('admin_token')?.value;
        if (!token || !verifyToken(token)) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { id } = await params;
        await pool.execute('DELETE FROM banner WHERE id = ?', [id]);

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Error deleting banner:', error);
        return NextResponse.json(
            { error: 'Failed to delete banner' },
            { status: 500 }
        );
    }
}
