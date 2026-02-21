# Vercel Blob Storage Setup Guide

## Problem
Vercel's serverless functions are read-only and cannot write files to the filesystem. This causes image uploads to fail with a 500 error.

## Solution
Use Vercel Blob Storage to store uploaded images.

## Setup Steps

### 1. Add Vercel Blob to Your Project

The code has been updated to use `@vercel/blob`. You need to:

1. **Install the package locally** (optional, for local development):
   ```bash
   npm install @vercel/blob
   ```

2. **Add Vercel Blob to your Vercel project**:
   - Go to your Vercel project dashboard
   - Click **Storage** tab (or go to Settings → Storage)
   - Click **Create Database** or **Browse Storage**
   - Select **Blob** (Fast object storage)
   - Click **Create**
   - This will automatically add the `BLOB_READ_WRITE_TOKEN` environment variable

### 2. Environment Variable

Vercel Blob automatically sets the `BLOB_READ_WRITE_TOKEN` environment variable when you create a Blob store. You don't need to manually add it.

### 3. Redeploy

After adding Blob storage:
1. Go to **Deployments** in Vercel
2. Click the three dots on the latest deployment
3. Select **Redeploy**

Or push a new commit to trigger a new deployment.

## How It Works

- Images are now uploaded to Vercel Blob Storage instead of the filesystem
- Images are publicly accessible via CDN URLs
- No filesystem writes needed
- Works perfectly on Vercel's serverless platform

## Testing

After redeploying:
1. Go to your admin dashboard
2. Try uploading an image
3. It should work without errors!

## Pricing

Vercel Blob has a generous free tier:
- 1 GB storage
- 100 GB bandwidth per month
- Perfect for most small to medium projects

## Troubleshooting

If uploads still fail:
1. Make sure Blob storage is created in your Vercel project
2. Check that `BLOB_READ_WRITE_TOKEN` is set (should be automatic)
3. Redeploy your application
4. Check Vercel logs for any errors
