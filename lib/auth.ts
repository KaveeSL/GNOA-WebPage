import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export function verifyToken(request: NextRequest): { authenticated: boolean; userId?: number; username?: string } {
  try {
    const token = request.cookies.get('admin_token')?.value;

    if (!token) {
      return { authenticated: false };
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'default-secret-change-in-production'
    ) as { userId: number; username: string };

    return {
      authenticated: true,
      userId: decoded.userId,
      username: decoded.username
    };
  } catch (error) {
    return { authenticated: false };
  }
}
