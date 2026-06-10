import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; photoId: string }> }
) {
  try {
    const auth = verifyToken(request);
    if (!auth.authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, photoId } = await params;
    await pool.execute(
      'DELETE FROM gallery_photos WHERE id = ? AND gallery_id = ?',
      [photoId, id]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting gallery photo:', error);
    return NextResponse.json({ error: 'Failed to delete photo' }, { status: 500 });
  }
}
