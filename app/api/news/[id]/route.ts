import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { ensureNewsTables } from '@/lib/ensure-news-tables';
import type { INewsImage, INewsItem } from '@/types';

const MAX_IMAGES = 5;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await ensureNewsTables();
    const { id } = await params;
    const auth = verifyToken(request);

    const [articles] = await pool.execute(
      auth.authenticated
        ? 'SELECT * FROM news WHERE id = ?'
        : 'SELECT * FROM news WHERE id = ? AND is_published = 1',
      [id]
    ) as [Omit<INewsItem, 'images'>[], unknown];

    if (!articles.length) {
      return NextResponse.json({ error: 'News not found' }, { status: 404 });
    }

    const [images] = await pool.execute(
      'SELECT * FROM news_images WHERE news_id = ? ORDER BY display_order ASC, id ASC',
      [id]
    ) as [INewsImage[], unknown];

    return NextResponse.json({ ...articles[0], images });
  } catch (error) {
    console.error('Error fetching news item:', error);
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await ensureNewsTables();
    const auth = verifyToken(request);
    if (!auth.authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const title = typeof body.title === 'string' ? body.title.trim() : '';
    const summary = typeof body.summary === 'string' ? body.summary.trim() : '';
    const content = typeof body.content === 'string' ? body.content.trim() : '';
    const images: string[] = Array.isArray(body.images)
      ? body.images.filter((u: unknown) => typeof u === 'string' && u.trim()).map((u: string) => u.trim())
      : [];
    const is_published = body.is_published !== false && body.is_published !== 0;
    const display_order = Number.isFinite(Number(body.display_order)) ? Number(body.display_order) : 0;
    const hasPublishedAtField = Object.prototype.hasOwnProperty.call(body, 'published_at');
    const publishedAtRaw =
      typeof body.published_at === 'string' ? body.published_at.trim() : '';
    let parsedPublishedAt: Date | null | undefined = undefined;
    if (hasPublishedAtField) {
      if (!publishedAtRaw) {
        parsedPublishedAt = null;
      } else {
        const parsed = new Date(
          /^\d{4}-\d{2}-\d{2}$/.test(publishedAtRaw)
            ? `${publishedAtRaw}T12:00:00`
            : publishedAtRaw
        );
        if (Number.isNaN(parsed.getTime())) {
          return NextResponse.json({ error: 'Invalid publish date' }, { status: 400 });
        }
        parsedPublishedAt = parsed;
      }
    }

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }
    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }
    if (hasPublishedAtField && !parsedPublishedAt) {
      return NextResponse.json({ error: 'Publish date is required' }, { status: 400 });
    }
    if (images.length > MAX_IMAGES) {
      return NextResponse.json({ error: `Maximum ${MAX_IMAGES} images allowed per news item` }, { status: 400 });
    }

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const [existing] = await connection.execute(
        'SELECT id, published_at FROM news WHERE id = ?',
        [id]
      ) as [{ id: number; published_at: string | null }[], unknown];

      if (!existing.length) {
        await connection.rollback();
        return NextResponse.json({ error: 'News not found' }, { status: 404 });
      }

      const published_at =
        parsedPublishedAt !== undefined ? parsedPublishedAt : existing[0].published_at;

      await connection.execute(
        `UPDATE news
         SET title = ?, summary = ?, content = ?, is_published = ?, display_order = ?, published_at = ?
         WHERE id = ?`,
        [title, summary || null, content, is_published ? 1 : 0, display_order, published_at, id]
      );

      await connection.execute('DELETE FROM news_images WHERE news_id = ?', [id]);

      for (let i = 0; i < images.length; i++) {
        await connection.execute(
          'INSERT INTO news_images (news_id, image, display_order) VALUES (?, ?, ?)',
          [id, images[i], i]
        );
      }

      await connection.commit();
      return NextResponse.json({ success: true });
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error updating news:', error);
    return NextResponse.json({ error: 'Failed to update news' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await ensureNewsTables();
    const auth = verifyToken(request);
    if (!auth.authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await pool.execute('DELETE FROM news WHERE id = ?', [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting news:', error);
    return NextResponse.json({ error: 'Failed to delete news' }, { status: 500 });
  }
}
