import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = verifyToken(request);
    if (!auth.authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { images } = await request.json();

    if (!Array.isArray(images) || images.length === 0) {
      return NextResponse.json({ error: 'At least one image URL is required' }, { status: 400 });
    }

    const [existing] = await pool.execute(
      'SELECT COALESCE(MAX(display_order), -1) as max_order FROM gallery_photos WHERE gallery_id = ?',
      [id]
    );

    let nextOrder = ((existing as { max_order: number }[])[0]?.max_order ?? -1) + 1;
    const insertedIds: number[] = [];

    for (const image of images) {
      if (!image || typeof image !== 'string') continue;

      const [result] = await pool.execute(
        'INSERT INTO gallery_photos (gallery_id, image, display_order) VALUES (?, ?, ?)',
        [id, image, nextOrder]
      ) as [{ insertId: number }, unknown];

      insertedIds.push(result.insertId);
      nextOrder++;
    }

    return NextResponse.json({ success: true, ids: insertedIds });
  } catch (error) {
    console.error('Error adding gallery photos:', error);
    return NextResponse.json({ error: 'Failed to add photos' }, { status: 500 });
  }
}
