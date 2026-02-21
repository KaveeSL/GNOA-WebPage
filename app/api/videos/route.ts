import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { verifyToken } from '@/lib/auth';

// GET - Fetch all videos
export async function GET() {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM videos ORDER BY display_order ASC, id ASC'
    );
    return NextResponse.json(rows);
  } catch (error: any) {
    console.error('Error fetching videos:', error);
    // Return empty array instead of error to prevent frontend crashes
    return NextResponse.json([]);
  }
}

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

// POST - Create new video
export async function POST(request: NextRequest) {
  try {
    const auth = verifyToken(request);
    if (!auth.authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

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

    const [result] = await pool.execute(
      'INSERT INTO videos (video_id, title, description, display_order) VALUES (?, ?, ?, ?)',
      [cleanVideoId, title, description || null, display_order || 0]
    ) as any[];

    return NextResponse.json({ 
      success: true, 
      id: result.insertId 
    });
  } catch (error: any) {
    console.error('Error creating video:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create video',
        message: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}
