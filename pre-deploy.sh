#!/bin/bash

# Price Tracker - Pre-Deployment Checklist
# Run this before pushing to GitHub

echo "🔍 Pre-Deployment Checklist"
echo "============================"

# 1. Check for .env files
echo "Checking for exposed .env files..."
if git status | grep -E "\.env|\.env\." | grep -v "\.gitignore"; then
    echo "❌ ERROR: .env files found in git staging!"
    echo "   Run: git rm --cached .env"
    exit 1
else
    echo "✅ No .env files exposed"
fi

# 2. Check for node_modules
echo "Checking for node_modules in git..."
if git status | grep "node_modules"; then
    echo "❌ ERROR: node_modules in git staging!"
    echo "   Run: git rm -r --cached node_modules"
    exit 1
else
    echo "✅ node_modules not tracked"
fi

# 3. Check MongoDB URI
echo "Checking for hardcoded MongoDB URI..."
if grep -r "mongodb+srv" --exclude-dir=node_modules --exclude-dir=.git . | grep -v ".env"; then
    echo "⚠️  WARNING: MongoDB URI might be hardcoded"
fi

# 4. Check for console.logs (optional)
echo "Checking for excessive logging..."
LOG_COUNT=$(grep -r "console\.\(log\|debug\)" frontend/ backend/ | wc -l)
if [ $LOG_COUNT -gt 10 ]; then
    echo "⚠️  WARNING: Found $LOG_COUNT console.log statements"
fi

# 5. Check build
echo "Building frontend..."
cd frontend
npm run build > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Frontend builds successfully"
else
    echo "❌ Frontend build failed!"
    exit 1
fi
cd ..

echo ""
echo "✅ All checks passed! Ready to deploy"
echo ""
echo "Next steps:"
echo "1. git add ."
echo "2. git commit -m 'Ready for production deployment'"
echo "3. git push origin main"
echo ""
