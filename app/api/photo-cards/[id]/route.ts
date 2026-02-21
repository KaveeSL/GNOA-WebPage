import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { verifyToken } from '@/lib/auth';

// PUT - Update photo card
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = verifyToken(request);
    if (!auth.authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { image, title, description, category, display_order } = await request.json();

    if (!title || !description) {
      return NextResponse.json(
        { error: 'Title and description are required' },
        { status: 400 }
      );
    }

    await pool.execute(
      'UPDATE photo_cards SET image = ?, title = ?, description = ?, category = ?, display_order = ? WHERE id = ?',
      [image, title, description, category || null, display_order || 0, id]
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error updating photo card:', error);
    return NextResponse.json(
      { 
        error: 'Failed to update photo card',
        message: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete photo card
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = verifyToken(request);
    if (!auth.authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await pool.execute('DELETE FROM photo_cards WHERE id = ?', [id]);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting photo card:', error);
    return NextResponse.json(
      { 
        error: 'Failed to delete photo card',
        message: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}
