import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { ensureNewsTables } from '@/lib/ensure-news-tables';
import type { INewsImage, INewsItem } from '@/types';

const MAX_IMAGES = 5;

async function fetchNewsWithImages(publishedOnly: boolean): Promise<INewsItem[]> {
  const [articles] = await pool.execute(
    publishedOnly
      ? 'SELECT * FROM news WHERE is_published = 1 ORDER BY display_order ASC, COALESCE(published_at, created_at) DESC, id DESC'
      : 'SELECT * FROM news ORDER BY display_order ASC, COALESCE(published_at, created_at) DESC, id DESC'
  );

  const [images] = await pool.execute(
    'SELECT * FROM news_images ORDER BY display_order ASC, id ASC'
  );

  const articleList = articles as Omit<INewsItem, 'images'>[];
  const imageList = images as INewsImage[];

  return articleList.map((article) => ({
    ...article,
    images: imageList.filter((img) => img.news_id === article.id),
  }));
}

export async function GET(request: NextRequest) {
  try {
    await ensureNewsTables();
    const auth = verifyToken(request);
    const publishedOnly = !auth.authenticated;
    const result = await fetchNewsWithImages(publishedOnly);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json([]);
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureNewsTables();
    const auth = verifyToken(request);
    if (!auth.authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const title = typeof body.title === 'string' ? body.title.trim() : '';
    const summary = typeof body.summary === 'string' ? body.summary.trim() : '';
    const content = typeof body.content === 'string' ? body.content.trim() : '';
    const images: string[] = Array.isArray(body.images)
      ? body.images.filter((u: unknown) => typeof u === 'string' && u.trim()).map((u: string) => u.trim())
      : [];
    const is_published = body.is_published !== false && body.is_published !== 0;
    const display_order = Number.isFinite(Number(body.display_order)) ? Number(body.display_order) : 0;
    const publishedAtRaw =
      typeof body.published_at === 'string' ? body.published_at.trim() : '';
    let published_at: Date | null = null;
    if (publishedAtRaw) {
      const parsed = new Date(
        /^\d{4}-\d{2}-\d{2}$/.test(publishedAtRaw)
          ? `${publishedAtRaw}T12:00:00`
          : publishedAtRaw
      );
      if (Number.isNaN(parsed.getTime())) {
        return NextResponse.json({ error: 'Invalid publish date' }, { status: 400 });
      }
      published_at = parsed;
    }

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }
    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }
    if (!published_at) {
      return NextResponse.json({ error: 'Publish date is required' }, { status: 400 });
    }
    if (images.length > MAX_IMAGES) {
      return NextResponse.json({ error: `Maximum ${MAX_IMAGES} images allowed per news item` }, { status: 400 });
    }

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const [result] = await connection.execute(
        `INSERT INTO news (title, summary, content, is_published, display_order, published_at)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          title,
          summary || null,
          content,
          is_published ? 1 : 0,
          display_order,
          published_at,
        ]
      ) as [{ insertId: number }, unknown];

      const newsId = result.insertId;

      for (let i = 0; i < images.length; i++) {
        await connection.execute(
          'INSERT INTO news_images (news_id, image, display_order) VALUES (?, ?, ?)',
          [newsId, images[i], i]
        );
      }

      await connection.commit();
      return NextResponse.json({ success: true, id: newsId });
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  } catch (error: unknown) {
    console.error('Error creating news:', error);
    return NextResponse.json({ error: 'Failed to create news' }, { status: 500 });
  }
}
