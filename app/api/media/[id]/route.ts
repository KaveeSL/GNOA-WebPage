import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const fileId = parseInt(id, 10);

    if (Number.isNaN(fileId)) {
      return NextResponse.json({ error: 'Invalid file id' }, { status: 400 });
    }

    const [rows] = await pool.execute(
      'SELECT mime_type, data FROM uploaded_files WHERE id = ?',
      [fileId]
    );

    const files = rows as { mime_type: string; data: Buffer }[];
    if (!files.length) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    const file = files[0];
    const data = Buffer.isBuffer(file.data) ? file.data : Buffer.from(file.data);

    return new NextResponse(new Uint8Array(data), {
      headers: {
        'Content-Type': file.mime_type,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Media serve error:', error);
    return NextResponse.json({ error: 'Failed to load file' }, { status: 500 });
  }
}
