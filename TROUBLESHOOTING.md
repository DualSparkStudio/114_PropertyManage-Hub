# Troubleshooting GitHub Pages Deployment

## Common Issues and Solutions

### ❌ Red X on Commit (Build Failed)

If you see a red X next to your commit, the GitHub Actions workflow failed. Here's how to fix it:

#### 1. Check the Error Logs
- Click on the red X or go to the **Actions** tab
- Click on the failed workflow run
- Check the error message in the logs

#### 2. Common Issues

**Issue: "npm ci" fails**
- **Solution**: Make sure `package-lock.json` is committed to the repository
- Run `npm install` locally and commit the lock file

**Issue: "Build failed" or TypeScript errors**
- **Solution**: Run `npm run build` locally to check for errors
- Fix any TypeScript or build errors before pushing

**Issue: "Permission denied" or "pages: write" error**
- **Solution**: 
  1. Go to repository **Settings** → **Actions** → **General**
  2. Under "Workflow permissions", select "Read and write permissions"
  3. Save and re-run the workflow

**Issue: "No such file or directory: './out'"**
- **Solution**: The build didn't complete successfully
- Check the build step logs for errors

**Issue: GitHub Pages not enabled**
- **Solution**:
  1. Go to **Settings** → **Pages**
  2. Under "Source", select **GitHub Actions** (not "Deploy from a branch")
  3. Save settings

### 🔍 How to Debug

1. **Test Build Locally**:
   ```bash
   npm run build:gh-pages
   ```
   This should create an `out/` directory. If it fails, fix the errors.

2. **Check GitHub Actions Logs**:
   - Go to **Actions** tab
   - Click on the failed workflow
   - Expand each step to see detailed logs

3. **Verify Configuration**:
   - Ensure `next.config.mjs` has `output: 'export'`
   - Check that `package.json` has the `build:gh-pages` script
   - Verify `.github/workflows/deploy.yml` exists

### ✅ Quick Fixes

**If build fails due to missing dependencies:**
```bash
npm install
git add package-lock.json
git commit -m "Add package-lock.json"
git push
```

**If TypeScript errors:**
```bash
npm run lint
# Fix any errors shown
git add .
git commit -m "Fix TypeScript errors"
git push
```

**If workflow doesn't trigger:**
- Ensure you're pushing to `main` or `master` branch
- Check that `.github/workflows/deploy.yml` is in the repository
- Verify the workflow file syntax is correct

### 📝 Still Having Issues?

1. Check the exact error message in GitHub Actions
2. Try building locally: `npm run build:gh-pages`
3. Ensure all files are committed and pushed
4. Verify GitHub Pages is enabled in repository settings

