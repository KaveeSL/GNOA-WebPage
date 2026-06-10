import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { put } from '@vercel/blob';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import pool from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const auth = verifyToken(request);
    if (!auth.authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only PNG, JPG, and JPEG are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size too large. Maximum size is 5MB.' },
        { status: 400 }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const extension = originalName.split('.').pop()?.toLowerCase() || 'jpg';
    const filename = `uploads/${timestamp}_${originalName}`;

    const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
    const buffer = Buffer.from(await file.arrayBuffer());

    if (blobToken) {
      const blob = await put(filename, file, {
        access: 'public',
        contentType: file.type,
        token: blobToken,
      });
      return NextResponse.json({ url: blob.url, filename: blob.pathname });
    }

    // Production: persist in MySQL (Vercel filesystem is read-only / ephemeral)
    if (process.env.VERCEL) {
      const localFilename = `${timestamp}_${originalName}`;
      const [result] = await pool.execute(
        'INSERT INTO uploaded_files (filename, mime_type, data) VALUES (?, ?, ?)',
        [localFilename, file.type, buffer]
      ) as [{ insertId: number }, unknown];

      const url = `/api/media/${result.insertId}?v=${timestamp}`;
      return NextResponse.json({ url, filename: localFilename });
    }

    // Local dev: save to public/uploads
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadsDir, { recursive: true });

    const localFilename = `${timestamp}_${originalName}`;
    const filePath = path.join(uploadsDir, localFilename);
    await writeFile(filePath, buffer);

    // Serve via API so new files are available immediately (no dev-server restart)
    const url = `/api/uploads/${localFilename}?v=${timestamp}`;
    return NextResponse.json({ url, filename: `uploads/${localFilename}` });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file', message: error.message },
      { status: 500 }
    );
  }
}
