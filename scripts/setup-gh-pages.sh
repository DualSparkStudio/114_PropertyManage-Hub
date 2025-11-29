#!/bin/bash

# Script to help set up GitHub Pages deployment

echo "🚀 Setting up GitHub Pages deployment..."

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git not initialized. Please run 'git init' first."
    exit 1
fi

# Check if remote exists
if ! git remote get-url origin &> /dev/null; then
    echo "⚠️  No remote repository found."
    echo "Please add your GitHub repository as remote:"
    echo "  git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git"
    exit 1
fi

echo "✅ Git repository found"
echo ""
echo "📋 Next steps:"
echo "1. Push your code to GitHub:"
echo "   git add ."
echo "   git commit -m 'Setup GitHub Pages'"
echo "   git push -u origin main"
echo ""
echo "2. Enable GitHub Pages in repository settings:"
echo "   - Go to Settings > Pages"
echo "   - Source: Select 'GitHub Actions'"
echo ""
echo "3. The deployment will start automatically on push!"
echo ""
echo "Your site will be available at:"
REPO_NAME=$(basename -s .git $(git remote get-url origin))
echo "   https://$(git config user.name).github.io/${REPO_NAME}/"

