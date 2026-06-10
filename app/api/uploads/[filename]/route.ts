import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

const MIME_TYPES: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
};

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename: rawFilename } = await params;
    const filename = path.basename(rawFilename);

    if (!filename || filename !== rawFilename || filename.includes('..')) {
      return NextResponse.json({ error: 'Invalid filename' }, { status: 400 });
    }

    const ext = path.extname(filename).toLowerCase();
    const mimeType = MIME_TYPES[ext];
    if (!mimeType) {
      return NextResponse.json({ error: 'Unsupported file type' }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), 'public', 'uploads', filename);
    const data = await readFile(filePath);

    return new NextResponse(new Uint8Array(data), {
      headers: {
        'Content-Type': mimeType,
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error: unknown) {
    const err = error as { code?: string };
    if (err.code === 'ENOENT') {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }
    console.error('Upload serve error:', error);
    return NextResponse.json({ error: 'Failed to load file' }, { status: 500 });
  }
}
