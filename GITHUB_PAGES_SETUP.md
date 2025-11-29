# Quick GitHub Pages Setup

## ✅ What's Been Configured

1. **Next.js Static Export** - Configured for static site generation
2. **Base Path** - Automatically uses repository name
3. **GitHub Actions Workflow** - Automatic deployment on push
4. **Image Optimization** - Disabled for static export compatibility
5. **Dynamic Routes** - Pre-generated with `generateStaticParams`

## 🚀 Quick Start

### 1. Push to GitHub

```bash
git add .
git commit -m "Setup GitHub Pages"
git push origin main
```

### 2. Enable GitHub Pages

1. Go to your repository on GitHub
2. **Settings** → **Pages**
3. Under **Source**, select **GitHub Actions** (not "Deploy from a branch")
4. Save

### 3. Wait for Deployment

- Go to **Actions** tab to see deployment progress
- First deployment takes ~2-3 minutes
- Your site will be live at: `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`

## 📝 Important Notes

- **Repository Name**: The base path is automatically set from your repository name
- **Branch**: Deployment triggers on push to `main` or `master` branch
- **Build Output**: Static files are generated in the `out/` directory
- **Images**: External images work, but Next.js Image optimization is disabled

## 🔧 Manual Build (for testing)

```bash
# Build for GitHub Pages
npm run build:gh-pages

# Test locally
npx serve out
```

## 🐛 Troubleshooting

### Build fails
- Check Actions tab for error logs
- Ensure all dependencies are installed
- Verify Node.js 18+ is used

### 404 errors
- Ensure trailing slashes are enabled (already configured)
- Check base path matches repository name

### Images not loading
- Images are unoptimized for static export
- External URLs should work fine

## 📚 More Details

See [DEPLOYMENT.md](./DEPLOYMENT.md) for comprehensive deployment guide.

