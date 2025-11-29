# GitHub Pages Deployment Guide

This guide will help you deploy PropertyManage Hub to GitHub Pages.

## Prerequisites

- A GitHub account
- Git installed on your local machine
- Node.js 18+ installed

## Deployment Steps

### 1. Create a GitHub Repository

1. Go to [GitHub](https://github.com) and create a new repository
2. Name it (e.g., `propertymanage-hub`)
3. **Do NOT** initialize with README, .gitignore, or license (if the repo already exists, that's fine)

### 2. Push Your Code to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit"

# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push to main branch
git branch -M main
git push -u origin main
```

### 3. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click on **Settings** tab
3. Scroll down to **Pages** section (in the left sidebar)
4. Under **Source**, select **GitHub Actions** (not "Deploy from a branch")
5. Save the settings

### 4. Configure Repository Name (if needed)

If your repository name is different from `114_PropertyManage-Hub`, update the environment variable in `.github/workflows/deploy.yml`:

```yaml
GITHUB_REPOSITORY_NAME: ${{ github.event.repository.name }}
```

This is already configured to use the repository name automatically, so you shouldn't need to change it.

### 5. Trigger Deployment

1. The GitHub Actions workflow will automatically run when you push to the `main` branch
2. You can also manually trigger it:
   - Go to **Actions** tab in your repository
   - Select **Deploy to GitHub Pages** workflow
   - Click **Run workflow**

### 6. Access Your Site

Once deployment is complete:
- Your site will be available at: `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`
- The deployment status can be checked in the **Actions** tab

## Local Testing

To test the GitHub Pages build locally:

```bash
# Build for GitHub Pages
npm run build:gh-pages

# The static files will be in the `out` directory
# You can serve them with any static file server:
npx serve out
```

## Important Notes

1. **Base Path**: The app automatically configures the base path based on your repository name
2. **Static Export**: The app is configured for static export, so all pages are pre-rendered
3. **Images**: Images are unoptimized for static export compatibility
4. **Routing**: All routes work correctly with the base path configuration

## Troubleshooting

### Build Fails
- Check the **Actions** tab for error messages
- Ensure all dependencies are in `package.json`
- Verify Node.js version is 18+

### 404 Errors
- Ensure `trailingSlash: true` is set in `next.config.mjs` (already configured)
- Check that the base path matches your repository name

### Images Not Loading
- Images are set to `unoptimized: true` for static export
- External images from Unsplash should work fine

## Custom Domain (Optional)

If you want to use a custom domain:

1. Add a `CNAME` file in the `public` folder with your domain
2. Update DNS settings as per GitHub Pages documentation
3. The base path will automatically adjust

## Updating the Site

Simply push changes to the `main` branch, and GitHub Actions will automatically rebuild and deploy:

```bash
git add .
git commit -m "Update site"
git push origin main
```

