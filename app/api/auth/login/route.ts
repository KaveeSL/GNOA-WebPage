import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Get admin user from database
    const [users] = await pool.execute(
      'SELECT * FROM admin_users WHERE username = ?',
      [username]
    ) as any[];

    if (users.length === 0) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const user = users[0];

    // For initial setup, if password is not hashed, hash it and update
    // Otherwise, verify the password
    let isValid = false;
    
    if (user.password.startsWith('$2a$') || user.password.startsWith('$2b$')) {
      // Password is hashed, verify it
      isValid = await bcrypt.compare(password, user.password);
    } else {
      // Password is plain text (initial setup), check directly
      isValid = user.password === password;
      // If valid, hash it and update the database
      if (isValid) {
        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.execute(
          'UPDATE admin_users SET password = ? WHERE id = ?',
          [hashedPassword, user.id]
        );
      }
    }

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET || 'default-secret-change-in-production',
      { expiresIn: '24h' }
    );

    const response = NextResponse.json({ success: true, token });
    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 // 24 hours
    });

    return response;
  } catch (error: any) {
    console.error('Login error:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      errno: error.errno,
      sqlState: error.sqlState,
      sqlMessage: error.sqlMessage
    });
    
    // Provide more helpful error messages
    let errorMessage = 'Internal server error';
    if (error.code === 'ER_BAD_DB_ERROR') {
      errorMessage = 'Database does not exist. Please run: mysql -u root < lib/db-init.sql';
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      errorMessage = 'Database access denied. Check your DB_USER and DB_PASSWORD in .env.local';
    } else if (error.code === 'ECONNREFUSED') {
      errorMessage = 'Cannot connect to MySQL server. Make sure MySQL is running.';
    } else if (error.code === 'ER_NO_SUCH_TABLE') {
      errorMessage = 'Database tables not found. Please run: mysql -u root < lib/db-init.sql';
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return NextResponse.json(
      { 
        error: errorMessage,
        message: process.env.NODE_ENV === 'development' ? error.message : undefined,
        code: process.env.NODE_ENV === 'development' ? error.code : undefined
      },
      { status: 500 }
    );
  }
}
