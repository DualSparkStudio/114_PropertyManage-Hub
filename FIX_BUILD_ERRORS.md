# Fix GitHub Pages Build Errors

## Quick Fix

The build is now configured to work directly on Linux (GitHub Actions). The workflow has been updated to:

1. ✅ Use direct environment variables (no cross-env needed on Linux)
2. ✅ Verify build output exists before uploading
3. ✅ Better error messages for debugging

## What Changed

### Updated Workflow (`.github/workflows/deploy.yml`)
- Removed dependency on `cross-env` for the build step
- Added build verification step
- Added better logging

### Build Command
The workflow now uses:
```bash
NODE_ENV=production GITHUB_PAGES=true next build
```

Instead of:
```bash
npm run build:gh-pages
```

This works better on Linux (GitHub Actions) and avoids cross-platform issues.

## If Build Still Fails

### 1. Check for TypeScript Errors
Run locally:
```bash
npm run build
```

Fix any TypeScript errors before pushing.

### 2. Check for Missing Dependencies
Ensure `package-lock.json` is committed:
```bash
npm install
git add package-lock.json
git commit -m "Add package-lock.json"
git push
```

### 3. Verify Next.js Config
Make sure `next.config.mjs` has:
- `output: 'export'` ✅
- `trailingSlash: true` ✅
- `images: { unoptimized: true }` ✅

### 4. Check GitHub Actions Logs
1. Go to **Actions** tab
2. Click on the failed workflow
3. Expand the "Build with Next.js" step
4. Look for specific error messages

## Common Build Errors

### Error: "Cannot find module"
**Solution**: Run `npm install` and commit `package-lock.json`

### Error: TypeScript errors
**Solution**: Fix TypeScript errors locally first:
```bash
npm run lint
```

### Error: "out directory not found"
**Solution**: The build didn't complete. Check the build logs for errors.

### Error: Webpack/Module errors
**Solution**: Check if all imports are correct and dependencies are installed.

## Test Build Locally

Before pushing, test the build:
```bash
# Set environment variables (Windows)
set NODE_ENV=production
set GITHUB_PAGES=true
set GITHUB_REPOSITORY_NAME=114_PropertyManage-Hub
npm run build

# Or use the script (requires cross-env)
npm run build:gh-pages
```

The `out` directory should be created with all static files.

## Next Steps

1. **Commit the updated workflow**:
   ```bash
   git add .github/workflows/deploy.yml
   git commit -m "Fix GitHub Pages build workflow"
   git push
   ```

2. **Monitor the Actions tab** - The build should now succeed

3. **If it still fails**, check the Actions logs for the specific error and share it for further debugging.

