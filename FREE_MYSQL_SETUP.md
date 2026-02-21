# Free MySQL Database Setup Guide

## Option 1: Render (Recommended - Free Tier)

### Steps:
1. Go to https://render.com
2. Sign up with GitHub
3. Click **New** → **PostgreSQL** (or MySQL if available)
4. Select **Free** plan
5. Name your database (e.g., `gnoaweb`)
6. Click **Create Database**
7. Wait for provisioning (~2-3 minutes)
8. Once ready, go to the database dashboard
9. Copy the connection details:
   - **Internal Database URL** or **External Database URL**
   - Or individual values: Host, Port, Database, User, Password

### Connection Details Format:
```
DB_HOST=your-db-host.onrender.com
DB_USER=your-username
DB_PASSWORD=your-password
DB_NAME=your-database-name
DB_PORT=5432 (for PostgreSQL) or 3306 (for MySQL)
```

**Note:** If Render only offers PostgreSQL, you'll need to migrate to PostgreSQL (I can help with that).

---

## Option 2: Aiven (Free Trial)

### Steps:
1. Go to https://aiven.io
2. Sign up for free account
3. Click **Create Service**
4. Select **MySQL**
5. Choose **Hobbyist** plan (free for 1 month, then ~$9/month)
6. Select region closest to you
7. Click **Create Service**
8. Wait for provisioning
9. Go to **Overview** tab
10. Copy connection details from **Connection information**

### Connection Details:
- Host
- Port (usually 3306)
- Database name
- Username
- Password

---

## Option 3: FreeSQLDatabase.com (100% Free)

### Steps:
1. Go to https://freesqldatabase.com
2. Click **Sign Up**
3. Fill in registration form
4. Verify email
5. Login and click **Create Database**
6. Fill in database details:
   - Database name: `gnoaweb`
   - Username: (choose one)
   - Password: (choose one)
7. Click **Create**
8. Note the connection details:
   - Host: `sql.freesqldatabase.com`
   - Port: `3306`
   - Database name
   - Username
   - Password

### Connection Details Format:
```
DB_HOST=sql.freesqldatabase.com
DB_USER=your-username
DB_PASSWORD=your-password
DB_NAME=gnoaweb
```

---

## Option 4: db4free.net (100% Free)

### Steps:
1. Go to https://db4free.net
2. Click **Sign up**
3. Fill in the registration form
4. Verify email
5. Login
6. Create a new database
7. Get connection details:
   - Host: `db4free.net`
   - Port: `3306`
   - Database name
   - Username
   - Password

### Connection Details Format:
```
DB_HOST=db4free.net
DB_USER=your-username
DB_PASSWORD=your-password
DB_NAME=your-database-name
```

---

## After Getting Database Connection Details:

### 1. Add to Vercel Environment Variables:
- Go to Vercel project → Settings → Environment Variables
- Add:
  ```
  DB_HOST=your-host
  DB_USER=your-username
  DB_PASSWORD=your-password
  DB_NAME=your-database-name
  JWT_SECRET=generate-random-string-here
  ```

### 2. Initialize Database:
Connect to your database using:
- MySQL Workbench
- phpMyAdmin (if provided)
- Command line: `mysql -h host -u user -p`
- Or the provider's web interface

Run the SQL from `lib/db-init.sql` to create tables.

### 3. Redeploy on Vercel:
- Go to Deployments → Redeploy latest

---

## Quick Comparison:

| Provider | Free Tier | Limitations |
|----------|-----------|-------------|
| **FreeSQLDatabase.com** | ✅ 100% Free | 5MB storage, basic features |
| **db4free.net** | ✅ 100% Free | 200MB storage, some restrictions |
| **Aiven** | ⚠️ 1 month free | Then ~$9/month |
| **Render** | ✅ Free tier | May only have PostgreSQL |

**Recommendation:** Start with **FreeSQLDatabase.com** or **db4free.net** for a completely free solution.
