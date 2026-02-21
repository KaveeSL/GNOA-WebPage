import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export async function GET() {
    try {
        const [rows] = await pool.execute(
            'SELECT * FROM banner WHERE is_active = TRUE ORDER BY created_at DESC LIMIT 1'
        );

        const banners = rows as any[];
        if (banners.length === 0) {
            return NextResponse.json(null);
        }

        return NextResponse.json(banners[0]);
    } catch (error: any) {
        console.error('Error fetching banner:', error);
        return NextResponse.json(
            { error: 'Failed to fetch banner' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const auth = verifyToken(request);
        if (!auth.authenticated) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { message, link_text, link_url, is_active } = body;

        if (!message) {
            return NextResponse.json(
                { error: 'Message is required' },
                { status: 400 }
            );
        }

        // Deactivate all existing banners
        await pool.execute(
            'UPDATE banner SET is_active = FALSE'
        );

        // Insert new banner
        const [result] = await pool.execute(
            'INSERT INTO banner (message, link_text, link_url, is_active) VALUES (?, ?, ?, ?)',
            [message, link_text || null, link_url || null, is_active !== undefined ? is_active : true]
        );

        return NextResponse.json({ 
            id: (result as any).insertId,
            message,
            link_text,
            link_url,
            is_active: is_active !== undefined ? is_active : true
        });
    } catch (error: any) {
        console.error('Error creating banner:', error);
        return NextResponse.json(
            { error: 'Failed to create banner' },
            { status: 500 }
        );
    }
}
