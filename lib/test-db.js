// Test database connection
// Run with: node lib/test-db.js

const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });

async function testConnection() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'gnoaweb',
    });

    console.log('✅ Database connection successful!');
    
    // Test if tables exist
    const [tables] = await connection.execute('SHOW TABLES');
    console.log('✅ Tables found:', tables.length);
    
    if (tables.length === 0) {
      console.log('⚠️  No tables found. Please run: mysql -u root -p < lib/db-init.sql');
    } else {
      console.log('Tables:', tables.map(t => Object.values(t)[0]).join(', '));
    }

    // Test admin user
    const [users] = await connection.execute('SELECT * FROM admin_users WHERE username = ?', ['gnoaadmin']);
    if (users.length > 0) {
      console.log('✅ Admin user exists');
    } else {
      console.log('⚠️  Admin user not found. Please run: mysql -u root -p < lib/db-init.sql');
    }

    await connection.end();
    console.log('✅ All tests passed!');
  } catch (error) {
    console.error('❌ Database connection failed:');
    console.error('Error:', error.message);
    console.error('\nPlease check:');
    console.error('1. MySQL server is running');
    console.error('2. Database "gnoaweb" exists');
    console.error('3. .env.local file has correct credentials:');
    console.error('   DB_HOST=localhost');
    console.error('   DB_USER=root');
    console.error('   DB_PASSWORD=your_password');
    console.error('   DB_NAME=gnoaweb');
    process.exit(1);
  }
}

testConnection();
