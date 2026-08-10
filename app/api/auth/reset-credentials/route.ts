import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { timingSafeEqual } from 'crypto';
import pool from '@/lib/db';

function codesMatch(provided: string, expected: string): boolean {
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  try {
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const code = typeof body.code === 'string' ? body.code.trim() : '';
    const newUsername =
      typeof body.newUsername === 'string' ? body.newUsername.trim() : '';
    const newPassword =
      typeof body.newPassword === 'string' ? body.newPassword : '';
    const action = body.action === 'verify' ? 'verify' : 'update';

    const expectedCode = process.env.ADMIN_RESET_CODE?.trim();
    if (!expectedCode) {
      return NextResponse.json(
        {
          error:
            'Reset is not configured. Set ADMIN_RESET_CODE in your environment.',
        },
        { status: 503 }
      );
    }

    if (!code) {
      return NextResponse.json({ error: 'Reset code is required' }, { status: 400 });
    }

    if (!codesMatch(code, expectedCode)) {
      return NextResponse.json({ error: 'Invalid reset code' }, { status: 401 });
    }

    if (action === 'verify') {
      return NextResponse.json({ success: true, verified: true });
    }

    if (!newUsername || newUsername.length < 3) {
      return NextResponse.json(
        { error: 'Username must be at least 3 characters' },
        { status: 400 }
      );
    }
    if (!newPassword || newPassword.length < 3) {
      return NextResponse.json(
        { error: 'Password must be at least 3 characters' },
        { status: 400 }
      );
    }

    const [users] = (await pool.execute(
      'SELECT id, username FROM admin_users ORDER BY id ASC LIMIT 1'
    )) as [{ id: number; username: string }[], unknown];

    if (!users.length) {
      return NextResponse.json(
        { error: 'No admin account found' },
        { status: 404 }
      );
    }

    const admin = users[0];

    if (newUsername !== admin.username) {
      const [dupes] = (await pool.execute(
        'SELECT id FROM admin_users WHERE username = ? AND id != ? LIMIT 1',
        [newUsername, admin.id]
      )) as [{ id: number }[], unknown];
      if (dupes.length) {
        return NextResponse.json(
          { error: 'That username is already taken' },
          { status: 409 }
        );
      }
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.execute(
      'UPDATE admin_users SET username = ?, password = ? WHERE id = ?',
      [newUsername, hashedPassword, admin.id]
    );

    return NextResponse.json({
      success: true,
      message: 'Username and password updated. You can sign in with the new credentials.',
    });
  } catch (error: unknown) {
    console.error('Reset credentials error:', error);
    return NextResponse.json(
      { error: 'Failed to update credentials' },
      { status: 500 }
    );
  }
}
