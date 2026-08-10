import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const [galleries] = await pool.execute(
      'SELECT * FROM photo_galleries WHERE id = ?',
      [id]
    );
    const galleryList = galleries as {
      id: number;
      title: string;
      description: string | null;
      display_order: number;
    }[];

    if (!galleryList.length) {
      return NextResponse.json({ error: 'Gallery not found' }, { status: 404 });
    }

    const [photos] = await pool.execute(
      'SELECT * FROM gallery_photos WHERE gallery_id = ? ORDER BY display_order ASC, id ASC',
      [id]
    );

    return NextResponse.json({
      ...galleryList[0],
      photos,
    });
  } catch (error) {
    console.error('Error fetching gallery:', error);
    return NextResponse.json({ error: 'Failed to fetch gallery' }, { status: 500 });
  }
}

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
    const { title, description, display_order } = await request.json();

    if (!title?.trim()) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    await pool.execute(
      'UPDATE photo_galleries SET title = ?, description = ?, display_order = ? WHERE id = ?',
      [title.trim(), description?.trim() || null, display_order ?? 0, id]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating gallery:', error);
    return NextResponse.json({ error: 'Failed to update gallery' }, { status: 500 });
  }
}

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
    await pool.execute('DELETE FROM photo_galleries WHERE id = ?', [id]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting gallery:', error);
    return NextResponse.json({ error: 'Failed to delete gallery' }, { status: 500 });
  }
}
