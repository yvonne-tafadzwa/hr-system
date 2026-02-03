# cPanel Deployment Guide for Human Resources System (Next.js)

## Prerequisites
- cPanel with **Node.js Selector** feature enabled
- SSH access (optional but recommended)
- Your domain pointed to cPanel

## Step 1: Build the Application Locally

Run this command in your project folder:
```bash
npm run build
```

## Step 2: Files to Upload

Upload the following files/folders to your cPanel public_html (or a subdomain folder):

```
├── .next/                 # Build output folder (REQUIRED)
├── node_modules/          # Dependencies (or run npm install on server)
├── public/                # Static assets
├── src/                   # Source files (needed for Next.js)
├── package.json           # Package manifest
├── package-lock.json      # Lock file
├── next.config.mjs        # Next.js configuration
├── .env.local             # Environment variables (IMPORTANT: rename to .env on server)
└── .htaccess              # Apache configuration
```

## Step 3: Set Up Node.js Application in cPanel

1. Log in to your cPanel
2. Find **"Setup Node.js App"** or **"Node.js Selector"**
3. Click **"Create Application"**
4. Configure:
   - **Node.js version**: 18.x or 20.x (LTS recommended)
   - **Application mode**: Production
   - **Application root**: Path to your uploaded files (e.g., `public_html` or `public_html/hrsy`)
   - **Application URL**: Your domain
   - **Application startup file**: `node_modules/next/dist/bin/next` 
   - **OR create a custom start script** (see below)

## Step 4: Create a Custom Start Script (Recommended)

Create a file called `server.js` in your project root:

```javascript
const { execSync } = require('child_process');
const path = require('path');

process.chdir(__dirname);
require('next/dist/bin/next');
```

Or simply use the npm start command through cPanel's NPM runner.

## Step 5: Install Dependencies on Server

In cPanel Node.js app interface, click "Run NPM Install" or via SSH:
```bash
cd ~/public_html  # or your app directory
npm install --production
```

## Step 6: Environment Variables

1. In cPanel Node.js app, add your environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `SMTP_HOST`
   - `SMTP_PORT`
   - `SMTP_USER`
   - `SMTP_PASS`
   - `SMTP_FROM`
   - `NODE_ENV=production`

2. Or rename `.env.local` to `.env` on the server

## Step 7: Start the Application

1. In cPanel Node.js interface, click **"Start App"**
2. Your app should now be running!

## Alternative: Using PM2 (if available)

If you have SSH access and PM2:
```bash
cd ~/public_html
npm install
npm run build
pm2 start npm --name "hrsy" -- start
pm2 save
```

## Troubleshooting

### App not starting?
- Check Node.js version (needs 18+)
- Check application logs in cPanel
- Verify all dependencies are installed

### 502/503 errors?
- The Node.js app might not be running
- Check if the port is correct in .htaccess
- Restart the Node.js application

### Static files not loading?
- Make sure `.next/static` folder was uploaded
- Check .htaccess is in the correct location

### Server Actions not working?
- Ensure the app is running as Node.js (not static export)
- Check SUPABASE_SERVICE_ROLE_KEY is set

## Important Notes

1. **Never expose** your `.env.local` or `.env` file publicly
2. **SSL/HTTPS** is recommended for production
3. **Keep backups** of your database and uploads
4. **Update dependencies** regularly for security patches
