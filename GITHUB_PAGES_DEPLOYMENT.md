# GitHub Pages Deployment Guide

This guide will help you deploy your PropertyManage Hub application to GitHub Pages.

## Prerequisites

1. A GitHub account
2. A GitHub repository (create one if you don't have it)
3. Node.js 18+ installed locally (for testing)

## Step 1: Prepare Your Repository

1. **Create a new repository** on GitHub (or use an existing one)
2. **Clone your repository** locally:
   ```bash
   git clone https://github.com/yourusername/your-repo-name.git
   cd your-repo-name
   ```

3. **Copy all your project files** into the repository directory

## Step 2: Configure GitHub Pages Settings

1. Go to your repository on GitHub
2. Click on **Settings** → **Pages**
3. Under **Source**, select:
   - **Source**: `GitHub Actions`
4. Save the settings

## Step 3: Push Your Code

1. **Add all files**:
   ```bash
   git add .
   ```

2. **Commit your changes**:
   ```bash
   git commit -m "Initial commit - PropertyManage Hub"
   ```

3. **Push to GitHub**:
   ```bash
   git push -u origin main
   ```
   (Use `master` if your default branch is `master`)

## Step 4: Automatic Deployment

Once you push to the `main` or `master` branch, GitHub Actions will automatically:

1. ✅ Install dependencies
2. ✅ Build the Next.js application for GitHub Pages
3. ✅ Deploy to GitHub Pages

You can monitor the deployment progress in the **Actions** tab of your repository.

## Step 5: Access Your Site

After deployment completes (usually 2-3 minutes), your site will be available at:

```
https://yourusername.github.io/your-repo-name/
```

**Note**: Replace `your-repo-name` with your actual repository name.

## Manual Build (Optional)

If you want to test the build locally before deploying:

```bash
# Install dependencies
npm install

# Build for GitHub Pages
npm run build:gh-pages

# The output will be in the 'out' directory
```

## Troubleshooting

### Issue: 404 errors on navigation
**Solution**: Make sure `trailingSlash: true` is set in `next.config.mjs` (already configured)

### Issue: Assets not loading
**Solution**: The base path is automatically configured. Make sure your repository name matches the `GITHUB_REPOSITORY_NAME` in the workflow.

### Issue: Build fails
**Solution**: 
- Check the Actions tab for error details
- Ensure Node.js version is 18+
- Verify all dependencies are in `package.json`

### Issue: Service Worker not working
**Solution**: Service Workers require HTTPS. GitHub Pages provides this automatically. If testing locally, use `localhost` (not `127.0.0.1`).

## Custom Domain (Optional)

To use a custom domain:

1. Add a `CNAME` file in the `public` folder with your domain:
   ```
   yourdomain.com
   ```

2. Update your DNS settings to point to GitHub Pages
3. GitHub will automatically configure HTTPS for your custom domain

## Repository Structure

After deployment, your repository should have:
```
your-repo/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions workflow
├── app/                         # Next.js app directory
├── components/                  # React components
├── public/                      # Static assets
│   ├── .nojekyll               # Prevents Jekyll processing
│   ├── prefetch.js             # Prefetch script
│   └── sw.js                   # Service Worker
├── next.config.mjs             # Next.js config
├── package.json                 # Dependencies
└── ...other files
```

## Updating Your Site

Simply push changes to the `main` or `master` branch:

```bash
git add .
git commit -m "Update site"
git push
```

GitHub Actions will automatically rebuild and redeploy your site.

## Performance Tips

- ✅ Static export is enabled for fast loading
- ✅ Images are optimized (unoptimized for static export)
- ✅ Code splitting is configured
- ✅ Service Worker caches pages for offline access
- ✅ Prefetching speeds up navigation

## Support

If you encounter any issues:
1. Check the GitHub Actions logs
2. Verify your `next.config.mjs` settings
3. Ensure all environment variables are set correctly

---

**Happy Deploying! 🚀**

