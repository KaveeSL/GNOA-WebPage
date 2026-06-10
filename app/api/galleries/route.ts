import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export async function GET() {
  try {
    const [galleries] = await pool.execute(
      'SELECT * FROM photo_galleries ORDER BY display_order ASC, id ASC'
    );

    const [photos] = await pool.execute(
      'SELECT * FROM gallery_photos ORDER BY display_order ASC, id ASC'
    );

    const galleryList = galleries as {
      id: number;
      title: string;
      description: string | null;
      display_order: number;
    }[];

    const photoList = photos as {
      id: number;
      gallery_id: number;
      image: string;
      display_order: number;
    }[];

    const result = galleryList.map((gallery) => ({
      ...gallery,
      photos: photoList.filter((p) => p.gallery_id === gallery.id),
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching galleries:', error);
    return NextResponse.json([]);
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = verifyToken(request);
    if (!auth.authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, description, display_order } = await request.json();

    if (!title?.trim()) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const [result] = await pool.execute(
      'INSERT INTO photo_galleries (title, description, display_order) VALUES (?, ?, ?)',
      [title.trim(), description?.trim() || null, display_order ?? 0]
    ) as [{ insertId: number }, unknown];

    return NextResponse.json({ success: true, id: result.insertId });
  } catch (error: unknown) {
    console.error('Error creating gallery:', error);
    return NextResponse.json({ error: 'Failed to create gallery' }, { status: 500 });
  }
}
