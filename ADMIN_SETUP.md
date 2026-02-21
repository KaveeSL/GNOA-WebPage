# Admin Panel Setup Guide

## Database Setup

1. **Install MySQL** (if not already installed)

2. **Create the database and tables:**
   ```bash
   # If you have a MySQL password:
   mysql -u root -p < lib/db-init.sql
   
   # If you DON'T have a MySQL password:
   mysql -u root < lib/db-init.sql
   ```
   Or manually run the SQL file in your MySQL client.

3. **Environment Variables:**
   Create a `.env.local` file in the root directory with:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=gnoaweb
   JWT_SECRET=your-secret-key-change-in-production
   ```
   
   **Note:** If you don't have a MySQL password, leave `DB_PASSWORD` empty (as shown above) or omit the line entirely.

## Admin Login Credentials

- **Username:** `gnoaadmin`
- **Password:** `000`

## Accessing the Admin Panel

1. Navigate to: `http://localhost:3000/admin/login` (or `/admin` which redirects to `/admin/login`)
2. Login with the credentials above
3. You'll be redirected to `/admin/dashboard`

## Features

### Photo Cards Management
- Add new photo cards with:
  - Image URL
  - Title
  - Description
  - Category (optional)
  - Display order

### Videos Management
- Add new YouTube videos with:
  - YouTube Video ID (extract from URL)
  - Title
  - Description (optional)
  - Display order

## Troubleshooting

If you encounter "Internal server error":

1. **Check MySQL is running:**
   ```bash
   # macOS
   brew services list
   # or
   mysql.server status
   
   # Linux
   sudo systemctl status mysql
   ```

2. **Verify database exists:**
   ```bash
   # If you have a password:
   mysql -u root -p -e "SHOW DATABASES LIKE 'gnoaweb';"
   
   # If you don't have a password:
   mysql -u root -e "SHOW DATABASES LIKE 'gnoaweb';"
   ```

3. **Verify tables exist:**
   ```bash
   # If you have a password:
   mysql -u root -p gnoaweb -e "SHOW TABLES;"
   
   # If you don't have a password:
   mysql -u root gnoaweb -e "SHOW TABLES;"
   ```
   Should show: `admin_users`, `photo_cards`, `videos`

4. **Check environment variables:**
   - Ensure `.env.local` file exists in the root directory
   - Verify all variables are set correctly
   - Restart the Next.js dev server after creating/updating `.env.local`

5. **Test database connection:**
   ```bash
   node lib/test-db.js
   ```

6. **Check server logs:**
   - Look at the terminal where `npm run dev` is running
   - Check for specific error messages

## Notes

- The admin panel is only accessible via the `/admin/login` URL (or `/admin` which redirects to `/admin/login`)
- All API routes are protected with authentication
- Photo cards and videos are fetched from the database and displayed on the main website
- Changes made in the admin panel will immediately reflect on the website
- In development mode, error messages will include more details