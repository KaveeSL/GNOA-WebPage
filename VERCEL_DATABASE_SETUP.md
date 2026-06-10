# Vercel MySQL Database Setup Guide

## Step 1: Choose a MySQL Hosting Service

### Option A: PlanetScale (Recommended - Free Tier Available)
1. Go to https://planetscale.com
2. Sign up for a free account
3. Create a new database
4. Get your connection string from the dashboard
5. Note: PlanetScale uses a different connection format, you may need to adjust the connection code

### Option B: Railway (Free Tier Available)
1. Go to https://railway.app
2. Sign up and create a new project
3. Add a MySQL service
4. Get connection details from the service settings

### Option C: Aiven (Free Tier Available)
1. Go to https://aiven.io
2. Sign up and create a MySQL service
3. Get connection details from the service dashboard

## Step 2: Set Up Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variables:

```
DB_HOST=your-mysql-host.com
DB_USER=your-username
DB_PASSWORD=your-password
DB_NAME=gnoaweb
JWT_SECRET=your-secure-random-string-here
```

**Important:**
- Set these for **Production**, **Preview**, and **Development** environments
- Use a strong random string for `JWT_SECRET` (you can generate one at https://randomkeygen.com)
- Make sure `DB_NAME` matches your database name (usually `gnoaweb`)

## Step 3: Initialize the Database

After setting up your MySQL database, you need to run the initialization script:

1. Connect to your MySQL database using:
   - MySQL Workbench
   - phpMyAdmin
   - Command line: `mysql -h your-host -u your-user -p`
   - Or use the database provider's web interface

2. Run the SQL script from `lib/db-init.sql`:

```sql
-- Create database (if not already created)
CREATE DATABASE IF NOT EXISTS gnoaweb;
USE gnoaweb;

-- Admin users table
CREATE TABLE IF NOT EXISTS admin_users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin user (password: 000)
INSERT INTO admin_users (username, password) 
VALUES ('gnoaadmin', '$2b$10$KE1thLygw5KRw..eUEen8OapQmzYakxfnrCQ4WhJ2EzwwcXLvE/sC')
ON DUPLICATE KEY UPDATE username=username;

-- Photo cards table
CREATE TABLE IF NOT EXISTS photo_cards (
  id INT AUTO_INCREMENT PRIMARY KEY,
  image VARCHAR(500) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(100),
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Videos table
CREATE TABLE IF NOT EXISTS videos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  video_id VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Uploaded files (image storage on Vercel when Blob is not configured)
CREATE TABLE IF NOT EXISTS uploaded_files (
  id INT AUTO_INCREMENT PRIMARY KEY,
  filename VARCHAR(255) NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  data MEDIUMBLOB NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Banner table
CREATE TABLE IF NOT EXISTS banner (
  id INT AUTO_INCREMENT PRIMARY KEY,
  message TEXT NOT NULL,
  link_text VARCHAR(255),
  link_url VARCHAR(500),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Step 4: Redeploy on Vercel

After setting up environment variables:
1. Go to your Vercel project
2. Click **Deployments**
3. Click the three dots on the latest deployment
4. Select **Redeploy**

Or push a new commit to trigger a new deployment.

## Step 5: Test the Connection

1. Visit your Vercel deployment URL
2. Try accessing `/admin/login`
3. Login with:
   - Username: `gnoaadmin`
   - Password: `000`

## Troubleshooting

### Connection Issues
- Verify all environment variables are set correctly in Vercel
- Check that your database allows connections from Vercel's IP addresses
- Some providers require SSL connections - you may need to update `lib/db.ts`

### SSL Connection (if required)
If your MySQL provider requires SSL, update `lib/db.ts`:

```typescript
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false
  },
  // ... rest of config
});
```

### PlanetScale Specific
PlanetScale uses a different connection method. You may need to use their connection string format or adjust the connection code.
