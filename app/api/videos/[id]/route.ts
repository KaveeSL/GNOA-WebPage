import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { verifyToken } from '@/lib/auth';

// Extract YouTube video ID from various URL formats
function extractYouTubeVideoId(urlOrId: string): string | null {
  if (!urlOrId) return null;
  
  const trimmed = urlOrId.trim();
  
  // If it's already just an ID (11 characters, alphanumeric with hyphens/underscores)
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  // Try to extract from various YouTube URL formats
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = trimmed.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

// PUT - Update video
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
    const { video_id, title, description, display_order } = await request.json();

    if (!video_id || !title) {
      return NextResponse.json(
        { error: 'Video ID and title are required' },
        { status: 400 }
      );
    }

    // Extract clean video ID
    const cleanVideoId = extractYouTubeVideoId(video_id);
    if (!cleanVideoId || cleanVideoId.length !== 11) {
      return NextResponse.json(
        { error: 'Invalid YouTube video URL or ID. Please provide a valid YouTube URL or 11-character video ID.' },
        { status: 400 }
      );
    }

    await pool.execute(
      'UPDATE videos SET video_id = ?, title = ?, description = ?, display_order = ? WHERE id = ?',
      [cleanVideoId, title, description || null, display_order || 0, id]
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error updating video:', error);
    return NextResponse.json(
      { 
        error: 'Failed to update video',
        message: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete video
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
    await pool.execute('DELETE FROM videos WHERE id = ?', [id]);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting video:', error);
    return NextResponse.json(
      { 
        error: 'Failed to delete video',
        message: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}
