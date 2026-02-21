import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { verifyToken } from '@/lib/auth';

// GET - Fetch all photo cards
export async function GET() {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM photo_cards ORDER BY display_order ASC, id ASC'
    );
    return NextResponse.json(rows);
  } catch (error: any) {
    console.error('Error fetching photo cards:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch photo cards',
        message: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

// POST - Create new photo card
export async function POST(request: NextRequest) {
  try {
    const auth = verifyToken(request);
    if (!auth.authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { image, title, description, category, display_order } = await request.json();

    if (!image || !title || !description) {
      return NextResponse.json(
        { error: 'Image, title, and description are required' },
        { status: 400 }
      );
    }

    const [result] = await pool.execute(
      'INSERT INTO photo_cards (image, title, description, category, display_order) VALUES (?, ?, ?, ?, ?)',
      [image, title, description, category || null, display_order || 0]
    ) as any[];

    return NextResponse.json({ 
      success: true, 
      id: result.insertId 
    });
  } catch (error: any) {
    console.error('Error creating photo card:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create photo card',
        message: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}
